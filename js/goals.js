import {save,ensureWeek} from './storage.js';import {weekKey} from './weeks.js';import {category} from './priorities.js';
let editing=null,selectedDate,rerender;const $=id=>document.getElementById(id);
const STATUSES=['To Do','Not Done','Partially Done','Done'];
export function initGoals(getDate,renderAll){rerender=renderAll;$('addGoalBtn').onclick=()=>openAdd(getDate());$('goalCancel').onclick=close;$('goalSave').onclick=submit;$('goalInput').onkeydown=e=>{if(e.key==='Enter')submit();if(e.key==='Escape')close()};$('goalModal').onclick=e=>{if(e.target===e.currentTarget)close()}}
export function renderGoals(date,locked){selectedDate=date;const w=ensureWeek(weekKey(date)),list=$('goalList');list.innerHTML='';
 if(!w.goals.length){const e=document.createElement('div');e.className='empty';e.textContent=locked?'No goals were saved.':'No goals yet.';list.appendChild(e)}
 w.goals.forEach((g,i)=>{const c=g.priorityId?category(g.priorityId):null;const row=document.createElement('div');row.className='goal-row';
  const txt=document.createElement('div');txt.className='goal-text';txt.textContent=g.text;txt.title=g.text;txt.style.background=c?c.color:'#f1f2f4';row.appendChild(txt);
  if(locked){const s=document.createElement('div');s.className='status';s.textContent=g.status;row.appendChild(s)}
  else{const s=document.createElement('select');s.className='status';STATUSES.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;o.selected=v===g.status;s.appendChild(o)});s.onchange=()=>{g.status=s.value;save()};row.appendChild(s);
   const ed=btn('✎','Edit goal');ed.onclick=()=>openEdit(date,i);const rm=btn('×','Remove goal');rm.onclick=()=>{w.goals.splice(i,1);save();rerender()};row.append(ed,rm)}
  list.appendChild(row);
 });
 $('addGoalBtn').style.display=locked?'none':'block';$('goalsSub').textContent=locked?'This week is locked and cannot be changed.':'What do you want to achieve this week?';
}
function btn(t,title){const b=document.createElement('button');b.className='icon-btn';b.textContent=t;b.title=title;return b}
function populatePrioritySelect(date,value=null){const w=ensureWeek(weekKey(date)),sel=$('goalPriority');sel.innerHTML='';const none=document.createElement('option');none.value='';none.textContent='No priority';sel.appendChild(none);w.priorities.forEach(p=>{const c=category(p.id);if(c){const o=document.createElement('option');o.value=p.id;o.textContent=c.title;sel.appendChild(o)}});sel.value=value||''}
function openAdd(d){selectedDate=d;editing=null;$('goalModalTitle').textContent='Add goal';$('goalSave').textContent='Add goal';$('goalInput').value='';populatePrioritySelect(d);open()}
function openEdit(d,i){selectedDate=d;editing=i;const g=ensureWeek(weekKey(d)).goals[i];$('goalModalTitle').textContent='Edit goal';$('goalSave').textContent='Save changes';$('goalInput').value=g.text;populatePrioritySelect(d,g.priorityId);open()}
function open(){$('goalError').textContent='';$('goalModal').classList.add('show');setTimeout(()=>$('goalInput').focus(),0)}function close(){$('goalModal').classList.remove('show')}
function submit(){const text=$('goalInput').value;if(!text){$('goalError').textContent='Enter a goal.';return}const w=ensureWeek(weekKey(selectedDate)),priorityId=$('goalPriority').value||null;if(editing===null)w.goals.push({text,status:'To Do',priorityId});else{w.goals[editing].text=text;w.goals[editing].priorityId=priorityId}save();close();rerender()}
