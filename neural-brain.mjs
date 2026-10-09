/* Cerebral hemispheres built from a sagittal brain outline, not spheres.
   Stylized anatomy includes an inferior notch, cerebellum and brainstem. */
export function createNeuralBrain(){
 const points=[],edges=[],features=[],triangles=[],circuits=[];
 const outline=[[.88,.08],[.91,-.18],[.79,-.44],[.55,-.64],[.23,-.74],[-.14,-.73],[-.49,-.65],[-.77,-.49],[-.90,-.24],[-.89,.01],[-.76,.22],[-.55,.29],[-.35,.16],[-.10,.20],[.12,.34],[.37,.36],[.62,.29],[.80,.19]];
 const tau=Math.PI*2;
 function profile(a){
  const f=((a/tau%1)+1)%1*outline.length,i=Math.floor(f),t=f-i;
  const p=outline[(i+outline.length-1)%outline.length],q=outline[i],r=outline[(i+1)%outline.length],s=outline[(i+2)%outline.length];
  return [0,1].map(k=>.5*((2*q[k])+(-p[k]+r[k])*t+(2*p[k]-5*q[k]+4*r[k]-s[k])*t*t+(-p[k]+3*q[k]-3*r[k]+s[k])*t*t*t));
 }
 function cortex(side,r,a,ridge=false){
  const [z,y]=profile(a),d=Math.sqrt(Math.max(0,1-r*r));
  const ripple=1+.017*Math.sin(a*13+r*24)*Math.sin(r*Math.PI);
  const px=side*(.035+.57*d*ripple),py=-.16+(y+.16)*r,pz=z*r;
  return {x:px,y:py,z:pz,nx:side*d,ny:(py+.16)/.67,nz:pz/.91,land:ridge};
 }
 const add=p=>{points.push(p);return points.length-1};
 function circuit(path){circuits.push(path);for(let j=1;j<path.length;j++)features.push([path[j-1],path[j]]);}
 const cols=42,rows=12;
 for(const side of [-1,1]){
  const base=points.length;
  for(let r=0;r<=rows;r++)for(let c=0;c<cols;c++){
   const i=add(cortex(side,r/rows,c/cols*tau)),next=base+r*cols+(c+1)%cols;
   edges.push([i,next]);
   if(r){const prev=i-cols,diag=base+(r-1)*cols+(c+1)%cols;edges.push([i,prev]);triangles.push([i,prev,diag],[i,diag,next]);}
  }
  // Winding gyri traverse the cortex instead of concentric globe-like rings.
  function foldPoint(u,v){const r=Math.min(.985,Math.hypot(u,v));return cortex(side,r,Math.atan2(v,u),true);}
  for(let k=0;k<9;k++){
   const path=[],v0=-.82+k*.195,span=Math.sqrt(1-v0*v0)*.96;
   for(let j=0;j<=65;j++){
    const u=-span+2*span*j/65;
    const v=v0+.046*Math.sin(u*19+k*1.3)+.024*Math.sin(u*35-k*.8);
    path.push(add(foldPoint(u,v)));
   }
   circuit(path);
  }
  for(let k=0;k<15;k++){
   const path=[],u0=-.72+(k%5)*.34,v0=-.48+Math.floor(k/5)*.4;
   for(let j=0;j<=12;j++){
    const t=j/12,u=u0+.035*Math.sin(t*Math.PI*2+k),v=v0+t*.15;
    path.push(add(foldPoint(u,v)));
   }
   circuit(path);
  }
  // Continuous outline and medial fissure make the cerebral contour readable.
  const rim=[];for(let j=0;j<=80;j++)rim.push(add(cortex(side,1,j/80*tau,true)));circuit(rim);
 }
 function ellipsoid(center,radii,rows,cols,folds=false){
  const base=points.length;
  for(let r=0;r<=rows;r++)for(let c=0;c<cols;c++){
   const t=.03+(Math.PI-.06)*r/rows,p=c/cols*tau,s=Math.sin(t),co=Math.cos(t);
   const wave=folds?1+.025*Math.cos(t*22):1;
   const i=add({x:center[0]+radii[0]*s*Math.cos(p)*wave,y:center[1]-radii[1]*co,z:center[2]+radii[2]*s*Math.sin(p)*wave,nx:s*Math.cos(p),ny:-co,nz:s*Math.sin(p),land:folds});
   const next=base+r*cols+(c+1)%cols;edges.push([i,next]);
   if(r){const prev=i-cols,diag=base+(r-1)*cols+(c+1)%cols;edges.push([i,prev]);triangles.push([i,prev,diag],[i,diag,next]);}
  }
  if(folds)for(let r=2;r<rows;r+=2){const path=[];for(let c=0;c<=cols;c++)path.push(base+r*cols+c%cols);circuit(path);}
 }
 // Inferior-posterior cerebellar lobes, with fine horizontal folia.
 ellipsoid([-.19,.43,-.53],[.23,.22,.33],10,24,true);
 ellipsoid([.19,.43,-.53],[.23,.22,.33],10,24,true);
 // Short brainstem below the cerebral notch, distinct from the cerebellum.
 ellipsoid([0,.50,-.18],[.10,.32,.12],8,14);
 return {points,edges,features,triangles,circuits};
}
