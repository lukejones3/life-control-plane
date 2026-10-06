export type RecruiterSegment = "Seattle / PNW" | "National remote" | "Contract / C2H";
export type RecruiterStatus = "researched" | "ready" | "approved" | "contacted" | "replied" | "call booked" | "submitted" | "inactive";

export type Recruiter = {
  id: number; name: string; firm: string; title: string; segment: RecruiterSegment;
  focus: string; evidence: string; evidenceUrl: string; linkedin: string;
  email?: string; contact: string; opening: string; openingUrl: string;
  match: string; priority: number; channel: "LinkedIn" | "Email"; resume: "Data / BI" | "Data engineering" | "Applied AI";
};

const firmContacts: Record<string,string> = {
  "TEKsystems":"https://www.teksystems.com/en/contact-us", "Insight Global":"https://insightglobal.com/contact/",
  "Apex Systems":"https://www.apexsystems.com/contact-us", "Motion Recruitment":"https://motionrecruitment.com/contact-us",
  "Brooksource":"https://www.brooksource.com/contact-us/", "Emergent Staffing":"https://emergentstaffing.net/contact/",
  "Randstad Digital":"https://www.randstadusa.com/contact-us/", "Kforce":"https://www.kforce.com/contact-us/",
  "Vaco by Highspring":"https://www.vaco.com/contact/", Experis:"https://www.experis.com/en/contact-us",
  "The Judge Group":"https://www.judge.com/contact-us/", "Quadrant Technologies":"https://quadranttechnologies.com/contact-us/",
};
const jobs: Record<string,string> = {
  "TEKsystems":"https://www.teksystems.com/en/careers", "Insight Global":"https://jobs.insightglobal.com/",
  "Apex Systems":"https://www.apexsystems.com/job-search", "Motion Recruitment":"https://motionrecruitment.com/tech-jobs",
  "Brooksource":"https://www.brooksource.com/jobs/", "Emergent Staffing":"https://emergentstaffing.net/jobs/",
  "Randstad Digital":"https://www.randstadusa.com/jobs/", "Kforce":"https://www.kforce.com/find-work/search-jobs/",
  "Vaco by Highspring":"https://jobs.vaco.com/", Experis:"https://www.experis.com/en/search-jobs",
  "The Judge Group":"https://www.judge.com/jobs/", "Quadrant Technologies":"https://quadranttechnologies.com/careers/",
};

type Seed = [string,string,string,RecruiterSegment,string,string,string,number,Recruiter["resume"],string?];
const seeds: Seed[] = [
 ["Lance Phetkanya","TEKsystems","Recruiter","Seattle / PNW","Seattle IT contract placement; active TEKsystems tenure and 2025 credential","https://www.linkedin.com/in/lance-phetkanya","Existing TEKsystems route plus production SQL/Python systems",98,"Data engineering"],
 ["Charlotte Nygaard","Emergent Staffing","Senior Technical Recruiter","Seattle / PNW","Posted Seattle systems/operations direct-hire role 3 weeks ago","https://www.linkedin.com/in/charlotte-nygaard","Seattle business-systems opening maps to automation and implementation work",97,"Data / BI"],
 ["Victoria Turner","Apex Systems","Lead Recruiter","Seattle / PNW","Bellevue recruiter; recent profile activity and Seattle contract placement record","https://www.linkedin.com/in/victoriayturner","Apex contract desk plus broad technical/data background",96,"Data engineering"],
 ["Veronica Carlberg","Motion Recruitment","Technical Recruiter","Seattle / PNW","Currently sharing a Seattle-area direct-hire technical role","https://www.linkedin.com/in/ronicarlberg","Seattle direct-hire desk and shipped technical systems",95,"Applied AI"],
 ["Matthew Suk","Insight Global","IT Recruiter","Seattle / PNW","Current Seattle profile specializes in high-level IT staffing","https://www.linkedin.com/in/matthew-suk-18773a194","IT desk fits SQL/Python, automation, and technical implementation",94,"Data engineering"],
 ["Anna Retzlaff","Brooksource","Technical Staffing Leader","Seattle / PNW","Current Seattle Brooksource profile with Amazon contract-placement evidence","https://www.linkedin.com/in/anna-retzlaff-aa89ba161","Local contract desk and production platform evidence",93,"Data engineering"],
 ["Rachel Tapley","Emergent Staffing","Recruitment Expert","Seattle / PNW","Current Seattle staffing profile; active remote IT hiring activity","https://www.linkedin.com/in/rachel-tapley-a2a78488","Local boutique desk values business context plus technical execution",92,"Data / BI"],
 ["Eric Matson","TEKsystems","Professional Recruiter","Seattle / PNW","Current Seattle TEKsystems profile and active placement evidence","https://www.linkedin.com/in/eric-matson-3a3b0519a","Warm firm adjacency: current TEKsystems contractor with technical delivery",91,"Data engineering"],
 ["Sarah Bolds","Apex Systems","Technical Recruiting Leader","Seattle / PNW","Current Apex profile with multiple Seattle recruiter awards and Microsoft placements","https://www.linkedin.com/in/sarahbolds","Seattle enterprise contract experience and production data systems",90,"Data / BI"],
 ["Jonathan James","Apex Systems","Full-cycle IT Recruiter","Seattle / PNW","Current Seattle profile describes full-cycle IT staffing","https://www.linkedin.com/in/jonathan-james-74222b238","Broad IT desk matches cross-functional analytics and implementation",89,"Data / BI"],
 ["Sophia Mosshart","Insight Global","Recruiting Leader","Seattle / PNW","Seattle Insight Global profile active within the last week","https://www.linkedin.com/in/sophia-mosshart-1b0b09117","Local IG network can route a multi-family technical profile",88,"Data / BI"],
 ["Sammie Nettleton","Insight Global","Recruiting Leader","Seattle / PNW","Current Bellevue office profile with recent recruiting activity","https://www.linkedin.com/in/sammie-nettleton-06630480","Bellevue client network and flexible contract/direct-hire target",87,"Data / BI"],
 ["Erin Freese","Insight Global","Recruiter","Seattle / PNW","Current Seattle profile; recruiter training activity surfaced recently","https://www.linkedin.com/in/erin-freese","Local recruiter; ask for referral to IT/data desk",82,"Data / BI"],
 ["Jyothi Mallapureddy","Quadrant Technologies","Senior Technical Recruiter","Seattle / PNW","Posted remote contract Data Engineer role using Python, SQL, Fabric and Databricks","https://www.linkedin.com/in/jyothi-mallapureddy-a6b4291a3","Exact SQL/Python pipeline overlap; Seattle-based contract recruiter",96,"Data engineering","jyothi.mallapureddy|quadranttechnologies.com"],
 ["Peter Hale","Advantis Global","Senior Technical Recruiter","Seattle / PNW","Seattle hybrid Data Scientist and Data Engineer contract posts","https://www.linkedin.com/in/peter-hale-234355225","Seattle contract desk and multi-source data-platform experience",86,"Data engineering"],
 ["Ryan Lampe","Kforce","Talent Recruiting Leader","Seattle / PNW","Current Bellevue Kforce profile and technology staffing history","https://www.linkedin.com/in/ryan-lampe-49b9949","Local Kforce desk; open to contract and direct hire",81,"Data / BI"],
 ["Reece Yecpot","TEKsystems","Technical Recruiter","Seattle / PNW","Seattle-area profile includes a data-engineering specialty transition","https://www.linkedin.com/in/reece-yecpot","TEKsystems connection and data-engineering positioning",85,"Data engineering"],
 ["Ryan Sullivan Johnson","Expedia Group","Senior Technical Recruiter","Seattle / PNW","Active Seattle engineering/product recruiting profile","https://www.linkedin.com/in/ryan-sullivan-johnson-742471204","Lower staffing priority, but Seattle technical-product systems fit",74,"Applied AI"],
 ["Nick Lehner","Motion Recruitment","Technical Recruiter","Seattle / PNW","Current Motion profile with PNW technical placement history","https://www.linkedin.com/in/nick-lehner-33430298","PNW technical desk and implementation/automation breadth",76,"Data engineering"],
 ["Jeff Sawhill","TEKsystems","Data-focused Technical Recruiter","Seattle / PNW","Public recruiter activity identifies a TEKsystems data-engineering and cloud specialty","https://www.linkedin.com/search/results/people/?keywords=Jeff%20Sawhill%20TEKsystems","Data engineering specialty plus current TEKsystems contractor route",84,"Data engineering","jsawhill|teksystems.com"],

 ["Taylor Mazzie","Motion Recruitment","Senior Talent Recruiter","National remote","Returned to Motion; currently recruiting a full-time remote Senior Data Engineer","https://www.linkedin.com/in/taylorkmazzie","Remote data engineering plus shipped pipelines and PostgreSQL",97,"Data engineering"],
 ["Colleen Bott","Randstad Digital","Principal Recruiter","National remote","Posted 100% remote data/DevOps W2 consulting roles and returned hands-on in 2026","https://www.linkedin.com/in/colleen-bott-18450548","Remote consulting desk and production infrastructure experience",95,"Data engineering"],
 ["Paddy Beauchamp","Motion Recruitment","Team Manager","National remote","Posted active Python data engineering and applied-AI roles within months","https://www.linkedin.com/in/paddy-beauchamp-60448985","Python/data/AI systems align, though many openings are NYC hybrid",90,"Applied AI"],
 ["Braylee C.","Vaco by Highspring","IT Recruiter","National remote","Recent direct-hire Power BI/Data Engineer posts using SQL and Python","https://www.linkedin.com/in/brayleeschlumpf","Exact BI + pipeline builder positioning",89,"Data / BI"],
 ["Harrison Pham","Vaco by Highspring","Technical Recruiter","National remote","Shared remote 12-month SQL/Python Supply Chain Analyst role 2 weeks ago","https://www.linkedin.com/in/hpham-techrecruiter","Exact SQL/Python automation match for remote analyst contract",94,"Data / BI"],
 ["Markeda Tadesse","Motion Recruitment","Technical Recruiter","National remote","Data analytics and Python/Scala remote-role recruiting evidence","https://www.linkedin.com/in/markeda-tadesse-86844a13b","Analytics plus Python systems background",84,"Data engineering"],
 ["Tara Wakeley","Experis","Senior Technical Recruiter","National remote","Experis profile with remote contract and audit-analytics hiring evidence","https://www.linkedin.com/in/tara-wakeley-7b4080159","Remote contract desk and analytics/automation crossover",86,"Data / BI"],
 ["Amanda Will","PrizePicks","Senior Technical Talent Partner","National remote","Current data-engineer hiring activity across data, analytics and product","https://www.linkedin.com/in/willmandy","Production product/data systems fit, though internal rather than agency",78,"Applied AI"],
 ["Emily Spence","Huntress","Technical Recruiting Leader","National remote","Current profile surfaced a remote Staff Analytics Engineer opening","https://www.linkedin.com/in/emilyspence","Analytics engineering and production security-product evidence",83,"Applied AI"],
 ["Allen Chai","Pendentive Talent","Technical Recruiter","National remote","Current recruiting activity; documented MLOps and Data Engineer searches","https://www.linkedin.com/in/chaiallen","Applied AI, data engineering, infrastructure and shipped products",88,"Applied AI"],

 ["Nikhil Arora","iMettle Consulting","Senior Technical Recruiter","Contract / C2H","Posted a contract-to-hire technical role within the last week","https://www.linkedin.com/in/nikhil-arora1","W2/C2H desk and Python/SQL production background",82,"Data engineering"],
 ["Saurav Kumar","The Judge Group","Senior Technical Recruiter","Contract / C2H","Currently associated with remote Databricks contract recruiting","https://www.linkedin.com/in/saurav-kumar-33a7a4206","Remote data contracts and data-platform positioning",83,"Data engineering"],
 ["Chintada Annapurna","SRI Tech Solutions","Senior Technical Recruiter","Contract / C2H","Posted data-platform/AI/Python contract opening within 5 months","https://www.linkedin.com/in/chintada-annapurna-557264232","Python, data platform and applied-AI evidence",75,"Applied AI","anu.c|sritechsolutions.com"],
 ["Manne Anand","Conatus Tek","Technical Recruiter","Contract / C2H","Posts remote GCP analytics/data-engineer contract requirements","https://www.linkedin.com/in/manne-anand-708857238","Analytics engineering and remote contract focus",77,"Data engineering","anand.manne|conatustek.com"],
 ["Mohammad Sajida","BetaSharp","Senior Technical Recruiter","Contract / C2H","Posted junior Data Engineer contract and data-architecture roles","https://www.linkedin.com/in/mohammad-sajida","Early-career data engineering target and SQL pipelines",80,"Data engineering"],
 ["Sruthi A","IntraEdge","Technical Recruiter","Contract / C2H","Current profile surfaces remote GenAI and senior data-engineer contracts","https://www.linkedin.com/in/sruthi-a-6552b032a","Applied AI plus data pipelines and production systems",79,"Applied AI"],
 ["Manish Singh","HireTalent","Technical Recruiter","Contract / C2H","Current AI Data Engineer/RAG hybrid recruiting evidence","https://www.linkedin.com/in/manishsingh1004talent","Lander semantic matching and Wyloc applied-AI product",81,"Applied AI"],
 ["Daniel Lee","Motion Recruitment","Technical Recruiter","Contract / C2H","Posted 12-month dbt/Snowflake data engineering and technical BA contracts last month","https://au.linkedin.com/in/daniel-lee-14499a141","Exact dbt, data engineering and technical BA overlap; geography caveat",72,"Data engineering"],
 ["Christine Trykoski","Randstad Digital","Permanent Placement Recruiter","Contract / C2H","Active 2026 digital-transformation and AI hiring content","https://www.linkedin.com/in/christine-trykoski-randstad","Broad digital desk can route production analytics/AI profile",73,"Applied AI"],
 ["Josie Swift","Kforce","Technical Recruiter","Contract / C2H","Technical and finance/accounting technology placement evidence","https://www.linkedin.com/in/josie-swift-509305a6","Analytics role family plus flexible employment types",71,"Data / BI"],
];

const decodeEmail = (value?: string) => value?.replace("|","@");
export const recruiters: Recruiter[] = seeds.map((s,id) => {
  const [name,firm,title,segment,evidence,linkedin,match,priority,resume,email] = s;
  return {id:id+1,name,firm,title,segment,focus: resume === "Applied AI" ? "Applied AI, data and technical product" : resume === "Data engineering" ? "Data engineering, automation, SQL/Python" : "Analytics, BI and technical business analysis",evidence:`Verified from public profile/search on 2026-08-03: ${evidence}.`,evidenceUrl:linkedin,linkedin,email:decodeEmail(email),contact:firmContacts[firm] || linkedin,opening:evidence,openingUrl:jobs[firm] || linkedin,match,priority,channel:email?"Email":"LinkedIn",resume};
});
