import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive, BriefcaseBusiness, CalendarClock, Check, ChevronRight, Copy,
  Cloud, Download, ExternalLink, FileUp, LockKeyhole, Mail, MessageSquare,
  PhoneCall, RefreshCw, Search, Send, Sparkles, Target, Trophy,
} from "lucide-react";
import { recruiters, Recruiter, RecruiterStatus } from "./recruiterData";
import { contentRepository } from "./content";

type ReplyTone = "positive" | "neutral" | "decline";
type ContactRoute = "unknown" | "free-message" | "connection-only" | "direct-email";
type State = {
  status: RecruiterStatus;
  route: ContactRoute;
  draft: string;
  connectionDraft: string;
  followUpDraft: string;
  lastContact: string;
  follow1: string;
  follow2: string;
  reply?: ReplyTone;
  notes: string;
};

const STORAGE_KEY="recruiter-sprint-state";
const LINKS_KEY="recruiter-packet-links";
const RECOVERY_KEY="recruiter-sprint-recovery-2026-08-09-v1";
const DRAFT_REFRESH_KEY="recruiter-sprint-drafts-2026-08-11-v2";
const statusOrder:RecruiterStatus[]=["ready","approved","contacted","replied","call booked","submitted","interview","offer","inactive"];
const activeStatuses:RecruiterStatus[]=["contacted","replied","call booked","submitted","interview","offer"];
const recoveredSubmittedIds=[67,88,99,100];
const addBusinessDays=(iso:string,days:number)=>{const d=new Date(`${iso}T12:00:00`);for(let i=0;i<days;){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)i++}return d.toISOString().slice(0,10)};
const today=()=>new Date().toISOString().slice(0,10);
const defaults=(r:Recruiter):State=>({status:"ready",route:r.email?"direct-email":"unknown",draft:r.initialDraft,connectionDraft:r.connectionDraft,followUpDraft:r.followUpDraft,lastContact:"",follow1:"",follow2:"",notes:""});
const loadState=():Record<number,State>=>{
  let next:Record<number,State>={};
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}") as Record<string,Partial<State>>;
    next=Object.entries(raw).reduce<Record<number,State>>((acc,[id,value])=>{const r=recruiters.find(item=>item.id===Number(id));if(r)acc[Number(id)]={...defaults(r),...value};return acc},{});
  }catch{next={}}
  if(!localStorage.getItem(RECOVERY_KEY)){
    recoveredSubmittedIds.forEach(id=>{
      const recruiter=recruiters.find(item=>item.id===id);if(!recruiter)return;
      const current=next[id]||defaults(recruiter);
      next[id]={...current,status:statusOrder.indexOf(current.status)>statusOrder.indexOf("submitted")?current.status:"submitted"};
    });
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
    localStorage.setItem(RECOVERY_KEY,new Date().toISOString());
  }
  if(!localStorage.getItem(DRAFT_REFRESH_KEY)){
    recruiters.forEach(recruiter=>{
      next[recruiter.id]={...defaults(recruiter),...next[recruiter.id],draft:recruiter.initialDraft,connectionDraft:recruiter.connectionDraft,followUpDraft:recruiter.followUpDraft};
    });
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
    localStorage.setItem(DRAFT_REFRESH_KEY,new Date().toISOString());
  }
  return next;
};
const loadLinks=():Record<string,string>=>{try{return JSON.parse(localStorage.getItem(LINKS_KEY)||"{}")}catch{return {}}};
const displayDate=(iso:string)=>iso?new Date(`${iso}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric"}):"";
const displayFollowers=(followers?:number)=>followers===undefined?"audience unknown":followers>=1000?`${Math.round(followers/100)/10}K followers`:`${followers} followers`;
const routeLabel=(route:ContactRoute)=>route==="direct-email"?"direct email":route==="free-message"?"free message verified":route==="connection-only"?"connection only":"message access unknown";
const followerWeight=(followers?:number)=>followers===undefined?0:followers<=1000?18:followers<=2500?14:followers<=5000?9:followers<10000?3:followers>=25000?-24:-10;
const baselineRouteScore=(r:Recruiter)=>r.priority+(r.email?38:0)+followerWeight(r.followers)+(r.sourceType==="active opening"?3:0);
const mergeState=(local:Record<number,State>,remote:Record<string,State>)=>{
  const next:Record<number,State>={...local};
  Object.entries(remote).forEach(([key,remoteValue])=>{
    const id=Number(key);const recruiter=recruiters.find(item=>item.id===id);if(!recruiter)return;
    const localValue=local[id];
    if(!localValue){next[id]={...defaults(recruiter),...remoteValue};return}
    const localRank=statusOrder.indexOf(localValue.status);const remoteRank=statusOrder.indexOf(remoteValue.status);
    next[id]={...defaults(recruiter),...remoteValue,...localValue,status:remoteRank>localRank?remoteValue.status:localValue.status};
  });
  return next;
};

function StatusPill({status}:{status:RecruiterStatus}){return <span className="recruiter-status" data-status={status}>{status}</span>}

export function RecruiterSprint(){
  const [state,setState]=useState<Record<number,State>>(loadState);
  const [selected,setSelected]=useState(()=>recruiters.slice().sort((a,b)=>baselineRouteScore(b)-baselineRouteScore(a))[0]?.id||1);
  const [segment,setSegment]=useState("All");
  const [statusFilter,setStatusFilter]=useState("All statuses");
  const [family,setFamily]=useState("All roles");
  const [routeFilter,setRouteFilter]=useState("Best routes");
  const [query,setQuery]=useState("");
  const [copiedDraft,setCopiedDraft]=useState<"message"|"connection"|"follow-up"|null>(null);
  const [links,setLinks]=useState<Record<string,string>>(loadLinks);
  const [syncState,setSyncState]=useState<"locked"|"loading"|"synced"|"saving"|"error">(()=>contentRepository.isUnlocked()?"loading":"locked");
  const [syncNote,setSyncNote]=useState("");
  const [password,setPassword]=useState("");
  const [remoteReady,setRemoteReady]=useState(false);
  const importRef=useRef<HTMLInputElement>(null);

  const loadRemote=async()=>{
    setSyncState("loading");setSyncNote("");
    try{
      const remote=await contentRepository.getRecruiterBoard<State>();
      setState(local=>{const next=mergeState(local,remote.state);localStorage.setItem(STORAGE_KEY,JSON.stringify(next));return next});
      setLinks(local=>{const next={...remote.links,...local};localStorage.setItem(LINKS_KEY,JSON.stringify(next));return next});
      setRemoteReady(true);setSyncState("synced");
      setSyncNote(remote.updatedAt?`Last encrypted save ${new Date(remote.updatedAt).toLocaleString()}`:"Encrypted board ready");
    }catch(problem){
      if(problem instanceof Error&&/expired|locked/i.test(problem.message))contentRepository.clearToken();
      setRemoteReady(false);setSyncState(contentRepository.isUnlocked()?"error":"locked");
      setSyncNote(problem instanceof Error?problem.message:"Private sync could not load");
    }
  };
  useEffect(()=>{if(contentRepository.isUnlocked())void loadRemote()},[]);
  useEffect(()=>{
    if(!remoteReady||!contentRepository.isUnlocked())return;
    setSyncState("saving");
    const timer=window.setTimeout(()=>{void contentRepository.saveRecruiterBoard(state,links).then(result=>{
      setSyncState("synced");setSyncNote(`Encrypted save ${new Date(result.updatedAt).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`);
    }).catch(problem=>{setSyncState("error");setSyncNote(problem instanceof Error?problem.message:"Encrypted save failed")})},650);
    return()=>window.clearTimeout(timer);
  },[links,remoteReady,state]);
  const unlockSync=async()=>{
    if(!password.trim())return;setSyncState("loading");setSyncNote("");
    try{await contentRepository.login(password);setPassword("");await loadRemote()}catch(problem){setSyncState("error");setSyncNote(problem instanceof Error?problem.message:"Could not unlock private sync")}
  };

  const getState=(r:Recruiter)=>({...defaults(r),...state[r.id]});
  const getRoute=(r:Recruiter):ContactRoute=>r.email?"direct-email":getState(r).route;
  const effectivePriority=(r:Recruiter)=>{
    const route=getRoute(r);
    const routeWeight=route==="direct-email"?38:route==="free-message"?32:route==="connection-only"?-25:0;
    return r.priority+routeWeight+followerWeight(r.followers)+(r.sourceType==="active opening"?3:0);
  };
  const isBestRoute=(r:Recruiter)=>{
    const route=getRoute(r);
    return route==="direct-email"||route==="free-message"||(route==="unknown"&&r.followers!==undefined&&r.followers<=5000);
  };
  const matchesRoute=(r:Recruiter)=>{
    const route=getRoute(r);
    if(routeFilter==="Best routes")return isBestRoute(r);
    if(routeFilter==="Direct / free")return route==="direct-email"||route==="free-message";
    if(routeFilter==="Smaller inbox")return route!=="connection-only"&&r.followers!==undefined&&r.followers<=5000;
    if(routeFilter==="Access unverified")return route==="unknown";
    if(routeFilter==="Connection only")return route==="connection-only";
    if(routeFilter==="Crowded inbox")return r.followers!==undefined&&r.followers>=10000;
    return true;
  };
  const update=(id:number,patch:Partial<State>)=>setState(old=>{
    const r=recruiters.find(item=>item.id===id)!;
    const next={...old,[id]:{...defaults(r),...old[id],...patch}};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
    return next;
  });
  const mark=(status:RecruiterStatus)=>{
    const stamp=today();
    const contactPatch=status==="contacted"&&!getState(current).lastContact?{lastContact:stamp,follow1:addBusinessDays(stamp,5),follow2:addBusinessDays(addBusinessDays(stamp,5),7)}:{};
    update(current.id,{status,...contactPatch});
  };

  const filtered=useMemo(()=>recruiters.filter(r=>{
    const s=state[r.id]?.status||"ready";
    const haystack=`${r.name} ${r.firm} ${r.focus} ${r.match} ${r.roleFamilies.join(" ")}`.toLowerCase();
    return (segment==="All"||r.segment===segment)&&(statusFilter==="All statuses"||s===statusFilter)&&(family==="All roles"||r.roleFamilies.includes(family))&&matchesRoute(r)&&(!query||haystack.includes(query.toLowerCase()));
  }).sort((a,b)=>effectivePriority(b)-effectivePriority(a)),[family,query,routeFilter,segment,state,statusFilter]);

  const current=recruiters.find(r=>r.id===selected)||recruiters[0];
  const currentState=getState(current);
  const queue=recruiters.slice().filter(isBestRoute).sort((a,b)=>effectivePriority(b)-effectivePriority(a)).filter(r=>!["contacted","replied","call booked","submitted","interview","offer","inactive"].includes(getState(r).status)).slice(0,8);
  const counts=Object.fromEntries(statusOrder.map(status=>[status,recruiters.filter(r=>getState(r).status===status).length])) as Record<RecruiterStatus,number>;
  const contacted=activeStatuses.reduce((sum,status)=>sum+counts[status],0);
  const completion=Math.round((contacted/recruiters.length)*100);
  const directEmails=recruiters.filter(r=>r.email).length;
  const freeRoutes=recruiters.filter(r=>getRoute(r)==="free-message").length;
  const smallInboxes=recruiters.filter(r=>r.followers!==undefined&&r.followers<=5000).length;
  const crowdedInboxes=recruiters.filter(r=>r.followers!==undefined&&r.followers>=10000).length;
  const unknownAccess=recruiters.filter(r=>getRoute(r)==="unknown").length;
  const gmailComposeUrl=current.email?`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(current.email)}&su=${encodeURIComponent("Remote / Seattle data systems candidate — Luke Jones")}&body=${encodeURIComponent(currentState.draft)}`:"";
  const setLink=(key:string,value:string)=>{const next={...links,[key]:value};setLinks(next);localStorage.setItem(LINKS_KEY,JSON.stringify(next))};
  const copyDraft=async(kind:"message"|"connection"|"follow-up",value:string)=>{
    await navigator.clipboard.writeText(value);setCopiedDraft(kind);
    window.setTimeout(()=>setCopiedDraft(current=>current===kind?null:current),1400);
  };

  const exportBoard=()=>{
    const payload={version:2,exportedAt:new Date().toISOString(),state,links};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
    const anchor=document.createElement("a");anchor.href=url;anchor.download=`luke-recruiter-sprint-${today()}.json`;anchor.click();URL.revokeObjectURL(url);
  };
  const importBoard=(event:ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{try{const payload=JSON.parse(String(reader.result));const next=payload.state||payload;setState(next);localStorage.setItem(STORAGE_KEY,JSON.stringify(next));if(payload.links){setLinks(payload.links);localStorage.setItem(LINKS_KEY,JSON.stringify(payload.links))}}catch{alert("That file is not a valid Recruiter Sprint backup.")}};reader.readAsText(file);event.target.value="";
  };

  return <div className="page recruiter-sprint">
    <div className="sprint-hero">
      <div className="sprint-hero-copy"><span><Sparkles/> Reachable humans, not LinkedIn theater</span><h2>Start where an actual reply is plausible.</h2><p>Direct emails and verified free-message routes lead. Smaller recruiter inboxes rise. Celebrity accounts and connection-only dead ends sink.</p></div>
      <div className="sprint-progress"><div><strong>{completion}%</strong><span>contacted</span></div><div className="progress-track"><i style={{width:`${completion}%`}}/></div><small>{contacted} sent · {recruiters.length-contacted-counts.inactive} still actionable</small></div>
    </div>

    <section className="recruiter-data-control" data-state={syncState}>
      <div className="data-control-icon">{syncState==="loading"||syncState==="saving"?<RefreshCw className="spin"/>:syncState==="synced"?<Cloud/>:<LockKeyhole/>}</div>
      <div><span>Data controls · recruiter ledger</span><b>{syncState==="synced"?"Encrypted sync is active":syncState==="saving"?"Saving across devices…":syncState==="loading"?"Opening private data…":syncState==="error"?"Private sync needs attention":"Unlock once on this device"}</b><small>{syncNote||"One 30-day unlock connects Recruiters, Content, Build, desktop, and phone to the same private PostgreSQL control layer."}</small></div>
      {syncState==="locked"||syncState==="error"?<form onSubmit={event=>{event.preventDefault();void unlockSync()}}><input type="password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="Private bridge password" autoComplete="current-password"/><button disabled={!password.trim()}>Unlock data</button></form>:<button className="sync-refresh" onClick={()=>void loadRemote()} disabled={syncState==="loading"||syncState==="saving"}><RefreshCw/>Refresh</button>}
    </section>

    <div className="sprint-metrics">
      <button data-tone="blue" onClick={()=>setStatusFilter("contacted")}><b>{contacted}</b><span>contacted</span></button>
      <button data-tone="cyan" onClick={()=>setStatusFilter("replied")}><b>{counts.replied}</b><span>replies</span></button>
      <button data-tone="pink" onClick={()=>setStatusFilter("call booked")}><b>{counts["call booked"]}</b><span>calls</span></button>
      <button data-tone="purple" onClick={()=>setStatusFilter("submitted")}><b>{counts.submitted}</b><span>submissions</span></button>
      <button data-tone="green" onClick={()=>setStatusFilter("interview")}><b>{counts.interview}</b><span>interviews</span></button>
      <button data-tone="gold" onClick={()=>setStatusFilter("offer")}><b>{counts.offer}</b><span>offers</span></button>
    </div>

    <section className="reachability-strip">
      <button onClick={()=>setRouteFilter("Direct / free")}><Mail/><span><b>{directEmails+freeRoutes}</b>direct or free</span></button>
      <button onClick={()=>setRouteFilter("Smaller inbox")}><Target/><span><b>{smallInboxes}</b>known ≤5K audiences</span></button>
      <button onClick={()=>setRouteFilter("Access unverified")}><Search/><span><b>{unknownAccess}</b>access checks left</span></button>
      <button onClick={()=>setRouteFilter("Crowded inbox")}><Archive/><span><b>{crowdedInboxes}</b>crowded 10K+ inboxes</span></button>
      <p><b>Gold is not the filter.</b> LinkedIn's gold Premium badge and Open Profile messaging are separate. The board only calls a route free after you verify it.</p>
    </section>

    <section className="card queue-card">
      <div className="card-head"><div><span>Highest-signal unsent routes</span><h3>Today’s contact queue</h3></div><small>Start at the left. Eight is enough for one deliberate pass.</small></div>
      <div className="daily-queue">{queue.map((r,i)=><button key={r.id} onClick={()=>setSelected(r.id)} className={selected===r.id?"active":""}><i>{i+1}</i><span><b>{r.name}</b><small>{r.firm} · {routeLabel(getRoute(r))} · {displayFollowers(r.followers)}</small></span><ChevronRight/></button>)}</div>
    </section>

    <div className="recruiter-toolbar card">
      <label className="recruiter-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search recruiter, firm, skill or role family"/></label>
      <div className="toolbar-selects">
        <select value={segment} onChange={e=>setSegment(e.target.value)}><option>All</option><option>National remote</option><option>Seattle / PNW</option><option>Contract / C2H</option></select>
        <select value={family} onChange={e=>setFamily(e.target.value)}><option>All roles</option><option>Data engineering</option><option>Analytics engineering</option><option>Automation</option><option>Data analytics</option><option>BI</option><option>Applied AI</option><option>AI engineering</option><option>Technical product</option></select>
        <select value={routeFilter} onChange={e=>setRouteFilter(e.target.value)}><option>Best routes</option><option>Direct / free</option><option>Smaller inbox</option><option>Access unverified</option><option>Connection only</option><option>Crowded inbox</option><option>All access</option></select>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All statuses</option>{statusOrder.map(s=><option key={s}>{s}</option>)}</select>
      </div>
      <div className="board-tools"><button onClick={exportBoard}><Download/>Backup</button><button onClick={()=>importRef.current?.click()}><FileUp/>Restore</button><input ref={importRef} type="file" accept="application/json" onChange={importBoard}/></div>
    </div>

    <div className="sprint-layout">
      <section className="card recruiter-table-card">
        <div className="list-caption"><span>{filtered.length} routes</span><b>{routeFilter} · {segment==="All"?"all lanes":segment}</b></div>
        <div className="recruiter-table">{filtered.map(r=>{const s=getState(r).status;const route=getRoute(r);return <button key={r.id} onClick={()=>setSelected(r.id)} className={selected===r.id?"selected":""}><strong>{effectivePriority(r)}</strong><span><b>{r.name}</b><small>{r.firm} · {r.roleFamilies.slice(0,2).join(" + ")}</small><em>{routeLabel(route)} · {displayFollowers(r.followers)}</em></span><StatusPill status={s}/></button>})}</div>
      </section>

      <section className="card recruiter-detail">
        <div className="recruiter-title"><div><span>Route score {effectivePriority(current)} · {current.segment} · checked {current.checkedAt}</span><h3>{current.name}</h3><p>{current.title} · {current.firm}</p></div><div><a href={current.linkedin} target="_blank" rel="noreferrer"><ExternalLink/>LinkedIn</a>{current.email&&<a href={gmailComposeUrl} target="_blank" rel="noreferrer"><Mail/>Draft in Gmail</a>}</div></div>
        <div className="recruiter-evidence">
          <div><span>Why this person</span><p>{current.evidence}</p><a href={current.evidenceUrl} target="_blank" rel="noreferrer">Open source <ExternalLink/></a></div>
          <div><span>Why you fit</span><p>{current.match}.</p><b>{current.resume} résumé</b></div>
        </div>
        <div className="role-tags">{current.roleFamilies.map(role=><span key={role}>{role}</span>)}<span className="source-tag">{current.sourceType}</span><span className={`route-tag route-${getRoute(current)}`}>{routeLabel(getRoute(current))}</span>{current.followers!==undefined&&<span className={current.followers>=10000?"follower-tag crowded":"follower-tag"}>{displayFollowers(current.followers)}</span>}</div>

        <section className="route-verification" data-route={getRoute(current)}>
          <div><span>Actual contact route</span><b>{routeLabel(getRoute(current))}</b><small>{current.email?current.email:"Gold badge does not prove free messaging. Check the profile once, then record what actually works."}</small></div>
          {!current.email&&<div className="route-verification-actions"><button className={currentState.route==="free-message"?"active":""} onClick={()=>update(current.id,{route:"free-message"})}><MessageSquare/>Free message works</button><button className={currentState.route==="connection-only"?"active":""} onClick={()=>update(current.id,{route:"connection-only"})}><LockKeyhole/>Connection only</button><button className={currentState.route==="unknown"?"active":""} onClick={()=>update(current.id,{route:"unknown"})}><RefreshCw/>Not checked</button></div>}
        </section>

        <div className="outreach-drafts">
          <section className="outreach-draft primary-draft">
            <div className="draft-heading"><div><span>Direct message or email</span><small>Short, personal, and ready to adjust</small></div><button onClick={()=>void copyDraft("message",currentState.draft)}><Copy/>{copiedDraft==="message"?"Copied":"Copy message"}</button></div>
            <textarea value={currentState.draft} onChange={e=>update(current.id,{draft:e.target.value})}/>
            <div className="draft-links">{current.email&&<a href={gmailComposeUrl} target="_blank" rel="noreferrer"><Mail/>Draft in Gmail</a>}<a href={current.linkedin} target="_blank" rel="noreferrer"><ExternalLink/>Open LinkedIn</a></div>
          </section>
          <section className="outreach-draft connection-draft">
            <div className="draft-heading"><div><span>LinkedIn connection request</span><small>For recruiters without an open-message option</small></div><div className="draft-heading-actions"><b data-over={currentState.connectionDraft.length>200}>{currentState.connectionDraft.length}/200</b><button onClick={()=>void copyDraft("connection",currentState.connectionDraft)}><Copy/>{copiedDraft==="connection"?"Copied":"Copy note"}</button></div></div>
            <textarea maxLength={200} value={currentState.connectionDraft} onChange={e=>update(current.id,{connectionDraft:e.target.value})}/>
          </section>
          <details className="follow-up-draft"><summary>Follow-up note</summary><textarea value={currentState.followUpDraft} onChange={e=>update(current.id,{followUpDraft:e.target.value})}/><button onClick={()=>void copyDraft("follow-up",currentState.followUpDraft)}><Copy/>{copiedDraft==="follow-up"?"Copied":"Copy follow-up"}</button></details>
        </div>

        <div className="status-control"><span>Move the route</span><div>{statusOrder.filter(s=>s!=="ready").map(status=><button key={status} className={currentState.status===status?"active":""} data-status={status} onClick={()=>mark(status)}>{status==="approved"&&<Check/>}{status==="contacted"&&<Send/>}{status==="replied"&&<MessageSquare/>}{status==="call booked"&&<PhoneCall/>}{status==="submitted"&&<BriefcaseBusiness/>}{status==="interview"&&<Target/>}{status==="offer"&&<Trophy/>}{status==="inactive"&&<Archive/>}{status}</button>)}</div></div>
        <label className="recruiter-notes"><span>Notes</span><textarea value={currentState.notes} onChange={e=>update(current.id,{notes:e.target.value})} placeholder="What happened, role details, promised follow-up, recruiter preference…"/></label>
        {currentState.lastContact&&<div className="followups"><CalendarClock/><span>Sent {displayDate(currentState.lastContact)}</span><span>Follow up {displayDate(currentState.follow1)}</span><span>Final {displayDate(currentState.follow2)}</span></div>}
      </section>
    </div>

    <div className="packet-grid">
      <section className="card"><div className="card-head"><div><span>What every route carries</span><h3>Integrated candidate packet</h3></div></div><p className="packet-summary">Data and automation builder currently delivering production work at AMC: SQL investigations, Python automation, Azure SQL pipelines, Tableau delivery, observability, and data-quality controls. Independently built Lander across nine ATS ecosystems and tens of thousands of roles; built Wyloc as an applied-AI data-security product; built the Human Repo as a large local-first memory and retrieval system. Targeting genuinely remote or Seattle-hybrid work where that full range is useful.</p><ul className="capabilities"><li>Production SQL, Python, PostgreSQL, dbt and Airflow</li><li>Analytics engineering, Tableau delivery and data-quality diagnosis</li><li>FastAPI services, pgvector retrieval and workflow automation</li><li>Applied-AI systems, evaluation, memory and technical product ownership</li><li>Open to direct hire, contract or C2H at $80K+ / about $40+ hourly</li></ul><div className="route-summary"><span><b>{recruiters.length}</b> researched routes</span><span><b>{directEmails}</b> public direct emails</span><span><b>{smallInboxes}</b> known ≤5K audiences</span><span><b>{crowdedInboxes}</b> crowded 10K+ inboxes</span></div></section>
      <section className="card"><div className="card-head"><div><span>Proof destinations</span><h3>Links inserted into outreach</h3></div></div><p className="link-warning">{syncState==="synced"?"Encrypted with the recruiter ledger and available on every unlocked device.":"Saved on this device until Data controls is unlocked."}</p>{["LinkedIn","GitHub","Portfolio","Lander","Wyloc"].map(k=><label className="packet-link" key={k}>{k}<input type="url" value={links[k]||""} onChange={e=>setLink(k,e.target.value)} placeholder={`Paste ${k} URL`}/>{links[k]&&<a href={links[k]} target="_blank" rel="noreferrer"><ExternalLink/></a>}</label>)}<div className="spoken"><b>Use the right proof for the desk</b><p>Data / BI recruiters get AMC and Lander. Data-engineering recruiters get the ingestion, orchestration, modeling and API stack. Applied-AI recruiters get Wyloc, semantic matching and Human Repo architecture. The person stays the same; the evidence route changes.</p></div></section>
    </div>
  </div>;
}
