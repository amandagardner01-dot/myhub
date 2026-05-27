import { useState } from "react";

function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const set = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, set];
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function now() { return new Date().toISOString(); }
function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtShort(iso) {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}
function fmtMoney(n) {
  const num = parseFloat(String(n || "0").replace(/,/g, ""));
  if (!num || isNaN(num)) return "--";
  return "$" + num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function parseMoney(s) { return parseFloat(String(s || "0").replace(/,/g, "")) || 0; }

const BR_CATEGORIES = ["Ground-Up Construction","Tenant Improvements","Cap Ex / Fit-Out","Solar & Specialty","Early Works","Pre-Dev / Demo"];
const BR_URGENCY_LEVELS = ["Active","In Progress","Pending","Monitor","ACTION REQUIRED","N/A"];
const BR_SEED_DATA = [
  { id:"br_cyp_b3", property:"CYP B3", projectName:"GCC Cypress B3", category:"Ground-Up Construction", stage:"Bound", gc:"Fullmer Construction", buildingType:"Industrial", sqft:"", carrier:"Aspen", policyEff:"2026-04-06", policyExp:"2027-01-31", startDate:"2026-04-06", completionDate:"2027-01-31", ball:"Me", tenantSigned:"No", urgencyLevel:"Active", contractType:"Owner-Contractor (GMP)", contractNum:"54564", contractStatus:"Executed", partnership:"Balance Sheet", eqRequired:"Decision Pending", floodRequired:"TBD", overview:"Ground-up construction. Contract 54564 Executed. EQ decision outstanding: V1 no EQ ~$12,489 prem OR V2 $1M EQ sublimit ~$70,437 prem (add. ~$57,948). Balance sheet asset = EQ discretionary. Alan Cockburn consulted.", policyNotes:"Policy reviewed vs BRQ. Filed. EQ decision pending.", policyReceived:true, reviewedVsBRQ:true, policyFiled:true, questions:[{ id:"q_cyp1", q:"EQ decision: V1 (no EQ, $12,489) or V2 ($1M EQ sublimit, $70,437)?", answer:"", status:"Open", ball:"Me", at:new Date().toISOString() }], docs:[{ id:"d_cyp1", name:"BR Policy - Aspen", type:"Policy", at:new Date().toISOString() },{ id:"d_cyp2", name:"BRQ Cypress B3", type:"Submitted", at:new Date().toISOString() }], checklist:{ c12:true, c13:true }, thread:[], dateHistory:[] },
  { id:"br_lvw_b1", property:"LVW", projectName:"GLC Lehigh Valley West - B1 Arndt", category:"Ground-Up Construction", stage:"Pre-Submission", gc:"R.S. Mowery & Sons", buildingType:"Industrial", sqft:"560970", carrier:"", startDate:"2026-05-31", completionDate:"2027-11-30", ball:"Robert (Marsh)", tenantSigned:"No", urgencyLevel:"Pending", contractType:"Design-Build", contractNum:"TBD", contractStatus:"Draft", partnership:"Norges", eqRequired:"Yes (Norges)", floodRequired:"Yes", shellCost:"23,289,051", onSiteInfra:"18,535,433", offSiteInfra:"2,793,477", directConting:"1,200,944", tiAmount:"0", hardCostTotal:"51,572,748", aeCost:"225,012", permitsCost:"441,843", legalCost:"23,544", insPremCost:"170,935", taxCost:"339,496", softCostTotal:"4,278,908", archEngSplit:"A&E total ~$1.125M. 20% = $225K in soft costs.", contingencyNote:"Feasibility - 50% contingency. Move to 100% when GMP locked.", overview:"Ground-up B1 Arndt 560,970 sf. Design-Build Mowery. Norges - EQ required. Named insured: GLC Lehigh Valley West LLC. Site: William O'Neill (717) 368-3202. Infrastructure May 2026, vertical Nov 2026. Sable parcel (593 Old Rt 22) acq. expected Jun 12 2026.", lessonsKnow:"Norges = EQ+Flood required. Design-Build = Owner procures BR (Art. 10.3). Mowery E&O $5M now, $17k endorsement for $10M under review. CRITICAL: coverage start date unresolved. TI = $0 until tenant signed.", questions:[{ id:"q_lvw1", q:"Coverage start date: May 2026 (infrastructure) vs Nov 2026 (vertical)? Team still gathering info.", answer:"", status:"Open", ball:"Internal Team", at:new Date().toISOString() },{ id:"q_lvw2", q:"TI: Feasibility shows $3,926,790 but no tenant signed. Confirm TI = $0 in BR TIV.", answer:"", status:"Open", ball:"Me", at:new Date().toISOString() },{ id:"q_lvw3", q:"Formal address for B1 and B2? Both showing 685 Old Rt 22. BK or Bill to advise.", answer:"", status:"Open", ball:"Internal Team", at:new Date().toISOString() },{ id:"q_lvw4", q:"Mowery $17k E&O endorsement approved? COI must update to $10M at contract execution.", answer:"", status:"Open", ball:"Internal Team", at:new Date().toISOString() }], docs:[{ id:"d_lvwb1a", name:"BRQ B1 Arndt", type:"Submitted", at:new Date().toISOString() },{ id:"d_lvwb1b", name:"Building Insurable Values Workbook", type:"Submitted", at:new Date().toISOString() }], checklist:{ c1:true }, thread:[], dateHistory:[] },
  { id:"br_lvw_b2", property:"LVW", projectName:"GLC Lehigh Valley West - B2 Sutliff", category:"Ground-Up Construction", stage:"Pre-Submission", gc:"R.S. Mowery & Sons", buildingType:"Industrial", sqft:"714000", carrier:"", startDate:"2026-04-30", completionDate:"2027-10-31", ball:"Robert (Marsh)", tenantSigned:"No", urgencyLevel:"Pending", contractType:"Design-Build", contractNum:"TBD", contractStatus:"Draft", partnership:"Norges", eqRequired:"Yes (Norges)", floodRequired:"Yes", shellCost:"27,781,530", onSiteInfra:"24,386,991", offSiteInfra:"3,555,524", directConting:"1,439,914", tiAmount:"0", hardCostTotal:"64,631,902", aeCost:"286,394", permitsCost:"554,344", legalCost:"28,056", insPremCost:"217,565", taxCost:"463,159", softCostTotal:"5,334,065", archEngSplit:"A&E total ~$1.43M. 20% = $286K in soft costs.", contingencyNote:"Feasibility - 50% contingency. NJ property taxes ($4.46M) DSU only, NOT in BR TIV.", overview:"Ground-up B2 Sutliff 714,000 sf. Same Design-Build contract Mowery. Infrastructure Apr 2026, vertical Oct 2026.", questions:[{ id:"q_lvwb2_1", q:"Coverage start date B2: infrastructure Apr 2026 vs vertical Oct 2026?", answer:"", status:"Open", ball:"Internal Team", at:new Date().toISOString() },{ id:"q_lvwb2_2", q:"TI $4,998,000 in feasibility - confirm $0 in BR TIV until tenant signed.", answer:"", status:"Open", ball:"Me", at:new Date().toISOString() }], docs:[{ id:"d_lvwb2a", name:"BRQ B2 Sutliff", type:"Submitted", at:new Date().toISOString() }], checklist:{ c1:true }, thread:[], dateHistory:[] },
  { id:"br_jc", property:"Jersey City", projectName:"GLC Jersey City", category:"Ground-Up Construction", stage:"Pre-Submission", gc:"ARCO Design/Build LLC", buildingType:"Industrial", sqft:"304185", carrier:"", startDate:"2026-07-31", completionDate:"2027-07-31", ball:"Robert (Marsh)", tenantSigned:"No", urgencyLevel:"Pending", contractType:"Design-Build", contractNum:"TBD", contractStatus:"Draft", partnership:"Norges", eqRequired:"Yes (Norges)", floodRequired:"Yes", shellCost:"15,868,744", onSiteInfra:"13,068,744", offSiteInfra:"0", directConting:"793,437", tiAmount:"0", hardCostTotal:"32,321,949", aeCost:"129,645", permitsCost:"348,606", legalCost:"33,000", insPremCost:"139,258", taxCost:"0", softCostTotal:"9,456,847", archEngSplit:"A&E total ~$648K. 20% = $130K in soft costs.", contingencyNote:"Feasibility - 50%. NJ property taxes $4,461,364 are DSU item ONLY - excluded from BR TIV.", overview:"Ground-up. Design-Build ARCO. NJ Norges - EQ required. Early Works = design only, no BR yet. $5M Pollution exception approved (to $10M at DB Agreement). ARCO redlines returned Apr 3 2026. Site: 125 Theodore Conrad, Jersey City NJ.", questions:[{ id:"q_jc1", q:"Property taxes $4,461,364 in pre-dev - confirm EXCLUDED from BR TIV (DSU item only).", answer:"", status:"Open", ball:"Robert (Marsh)", at:new Date().toISOString() },{ id:"q_jc2", q:"ARCO insurance redlines - what is still outstanding? $10M Pollution required at DB Agreement.", answer:"", status:"Open", ball:"Robert (Marsh)", at:new Date().toISOString() },{ id:"q_jc3", q:"TI $1,825,110 in feasibility - confirm $0 in BR TIV until tenant signed.", answer:"", status:"Open", ball:"Me", at:new Date().toISOString() },{ id:"q_jc4", q:"When does vertical construction begin? ARCO Early Works = design only, no BR triggered.", answer:"", status:"Open", ball:"Internal Team", at:new Date().toISOString() }], docs:[{ id:"d_jc1", name:"BRQ Jersey City", type:"Submitted", at:new Date().toISOString() },{ id:"d_jc2", name:"Building Insurable Values Workbook", type:"Submitted", at:new Date().toISOString() }], checklist:{ c1:true }, thread:[], dateHistory:[] },
  { id:"br_mil", property:"San Jose", projectName:"GIC Milpitas", category:"Ground-Up Construction", stage:"Pre-Submission", gc:"TBD", buildingType:"Industrial", sqft:"", carrier:"", startDate:"2026-10-29", completionDate:"2027-11-11", ball:"Internal Team", tenantSigned:"No", urgencyLevel:"ACTION REQUIRED", contractType:"TBD", partnership:"TBD", eqRequired:"TBD", floodRequired:"TBD", overview:"BR NOT YET PLACED - ACTION REQUIRED. Inception Oct 29 2026 (demo Jun-Oct = contractor-carried risk). Demo contractor: GL + Inland Marine + CPL with Goodman as AI. Awaiting feaso data from Yaron Palfy. Questionnaire (Tabs 1-3), budget, schedule, geotech needed.", questions:[{ id:"q_mil1", q:"ACTION REQUIRED: BR not placed. Awaiting feaso data from Yaron Palfy / NorCal team.", answer:"", status:"Open", ball:"Internal Team", at:new Date().toISOString() },{ id:"q_mil2", q:"Demo contractor (Jun-Oct 2026): GL + Inland Marine + CPL confirmed with Goodman as AI?", answer:"", status:"Open", ball:"SSST", at:new Date().toISOString() }], docs:[], checklist:{}, thread:[], dateHistory:[] },
  { id:"br_fon_b6", property:"FON B6", projectName:"GLC Fontana III B6", category:"Ground-Up Construction", stage:"Submitted to Market", gc:"Oltmans Construction", buildingType:"Industrial", sqft:"", carrier:"TBD", policyEff:"2026-04-30", policyExp:"2027-02-28", startDate:"2026-02-01", completionDate:"2027-02-28", ball:"Robert (Marsh)", tenantSigned:"No", urgencyLevel:"In Progress", contractType:"Owner-Contractor", contractNum:"54312", contractStatus:"Executed", partnership:"Norges", eqRequired:"Yes (Norges)", floodRequired:"Yes", overview:"Contract 54312 Executed. Norges - EQ required. Line-item budget, schedule and geotech requested Feb 25 2026. BR policy in effect 4/30/2026-2/28/2027.", questions:[{ id:"q_fon1", q:"Line-item budget, schedule and geotech received from team?", answer:"", status:"Open", ball:"Internal Team", at:new Date().toISOString() }], docs:[], checklist:{}, thread:[], dateHistory:[] },
  { id:"br_lax01", property:"LAX01", projectName:"GIC LAX01 / Soto Data Center", category:"Cap Ex / Fit-Out", stage:"Under Construction", gc:"Whiting-Turner", buildingType:"Data Center", sqft:"", carrier:"Starr (25%) / Sompo (20%) + co-insurers", policyNum:"SLSTCON12711325 / ECR10015617200", policyEff:"2025-01-01", policyExp:"2027-12-31", startDate:"2025-01-01", completionDate:"2027-10-25", ball:"Me", tenantSigned:"No", urgencyLevel:"Active", contractType:"Owner-Contractor", contractNum:"52503", contractStatus:"Executed", partnership:"Aware", eqRequired:"Yes (Aware)", floodRequired:"Yes", policyReceived:true, reviewedVsBRQ:true, policyFiled:true, overview:"Fit-out / Data Center. Contract 52503. Aware partnership - EQ required. OCIP NOT used (BR always separate). ~0.60% premium. COI on ACORD 28 issued. Virus/bacteria exclusion applies.", docs:[{ id:"d_lax1", name:"BR Policy Starr/Sompo", type:"Policy", at:new Date().toISOString() },{ id:"d_lax2", name:"ACORD 28 Whiting-Turner", type:"Submitted", at:new Date().toISOString() }], questions:[], checklist:{ c12:true, c13:true }, thread:[], dateHistory:[] },
  { id:"br_ver", property:"LAX02", projectName:"GEP Vernon", category:"Ground-Up Construction", stage:"Submitted to Market", gc:"Whiting-Turner", buildingType:"Industrial", sqft:"", carrier:"TBD", startDate:"2026-04-01", completionDate:"", ball:"Robert (Marsh)", tenantSigned:"No", urgencyLevel:"In Progress", contractType:"Owner-Contractor", contractNum:"54497", contractStatus:"Executed", partnership:"Balance Sheet", eqRequired:"Yes (explicit in contract)", floodRequired:"TBD", overview:"Contract 54497 Executed. Balance sheet BUT EQ explicitly required in contract - different from Cypress B3 where EQ is discretionary.", docs:[], questions:[], checklist:{}, thread:[], dateHistory:[] },
  { id:"br_solar", property:"ADMIN", projectName:"Solar - Various Properties", category:"Solar & Specialty", stage:"Pre-Submission", gc:"TBD", buildingType:"Industrial", sqft:"", carrier:"TBD", ball:"Robert (Marsh)", tenantSigned:"No", urgencyLevel:"ACTION REQUIRED", contractType:"TBD", partnership:"Mixed", overview:"Solar PV - various properties. Under Marsh review (Israel acknowledged Aug 25 2025). CRITICAL: (1) Installation period BR? (2) Transition to property policy at operational? (3) Contractor installation floater adequate?", questions:[{ id:"q_sol1", q:"Installation period: standalone BR or endorsement?", answer:"", status:"Open", ball:"Robert (Marsh)", at:new Date().toISOString() },{ id:"q_sol2", q:"Confirm transition from BR to property policy at operational commencement per site.", answer:"", status:"Open", ball:"Me", at:new Date().toISOString() },{ id:"q_sol3", q:"Contractor installation floater adequate for each solar installer?", answer:"", status:"Open", ball:"SSST", at:new Date().toISOString() }], docs:[], checklist:{}, thread:[], dateHistory:[] },
  { id:"br_lb_amz", property:"LAX01", projectName:"GCC Long Beach B1 - Amazon TI", category:"Tenant Improvements", stage:"Under Construction", gc:"Amazon GC", buildingType:"Industrial", sqft:"", carrier:"Amazon (tenant)", startDate:"2026-01-01", completionDate:"", ball:"SSST", tenantSigned:"Yes", tenantName:"Amazon.com Services", urgencyLevel:"Monitor", contractType:"Lease / Work Letter", overview:"Tenant improvement - Amazon carries BR. Goodman + lender as loss payees. EQ required. Lease executed. COI/evidence pending.", questions:[{ id:"q_lb1", q:"Amazon BR evidence of coverage - loss payee status and COI received?", answer:"", status:"Open", ball:"SSST", at:new Date().toISOString() }], docs:[], checklist:{}, thread:[], dateHistory:[] },
  { id:"br_lvw_ew", property:"LVW", projectName:"GLC LVW - Mowery Early Works", category:"Early Works", stage:"Pre-Submission", gc:"R.S. Mowery & Sons", buildingType:"Industrial", sqft:"", carrier:"N/A", startDate:"2026-04-01", completionDate:"", ball:"Me", urgencyLevel:"N/A", contractType:"Early Works / Design-Build", overview:"Tree removal and site clearing only. No BR triggered. BR required once vertical commences. CGL $2M/$4M, Umbrella $10M, Auto $2M, WC $1M, E&O $10M (currently $5M + $17k endorsement). COI pending.", questions:[{ id:"q_lvwew1", q:"Mowery COI - confirm correct limits before tree removal begins.", answer:"", status:"Open", ball:"SSST", at:new Date().toISOString() }], docs:[], checklist:{}, thread:[], dateHistory:[] },
  { id:"br_jc_ew", property:"Jersey City", projectName:"GLC Jersey City - ARCO Early Works", category:"Early Works", stage:"Pre-Submission", gc:"ARCO Design/Build LLC", buildingType:"Industrial", sqft:"", carrier:"N/A", startDate:"2026-04-01", completionDate:"", ball:"Me", urgencyLevel:"N/A", contractType:"Early Works Authorization", overview:"Design only (Arch, Structural, MEP, Fire Protection). No BR - professional services. CGL $10M, Pollution $5M exception approved by Amanda (to $10M at DB Agreement). SSST re-sent COI request.", questions:[{ id:"q_jcew1", q:"ARCO COI - $5M Pollution now, $10M required at DB Agreement execution.", answer:"Exception approved by Amanda Gardner.", status:"Open", ball:"SSST", at:new Date().toISOString() }], docs:[], checklist:{}, thread:[], dateHistory:[] }
];

const PROPS = ["LAX01","LAX02","LAX03","FON B6","CYP B3","San Jose","LVW","Jersey City","Bellwether","ADMIN","Legal","MS","SSST"];
const BALL = ["Me","Robert (Marsh)","Veronica (Marsh)","Israel (Marsh)","Swiss Re","Legal","Tenant","SSST","Accounting","GC/Contractor","Other"];
const TOPICS = ["Limits","Indemnity","Waiver of Subrogation","Additional Insured","COI","Premium","SOV","LOC","Builders Risk","Policy Renewal","Risk Engineering","Lease Insurance Req","Claim","Entity","Modern Slavery","SSST","Hard Costs","Soft Costs","TIV","PC Form","General"];
const BLDG_TYPES = ["Industrial","Data Center","Office","Mixed Use","Development","Other"];
const URGENCY = ["Now","Soon","Later","FYI"];
const LIFECYCLE = ["Acquisition","Builders Risk","Stabilized"];
const BR_STAGES = ["Pre-Submission","Submitted to Market","Quoted","Bound","Under Construction","Practical Completion","Closed Out"];
const TRIAGE_TYPES = ["Email","BR","Acquisition","Contract","Legal","MS","SSST","Admin","SOV","Risk Eng","LOC","Other"];
const TRIAGE_STATUS = ["Pending","In Progress","Waiting","Complete"];

const C = {
  bg:"#18152a", surface:"#201d32", card:"#272340", border:"#332f50",
  accent:"#7c6fad", teal:"#4ecdc4", sage:"#7ed4a0", amber:"#ffd060",
  rose:"#ff8f8f", text:"#e8e4f0", muted:"#9890b8", oat:"#d4cfe8", flag:"#ff6b6b",
};

const S = {
  app: { minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", flexDirection:"column" },
  hdr: { background:C.surface, borderBottom:"1px solid "+C.border, padding:"10px 18px", display:"flex", alignItems:"center" },
  logo: { fontSize:"17px", fontWeight:"700", color:C.teal },
  sub: { fontSize:"11px", color:C.muted, marginTop:"1px" },
  tabBar: { display:"flex", gap:"2px", padding:"8px 14px 0", background:C.surface, borderBottom:"1px solid "+C.border, overflowX:"auto" },
  tab: (a) => ({ padding:"7px 13px", borderRadius:"8px 8px 0 0", border:"none", cursor:"pointer", fontSize:"12px", fontWeight:"600", whiteSpace:"nowrap", fontFamily:"inherit", background:a?C.card:"transparent", color:a?C.teal:C.muted, borderBottom:a?"2px solid "+C.teal:"2px solid transparent" }),
  body: { flex:1, padding:"14px", maxWidth:"940px", margin:"0 auto", width:"100%", boxSizing:"border-box" },
  card: { background:C.card, border:"1px solid "+C.border, borderRadius:"10px", padding:"13px", marginBottom:"10px" },
  lbl: { fontSize:"10px", fontWeight:"700", letterSpacing:"0.8px", color:C.muted, textTransform:"uppercase", marginBottom:"3px" },
  inp: { background:C.surface, border:"1px solid "+C.border, borderRadius:"6px", color:C.text, padding:"7px 10px", fontSize:"13px", width:"100%", boxSizing:"border-box", outline:"none", fontFamily:"inherit" },
  ta: { background:C.surface, border:"1px solid "+C.border, borderRadius:"6px", color:C.text, padding:"7px 10px", fontSize:"13px", width:"100%", boxSizing:"border-box", outline:"none", fontFamily:"inherit", resize:"vertical", minHeight:"70px" },
  sel: { background:C.surface, border:"1px solid "+C.border, borderRadius:"6px", color:C.text, padding:"7px 10px", fontSize:"13px", width:"100%", boxSizing:"border-box", outline:"none", fontFamily:"inherit" },
  row: { display:"flex", gap:"8px", alignItems:"flex-start", marginBottom:"8px", flexWrap:"wrap" },
  col: (f) => ({ flex:f||1, minWidth:"110px" }),
  ttl: { fontSize:"15px", fontWeight:"700", color:C.oat, marginBottom:"12px" },
  pill: (color) => ({ display:"inline-block", padding:"2px 7px", borderRadius:"20px", fontSize:"10px", fontWeight:"700", background:color+"22", color:color, border:"1px solid "+color+"44" }),
  flag: (color) => ({ background:(color||C.flag)+"22", border:"1px solid "+(color||C.flag)+"55", borderRadius:"8px", padding:"8px 12px", marginBottom:"8px", fontSize:"12px", color:(color||C.flag) }),
  msg: (mine) => ({ background:mine?C.surface:"#1a1530", border:"1px solid "+C.border, borderRadius:"7px", padding:"8px 11px", marginBottom:"5px", borderLeft:"3px solid "+(mine?C.teal:C.accent) }),
};

function B(variant) {
  const m = { primary:{background:C.accent,color:"#fff",border:"none"}, teal:{background:C.teal,color:C.bg,border:"none"}, ghost:{background:"transparent",color:C.muted,border:"1px solid "+C.border}, danger:{background:"#3d1f1f",color:C.rose,border:"1px solid #5a2a2a"}, amber:{background:"#3a2f10",color:C.amber,border:"1px solid #5a4a20"}, sage:{background:"#1a3028",color:C.sage,border:"1px solid #2a4a38"} };
  return { ...(m[variant]||m.ghost), padding:"6px 13px", borderRadius:"6px", cursor:"pointer", fontSize:"12px", fontWeight:"600", fontFamily:"inherit" };
}

function uColor(u) { return u==="Now"?C.rose:u==="Soon"?C.amber:u==="Later"?C.sage:C.muted; }
function sColor(s) { return (s==="Complete"||s==="Bound"||s==="Closed Out")?C.sage:(s==="Waiting"||s==="Pending Carrier")?C.amber:(s==="In Progress"||s==="Active"||s==="Under Construction")?C.teal:C.muted; }

function DD({ label, value, onChange, options, style }) {
  return (
    <div style={style}>
      {label && <div style={S.lbl}>{label}</div>}
      <select style={S.sel} value={value||""} onChange={e => onChange(e.target.value)}>
        <option value="">-- {label||"Select"} --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Thread({ thread, onAdd }) {
  const [v, setV] = useState("");
  return (
    <div>
      {(thread||[]).map(m => (
        <div key={m.id} style={S.msg(m.from==="Me")}>
          <div style={{ fontSize:"10px", color:C.muted, marginBottom:"2px" }}>{(m.from||"Me")+" - "+fmtDate(m.at)}</div>
          <div style={{ fontSize:"12px" }}>{m.text}</div>
        </div>
      ))}
      <div style={{ display:"flex", gap:"6px", marginTop:"6px" }}>
        <input style={{ ...S.inp, flex:1 }} placeholder="Add note..." value={v} onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key==="Enter"&&v.trim()){ onAdd(v.trim()); setV(""); } }} />
        <button style={B("ghost")} onClick={() => { if(v.trim()){ onAdd(v.trim()); setV(""); } }}>Add</button>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
      <div style={{ background:C.card, border:"1px solid "+C.border, borderRadius:"12px", width:"100%", maxWidth:"800px", maxHeight:"92vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {children}
      </div>
    </div>
  );
}

const BR_CHECKLIST = [
  { id:"c1", text:"BRQ completed and submitted to Marsh" },
  { id:"c2", text:"Project budget / feasibility schedule received" },
  { id:"c3", text:"Hard costs: Building shell at 100%, Infrastructure at 10%" },
  { id:"c4", text:"Soft costs: A&E at 20%, Permits at 35%, Legal at 20%, Insurance premium at 75%" },
  { id:"c5", text:"Environmental / Phase I EXCLUDED (sunk cost)" },
  { id:"c6", text:"Marketing EXCLUDED (DSU item only)" },
  { id:"c7", text:"Contingency noted: 50% at feasibility, 100% at GMP" },
  { id:"c8", text:"Tenant status confirmed - DSU excluded if no tenant" },
  { id:"c9", text:"TI confirmed - include at 100% only if tenant signed and scope defined" },
  { id:"c10", text:"TIV confirmed with Israel (Marsh) before binding" },
  { id:"c11", text:"Start date and completion date confirmed with GC" },
  { id:"c12", text:"Policy received and reviewed against BRQ" },
  { id:"c13", text:"Policy filed in policy files" },
  { id:"c14", text:"Endorsements tracked (date changes logged)" },
  { id:"c15", text:"PC form completed - include everything Goodman owns" },
  { id:"c16", text:"SOV updated at practical completion for carrier reporting" },
];

const PC_RULES = [
  { rule:"Include everything Goodman OWNS", detail:"Ownership = include. The test is not likelihood of rebuild.", example:"Storm drain transferred to city = EXCLUDE. Storm drain retained by Goodman = INCLUDE. (Marsh, May 2026)" },
  { rule:"Infrastructure moves to 100% at PC", detail:"During construction it was 10%. At practical completion the full installed value is at risk.", example:"On-site paving, underground utilities, detention ponds = 100% of installed value at PC." },
  { rule:"Exclude land always", detail:"Land is never insurable under BR or permanent property policy.", example:"Land purchase and closing costs = $0 on PC form." },
  { rule:"TI at 100% if tenant signed", detail:"Once TI scope is defined and work begins, include at full installed value.", example:"No tenant signed at PC = TI is $0." },
];

function brFlags(p) {
  const flags = [];
  const hc = parseMoney(p.hardCostTotal);
  const sc = parseMoney(p.softCostTotal);
  const tiv = hc + sc;
  if (tiv > 0) {
    const pct = (sc / tiv) * 100;
    if (pct > 35) flags.push("Soft costs are "+pct.toFixed(1)+"% of TIV - Marsh guideline is 20-35%. Verify DSU election and confirm breakdown with Israel.");
    if (pct < 10 && sc > 0) flags.push("Soft costs appear low at "+pct.toFixed(1)+"%. Confirm A&E, permits, legal, and insurance premium are included.");
  }
  if (!p.tenantSigned && p.softCostTotal) flags.push("No tenant signed - confirm DSU is NOT included in soft cost total.");
  if (p.tenantSigned==="Yes" && !p.tiAmount) flags.push("Tenant signed but TI amount not entered - include at 100% once scope defined.");
  if (!p.archEngSplit) flags.push("A&E costs: confirm only ~20% included (portion that would re-incur). 80% already spent.");
  if (!p.contingencyNote) flags.push("Contingency: use 50% at feasibility, 100% at GMP - note current stage.");
  if (!p.startDate) flags.push("No start date recorded.");
  if (!p.completionDate) flags.push("No completion date recorded - required for DSU indemnity period.");
  return flags;
}

function BRDetail({ proj, onUpdate, onClose }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview","costs","docs","policy","questions","dates","checklist","pcform","lessons","thread"];
  const tabNames = { overview:"Overview", costs:"HC / SC / TIV", docs:"Documents", policy:"Policy", questions:"Open Items", dates:"Date History", checklist:"Placement Guide", pcform:"PC Form", lessons:"Lessons Learned", thread:"Full Thread" };

  const upd = (f, v) => onUpdate({ ...proj, [f]:v });
  const flags = brFlags(proj);

  const changeDate = (field, val) => {
    const hist = proj.dateHistory || [];
    if (proj[field] && proj[field] !== val) {
      const reason = window.prompt("Reason for "+field+" change?") || "No reason given";
      hist.push({ id:uid(), field, old:proj[field], newVal:val, reason, at:now(), by:"Amanda" });
    }
    onUpdate({ ...proj, [field]:val, dateHistory:hist });
  };

  const addThread = (text) => onUpdate({ ...proj, thread:[...(proj.thread||[]), { id:uid(), text, from:"Me", at:now() }] });

  const addDoc = (type) => {
    const name = window.prompt("Document name?");
    if (!name) return;
    onUpdate({ ...proj, docs:[...(proj.docs||[]), { id:uid(), name, type, at:now() }] });
  };

  const addQ = () => {
    const q = window.prompt("Open question?");
    if (!q) return;
    onUpdate({ ...proj, questions:[...(proj.questions||[]), { id:uid(), q, answer:"", status:"Open", ball:"", at:now() }] });
  };

  const chk = proj.checklist || {};
  const toggleChk = (id) => onUpdate({ ...proj, checklist:{ ...chk, [id]:!chk[id] } });

  const hc = parseMoney(proj.hardCostTotal);
  const sc = parseMoney(proj.softCostTotal);

  return (
    <Modal onClose={onClose}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid "+C.border, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:"16px", fontWeight:"700", color:C.oat }}>{(proj.property||"BR Project")+(proj.projectName?" - "+proj.projectName:"")}</div>
          <div style={{ fontSize:"11px", color:C.muted, marginTop:"2px", display:"flex", gap:"8px", alignItems:"center" }}>
            <span style={S.pill(sColor(proj.stage))}>{proj.stage||"Active"}</span>
            {proj.gc && <span>{"GC: "+proj.gc}</span>}
            {proj.completionDate && <span>{"PC: "+fmtShort(proj.completionDate)}</span>}
          </div>
        </div>
        <button style={B("ghost")} onClick={onClose}>Close</button>
      </div>

      {flags.length > 0 && (
        <div style={{ padding:"8px 14px", borderBottom:"1px solid "+C.border }}>
          {flags.map((f,i) => <div key={i} style={S.flag()}>{"! "+f}</div>)}
        </div>
      )}

      <div style={{ display:"flex", gap:"2px", padding:"6px 12px 0", borderBottom:"1px solid "+C.border, overflowX:"auto" }}>
        {tabs.map(t => <button key={t} style={S.tab(tab===t)} onClick={() => setTab(t)}>{tabNames[t]}</button>)}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>

        {tab==="overview" && (
          <div>
            <div style={S.row}>
              <DD label="Property" value={proj.property} onChange={v => upd("property",v)} options={PROPS} style={S.col()} />
              <div style={S.col()}><div style={S.lbl}>Project Name</div><input style={S.inp} value={proj.projectName||""} onChange={e => upd("projectName",e.target.value)} placeholder="e.g. B1 Arndt" /></div>
              <DD label="Stage" value={proj.stage} onChange={v => upd("stage",v)} options={BR_STAGES} style={S.col()} />
            </div>
            <div style={S.row}>
              <DD label="Category" value={proj.category} onChange={v => upd("category",v)} options={BR_CATEGORIES} style={S.col()} />
              <DD label="Urgency Level" value={proj.urgencyLevel} onChange={v => upd("urgencyLevel",v)} options={BR_URGENCY_LEVELS} style={S.col()} />
              <DD label="Partnership" value={proj.partnership} onChange={v => upd("partnership",v)} options={["Balance Sheet","Norges","Aware","GMG","TBD","Other"]} style={S.col()} />
            </div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Contract Type</div><input style={S.inp} value={proj.contractType||""} onChange={e => upd("contractType",e.target.value)} placeholder="Design-Build, Owner-Contractor, etc." /></div>
              <div style={S.col()}><div style={S.lbl}>Contract No.</div><input style={S.inp} value={proj.contractNum||""} onChange={e => upd("contractNum",e.target.value)} /></div>
              <div style={S.col()}><div style={S.lbl}>Contract Status</div><input style={S.inp} value={proj.contractStatus||""} onChange={e => upd("contractStatus",e.target.value)} placeholder="Executed, Draft, Pending" /></div>
            </div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>GC / Contractor</div><input style={S.inp} value={proj.gc||""} onChange={e => upd("gc",e.target.value)} /></div>
              <DD label="Building Type" value={proj.buildingType} onChange={v => upd("buildingType",v)} options={BLDG_TYPES} style={S.col()} />
              <div style={S.col()}><div style={S.lbl}>Sq Ft</div><input style={S.inp} value={proj.sqft||""} onChange={e => upd("sqft",e.target.value)} /></div>
            </div>
            <div style={S.row}>
              <DD label="Ball in Court" value={proj.ball} onChange={v => upd("ball",v)} options={BALL} style={S.col()} />
              <div style={S.col()}>
                <div style={S.lbl}>Tenant Signed?</div>
                <select style={S.sel} value={proj.tenantSigned||""} onChange={e => upd("tenantSigned",e.target.value)}>
                  <option value="">--</option><option value="Yes">Yes</option><option value="No">No</option>
                </select>
              </div>
              {proj.tenantSigned==="Yes" && <div style={S.col()}><div style={S.lbl}>Tenant Name</div><input style={S.inp} value={proj.tenantName||""} onChange={e => upd("tenantName",e.target.value)} /></div>}
            </div>
            <div style={S.lbl}>Project Overview</div>
            <textarea style={S.ta} value={proj.overview||""} onChange={e => upd("overview",e.target.value)} placeholder="Project description, key contacts, background..." />
          </div>
        )}

        {tab==="costs" && (
          <div>
            <div style={S.flag(C.teal)}>{"Marsh Rules: Building Shell = 100%  |  Infrastructure = 10%  |  Soft Costs = 20-35%  |  TI = 100% when tenant signed"}</div>
            <div style={{ fontWeight:"700", color:C.oat, fontSize:"13px", margin:"10px 0 6px" }}>Hard Costs</div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Building / Shell (100%)</div><input style={S.inp} value={proj.shellCost||""} onChange={e => upd("shellCost",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>On-Site Infrastructure (10%)</div><input style={S.inp} value={proj.onSiteInfra||""} onChange={e => upd("onSiteInfra",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>Off-Site Infrastructure (10%)</div><input style={S.inp} value={proj.offSiteInfra||""} onChange={e => upd("offSiteInfra",e.target.value)} placeholder="$" /></div>
            </div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>TI (100% when tenant signed)</div><input style={S.inp} value={proj.tiAmount||""} onChange={e => upd("tiAmount",e.target.value)} placeholder="$0 if no tenant" /></div>
              <div style={S.col()}><div style={S.lbl}>Direct Contingency (50% feaso / 100% GMP)</div><input style={S.inp} value={proj.directConting||""} onChange={e => upd("directConting",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>Hard Cost Total (BR)</div><input style={S.inp} value={proj.hardCostTotal||""} onChange={e => upd("hardCostTotal",e.target.value)} placeholder="$" /></div>
            </div>
            <div style={S.lbl}>Contingency Stage Note</div>
            <input style={{ ...S.inp, marginBottom:"12px" }} value={proj.contingencyNote||""} onChange={e => upd("contingencyNote",e.target.value)} placeholder="At feasibility using 50%. GMP signed MM/DD - move to 100%." />

            <div style={{ fontWeight:"700", color:C.oat, fontSize:"13px", margin:"10px 0 6px" }}>Soft Costs</div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>A&E (20%)</div><input style={S.inp} value={proj.aeCost||""} onChange={e => upd("aeCost",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>Permits & Fees (35%)</div><input style={S.inp} value={proj.permitsCost||""} onChange={e => upd("permitsCost",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>Legal (20%)</div><input style={S.inp} value={proj.legalCost||""} onChange={e => upd("legalCost",e.target.value)} placeholder="$" /></div>
            </div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Insurance Premium (75%)</div><input style={S.inp} value={proj.insPremCost||""} onChange={e => upd("insPremCost",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>Property Taxes (100% DSU)</div><input style={S.inp} value={proj.taxCost||""} onChange={e => upd("taxCost",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>Soft Cost Total (BR)</div><input style={S.inp} value={proj.softCostTotal||""} onChange={e => upd("softCostTotal",e.target.value)} placeholder="$" /></div>
            </div>
            <div style={S.lbl}>A&E Split Note</div>
            <input style={{ ...S.inp, marginBottom:"12px" }} value={proj.archEngSplit||""} onChange={e => upd("archEngSplit",e.target.value)} placeholder="Total A&E $1.1M, 20% = $220K included. Confirmed with Israel MM/DD." />

            <div style={{ background:C.surface, border:"1px solid "+C.border, borderRadius:"8px", padding:"12px", marginBottom:"10px" }}>
              <div style={{ fontWeight:"700", color:C.amber, marginBottom:"6px" }}>Always Excluded from BR TIV</div>
              {["Environmental / Phase I (sunk cost - will not re-incur)","Marketing (DSU item only, not BR hard cost)","Land purchase and closing costs","Holding costs"].map(ex => (
                <div key={ex} style={{ fontSize:"12px", color:C.muted, padding:"2px 0" }}>{"x  "+ex}</div>
              ))}
            </div>

            <div style={{ background:C.surface, border:"1px solid "+C.border, borderRadius:"8px", padding:"14px" }}>
              <div style={{ fontWeight:"700", color:C.teal, marginBottom:"4px" }}>Combined BR TIV</div>
              <div style={{ fontSize:"22px", fontWeight:"700", color:C.oat }}>{hc+sc > 0 ? fmtMoney(hc+sc) : "--"}</div>
              <div style={{ fontSize:"11px", color:C.muted, marginTop:"2px" }}>{"HC: "+fmtMoney(proj.hardCostTotal)+"  |  SC: "+fmtMoney(proj.softCostTotal)}</div>
            </div>
          </div>
        )}

        {tab==="docs" && (
          <div>
            <div style={{ display:"flex", gap:"8px", marginBottom:"12px", flexWrap:"wrap" }}>
              <button style={B("sage")} onClick={() => addDoc("Submitted")}>+ Submitted Doc</button>
              <button style={B("amber")} onClick={() => addDoc("Outstanding")}>+ Outstanding Doc</button>
              <button style={B("ghost")} onClick={() => addDoc("Policy")}>+ Policy Doc</button>
              <button style={B("ghost")} onClick={() => addDoc("Other")}>+ Other</button>
            </div>
            {["Submitted","Outstanding","Policy","Other"].map(type => {
              const docs = (proj.docs||[]).filter(d => d.type===type);
              return (
                <div key={type} style={{ marginBottom:"14px" }}>
                  <div style={{ fontWeight:"700", fontSize:"12px", color:type==="Submitted"?C.sage:type==="Outstanding"?C.amber:C.teal, marginBottom:"6px" }}>{type+" ("+docs.length+")"}</div>
                  {docs.map(d => (
                    <div key={d.id} style={{ ...S.card, padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div><div style={{ fontSize:"13px", fontWeight:"600" }}>{d.name}</div><div style={{ fontSize:"10px", color:C.muted }}>{fmtDate(d.at)}</div></div>
                      <button style={B("danger")} onClick={() => onUpdate({ ...proj, docs:(proj.docs||[]).filter(x => x.id!==d.id) })}>X</button>
                    </div>
                  ))}
                  {!docs.length && <div style={{ fontSize:"12px", color:C.muted, fontStyle:"italic" }}>None yet</div>}
                </div>
              );
            })}
          </div>
        )}

        {tab==="policy" && (
          <div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Carrier</div><input style={S.inp} value={proj.carrier||""} onChange={e => upd("carrier",e.target.value)} placeholder="Swiss Re..." /></div>
              <div style={S.col()}><div style={S.lbl}>Policy Number</div><input style={S.inp} value={proj.policyNum||""} onChange={e => upd("policyNum",e.target.value)} /></div>
            </div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Effective Date</div><input style={S.inp} type="date" value={proj.policyEff||""} onChange={e => upd("policyEff",e.target.value)} /></div>
              <div style={S.col()}><div style={S.lbl}>Expiry Date</div><input style={S.inp} type="date" value={proj.policyExp||""} onChange={e => upd("policyExp",e.target.value)} /></div>
              <div style={S.col()}><div style={S.lbl}>Annual Premium</div><input style={S.inp} value={proj.premium||""} onChange={e => upd("premium",e.target.value)} placeholder="$" /></div>
            </div>
            <div style={S.lbl}>Policy Notes</div>
            <textarea style={S.ta} value={proj.policyNotes||""} onChange={e => upd("policyNotes",e.target.value)} placeholder="Reviewed against BRQ, special conditions, endorsements..." />
            <div style={{ display:"flex", gap:"12px", marginTop:"10px", flexWrap:"wrap" }}>
              {[["policyReceived","Policy Received"],["reviewedVsBRQ","Reviewed vs BRQ"],["policyFiled","Filed in Policy Files"]].map(([f,l]) => (
                <label key={f} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:C.muted, cursor:"pointer" }}>
                  <input type="checkbox" checked={!!proj[f]} onChange={e => upd(f,e.target.checked)} />
                  {l}
                </label>
              ))}
            </div>
          </div>
        )}

        {tab==="questions" && (
          <div>
            <button style={{ ...B("primary"), marginBottom:"12px" }} onClick={addQ}>+ Add Open Item</button>
            {!(proj.questions||[]).length && <div style={{ fontSize:"12px", color:C.muted, fontStyle:"italic" }}>No open questions yet.</div>}
            {(proj.questions||[]).map((q, i) => (
              <div key={q.id} style={{ ...S.card, borderLeft:"3px solid "+(q.status==="Resolved"?C.sage:C.amber) }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ fontWeight:"600", fontSize:"13px", color:C.oat, flex:1 }}>{q.q}</div>
                  <span style={S.pill(q.status==="Resolved"?C.sage:C.amber)}>{q.status}</span>
                </div>
                {q.ball && <div style={{ fontSize:"11px", color:C.muted, marginTop:"2px" }}>{"Ball: "+q.ball}</div>}
                <div style={{ marginTop:"8px" }}>
                  <div style={S.lbl}>Answer / Resolution</div>
                  <textarea style={{ ...S.ta, minHeight:"50px" }} value={q.answer||""} onChange={e => { const qs=(proj.questions||[]).map((x,j)=>j===i?{...x,answer:e.target.value}:x); onUpdate({...proj,questions:qs}); }} />
                </div>
                <div style={{ display:"flex", gap:"6px", marginTop:"6px" }}>
                  <DD label="" value={q.ball} onChange={v => { const qs=(proj.questions||[]).map((x,j)=>j===i?{...x,ball:v}:x); onUpdate({...proj,questions:qs}); }} options={BALL} style={{ flex:1 }} />
                  <button style={B(q.status==="Resolved"?"ghost":"sage")} onClick={() => { const qs=(proj.questions||[]).map((x,j)=>j===i?{...x,status:x.status==="Resolved"?"Open":"Resolved"}:x); onUpdate({...proj,questions:qs}); }}>
                    {q.status==="Resolved"?"Reopen":"Resolve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="dates" && (
          <div>
            <div style={S.flag(C.teal)}>{"All date changes are logged automatically with the old value, new value, and reason preserved."}</div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Start Date</div><input style={S.inp} type="date" value={proj.startDate||""} onChange={e => changeDate("startDate",e.target.value)} /></div>
              <div style={S.col()}><div style={S.lbl}>Completion Date</div><input style={S.inp} type="date" value={proj.completionDate||""} onChange={e => changeDate("completionDate",e.target.value)} /></div>
            </div>
            {proj.completionDate && (() => { const d=daysUntil(proj.completionDate); return <div style={{ fontSize:"12px", color:d<30?C.rose:C.muted, marginBottom:"10px" }}>{d>0?d+" days until completion":"Completion date has passed"}</div>; })()}
            <div style={{ fontWeight:"700", fontSize:"13px", color:C.oat, margin:"12px 0 8px" }}>Date Change History</div>
            {!(proj.dateHistory||[]).length && <div style={{ fontSize:"12px", color:C.muted, fontStyle:"italic" }}>No date changes recorded yet.</div>}
            {(proj.dateHistory||[]).map(h => (
              <div key={h.id} style={{ ...S.card, padding:"10px 12px" }}>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"4px" }}>
                  <span style={S.pill(C.amber)}>{h.field==="startDate"?"Start Date":"Completion Date"}</span>
                  <span style={{ fontSize:"11px", color:C.muted }}>{fmtDate(h.at)+" by "+h.by}</span>
                </div>
                <div style={{ fontSize:"12px" }}>{fmtShort(h.old)+" -> "+fmtShort(h.newVal)}</div>
                {h.reason && <div style={{ fontSize:"11px", color:C.muted, fontStyle:"italic", marginTop:"2px" }}>{"Reason: "+h.reason}</div>}
              </div>
            ))}
          </div>
        )}

        {tab==="checklist" && (
          <div>
            <div style={{ fontSize:"12px", color:C.muted, marginBottom:"12px" }}>{"Placement checklist based on Marsh methodology. "+Object.values(chk).filter(Boolean).length+" / "+BR_CHECKLIST.length+" complete."}</div>
            {BR_CHECKLIST.map(item => (
              <div key={item.id} style={{ display:"flex", alignItems:"flex-start", gap:"10px", padding:"8px 0", borderBottom:"1px solid "+C.border }}>
                <input type="checkbox" checked={!!chk[item.id]} onChange={() => toggleChk(item.id)} style={{ marginTop:"2px", cursor:"pointer" }} />
                <span style={{ fontSize:"13px", color:chk[item.id]?C.muted:C.text, textDecoration:chk[item.id]?"line-through":"none" }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {tab==="pcform" && (
          <div>
            <div style={{ fontWeight:"700", color:C.oat, fontSize:"14px", marginBottom:"10px" }}>Practical Completion Form Rules</div>
            {PC_RULES.map((r,i) => (
              <div key={i} style={{ ...S.card, borderLeft:"3px solid "+C.teal }}>
                <div style={{ fontWeight:"700", fontSize:"13px", color:C.teal, marginBottom:"4px" }}>{r.rule}</div>
                <div style={{ fontSize:"12px", marginBottom:"4px" }}>{r.detail}</div>
                <div style={{ fontSize:"11px", color:C.muted, fontStyle:"italic" }}>{"Example: "+r.example}</div>
              </div>
            ))}
            <div style={{ fontWeight:"700", color:C.oat, fontSize:"13px", margin:"14px 0 8px" }}>PC Values - This Project</div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>PC Building Value (100%)</div><input style={S.inp} value={proj.pcBuilding||""} onChange={e => upd("pcBuilding",e.target.value)} placeholder="$" /></div>
              <div style={S.col()}><div style={S.lbl}>PC Infrastructure (100% at completion)</div><input style={S.inp} value={proj.pcInfra||""} onChange={e => upd("pcInfra",e.target.value)} placeholder="$" /></div>
            </div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>PC TI Value</div><input style={S.inp} value={proj.pcTI||""} onChange={e => upd("pcTI",e.target.value)} placeholder="$0 if no tenant" /></div>
              <div style={S.col()}><div style={S.lbl}>PC Total</div><input style={S.inp} value={proj.pcTotal||""} onChange={e => upd("pcTotal",e.target.value)} placeholder="$" /></div>
            </div>
            <div style={S.lbl}>Ownership Notes</div>
            <textarea style={S.ta} value={proj.pcOwnershipNotes||""} onChange={e => upd("pcOwnershipNotes",e.target.value)} placeholder={"What does Goodman own vs transferred to municipality?\nStorm drain - transferred to city = EXCLUDE\nRetaining wall - Goodman owns = INCLUDE"} />
          </div>
        )}

        {tab==="lessons" && (
          <div>
            <div style={S.flag(C.accent)}>{"Briefing note for future-you. Fill this out at close-out so you can re-onboard quickly after a long gap."}</div>
            <div style={S.lbl}>What to know before starting this type of placement</div>
            <textarea style={{ ...S.ta, minHeight:"90px" }} value={proj.lessonsKnow||""} onChange={e => upd("lessonsKnow",e.target.value)} placeholder="Key things to know upfront, right contacts, what to request first..." />
            <div style={{ ...S.lbl, marginTop:"10px" }}>What worked well</div>
            <textarea style={{ ...S.ta, minHeight:"60px" }} value={proj.lessonsGood||""} onChange={e => upd("lessonsGood",e.target.value)} placeholder="What made this placement smooth..." />
            <div style={{ ...S.lbl, marginTop:"10px" }}>Watch out for / pain points</div>
            <textarea style={{ ...S.ta, minHeight:"60px" }} value={proj.lessonsBad||""} onChange={e => upd("lessonsBad",e.target.value)} placeholder="Carrier asked for X late - request it upfront next time..." />
            <div style={{ ...S.lbl, marginTop:"10px" }}>Key coverage decisions made</div>
            <textarea style={{ ...S.ta, minHeight:"60px" }} value={proj.lessonsDecisions||""} onChange={e => upd("lessonsDecisions",e.target.value)} placeholder="Coverage decisions, limit rationale, exclusions accepted and why..." />
            <button style={{ ...B("teal"), marginTop:"10px" }} onClick={() => onUpdate({ ...proj, lessonsUpdated:now() })}>Mark Updated</button>
            {proj.lessonsUpdated && <div style={{ fontSize:"11px", color:C.muted, marginTop:"6px" }}>{"Last updated: "+fmtDate(proj.lessonsUpdated)}</div>}
          </div>
        )}

        {tab==="thread" && <Thread thread={proj.thread} onAdd={addThread} />}
      </div>
    </Modal>
  );
}

function BuildersRisk() {
  const [projects, setProjects] = useStorage("mws_br_v2", BR_SEED_DATA);
  const [selected, setSelected] = useState(null);
  const [filterStage, setFilterStage] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");

  const add = () => {
    const p = { id:uid(), at:now(), property:"", projectName:"", stage:"Pre-Submission", thread:[], docs:[], questions:[], checklist:{}, dateHistory:[] };
    setProjects(prev => [p,...prev]);
    setSelected(p);
  };
  const upd = (u) => { setProjects(prev => prev.map(p => p.id===u.id?u:p)); setSelected(u); };
  const del = (id) => { setProjects(prev => prev.filter(p => p.id!==id)); if (selected&&selected.id===id) setSelected(null); };

  const filtered = projects.filter(p => {
    const ms = filterStage==="All"||p.stage===filterStage;
    const mc = filterCat==="All"||p.category===filterCat;
    const mq = !search||[p.property,p.projectName,p.gc,p.carrier,p.category,p.urgencyLevel].join(" ").toLowerCase().includes(search.toLowerCase());
    return ms && mc && mq;
  });

  return (
    <div>
      <div style={S.ttl}>Builders Risk <span style={{ fontSize:"11px", color:C.muted, fontWeight:"400" }}>WIP view - all active projects</span></div>
      <div style={{ display:"flex", gap:"6px", marginBottom:"8px", flexWrap:"wrap" }}>
        <input style={{ ...S.inp, flex:1, minWidth:"150px" }} placeholder="Search property, project, GC, category..." value={search} onChange={e => setSearch(e.target.value)} />
        <button style={B("primary")} onClick={add}>+ New BR Project</button>
      </div>
      <div style={{ display:"flex", gap:"4px", marginBottom:"6px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"10px", color:C.muted, alignSelf:"center", marginRight:"4px" }}>CATEGORY:</span>
        {["All",...BR_CATEGORIES].map(c => <button key={c} style={{ ...B(filterCat===c?"teal":"ghost"), padding:"4px 8px", fontSize:"10px" }} onClick={() => setFilterCat(c)}>{c}</button>)}
      </div>
      <div style={{ display:"flex", gap:"4px", marginBottom:"12px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"10px", color:C.muted, alignSelf:"center", marginRight:"4px" }}>STAGE:</span>
        {["All",...BR_STAGES].map(s => <button key={s} style={{ ...B(filterStage===s?"teal":"ghost"), padding:"4px 8px", fontSize:"11px" }} onClick={() => setFilterStage(s)}>{s}</button>)}
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid "+C.border }}>
              {["Property","Project","Category","Stage","GC","Start","Completion","TIV","Ball","Urgency","Flags",""].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"5px 8px", color:C.muted, fontSize:"10px", fontWeight:"700", letterSpacing:"0.6px", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const flags = brFlags(p);
              const days = daysUntil(p.completionDate);
              const tiv = parseMoney(p.hardCostTotal) + parseMoney(p.softCostTotal);
              return (
                <tr key={p.id} style={{ borderBottom:"1px solid "+C.border, cursor:"pointer" }} onClick={() => setSelected(p)}>
                  <td style={{ padding:"8px", fontWeight:"700", color:C.teal }}>{p.property||"--"}</td>
                  <td style={{ padding:"8px", color:C.oat }}>{p.projectName||"--"}</td>
                  <td style={{ padding:"8px" }}><span style={S.pill(C.muted)}>{p.category||"--"}</span></td>
                  <td style={{ padding:"8px" }}><span style={S.pill(sColor(p.stage))}>{p.stage||"--"}</span></td>
                  <td style={{ padding:"8px", color:C.muted }}>{p.gc||"--"}</td>
                  <td style={{ padding:"8px", color:C.muted, whiteSpace:"nowrap" }}>{p.startDate?fmtShort(p.startDate):"--"}</td>
                  <td style={{ padding:"8px", whiteSpace:"nowrap", color:days&&days<30?C.rose:C.muted }}>{p.completionDate?fmtShort(p.completionDate):"--"}</td>
                  <td style={{ padding:"8px", color:C.oat, whiteSpace:"nowrap" }}>{tiv?fmtMoney(tiv):"--"}</td>
                  <td style={{ padding:"8px", color:C.muted }}>{p.ball||"--"}</td>
                  <td style={{ padding:"8px" }}><span style={S.pill(p.urgencyLevel==="ACTION REQUIRED"?C.rose:p.urgencyLevel==="Active"?C.sage:p.urgencyLevel==="In Progress"?C.teal:p.urgencyLevel==="Monitor"?C.amber:C.muted)}>{p.urgencyLevel||"--"}</span></td>
                  <td style={{ padding:"8px" }}>{flags.length>0&&<span style={{ color:C.rose, fontWeight:"700" }}>{"! "+flags.length}</span>}</td>
                  <td style={{ padding:"8px" }}><button style={B("danger")} onClick={e => { e.stopPropagation(); del(p.id); }}>X</button></td>
                </tr>
              );
            })}
            {!filtered.length && <tr><td colSpan={12} style={{ padding:"20px", textAlign:"center", color:C.muted, fontSize:"12px", fontStyle:"italic" }}>No BR projects match filters.</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <BRDetail proj={selected} onUpdate={upd} onClose={() => setSelected(null)} />}
    </div>
  );
}

const SEED_GUIDANCE = [
  { id:"sg1", at:new Date("2026-05-07").toISOString(), topic:"PC Form", buildingType:"Industrial", property:"General",
    question:"What to include on the Practical Completion form - ownership test",
    response:"Include everything Goodman OWNS at practical completion. The test is ownership, not likelihood of rebuild.\n\nIf Goodman transferred ownership to the city = EXCLUDE.\nIf Goodman still owns it = INCLUDE.\n\nAt PC, infrastructure moves from 10% (construction risk) to 100% (full installed value at risk).\nLand is NEVER included regardless of ownership.",
    source:"Marsh broker discussion, May 2026 (Robert Boniface / Veronica Osborne)",
    examples:[{ id:"se1", text:"Storm drain at LHV West - ownership transferred to city municipality at completion = EXCLUDED. Goodman-retained retention pond = INCLUDED.", at:new Date("2026-05-07").toISOString() }] },
  { id:"sg2", at:new Date("2026-05-07").toISOString(), topic:"Hard Costs", buildingType:"Industrial", property:"General",
    question:"BR TIV: What percentage of infrastructure to include during construction?",
    response:"Infrastructure at 10% during construction. Rationale: at any given moment during construction, only a fraction of total installed infrastructure value is simultaneously exposed to loss.\n\nCovers: on-site grading, underground utilities (storm, sanitary, water, electrical conduit), asphalt paving, parking, site lighting, retention/detention ponds.\nOff-site: road improvements, utility line extensions, off-site storm drainage.\n\nAt Practical Completion: move to 100% - full installed value is now at risk.",
    source:"Marsh TIV Analysis / Moving Forward methodology", examples:[] },
  { id:"sg3", at:new Date("2026-05-07").toISOString(), topic:"Soft Costs", buildingType:"Industrial", property:"General",
    question:"Which soft costs to include in BR TIV and at what percentage?",
    response:"A&E (Arch/Engineering): 20% - only portion that would re-incur if loss occurs. 80% already spent.\nPermits & Fees: 35% - permits needing re-issuance after major loss.\nLegal: 20% - contract amendments, re-permitting after a loss.\nInsurance Premium: 75% - extension of BR policy premium (Marsh standard).\nProperty Taxes: 100% - continue accruing during delay (DSU item).\n\nALWAYS EXCLUDE: Environmental/Phase I (sunk cost), Marketing (DSU item only), Holding costs, Land.",
    source:"Marsh TIV Analysis", examples:[] },
];

function GuidanceLibrary() {
  const [items, setItems] = useStorage("mws_guidance_v2", SEED_GUIDANCE);
  const [form, setForm] = useState({ topic:"", buildingType:"", question:"", response:"", source:"", property:"" });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const [newEx, setNewEx] = useState({});

  const add = () => {
    if (!form.question.trim()) return;
    setItems(prev => [{ id:uid(), at:now(), examples:[], ...form }, ...prev]);
    setForm({ topic:"", buildingType:"", question:"", response:"", source:"", property:"" });
  };

  const addEx = (id, text) => {
    if (!text.trim()) return;
    setItems(prev => prev.map(i => i.id===id?{ ...i, examples:[...(i.examples||[]), { id:uid(), text, at:now() }] }:i));
    setNewEx(e => ({ ...e, [id]:"" }));
  };

  const filtered = items.filter(i => !search||[i.topic,i.buildingType,i.question,i.response,i.property,i.source].join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={S.ttl}>Guidance Library <span style={{ fontSize:"11px", color:C.muted, fontWeight:"400" }}>Broker / carrier responses, limit decisions, real precedents</span></div>
      <div style={S.card}>
        <div style={S.row}>
          <DD label="Topic" value={form.topic} onChange={v => setForm(f => ({ ...f, topic:v }))} options={TOPICS} style={S.col()} />
          <DD label="Building Type" value={form.buildingType} onChange={v => setForm(f => ({ ...f, buildingType:v }))} options={BLDG_TYPES} style={S.col()} />
          <DD label="Property" value={form.property} onChange={v => setForm(f => ({ ...f, property:v }))} options={PROPS} style={S.col()} />
        </div>
        <div style={S.lbl}>Question / Issue</div>
        <textarea style={{ ...S.ta, minHeight:"50px" }} placeholder="What was the question or provision at issue?" value={form.question} onChange={e => setForm(f => ({ ...f, question:e.target.value }))} />
        <div style={{ ...S.lbl, marginTop:"8px" }}>Response / Guidance</div>
        <textarea style={{ ...S.ta, minHeight:"70px" }} placeholder="What did Marsh / carrier / internal decide?" value={form.response} onChange={e => setForm(f => ({ ...f, response:e.target.value }))} />
        <div style={S.row}>
          <div style={S.col(2)}><div style={S.lbl}>Source</div><input style={S.inp} placeholder="e.g. Robert (Marsh), Swiss Re, internal decision MM/DD/YYYY" value={form.source} onChange={e => setForm(f => ({ ...f, source:e.target.value }))} /></div>
          <div style={{ alignSelf:"flex-end" }}><button style={B("teal")} onClick={add}>+ Save</button></div>
        </div>
      </div>
      <input style={{ ...S.inp, marginBottom:"12px" }} placeholder="Search by topic, building type, question, property..." value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(i => (
        <div key={i.id} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", cursor:"pointer" }} onClick={() => setOpen(open===i.id?null:i.id)}>
            <div>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"4px" }}>
                {i.topic && <span style={S.pill(C.teal)}>{i.topic}</span>}
                {i.buildingType && <span style={S.pill(C.accent)}>{i.buildingType}</span>}
                {i.property && <span style={S.pill(C.sage)}>{i.property}</span>}
              </div>
              <div style={{ fontSize:"13px", fontWeight:"600", color:C.oat }}>{i.question}</div>
              {i.source && <div style={{ fontSize:"11px", color:C.muted, marginTop:"2px" }}>{"Source: "+i.source}</div>}
            </div>
            <span style={{ color:C.muted }}>{open===i.id?"v":">"}</span>
          </div>
          {open===i.id && (
            <div style={{ marginTop:"10px", borderTop:"1px solid "+C.border, paddingTop:"10px" }}>
              <div style={S.lbl}>Guidance / Response</div>
              <div style={{ fontSize:"12px", lineHeight:"1.7", whiteSpace:"pre-wrap", marginBottom:"12px" }}>{i.response}</div>
              <div style={{ fontWeight:"700", fontSize:"12px", color:C.amber, marginBottom:"6px" }}>Real Examples / Precedents</div>
              {(i.examples||[]).map(ex => (
                <div key={ex.id} style={{ ...S.card, padding:"8px 12px", fontSize:"12px", borderLeft:"3px solid "+C.amber }}>
                  {ex.text}
                  {ex.at && <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>{fmtDate(ex.at)}</div>}
                </div>
              ))}
              <div style={{ display:"flex", gap:"6px", marginTop:"8px" }}>
                <input style={{ ...S.inp, flex:1 }} placeholder="Add another example or precedent..." value={newEx[i.id]||""} onChange={e => setNewEx(ex => ({ ...ex, [i.id]:e.target.value }))} onKeyDown={e => { if(e.key==="Enter") addEx(i.id,newEx[i.id]||""); }} />
                <button style={B("amber")} onClick={() => addEx(i.id,newEx[i.id]||"")}>+ Example</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Triage() {
  const [items, setItems] = useStorage("mws_triage", []);
  const [raw, setRaw] = useState("");
  const [form, setForm] = useState({ summary:"", property:"", topic:"", type:"", urgency:"", ball:"", requestedBy:"", status:"Pending" });
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const capture = () => {
    if (!form.summary.trim()&&!raw.trim()) return;
    setItems(prev => [{ id:uid(), at:now(), raw:raw.trim(), summary:form.summary.trim()||raw.trim().slice(0,100), ...form, thread:[] }, ...prev]);
    setRaw(""); setForm({ summary:"", property:"", topic:"", type:"", urgency:"", ball:"", requestedBy:"", status:"Pending" });
  };

  const del = (id) => setItems(prev => prev.filter(i => i.id!==id));
  const upd = (updated) => setItems(prev => prev.map(i => i.id===updated.id?updated:i));

  const filtered = items.filter(i => {
    const mf = filter==="All"||i.status===filter||i.type===filter||i.urgency===filter;
    const mq = !search||[i.summary,i.property,i.topic,i.ball,i.requestedBy,i.raw].join(" ").toLowerCase().includes(search.toLowerCase());
    return mf&&mq;
  });

  return (
    <div>
      <div style={S.ttl}>Email Triage <span style={{ fontSize:"11px", color:C.muted, fontWeight:"400" }}>Stream of consciousness capture</span></div>
      <div style={S.card}>
        <div style={S.lbl}>Stream dump</div>
        <textarea style={{ ...S.ta, minHeight:"55px" }} placeholder="Voice or type... Robert emailed about LVW, Swiss Re wants SOV by Friday, so and so needs this..." value={raw} onChange={e => setRaw(e.target.value)} />
        <div style={S.row}>
          <div style={S.col(2)}><div style={S.lbl}>Summary / Action</div><input style={S.inp} placeholder="What needs to happen?" value={form.summary} onChange={e => setForm(f => ({ ...f, summary:e.target.value }))} /></div>
        </div>
        <div style={S.row}>
          <DD label="Property" value={form.property} onChange={v => setForm(f => ({ ...f, property:v }))} options={PROPS} style={S.col()} />
          <DD label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type:v }))} options={TRIAGE_TYPES} style={S.col()} />
          <DD label="Topic" value={form.topic} onChange={v => setForm(f => ({ ...f, topic:v }))} options={TOPICS} style={S.col()} />
        </div>
        <div style={S.row}>
          <DD label="Urgency" value={form.urgency} onChange={v => setForm(f => ({ ...f, urgency:v }))} options={URGENCY} style={S.col()} />
          <DD label="Ball in Court" value={form.ball} onChange={v => setForm(f => ({ ...f, ball:v }))} options={BALL} style={S.col()} />
          <div style={S.col()}><div style={S.lbl}>Requested By</div><input style={S.inp} placeholder="Who asked?" value={form.requestedBy} onChange={e => setForm(f => ({ ...f, requestedBy:e.target.value }))} /></div>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end" }}><button style={B("teal")} onClick={capture}>+ Capture</button></div>
      </div>
      <div style={{ display:"flex", gap:"5px", marginBottom:"10px", flexWrap:"wrap" }}>
        <input style={{ ...S.inp, flex:1, minWidth:"140px" }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        {["All","Pending","Waiting","Complete","Now","Soon","BR","Acquisition"].map(f => (
          <button key={f} style={{ ...B(filter===f?"teal":"ghost"), padding:"5px 8px", fontSize:"11px" }} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div style={{ fontSize:"11px", color:C.muted, marginBottom:"8px" }}>{filtered.length+" items"}</div>
      {filtered.map(i => (
        <div key={i.id} style={{ ...S.card, borderLeft:"3px solid "+uColor(i.urgency) }}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:"6px" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"13px", fontWeight:"600", color:C.oat, marginBottom:"4px" }}>{i.summary}</div>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                {i.property && <span style={S.pill(C.teal)}>{i.property}</span>}
                {i.type && <span style={S.pill(C.accent)}>{i.type}</span>}
                {i.urgency && <span style={S.pill(uColor(i.urgency))}>{i.urgency}</span>}
                {i.status && <span style={S.pill(sColor(i.status))}>{i.status}</span>}
              </div>
              {i.ball && <div style={{ fontSize:"11px", color:C.muted, marginTop:"3px" }}>{"Ball: "+i.ball}</div>}
              <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>{fmtDate(i.at)}</div>
            </div>
            <div style={{ display:"flex", gap:"5px" }}>
              <DD label="" value={i.status} onChange={v => upd({ ...i, status:v })} options={TRIAGE_STATUS} style={{ width:"110px" }} />
              <button style={B("danger")} onClick={() => del(i.id)}>X</button>
            </div>
          </div>
          {i.raw && <div style={{ fontSize:"11px", color:C.muted, marginTop:"6px", fontStyle:"italic", borderTop:"1px solid "+C.border, paddingTop:"6px" }}>{"Raw: "+i.raw}</div>}
        </div>
      ))}
    </div>
  );
}

function PropertyDetail({ prop, onUpdate, onClose }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview","tenants","stages","sov","notes","thread"];
  const upd = (f,v) => onUpdate({ ...prop, [f]:v });
  return (
    <Modal onClose={onClose}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid "+C.border, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><div style={{ fontSize:"16px", fontWeight:"700", color:C.oat }}>{prop.code||"Property"}</div><div style={{ fontSize:"12px", color:C.muted }}>{prop.name}</div></div>
        <div style={{ display:"flex", gap:"8px" }}>
          <span style={S.pill(prop.stage==="Stabilized"?C.sage:prop.stage==="Builders Risk"?C.amber:C.teal)}>{prop.stage||"Unknown"}</span>
          <button style={B("ghost")} onClick={onClose}>Close</button>
        </div>
      </div>
      <div style={{ display:"flex", gap:"2px", padding:"6px 12px 0", borderBottom:"1px solid "+C.border, overflowX:"auto" }}>
        {tabs.map(t => <button key={t} style={S.tab(tab===t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
        {tab==="overview" && (
          <div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Code</div><input style={S.inp} value={prop.code||""} onChange={e => upd("code",e.target.value)} /></div>
              <div style={S.col()}><div style={S.lbl}>Name</div><input style={S.inp} value={prop.name||""} onChange={e => upd("name",e.target.value)} /></div>
              <DD label="Stage" value={prop.stage} onChange={v => upd("stage",v)} options={LIFECYCLE} style={S.col()} />
            </div>
            <div style={S.row}>
              <div style={S.col()}><div style={S.lbl}>Address</div><input style={S.inp} value={prop.address||""} onChange={e => upd("address",e.target.value)} /></div>
              <DD label="Building Type" value={prop.buildingType} onChange={v => upd("buildingType",v)} options={BLDG_TYPES} style={S.col()} />
              <div style={S.col()}><div style={S.lbl}>Sq Ft</div><input style={S.inp} value={prop.sqft||""} onChange={e => upd("sqft",e.target.value)} /></div>
            </div>
            <div style={S.lbl}>Key Contacts</div>
            <textarea style={S.ta} value={prop.contacts||""} onChange={e => upd("contacts",e.target.value)} placeholder="Asset manager, PM, legal..." />
          </div>
        )}
        {tab==="tenants" && <div><div style={S.lbl}>Tenant Notes</div><textarea style={{ ...S.ta, minHeight:"200px" }} value={prop.tenants||""} onChange={e => upd("tenants",e.target.value)} placeholder={"Tenant: Company\nSigned: date\nIC approval: date\nLease expiry:\nInsurance requirements:\n"} /></div>}
        {tab==="stages" && (
          <div>
            <div style={S.lbl}>Acquisition Notes</div>
            <textarea style={{ ...S.ta, minHeight:"70px" }} value={prop.acqNotes||""} onChange={e => upd("acqNotes",e.target.value)} placeholder="Due diligence, closing date, purchase price..." />
            <div style={{ ...S.lbl, marginTop:"10px" }}>Builders Risk Notes</div>
            <textarea style={{ ...S.ta, minHeight:"70px" }} value={prop.brNotes||""} onChange={e => upd("brNotes",e.target.value)} placeholder="Contractor, TPC, policy details, key milestones..." />
            <div style={{ ...S.lbl, marginTop:"10px" }}>Stabilized Notes</div>
            <textarea style={{ ...S.ta, minHeight:"70px" }} value={prop.stabNotes||""} onChange={e => upd("stabNotes",e.target.value)} placeholder="Policy details, last inspection, renewal notes..." />
          </div>
        )}
        {tab==="sov" && (
          <div>
            <div style={S.lbl}>SOV History (year-over-year)</div>
            {(prop.sovYears||[]).map((yr,idx) => (
              <div key={idx} style={{ ...S.card, marginBottom:"8px" }}>
                <div style={{ fontWeight:"700", color:C.amber, fontSize:"13px", marginBottom:"4px" }}>{yr.year}</div>
                <div style={{ fontSize:"12px", whiteSpace:"pre-wrap" }}>{yr.notes}</div>
              </div>
            ))}
            <button style={{ ...B("ghost"), marginTop:"6px" }} onClick={() => { const yr=window.prompt("Year?"); if(!yr)return; const notes=window.prompt("SOV notes for "+yr+"?"); onUpdate({ ...prop, sovYears:[...(prop.sovYears||[]), { year:yr, notes:notes||"" }] }); }}>+ Add SOV Year</button>
          </div>
        )}
        {tab==="notes" && <Thread thread={prop.notes} onAdd={text => onUpdate({ ...prop, notes:[...(prop.notes||[]), { id:uid(), text, from:"Me", at:now() }] })} />}
        {tab==="thread" && <Thread thread={prop.thread} onAdd={text => onUpdate({ ...prop, thread:[...(prop.thread||[]), { id:uid(), text, from:"Me", at:now() }] })} />}
      </div>
    </Modal>
  );
}

function Properties() {
  const [props, setProps] = useStorage("mws_properties", []);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("All");

  const add = () => { const p={ id:uid(), code:"", name:"", stage:"Stabilized", at:now(), notes:[], thread:[], sovYears:[] }; setProps(prev=>[p,...prev]); setSelected(p); };
  const upd = (u) => { setProps(prev=>prev.map(p=>p.id===u.id?u:p)); setSelected(u); };
  const del = (id) => { setProps(prev=>prev.filter(p=>p.id!==id)); setSelected(null); };

  const filtered = props.filter(p=>(filterStage==="All"||p.stage===filterStage)&&(!search||[p.code,p.name,p.address].join(" ").toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div style={S.ttl}>Properties <span style={{ fontSize:"11px", color:C.muted, fontWeight:"400" }}>Full life story per property</span></div>
      <div style={{ display:"flex", gap:"6px", marginBottom:"12px", flexWrap:"wrap" }}>
        <input style={{ ...S.inp, flex:1, minWidth:"140px" }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        {["All",...LIFECYCLE].map(s => <button key={s} style={{ ...B(filterStage===s?"teal":"ghost"), padding:"5px 9px", fontSize:"11px" }} onClick={() => setFilterStage(s)}>{s}</button>)}
        <button style={B("primary")} onClick={add}>+ New Property</button>
      </div>
      {filtered.map(p => (
        <div key={p.id} style={{ ...S.card, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={() => setSelected(p)}>
          <div>
            <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"2px" }}>
              <span style={{ fontWeight:"700", color:C.oat, fontSize:"13px" }}>{p.code||"(no code)"}</span>
              <span style={{ fontSize:"12px", color:C.muted }}>{p.name}</span>
              {p.buildingType && <span style={S.pill(C.accent)}>{p.buildingType}</span>}
            </div>
            <div style={{ display:"flex", gap:"6px" }}>
              <span style={S.pill(p.stage==="Stabilized"?C.sage:p.stage==="Builders Risk"?C.amber:C.teal)}>{p.stage||"Unknown"}</span>
              {p.sqft && <span style={{ fontSize:"11px", color:C.muted }}>{p.sqft+" sf"}</span>}
              {p.address && <span style={{ fontSize:"11px", color:C.muted }}>{p.address}</span>}
            </div>
          </div>
          <button style={B("danger")} onClick={e => { e.stopPropagation(); del(p.id); }}>X</button>
        </div>
      ))}
      {selected && <PropertyDetail prop={selected} onUpdate={upd} onClose={() => setSelected(null)} />}
    </div>
  );
}

function GenericTracker({ storageKey, title, emoji, typeOptions }) {
  const [items, setItems] = useStorage(storageKey, []);
  const [form, setForm] = useState({ summary:"", property:"", type:"", topic:"", ball:"", status:"Pending", urgency:"", notes:"" });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);

  const add = () => {
    if (!form.summary.trim()) return;
    setItems(prev => [{ id:uid(), at:now(), ...form, thread:[] }, ...prev]);
    setForm({ summary:"", property:"", type:"", topic:"", ball:"", status:"Pending", urgency:"", notes:"" });
  };
  const upd = (u) => setItems(prev => prev.map(i => i.id===u.id?u:i));
  const filtered = items.filter(i => !search||[i.summary,i.property,i.type,i.topic,i.ball,i.notes].join(" ").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={S.ttl}>{emoji+" "+title}</div>
      <div style={S.card}>
        <div style={S.lbl}>Summary</div>
        <input style={{ ...S.inp, marginBottom:"8px" }} placeholder="What is this?" value={form.summary} onChange={e => setForm(f => ({ ...f, summary:e.target.value }))} />
        <div style={S.row}>
          <DD label="Property" value={form.property} onChange={v => setForm(f => ({ ...f, property:v }))} options={PROPS} style={S.col()} />
          {typeOptions && <DD label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type:v }))} options={typeOptions} style={S.col()} />}
          <DD label="Topic" value={form.topic} onChange={v => setForm(f => ({ ...f, topic:v }))} options={TOPICS} style={S.col()} />
        </div>
        <div style={S.row}>
          <DD label="Ball in Court" value={form.ball} onChange={v => setForm(f => ({ ...f, ball:v }))} options={BALL} style={S.col()} />
          <DD label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status:v }))} options={["Pending","In Progress","Waiting","Complete"]} style={S.col()} />
          <DD label="Urgency" value={form.urgency} onChange={v => setForm(f => ({ ...f, urgency:v }))} options={URGENCY} style={S.col()} />
        </div>
        <div style={S.lbl}>Notes</div>
        <textarea style={{ ...S.ta, minHeight:"50px" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes:e.target.value }))} />
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"8px" }}><button style={B("teal")} onClick={add}>+ Add</button></div>
      </div>
      <input style={{ ...S.inp, marginBottom:"10px" }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(i => (
        <div key={i.id} style={{ ...S.card, borderLeft:"3px solid "+uColor(i.urgency) }}>
          <div style={{ display:"flex", justifyContent:"space-between", cursor:"pointer" }} onClick={() => setOpen(open===i.id?null:i.id)}>
            <div>
              <div style={{ fontWeight:"600", fontSize:"13px", color:C.oat, marginBottom:"4px" }}>{i.summary}</div>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                {i.property && <span style={S.pill(C.teal)}>{i.property}</span>}
                {i.type && <span style={S.pill(C.accent)}>{i.type}</span>}
                {i.status && <span style={S.pill(sColor(i.status))}>{i.status}</span>}
                {i.ball && <span style={{ fontSize:"11px", color:C.muted }}>{"Ball: "+i.ball}</span>}
              </div>
            </div>
            <span style={{ color:C.muted }}>{open===i.id?"v":">"}</span>
          </div>
          {open===i.id && (
            <div style={{ marginTop:"10px", borderTop:"1px solid "+C.border, paddingTop:"10px" }}>
              {i.notes && <div style={{ fontSize:"12px", whiteSpace:"pre-wrap", marginBottom:"8px" }}>{i.notes}</div>}
              <Thread thread={i.thread} onAdd={text => upd({ ...i, thread:[...(i.thread||[]), { id:uid(), text, from:"Me", at:now() }] })} />
              <div style={{ display:"flex", gap:"6px", marginTop:"8px" }}>
                <DD label="" value={i.status} onChange={v => upd({ ...i, status:v })} options={["Pending","In Progress","Waiting","Complete"]} style={{ flex:1 }} />
                <DD label="" value={i.ball} onChange={v => upd({ ...i, ball:v })} options={BALL} style={{ flex:1 }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const KEYS = { mws_triage:"Triage", mws_properties:"Properties", mws_br_v2:"Builders Risk", mws_guidance_v2:"Guidance Library", mws_riskeng:"Risk Engineering", mws_contracts:"Contracts", mws_legal:"Legal/LOC", mws_admin:"MS/SSST/Admin", mws_acq:"Acquisitions" };

  const doSearch = () => {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    const out = [];
    Object.entries(KEYS).forEach(([key,label]) => {
      try {
        const data = JSON.parse(localStorage.getItem(key)||"[]");
        (Array.isArray(data)?data:[]).forEach(item => { if (JSON.stringify(item).toLowerCase().includes(lower)) out.push({ label, item }); });
      } catch {}
    });
    setResults(out);
  };

  return (
    <div>
      <div style={S.ttl}>Search Everything</div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
        <input style={{ ...S.inp, flex:1 }} placeholder="Search across all workspaces..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if(e.key==="Enter") doSearch(); }} />
        <button style={B("teal")} onClick={doSearch}>Search</button>
      </div>
      {results.length>0 && <div style={{ fontSize:"11px", color:C.muted, marginBottom:"8px" }}>{results.length+" results"}</div>}
      {results.map((r,idx) => (
        <div key={idx} style={S.card}>
          <div style={{ fontSize:"10px", color:C.teal, fontWeight:"700", marginBottom:"4px" }}>{r.label}</div>
          <div style={{ fontSize:"13px", color:C.oat, fontWeight:"600" }}>{r.item.summary||r.item.question||r.item.name||r.item.code||r.item.projectName||"(item)"}</div>
          <div style={{ display:"flex", gap:"5px", marginTop:"4px", flexWrap:"wrap" }}>
            {r.item.property && <span style={S.pill(C.teal)}>{r.item.property}</span>}
            {r.item.status && <span style={S.pill(sColor(r.item.status))}>{r.item.status}</span>}
            {r.item.stage && <span style={S.pill(C.muted)}>{r.item.stage}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { id:"triage", label:"Triage", emoji:"Email" },
  { id:"br", label:"Builders Risk", emoji:"BR" },
  { id:"properties", label:"Properties", emoji:"Prop" },
  { id:"acq", label:"Acquisitions", emoji:"Acq" },
  { id:"contracts", label:"Contracts", emoji:"Doc" },
  { id:"guidance", label:"Guidance Lib", emoji:"Lib" },
  { id:"riskeng", label:"Risk Eng", emoji:"Insp" },
  { id:"legal", label:"Legal/LOC", emoji:"Leg" },
  { id:"admin", label:"MS/SSST", emoji:"MS" },
  { id:"search", label:"Search", emoji:"Srch" },
];

const ALL_KEYS = ["mws_triage","mws_properties","mws_br_v2","mws_guidance_v2","mws_riskeng","mws_contracts","mws_legal","mws_admin","mws_acq"];

function exportBackup() {
  const backup = { exportedAt: new Date().toISOString(), version: "1.0", data: {} };
  ALL_KEYS.forEach(k => {
    try { backup.data[k] = JSON.parse(localStorage.getItem(k) || "[]"); } catch { backup.data[k] = []; }
  });
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "MeridianWorkspace_Backup_" + new Date().toISOString().slice(0,10) + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

function importBackup(file, onDone) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const backup = JSON.parse(e.target.result);
      if (!backup.data) { alert("Invalid backup file."); return; }
      const confirmed = window.confirm("This will REPLACE all current data with the backup from " + (backup.exportedAt ? new Date(backup.exportedAt).toLocaleDateString() : "unknown date") + ". Continue?");
      if (!confirmed) return;
      Object.entries(backup.data).forEach(([k, v]) => {
        try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
      });
      alert("Backup restored. The page will now reload.");
      window.location.reload();
    } catch {
      alert("Could not read backup file. Make sure it is a valid Meridian backup JSON.");
    }
  };
  reader.readAsText(file);
}

function BackupBar() {
  const [msg, setMsg] = useState("");
  const fileRef = React.useRef();

  const doExport = () => {
    exportBackup();
    setMsg("Backup downloaded at " + new Date().toLocaleTimeString());
    setTimeout(() => setMsg(""), 4000);
  };

  const doImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    importBackup(file, () => {});
    e.target.value = "";
  };

  return (
    <div style={{ background:"#0f0d1a", borderBottom:"1px solid "+C.border, padding:"6px 18px", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
      <span style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"0.8px", color:C.muted, textTransform:"uppercase" }}>Data Backup</span>
      <button style={{ ...B("sage"), padding:"4px 12px", fontSize:"11px" }} onClick={doExport}>Export Backup</button>
      <button style={{ ...B("ghost"), padding:"4px 12px", fontSize:"11px" }} onClick={() => fileRef.current && fileRef.current.click()}>Import Backup</button>
      <input ref={fileRef} type="file" accept=".json" style={{ display:"none" }} onChange={doImport} />
      {msg && <span style={{ fontSize:"11px", color:C.sage }}>{msg}</span>}
      <span style={{ fontSize:"10px", color:C.muted, marginLeft:"auto" }}>Data stored in browser localStorage - export regularly to avoid loss</span>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("triage");
  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div>
          <div style={S.logo}>Meridian Workspace</div>
          <div style={S.sub}>Amanda Gardner | Goodman Group</div>
        </div>
      </div>
      <BackupBar />
      <div style={S.tabBar}>
        {TABS.map(t => <button key={t.id} style={S.tab(tab===t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <div style={S.body}>
        {tab==="triage" && <Triage />}
        {tab==="br" && <BuildersRisk />}
        {tab==="properties" && <Properties />}
        {tab==="acq" && <GenericTracker storageKey="mws_acq" title="Acquisitions" emoji="" typeOptions={["Due Diligence","LOI","Closing","Post-Close","Other"]} />}
        {tab==="contracts" && <GenericTracker storageKey="mws_contracts" title="Contract Review" emoji="" typeOptions={["Lease","Vendor Contract","Construction Contract","Service Agreement","LOI","Other"]} />}
        {tab==="guidance" && <GuidanceLibrary />}
        {tab==="riskeng" && <GenericTracker storageKey="mws_riskeng" title="Risk Engineering" emoji="" typeOptions={["Inspection","Report","Follow-Up","Re-Inspection","Carrier Commentary","Other"]} />}
        {tab==="legal" && <GenericTracker storageKey="mws_legal" title="Legal / Entities / LOC" emoji="" typeOptions={["Letter of Credit","Notary","Entity Maintenance","Legal Review","Other"]} />}
        {tab==="admin" && <GenericTracker storageKey="mws_admin" title="MS / SSST / Admin" emoji="" typeOptions={["Modern Slavery","SSST / COI","Admin","General To-Do","Other"]} />}
        {tab==="search" && <Search />}
      </div>
    </div>
  );
}
