let res
let apiSrv=window.location.pathname
let password_value=document.querySelector("#passwordText").value
let buildValueItemFunc=buildValueTxt
function shorturl(){if(document.querySelector("#longURL").value==""){alert("Url cannot be empty!")
return}
document.getElementById('keyPhrase').value=document.getElementById('keyPhrase').value.replace(/\s/g,"-");document.getElementById("addBtn").disabled=true;document.getElementById("addBtn").innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Please wait...';fetch(apiSrv,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cmd:"add",url:document.querySelector("#longURL").value,key:document.querySelector("#keyPhrase").value,password:password_value})}).then(function(response){return response.json();}).then(function(myJson){res=myJson;document.getElementById("addBtn").disabled=false;document.getElementById("addBtn").innerHTML='Shorten it';if(res.status=="200"){let keyPhrase=res.key;let valueLongURL=document.querySelector("#longURL").value;localStorage.setItem(keyPhrase,valueLongURL);addUrlToList(keyPhrase,valueLongURL)
document.getElementById("result").innerHTML=window.location.protocol+"//"+window.location.host+"/"+res.key;}else{document.getElementById("result").innerHTML=res.error;}
var modal=new bootstrap.Modal(document.getElementById('resultModal'));modal.show();}).catch(function(err){alert("Unknow error. Please retry!");console.log(err);document.getElementById("addBtn").disabled=false;document.getElementById("addBtn").innerHTML='Shorten it';})}
function copyurl(id,attr){let target=null;if(attr){target=document.createElement('div');target.id='tempTarget';target.style.opacity='0';if(id){let curNode=document.querySelector('#'+id);target.innerText=curNode[attr];}else{target.innerText=attr;}
document.body.appendChild(target);}else{target=document.querySelector('#'+id);}
try{let range=document.createRange();range.selectNode(target);window.getSelection().removeAllRanges();window.getSelection().addRange(range);document.execCommand('copy');window.getSelection().removeAllRanges();}catch(e){console.log('Copy error')}
if(attr){target.parentElement.removeChild(target);}}
function loadUrlList(){let urlList=document.querySelector("#urlList")
while(urlList.firstChild){urlList.removeChild(urlList.firstChild)}
let longUrl=document.querySelector("#longURL").value
let len=localStorage.length
for(;len>0;len--){let keyShortURL=localStorage.key(len-1)
let valueLongURL=localStorage.getItem(keyShortURL)
if(longUrl==""||(longUrl==valueLongURL)){addUrlToList(keyShortURL,valueLongURL)}}}
function addUrlToList(shortUrl,longUrl){let urlList=document.querySelector("#urlList")
let child=document.createElement('div')
child.classList.add("mb-3","list-group-item")
let keyItem=document.createElement('div')
keyItem.classList.add("input-group")
let delBtn=document.createElement('button')
delBtn.setAttribute('type','button')
delBtn.classList.add("btn","btn-danger","rounded-bottom-0")
delBtn.setAttribute('onclick','deleteShortUrl(\"'+shortUrl+'\")')
delBtn.setAttribute('id','delBtn-'+shortUrl)
delBtn.innerText="X"
keyItem.appendChild(delBtn)
let qryCntBtn=document.createElement('button')
qryCntBtn.setAttribute('type','button')
qryCntBtn.classList.add("btn","btn-info")
qryCntBtn.setAttribute('onclick','queryVisitCount(\"'+shortUrl+'\")')
qryCntBtn.setAttribute('id','qryCntBtn-'+shortUrl)
qryCntBtn.innerText="?"
keyItem.appendChild(qryCntBtn)
let keyTxt=document.createElement('span')
keyTxt.classList.add("form-control","rounded-bottom-0")
keyTxt.innerText=window.location.protocol+"//"+window.location.host+"/"+shortUrl
keyItem.appendChild(keyTxt)
let qrcodeBtn=document.createElement('button')
qrcodeBtn.setAttribute('type','button')
qrcodeBtn.classList.add("btn","btn-info")
qrcodeBtn.setAttribute('onclick','buildQrcode(\"'+shortUrl+'\")')
qrcodeBtn.setAttribute('id','qrcodeBtn-'+shortUrl)
qrcodeBtn.innerText="QR"
keyItem.appendChild(qrcodeBtn)
child.appendChild(keyItem)
let qrcodeItem=document.createElement('div');qrcodeItem.setAttribute('id','qrcode-'+shortUrl)
child.appendChild(qrcodeItem)
child.appendChild(buildValueItemFunc(longUrl))
urlList.append(child)}
function clearLocalStorage(){localStorage.clear()}
function deleteShortUrl(delKeyPhrase){document.getElementById("delBtn-"+delKeyPhrase).disabled=true;document.getElementById("delBtn-"+delKeyPhrase).innerHTML='<span class="spinner-border spinner-border-sm" role="status"></span>';fetch(apiSrv,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cmd:"del",key:delKeyPhrase,password:password_value})}).then(function(response){return response.json();}).then(function(myJson){res=myJson;if(res.status=="200"){localStorage.removeItem(delKeyPhrase)
loadUrlList()
document.getElementById("result").innerHTML="Delete Successful"}else{document.getElementById("result").innerHTML=res.error;}
var modal=new bootstrap.Modal(document.getElementById('resultModal'));modal.show();}).catch(function(err){alert("Unknow error. Please retry!");console.log(err);})}
function queryVisitCount(qryKeyPhrase){document.getElementById("qryCntBtn-"+qryKeyPhrase).disabled=true;document.getElementById("qryCntBtn-"+qryKeyPhrase).innerHTML='<span class="spinner-border spinner-border-sm" role="status"></span>';fetch(apiSrv,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cmd:"qry",key:qryKeyPhrase+"-count",password:password_value})}).then(function(response){return response.json();}).then(function(myJson){res=myJson;if(res.status=="200"){document.getElementById("qryCntBtn-"+qryKeyPhrase).innerHTML=res.url;}else{document.getElementById("result").innerHTML=res.error;var modal=new bootstrap.Modal(document.getElementById('resultModal'));modal.show();}}).catch(function(err){alert("Unknow error. Please retry!");console.log(err);})}
function query1KV(){let qryKeyPhrase=document.getElementById("keyForQuery").value;if(qryKeyPhrase==""){return}
fetch(apiSrv,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cmd:"qry",key:qryKeyPhrase,password:password_value})}).then(function(response){return response.json();}).then(function(myJson){res=myJson;if(res.status=="200"){document.getElementById("longURL").value=res.url;document.getElementById("keyPhrase").value=qryKeyPhrase;document.getElementById("longURL").dispatchEvent(new Event('input',{bubbles:true,cancelable:true,}))}else{document.getElementById("result").innerHTML=res.error;var modal=new bootstrap.Modal(document.getElementById('resultModal'));modal.show();}}).catch(function(err){alert("Unknow error. Please retry!");console.log(err);})}
function loadKV(){clearLocalStorage();fetch(apiSrv,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cmd:"qryall",password:password_value})}).then(function(response){return response.json();}).then(function(myJson){res=myJson;if(res.status=="200"){res.kvlist.forEach(item=>{keyPhrase=item.key;valueLongURL=item.value;localStorage.setItem(keyPhrase,valueLongURL);});}else{document.getElementById("result").innerHTML=res.error;var modal=new bootstrap.Modal(document.getElementById('resultModal'));modal.show();}}).catch(function(err){alert("Unknow error. Please retry!");console.log(err);})}
function buildQrcode(shortUrl){var options={render:'canvas',minVersion:1,maxVersion:40,ecLevel:'Q',left:0,top:0,size:256,fill:'#000',background:null,text:window.location.protocol+"//"+window.location.host+"/"+shortUrl,radius:0,quiet:0,mode:0,mSize:0.1,mPosX:0.5,mPosY:0.5,label:'no label',fontname:'sans',fontcolor:'#000',image:null};$("#qrcode-"+shortUrl.replace(/(:|\.|\[|\]|,|=|@)/g,"\\$1").replace(/(:|\#|\[|\]|,|=|@)/g,"\\$1")).empty().qrcode(options);}
function buildValueTxt(longUrl){let valueTxt=document.createElement('div')
valueTxt.classList.add("form-control","rounded-top-0")
valueTxt.innerText=longUrl
return valueTxt}
document.addEventListener('DOMContentLoaded',function(){var popoverTriggerList=[].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList=popoverTriggerList.map(function(popoverTriggerEl){return new bootstrap.Popover(popoverTriggerEl)});loadUrlList();});