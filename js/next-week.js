import {save,ensureWeek} from './storage.js';import {weekKey} from './weeks.js';
let editing=null,selectedDate,rerender;const $=id=>document.getElementById(id);
export function initNextWeek(getDate,renderAll){rerender=renderAll;$('addNextBtn').onclick=()=>openAdd(getDate());$('nextCancel').onclick=close;$('nextSave').onclick=submit;$('nextInput').onkeydown=e=>{if(e.key==='Enter')submit();if(e.key==='Escape')close()};$('nextModal').onclick=e=>{if(e.target===e.currentTarget)close()}}
export function renderNextWeek(date,locked){selectedDate=date;const w=ensureWeek(weekKey(date)),list=$('nextList');list.innerHTML='';
 if(!w.nextWeek.length){const e=document.createElement('div');e.className='empty';e.textContent=locked?'No Next Week items were saved.':'No items yet.';list.appendChild(e)}
 w.nextWeek.forEach((item,i)=>{const row=document.createElement('div');row.className='next-row';const txt=document.createElement('div');txt.className='next-text';txt.textContent=item.text;txt.title=item.text;row.appendChild(txt);
 if(!locked){const ed=btn('✎','Edit item');ed.onclick=()=>openEdit(date,i);const rm=btn('×','Remove item');rm.onclick=()=>{w.nextWeek.splice(i,1);save();rerender()};row.append(ed,rm)}list.appendChild(row)});
 $('addNextBtn').style.display=locked?'none':'block';$('nextSub').textContent=locked?'This week is locked and cannot be changed.':'Add items for next week instead of squeezing them into this week.';
}
function btn(t,title){const b=document.createElement('button');b.className='icon-btn';b.textContent=t;b.title=title;return b}
function openAdd(d){selectedDate=d;editing=null;$('nextModalTitle').textContent='Add to Next Week';$('nextSave').textContent='Add item';$('nextInput').value='';open()}
function openEdit(d,i){selectedDate=d;editing=i;const w=ensureWeek(weekKey(d));$('nextModalTitle').textContent='Edit Next Week item';$('nextSave').textContent='Save';$('nextInput').value=w.nextWeek[i].text;open()}
function open(){$('nextError').textContent='';$('nextModal').classList.add('show');setTimeout(()=>$('nextInput').focus(),0)}function close(){$('nextModal').classList.remove('show')}
function submit(){const text=$('nextInput').value;if(!text){$('nextError').textContent='Enter a Next Week item.';return}const w=ensureWeek(weekKey(selectedDate));if(editing===null)w.nextWeek.push({text});else w.nextWeek[editing].text=text;save();close();rerender()}
