import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, BookOpen, Check, ChevronRight, Database, Film, Layers3, Link2, LockKeyhole, Plus, Radio, RefreshCw, Save, Settings2, Sparkles, Trash2, X } from "lucide-react";
import { privateSnapshot } from "./generated/privateSnapshot";
import { contentRepository, ContentDashboard } from "./content";

type IdeaStage = "captured" | "researching" | "outlined" | "ready" | "published";
type StageOverrides = Record<string, IdeaStage>;

const stages: { id:IdeaStage; label:string }[] = [
  { id:"captured", label:"Captured" },
  { id:"researching", label:"Researching" },
  { id:"outlined", label:"Outlined" },
  { id:"ready", label:"Ready" },
  { id:"published", label:"Published" },
];

const formatNumber=(value:number|null)=>value==null?"—":new Intl.NumberFormat("en-US",{notation:value>=100000?"compact":"standard",maximumFractionDigits:1}).format(value);
const ratio=(likes:number,views:number)=>views===0?"—":`${((likes/views)*100).toFixed(1)}%`;
const freshDraft=(data:ContentDashboard):ContentDashboard=>JSON.parse(JSON.stringify(data)) as ContentDashboard;

export function ContentStudio() {
  const [data,setData]=useState<ContentDashboard>(privateSnapshot.content as unknown as ContentDashboard);
  const [source,setSource]=useState(contentRepository.mode);
  const [connectorError,setConnectorError]=useState("");
  const [connectorNote,setConnectorNote]=useState("");
  const [editorOpen,setEditorOpen]=useState(false);
  const [unlocked,setUnlocked]=useState(contentRepository.isUnlocked());
  const [password,setPassword]=useState("");
  const [draft,setDraft]=useState<ContentDashboard>(()=>freshDraft(data));
  const [providerForm,setProviderForm]=useState<{provider:"youtube"|"tiktok";clientId:string;clientSecret:string}|null>(null);
  const [busy,setBusy]=useState("");
  const [pillar,setPillar]=useState("All");
  const [selectedId,setSelectedId]=useState<string>(data.ideas[0]?.id||"");
  const [copiedId,setCopiedId]=useState("");
  const [overrides,setOverrides]=useState<StageOverrides>(()=>{
    try{return JSON.parse(localStorage.getItem("lcp-content-stages-v1")||"{}") as StageOverrides}catch{return {}}
  });
  const refresh=async()=>{try{const next=await contentRepository.getDashboard();setData(next);setDraft(freshDraft(next));setSource(contentRepository.mode);setUnlocked(contentRepository.isUnlocked());setConnectorError("")}catch(problem){setConnectorError(problem instanceof Error?problem.message:"Content connector failed");setSource("private-snapshot");setUnlocked(contentRepository.isUnlocked())}};
  useEffect(()=>{void refresh()},[]);
  const ideas=useMemo(()=>data.ideas.map(idea=>({...idea,stage:overrides[idea.id]||idea.stage as IdeaStage})),[data.ideas,overrides]);
  const pillars=["All",...Array.from(new Set(data.ideas.map(idea=>idea.pillar)))];
  const visibleIdeas=pillar==="All"?ideas:ideas.filter(idea=>idea.pillar===pillar);
  const selected=ideas.find(idea=>idea.id===selectedId)||visibleIdeas[0];
  const updateStage=(id:string,stage:IdeaStage)=>{
    const next={...overrides,[id]:stage};setOverrides(next);localStorage.setItem("lcp-content-stages-v1",JSON.stringify(next));
  };
  const choosePillar=(next:string)=>{setPillar(next);const first=next==="All"?ideas[0]:ideas.find(idea=>idea.pillar===next);if(first)setSelectedId(first.id)};
  const copyBrief=async()=>{if(!selected)return;const brief=[selected.title,selected.premise,`Format: ${selected.form}`,`Pillar: ${selected.pillar}`,`Evidence: ${selected.sources.join(", ")}`,`Current stage: ${selected.stage}`].join("\n\n");await navigator.clipboard.writeText(brief);setCopiedId(selected.id);window.setTimeout(()=>setCopiedId(""),1800)};
  const totalViews=data.returnPosts.reduce((sum,post)=>sum+post.views,0);
  const totalLikes=data.returnPosts.reduce((sum,post)=>sum+(post.likes||0),0);
  const maxViews=Math.max(1,...data.returnPosts.map(post=>post.views));
  const unlock=async()=>{setBusy("unlock");setConnectorError("");try{await contentRepository.login(password);setPassword("");setUnlocked(true);await refresh();setConnectorNote("Private connector unlocked on this device.")}catch(problem){setConnectorError(problem instanceof Error?problem.message:"Could not unlock connector")}finally{setBusy("")}};
  const saveMetrics=async()=>{setBusy("save");setConnectorError("");try{const next=await contentRepository.saveManual({totals:draft.totals,returnPosts:draft.returnPosts,observedAt:new Date().toISOString()});setData(next);setDraft(freshDraft(next));setConnectorNote(unlocked?"Saved locally and to the encrypted connector.":"Saved on this device. Unlock the connector to sync it across devices.")}catch(problem){setConnectorError(problem instanceof Error?problem.message:"Could not save metrics")}finally{setBusy("")}};
  const configureProvider=async()=>{if(!providerForm)return;setBusy(`config-${providerForm.provider}`);setConnectorError("");try{await contentRepository.configure(providerForm.provider,providerForm.clientId,providerForm.clientSecret);setProviderForm(null);await refresh();setConnectorNote(`${providerForm.provider==="youtube"?"YouTube":"TikTok"} credentials encrypted on the private server.`)}catch(problem){setConnectorError(problem instanceof Error?problem.message:"Could not save connector")}finally{setBusy("")}};
  const connectProvider=async(provider:"youtube"|"tiktok")=>{setBusy(`connect-${provider}`);setConnectorError("");try{await contentRepository.authorize(provider)}catch(problem){setConnectorError(problem instanceof Error?problem.message:"Could not begin connection");setBusy("")}};
  const syncProvider=async(provider:"youtube"|"tiktok")=>{setBusy(`sync-${provider}`);setConnectorError("");try{await contentRepository.sync(provider);await refresh();setConnectorNote(`${provider==="youtube"?"YouTube":"TikTok"} refreshed now.`)}catch(problem){setConnectorError(problem instanceof Error?problem.message:"Could not refresh provider")}finally{setBusy("")}};
  const updatePost=(index:number,field:"label"|"views"|"likes"|"note",value:string)=>setDraft(current=>({...current,returnPosts:current.returnPosts.map((post,row)=>row===index?{...post,[field]:field==="views"?Number(value)||0:field==="likes"?(value===""?null:Number(value)||0):value}:post)}));
  const removePost=(index:number)=>setDraft(current=>({...current,returnPosts:current.returnPosts.filter((_,row)=>row!==index)}));
  const addPost=()=>setDraft(current=>({...current,returnPosts:[...current.returnPosts,{label:`Return ${String(current.returnPosts.length+1).padStart(2,"0")}`,views:0,likes:null,note:"New manual reading",observedAt:new Date().toISOString()}]}));

  return <div className="page content-studio">
    <section className="content-command">
      <div className="content-command-copy"><span>Owned media system</span><h2>Two live accounts. One new lane waiting for a name.</h2><p>Audience evidence, current signals, source constraints, and the exact work waiting to be made—without turning the tab into another posting calendar.</p></div>
      <div className="content-total"><small>Recorded audience</small><strong>{formatNumber(data.totals.followers)}</strong><span>{formatNumber(data.totals.lifetimeLikes)} lifetime likes</span></div>
    </section>

    <section className="content-accounts">
      {data.accounts.map((account,index)=><article className="content-account" key={account.id} style={{"--account":account.accent||["#ff668f","#ff5b5b","#c4a7ff"][index]} as React.CSSProperties}>
        <header><span>{String(index+1).padStart(2,"0")}</span><b>{account.platform}</b><em className={account.status}>{account.status}</em></header>
        <h3>{account.name}</h3><div className="account-number"><strong>{account.metric}</strong><small>{account.metricLabel}</small></div><p>{account.detail}</p>
      </article>)}
    </section>

    <section className="content-grid-primary">
      <article className="content-panel return-panel">
        <div className="content-panel-head"><div><span>Return pulse</span><h3>The audience was still there.</h3></div><div className="return-total"><b>{formatNumber(totalViews)}</b><small>recorded views · {ratio(totalLikes,totalViews)} like rate</small></div></div>
        <div className="return-chart">{data.returnPosts.map((post,index)=><div className="return-row" key={post.id||`${post.label}-${index}`}><div><b>{post.label}</b><small>{post.note}</small></div><div className="return-bar"><i style={{width:`${Math.max(5,(post.views/maxViews)*100)}%`}}/><span>{formatNumber(post.views)} views</span></div><strong>{formatNumber(post.likes)}<small>likes</small></strong></div>)}</div>
        <div className="return-evidence"><span><b>{data.totals.millionViewPosts??"—"}+</b> million-view posts</span><span><b>${formatNumber(data.totals.creatorRevenue)}</b> recorded creator-fund revenue</span><span><b>12M / 4M</b> Target / McDonald’s proof</span></div>
      </article>
      <article className="content-panel source-panel">
        <div className="content-panel-head"><div><span>Data surface · {source==="private-api"?(unlocked?"private API":"locked API"):"private snapshot"}</span><h3>What can actually connect</h3></div><button className="data-control-button" onClick={()=>{setDraft(freshDraft(data));setEditorOpen(true)}}><Settings2/>Data controls</button></div>
        {connectorError&&<div className="content-connector-error">{connectorError} Showing the latest private snapshot.</div>}
        <div className="source-row"><i className="youtube"><Radio/></i><div><b>YouTube owner analytics</b><small>Views, watch time, average duration, likes, shares, subscriber movement, revenue, and complete video history through owner OAuth.</small></div><em>{data.providers?.youtube?.connected?"Connected":"Full API"}</em></div>
        <div className="source-row"><i className="tiktok"><Film/></i><div><b>TikTok account + video pulse</b><small>Official follower totals and per-video views, likes, comments, and shares when approved. Manual readings remain first-class evidence.</small></div><em>{data.providers?.tiktok?.connected?"Connected":"Approval"}</em></div>
        <div className="source-row"><i><Layers3/></i><div><b>Private snapshot layer</b><small>Current dashboard data is generated locally at build time and never committed to the public repository.</small></div><em>Active</em></div>
      </article>
    </section>

    <section className="content-grid-secondary">
      <article className="content-panel insight-panel"><div className="content-panel-head"><div><span>Echoes intelligence</span><h3>What the evidence says</h3></div><BarChart3/></div>{data.insights.map((insight,index)=><div className="content-insight" key={insight.title}><span>{String(index+1).padStart(2,"0")}</span><div><b>{insight.title}</b><p>{insight.detail}</p></div></div>)}</article>
      <article className="content-panel format-panel"><div className="content-panel-head"><div><span>Format DNA</span><h3>Repeat the mechanism, not the clip</h3></div><Sparkles/></div>{data.formats.map(format=><div className="format-row" key={format.name}><div><b>{format.name}</b><p>{format.description}</p></div><span>{format.signal}</span></div>)}</article>
    </section>

    <section className="channel-preamble">
      <div><span>Channel 03 · preamble</span><h2>The machinery underneath ordinary life.</h2></div>
      <p>Some systems are too strange and consequential to remain private rabbit holes. This channel follows one question until the machinery underneath it becomes visible—from COBOL banks and AI memory to Kurt Cobain, geographic inertia, and a life modeled as state transitions.</p>
    </section>

    <section className="content-panel idea-vault">
      <div className="content-panel-head vault-head"><div><span>Research vault</span><h3>{ideas.length} real leads from the Human Repo</h3></div><div className="pillar-filter">{pillars.map(item=><button className={pillar===item?"active":""} onClick={()=>choosePillar(item)} key={item}>{item}</button>)}</div></div>
      <div className="vault-layout"><div className="idea-list">{visibleIdeas.map((idea,index)=><button className={selected?.id===idea.id?"selected":""} onClick={()=>setSelectedId(idea.id)} key={idea.id}><span>{String(index+1).padStart(2,"0")}</span><div><b>{idea.title}</b><small>{idea.pillar} · {idea.form}</small></div><em className={idea.stage}>{idea.stage}</em><ChevronRight/></button>)}</div>
        {selected&&<aside className="idea-detail"><div className="idea-detail-title"><span>{selected.pillar} · {selected.form}</span><h3>{selected.title}</h3></div><p>{selected.premise}</p><div className="source-chips"><small>Evidence pockets</small>{selected.sources.map(source=><i key={source}>{source}</i>)}</div><div className="stage-control"><small>Move through the pipeline</small><div>{stages.map(stage=><button className={selected.stage===stage.id?"active":""} onClick={()=>updateStage(selected.id,stage.id)} key={stage.id}>{selected.stage===stage.id&&<Check/>}{stage.label}</button>)}</div></div><button className="develop-button" onClick={()=>void copyBrief()}><BookOpen/>{copiedId===selected.id?"Brief copied":"Copy development brief"}<ArrowUpRight/></button></aside>}
      </div>
    </section>

    {editorOpen&&<div className="content-editor-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setEditorOpen(false)}}>
      <section className="content-editor" role="dialog" aria-modal="true" aria-label="Content data controls">
        <header><div><span>Private content ledger</span><h2>Connect the APIs. Keep the evidence editable.</h2><p>Provider secrets and refresh tokens live only on the encrypted bridge. Manual readings are dated evidence—not a lesser fallback.</p></div><button aria-label="Close data controls" onClick={()=>setEditorOpen(false)}><X/></button></header>
        {connectorError&&<div className="content-connector-error">{connectorError}</div>}
        {connectorNote&&<div className="content-connector-note">{connectorNote}</div>}

        {!unlocked&&<div className="connector-unlock"><LockKeyhole/><div><b>Unlock the private connector</b><p>Use the same password as the Human Repo phone bridge. It is exchanged for a signed device token and is never stored in this app.</p></div><input type="password" value={password} onChange={event=>setPassword(event.target.value)} onKeyDown={event=>{if(event.key==="Enter")event.preventDefault()}} placeholder="Private bridge password"/><button disabled={!password||busy==="unlock"} onClick={()=>void unlock()}>{busy==="unlock"?"Unlocking…":"Unlock"}</button></div>}

        <div className="connector-grid">
          {(["youtube","tiktok"] as const).map(provider=>{const state=data.providers?.[provider];const localBootstrap=provider==="youtube"&&state?.authorizationMode==="installed";const label=provider==="youtube"?"YouTube Analytics":"TikTok Display API";return <article className={`connector-card ${state?.status||"idle"}`} key={provider}>
            <div className="connector-card-title"><i className={provider}>{provider==="youtube"?<Radio/>:<Film/>}</i><div><span>{provider==="youtube"?"Owner OAuth":"Login Kit + Display API"}</span><h3>{label}</h3></div><em>{state?.connected?state.status:state?.configured?"Configured":"Not configured"}</em></div>
            <p>{provider==="youtube"?"Daily channel, video, watch-time, duration, subscriber, and engagement history.":"Daily profile and video counts after TikTok approves user.info.stats and video.list."}</p>
            {state?.lastSyncAt&&<small>Last synced {new Date(state.lastSyncAt).toLocaleString()}</small>}
            {state?.lastError&&<small className="connector-last-error">{state.lastError}</small>}
            <code>{localBootstrap?"Encrypted server grant · daily refresh · Mac can be off":state?.redirectUri||(provider==="youtube"?"https://api.datahiringiq.com/life/api/control-plane/content/youtube/callback":"https://api.datahiringiq.com/life/api/control-plane/content/tiktok/callback")}</code>
            <div className="connector-actions">
              <button disabled={!unlocked} onClick={()=>setProviderForm({provider,clientId:"",clientSecret:""})}><Settings2/>{state?.configured?"Replace credentials":"Add credentials"}</button>
              <button disabled={!unlocked||!state?.configured||busy===`connect-${provider}`||Boolean(localBootstrap&&state?.connected)} onClick={()=>void connectProvider(provider)}><Link2/>{localBootstrap&&state?.connected?"Server connected":state?.connected?"Reconnect":"Connect"}</button>
              <button disabled={!unlocked||!state?.connected||busy===`sync-${provider}`} onClick={()=>void syncProvider(provider)}><RefreshCw className={busy===`sync-${provider}`?"spin":""}/>Sync now</button>
            </div>
          </article>})}
        </div>

        {providerForm&&<div className="provider-setup"><div><span>Encrypted setup</span><h3>{providerForm.provider==="youtube"?"Google OAuth web client":"TikTok developer app"}</h3><p>{providerForm.provider==="youtube"?"Enable YouTube Data API v3 and YouTube Analytics API, then use a Web application OAuth client.":"Add Login Kit, request user.info.stats and video.list, and register the callback shown above."}</p></div><label>Client {providerForm.provider==="youtube"?"ID":"key"}<input value={providerForm.clientId} onChange={event=>setProviderForm({...providerForm,clientId:event.target.value})}/></label><label>Client secret<input type="password" value={providerForm.clientSecret} onChange={event=>setProviderForm({...providerForm,clientSecret:event.target.value})}/></label><div><button onClick={()=>setProviderForm(null)}>Cancel</button><button disabled={!providerForm.clientId||!providerForm.clientSecret||busy.startsWith("config-")} onClick={()=>void configureProvider()}><Save/>Encrypt and save</button></div></div>}

        <div className="manual-ledger-head"><div><span>Manual evidence ledger</span><h3>Current TikTok account and video readings</h3><p>Use this immediately; once TikTok is approved, official records supersede matching manual readings without deleting their history.</p></div><button onClick={addPost}><Plus/>Add video</button></div>
        <div className="manual-totals">
          {([['followers','Followers'],['lifetimeLikes','Lifetime likes'],['creatorRevenue','Creator revenue'],['millionViewPosts','Million-view posts']] as const).map(([field,label])=><label key={field}>{label}<input type="number" min="0" value={draft.totals[field]??""} onChange={event=>setDraft(current=>({...current,totals:{...current.totals,[field]:event.target.value===""?null:Number(event.target.value)}}))}/></label>)}
        </div>
        <div className="manual-video-list">{draft.returnPosts.map((post,index)=><div className="manual-video" key={post.id||index}><input aria-label={`Video ${index+1} label`} value={post.label} onChange={event=>updatePost(index,"label",event.target.value)}/><label>Views<input type="number" min="0" value={post.views} onChange={event=>updatePost(index,"views",event.target.value)}/></label><label>Likes<input type="number" min="0" value={post.likes??""} onChange={event=>updatePost(index,"likes",event.target.value)}/></label><input aria-label={`Video ${index+1} note`} value={post.note} onChange={event=>updatePost(index,"note",event.target.value)}/><button aria-label={`Remove ${post.label}`} onClick={()=>removePost(index)}><Trash2/></button></div>)}</div>
        <footer><div><b>{unlocked?"Cross-device persistence active":"Device-local persistence active"}</b><span>Every save receives a fresh observation time.</span></div><button disabled={busy==="save"} onClick={()=>void saveMetrics()}><Save/>{busy==="save"?"Saving…":"Save current readings"}</button></footer>
      </section>
    </div>}
  </div>;
}
