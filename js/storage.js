const STORAGE_KEY='weeklyPlannerStage1';
let data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{"categories":[],"weeks":{}}');
function ensureWeekShape(w){if(Array.isArray(w))return {priorities:w,nextWeek:[]};return {priorities:w?.priorities||[],nextWeek:w?.nextWeek||[]}}
Object.keys(data.weeks||{}).forEach(k=>data.weeks[k]=ensureWeekShape(data.weeks[k]));
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}
function getWeekData(date){let k=weekKey(date);if(!data.weeks[k])data.weeks[k]={priorities:[],nextWeek:[]};data.weeks[k]=ensureWeekShape(data.weeks[k]);return data.weeks[k]}
