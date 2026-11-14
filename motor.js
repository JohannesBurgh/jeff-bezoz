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
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
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
    sph(.1,hud,0,-.74,0,p);return p;}
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
  floss:function(p,k){var ps=Math.sin((k.db+p.fas)*Math.PI), pd=Math.floor(k.db+p.fas)%2?1:-1, m=k.matt===undefined?1:k.matt;
    p.hips.position.x=ps*.13*m;p.hips.rotation.z=-ps*.12*m;p.hips.position.y=.95-Math.abs(ps)*.05*m;
    p.bal.rotation.z=ps*.2*m;p.bal.rotation.y=ps*.15*m;p.bal.rotation.x=0;
    p.aL.rotation.z=-ps*.95*m;p.aR.rotation.z=-ps*.95*m;p.aL.rotation.x=.45*pd*m;p.aR.rotation.x=-.45*pd*m;
    p.bL.rotation.z=ps*.12*m;p.bR.rotation.z=ps*.12*m;p.hals.rotation.z=-ps*.25*m;p.hals.rotation.x=m<.5?k.puls*.12:0;
    p.mun.scale.set(1,m<.5?.15:.3+k.puls*.5,.6);
    p.g.rotation.y=k.G?Math.sin(k.b*Math.PI/2+p.fas*2)*.6:(k.tyrol?Math.sin(k.b*Math.PI/4+p.fas*2)*.3:0);
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
var bjornar=[bjorn(-6.6,-2.6,.5,0),bjorn(-6.9,3.6,1.2,1),bjorn(4.3,-3.4,-.3,2)];

/* ---------- kartongraketen ---------- */
var raket=new T.Group();raket.position.set(6.4,0,-2.2);rum.add(raket);
box(1.1,2.4,1.1,mKartong,0,1.6,0,raket);
var nos=new T.Mesh(new T.ConeGeometry(.8,1.1,4),mKartong);nos.position.y=3.35;nos.rotation.y=Math.PI/4;nos.castShadow=true;raket.add(nos);
box(1.12,.16,1.12,mTejp,0,2.3,0,raket);box(1.12,.16,1.12,mTejp,0,.9,0,raket);
[[.7,0,0],[-.7,0,0],[0,.7,1],[0,-.7,1]].forEach(function(f){box(f[2]?.08:.5,.8,f[2]?.5:.08,M(0xe8621c),f[0],.6,f[1],raket);});
skylt(V.skyltar.raket,1,.5,0,1.6,.56,0,'#f6ead2','#3b2616',raket);
var eld=new T.Mesh(new T.ConeGeometry(.45,1.6,7),new T.MeshBasicMaterial({color:0xffb020}));eld.rotation.x=Math.PI;eld.position.y=-.5;eld.visible=false;raket.add(eld);
var rok=[];for(i=0;i<18;i++){var r=box(.3,.3,.3,M(0xf6ead2),0,-50,0,rum);r.castShadow=false;rok.push({m:r,t:9});}
var rk={laget:0,t:0,v:0,y:0,start:0,sist:-1}, ETT=new T.Vector3(1,1,1), traff=0, manKam=0, manPaket=[];

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
var skott=V.kameror.map(function(k){return {n:k.namn,p:k.p,l:k.l,vid:k.vid,upp:k.upp};}), NK=skott.length, persKam=[];
folk.forEach(function(f){var x=f.d.plats[0],z=f.d.plats[1];
  if(f.d.pa_bordet){persKam.push(Math.min(1,NK-1));}
  else{skott.push({n:f.d.namn.toUpperCase(),p:[x*1.05+.6,1.9,z+3.4],l:[x,1.45,z],dold:true,upp:.8});persKam.push(skott.length-1);}});
var sk=0, last=0, cp=new T.Vector3(0,9,22), cl=new T.Vector3(0,2,0), tp=new T.Vector3(), tl=new T.Vector3(), kamtxt=$('kamtxt');
function valj(n,hall){sk=n;last=hall||0;var S=skott[n];kamtxt.textContent=(S.dold?'KAM ★':'KAM '+(n+1)+'/'+NK)+' · '+S.n;}
function nastaKam(){return sk>=NK-1?0:sk+1;}
$('kam').onclick=function(){valj(nastaKam(),16);markera(-1);};

/* ---------- personalkort ---------- */
var kortEl=$('kort'), kortKn=[];
V.personal.forEach(function(d,n){var k=document.createElement('button');k.className='k';
  k.innerHTML='<img alt=""><small></small><strong></strong><p></p><em></em>';
  if(d.bild){k.children[0].src=d.bild;}else{k.children[0].style.display='none';}
  k.children[1].textContent=d.befattning;k.children[2].textContent=d.namn;k.children[3].textContent=d.bio;k.children[4].textContent=d.stampel;
  k.onclick=function(){valj(persKam[n],32);markera(n);};kortEl.appendChild(k);kortKn.push(k);});
function markera(n){kortKn.forEach(function(k,j){k.classList.toggle('vald',n===j);});}

/* ---------- låten och klockan ---------- */
var ljud=new Audio(), spelar=false, vill=false, klock0=performance.now()/1000, bLjud=$('ljud');
ljud.preload='none';ljud.src=V.lat.fil;
function slagVid(t){
  if(!SLAG||SLAG.length<2){return Math.max(0,(t-(V.lat.start||0))/SPB);}
  var n=SLAG.length;if(t<=SLAG[0]){return 0;}
  if(t>=SLAG[n-1]){return n-1+(t-SLAG[n-1])/SPB;}
  var lo=0,hi=n-1;while(hi-lo>1){var m=(lo+hi)>>1;if(SLAG[m]<=t){lo=m;}else{hi=m;}}
  return lo+(t-SLAG[lo])/(SLAG[hi]-SLAG[lo]);}
function slagNu(){return spelar?Math.max(0,slagVid(ljud.currentTime)):(performance.now()/1000-klock0)/SPB;}
function stopp(){if(spelar){klock0=performance.now()/1000-slagNu()*SPB;}spelar=false;bLjud.classList.remove('pa');bLjud.textContent='♪ LJUD';}
bLjud.onclick=function(){
  if(!vill){var p;try{p=ljud.play();}catch(e){return;}
    vill=true;bLjud.classList.add('pa');bLjud.textContent='♪ PAUS';
    if(p&&p.catch){p.catch(function(){vill=false;stopp();});}}
  else{vill=false;ljud.pause();stopp();}};
ljud.addEventListener('playing',function(){if(vill){spelar=true;senSlag=-1;}});
ljud.addEventListener('ended',function(){vill=false;stopp();ljud.currentTime=0;});
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
function joddel(upp){if(!ljudmotor()){return;}var t=ac.currentTime+.02,n=upp?[523,784,659,1047,784,1047,1319]:[1047,784,523];
  n.forEach(function(fr,q){pip(fr,t+q*.11,q===n.length-1?.5:.13,.16);});}
var storEl=$('stor');function stor(txt){if(!storEl){return;}storEl.textContent=txt;storEl.classList.remove('pang');void storEl.offsetWidth;storEl.classList.add('pang');}
function spark(t){if(!ac){return;}var o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(230,t);o.frequency.exponentialRampToValueAtTime(42,t+.11);
  g.gain.setValueAtTime(1,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(dist);o.start(t);o.stop(t+.3);}
var FL=(V.flippar||[]).map(function(f){var a=new Audio();a.preload='auto';a.src=f.fil;return {a:a,f:f};}), flNr=0, flNu=null, MUV=V.musik_under_flipp===undefined?.3:V.musik_under_flipp;
function flippSlut(){flNu=null;try{ljud.volume=1;}catch(e){}}
var gabber=0, tyrol=false, tyrolK=0, tyrolT=0, bTy=$('tyrol');
bTy.onclick=function(){tyrol=!tyrol;tyrolT=0;bTy.classList.toggle('pa',tyrol);folk.forEach(function(p){p.hatt.visible=tyrol;p.hang.visible=tyrol;});bjornar.forEach(function(b){b.hatt.visible=tyrol;});
  joddel(tyrol);if(tyrol){stor('HOLLADRIO');valj(0,12);markera(-1);}};
$('flippa').onclick=function(){
  ljudmotor();
  gabber=V.flipp_takter||16;
  if(FL.length){if(flNu){try{flNu.a.pause();}catch(e){}}
    flNu=FL[flNr%FL.length];flNr++;
    try{flNu.a.currentTime=0;}catch(e){}
    try{var fp=flNu.a.play();if(fp&&fp.catch){fp.catch(function(){});}ljud.volume=MUV;}catch(e){}
    flNu.a.onended=flippSlut;gabber=Math.max(4,Math.ceil((flNu.f.langd||6)/SPB));}
  document.body.classList.add('gabber');valj(Math.min(1,NK-1),16);markera(-1);};
$('raket').onclick=function(){if(rk.laget===0){ljudmotor();rk.laget=1;rk.start=Math.floor(slagNu())+1;rk.sist=-1;valj(NK-1,24);markera(-1);}};
/* kartongpasset: en kartong per tryck, skickas längs flosslinjen på beatet */
var linje=folk.filter(function(p){return p.d.dans!=='flipp';}).sort(function(a,b){return a.d.plats[0]-b.d.plats[0];}), pass=[], MAXPASS=5;
$('kartong').onclick=function(){ljudmotor();if(linje.length<2){return;}
  if(pass.length>=MAXPASS){pass.forEach(function(k){k.bort=1;});stor('LEVERERAT');duns();return;}
  var m=box(.5,.42,.5,mKartong,0,-40,0,rum);box(.52,.08,.14,mTejp,0,.18,0,m);
  pass.push({m:m,fran:-1,till:0,riktn:1,slag:Math.floor(slagNu()),bort:0,by:0});valj(Math.min(2,NK-1),12);markera(-1);};
/* stolbaletten */
var balett=false, balK=0, bBa=$('balett'), hemStol=stolar.map(function(st){return [st.position.x,st.position.z,st.rotation.y];});
bBa.onclick=function(){balett=!balett;bBa.classList.toggle('pa',balett);if(balett){ljudmotor();stor('BALETT');valj(Math.min(3,NK-1),16);markera(-1);}};

/* ---------- storlek ---------- */
var avst=1,avstV=1,sta=0;
function storlek(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<h?62:48;
  sta=w<h?1:0;avst=w<h?1+(1-w/h)*.3:1;avstV=w<h?1+(1-w/h)*1.25:1;
  if(w<h){cam.setViewOffset(w,h,0,-h*.1,w,h);}else if(w/h>1.25){cam.setViewOffset(w,h,-w*.17,0,w,h);}else{cam.clearViewOffset();}cam.updateProjectionMatrix();}
addEventListener('resize',storlek);storlek();

/* ---------- bildrutan ---------- */
var blixt=$('blixt'), takt=$('takt'), forra=performance.now()/1000, senSlag=-1, puls=0, TPK=V.takter_per_kamera||8;
function bild(){
  requestAnimationFrame(bild);
  var nu=performance.now()/1000, dt=Math.min(.05,nu-forra);forra=nu;
  var b=slagNu(), hel=Math.floor(b);
  if(hel!==senSlag){senSlag=hel;puls=1;
    if(gabber>0){gabber--;if(ac){try{spark(ac.currentTime+.01);spark(ac.currentTime+.01+SPB/2);}catch(e){}}
      if(gabber===0){document.body.classList.remove('gabber');if(flNu){try{flNu.a.pause();}catch(e){}flippSlut();}}}
    if(last>0){last--;}else if(hel%TPK===0){valj(nastaKam(),0);markera(-1);}
    takt.textContent=(gabber>0?'GABBER · ':tyrol?'TYROLEN · ':'')+'TAKT '+(Math.floor(hel/4)%99+1)+'.'+(hel%4+1);}
  puls*=Math.pow(.004,dt);
  var G=gabber>0, db=G?b*2:b, k={b:b,db:db,hel:hel,puls:puls,nu:nu,dt:dt,G:G,tyrol:tyrol,skrik:-1};
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
  /* kartongpass */
  for(var pi=pass.length-1;pi>=0;pi--){var kp=pass[pi];
    if(kp.bort){kp.by+=dt*(6+kp.by*3);kp.m.position.y+=kp.by*dt*4;kp.m.rotation.x+=dt*9;kp.m.rotation.z+=dt*7;if(kp.m.position.y>40){rum.remove(kp.m);pass.splice(pi,1);}continue;}
    if(hel!==kp.slag){kp.slag=hel;kp.fran=kp.till;if(kp.till+kp.riktn<0||kp.till+kp.riktn>=linje.length){kp.riktn=-kp.riktn;}kp.till+=kp.riktn;
      if(linje[kp.fran]){linje[kp.fran].hopp=1;}}
    var fr=b-hel, pa=linje[kp.fran], pb2=linje[kp.till], ax=pa?pa.g.position.x:pb2.g.position.x-9, az=pa?pa.g.position.z:pb2.g.position.z+5, ay=pa?1.75:5;
    var e2=fr*fr*(3-2*fr);kp.m.position.set(ax+(pb2.g.position.x-ax)*e2,ay+(1.75-ay)*e2+Math.sin(fr*Math.PI)*(1.5+pi*.25),az+(pb2.g.position.z-az)*e2+.3);
    kp.m.rotation.x=fr*6.283;kp.m.rotation.y=pi;var sq=1+Math.max(0,.25-fr)*1.2;kp.m.scale.set(sq,2-sq,sq);}
  papper.forEach(function(pp,n){pp.position.y=1.03+(G?Math.abs(Math.sin(db*Math.PI+n))*.8:puls*.05*(n%3));if(G){pp.rotation.y+=dt*5;}});
  stolar.forEach(function(st,n){if(balK>.5&&n<linje.length){return;}st.rotation.y+=dt*(G?8:(n%2?.5:-.5))*(tyrol||G?1:.25);});
  bjornar.forEach(function(bj){var u=Math.max(0,Math.sin(db*Math.PI/2+bj.off*1.6));bj.hd.position.y=.55+u*.75;bj.hd.rotation.z=Math.sin(db*Math.PI+bj.off)*.3;bj.hd.rotation.y=Math.sin(nu+bj.off)*.5;});
  lampG.rotation.z=Math.sin(b*Math.PI/2)*(G?.5:.12);lampa.intensity=1+puls*.9;
  /* raket: nedräkning på takten, iväg, träff i månen, retur */
  if(rk.laget===1){var nr=hel-rk.start;raket.position.x=6.4+Math.sin(nu*60)*(.02+Math.max(0,nr)*.025);
    if(nr!==rk.sist&&nr>=0){rk.sist=nr;if(nr<3){stor(String(3-nr));if(ac){pip(440,ac.currentTime+.01,.12,.2,'square');}eld.visible=true;}
      else{stor('IVÄG');rk.laget=2;rk.v=4;muller(2.6);if(ac){pip(880,ac.currentTime+.01,.5,.2,'square');}folk.forEach(function(p){p.hopp=1.2;});}}
    eld.scale.y=.3+Math.random()*.4+Math.max(0,nr)*.2;}
  else if(rk.laget===2){rk.v+=dt*30;rk.y+=rk.v*dt;eld.scale.y=1.2+Math.random();raket.rotation.y+=dt*4;
    if(rk.y>75){rk.laget=3;rk.t=0;rk.y=200;eld.visible=false;traff=1;manKam=2.1;stor('PANG');duns();
      if(manPaket.length<12){var va2=rnd(-1.1,1.1),vb=rnd(-.2,1.2),mp=box(.9,.8,.9,mKartong,Math.sin(va2)*Math.cos(vb)*2.6,Math.sin(vb)*2.6-.4,Math.cos(va2)*Math.cos(vb)*2.6,mane);mp.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));manPaket.push(mp);}}}
  else if(rk.laget===3){rk.t+=dt;if(rk.t>2.1&&rk.y>100){rk.y=62;stor('RETUR');}
    if(rk.t>2.1){rk.y-=dt*38;raket.rotation.z=Math.sin(nu*8)*.25;}
    if(rk.y<=0){rk.y=0;rk.laget=0;raket.rotation.z=0;raket.rotation.y=0;puls=1.6;raket.scale.set(1.3,.5,1.3);duns();folk.forEach(function(p){p.hopp=1.4;});}}
  traff*=Math.pow(.08,dt);manKam=Math.max(0,manKam-dt);mm.scale.set(1.4-traff*.7,.5+traff*1.1,.5);
  raket.position.y=rk.y;raket.scale.lerp(ETT,.12);
  if(rk.laget===1||rk.laget===2){for(var n=0;n<2;n++){var q=rok[(Math.random()*rok.length)|0];if(q.t>1.2){q.t=0;q.m.position.set(6.4+rnd(-.3,.3),rk.y+.2,-2.2+rnd(-.3,.3));q.vx=rnd(-2.5,2.5);q.vz=rnd(-2.5,2.5);}}}
  rok.forEach(function(q){if(q.t<1.5){q.t+=dt;q.m.position.x+=q.vx*dt;q.m.position.z+=q.vz*dt;q.m.position.y=Math.max(.2,q.m.position.y-dt*3);
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
  var ma=nu*.11;mane.position.set(Math.cos(ma)*30,13+Math.sin(ma*2)*2,Math.sin(ma)*30-6);mane.lookAt(0,3,0);mane.scale.setScalar(1+puls*.06+traff*.35);
  flyt.forEach(function(o){o.a+=o.sp*dt;o.m.position.set(Math.cos(o.a)*o.r,o.y+Math.sin(nu*.4+o.r)*.8,Math.sin(o.a)*o.r);o.m.rotation.x+=o.rx*dt;o.m.rotation.y+=o.ry*dt;});
  regn.forEach(function(o){if(G){o.y-=o.v*dt;if(o.y<.3){o.y=rnd(12,24);o.m.position.x=rnd(-7.5,7.5);o.m.position.z=rnd(-4.5,6);}o.m.position.y=o.y;o.m.rotation.x+=o.rx*dt;o.m.rotation.z+=o.rz*dt;}else{o.m.position.y=-60;}});
  blixt.style.opacity=(G&&!lugn&&puls>.75)?.22:0;
  /* kamera */
  var S=skott[sk];tp.set(S.p[0],S.p[1],S.p[2]);tl.set(S.l[0],S.l[1],S.l[2]);
  if(sk===NK-1&&rk.laget>=2){tl.y=Math.min(26,2.6+rk.y*.6);}
  tp.sub(tl).multiplyScalar(S.vid?avstV:avst).add(tl);if(sta&&S.upp){tl.y+=S.upp;}
  if(manKam>0){tl.copy(mane.position);tp.set(mane.position.x*.45,10,mane.position.z*.45);}
  var kk=1-Math.pow(manKam>0?.0005:.02,dt);cp.lerp(tp,kk);cl.lerp(tl,kk);var sv=lugn?0:1;
  cam.position.set(cp.x+Math.sin(nu*.5)*.35*sv+(G||rk.laget===2?rnd(-.12,.12):0),cp.y+Math.sin(nu*.37)*.2*sv+puls*.06*sv+(G?rnd(-.12,.12):0),cp.z);
  cam.lookAt(cl);renderer.render(scene,cam);
}
valj(0,8);
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){ritaTavla(tTavla.image.getContext('2d'),1024,400);tTavla.needsUpdate=true;});}
window.BEZOZ={valj:valj,DANS:DANS,folk:folk,slagNu:slagNu};
bild();
})();
