import {data,save,ensureWeek} from './storage.js';
import {weekKey,currentStart} from './weeks.js';
const PALETTE=['#c9efd7','#f7c6cb','#c6def5','#f7dda5','#d8cdf5','#f3c5e5','#bfe4df','#f5c6ad','#d8e9b9','#c8d5f5','#eed0a8','#c9e7f0','#e6c6f2','#f0d4d4','#cde5c0','#d5d2f0','#f4e0b8','#bddbd1','#e5c4b4','#c7d9ec','#d9e5bd','#e7cce2','#c6e1dc','#f0c8b8','#d5e0f2','#ead8af','#c9d9c0','#dfc8ee','#bcd8e5','#edcbd1','#d8e6c8','#f0d3b4','#c8c9e9','#c4e0d3','#e8c6da','#d7dfb5','#c9d7ef','#f0c9c1','#d6c7e8','#c2e2e2','#e8d0ba','#c9e0c1','#e2c8d8','#c7d4df','#eee0b7','#c8e4d8','#e5c9bf','#d2d7ef','#d8e1c0','#e3cee8'];
let editing=null, selectedDate, rerender;
const $=id=>document.getElementById(id);
export function category(id){return data.categories.find(c=>c.id===id)}
export function initPriorities(getDate,renderAll){
 rerender=renderAll;
 $('addPriorityBtn').onclick=()=>openAdd(getDate());
 $('priorityCancel').onclick=close;
 $('prioritySave').onclick=submit;
 $('categoryInput').onkeydown=e=>{if(e.key==='Enter')submit();if(e.key==='Escape')close()};
 $('priorityModal').onclick=e=>{if(e.target===e.currentTarget)close()};
}
export function renderPriorities(date,locked){
 selectedDate=date;const w=ensureWeek(weekKey(date)), list=$('priorityList');list.innerHTML='';
 $('count').innerHTML=locked?'<span class="locked">Locked</span>':w.priorities.length+' / 4';
 $('prioritySub').textContent=locked?'This week is locked and cannot be changed.':'Choose up to 4 main priorities for this week.';
 w.priorities.forEach((item,i)=>{
  const c=item.snapshot||category(item.id);if(!c)return;
  const row=document.createElement('div');row.className='priority-row';
  const name=document.createElement('div');name.className='priority-name';name.style.background=c.color;name.textContent=c.title;row.appendChild(name);
  if(!locked){
   const edit=button('✎','Rename category');edit.onclick=()=>openEdit(date,item.id);
   const remove=button('×','Remove from this week');remove.onclick=()=>{w.priorities.splice(i,1);unlinkGoals(w,item.id);save();rerender()};
   row.append(edit,remove);
  } list.appendChild(row);
 });
 $('addPriorityBtn').style.display=locked?'none':'block';$('addPriorityBtn').disabled=w.priorities.length>=4;
}
function button(t,title){const b=document.createElement('button');b.className='icon-btn';b.textContent=t;b.title=title;return b}
function openAdd(date){selectedDate=date;editing=null;$('priorityModalTitle').textContent='Add priority';$('prioritySave').textContent='Add priority';$('categoryInput').value='';open()}
function openEdit(date,id){selectedDate=date;editing=id;const c=category(id);$('priorityModalTitle').textContent='Edit category';$('prioritySave').textContent='Save';$('categoryInput').value=c.title;open()}
function open(){$('priorityError').textContent='';$('priorityModal').classList.add('show');setTimeout(()=>$('categoryInput').focus(),0)}
function close(){$('priorityModal').classList.remove('show')}
function freezePastUses(id,title,color){Object.entries(data.weeks).forEach(([wk,w])=>{if(new Date(wk+'T00:00:00')<currentStart())w.priorities.forEach(it=>{if(it.id===id&&!it.snapshot)it.snapshot={title,color}})})}
function unlinkGoals(w,id){w.goals.forEach(g=>{if(g.priorityId===id)g.priorityId=null})}
function submit(){
 const title=$('categoryInput').value;if(!title){$('priorityError').textContent='Enter a category name.';return}
 const w=ensureWeek(weekKey(selectedDate));
 if(editing){const c=category(editing);freezePastUses(c.id,c.title,c.color);c.title=title;save();close();rerender();return}
 if(w.priorities.length>=4)return;
 let c=data.categories.find(x=>x.title===title);
 if(c&&w.priorities.some(x=>x.id===c.id)){$('priorityError').textContent='This priority is already in this week.';return}
 if(!c){const used=new Set(data.categories.map(x=>x.color));const color=PALETTE.find(x=>!used.has(x))||PALETTE[data.categories.length%PALETTE.length];c={id:'c'+Date.now()+Math.random().toString(16).slice(2),title,color};data.categories.push(c)}
 w.priorities.push({id:c.id});save();close();rerender();
}
