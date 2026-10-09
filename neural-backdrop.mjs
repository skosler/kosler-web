import { createNeuralBrain } from './neural-brain.mjs?v=20261008-hyperbrain';
function mount(){
 if(document.getElementById('kosler-neural-backdrop'))return;
 const canvas=document.createElement('canvas');canvas.id='kosler-neural-backdrop';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
 const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
 const {points,edges,features,triangles,circuits}=createNeuralBrain();
 const brainImage=new Image();let brainReady=false;
 brainImage.decoding='async';brainImage.src='/images/coaching-digital-brain.png';
 brainImage.addEventListener('load',()=>{brainReady=true;draw(performance.now());},{once:true});
 const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,frame=0,last=0,start=performance.now(),ambient=[];
 let alive=true;
 // Deterministic positions keep the static and animated compositions coherent.
 const seed=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
 function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ambient=Array.from({length:width<600?48:90},(_,i)=>({x:seed(i)*width,y:seed(i+100)*height,phase:seed(i+200)*Math.PI*2}));if(reduce.matches||document.hidden)draw(performance.now());}
 function draw(now){
  ctx.clearRect(0,0,width,height);
  const mobile=width<700, time=reduce.matches?0:Math.max(0,(now-start)/1000);
  const coaching=document.body.classList.contains('coach-page');
  const size=Math.min(height*(mobile?.34:.43),width*(mobile?.47:.29));
  const cx=width*(mobile?.54:coaching?.70:.67),cy=height*(mobile?.57:.52);
  // Neurons assemble once; the completed brain keeps rotating for the session.
  const form=reduce.matches?1:smooth(time/7);
  const dispersion=1-form;
  const angle=reduce.matches?.88:.88+time*.035;
  const projected=points.map((p,i)=>{
    const jitter=reduce.matches?0:Math.sin(time*.4+i*.71)*.006;
    const depth=-p.x*Math.sin(angle)+p.z*Math.cos(angle);
    const perspective=1+depth*.08;
    const facing=-p.nx*Math.sin(angle)+p.nz*Math.cos(angle);
    const x=(p.x*Math.cos(angle)+p.z*Math.sin(angle))*size*perspective;
    const target={x:cx+x,y:cy+(p.y+jitter)*size*perspective};
    const swirl=reduce.matches?0:time*.12+seed(i+900)*Math.PI*2;
    const driftX=(seed(i+400)-.5)*width*.85+Math.sin(swirl+p.y*3)*size*.42;
    const driftY=(seed(i+700)-.5)*height*.75+Math.cos(swirl+p.x*4)*size*.28;
    return {x:target.x+driftX*dispersion,y:target.y+driftY*dispersion,depth,facing,visibility:dispersion+form*(facing>0?.3+.7*facing:.04)};
  });
  const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,size*1.3);glow.addColorStop(0,'rgba(126,133,151,.09)');glow.addColorStop(1,'rgba(126,133,151,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  // Soft facets give both hemispheres volume while the folds remain luminous neurons.
  if(form>.55)triangles.forEach(([a,b,c],i)=>{
    const p=projected[a],q=projected[b],r=projected[c];
    const depth=(p.facing+q.facing+r.facing)/3;
    if(depth<0)return;
    const alpha=Math.max(.008,depth*.075)*form;
    ctx.fillStyle=points[a].land?`rgba(232,98,42,${alpha})`:`rgba(126,133,151,${alpha})`;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineTo(r.x,r.y);ctx.closePath();ctx.fill();
  });
  // The dispersed neural field resolves into the approved hyperrealistic brain.
  // A restrained 3D yaw cycle keeps it turning without flattening it edge-on.
  const resolved=smooth((form-.48)/.52);
  if(brainReady&&resolved>0){
   const yaw=reduce.matches?0:Math.sin(time*.18);
   const imageWidth=size*(mobile?2.72:3.05),imageHeight=imageWidth*(brainImage.naturalHeight/brainImage.naturalWidth);
   ctx.save();ctx.translate(cx+(!reduce.matches?Math.sin(time*.18)*size*.035:0),cy+size*.01);
   ctx.transform(.91+.09*Math.cos(time*.18),yaw*.025,yaw*.055,1,0,0);
   ctx.globalAlpha=resolved*(coaching ? .46 : .38);
   ctx.shadowColor='rgba(242,153,74,.22)';ctx.shadowBlur=24;
   ctx.drawImage(brainImage,-imageWidth/2,-imageHeight/2,imageWidth,imageHeight);
   ctx.shadowBlur=0;ctx.restore();
  }
  function line(a,b,feature=false){
    const p=projected[a],q=projected[b],warm=points[a].land;
    const length=Math.hypot(p.x-q.x,p.y-q.y);
    // Dispersed nodes reconnect locally instead of drawing long lines across copy.
    const reach=mobile?95:155;
    if((dispersion>.15&&length>reach)||(feature&&(form<.45||(form>.7&&(p.facing<0||q.facing<0)))))return;
    const energy=reduce.matches?.6:.65+.35*Math.sin(time*1.25+a*.13);
    const alpha=(feature?.82:.16)*(feature?form:1)*(1+energy*.25)*Math.min(p.visibility,q.visibility);
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineWidth=feature?1.4:.55;
    ctx.strokeStyle=warm?`rgba(232,98,42,${alpha})`:`rgba(126,133,151,${alpha})`;ctx.stroke();
  }
  edges.forEach(([a,b])=>line(a,b));features.forEach(([a,b])=>line(a,b,true));
  projected.forEach((p,i)=>{
    const pulse=reduce.matches?.7:.55+.45*Math.sin(time*1.25+i*.6);
    const bright=i%13===0, color=points[i].land?'242,153,74':'237,232,223';
    ctx.fillStyle=`rgba(${color},${pulse*(bright?.95:points[i].land?.78:.45)*p.visibility})`;
    if(bright&&p.visibility>.3){ctx.shadowColor=`rgba(${color},.7)`;ctx.shadowBlur=9;}
    ctx.beginPath();
    if(bright&&form>.65){ctx.rect(p.x-1.65,p.y-1.65,3.3,3.3);}else{ctx.arc(p.x,p.y,bright?2.1:.85,0,Math.PI*2);}
    ctx.fill();ctx.shadowBlur=0;
    // Small processor nodes punctuate the folded circuit mesh.
    if(i%83===0&&form>.7&&p.visibility>.3){ctx.strokeStyle=`rgba(${color},${form*p.visibility*.55})`;ctx.lineWidth=.7;ctx.strokeRect(p.x-4,p.y-4,8,8);}
    // Soft starbursts brighten and fade; no abrupt blinking.
    if(bright&&p.visibility>.3&&!reduce.matches){const shimmer=Math.pow((1+Math.sin(time*.9+i))/2,6),radius=4+shimmer*8;
      ctx.strokeStyle=`rgba(${color},${shimmer*.65*p.visibility})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(p.x-radius,p.y);ctx.lineTo(p.x+radius,p.y);ctx.moveTo(p.x,p.y-radius);ctx.lineTo(p.x,p.y+radius);ctx.stroke();}
  });
  // Ambient neurons travel continuously, with changing proximity connections.
  const wrap=(v,max)=>((v%max)+max)%max;
  const nodes=ambient.map((p,i)=>({x:wrap(p.x+time*(i%2?3:-2.5)+Math.sin(time*.15+p.phase)*20,width+40)-20,y:wrap(p.y+time*(i%3?1.5:-2)+Math.cos(time*.12+p.phase)*15,height+40)-20}));
  nodes.forEach((p,i)=>{ctx.fillStyle=i%5===0?'rgba(232,98,42,.48)':'rgba(126,133,151,.4)';ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fill();for(let j=i+1;j<nodes.length;j++){const q=nodes[j],dist=Math.hypot(p.x-q.x,p.y-q.y);if(dist<150){ctx.strokeStyle=`rgba(126,133,151,${(1-dist/150)*.2})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}});
  // More luminous signals travel over the brain and the dissolved neural field.
  if(!reduce.matches)for(let n=0;n<(mobile?12:24);n++){
    const travel=time*(5+n*.08)+n*37.17;
    // Signals follow entire cortical paths when assembled, local neurons when dispersed.
    const path=circuits[n%circuits.length];
    const edge=form>.6?[path[Math.floor(travel)%(path.length-1)],path[Math.floor(travel)%(path.length-1)+1]]:edges[Math.floor(travel)%edges.length];
    const a=projected[edge[0]],b=projected[edge[1]],t=travel%1;
    if(Math.hypot(a.x-b.x,a.y-b.y)>155||Math.min(a.visibility,b.visibility)<.25)continue;
    const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
    const color=n%3===0?'242,153,74':'237,232,223';
    ctx.shadowColor=`rgba(${color},.85)`;ctx.shadowBlur=16;ctx.fillStyle=`rgba(${color},.9)`;
    ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=`rgba(${color},${.55*form})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(x,y);ctx.stroke();ctx.shadowBlur=0;
  }
 }
 function tick(now){if(!alive||document.hidden||reduce.matches)return;if(now-last>=1000/30){draw(now);last=now;}frame=requestAnimationFrame(tick);}
 function resume(){cancelAnimationFrame(frame);if(document.hidden)return;draw(performance.now());if(!reduce.matches)frame=requestAnimationFrame(tick);}
 function stop(){alive=false;cancelAnimationFrame(frame);removeEventListener('resize',resize);document.removeEventListener('visibilitychange',resume);reduce.removeEventListener('change',resume);removeEventListener('kosler-neural-stop',stop);canvas.remove();}
 addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',resume);reduce.addEventListener('change',resume);addEventListener('kosler-neural-stop',stop,{once:true});resize();resume();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
