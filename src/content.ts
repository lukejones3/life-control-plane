import { privateSnapshot } from "./generated/privateSnapshot";

export type ContentIdeaStage = "captured" | "researching" | "outlined" | "ready" | "published";
export type ReturnPost = {
  id?:string;
  label:string;
  views:number;
  likes:number|null;
  comments?:number|null;
  shares?:number|null;
  note:string;
  observedAt?:string;
  url?:string;
};
export type ContentDashboard = {
  totals:{followers:number|null;lifetimeLikes:number|null;creatorRevenue:number|null;millionViewPosts:number|null};
  accounts:Array<{id:string;platform:string;name:string;status:string;metric:string;metricLabel:string;detail:string;accent?:string}>;
  returnPosts:ReturnPost[];
  insights:Array<{title:string;detail:string}>;
  formats:Array<{name:string;signal:string;description:string}>;
  ideas:Array<{id:string;title:string;pillar:string;form:string;stage:ContentIdeaStage;premise:string;sources:string[]}>;
  observedAt?:string;
  providers?:Record<string,ProviderState>;
};
export type ProviderState={
  provider:string;status:string;configured:boolean;connected?:boolean;displayName?:string|null;
  lastSyncAt?:string|null;lastError?:string|null;redirectUri?:string;
  authorizationMode?:string;
};
export type ContentOverlay={
  manual?:{totals?:Partial<ContentDashboard["totals"]>;returnPosts?:ReturnPost[];observedAt?:string}|null;
  manualUpdatedAt?:string|null;
  providers?:Record<string,ProviderState>;
  youtube?:{observedAt?:string;channel?:Record<string,unknown>;videos?:Array<Record<string,unknown>>;analytics?:Record<string,unknown>;daily?:Record<string,unknown>}|null;
  tiktok?:{observedAt?:string;profile?:Record<string,unknown>;videos?:Array<Record<string,unknown>>}|null;
};
export type RecruiterBoard<T=Record<string,unknown>>={
  state:Record<string,T>;
  links:Record<string,string>;
  updatedAt?:string|null;
};

const platformAuth=String(import.meta.env.VITE_PLATFORM_AUTH||"")==="true";
const apiBase=String(import.meta.env.VITE_CONTENT_API_URL||(platformAuth?"https://api.datahiringiq.com/life/api/control-plane":"")).replace(/\/$/,"");
const snapshot=privateSnapshot.content as unknown as ContentDashboard;
const tokenKey="lcp-private-content-token-v1";
const manualKey="lcp-content-metrics-v2";

const compact=(value:number)=>new Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:1}).format(value);
const numberValue=(value:unknown):number|null=>typeof value==="number"&&Number.isFinite(value)?value:typeof value==="string"&&value!==""&&Number.isFinite(Number(value))?Number(value):null;

function reportRows(report?:Record<string,unknown>):Array<Record<string,string|number>>{
  const headers=Array.isArray(report?.columnHeaders)?report.columnHeaders as Array<{name?:string}>:[];
  const rows=Array.isArray(report?.rows)?report.rows as Array<unknown[]>:[];
  return rows.map(row=>Object.fromEntries(headers.map((header,index)=>[String(header.name||index),row[index] as string|number])));
}

function localManual():ContentOverlay["manual"]{
  try{return JSON.parse(localStorage.getItem(manualKey)||"null") as ContentOverlay["manual"]}catch{return null}
}

function mergeDashboard(base:ContentDashboard,overlay?:ContentOverlay|null):ContentDashboard{
  const manual=overlay?.manual||localManual();
  let next:ContentDashboard={
    ...base,
    totals:{...base.totals,...(manual?.totals||{})},
    returnPosts:manual?.returnPosts?.length?manual.returnPosts:base.returnPosts,
    observedAt:manual?.observedAt||overlay?.manualUpdatedAt||base.observedAt,
    providers:overlay?.providers||base.providers,
  };
  const profile=overlay?.tiktok?.profile;
  if(profile){
    const followers=numberValue(profile.follower_count);
    const likes=numberValue(profile.likes_count);
    next={...next,totals:{...next.totals,followers:followers??next.totals.followers,lifetimeLikes:likes??next.totals.lifetimeLikes}};
    next.accounts=next.accounts.map(account=>account.id==="echoes-tiktok"?{
      ...account,status:"healthy",metric:followers==null?account.metric:compact(followers),metricLabel:"followers · live",
      detail:`TikTok Display API · synced ${overlay?.tiktok?.observedAt?new Date(overlay.tiktok.observedAt).toLocaleString():"recently"}`,
    }:account);
    const videos=(overlay?.tiktok?.videos||[]).slice().sort((a,b)=>Number(b.create_time||0)-Number(a.create_time||0));
    if(videos.length){next.returnPosts=videos.slice(0,12).map((video,index)=>({
      id:String(video.id||index),label:String(video.title||video.video_description||`TikTok ${String(index+1).padStart(2,"0")}`).slice(0,80),
      views:numberValue(video.view_count)||0,likes:numberValue(video.like_count),comments:numberValue(video.comment_count),shares:numberValue(video.share_count),
      note:video.create_time?new Date(Number(video.create_time)*1000).toLocaleDateString():"Live TikTok record",url:typeof video.share_url==="string"?video.share_url:undefined,
      observedAt:overlay?.tiktok?.observedAt,
    }))}
  }
  const channel=overlay?.youtube?.channel as {snippet?:{title?:string};statistics?:{subscriberCount?:string;viewCount?:string;videoCount?:string}}|undefined;
  if(channel){
    const subscribers=numberValue(channel.statistics?.subscriberCount);
    next.accounts=next.accounts.map(account=>account.id==="echoes-youtube"?{
      ...account,status:"healthy",name:channel.snippet?.title||account.name,metric:subscribers==null?account.metric:compact(subscribers),metricLabel:"subscribers · live",
      detail:`Owner Analytics connected · ${compact(numberValue(channel.statistics?.viewCount)||0)} channel views · ${channel.statistics?.videoCount||"—"} videos`,
    }:account);
    const lifetime=reportRows(overlay?.youtube?.analytics)[0];
    if(lifetime){
      const watchMinutes=numberValue(lifetime.estimatedMinutesWatched)||0;
      const gained=numberValue(lifetime.subscribersGained)||0;
      const lost=numberValue(lifetime.subscribersLost)||0;
      next.insights=[{
        title:"YouTube owner analytics is live",
        detail:`${compact(numberValue(lifetime.views)||0)} views · ${compact(Math.round(watchMinutes/60))} watch hours · ${Math.floor((numberValue(lifetime.averageViewDuration)||0)/60)}:${String(Math.round((numberValue(lifetime.averageViewDuration)||0)%60)).padStart(2,"0")} average view · ${(numberValue(lifetime.averageViewPercentage)||0).toFixed(1)}% average watched · ${gained-lost>=0?"+":""}${gained-lost} net subscribers.`,
      },...next.insights.filter(insight=>insight.title!=="YouTube owner analytics is live"&&insight.title!=="YouTube 30-day velocity")];
    }
    const daily=reportRows(overlay?.youtube?.daily);
    if(daily.length>=31){
      const recent=daily.slice(-30).reduce((sum,row)=>sum+(numberValue(row.views)||0),0);
      const prior=daily.slice(-60,-30).reduce((sum,row)=>sum+(numberValue(row.views)||0),0);
      const change=prior?((recent-prior)/prior)*100:null;
      next.insights.splice(1,0,{
        title:"YouTube 30-day velocity",
        detail:`${compact(recent)} views in the latest 30 complete days${prior?` versus ${compact(prior)} in the prior 30 · ${change!>=0?"+":""}${change!.toFixed(1)}%`:""}. Refreshed from owner analytics, not a public counter.`,
      });
    }
  }
  return next;
}

async function api<T>(path:string,options:RequestInit={}):Promise<T>{
  if(!apiBase)throw new Error("Private connector is not configured for this build.");
  const token=localStorage.getItem(tokenKey);
  const response=await fetch(`${apiBase}${path}`,{
    ...options,cache:"no-store",headers:{Accept:"application/json","Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{}) ,...options.headers},
  });
  const text=await response.text();
  let body:unknown={};try{body=text?JSON.parse(text):{}}catch{body={detail:text}}
  if(!response.ok){const detail=body&&typeof body==="object"&&"detail" in body?String((body as {detail:unknown}).detail):`Connector returned ${response.status}`;throw new Error(detail)}
  return body as T;
}

export const contentRepository={
  mode:apiBase?"private-api":"private-snapshot" as "private-api"|"private-snapshot",
  isUnlocked(){return Boolean(localStorage.getItem(tokenKey))},
  clearToken(){localStorage.removeItem(tokenKey)},
  async login(password:string){const result=await api<{token:string}>("/login",{method:"POST",body:JSON.stringify({password})});localStorage.setItem(tokenKey,result.token);return result},
  async getOverlay(){return api<ContentOverlay>("/content/dashboard")},
  async getDashboard():Promise<ContentDashboard>{
    if(!apiBase||!this.isUnlocked())return mergeDashboard(snapshot);
    try{return mergeDashboard(snapshot,await this.getOverlay())}catch(problem){if(problem instanceof Error&&/expired|locked/i.test(problem.message))this.clearToken();throw problem}
  },
  getLocalDashboard(){return mergeDashboard(snapshot)},
  async saveManual(manual:NonNullable<ContentOverlay["manual"]>){
    const value={...manual,observedAt:manual.observedAt||new Date().toISOString()};localStorage.setItem(manualKey,JSON.stringify(value));
    if(apiBase&&this.isUnlocked()){await api("/content/manual",{method:"PUT",body:JSON.stringify(value)});return mergeDashboard(snapshot,await this.getOverlay())}
    return mergeDashboard(snapshot,{manual:value});
  },
  async configure(provider:"youtube"|"tiktok",client_id:string,client_secret:string){return api(`/content/${provider}/config`,{method:"PUT",body:JSON.stringify({client_id,client_secret})})},
  async authorize(provider:"youtube"|"tiktok"){
    const result=await api<{url:string}>(`/content/${provider}/authorize?return_url=${encodeURIComponent(window.location.href)}`);window.location.assign(result.url);
  },
  async sync(provider:"youtube"|"tiktok"){return api(`/content/${provider}/sync`,{method:"POST"})},
  async getBuildOverlay(){return api<{provider:ProviderState;build?:Record<string,unknown>|null}>("/build/dashboard")},
  async configureGitHub(token:string){return api("/build/github/config",{method:"PUT",body:JSON.stringify({token})})},
  async syncGitHub(){return api("/build/github/sync",{method:"POST"})},
  async getRecruiterBoard<T=Record<string,unknown>>(){return api<RecruiterBoard<T>>("/recruiter/dashboard")},
  async saveRecruiterBoard<T=Record<string,unknown>>(state:Record<string,T>,links:Record<string,string>){
    return api<{ok:boolean;updatedAt:string}>("/recruiter/dashboard",{method:"PUT",body:JSON.stringify({state,links})});
  },
};
