import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Boxes, GitBranch, GitCommitHorizontal, LockKeyhole, Network, RadioTower, RefreshCw, Settings2, Sparkles, X } from "lucide-react";
import { privateSnapshot } from "./generated/privateSnapshot";
import { contentRepository } from "./content";

type LiveBuild={generatedAt?:string;observedAt?:string;totals:{commits7d:number;commits30d:number;activeProjects:number};projects:Array<{id:string;commits7d:number;commits30d:number;lastCommitAt:string|null;lastCommitMessage:string|null;defaultBranch?:string}>;contributionDays:Array<{date:string;count:number;level:number}>;recentCommits:Array<{projectId:string;projectName:string;sha:string;timestamp:string;message:string}>};
const publicSnapshotUrl="https://raw.githubusercontent.com/lukejones3/life-control-plane/main/public/data/build-snapshot.json";

const compact=(value:number)=>new Intl.NumberFormat("en-US",{notation:value>=100000?"compact":"standard",maximumFractionDigits:1}).format(value);
const relativeDate=(value:string|null)=>{
  if(!value)return "No commit recorded";
  const days=Math.floor((Date.now()-new Date(value).getTime())/86400000);
  return days<=0?"Today":days===1?"Yesterday":`${days} days ago`;
};

export function BuildStudio() {
  const local=privateSnapshot.build;
  const [live,setLive]=useState<LiveBuild|null>(null);
  const [liveSource,setLiveSource]=useState("local snapshot");
  const [githubOpen,setGithubOpen]=useState(false);
  const [githubToken,setGithubToken]=useState("");
  const [githubBusy,setGithubBusy]=useState(false);
  const [githubNote,setGithubNote]=useState("");
  useEffect(()=>{void(async()=>{
    if(contentRepository.isUnlocked()){try{const overlay=await contentRepository.getBuildOverlay();if(overlay.build){setLive(overlay.build as unknown as LiveBuild);setLiveSource("private GitHub sync");return}}catch{/* public fallback below */}}
    try{const date=new Date().toISOString().slice(0,10);const response=await fetch(`${publicSnapshotUrl}?v=${date}`,{cache:"no-store"});if(response.ok){setLive(await response.json() as LiveBuild);setLiveSource("daily public GitHub sync")}}catch{/* local snapshot remains authoritative */}
  })()},[]);
  const data=useMemo(()=>{if(!live)return local;const projects=local.projects.map(project=>{const update=live.projects.find(item=>item.id===project.id);return update?{...project,commits7d:update.commits7d,commits30d:update.commits30d,lastCommitAt:update.lastCommitAt,lastCommitMessage:update.lastCommitMessage,branch:update.defaultBranch||project.branch}:project});return {...local,generatedAt:live.observedAt||live.generatedAt||local.generatedAt,totals:{...local.totals,commits7d:live.totals.commits7d,commits30d:live.totals.commits30d,activeProjects:Math.max(live.totals.activeProjects,local.totals.activeProjects)},projects,contributionDays:live.contributionDays,recentCommits:live.recentCommits}},[live,local]);
  const families=["All",...Array.from(new Set(data.projects.map(project=>project.family)))];
  const [family,setFamily]=useState("All");
  const visible=family==="All"?data.projects:data.projects.filter(project=>project.family===family);
  const byId=useMemo(()=>new Map(data.projects.map(project=>[project.id,project])),[data.projects]);

  return <div className="page build-studio">
    <section className="build-command">
      <div className="build-command-copy"><span>{liveSource}</span><h2>{data.totals.commits7d} commits across the systems in motion.</h2><p>This is no longer a shelf of repository links. It is the current shape of the work: code motion, active worktrees, project dependencies, and the next unresolved edge in every system.</p><small>Snapshot {new Date(data.generatedAt).toLocaleString()}</small></div>
      <div className="build-metrics"><div><strong>{data.totals.activeProjects}</strong><span>active · 30d</span></div><div><strong>{compact(data.totals.sourceLines)}</strong><span>tracked source lines</span></div><div><strong>{data.totals.changedFiles}</strong><span>working files</span></div></div>
    </section>

    <section className="build-heat-panel">
      <div className="heat-heading"><div><span>Commit topology</span><h3>One year of actual repository motion</h3></div><div className="heat-actions"><button onClick={()=>setGithubOpen(true)}><Settings2/>Daily sync</button><div><b>{data.totals.commits30d}</b><small>commits in 30 days</small></div></div></div>
      <div className="actual-heat" aria-label="Contribution activity for the last year">{data.contributionDays.map(day=><i data-level={day.level} title={`${day.date}: ${day.count} commit${day.count===1?"":"s"}`} key={day.date}/>)}</div>
      <div className="heat-legend"><span>364 days ago</span><div>Less <i data-level="0"/><i data-level="1"/><i data-level="2"/><i data-level="3"/><i data-level="4"/> More</div><span>Today</span></div>
    </section>

    <section className="build-toolbar"><div><span>System registry</span><strong>{visible.length} repositories</strong></div><div>{families.map(item=><button className={family===item?"active":""} onClick={()=>setFamily(item)} key={item}>{item}</button>)}</div></section>

    <section className="build-projects">{visible.map(project=><article className="build-project" key={project.id} style={{"--project":project.color} as React.CSSProperties}>
      <div className="project-top"><div className="project-mark"><Boxes/></div><div><span>{project.family}</span><h3>{project.name}</h3></div><em>{project.stage}</em></div>
      <p className="project-summary">{project.summary}</p>
      <div className="project-stats"><div><strong>{project.commits7d}</strong><span>commits · 7d</span></div><div><strong>{compact(project.sourceLines)}</strong><span>source lines</span></div><div><strong>{project.changedFiles}</strong><span>working files</span></div></div>
      <div className="project-next"><span>Next structural move</span><p>{project.next}</p></div>
      <div className="project-last"><GitCommitHorizontal/><div><b>{project.lastCommitMessage||"Repository not available in this snapshot"}</b><small>{relativeDate(project.lastCommitAt)}{project.branch?` · ${project.branch}`:""}</small></div></div>
      <footer>{project.repository?<a href={project.repository} target="_blank" rel="noreferrer">Open repository <ArrowUpRight/></a>:<span className="private-repo"><LockKeyhole/>Private local system</span>}<span className={project.changedFiles>0?"working":"clean"}>{project.changedFiles>0?"Work in progress":"Clean worktree"}</span></footer>
    </article>)}</section>

    <section className="build-lower-grid">
      <article className="build-panel relationship-panel"><div className="build-panel-head"><div><span>System architecture</span><h3>How the work compounds</h3></div><Network/></div><div className="relationship-list">{data.relationships.map((relation,index)=>{const from=byId.get(relation.from);const to=byId.get(relation.to);if(!from||!to)return null;return <div className="relationship" key={`${relation.from}-${relation.to}`}><i style={{"--from":from.color,"--to":to.color} as React.CSSProperties}>{index+1}</i><div><b>{from.name}</b><span>{relation.label}</span><b>{to.name}</b></div></div>})}</div></article>
      <article className="build-panel commit-feed"><div className="build-panel-head"><div><span>Recent artifacts</span><h3>The work, not a status report</h3></div><RadioTower/></div>{data.recentCommits.slice(0,10).map(commit=><div className="commit-row" key={`${commit.projectId}-${commit.sha}`}><GitBranch/><div><b>{commit.message}</b><small>{commit.projectName} · {commit.sha}</small></div><time>{relativeDate(commit.timestamp)}</time></div>)}</article>
    </section>

    <section className="build-attention"><div><Sparkles/><span>Current concentration</span></div><p>Wyloc, the two Lander surfaces, Human Repo, and this Control Plane are not parallel hobbies. Memory infrastructure, accumulated agent experience, career execution, and personal action are converging into one reusable architecture—while each product remains independently useful.</p></section>

    {githubOpen&&<div className="github-sync-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setGithubOpen(false)}}><section className="github-sync-dialog" role="dialog" aria-modal="true"><header><div><span>Daily private repository sync</span><h2>Make the graph move without your Mac.</h2></div><button onClick={()=>setGithubOpen(false)}><X/></button></header><p>The public repositories refresh every morning through GitHub Actions. Add a fine-grained read-only token here once to include private Wyloc, Lander, and demo repositories through the encrypted bridge.</p><div className="github-sync-status"><LockKeyhole/><div><b>{contentRepository.isUnlocked()?"Private bridge unlocked":"Unlock the bridge in Content → Data controls first"}</b><span>The token is encrypted server-side and never enters Git history or the generated dashboard.</span></div></div><label>GitHub fine-grained token<input type="password" value={githubToken} onChange={event=>setGithubToken(event.target.value)} placeholder="github_pat_…"/></label>{githubNote&&<small>{githubNote}</small>}<footer><button onClick={()=>setGithubOpen(false)}>Close</button><button disabled={!contentRepository.isUnlocked()||!githubToken||githubBusy} onClick={()=>void(async()=>{setGithubBusy(true);try{await contentRepository.configureGitHub(githubToken);await contentRepository.syncGitHub();const overlay=await contentRepository.getBuildOverlay();if(overlay.build)setLive(overlay.build as unknown as LiveBuild);setLiveSource("private GitHub sync");setGithubToken("");setGithubNote("Encrypted, synced, and scheduled daily.")}catch(problem){setGithubNote(problem instanceof Error?problem.message:"GitHub sync failed")}finally{setGithubBusy(false)}})()}><RefreshCw className={githubBusy?"spin":""}/>{githubBusy?"Syncing…":"Encrypt + sync now"}</button></footer></section></div>}
  </div>;
}
