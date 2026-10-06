import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, extname, join } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const githubRoot = process.env.LCP_PROJECT_ROOT || join(homedir(), "github");
const humanRepoRoot = process.env.HUMAN_REPO_ROOT || join(homedir(), "human-repo");
const privateDataPath = process.env.LCP_PRIVATE_DATA_FILE || join(homedir(), ".config", "life-control-plane", "private-data.mjs");
const outputPath = join(projectRoot, "src", "generated", "privateSnapshot.ts");

const projects = [
  { id:"wyloc", name:"Wyloc", family:"Agent infrastructure", root:join(githubRoot,"wyloc"), repository:"https://github.com/lukejones3/wyloc", stage:"Hardening", summary:"An encrypted memory and policy layer that moves durable context outside the model.", next:"Finish the hardening plan, integrate product-history memory, and turn proofs into company-specific demos.", color:"#72dfd0" },
  { id:"lander-data", name:"Lander data platform", family:"Lander", root:join(githubRoot,"job-market-analytics"), repository:"https://github.com/lukejones3/job-market-analytics", stage:"Production", summary:"The ingestion, warehouse, classification, matching, and orchestration system behind Lander.", next:"Complete source recovery work, expand high-quality coverage, and keep the nightly system observable.", color:"#79b8ff" },
  { id:"lander-product", name:"Lander product", family:"Lander", root:join(githubRoot,"lander"), repository:"https://github.com/lukejones3/lander", stage:"Production", summary:"The job intelligence product, resume matcher, recruiter search, outreach workflow, and mobile surface.", next:"Finish mobile Career Agent workflows and make saved, applied, and recruiter state durable everywhere.", color:"#6da6ff" },
  { id:"human-repo", name:"Human Repo", family:"Personal intelligence", root:humanRepoRoot, repository:null, stage:"Private production", summary:"A private multisource life record with deterministic memory authority, state geometry, and provenance.", next:"Keep daily ingestion continuous and measure whether memory routing improves real conversations and work.", color:"#c4a7ff" },
  { id:"life-control-plane", name:"Life Control Plane", family:"Personal intelligence", root:join(githubRoot,"life-control-plane"), repository:"https://github.com/lukejones3/life-control-plane", stage:"Private operating system", summary:"The action layer over career, money, movement, relationships, vehicles, content, and owned systems.", next:"Replace the remaining demo planes with real state, connectors, and executable workflows.", color:"#f59eac" },
  { id:"life-topology-lab", name:"Life Topology Lab", family:"Personal intelligence", root:join(githubRoot,"life-topology-lab"), repository:"https://github.com/lukejones3/life-topology-lab", stage:"Research shipped", summary:"Privacy-preserving topology, regime, state, and longitudinal validation over the Human Repo.", next:"Keep the research reproducible as the daily record grows and new state geometry appears.", color:"#b89cff" },
  { id:"portfolio", name:"Evidence portfolio", family:"Distribution", root:join(githubRoot,"luke-jones-portfolio"), repository:"https://github.com/lukejones3/luke-jones-portfolio", stage:"Live", summary:"A direct, evidence-first account of production data, AI systems, products, and research.", next:"Keep the proof current and route recruiter and founder outreach through it.", color:"#f6c86b" },
  { id:"wyloc-demo", name:"Wyloc demo", family:"Agent infrastructure", root:join(githubRoot,"wyloc-demo"), repository:"https://github.com/lukejones3/wyloc-demo", stage:"Sales surface", summary:"A public proof surface for Wyloc's encrypted policy and memory behavior.", next:"Build account-specific demonstrations from real prospect workflows.", color:"#58c9bb" },
  { id:"wyloc-site", name:"Wyloc site", family:"Agent infrastructure", root:join(githubRoot,"wyloc-site"), repository:"https://github.com/lukejones3/wyloc-site", stage:"Live", summary:"The product narrative and conversion surface for Wyloc.", next:"Connect outreach, demos, and proof into one legible path.", color:"#4eb7a9" },
];

const sourceExtensions = new Set([".py",".sql",".ts",".tsx",".js",".jsx",".mjs",".css",".scss",".html",".sh",".go",".rs",".java",".yml",".yaml"]);
function git(root,args,fallback="") { try { return execFileSync("git",["-C",root,...args],{encoding:"utf8",stdio:["ignore","pipe","ignore"],maxBuffer:20*1024*1024}).trim(); } catch { return fallback; } }
function countLines(root) {
  const files=git(root,["ls-files","-z"]).split("\0").filter(Boolean).filter(file=>sourceExtensions.has(extname(file).toLowerCase()));
  let lines=0,countedFiles=0;
  for(const file of files){try{const source=readFileSync(join(root,file),"utf8");if(source.includes("\0"))continue;lines+=source===""?0:source.split("\n").length;countedFiles+=1;}catch{/* active worktree changed between list and read */}}
  return {lines,files:countedFiles};
}
function normalizeRemote(value){const sshPrefix=["git","github.com:"].join("@");if(!value)return null;if(value.startsWith(sshPrefix))return `https://github.com/${value.slice(sshPrefix.length).replace(/\.git$/,"")}`;return value.replace(/\.git$/,"");}
function inspectProject(project){
  if(!existsSync(join(project.root,".git")))return {...project,available:false,branch:null,commits7d:0,commits30d:0,changedFiles:0,sourceLines:0,sourceFiles:0,lastCommitAt:null,lastCommitMessage:null};
  const lineStats=countLines(project.root);const remote=normalizeRemote(git(project.root,["remote","get-url","origin"]));
  return {...project,available:true,branch:git(project.root,["branch","--show-current"],"detached"),commits7d:Number(git(project.root,["rev-list","--count","--since=7 days ago","HEAD"],"0")),commits30d:Number(git(project.root,["rev-list","--count","--since=30 days ago","HEAD"],"0")),changedFiles:git(project.root,["status","--porcelain"]).split("\n").filter(Boolean).length,sourceLines:lineStats.lines,sourceFiles:lineStats.files,lastCommitAt:git(project.root,["log","-1","--format=%cI"])||null,lastCommitMessage:git(project.root,["log","-1","--format=%s"])||null,repository:project.repository||remote};
}

const inspected=projects.map(inspectProject);const commits=[];const daily=new Map();
for(const project of projects){if(!existsSync(join(project.root,".git")))continue;for(const row of git(project.root,["log","--since=364 days ago","--format=%H%x09%cI%x09%s"]).split("\n").filter(Boolean)){const [sha,timestamp,...message]=row.split("\t");const date=timestamp?.slice(0,10);if(!sha||!date)continue;daily.set(date,(daily.get(date)||0)+1);commits.push({projectId:project.id,projectName:project.name,sha:sha.slice(0,7),timestamp,message:message.join("\t")});}}
const today=new Date();today.setHours(12,0,0,0);const start=new Date(today);start.setDate(start.getDate()-363);const contributionDays=[];
for(let cursor=new Date(start);cursor<=today;cursor.setDate(cursor.getDate()+1)){const date=cursor.toISOString().slice(0,10);const count=daily.get(date)||0;contributionDays.push({date,count,level:count===0?0:count===1?1:count<=3?2:count<=6?3:4});}

let content;
if(existsSync(privateDataPath)){const imported=await import(`${pathToFileURL(privateDataPath).href}?v=${Date.now()}`);content=imported.contentSnapshot;}
else content={accounts:[{id:"short-form",platform:"TikTok",name:"Private creator account",status:"snapshot",metric:"Private",metricLabel:"audience",detail:"Generate a private snapshot locally to view account analytics."},{id:"youtube",platform:"YouTube",name:"Private creator account",status:"connect",metric:"—",metricLabel:"not connected",detail:"Owner OAuth can provide channel and video analytics."},{id:"channel-three",platform:"YouTube",name:"Channel 03 · Unnamed",status:"prelaunch",metric:"0",metricLabel:"published",detail:"A research-led channel for systems and unresolved questions."}],returnPosts:[],ideas:[],insights:[],formats:[],totals:{followers:null,lifetimeLikes:null,creatorRevenue:null,millionViewPosts:null}};

const build={generatedAt:new Date().toISOString(),totals:{commits7d:inspected.reduce((sum,p)=>sum+p.commits7d,0),commits30d:inspected.reduce((sum,p)=>sum+p.commits30d,0),changedFiles:inspected.reduce((sum,p)=>sum+p.changedFiles,0),sourceLines:inspected.reduce((sum,p)=>sum+p.sourceLines,0),activeProjects:inspected.filter(p=>p.commits30d>0).length},projects:inspected.map(({root:_root,...project})=>project),contributionDays,recentCommits:commits.sort((a,b)=>b.timestamp.localeCompare(a.timestamp)).slice(0,28),relationships:[{from:"human-repo",to:"life-control-plane",label:"memory + state"},{from:"human-repo",to:"wyloc",label:"proven architecture"},{from:"wyloc",to:"wyloc-demo",label:"proof"},{from:"wyloc",to:"wyloc-site",label:"distribution"},{from:"lander-data",to:"lander-product",label:"job intelligence"},{from:"lander-product",to:"life-control-plane",label:"career actions"},{from:"portfolio",to:"lander-product",label:"evidence"},{from:"life-topology-lab",to:"human-repo",label:"validated geometry"}]};
mkdirSync(dirname(outputPath),{recursive:true});writeFileSync(outputPath,`// Generated locally. Never commit this file.\nexport const privateSnapshot = ${JSON.stringify({build,content},null,2)} as const;\n`);console.log(`Generated private Control Plane snapshot: ${outputPath}`);
