export function startOfWeek(d){d=new Date(d);d.setHours(0,0,0,0);const x=d.getDay();d.setDate(d.getDate()-(x===0?6:x-1));return d}
export function currentStart(){return startOfWeek(new Date())}
export function weekKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
export function isPast(d){return d<currentStart()}
export function fmt(d){return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
