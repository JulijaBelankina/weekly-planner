import {startOfWeek,currentStart,weekKey,isPast,fmt} from './weeks.js';
import {ensureWeek,save} from './storage.js';
import {initPriorities,renderPriorities} from './priorities.js';
import {initNextWeek,renderNextWeek} from './next-week.js';
import {initGoals,renderGoals} from './goals.js';
let selected=startOfWeek(new Date());const $=id=>document.getElementById(id);
function getDate(){return selected}
function render(){ensureWeek(weekKey(selected));const end=new Date(selected);end.setDate(end.getDate()+6);$('weekLabel').textContent=fmt(selected)+' – '+fmt(end)+' '+end.getFullYear();const locked=isPast(selected);renderPriorities(selected,locked);renderNextWeek(selected,locked);renderGoals(selected,locked);save()}
initPriorities(getDate,render);initNextWeek(getDate,render);initGoals(getDate,render);
$('prev').onclick=()=>{selected=new Date(selected);selected.setDate(selected.getDate()-7);render()};
$('next').onclick=()=>{selected=new Date(selected);selected.setDate(selected.getDate()+7);render()};
$('today').onclick=()=>{selected=currentStart();render()};
render();
