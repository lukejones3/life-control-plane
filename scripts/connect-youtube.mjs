import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";

const input=process.argv[2]||process.env.GOOGLE_OAUTH_CLIENT_FILE;
if(!input){console.error("Usage: npm run connect:youtube -- /path/to/client_secret.json");process.exit(1)}
const source=JSON.parse(await readFile(input,"utf8"));
const config=source.installed||source.web;
if(!config?.client_id||!config?.client_secret)throw new Error(`${basename(input)} is not a Google OAuth client file`);
const port=53682;
const redirectUri=`http://localhost:${port}`;
const state=randomBytes(24).toString("hex");
const scopes=["https://www.googleapis.com/auth/youtube.readonly","https://www.googleapis.com/auth/yt-analytics.readonly"];
let settle;
const callback=new Promise((resolve,reject)=>{settle={resolve,reject}});
const server=createServer((request,response)=>{const url=new URL(request.url||"/",redirectUri);if(url.pathname!=="/"||url.searchParams.get("state")!==state){response.writeHead(400);response.end("OAuth state did not match.");return}const code=url.searchParams.get("code");const error=url.searchParams.get("error");response.writeHead(code?200:400,{"Content-Type":"text/html; charset=utf-8"});response.end(code?"<h1>YouTube connected.</h1><p>You can close this tab and return to the Control Plane.</p>":`<h1>Connection failed</h1><p>${error||"No code returned"}</p>`);code?settle.resolve(code):settle.reject(new Error(error||"Google returned no authorization code"))});
await new Promise((resolve,reject)=>server.listen(port,"127.0.0.1",error=>error?reject(error):resolve()));
const auth=new URL("https://accounts.google.com/o/oauth2/v2/auth");
// Keep this authorization isolated from any older grants attached to the same
// Google OAuth client (for example Drive). YouTube rejects some inherited scope
// combinations even though each scope is independently valid.
for(const [key,value] of Object.entries({client_id:config.client_id,redirect_uri:redirectUri,response_type:"code",access_type:"offline",prompt:"consent",include_granted_scopes:"false",scope:scopes.join(" "),state}))auth.searchParams.set(key,value);
console.log("Opening Google authorization in your browser…");
spawn("open",[auth.toString()],{stdio:"ignore",detached:true}).unref();
let code;try{code=await callback}finally{server.close()}
const tokenResponse=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:config.client_id,client_secret:config.client_secret,code,grant_type:"authorization_code",redirect_uri:redirectUri})});
const token=await tokenResponse.json();if(!tokenResponse.ok)throw new Error(token.error_description||token.error||"Google token exchange failed");if(!token.refresh_token)throw new Error("Google did not return an offline refresh token; revoke the old grant and run again.");
const target=process.env.LCP_CONNECTOR_SSH||"human-repo-devbox";
const remote=spawn("ssh",[target,"cd /opt/human-repo-cloud/bridge && /opt/human-repo-cloud/.venv/bin/python configure_youtube_connector.py"],{stdio:["pipe","inherit","inherit"]});
remote.stdin.end(JSON.stringify({client_id:config.client_id,client_secret:config.client_secret,client_type:source.installed?"installed":"web",refresh_token:token.refresh_token,scopes:String(token.scope||"").split(" ").filter(Boolean)}));
const exitCode=await new Promise(resolve=>remote.on("exit",resolve));if(exitCode!==0)throw new Error("The encrypted connector saved the YouTube grant, but its initial API sync did not finish. Resolve the provider error above, then use Sync now; authorization does not need to be repeated.");
