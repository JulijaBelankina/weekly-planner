let selected=startOfWeek(new Date());
function startOfWeek(d){d=new Date(d);d.setHours(0,0,0,0);let x=d.getDay();d.setDate(d.getDate()-(x===0?6:x-1));return d}
function currentStart(){return startOfWeek(new Date())}
function weekKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function isPast(){return selected<currentStart()}
function fmt(d){return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
function renderWeekHeader(){let end=new Date(selected);end.setDate(end.getDate()+6);document.getElementById('weekLabel').textContent=fmt(selected)+' – '+fmt(end)+' '+end.getFullYear()}
