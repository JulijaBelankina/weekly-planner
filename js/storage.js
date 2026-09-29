export const KEY='weeklyPlannerStage1';
const fallback={categories:[],weeks:{}};
export let data=load();
function load(){
 try{
  const parsed=JSON.parse(localStorage.getItem(KEY)||'null')||fallback;
  if(!parsed.categories)parsed.categories=[];
  if(!parsed.weeks)parsed.weeks={};
  migrate(parsed);
  return parsed;
 }catch{return structuredClone(fallback)}
}
function migrate(d){
 for(const k of Object.keys(d.weeks)){
  const old=d.weeks[k];
  if(Array.isArray(old)) d.weeks[k]={priorities:old,nextWeek:[],goals:[]};
  else{
   old.priorities=old.priorities||[];
   old.nextWeek=old.nextWeek||[];
   old.goals=old.goals||[];
  }
 }
}
export function save(){localStorage.setItem(KEY,JSON.stringify(data))}
export function ensureWeek(k){
 if(!data.weeks[k])data.weeks[k]={priorities:[],nextWeek:[],goals:[]};
 const w=data.weeks[k];
 w.priorities=w.priorities||[];w.nextWeek=w.nextWeek||[];w.goals=w.goals||[];
 return w;
}
