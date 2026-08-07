import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, BriefcaseBusiness, Building2, Car, Check,
  ChevronRight, CircleDollarSign, Compass, Dumbbell, Film, Gauge,
  HeartHandshake, Home, ListChecks, Music2, Plane, Plus, RefreshCw,
  Download, LockKeyhole, Search, Sparkles, WalletCards, Wrench,
} from "lucide-react";
import { demoData } from "./demoData";
import { getCredential, LocalCredential } from "./auth";
import { LockScreen } from "./LockScreen";
import { RecruiterSprint } from "./RecruiterSprint";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type View = "home"|"career"|"recruiters"|"money"|"move"|"people"|"music"|"build"|"content"|"admin"|"car";
type Task = {id:number;text:string;done:boolean;area:string};
const defaultTasks: Task[] = [
  {id:1,text:"Renew vehicle registration",done:false,area:"Car"},
  {id:2,text:"Prepare interview examples",done:false,area:"Career"},
  {id:3,text:"Book dental cleaning",done:true,area:"Health"},
  {id:4,text:"Buy groceries",done:false,area:"Home"},
];
const nav: {id:View;label:string;icon:typeof Home;color:string}[] = [
  {id:"home",label:"Control center",icon:Home,color:"#75e6b6"},
  {id:"career",label:"Career",icon:BriefcaseBusiness,color:"#74b9ff"},
  {id:"recruiters",label:"Recruiters",icon:HeartHandshake,color:"#75e6b6"},
  {id:"money",label:"Money",icon:CircleDollarSign,color:"#f6c86b"},
  {id:"move",label:"Move",icon:Compass,color:"#fb8f67"},
  {id:"people",label:"People",icon:HeartHandshake,color:"#fb7185"},
  {id:"music",label:"Music",icon:Music2,color:"#c4a7ff"},
  {id:"build",label:"Build",icon:Wrench,color:"#72dfd0"},
  {id:"content",label:"Content",icon:Film,color:"#f59eac"},
  {id:"admin",label:"Life admin",icon:ListChecks,color:"#f1d27a"},
  {id:"car",label:"Car",icon:Car,color:"#79b8ff"},
];

const titles: Record<View,[string,string]> = {
  home:["Good morning","Everything that needs your attention, without the hunt."],
  career:["Career control center","Applications, evidence, interviews, and momentum."],
  recruiters:["Recruiter sprint","Research, approve, contact, follow up, and get submitted."],
  money:["Financial command","Accounts, obligations, runway, and controls."],
  move:["Move planner","A decision becomes a sequence of executable steps."],
  people:["Your people","Living context—not a static address book."],
  music:["Music laboratory","Listen, capture, experiment, preserve, create."],
  build:["Systems you own","Projects measured through artifacts and movement."],
  content:["Content studio","Ideas, drafts, publishing, and audience signals."],
  admin:["Life administration","Maintenance leaves your head and enters the system."],
  car:["Vehicle command","Fuel, maintenance, insurance, and registration."],
};

function Card({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <section className={`card ${className}`}>{children}</section>;
}
function Head({eyebrow,title,action}:{eyebrow:string;title:string;action?:string}) {
  return <div className="card-head"><div><span>{eyebrow}</span><h3>{title}</h3></div>{action&&<button className="quiet">{action}<ChevronRight size={14}/></button>}</div>;
}
function Badge({children,tone=""}:{children:React.ReactNode;tone?:string}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export default function App() {
  const platformAuth = import.meta.env.VITE_PLATFORM_AUTH === "true";
  const [credential,setCredential] = useState<LocalCredential|null>(()=>platformAuth ? {username:"Luke",salt:"",hash:""} : getCredential());
  const [unlocked,setUnlocked] = useState(()=>platformAuth || sessionStorage.getItem("lcp-unlocked")==="yes");
  const [installPrompt,setInstallPrompt] = useState<InstallPromptEvent|null>(null);
  const [view,setView] = useState<View>(()=>(localStorage.getItem("demo-view") as View)||"home");
  const [tasks,setTasks] = useState<Task[]>(()=>JSON.parse(localStorage.getItem("demo-tasks")||"null") as Task[]||defaultTasks);
  const [note,setNote] = useState("");
  const [savedNotes,setSavedNotes] = useState<string[]>(()=>JSON.parse(localStorage.getItem("demo-notes")||"[]"));
  useEffect(()=>localStorage.setItem("demo-view",view),[view]);
  useEffect(()=>localStorage.setItem("demo-notes",JSON.stringify(savedNotes)),[savedNotes]);
  useEffect(()=>localStorage.setItem("demo-tasks",JSON.stringify(tasks)),[tasks]);
  useEffect(()=>{
    const capture=(event:Event)=>{event.preventDefault();setInstallPrompt(event as InstallPromptEvent)};
    window.addEventListener("beforeinstallprompt",capture);
    return ()=>window.removeEventListener("beforeinstallprompt",capture);
  },[]);
  const openTasks=useMemo(()=>tasks.filter(t=>!t.done).length,[tasks]);
  const [title,subtitle]=titles[view];

  if (!platformAuth && (!credential || !unlocked)) return <LockScreen credential={credential} onUnlock={next=>{setCredential(next);sessionStorage.setItem("lcp-unlocked","yes");setUnlocked(true)}}/>;

  const lock=()=>{sessionStorage.removeItem("lcp-unlocked");setUnlocked(false)};
  const install=async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;setInstallPrompt(null)}else alert("On iPhone: tap Share, then Add to Home Screen. On Android: open the browser menu and tap Install app.")};

  return <div className="shell">
    <aside>
      <div className="brand"><div className="brand-mark"><Sparkles size={18}/></div><div><b>Life</b><span>Control Plane</span></div></div>
      <nav>{nav.map(item=><button key={item.id} className={view===item.id?"active":""} onClick={()=>setView(item.id)} style={{"--accent":item.color} as React.CSSProperties}><item.icon size={17}/><span>{item.label}</span>{item.id==="admin"&&openTasks>0&&<i>{openTasks}</i>}</button>)}</nav>
      <div className="privacy"><Gauge size={16}/><div><b>Demo mode</b><span>Synthetic data only</span></div></div>
      <button className="profile" onClick={platformAuth ? undefined : lock} title={platformAuth ? "Identity protected by Vercel" : "Lock this app"}><span>{credential?.username.slice(0,2).toUpperCase()}</span><div><b>{credential?.username}</b><small>{platformAuth ? "Private account" : "Tap to lock"}</small></div><LockKeyhole size={15}/></button>
    </aside>
    <main>
      <header><div><p>{new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</p><h1>{title}</h1><span>{subtitle}</span></div><div className="header-actions"><button onClick={install}><Download size={16}/>Install</button><button><Search size={16}/>Search</button><button><RefreshCw size={16}/>Refresh</button><button className="primary"><Plus size={16}/>Capture</button>{!platformAuth&&<button className="mobile-lock" onClick={lock} aria-label="Lock app"><LockKeyhole size={16}/></button>}</div></header>
      {view==="home"&&<HomeView setView={setView} />}
      {view==="career"&&<CareerView />}
      {view==="recruiters"&&<RecruiterSprint />}
      {view==="money"&&<MoneyView />}
      {view==="move"&&<MoveView />}
      {view==="people"&&<PeopleView />}
      {view==="music"&&<MusicView note={note} setNote={setNote} saved={savedNotes} setSaved={setSavedNotes}/>}
      {view==="build"&&<BuildView />}
      {view==="content"&&<ContentView />}
      {view==="admin"&&<AdminView tasks={tasks} setTasks={setTasks}/>}
      {view==="car"&&<CarView />}
    </main>
  </div>;
}

function HomeView({setView}:{setView:(v:View)=>void}) {
  return <div className="page">
    <div className="hero">
      <div><span className="kicker">Tuesday · system pulse</span><h2>Your life has <em>three things</em> worth seeing.</h2><p>No feeds. No vague score. Just current state, evidence, and the next useful action.</p></div>
      <div className="orbit"><div><Activity/><b>82</b><span>steady</span></div></div>
    </div>
    <div className="alerts">{demoData.alerts.map(a=><div className={`alert ${a.tone}`} key={a.title}><i/><div><b>{a.title}</b><span>{a.detail}</span></div><button>{a.action}<ArrowUpRight size={13}/></button></div>)}</div>
    <div className="pulse">{demoData.pulse.map(p=><Card key={p.label} className={`pulse-card ${p.tone}`}><span>{p.label}</span><strong>{p.value}</strong><small>{p.note}</small></Card>)}</div>
    <div className="grid two">
      <Card><Head eyebrow="Today" title="Your operating sequence" action="Open admin"/><div className="timeline">{[
        ["08:30","Deep work","Finish data-quality validation"],
        ["12:15","Reset","Lunch · short walk"],
        ["15:00","Career","Interview preparation"],
        ["18:30","Body","Strength session"],
        ["20:30","Create","Music or project block"],
      ].map((x,i)=><div key={x[0]}><time>{x[0]}</time><i className={i===0?"now":""}/><p><b>{x[1]}</b><span>{x[2]}</span></p></div>)}</div></Card>
      <Card className="gradient-card"><Head eyebrow="System insight" title="The scattered layer is shrinking"/><div className="insight"><Sparkles/><p>Three obligations that previously lived in email, memory, and a provider portal now resolve from one surface.</p><button onClick={()=>setView("admin")}>See the control graph <ArrowUpRight size={14}/></button></div></Card>
    </div>
    <div className="module-strip">{nav.slice(1,7).map(item=><button key={item.id} onClick={()=>setView(item.id)} style={{"--accent":item.color} as React.CSSProperties}><item.icon/><span>{item.label}</span><ChevronRight/></button>)}</div>
  </div>;
}

function CareerView() {
  return <div className="page"><div className="metric-row"><Metric value="18" label="Applications"/><Metric value="7" label="Active"/><Metric value="3" label="Interviews"/><Metric value="16.7%" label="Response rate"/></div>
    <Card><Head eyebrow="Application ledger" title="Every outcome has evidence" action="Import email"/><div className="job-list">{demoData.applications.map(j=><div className={`job ${j.status}`} key={j.company}><div className="company">{j.company[0]}</div><div><b>{j.role}</b><span>{j.company} · {j.location}</span></div><strong>{j.pay}</strong><Badge tone={j.status}>{j.status}</Badge><button><ArrowUpRight/></button></div>)}</div></Card>
    <div className="grid two"><Card><Head eyebrow="Funnel" title="Where applications move"/><div className="funnel"><div style={{width:"100%"}}>18 applied</div><div style={{width:"72%"}}>13 reviewed</div><div style={{width:"38%"}}>7 active</div><div style={{width:"17%"}}>3 interviews</div></div></Card><Card><Head eyebrow="Documents" title="Current resume set"/>{["Data engineering","Analytics engineering","Technical product"].map((x,i)=><div className="doc" key={x}><span>DOC</span><div><b>{x}</b><small>Updated {i+2} days ago</small></div><button>Open</button></div>)}</Card></div>
  </div>;
}

function MoneyView() {
  return <div className="page"><div className="money-hero"><div><span>Estimated net position</span><strong>$22,496</strong><small>Demo balances · refreshed 8 minutes ago</small></div><div><span>Monthly obligations</span><strong>$2,486</strong><small>73% covered by recurring income</small></div><button><WalletCards/>Connect institution</button></div>
    <div className="grid two"><Card><Head eyebrow="Accounts" title="One financial graph"/>{demoData.accounts.map(a=><div className="money-row" key={a.name}><div><b>{a.institution} · {a.name}</b><span>{a.meta}</span></div><strong>{a.amount}</strong></div>)}</Card><Card><Head eyebrow="Bills" title="Upcoming obligations"/>{demoData.bills.map(b=><div className="money-row" key={b.name}><button className={`check ${b.paid?"done":""}`}><Check/></button><div><b>{b.name}</b><span>Due {b.due}</span></div><strong>{b.amount}</strong></div>)}</Card></div>
    <Card><Head eyebrow="Control surface" title="Connected rails"/><div className="connectors">{[["Email","Bill and renewal evidence","Live"],["Plaid","Accounts, transactions, liabilities","Demo"],["Virtual cards","Merchant controls and spending caps","Ready"],["Calendar","Due dates and recurring obligations","Live"]].map(x=><div key={x[0]}><span>{x[0][0]}</span><p><b>{x[0]}</b><small>{x[1]}</small></p><Badge>{x[2]}</Badge></div>)}</div></Card>
  </div>;
}

function MoveView() {
  return <div className="page"><div className="move-hero"><div><span>Target window</span><strong>October</strong><small>84 days · destination demo</small></div><div className="move-line"><i/><i/><i/><i/></div><div><b>Offer</b><b>Housing</b><b>Departure</b><b>Arrival</b></div></div>
    <div className="grid two"><Card><Head eyebrow="Critical path" title="What must become true"/>{["Secure location-compatible work","Build move-now cash threshold","Choose three neighborhoods","Prepare documents and departure sequence"].map((x,i)=><div className="step" key={x}><span>{i+1}</span><p><b>{x}</b><small>{i<1?"Active now":"Waiting on prior dependency"}</small></p><Badge tone={i===0?"applied":""}>{i===0?"moving":"queued"}</Badge></div>)}</Card><Card><Head eyebrow="Neighborhood board" title="Shortlist by lived fit"/>{[["North Loop","92","Transit · music · walkability"],["Cedar District","87","Value · community · light rail"],["Harbor Hill","81","Quiet · water · central access"]].map(x=><div className="hood" key={x[0]}><strong>{x[1]}</strong><p><b>{x[0]}</b><span>{x[2]}</span></p><button>Save</button></div>)}</Card></div>
  </div>;
}

function PeopleView() {
  return <div className="page"><div className="people-hero"><div><span>Relationship pulse</span><strong>3 people</strong><small>with current context worth carrying</small></div><button><Plus/>Add person</button></div>
    <div className="people-grid">{demoData.people.map(p=><Card key={p.name}><div className="avatar" style={{background:p.color}}>{p.name.split(" ").map(x=>x[0]).join("")}</div><h3>{p.name}</h3><span>{p.relation}</span><p>{p.context}</p><footer><small>Last contact · {p.last}</small><button>Message</button></footer></Card>)}</div>
    <Card><Head eyebrow="Context timeline" title="Moments you decided to remember"/>{[["Jul 24","Noah confirmed the autumn travel window."],["Jul 19","Maya started apartment searching."],["Jul 12","Sam accepted the new role."]].map(x=><div className="ledger" key={x[0]}><time>{x[0]}</time><p>{x[1]}</p></div>)}</Card>
  </div>;
}

function MusicView({note,setNote,saved,setSaved}:{note:string;setNote:(x:string)=>void;saved:string[];setSaved:(x:string[])=>void}) {
  return <div className="page"><div className="music-hero"><div className="record"><Music2/></div><div><span>2026 listening identity</span><h2>Sound is becoming an instrument.</h2><p>Listening history beside the fragments that could become something original.</p></div></div>
    <div className="grid two"><Card><Head eyebrow="Capture" title="Phrase, lyric, chord, texture"/><textarea value={note} onChange={e=>setNote(e.target.value)} aria-label="Music note"/><button className="save" onClick={()=>{if(note.trim()){setSaved([note.trim(),...saved]);setNote("")}}}>Save fragment</button>{saved.map((x,i)=><div className="fragment" key={i}><p>{x}</p><button onClick={()=>setSaved(saved.filter((_,j)=>i!==j))}>×</button></div>)}</Card><Card><Head eyebrow="Listening signal" title="Current rotation"/>{demoData.songs.map((s,i)=><div className="song" key={s.title}><span>{i+1}</span><p><b>{s.title}</b><small>{s.artist}</small></p><strong>{s.plays}</strong></div>)}</Card></div>
  </div>;
}

function BuildView() {
  return <div className="page"><div className="build-banner"><div><span>This week</span><strong>14 commits</strong><small>Across three active systems</small></div><div className="heat">{Array.from({length:28},(_,i)=><i key={i} style={{opacity:.16+((i*7)%10)/12}}/>)}</div></div>
    <div className="project-grid">{demoData.projects.map(p=><Card key={p.name}><div className="project-art" style={{"--p":p.color} as React.CSSProperties}><Building2/></div><Badge>{p.stage}</Badge><h3>{p.name}</h3><p>{p.next}</p><footer><span>{p.commits} commits this week</span><button>Repository <ArrowUpRight/></button></footer></Card>)}</div>
  </div>;
}

function ContentView() {
  return <div className="page"><div className="content-hero"><div><span>Audience</span><strong>42.8K</strong><small>+3.2% this month</small></div><div><span>Published</span><strong>18</strong><small>Across short and long form</small></div><button><Plus/>New idea</button></div>
    <div className="grid two"><Card><Head eyebrow="Idea bank" title="The work waiting to be made"/>{["Why old systems survive","Building a searchable personal archive","What AI changes about learning","The hidden architecture of ordinary work"].map((x,i)=><div className="idea" key={x}><span>{String(i+1).padStart(2,"0")}</span><p><b>{x}</b><small>{i%2?"Essay / video":"Long-form video"}</small></p><button>Develop</button></div>)}</Card><Card><Head eyebrow="Pipeline" title="From thought to artifact"/>{["Capture","Research","Outline","Record","Edit","Publish"].map((x,i)=><div className="pipeline" key={x}><i className={i<2?"done":""}/><b>{x}</b><span>{[12,4,2,1,0,18][i]}</span></div>)}</Card></div>
  </div>;
}

function AdminView({tasks,setTasks}:{tasks:Task[];setTasks:React.Dispatch<React.SetStateAction<Task[]>>}) {
  const [value,setValue]=useState("");
  return <div className="page"><div className="admin-hero"><ListChecks/><div><span>Open loop count</span><strong>{tasks.filter(t=>!t.done).length}</strong><small>Every obligation has one owner and one next action.</small></div></div>
    <Card><Head eyebrow="Unified task layer" title="What requires action"/><form className="task-form" onSubmit={e=>{e.preventDefault();if(value.trim()){setTasks(t=>[...t,{id:Date.now(),text:value.trim(),done:false,area:"Inbox"}]);setValue("")}}}><input value={value} onChange={e=>setValue(e.target.value)} placeholder="Add an obligation"/><button><Plus/>Add</button></form>{tasks.map(t=><div className={`task ${t.done?"done":""}`} key={t.id}><button onClick={()=>setTasks(all=>all.map(x=>x.id===t.id?{...x,done:!x.done}:x))}><Check/></button><p><b>{t.text}</b><span>{t.area}</span></p><Badge>{t.done?"complete":"open"}</Badge></div>)}</Card>
    <div className="grid three"><Mini icon={Plane} title="Travel" value="1 upcoming" note="Documents ready"/><Mini icon={Dumbbell} title="Health" value="3 sessions" note="This week"/><Mini icon={Home} title="Home" value="2 tasks" note="One due today"/></div>
  </div>;
}

function CarView() {
  return <div className="page"><div className="car-hero"><div className="car-shape"><Car/></div><div><span>Demo vehicle</span><h2>2021 Compact SUV</h2><p>41,280 miles · last synced today</p></div><Badge tone="applied">All systems clear</Badge></div>
    <div className="metric-row"><Metric value="286 mi" label="Estimated range"/><Metric value="3,720 mi" label="Until oil service"/><Metric value="$18.4K" label="Estimated value"/><Metric value="12 days" label="Registration due"/></div>
    <div className="grid two"><Card><Head eyebrow="Maintenance" title="Known service timeline"/>{[["Oil and filter","38,104 mi","Complete"],["Tire rotation","38,104 mi","Complete"],["Registration renewal","Aug 10","Upcoming"],["Annual inspection","Oct 22","Scheduled"]].map(x=><div className="service" key={x[0]}><i/><p><b>{x[0]}</b><span>{x[1]}</span></p><Badge>{x[2]}</Badge></div>)}</Card><Card><Head eyebrow="Coverage" title="Insurance and documents"/><div className="policy"><span>Demo Mutual</span><strong>$126 / month</strong><small>Paid through August · policy documents linked locally</small><button>Open provider portal <ArrowUpRight/></button></div></Card></div>
  </div>;
}

function Metric({value,label}:{value:string;label:string}) { return <Card className="metric"><strong>{value}</strong><span>{label}</span></Card> }
function Mini({icon:Icon,title,value,note}:{icon:typeof Plane;title:string;value:string;note:string}) { return <Card className="mini"><Icon/><div><span>{title}</span><strong>{value}</strong><small>{note}</small></div></Card> }
