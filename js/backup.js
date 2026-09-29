import {data,replaceData} from './storage.js';
const $=x=>document.getElementById(x);
export const BACKUP_VERSION=1;
function stamp(d=new Date()){
  const pad=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}
export function createBackup(){
  const payload={backupVersion:BACKUP_VERSION,createdAt:new Date().toISOString(),app:'Weekly Planner',data:JSON.parse(JSON.stringify(data))};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`weekly-planner-backup-${stamp()}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
}
function validWeek(w){return w&&typeof w==='object'&&!Array.isArray(w)&&['priorities','nextWeek','goals','schedule'].every(k=>Array.isArray(w[k]??[]))}
function validateBackup(b){
  if(!b||typeof b!=='object'||Array.isArray(b))return false;
  if(b.app!=='Weekly Planner'||b.backupVersion!==BACKUP_VERSION||typeof b.createdAt!=='string')return false;
  const d=b.data;if(!d||typeof d!=='object'||Array.isArray(d)||!Array.isArray(d.categories)||!d.weeks||typeof d.weeks!=='object'||Array.isArray(d.weeks))return false;
  if(!d.categories.every(c=>c&&typeof c==='object'&&typeof c.id==='string'&&typeof c.title==='string'&&typeof c.color==='string'))return false;
  return Object.values(d.weeks).every(w=>Array.isArray(w)||validWeek(w));
}
export function initBackup({goCurrent,rerender,show,hide}){
  $('backup').onclick=createBackup;
  $('restoreBackup').onclick=()=>{ $('restoreFile').value=''; $('restoreFile').click() };
  $('restoreFile').onchange=async e=>{
    const file=e.target.files?.[0];if(!file)return;
    let parsed;try{parsed=JSON.parse(await file.text())}catch{return showError('Invalid backup file. Your planner data has not been changed.',show,hide)}
    if(!validateBackup(parsed))return showError('Invalid or unsupported Weekly Planner backup. Your planner data has not been changed.',show,hide);
    show('Restore Backup','<p class="restore-warning">This will replace all planner data currently stored in this browser with the selected backup.</p><p class="restore-file"></p>','<button id="cancel">Cancel</button><button class="danger-solid" id="confirmRestore">Restore Backup</button>');
    document.querySelector('.restore-file').textContent=file.name;
    $('cancel').onclick=hide;
    $('confirmRestore').onclick=()=>{try{const copy=JSON.parse(JSON.stringify(parsed.data));replaceData(copy);hide();goCurrent();rerender()}catch{hide();showError('Restore failed. Your existing planner data has not been changed.',show,hide)}};
  };
}
function showError(message,show,hide){show('Restore Backup','<p class="restore-warning" id="restoreMessage"></p>','<button class="primary" id="restoreOk">OK</button>');$('restoreMessage').textContent=message;$('restoreOk').onclick=hide}
