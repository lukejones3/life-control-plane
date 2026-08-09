import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const owner=process.env.GITHUB_OWNER||"lukejones3";
const token=process.env.GITHUB_TOKEN||"";
const output=join(process.cwd(),"public","data","build-snapshot.json");
const projects=[
  {id:"wyloc",name:"Wyloc",repo:"wyloc"},
  {id:"lander-data",name:"Lander data platform",repo:"job-market-analytics"},
  {id:"lander-product",name:"Lander product",repo:"lander"},
  {id:"life-control-plane",name:"Life Control Plane",repo:"life-control-plane"},
  {id:"life-topology-lab",name:"Life Topology Lab",repo:"life-topology-lab"},
  {id:"portfolio",name:"Evidence portfolio",repo:"luke-jones-portfolio"},
  {id:"wyloc-demo",name:"Wyloc demo",repo:"wyloc-demo"},
  {id:"wyloc-site",name:"Wyloc site",repo:"wyloc-site"},
];
const headers={Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28",...(token?{Authorization:`Bearer ${token}`}:{})};
const cutoff=new Date();cutoff.setUTCHours(0,0,0,0);cutoff.setUTCDate(cutoff.getUTCDate()-363);
const ignored=/^chore\(data\): refresh build snapshot/i;

async function github(path){const response=await fetch(`https://api.github.com${path}`,{headers});if(response.status===404)return null;if(!response.ok)throw new Error(`GitHub ${response.status}: ${await response.text()}`);return response.json()}
async function commits(repo){const all=[];for(let page=1;page<=10;page+=1){const rows=await github(`/repos/${owner}/${repo}/commits?since=${encodeURIComponent(cutoff.toISOString())}&per_page=100&page=${page}`);if(!rows?.length)break;all.push(...rows);if(rows.length<100)break}return all.filter(row=>!ignored.test(row.commit?.message||""))}
const inspected=[];const activity=[];
for(const project of projects){try{const [meta,rows]=await Promise.all([github(`/repos/${owner}/${project.repo}`),commits(project.repo)]);if(!meta)continue;const normalized=rows.map(row=>({projectId:project.id,projectName:project.name,sha:String(row.sha).slice(0,7),timestamp:row.commit?.committer?.date||row.commit?.author?.date,message:String(row.commit?.message||"").split("\n")[0]})).filter(row=>row.timestamp);activity.push(...normalized);inspected.push({...project,repository:meta.html_url,defaultBranch:meta.default_branch,commits7d:normalized.filter(row=>Date.now()-new Date(row.timestamp).getTime()<=7*86400000).length,commits30d:normalized.filter(row=>Date.now()-new Date(row.timestamp).getTime()<=30*86400000).length,lastCommitAt:normalized[0]?.timestamp||null,lastCommitMessage:normalized[0]?.message||null})}catch(problem){console.warn(`${project.repo}: ${problem.message}`)}}
const counts=new Map();for(const commit of activity){const day=commit.timestamp.slice(0,10);counts.set(day,(counts.get(day)||0)+1)}
const contributionDays=[];for(let index=0;index<364;index+=1){const cursor=new Date(cutoff);cursor.setUTCDate(cursor.getUTCDate()+index);const date=cursor.toISOString().slice(0,10);const count=counts.get(date)||0;contributionDays.push({date,count,level:count===0?0:count===1?1:count<=3?2:count<=6?3:4})}
const payload={schemaVersion:1,generatedAt:new Date().toISOString(),owner,totals:{commits7d:inspected.reduce((sum,item)=>sum+item.commits7d,0),commits30d:inspected.reduce((sum,item)=>sum+item.commits30d,0),activeProjects:inspected.filter(item=>item.commits30d>0).length},projects:inspected,contributionDays,recentCommits:activity.sort((a,b)=>b.timestamp.localeCompare(a.timestamp)).slice(0,30)};
await mkdir(dirname(output),{recursive:true});await writeFile(output,`${JSON.stringify(payload,null,2)}\n`);console.log(`Generated ${output} from ${inspected.length} public repositories.`);
