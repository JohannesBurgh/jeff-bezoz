/* ============================================================
   MOTOR.JS  ·  läser VARLD.JS och bygger institutionen i Three.js
   Här bor rummet, dockbygget, dansstegen och kamerorna.
   ============================================================ */
(function(){
'use strict';
var V=window.BEZOZ_VARLD, fel=document.getElementById('fel');
if(!window.THREE||!V){fel.style.display='block';return;}
var T=THREE, BPM=V.lat.bpm||120, SPB=60/BPM, SLAG=V.lat.slag||null;
var lugn=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
var canvas=document.getElementById('scen'), renderer;
try{renderer=new T.WebGLRenderer({canvas:canvas,antialias:true});}catch(e){fel.style.display='block';return;}
var DPR=Math.min(devicePixelRatio||1,2);renderer.setPixelRatio(DPR);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
var scene=new T.Scene(), RYMD=new T.Color(0x130d0a), ALP=new T.Color(0x8fd0ff);
scene.background=RYMD.clone();scene.fog=new T.Fog(0x130d0a,40,110);
var cam=new T.PerspectiveCamera(50,1,.1,300);
function $(id){return document.getElementById(id);}

/* ---------- sidans texter ---------- */
(function(){
  var h=$('titel');V.titel.forEach(function(r,i){var s=document.createElement('span');
    if(i===V.titel.length-1){s.textContent=r.slice(0,-1);var z=document.createElement('span');z.className='z';z.textContent=r.slice(-1);s.appendChild(z);}
    else{s.textContent=r;}h.appendChild(s);});
  $('avs').textContent=V.avsandare;$('mot').textContent=V.mottagare;$('under').textContent=V.underrad;$('finstilt').textContent=V.finstilt;
  function tv(id,st){var d=document.createElement('div');d.className='tv';if(!/^[\w-]{6,20}$/.test(id||'')){return d;}
    d.style.backgroundImage='url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg)';d.setAttribute('role','button');d.tabIndex=0;d.setAttribute('aria-label','Spela videon');
    var kn=document.createElement('span');kn.className='spelknapp';d.appendChild(kn);
    if(st){var sm=document.createElement('span');sm.className='stampel tvs';sm.textContent=st;d.appendChild(sm);}
    function go(){if(d.dataset.pa){return;}d.dataset.pa='1';if(window.BEZOZ&&BEZOZ.tystna){BEZOZ.tystna();}
      var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1';
      f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.title='Video';d.appendChild(f);}
    d.onclick=go;d.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}};return d;}
  var vd=V.video||{}, vr=$('videoruta');
  if(vr&&vd.youtube){vr.appendChild(tv(vd.youtube,vd.stampel));var yl=$('ytlank');if(yl){yl.href='https://youtu.be/'+vd.youtube;}}
  else if($('video')){$('video').style.display='none';var sp=$('spela');if(sp){sp.style.display='none';}}
  var ka=$('kontakt');if(ka&&V.kontakt){ka.href='mailto:'+V.kontakt;ka.textContent=V.kontakt;}else if(ka){ka.parentNode.style.display='none';}
  var bo=$('bonusrutor');
  if(bo){(V.bonus||[]).forEach(function(x){var k=document.createElement('div');k.className='bk';k.appendChild(tv(x.youtube,''));
      var t=document.createElement('h3');t.textContent=x.rubrik||'';k.appendChild(t);if(x.text){var q=document.createElement('p');q.textContent=x.text;k.appendChild(q);}
      if(x.fil){var hl=document.createElement('a');hl.className='kop';hl.href=x.fil;hl.setAttribute('download','');hl.textContent='HÄMTA';hl.style.textDecoration='none';k.appendChild(hl);}bo.appendChild(k);});
    if(!(V.bonus||[]).length){var tom=document.createElement('div');tom.className='s';tom.innerHTML='<b>BONUS</b><h3></h3><p></p><span class="stampel"></span>';
      tom.children[0].textContent='KOMMER';tom.children[1].textContent='Fler flippar är på väg';tom.children[2].textContent='Fler tagningar från mötet, och de första flipparna från er som gör egna.';tom.children[3].textContent='PACKAS';bo.appendChild(tom);}}
  var dl=$('hamta');if(dl){if(V.byggsats_lank){dl.href=V.byggsats_lank;$('ejan').style.display='none';}else{dl.style.display='none';}}
  var p=$('paket');V.paket.forEach(function(d){var e=document.createElement('div');e.className='s';
    e.innerHTML='<b></b><h3></h3><p></p><span class="stampel"></span>';
    e.children[0].textContent=d.nr;e.children[1].textContent=d.rubrik;e.children[2].textContent=d.text;e.children[3].textContent=d.stampel;p.appendChild(e);});
})();

/* ---------- texturer ---------- */
function tex(w,h,fn,rep){var c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);
  var t=new T.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function rnd(a,b){return a+Math.random()*(b-a);}
var tKartong=tex(256,256,function(g,w,h){g.fillStyle='#c9a06a';g.fillRect(0,0,w,h);
  for(var i=0;i<w;i+=4){g.fillStyle='rgba(90,58,34,'+rnd(.03,.12)+')';g.fillRect(i,0,2,h);}
  for(i=0;i<300;i++){g.fillStyle='rgba(255,235,200,'+rnd(0,.08)+')';g.fillRect(rnd(0,w),rnd(0,h),rnd(2,14),1);}},[2,2]);
var tPanel=tex(256,256,function(g,w,h){g.fillStyle='#8a5a2c';g.fillRect(0,0,w,h);
  for(var i=0;i<8;i++){g.fillStyle=i%2?'#7d4f25':'#93622f';g.fillRect(i*32,0,30,h);g.fillStyle='#4a2c12';g.fillRect(i*32+30,0,2,h);
    for(var j=0;j<14;j++){g.fillStyle='rgba(50,25,8,'+rnd(.05,.18)+')';g.fillRect(i*32+rnd(0,26),rnd(0,h),1,rnd(20,90));}}},[4,1]);
var tMatta=tex(128,128,function(g,w,h){g.fillStyle='#a8541c';g.fillRect(0,0,w,h);
  for(var i=0;i<1400;i++){g.fillStyle=Math.random()<.5?'rgba(60,25,5,.25)':'rgba(240,160,80,.18)';g.fillRect(rnd(0,w),rnd(0,h),2,2);}
  g.strokeStyle='rgba(226,177,60,.55)';g.lineWidth=6;g.beginPath();g.arc(64,64,40,0,7);g.stroke();
  g.strokeStyle='rgba(60,25,5,.4)';g.beginPath();g.arc(64,64,22,0,7);g.stroke();},[8,5]);
function ritaTavla(g,w,h){g.fillStyle='#1d2b22';g.fillRect(0,0,w,h);
  for(var i=0;i<60;i++){g.fillStyle='rgba(255,255,255,'+rnd(.01,.04)+')';g.fillRect(rnd(0,w),rnd(0,h),rnd(60,260),rnd(6,26));}
  g.fillStyle='#f3efe2';g.textBaseline='middle';
  g.font='150px "Bowlby One",Impact,sans-serif';g.save();g.translate(40,120);g.rotate(-.03);g.fillText(V.tavlan.stort,0,0,930);g.restore();
  g.font='700 44px "Courier Prime",monospace';
  [[60,250,-.02],[380,300,.04],[700,240,-.06],[90,340,.03],[720,340,.02]].forEach(function(s){g.save();g.translate(s[0],s[1]);g.rotate(s[2]);g.fillText(V.tavlan.smatt,0,0);g.restore();});
  g.strokeStyle='#f3efe2';g.lineWidth=5;
  g.strokeRect(430,215,60,50);g.beginPath();g.moveTo(500,240);g.lineTo(560,240);g.lineTo(548,230);g.moveTo(560,240);g.lineTo(548,250);g.stroke();
  g.beginPath();g.moveTo(590,265);g.lineTo(590,225);g.lineTo(605,200);g.lineTo(620,225);g.lineTo(620,265);g.closePath();g.stroke();
  g.strokeStyle='#e2b13c';g.lineWidth=7;g.beginPath();g.ellipse(520,120,490,95,-.03,0,7);g.stroke();}
var tTavla=tex(1024,400,ritaTavla);
function etikettTex(rader,bg,fg){return tex(256,128,function(g,w,h){g.fillStyle=bg||'#f6ead2';g.fillRect(0,0,w,h);
  g.fillStyle=fg||'#3b2616';g.textAlign='center';g.textBaseline='middle';g.font='900 '+(rader.length>1?44:52)+'px "Bowlby One",Impact,sans-serif';
  rader.forEach(function(r,i){g.fillText(r,w/2,h/2+(i-(rader.length-1)/2)*50,236);});});}
/* tygmönster till kläderna */
var MONSTER={
  tweed:function(c){return tex(64,64,function(g,w,h){g.fillStyle=c;g.fillRect(0,0,w,h);g.lineWidth=2;
    for(var y=-8;y<h+8;y+=8){for(var x=0;x<w;x+=16){g.strokeStyle='rgba(20,12,6,.35)';g.beginPath();g.moveTo(x,y);g.lineTo(x+8,y+8);g.lineTo(x+16,y);g.stroke();
      g.strokeStyle='rgba(240,220,190,.18)';g.beginPath();g.moveTo(x,y+4);g.lineTo(x+8,y+12);g.lineTo(x+16,y+4);g.stroke();}}},[2,2]);},
  kritstreck:function(c){return tex(64,64,function(g,w,h){g.fillStyle=c;g.fillRect(0,0,w,h);g.fillStyle='rgba(235,235,225,.55)';
    for(var x=4;x<w;x+=16){g.fillRect(x,0,2,h);}},[2,1]);},
  pastell:function(){return tex(96,96,function(g,w,h){var f=['#f4b6c2','#b8d8c8','#c9b8e8','#f6e3a1','#a9c9ec','#f2c8a8'];g.fillStyle='#e8e2d6';g.fillRect(0,0,w,h);
    for(var y=0;y<h;y+=24){for(var x=0;x<w;x+=24){g.fillStyle=f[(x/24+y/8)%6|0];g.beginPath();g.moveTo(x,y+24);g.lineTo(x+12,y);g.lineTo(x+24,y+24);g.fill();
      g.fillStyle=f[(x/24+y/12+3)%6|0];g.beginPath();g.moveTo(x+12,y);g.lineTo(x+36,y);g.lineTo(x+24,y+24);g.fill();}}},[2,2]);},
  'argyle-vast':function(){return tex(64,64,function(g,w,h){g.fillStyle='#b8862e';g.fillRect(0,0,w,h);g.fillStyle='#5a3a22';
    for(var y=-32;y<h+32;y+=32){for(var x=-16;x<w+32;x+=32){var ox=(y/32)%2?16:0;g.beginPath();g.moveTo(x+ox,y+16);g.lineTo(x+ox+16,y);g.lineTo(x+ox+32,y+16);g.lineTo(x+ox+16,y+32);g.fill();}}
    g.strokeStyle='rgba(246,234,210,.5)';g.lineWidth=1;for(var i=-64;i<128;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i+64,64);g.moveTo(i+64,0);g.lineTo(i,64);g.stroke();}},[2,2]);}
};

/* ---------- byggklossar ---------- */
function M(c,o){o=o||{};o.color=c;o.flatShading=true;return new T.MeshLambertMaterial(o);}
function MM(c,monster){if(monster&&MONSTER[monster]&&monster!=='argyle-vast'){return new T.MeshLambertMaterial({map:MONSTER[monster](c)});}return M(c);}
var mKartong=new T.MeshLambertMaterial({map:tKartong}), mTejp=M(0xa97c44), mMork=M(0x2a1a10);
function box(w,h,d,m,x,y,z,p){var b=new T.Mesh(new T.BoxGeometry(w,h,d),m);b.position.set(x||0,y||0,z||0);b.castShadow=true;b.receiveShadow=true;(p||scene).add(b);return b;}
function sph(r,m,x,y,z,p,seg){var s=new T.Mesh(new T.SphereGeometry(r,seg||10,seg?seg-2:8),m);s.position.set(x,y,z);s.castShadow=true;(p||scene).add(s);return s;}
function cyl(a,b,h,m,x,y,z,p,seg){var s=new T.Mesh(new T.CylinderGeometry(a,b,h,seg||12),m);s.position.set(x,y,z);s.castShadow=true;(p||scene).add(s);return s;}

/* ---------- ljus ---------- */
var hemi=new T.HemisphereLight(0xffe2b8,0x3a2414,.75);scene.add(hemi);
var sol=new T.DirectionalLight(0xfff0d8,.85);sol.position.set(7,16,10);sol.castShadow=true;
sol.shadow.mapSize.set(1024,1024);var sc=sol.shadow.camera;sc.left=-12;sc.right=12;sc.top=12;sc.bottom=-12;sc.far=50;scene.add(sol);
var lampa=new T.PointLight(0xff8a2a,1.1,16);lampa.position.set(0,4.6,.3);scene.add(lampa);

/* ---------- rummet i kartongen ---------- */
var W=16,D=10,H=5.2,i,s,a;
var rum=new T.Group();scene.add(rum);
box(W+.4,.3,D+.4,mKartong,0,-.15,0,rum);
var golv=new T.Mesh(new T.PlaneGeometry(W,D),new T.MeshLambertMaterial({map:tMatta}));golv.rotation.x=-Math.PI/2;golv.position.y=.01;golv.receiveShadow=true;rum.add(golv);
box(W+.4,H,.2,mKartong,0,H/2,-D/2-.1,rum);box(.2,H,D+.4,mKartong,-W/2-.1,H/2,0,rum);box(.2,H,D+.4,mKartong,W/2+.1,H/2,0,rum);
var panel=new T.MeshLambertMaterial({map:tPanel});
var pb=new T.Mesh(new T.PlaneGeometry(W,H-.4),panel);pb.position.set(0,H/2-.2,-D/2+.02);pb.receiveShadow=true;rum.add(pb);
var pl=new T.Mesh(new T.PlaneGeometry(D,H-.4),panel);pl.rotation.y=Math.PI/2;pl.position.set(-W/2+.02,H/2-.2,0);rum.add(pl);
var pr=new T.Mesh(new T.PlaneGeometry(D,H-.4),panel);pr.rotation.y=-Math.PI/2;pr.position.set(W/2-.02,H/2-.2,0);rum.add(pr);
var fb=new T.Group();fb.position.set(0,H,-D/2-.1);fb.rotation.x=-.55;box(W+.4,.12,3.4,mKartong,0,0,-1.7,fb);rum.add(fb);
var fl=new T.Group();fl.position.set(-W/2-.1,H,0);fl.rotation.z=.7;box(3.4,.12,D+.4,mKartong,-1.7,0,0,fl);rum.add(fl);
var fr=new T.Group();fr.position.set(W/2+.1,H,0);fr.rotation.z=-.7;box(3.4,.12,D+.4,mKartong,1.7,0,0,fr);rum.add(fr);
var ff=new T.Group();ff.position.set(0,0,D/2+.2);ff.rotation.x=.25;box(W+.4,.12,3,mKartong,0,-.1,1.5,ff);rum.add(ff);box(1.1,.02,3.01,mTejp,0,-.03,1.5,ff);
function skylt(rader,w,h,x,y,z,ry,bg,fg,p){var m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshLambertMaterial({map:etikettTex(rader,bg,fg)}));
  m.position.set(x,y,z);m.rotation.y=ry||0;(p||rum).add(m);return m;}
skylt(V.skyltar.hoger,3,1.5,W/2+.21,2.6,1.5,Math.PI/2,'#e8621c','#f6ead2');
skylt(V.skyltar.vanster,3,1.5,-W/2-.21,2.6,1.5,-Math.PI/2);
box(9.4,3.2,.12,M(0x5a3a22),0,2.75,-D/2+.1,rum);
var tavla=new T.Mesh(new T.PlaneGeometry(9,2.8),new T.MeshLambertMaterial({map:tTavla}));tavla.position.set(0,2.75,-D/2+.18);rum.add(tavla);
box(9.4,.1,.3,M(0x5a3a22),0,1.2,-D/2+.25,rum);
var mBord=M(0x6e431f);box(6.4,.14,1.7,mBord,0,.95,0,rum);
[[-2.9,-.65],[2.9,-.65],[-2.9,.65],[2.9,.65]].forEach(function(p){box(.14,.9,.14,mBord,p[0],.45,p[1],rum);});
var papper=[];for(i=0;i<9;i++){var pp=box(.3,.01,.42,M(0xf6ead2),rnd(-2.8,2.8),1.03,rnd(-.6,.6),rum);pp.rotation.y=rnd(0,3);pp.castShadow=false;papper.push(pp);}
var oh=new T.Group();oh.position.set(-5.6,0,1.6);rum.add(oh);
box(.9,.8,.9,M(0x6b6f66),0,.4,0,oh);box(.8,.05,.8,M(0xf6ead2,{emissive:0xfff2c0,emissiveIntensity:.6}),0,.83,0,oh);
cyl(.03,.03,1,M(0x333333),.38,1.3,-.38,oh);box(.3,.2,.4,M(0x6b6f66),.25,1.8,-.25,oh);
cyl(.11,.11,.42,M(0xc0261b),2.2,1.24,.3,rum);cyl(.06,.11,.1,M(0x222222),2.2,1.5,.3,rum);
cyl(.35,.25,.5,M(0xb5532a),6.9,.25,3.9,rum);
for(i=0;i<7;i++){var bl=box(.08,rnd(.8,1.5),.3,M(0x4d7a34),6.9+rnd(-.1,.1),.9,3.9+rnd(-.1,.1),rum);bl.rotation.set(rnd(-.5,.5),rnd(0,3),rnd(-.5,.5));}
var lampG=new T.Group();lampG.position.set(0,H+3,.3);rum.add(lampG);
cyl(.02,.02,3.4,mMork,0,-1.7,0,lampG);cyl(.25,.85,.6,M(0xe8621c,{emissive:0xe8621c,emissiveIntensity:.35}),0,-3.5,0,lampG,16);
sph(.16,M(0xfff0c0,{emissive:0xffdd88}),0,-3.75,0,lampG);
function stol(x,z,ry){var g=new T.Group();g.position.set(x,0,z);g.rotation.y=ry;rum.add(g);var m=M(0xb7892f);
  box(.55,.08,.55,m,0,.55,0,g);box(.55,.6,.08,m,0,.95,-.24,g);cyl(.04,.04,.5,mMork,0,.27,0,g);cyl(.3,.3,.04,mMork,0,.03,0,g,5);return g;}
var stolar=[stol(-2,-1.5,0),stol(0,-1.6,0),stol(2,-1.5,0),stol(-4,0,Math.PI/2),stol(4,0,-Math.PI/2)];

/* ---------- statyn: ingen på institutionen har sett honom ---------- */
var staty=new T.Group();staty.position.set(-6.5,0,-4.05);staty.rotation.y=.45;rum.add(staty);
(function(){var mar=M(0xe9e3d6), guld=M(0xc79a2e,{emissive:0x5a3c00,emissiveIntensity:.35});
  box(1,.16,1,mar,0,.08,0,staty);box(.8,.8,.8,mar,0,.56,0,staty);box(1,.12,1,mar,0,1.02,0,staty);
  skylt(V.staty&&V.staty.skylt||['JEFF','BEZOZ'],.7,.35,0,.58,.41,0,'#3b2616','#e2b13c',staty);
  var f=new T.Group();f.position.y=1.08;staty.add(f);
  box(.2,.8,.22,guld,-.15,.4,0,f);box(.2,.8,.22,guld,.15,.4,0,f);box(.6,.72,.34,guld,0,1.16,0,f);
  var a1=new T.Group();a1.position.set(-.38,1.46,0);a1.rotation.z=-2.7;f.add(a1);box(.15,.7,.15,guld,0,-.35,0,a1);box(.34,.28,.34,mKartong,0,-.86,0,a1);
  var a2=new T.Group();a2.position.set(.38,1.46,0);a2.rotation.z=.5;a2.rotation.x=-.5;f.add(a2);box(.15,.66,.15,guld,0,-.33,0,a2);
  cyl(.1,.12,.12,guld,0,1.58,0,f,8);
  var hk=box(.62,.6,.62,mKartong,0,1.94,0,f);hk.rotation.y=.12;box(.64,.1,.16,mTejp,0,2.2,0,f);
  sph(.06,svartS(),-.14,1.98,.31,f);sph(.06,svartS(),.14,1.98,.31,f);
  [-.75,.75].forEach(function(x){cyl(.04,.04,.9,M(0xb08a2a),x,.45,.95,staty,8);sph(.07,M(0xb08a2a),x,.93,.95,staty);});
  box(1.5,.05,.05,M(0x9a1c1c),0,.78,.95,staty);})();
function svartS(){return M(0x16100c);}

/* ---------- dockbygget: en person ur VARLD.JS ---------- */
var vit=M(0xffffff), svart=M(0x16100c);
function hatt(p){var g=new T.Group();g.position.y=.2;cyl(.36,.36,.04,M(0x2f5d2c),0,0,0,g,14);cyl(.17,.26,.3,M(0x2f5d2c),0,.16,0,g,14);
  cyl(.265,.265,.06,M(0xe2b13c),0,.05,0,g,14);var f=box(.04,.36,.1,M(0xc0261b),.22,.32,0,g);f.rotation.z=-.3;g.visible=false;p.add(g);return g;}
function gubbe(d,nr){var u=d.utseende||{}, ex=u.extra||[];function har(n){return ex.indexOf(n)>=0;}
  var stor=har('for-stor-kostym')?1.14:1;
  var g=new T.Group();g.position.set(d.plats[0],d.pa_bordet?1.02:0,d.plats[1]);rum.add(g);
  var hud=M(u.hud||'#e9b48f'), mb=MM(u.byxa||'#444444',u.monster==='kritstreck'?'kritstreck':null), mt=MM(u.overdel||'#777777',u.monster), mSko=M(u.skor||'#16100c');
  var hips=new T.Group();hips.position.y=.95;g.add(hips);
  function ben(x){var b=new T.Group();b.position.set(x,0,0);hips.add(b);
    if(har('kortbyxa')){box(.24*stor,.68,.26*stor,mb,0,-.34,0,b);box(.15,.2,.16,vit,0,-.76,0,b);}
    else{box(.22*stor,.88,.24*stor,mb,0,-.44,0,b);}
    if(har('sandaler')){box(.2,.06,.36,mSko,0,-.92,.06,b);box(.16,.1,.2,vit,0,-.86,.02,b);box(.22,.04,.06,mSko,0,-.84,.12,b);}
    else{box(.24,.1,.36,mSko,0,-.9,.06,b);}return b;}
  var bL=ben(-.16), bR=ben(.16);
  var bal=new T.Group();hips.add(bal);
  box(.64*stor,.74,.36*stor,mt,0,.4,0,bal);
  var fz=.185*stor;
  if(u.kavaj){box(.2,.5,.02,M(u.skjorta||'#ffffff'),0,.5,fz,bal);var lp=box(.1,.5,.03,mt,-.13,.5,fz+.005,bal);lp.rotation.z=-.22;lp=box(.1,.5,.03,mt,.13,.5,fz+.005,bal);lp.rotation.z=.22;}
  if(u.monster==='argyle-vast'){var mv=new T.MeshLambertMaterial({map:MONSTER['argyle-vast']()});box(.66,.6,.38,mv,0,.36,0,bal);box(.16,.2,.02,mt,0,.68,.2,bal);}
  if(u.slips){box(.07,.44,.025,M(u.slips),0,.5,fz+(u.monster==='argyle-vast'?.02:.014),bal);}
  if(u.polo){cyl(.14,.15,.14,M(u.polo),0,.8,0,bal,10);box(.18,.5,.02,M(u.polo),0,.5,fz,bal);}
  if(har('mage')){var mg=sph(.37,u.monster==='argyle-vast'?new T.MeshLambertMaterial({map:MONSTER['argyle-vast']()}):mt,0,.24,.1,bal);mg.scale.set(1,.9,.9);}
  if(har('nyckelband')){box(.02,.4,.01,svart,-.05,.55,fz+.012,bal).rotation.z=-.12;box(.02,.4,.01,svart,.05,.55,fz+.012,bal).rotation.z=.12;box(.12,.16,.012,vit,0,.3,fz+.014,bal);}
  function arm(x){var p=new T.Group();p.position.set(x,.7,0);bal.add(p);
    if(u.kortarm){box(.18,.3,.18,mt,0,-.15,0,p);box(.13,.44,.13,hud,0,-.5,0,p);}
    else{box(.16*stor,.7*stor,.16*stor,mt,0,-.35*stor,0,p);}
    sph(.125,hud,0,-.76,0,p);return p;}
  var aL=arm(-.4*stor), aR=arm(.4*stor);
  if(har('parm')){box(.3,.38,.07,M(0x3a2418),.02,-.74,.1,aR);box(.26,.34,.03,M(0xf6ead2),.02,-.74,.15,aR);}
  if(har('raknarklocka')){box(.15,.07,.15,svart,0,-.62,0,aL);box(.08,.04,.02,M(0x9fb39a),0,-.62,.08,aL);}
  var hals=new T.Group();hals.position.y=.82;bal.add(hals);
  sph(.26,hud,0,.24,0,hals,12);
  var hg=new T.Group();hg.position.y=.24;hals.add(hg);
  sph(.07,vit,-.1,.06,.21,hg);sph(.07,vit,.1,.06,.21,hg);sph(.03,svart,-.1,.06,.27,hg);sph(.03,svart,.1,.06,.27,hg);
  sph(.055,M(u.hud||'#e9b48f'),0,-.01,.265,hg);sph(.05,hud,-.26,.02,0,hg);sph(.05,hud,.26,.02,0,hg);
  if(u.skagg){var sk=sph(.21,M(u.skagg),0,-.15,.08,hg,10);sk.scale.set(1.15,.85,.9);box(.22,.045,.05,M(u.skagg),0,-.065,.25,hg);}
  var mun=sph(.09,M(0x4a1010),0,-.14,.215,hg);mun.scale.set(1,.3,.6);
  if(har('tandstallning')){box(.13,.022,.02,M(0xcfd3d6),0,-.115,.27,hg);}
  var tunga=box(.07,.03,.16,M(0xe8566b),0,-.16,.27,hg);tunga.visible=false;
  /* hår */
  var h=u.har||{}, mh=M(h.farg||'#333333'), k;
  if(h.typ==='krans'){sph(.12,mh,-.24,.02,-.06,hg);sph(.12,mh,.24,.02,-.06,hg);k=sph(.2,mh,0,-.02,-.16,hg);k.scale.set(1.2,.7,.7);}
  else if(h.typ==='tunn'){k=sph(.255,mh,0,.09,-.06,hg,12);k.scale.set(1,.62,.95);sph(.09,mh,-.24,.04,-.04,hg);sph(.09,mh,.24,.04,-.04,hg);}
  else if(h.typ==='lockig-uppsatt'){for(k=0;k<11;k++){var va=k/11*6.283;sph(.12,mh,Math.cos(va)*.22,.12+Math.sin(k*2.3)*.04,Math.sin(va)*.2-.05,hg);}
    sph(.2,mh,0,.24,-.04,hg);sph(.13,mh,0,.42,-.08,hg);}
  else if(h.typ==='langt-flint'){box(.46,.46,.1,mh,0,-.14,-.22,hg);sph(.1,mh,-.25,-.04,-.08,hg);sph(.1,mh,.25,-.04,-.08,hg);box(.08,.36,.2,mh,-.26,-.18,-.1,hg);box(.08,.36,.2,mh,.26,-.18,-.1,hg);}
  else if(h.typ==='slick'){k=sph(.27,mh,0,.06,-.05,hg,12);k.scale.set(1,.8,1);sph(.1,mh,0,-.1,-.24,hg);}
  /* glasögon */
  if(u.glas){var tub={tjocka:.026,tunna:.008,runda:.013,stora:.01}[u.glas]||.01, rad={tjocka:.09,tunna:.085,runda:.1,stora:.115}[u.glas]||.09, gm=M(u.glasfarg||'#222222');
    [-1,1].forEach(function(sd){var t=new T.Mesh(new T.TorusGeometry(rad,tub,5,u.glas==='stora'?6:14),gm);t.position.set(sd*(rad+.012),.06,.245);hg.add(t);
      box(.02,.02,.24,gm,sd*(rad*2+.01),.07,.13,hg);});box(.05,tub*1.6,.015,gm,0,.07,.25,hg);
    if(har('glasogonkedja')){[-1,1].forEach(function(sd){var kd=box(.012,.34,.012,M(0xc9a03a),sd*.25,-.13,.02,hg);kd.rotation.z=sd*.12;});}}
  if(har('bula')){sph(.065,hud,.03,.21,.2,hg);}
  if(har('penna-i-haret')){var pn=cyl(.012,.012,.3,M(0xe2b13c),.14,.4,-.02,hg,6);pn.rotation.z=-1.1;}
  if(har('penna-bakom-orat')){var pb2=cyl(.012,.012,.22,M(0xe8621c),-.275,.07,.02,hg,6);pb2.rotation.x=1.35;}
  var ht=hatt(hg);ht.position.y=(h.typ==='lockig-uppsatt')?.44:.2;
  var hang=new T.Group();hang.visible=false;bal.add(hang);var mgz=har('mage')?.26:0;
  box(.055,.66,.02,M(0x2f5d2c),-.17,.42,fz+.03+mgz,hang);box(.055,.66,.02,M(0x2f5d2c),.17,.42,fz+.03+mgz,hang);box(.4,.07,.02,M(0xc0261b),0,.56,fz+.034+mgz,hang);
  return {g:g,hips:hips,bal:bal,aL:aL,aR:aR,bL:bL,bR:bR,hals:hals,mun:mun,tunga:tunga,hatt:ht,hang:hang,d:d,fas:nr*.5,y0:d.pa_bordet?1.02:0,snurr:0,hopp:0};
}
var folk=V.personal.map(gubbe);
folk.forEach(function(p){if(p.d.dans==='flipp'){p.tunga.visible=true;}});

/* ---------- dansstegen ----------  egna steg läggs till här: DANS.namn=function(p,k){...} */
var DANS={
  floss:function(p,k){var m=k.intro?.03:(k.matt===undefined?1:k.matt), mal=k.intro?Math.atan2(-p.g.position.x,-p.g.position.z):0, ps=Math.tanh(Math.sin((k.db+p.fas)*Math.PI)*2.6)/.989, up=ps>0;
    /* höften åt ena hållet, raka armar åt andra: armen på den sidan går bakom kroppen, den andra korsar framför */
    p.hips.position.x=ps*.2*m;p.hips.rotation.z=-ps*.17*m;p.hips.position.y=.95-(1-Math.abs(ps))*.07*m;
    p.bal.rotation.z=ps*.1*m;p.bal.rotation.y=-ps*.14*m;p.bal.rotation.x=.05*m;
    p.aL.rotation.z=-ps*(up?.42:.86)*m;p.aL.rotation.x=ps*(up?.62:.52)*m;
    p.aR.rotation.z=-ps*(up?.86:.42)*m;p.aR.rotation.x=-ps*(up?.52:.62)*m;
    p.bL.rotation.z=ps*.13*m;p.bR.rotation.z=ps*.13*m;p.hals.rotation.z=ps*.16*m;p.hals.rotation.x=m<.5?k.puls*.12:0;
    p.mun.scale.set(1,m<.5?.15:.3+k.puls*.5,.6);
    p.vrid=(p.vrid||0)+(mal-(p.vrid||0))*Math.min(1,k.dt*5);
    p.g.rotation.y=p.vrid+(k.G?Math.sin(k.b*Math.PI/2+p.fas*2)*.6:(k.tyrol?Math.sin(k.b*Math.PI/4+p.fas*2)*.3:0));
    p.g.position.y=p.y0+(k.G?Math.abs(Math.sin(k.db*Math.PI))*.35:0);},
  'stel-sen-floss':function(p,k){k.matt=(!k.G&&(k.hel%32)<8)?.04:1;DANS.floss(p,k);k.matt=undefined;},
  flipp:function(p,k){var sk=Math.sin(k.nu*31)*.06*(.4+k.puls), sv=Math.sin(k.db*Math.PI);
    p.aL.rotation.z=-2.6+sk+sv*.2;p.aR.rotation.z=2.6+sk-sv*.2;p.aL.rotation.x=p.aR.rotation.x=Math.sin(k.nu*23)*.15;
    var tryck=k.skrik>=0?k.skrik:k.puls;p.bal.rotation.x=-.28-tryck*.18;p.hals.rotation.x=-.45-tryck*.3;p.hals.rotation.z=Math.sin(k.nu*17)*.08;
    var gap=k.skrik>=0?.15+k.skrik*1.7:.7+k.puls*.9;p.mun.scale.set(1.3,gap,.8);p.tunga.visible=k.skrik<0||k.skrik>.35;p.tunga.rotation.y=Math.sin(k.nu*40)*.5;p.tunga.position.y=-.2-k.puls*.05;
    p.hips.position.y=.95+Math.abs(sv)*.08;p.bL.rotation.z=-.18;p.bR.rotation.z=.18;
    if(k.G){p.snurr+=k.dt*9;}else{p.snurr*=Math.pow(.02,k.dt);if(Math.abs(p.snurr)>6.283){p.snurr%=6.283;}}
    p.g.rotation.y=p.snurr+Math.sin(k.b*Math.PI/4)*.25;
    p.g.position.y=p.y0+(k.G?Math.abs(Math.sin(k.db*Math.PI))*.5:0);}
};

/* ---------- tvättbjörnar ---------- */
function bjorn(x,z,ry,off){var g=new T.Group();g.position.set(x,0,z);g.rotation.y=ry;rum.add(g);
  var k=box(1.1,.9,1.1,mKartong,0,.45,0,g);k.rotation.z=.06;k.scale.set(1,.9,1.06);
  var f1=box(1.1,.06,.55,mKartong,0,.86,-.72,g);f1.rotation.x=.9;var f2=box(.55,.06,1.1,mKartong,.74,.8,0,g);f2.rotation.z=.8;
  var hd=new T.Group();g.add(hd);var gr=M(0x8d8d8d), mk=M(0x26221f);
  sph(.3,gr,0,0,0,hd,10);sph(.1,gr,-.2,.26,0,hd);sph(.1,gr,.2,.26,0,hd);
  box(.52,.13,.1,mk,0,.05,.24,hd);sph(.05,vit,-.12,.05,.3,hd);sph(.05,vit,.12,.05,.3,hd);sph(.022,svart,-.12,.05,.345,hd);sph(.022,svart,.12,.05,.345,hd);
  var n=sph(.12,M(0xdddddd),0,-.09,.24,hd);n.scale.set(1,.7,1);sph(.04,svart,0,-.06,.36,hd);
  var h=hatt(hd);h.position.y=.24;h.scale.setScalar(.8);return {hd:hd,off:off,hatt:h};}
var bjornar=[bjorn(4.3,-3.4,-.3,2)];

/* ---------- kartongraketen ---------- */
var raket=new T.Group();raket.position.set(6.4,0,-2.2);rum.add(raket);
/* Kartongraketen Mk II: tre flyttkartonger på varandra, en lånad trafikkon som nos och en hink som motor */
var tStreck=tex(128,64,function(g,w,h){g.fillStyle='#f6ead2';g.fillRect(0,0,w,h);g.fillStyle='#16100c';
  for(var x=8;x<w-8;x+=2+((x*7)%5)){g.fillRect(x,6,(x%3)+1,38);}g.font='700 12px monospace';g.fillText('BZZ-0001-MÅN',10,58);});
/* kroppen: en hög kartong, pyramidnos, orange fenor. Tydlig siluett, lite tejp och detaljer */
var kropp=box(1.1,2.6,1.1,mKartong,0,1.72,0,raket);
box(1.13,.16,1.13,mTejp,0,.62,0,kropp).castShadow=false;box(1.13,.16,1.13,mTejp,0,-.62,0,kropp).castShadow=false;
box(.2,2.62,1.13,mTejp,0,0,0,kropp).castShadow=false;
var nos=new T.Mesh(new T.ConeGeometry(.8,1.2,4),mKartong);nos.position.y=3.62;nos.rotation.y=Math.PI/4;nos.castShadow=true;raket.add(nos);
var lampa2=sph(.08,M(0xff2a1a,{emissive:0xff2a1a,emissiveIntensity:.2}),0,4.24,0,raket);
skylt(V.skyltar.raket,.85,.42,0,-.15,.56,0,'#f6ead2','#3b2616',kropp);
var fs=new T.Mesh(new T.PlaneGeometry(.4,.2),new T.MeshLambertMaterial({map:tStreck}));fs.position.set(.56,-.75,.12);fs.rotation.y=Math.PI/2;kropp.add(fs);
var mGlas=M(0x9fd6e8,{emissive:0x3a7a92,emissiveIntensity:.5}), mRam=M(0x3b2616);
(function(){var g=new T.Group();g.position.set(0,.85,.56);kropp.add(g);
  var r=new T.Mesh(new T.CylinderGeometry(.22,.22,.04,16),mRam);r.rotation.x=Math.PI/2;g.add(r);
  var gl=new T.Mesh(new T.CylinderGeometry(.17,.17,.05,16),mGlas);gl.rotation.x=Math.PI/2;gl.position.z=.005;g.add(gl);
  box(.07,.05,.01,M(0xffffff),.05,.06,.035,g).castShadow=false;})();
[[.72,0,0],[-.72,0,0],[0,.72,1],[0,-.72,1]].forEach(function(f){box(f[2]?.08:.55,.95,f[2]?.55:.08,M(0xe8621c),f[0],.62,f[1],raket);});
/* munstycke */
var hink=new T.Mesh(new T.CylinderGeometry(.26,.38,.3,16,1,true),new T.MeshLambertMaterial({color:0x6b6f74,side:T.DoubleSide}));hink.position.y=.27;hink.castShadow=true;raket.add(hink);
/* lågan: inre och yttre kon */
var eld=new T.Group();eld.position.y=.12;eld.visible=false;raket.add(eld);
var eldUt=new T.Mesh(new T.ConeGeometry(.46,2.1,12),new T.MeshBasicMaterial({color:0xff7a1a,transparent:true,opacity:.85}));eldUt.rotation.x=Math.PI;eldUt.position.y=-1.05;eld.add(eldUt);
var eldIn=new T.Mesh(new T.ConeGeometry(.25,1.25,10),new T.MeshBasicMaterial({color:0xfff2b0}));eldIn.rotation.x=Math.PI;eldIn.position.y=-.62;eld.add(eldIn);
var eldljus=new T.PointLight(0xff8a2a,0,9);eldljus.position.set(6.4,.4,-2.2);rum.add(eldljus);
var rok=[];for(i=0;i<36;i++){var r=box(.42,.42,.42,M(0xf6ead2),0,-50,0,rum);r.castShadow=false;rok.push({m:r,t:9});}
var rk={laget:0,t:0,v:0,y:0,start:0,sist:-1}, ETT=new T.Vector3(1,1,1), UPP=new T.Vector3(0,1,0), RIKT=new T.Vector3(), KNUFF=new T.Vector3(), traff=0, manKam=0, manPaket=[];

/* ---------- rymden och alperna ---------- */
var sp=new Float32Array(900*3);for(i=0;i<900;i++){a=rnd(0,6.283);var e=rnd(-.4,1.3),R=rnd(90,140);
  sp[i*3]=Math.cos(a)*Math.cos(e)*R;sp[i*3+1]=Math.sin(e)*R;sp[i*3+2]=Math.sin(a)*Math.cos(e)*R;}
var sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(sp,3));
var stj=new T.Points(sg,new T.PointsMaterial({color:0xffe9c4,size:.7,transparent:true,fog:false}));scene.add(stj);
var mane=new T.Group();scene.add(mane);
sph(2.6,M(0xf0e2c0,{emissive:0x554a30,fog:false}),0,0,0,mane,14);
sph(.3,svart,-.8,.5,2.35,mane);sph(.3,svart,.8,.5,2.35,mane);var mm=sph(.5,M(0x4a1010),0,-.7,2.3,mane);mm.scale.set(1.4,.5,.5);
var mh2=hatt(mane);mh2.visible=true;mh2.scale.setScalar(6.5);mh2.position.y=2.2;
var flyt=[];for(i=0;i<34;i++){s=rnd(.5,1.8);var fbx=box(s,s*rnd(.6,1),s*rnd(.7,1.2),mKartong,0,0,0,scene);fbx.castShadow=false;
  flyt.push({m:fbx,r:rnd(17,40),a:rnd(0,6.283),y:rnd(-9,16),sp:rnd(.02,.08)*(Math.random()<.5?-1:1),rx:rnd(-.5,.5),ry:rnd(-.5,.5)});}
var regn=[];for(i=0;i<46;i++){s=rnd(.3,.7);var rb=box(s,s,s,mKartong,rnd(-7,7),-60,rnd(-4,4.5),scene);rb.castShadow=false;
  regn.push({m:rb,y:rnd(6,26),v:rnd(7,13),rx:rnd(-4,4),rz:rnd(-4,4)});}
var berg=new T.Group();scene.add(berg);berg.visible=false;var toppar=[];
for(i=0;i<11;i++){a=i/11*6.283+rnd(-.1,.1);var rr=rnd(34,48),hh=rnd(16,30),ra=rnd(10,15);
  var bg=new T.Group();bg.position.set(Math.cos(a)*rr,-10,Math.sin(a)*rr);bg.scale.y=.001;berg.add(bg);toppar.push(bg);
  var b=new T.Mesh(new T.ConeGeometry(ra,hh,6),M(0x5f8f4a,{fog:false}));b.position.y=hh/2;bg.add(b);
  var sn=new T.Mesh(new T.ConeGeometry(ra*.36,hh*.36,6),M(0xffffff,{fog:false}));sn.position.y=hh-hh*.18+.05;bg.add(sn);}
var ang=new T.Mesh(new T.CylinderGeometry(60,60,.5,24),M(0x7fb24f,{fog:false}));ang.position.y=-10.3;berg.add(ang);
function ko(v){var g=new T.Group();berg.add(g);var kv=M(0xf4f0e6,{fog:false}), ks=M(0x2a2420,{fog:false});
  box(2.6,1.4,1.2,kv,0,1.7,0,g);box(.9,.8,1.22,ks,-.5,1.9,0,g);box(.7,.6,1.22,ks,.8,1.5,0,g);
  var hd=new T.Group();hd.position.set(1.6,2.2,0);g.add(hd);box(.9,.8,.8,kv,0,0,0,hd);box(.5,.4,.82,M(0xe9a9a0,{fog:false}),.3,-.2,0,hd);
  box(.1,.3,.1,ks,-.1,.5,.3,hd);box(.1,.3,.1,ks,-.1,.5,-.3,hd);var kl=box(.3,.36,.3,M(0xe2b13c,{fog:false}),-.2,-.7,0,hd);
  [[-1,.4],[-1,-.4],[1,.4],[1,-.4]].forEach(function(q){box(.3,1,.3,kv,q[0],.5,q[1],g);});
  g.scale.setScalar(1.7);return {g:g,hd:hd,kl:kl,v:v};}
var kor=[ko(0),ko(2.2),ko(4.3)];
var sejdlar=[];[-2.3,-.9,1.1,2.6].forEach(function(x,n){var g=new T.Group();g.position.set(x,1.03,n%2?.45:-.45);g.scale.setScalar(.001);rum.add(g);
  cyl(.11,.1,.3,M(0xd9c9a0),0,.15,0,g,10);cyl(.115,.115,.07,vit,0,.33,0,g,10);box(.04,.16,.04,M(0xd9c9a0),.15,.15,0,g);sejdlar.push(g);});

/* ---------- kameror ---------- */
var skott=V.kameror.map(function(k){return {n:k.namn,p:k.p,l:k.l,vid:k.vid,upp:k.upp,auto:k.auto!==false};}), persKam=[];
var RUNDA=[];skott.forEach(function(k,n){if(k.auto){RUNDA.push(n);}});var NK=RUNDA.length;
function kamNr(namn,reserv){for(var n=0;n<skott.length;n++){if(skott[n].n===namn){return n;}}return Math.min(reserv||0,skott.length-1);}
var K_PROF=kamNr('PROFESSORN',1), K_OVAN=kamNr('OVANIFRÅN',0), K_RAKET=kamNr('RAKETEN',skott.length-1);
folk.forEach(function(f){var x=f.d.plats[0],z=f.d.plats[1];
  if(f.d.pa_bordet){persKam.push(K_PROF);}
  else{skott.push({n:f.d.namn.toUpperCase(),p:[x*1.05+.6,1.9,z+3.4],l:[x,1.45,z],dold:true,upp:.8});persKam.push(skott.length-1);}});
var sk=0, last=0, cp=new T.Vector3(0,9,22), cl=new T.Vector3(0,2,0), tp=new T.Vector3(), tl=new T.Vector3(), kamtxt=$('kamtxt');
function valj(n,hall){sk=n;last=hall||0;var S=skott[n], pl=RUNDA.indexOf(n);kamtxt.textContent=(pl<0?'KAM ★':'KAM '+(pl+1)+'/'+NK)+' · '+S.n;}
function nastaKam(){var pl=RUNDA.indexOf(sk);return RUNDA[(pl+1)%NK];}
$('kam').onclick=function(){valj(nastaKam(),16);markera(-1);};

/* ---------- personalkort ---------- */
var kortEl=$('kort'), kortKn=[], kortY=null, utanBild=[];
V.personal.forEach(function(d,n){var k=document.createElement('button');k.className='k';
  k.innerHTML='<img alt=""><small></small><strong></strong><p></p><em></em>';
  if(d.bild){k.children[0].src=d.bild;}else{utanBild.push([k.children[0],n]);}
  k.children[1].textContent=d.befattning;k.children[2].textContent=d.namn;k.children[3].textContent=d.bio;k.children[4].textContent=d.stampel;
  k.onclick=function(){valj(persKam[n],32);markera(n);kortY=scrollY;};kortEl.appendChild(k);kortKn.push(k);});
function markera(n){kortKn.forEach(function(k,j){k.classList.toggle('vald',n===j);});}

/* ---------- låten och klockan ---------- */
var ljud=new Audio(), spelar=false, vill=false, klock0=performance.now()/1000, bLjud=$('ljud');
ljud.preload='none';ljud.src=V.lat.fil;
var BORJA=V.lat.borja_vid||0, hoppat=false;
function hoppaFram(){if(hoppat||!BORJA){return;}try{if(ljud.readyState>=1){ljud.currentTime=BORJA;hoppat=true;}}catch(e){}}
ljud.addEventListener('loadedmetadata',hoppaFram);
function slagVid(t){
  if(!SLAG||SLAG.length<2){return Math.max(0,(t-(V.lat.start||0))/SPB);}
  var n=SLAG.length;if(t<=SLAG[0]){return 0;}
  if(t>=SLAG[n-1]){return n-1+(t-SLAG[n-1])/SPB;}
  var lo=0,hi=n-1;while(hi-lo>1){var m=(lo+hi)>>1;if(SLAG[m]<=t){lo=m;}else{hi=m;}}
  return lo+(t-SLAG[lo])/(SLAG[hi]-SLAG[lo]);}
function slagNu(){return spelar?Math.max(0,slagVid(ljud.currentTime)):(performance.now()/1000-klock0)/SPB;}
function stopp(){if(spelar){klock0=performance.now()/1000-slagNu()*SPB;}spelar=false;bLjud.classList.remove('pa');bLjud.textContent='♪ MUSIK';}
bLjud.onclick=function(){
  if(!vill){var p;try{p=ljud.play();}catch(e){return;}
    hoppaFram();vill=true;bLjud.classList.add('pa');bLjud.textContent='♪ PAUS';
    if(p&&p.catch){p.catch(function(){vill=false;stopp();});}}
  else{vill=false;ljud.pause();stopp();}};
ljud.addEventListener('playing',function(){if(vill){spelar=true;senSlag=-1;}});
ljud.addEventListener('ended',function(){vill=false;stopp();try{ljud.currentTime=BORJA;}catch(e){}});
/* gabbersparkar ovanpå, när man flippar */
var AC=window.AudioContext||window.webkitAudioContext, ac=null, dist=null;
function ljudmotor(){try{if(!ac&&AC){ac=new AC();dist=ac.createWaveShaper();var c=new Float32Array(256);for(var n=0;n<256;n++){c[n]=Math.tanh((n/128-1)*6);}dist.curve=c;
  var dg=ac.createGain();dg.gain.value=.3;dist.connect(dg);dg.connect(ac.destination);}if(ac){ac.resume();}}catch(e){}return ac;}
function pip(fr,t,dur,vol,typ){if(!ac){return;}try{var o=ac.createOscillator(),g=ac.createGain();o.type=typ||'triangle';o.frequency.setValueAtTime(fr,t);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+dur+.05);}catch(e){}}
function duns(){if(!ac){return;}try{var t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(36,t+.25);
  g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.5);}catch(e){}}
function muller(dur){if(!ac){return;}try{var n=ac.sampleRate*dur|0,bf=ac.createBuffer(1,n,ac.sampleRate),d=bf.getChannelData(0);for(var q=0;q<n;q++){d[q]=Math.random()*2-1;}
  var src=ac.createBufferSource();src.buffer=bf;var f=ac.createBiquadFilter();f.type='lowpass';var t=ac.currentTime;f.frequency.setValueAtTime(120,t);f.frequency.exponentialRampToValueAtTime(1800,t+dur);
  var g=ac.createGain();g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.5,t+dur*.35);g.gain.exponentialRampToValueAtTime(.001,t+dur);src.connect(f);f.connect(g);g.connect(ac.destination);src.start(t);}catch(e){}}
function gas(st){if(!ac){return;}try{var dur=.45+st*.08,n=ac.sampleRate*dur|0,bf=ac.createBuffer(1,n,ac.sampleRate),d=bf.getChannelData(0);for(var q=0;q<n;q++){d[q]=Math.random()*2-1;}
  var src=ac.createBufferSource();src.buffer=bf;var f=ac.createBiquadFilter();f.type='lowpass';var t=ac.currentTime;f.frequency.setValueAtTime(300+st*150,t);f.frequency.exponentialRampToValueAtTime(2200+st*500,t+.08);f.frequency.exponentialRampToValueAtTime(160,t+dur);
  var g=ac.createGain();g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.18+st*.05,t+.05);g.gain.exponentialRampToValueAtTime(.001,t+dur);src.connect(f);f.connect(g);g.connect(ac.destination);src.start(t);
  var o=ac.createOscillator(),og=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(48+st*6,t);o.frequency.exponentialRampToValueAtTime(34,t+dur);og.gain.setValueAtTime(.001,t);og.gain.exponentialRampToValueAtTime(.12+st*.03,t+.04);og.gain.exponentialRampToValueAtTime(.001,t+dur);
  var of=ac.createBiquadFilter();of.type='lowpass';of.frequency.value=220;o.connect(of);of.connect(og);og.connect(ac.destination);o.start(t);o.stop(t+dur+.05);}catch(e){}}
function kartongljud(){if(!ac){return;}try{var t=ac.currentTime,dur=.22,n=ac.sampleRate*dur|0,bf=ac.createBuffer(1,n,ac.sampleRate),d=bf.getChannelData(0);for(var q=0;q<n;q++){d[q]=(Math.random()*2-1)*Math.pow(1-q/n,2);}
  var src=ac.createBufferSource();src.buffer=bf;var f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(1800,t);f.frequency.exponentialRampToValueAtTime(500,t+dur);
  var g=ac.createGain();g.gain.value=.28;src.connect(f);f.connect(g);g.connect(ac.destination);src.start(t);
  var o=ac.createOscillator(),og=ac.createGain();o.frequency.setValueAtTime(190,t+.04);o.frequency.exponentialRampToValueAtTime(70,t+.16);og.gain.setValueAtTime(.001,t+.04);og.gain.exponentialRampToValueAtTime(.35,t+.06);og.gain.exponentialRampToValueAtTime(.001,t+.2);
  o.connect(og);og.connect(ac.destination);o.start(t+.04);o.stop(t+.25);}catch(e){}}
function joddel(upp){if(!ljudmotor()){return;}var t=ac.currentTime+.02,n=upp?[523,784,659,1047,784,1047,1319]:[1047,784,523];
  n.forEach(function(fr,q){pip(fr,t+q*.11,q===n.length-1?.5:.13,.16);});}
var storEl=$('stor');function stor(txt){if(!storEl){return;}storEl.textContent=txt;storEl.classList.remove('pang');void storEl.offsetWidth;storEl.classList.add('pang');}
function spark(t){if(!ac){return;}var o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(230,t);o.frequency.exponentialRampToValueAtTime(42,t+.11);
  g.gain.setValueAtTime(1,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(dist);o.start(t);o.stop(t+.3);}
var FL=(V.flippar||[]).map(function(f){var a=new Audio();a.preload='auto';a.src=f.fil;return {a:a,f:f};}), flNr=0, flNu=null, MUV=V.musik_under_flipp===undefined?.3:V.musik_under_flipp;
var musikNiva=1, MUSIK_NED=V.musik_vid_nedrakning===undefined?.65:V.musik_vid_nedrakning;
function volym(){try{ljud.volume=Math.max(0,Math.min(1,(flNu?MUV:1)*musikNiva));}catch(e){}}
function flippSlut(){flNu=null;volym();}
var gabber=0, tyrol=false, tyrolK=0, tyrolT=0, bTy=$('tyrol');
bTy.onclick=function(){rensaLador();tyrol=!tyrol;tyrolT=0;bTy.classList.toggle('pa',tyrol);folk.forEach(function(p){p.hatt.visible=tyrol;p.hang.visible=tyrol;});bjornar.forEach(function(b){b.hatt.visible=tyrol;});
  joddel(tyrol);if(tyrol){stor('HOLLADRIO');valj(0,12);markera(-1);}};
$('flippa').onclick=function(){
  ljudmotor();rensaLador();
  gabber=V.flipp_takter||16;
  if(FL.length){if(flNu){try{flNu.a.pause();}catch(e){}}
    flNu=FL[flNr%FL.length];flNr++;
    try{flNu.a.currentTime=0;}catch(e){}
    try{var fp=flNu.a.play();if(fp&&fp.catch){fp.catch(function(){});}}catch(e){}volym();
    flNu.a.onended=flippSlut;gabber=Math.max(4,Math.ceil((flNu.f.langd||6)/SPB));}
  document.body.classList.add('gabber');valj(K_PROF,16);markera(-1);};
$('raket').onclick=function(){if(rk.laget===0){ljudmotor();rensaLador();rk.laget=1;rk.start=Math.floor(slagNu())+1;rk.sist=-1;volym();valj(K_RAKET,34);markera(-1);}};
/* kartongregn: varje tryck släpper ner fler kartonger som studsar runt i takt. Nollställs när man byter läge */
var linje=folk.filter(function(p){return p.d.dans!=='flipp';}).sort(function(a,b){return a.d.plats[0]-b.d.plats[0];}), lador=[], tryck=0, senTryck=0;
/* alla kartonger ritas som två instanser (kartong + tejp): ett tryck skapar inget nytt, så man kan peppra på */
var LMAX=V.max_kartonger||220, ladGeo=new T.BoxGeometry(1,1,1);
var ladIM=new T.InstancedMesh(ladGeo,mKartong,LMAX), tejpIM=new T.InstancedMesh(ladGeo,mTejp,LMAX);
[ladIM,tejpIM].forEach(function(im){im.count=0;im.frustumCulled=false;im.receiveShadow=true;im.castShadow=false;im.instanceMatrix.setUsage(T.DynamicDrawUsage);rum.add(im);});
var LD=new T.Object3D(), LM=new T.Matrix4(), TEJP=new T.Matrix4().compose(new T.Vector3(0,.46,0),new T.Quaternion(),new T.Vector3(1.03,.1,.32));
function slappLada(){if(lador.length>=LMAX){lador.shift();}var st=rnd(.34,.78);
  lador.push({p:new T.Vector3(rnd(-6.6,6.6),rnd(9,15),rnd(-3.8,4.3)),r:new T.Euler(rnd(0,3),rnd(0,3),rnd(0,3)),s:st,h:st*rnd(.7,1),vx:rnd(-2,2),vy:rnd(-3,0),vz:rnd(-2,2),wx:rnd(-5,5),wz:rnd(-5,5),bort:0});}
function rensaLador(){lador.forEach(function(l){l.bort=1;l.vy=rnd(9,16);});tryck=0;}
$('kartong').onclick=function(){ljudmotor();var nuT=performance.now()/1000;
  /* en ny serie börjar efter en paus eller ett lägesbyte: då blir det ett stort drop med LEVERANS */
  if(nuT-senTryck>(V.serie_paus||5)){tryck=0;}senTryck=nuT;tryck++;
  var forst=tryck===1, stort=forst||(tryck>3&&Math.random()<(V.chans_stort_drop||.15)), antal=stort?5+Math.floor(Math.random()*6):(V.kartonger_per_tryck||2);
  kartongljud();if(stort){setTimeout(kartongljud,90);setTimeout(kartongljud,200);duns();}if(forst){stor('LEVERANS');}
  for(var q=0;q<antal;q++){slappLada();}
  if(tryck===1){valj(0,16);markera(-1);}};
/* stolbaletten */
var balett=false, balK=0, bBa=$('balett'), hemStol=stolar.map(function(st){return [st.position.x,st.position.z,st.rotation.y];});
bBa.onclick=function(){rensaLador();balett=!balett;bBa.classList.toggle('pa',balett);if(balett){ljudmotor();stor('BALETT');valj(K_OVAN,16);markera(-1);}};

/* ---------- scroll: lugn helbild medan man läser, sedan börjar kamerorna växla igen ---------- */
var merEl=$('mer');
/* bara när man börjar scrolla efter en stund stilla, och bara en gång per scrollning: små ryck (adressfältet i mobilen) räknas inte */
var scrollStart=scrollY, scrollSen=0;
addEventListener('scroll',function(){if(merEl){merEl.classList.toggle('borta',scrollY>50);}
  var nuS=performance.now()/1000, ny=nuS-scrollSen>2.5;scrollSen=nuS;if(ny){scrollStart=scrollY;}
  if(kortY!==null){if(Math.abs(scrollY-kortY)<240){return;}kortY=null;markera(-1);}
  if(rk.laget!==0||gabber>0||varIntro){return;}
  if(Math.abs(scrollY-scrollStart)<120){return;}scrollStart=-1e9;
  if(sk!==0){valj(0,V.takter_helbild_vid_scroll||16);}},{passive:true});

/* ---------- storlek ---------- */
var avst=1,avstV=1,sta=0;
function storlek(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<h?62:48;
  sta=w<h?1:0;avst=w<h?1+(1-w/h)*(V.mobil_avstand===undefined?.6:V.mobil_avstand):1;avstV=w<h?1+(1-w/h)*1.25:1;
  if(w<h){cam.setViewOffset(w,h,0,h*(V.mobil_hojning||.07),w,h);}else if(w/h>1.25){cam.setViewOffset(w,h,-w*.17,0,w,h);}else{cam.clearViewOffset();}cam.updateProjectionMatrix();}
addEventListener('resize',storlek);storlek();

/* ---------- bildrutan ---------- */
var fpsSum=0, fpsN=0, varIntro=false, blixt=$('blixt'), takt=$('takt'), forra=performance.now()/1000, senSlag=-1, puls=0, TPK=V.takter_per_kamera||8;
function bild(){
  requestAnimationFrame(bild);
  var nu=performance.now()/1000, rdt=nu-forra, dt=Math.min(.05,rdt);forra=nu;
  if(!document.hidden&&rdt<.5){fpsSum+=rdt;fpsN++;if(fpsN>=90){var snitt=fpsSum/fpsN;fpsSum=fpsN=0;
    if(snitt>.045&&DPR>1){DPR=Math.max(1,DPR-.25);renderer.setPixelRatio(DPR);storlek();}}}
  var b=slagNu(), hel=Math.floor(b), nytt=false, IN=V.intro||{}, intro=spelar&&ljud.currentTime<(IN.till||0)&&rk.laget===0&&gabber<=0;
  if(intro!==varIntro){varIntro=intro;if(intro){kamtxt.textContent='KAM ★ · FLIPPEN';markera(-1);}else if(spelar&&rk.laget===0&&gabber<=0){valj(0,TPK);}else{valj(sk,last);}}
  if(hel!==senSlag){senSlag=hel;puls=1;nytt=true;
    if(gabber>0){gabber--;if(ac){try{spark(ac.currentTime+.01);spark(ac.currentTime+.01+SPB/2);}catch(e){}}
      if(gabber===0){document.body.classList.remove('gabber');if(flNu){try{flNu.a.pause();}catch(e){}flippSlut();}}}
    if(intro){}else if(last>0){last--;}else if(hel%TPK===0){valj(nastaKam(),0);markera(-1);}
    takt.textContent=(gabber>0?'GABBER · ':tyrol?'TYROLEN · ':'')+'TAKT '+(Math.floor(hel/4)%99+1)+'.'+(hel%4+1);}
  puls*=Math.pow(.004,dt);
  var G=gabber>0, db=G?b*2:b, k={b:b,db:db,hel:hel,puls:puls,nu:nu,dt:dt,G:G,tyrol:tyrol,skrik:-1,intro:intro};
  if(flNu&&flNu.f.mun&&!flNu.a.paused){var mi=flNu.a.currentTime*20, m0=flNu.f.mun[Math.floor(mi)]||0, m1=flNu.f.mun[Math.floor(mi)+1];k.skrik=m0+((m1===undefined?m0:m1)-m0)*(mi%1);}
  folk.forEach(function(p){(DANS[p.d.dans]||DANS.floss)(p,k);p.hopp*=Math.pow(.002,dt);p.g.position.y+=p.hopp*.3;
    if(rk.laget>=2){p.hals.rotation.x=-.85;p.hals.rotation.z*=.3;}});
  /* stolbalett */
  balK+=((balett?1:0)-balK)*Math.min(1,dt*3);
  linje.forEach(function(p,n){var st=stolar[n];if(!st){return;}
    var va=n*6.283/Math.min(linje.length,stolar.length)+db*Math.PI/8, ex=Math.cos(va)*4.9, ez=Math.sin(va)*3.3+.2, px=p.d.plats[0], pz=p.d.plats[1];
    p.g.position.x=px+(ex-px)*balK;p.g.position.z=pz+(ez-pz)*balK;
    if(balK>.5){var sn2=db*Math.PI/2+n;p.g.rotation.y=sn2;p.g.position.y=G?Math.abs(Math.sin(db*Math.PI))*.2:0;
      p.hips.position.set(0,.72,0);p.hips.rotation.z=0;p.bal.rotation.set(-.12,0,Math.sin(db*Math.PI+n)*.12);
      p.bL.rotation.x=-1.45+Math.sin(db*Math.PI)*.3;p.bR.rotation.x=-1.45-Math.sin(db*Math.PI)*.3;p.bL.rotation.z=p.bR.rotation.z=0;
      p.aL.rotation.set(0,0,-2.3+Math.sin(db*Math.PI)*.4);p.aR.rotation.set(0,0,2.3+Math.sin(db*Math.PI)*.4);p.hals.rotation.z=Math.sin(db*Math.PI)*.2;
      st.position.x=p.g.position.x;st.position.z=p.g.position.z;st.rotation.y=sn2;st.position.y=p.g.position.y;}
    else{p.bL.rotation.x=p.bR.rotation.x=0;var hm=hemStol[n];st.position.x+=(hm[0]-st.position.x)*Math.min(1,dt*4);st.position.z+=(hm[1]-st.position.z)*Math.min(1,dt*4);st.position.y=0;}});
  /* kartongregn */
  for(var li=lador.length-1;li>=0;li--){var L=lador[li], lp=L.p, h2=L.h/2;
    if(L.bort){L.vy+=dt*30;lp.y+=L.vy*dt;L.r.x+=dt*9;L.r.z+=dt*7;if(lp.y>45){lador.splice(li,1);}continue;}
    L.vy-=24*dt;lp.x+=L.vx*dt;lp.y+=L.vy*dt;lp.z+=L.vz*dt;L.r.x+=L.wx*dt;L.r.z+=L.wz*dt;
    var inne=Math.abs(lp.x)<8.1&&lp.z>-5.1&&lp.z<5.15, golvY=h2, pa=false;
    if(inne&&Math.abs(lp.x)<3.25&&Math.abs(lp.z)<.9&&lp.y>.7){golvY=1.03+h2;}
    if(inne&&lp.y<golvY&&L.vy<0){lp.y=golvY;L.vy=-L.vy*.5;L.vx*=.8;L.vz*=.8;L.wx*=.6;L.wz*=.6;if(L.vy<1.2){L.vy=0;}}
    pa=inne&&lp.y<golvY+.08;
    if(pa&&nytt){L.vy=rnd(3.2,6.8)*(G?1.5:1);L.vx+=rnd(-1.6,1.6);L.vz+=rnd(-1.6,1.3);L.wx=rnd(-7,7);L.wz=rnd(-7,7);}
    if(lp.z<5.1){if(lp.x<-7.75+h2){lp.x=-7.75+h2;L.vx=Math.abs(L.vx)*.6;}if(lp.x>7.75-h2){lp.x=7.75-h2;L.vx=-Math.abs(L.vx)*.6;}}
    if(lp.z<-4.7+h2){lp.z=-4.7+h2;L.vz=Math.abs(L.vz)*.6;}
    for(var fi=0;fi<folk.length;fi++){var fp=folk[fi].g.position, dx=lp.x-fp.x, dz=lp.z-fp.z, dd=dx*dx+dz*dz;
      if(dd<.36&&lp.y>fp.y&&lp.y<fp.y+2.25){var dl2=Math.sqrt(dd)||.01;L.vx+=dx/dl2*3.5;L.vz+=dz/dl2*3.5;if(L.vy<2.5){L.vy=rnd(2.5,4.5);}folk[fi].hopp=Math.max(folk[fi].hopp,.8);}}
    if(lp.y<-45){lador.splice(li,1);}}
  for(var lj=0;lj<lador.length;lj++){var L2=lador[lj];LD.position.copy(L2.p);LD.rotation.copy(L2.r);LD.scale.set(L2.s,L2.h,L2.s);LD.updateMatrix();
    ladIM.setMatrixAt(lj,LD.matrix);LM.multiplyMatrices(LD.matrix,TEJP);tejpIM.setMatrixAt(lj,LM);}
  ladIM.count=tejpIM.count=lador.length;if(lador.length){ladIM.instanceMatrix.needsUpdate=true;tejpIM.instanceMatrix.needsUpdate=true;}
  stolar.forEach(function(st,n){if(balK>.5&&n<linje.length){return;}st.rotation.y+=dt*(G?8:(n%2?.5:-.5))*(tyrol||G?1:.25);});
  bjornar.forEach(function(bj){var u=Math.max(0,Math.sin(db*Math.PI/2+bj.off*1.6));bj.hd.position.y=.55+u*.75;bj.hd.rotation.z=Math.sin(db*Math.PI+bj.off)*.3;bj.hd.rotation.y=Math.sin(nu+bj.off)*.5;});
  staty.scale.setScalar(1+puls*(G?.08:.02));staty.rotation.y=.45+(G?Math.sin(nu*30)*.06:0);
  lampG.rotation.z=Math.sin(b*Math.PI/2)*(G?.5:.12);lampa.intensity=1+puls*.9;
  /* raket: nedräkning på takten, iväg, träff i månen, retur */
  if(rk.laget===1){var nr=hel-rk.start, steg=Math.floor(nr/2), NED=V.nedrakning||5;raket.position.x=6.4+Math.sin(nu*60)*(.015+Math.max(0,steg)*.022);
    if(nr>=0&&steg!==rk.sist){rk.sist=steg;
      if(steg<NED){stor(String(NED-steg));if(ac){pip(steg===NED-1?660:440,ac.currentTime+.01,.16,.22,'square');}gas(steg);rk.gas=1;eld.visible=true;}
      else{stor('IVÄG');rk.laget=2;rk.v=4;volym();muller(2.6);if(ac){pip(880,ac.currentTime+.01,.5,.2,'square');}folk.forEach(function(p){p.hopp=1.2;});}}
    rk.gas=(rk.gas||0)*Math.pow(.05,dt);eld.scale.y=.2+Math.random()*.2+Math.max(0,steg)*.12+rk.gas*(.9+steg*.15);}
  else if(rk.laget===2){rk.v+=dt*30;rk.y+=rk.v*dt;eld.scale.y=1.2+Math.random();raket.rotation.y+=dt*4;
    if(rk.y>75){rk.laget=3;rk.t=0;rk.slog=false;manKam=3.1;raket.rotation.set(0,0,0);
      /* anflygning: snett nerifrån sett från kameran, så banan syns tvärs över bilden */
      var cx=mane.position.x*.45, cz=mane.position.z*.45, dx0=mane.position.x-cx, dz0=mane.position.z-cz, dn=Math.sqrt(dx0*dx0+dz0*dz0)||1;
      rk.o=new T.Vector3(-dz0/dn*-11,-9,dx0/dn*-11);rk.rv=new T.Vector3();}}
  else if(rk.laget===3){rk.t+=dt;var AN=1.15;
    if(rk.t<AN){var e3=rk.t/AN;e3=e3*e3;raket.position.copy(mane.position).addScaledVector(rk.o,1-e3*.82);rk.y=raket.position.y;
      raket.quaternion.setFromUnitVectors(UPP,RIKT.copy(rk.o).multiplyScalar(-1).normalize());eld.visible=true;eld.scale.y=1.4+Math.random();}
    else if(!rk.slog){rk.slog=true;traff=1;duns();eld.visible=false;if(!lugn){blixt.style.opacity=.5;}
      rk.rv.copy(rk.o).normalize().multiplyScalar(9);rk.rv.y+=6;rk.pp=raket.position.clone();
      if(manPaket.length<12){var va2=rnd(-1.1,1.1),vb=rnd(-.2,1.2),mp=box(.9,.8,.9,mKartong,Math.sin(va2)*Math.cos(vb)*2.6,Math.sin(vb)*2.6-.4,Math.cos(va2)*Math.cos(vb)*2.6,mane);mp.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));manPaket.push(mp);}
      rok.forEach(function(q){q.t=0;q.m.position.copy(rk.pp);q.vx=rnd(-7,7);q.vz=rnd(-7,7);q.vy=rnd(2,9);q.fri=true;});}
    else if(rk.t<3.1){rk.rv.y-=dt*16;rk.pp.addScaledVector(rk.rv,dt);raket.position.copy(rk.pp);rk.y=rk.pp.y;raket.rotation.x+=dt*7;raket.rotation.z+=dt*5;}
    else if(!rk.retur){rk.retur=true;raket.rotation.set(0,0,0);raket.position.set(6.4,62,-2.2);rk.y=62;stor('RETUR');}
    else{rk.y-=dt*38;raket.position.x=6.4;raket.position.z=-2.2;raket.rotation.z=Math.sin(nu*8)*.25;
      if(rk.y<=0){rk.y=0;rk.laget=0;rk.retur=false;raket.rotation.set(0,0,0);puls=1.6;raket.scale.set(1.3,.5,1.3);duns();folk.forEach(function(p){p.hopp=1.4;});}}}
  traff*=Math.pow(.08,dt);manKam=Math.max(0,manKam-dt);mm.scale.set(1.4-traff*.7,.5+traff*1.1,.5);
  if(rk.laget!==3||rk.retur){raket.position.y=rk.y;}raket.scale.lerp(ETT,.12);
  if(rk.laget===0){raket.rotation.z=Math.sin(b*Math.PI)*.07;raket.position.y=Math.abs(Math.sin(b*Math.PI))*.18;if(Math.abs(raket.scale.x-1)<.02){raket.scale.y=1+puls*.07;}}
  musikNiva+=((rk.laget===1?MUSIK_NED:1)-musikNiva)*Math.min(1,dt*(rk.laget===1?.45:.35));volym();
  /* låga och ljus */
  var nrA=rk.laget===1?Math.floor((hel-rk.start)/2):0, armMal=(rk.laget===0||(rk.laget===1&&nrA<(V.nedrakning||5)-2))?0:-1.7;
  var blink=(rk.laget===1&&Math.floor(nu*4)%2)?1.6:.2;lampa2.material.emissiveIntensity=blink;
  if(eld.visible){eldUt.scale.set(.85+Math.random()*.3,1,.85+Math.random()*.3);eldIn.scale.set(.8+Math.random()*.4,.8+Math.random()*.4,.8+Math.random()*.4);}
  eldljus.intensity=(eld.visible&&rk.y<8)?(1.6+Math.random()*1.4)*Math.max(0,1-rk.y/8):0;
  if(rk.laget===1||rk.laget===2){for(var n=0;n<3;n++){var q=rok[(Math.random()*rok.length)|0];if(q.t>1.2){q.t=0;q.fri=false;q.m.position.set(6.4+rnd(-.3,.3),rk.y+.2,-2.2+rnd(-.3,.3));q.vx=rnd(-3.5,3.5)*(rk.y<1?1.4:.6);q.vz=rnd(-3.5,3.5)*(rk.y<1?1.4:.6);}}}
  rok.forEach(function(q){if(q.t<1.5){q.t+=dt;q.m.position.x+=q.vx*dt;q.m.position.z+=q.vz*dt;if(q.fri){q.vy-=dt*9;q.m.position.y+=q.vy*dt;}else{q.m.position.y=Math.max(.2,q.m.position.y-dt*3);}
    q.m.scale.setScalar(Math.max(.01,1.4-q.t)*1.6);q.m.rotation.x+=dt*4;}else{q.m.position.y=-50;}});
  /* rymd / tyrol */
  tyrolK+=((tyrol?1:0)-tyrolK)*Math.min(1,dt*2.2);
  scene.background.copy(RYMD).lerp(ALP,tyrolK);scene.fog.color.copy(scene.background);
  tyrolT+=dt;stj.material.opacity=1-tyrolK;berg.visible=tyrolK>.01;hemi.intensity=.75+tyrolK*.35;
  toppar.forEach(function(bg,n){var x=tyrol?Math.min(1,Math.max(0,(tyrolT-n*.09)/.45)):tyrolK, c1=1.70158, c3=c1+1, o=tyrol?1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2):x;bg.scale.y=Math.max(.001,o*(1+puls*.03));});
  ang.scale.set(tyrolK,1,tyrolK);
  kor.forEach(function(kk2,n){var kv2=kk2.v+nu*.12*(n%2?1:-1), kr=22+n*4;kk2.g.position.set(Math.cos(kv2)*kr,-10+Math.abs(Math.sin(b*Math.PI+n))*1.2,Math.sin(kv2)*kr);
    kk2.g.rotation.y=-kv2+(n%2?-1.57:1.57)+1.57;kk2.g.scale.setScalar(1.7*tyrolK+.001);kk2.hd.rotation.z=Math.sin(b*Math.PI+n)*.25;kk2.kl.rotation.z=Math.sin(b*Math.PI*2)*.6;});
  sejdlar.forEach(function(sj,n){var x=tyrol?Math.min(1,Math.max(0,(tyrolT-.5-n*.12)/.3)):tyrolK;sj.scale.setScalar(Math.max(.001,x*(1+puls*.25)));sj.position.y=1.03+(G?Math.abs(Math.sin(db*Math.PI+n))*.6:0);});
  var ma=nu*.11;mane.position.set(Math.cos(ma)*30,13+Math.sin(ma*2)*2,Math.sin(ma)*30-6);if(rk.o&&traff>.02){mane.position.addScaledVector(KNUFF.copy(rk.o).normalize(),-traff*2.2);}mane.lookAt(0,3,0);mane.rotateZ(traff*.9);mane.scale.setScalar(1+puls*.06+traff*.35);
  flyt.forEach(function(o){o.a+=o.sp*dt;o.m.position.set(Math.cos(o.a)*o.r,o.y+Math.sin(nu*.4+o.r)*.8,Math.sin(o.a)*o.r);o.m.rotation.x+=o.rx*dt;o.m.rotation.y+=o.ry*dt;});
  regn.forEach(function(o){if(G){o.y-=o.v*dt;if(o.y<.3){o.y=rnd(12,24);o.m.position.x=rnd(-7.5,7.5);o.m.position.z=rnd(-4.5,6);}o.m.position.y=o.y;o.m.rotation.x+=o.rx*dt;o.m.rotation.z+=o.rz*dt;}else{o.m.position.y=-60;}});
  if(!(rk.laget===3&&rk.slog&&rk.t<1.32)){blixt.style.opacity=(G&&!lugn&&puls>.75)?.22:0;}
  /* kamera */
  var S=skott[sk];
  if(intro&&IN.kameror&&IN.kameror.length){var it=ljud.currentTime/(IN.till||15), ik=IN.kameror[Math.min(IN.kameror.length-1,Math.floor(it*IN.kameror.length))];S={p:ik.p,l:ik.l,upp:ik.upp};}
  tp.set(S.p[0],S.p[1],S.p[2]);tl.set(S.l[0],S.l[1],S.l[2]);
  if(sk===K_RAKET&&rk.laget===2){tl.y=Math.min(26,2.6+rk.y*.6);}
  tp.sub(tl).multiplyScalar(S.vid?avstV:avst).add(tl);if(sta&&S.upp){tl.y+=S.upp*(V.mobil_upp_faktor===undefined?.35:V.mobil_upp_faktor);}
  if(manKam>0){tl.copy(mane.position);if(sta){tl.y+=2.6;}tp.set(mane.position.x*.45,10,mane.position.z*.45);}
  var kk=1-Math.pow(manKam>0?.0005:.02,dt);cp.lerp(tp,kk);cl.lerp(tl,kk);var sv=lugn?0:1;
  cam.position.set(cp.x+Math.sin(nu*.5)*.35*sv+(G||rk.laget===2?rnd(-.12,.12):0),cp.y+Math.sin(nu*.37)*.2*sv+puls*.06*sv+(G?rnd(-.12,.12):0),cp.z);
  cam.lookAt(cl);renderer.render(scene,cam);
}
function portratt(){if(!utanBild.length){return;}var R=240, rt=new T.WebGLRenderTarget(R,R), pc=new T.PerspectiveCamera(30,1,.1,60), px=new Uint8Array(R*R*4);
  var cv=document.createElement('canvas');cv.width=cv.height=R;var g=cv.getContext('2d'), im=g.createImageData(R,R);
  utanBild.forEach(function(u){var f=folk[u[1]], hp=new T.Vector3();f.hals.getWorldPosition(hp);hp.y+=.2;
    pc.position.set(hp.x+.35,hp.y+.12,hp.z+2.1);pc.lookAt(hp.x,hp.y-.02,hp.z);
    try{renderer.setRenderTarget(rt);renderer.render(scene,pc);renderer.readRenderTargetPixels(rt,0,0,R,R,px);}catch(e){renderer.setRenderTarget(null);u[0].style.display='none';return;}
    renderer.setRenderTarget(null);
    for(var y=0;y<R;y++){im.data.set(px.subarray((R-1-y)*R*4,(R-y)*R*4),y*R*4);}g.putImageData(im,0,0);u[0].src=cv.toDataURL('image/jpeg',.85);});
  rt.dispose();}
scene.traverse(function(o){if(o.isMesh&&o.castShadow&&!o.isInstancedMesh){if(!o.geometry.boundingSphere){o.geometry.computeBoundingSphere();}
  var sk=new T.Vector3();o.getWorldScale(sk);if(o.geometry.boundingSphere.radius*Math.max(sk.x,sk.y,sk.z)<.16){o.castShadow=false;}}});
valj(0,8);
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){ritaTavla(tTavla.image.getContext('2d'),1024,400);tTavla.needsUpdate=true;});}
setTimeout(portratt,60);
setTimeout(function(){try{LD.position.set(0,-200,0);LD.scale.set(1,1,1);LD.rotation.set(0,0,0);LD.updateMatrix();ladIM.setMatrixAt(0,LD.matrix);tejpIM.setMatrixAt(0,LD.matrix);
  ladIM.count=tejpIM.count=1;ladIM.instanceMatrix.needsUpdate=tejpIM.instanceMatrix.needsUpdate=true;renderer.compile(scene,cam);}catch(e){}},120);
window.BEZOZ={valj:valj,DANS:DANS,folk:folk,slagNu:slagNu,tystna:function(){if(vill){vill=false;ljud.pause();stopp();}}};
bild();
})();
