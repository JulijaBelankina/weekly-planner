export const KEY='weeklyPlannerStage1';
export let data=JSON.parse(localStorage.getItem(KEY)||'null')||{categories:[],weeks:{}};
export function normaliseData(target=data){
  target.categories??=[];target.weeks??={};
  for(const k in target.weeks){const x=target.weeks[k];if(Array.isArray(x))target.weeks[k]={priorities:x,nextWeek:[],goals:[],schedule:[]};else{x.priorities??=[];x.nextWeek??=[];x.goals??=[];x.schedule??=[]}}
  return target;
}
normaliseData();
export function save(){localStorage.setItem(KEY,JSON.stringify(data))}
export function week(k){return data.weeks[k]??=( {priorities:[],nextWeek:[],goals:[],schedule:[]} )}
export function cat(id){return data.categories.find(x=>x.id===id)}
export function replaceData(newData){data=normaliseData(newData);save()}
