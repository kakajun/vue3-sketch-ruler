import{d as he,x as Pe,r as N,c as H,l as Ee,p as Z,o as D,b as Q,y as Me,e as j,k as be,n as V,z as J,A as _,f as xe,m as Le,F as We,q as Ye,j as Ie,u as O,t as Oe,B as Ae,g as de,a as De,C as Ve}from"./index-BWyYrWVH.js";/*!vue3-sketch-ruler v2.2.72024年12月Sat Dec 28 2024 12:14:41 GMT+0000 (Coordinated Universal Time)制作*/const Qe=e=>e<=.25?40:e<=.5?20:e<=1?10:e<=2?5:e<=4?2:1;function Fe(e,t,n,o,i,s){s?i.moveTo(e,0):i.moveTo(0,e),i.save(),s?i.translate(e+5,o*.2):i.translate(n*.1,e+32),s||i.rotate(-Math.PI/2),i.fillText(Math.round(t).toString(),4,7),i.restore(),s?i.lineTo(e,o):i.lineTo(n,e),i.stroke(),i.closePath(),i.setTransform(1,0,0,1,0,0)}function ie(e,t,n,o,i,s){o.fillStyle=i.fontShadowColor,o.strokeStyle=i.longfgColor,o.save(),o.translate(e,t),s||o.rotate(-Math.PI/2),o.font="bold 12px  Aria",o.fillText(String(n),0,0),o.restore()}const qe=(e,t,n,o,i,s)=>{const{scale:d,width:m,height:u,ratio:M,palette:S,gridRatio:A,showShadowText:k}=i,{bgColor:p,fontColor:h,shadowColor:L,longfgColor:X}=S,g=s?i.canvasWidth:i.canvasHeight;e.setTransform(1,0,0,1,0,0),e.scale(M,M),e.clearRect(0,0,m,u),e.fillStyle=p,e.fillRect(0,0,m,u);const w=Qe(d)*A*10,C=w*d,T=Math.floor(t/w)*w,U=(T-t)/w*C,z=t+Math.ceil((s?m:u)/d);if(o){const y=(n-t)*d,B=o*d;if(e.fillStyle=L,s?e.fillRect(y,0,B,u):e.fillRect(0,y,m,B),k)if(s){ie(y,u*.4,Math.round(n),e,S,s);const E=(n+o-t)*d;ie(E,u*.4,Math.round(n+o),e,S,s)}else{ie(m*.4,y,Math.round(n),e,S,s);const E=(n+o-t)*d;ie(m*.4,E,Math.round(n+o),e,S,s)}}e.beginPath(),e.fillStyle=h,e.strokeStyle=X;for(let y=T,B=0;y<z;y+=w,B++){const E=U+B*C+.5;if(y-w<g&&y>g||y==g){const I=U+B*C+.5+(g-y)*d;Fe(I,g,m,u,e,s);return}y>=0&&y<=g&&(y==0?s?(e.moveTo(E,0),e.lineTo(E,u)):(e.moveTo(0,E),e.lineTo(m,E)):s?(e.moveTo(E,20),e.lineTo(E,u/1.3)):(e.moveTo(20,E),e.lineTo(m/1.3,E)),e.save(),y==0?s?e.translate(E-15,u*.01):e.translate(m*.3,E-5):s?e.translate(E-12,u*.05):e.translate(m*.05,E+12),s||e.rotate(-Math.PI/2),g-y>w/2&&(!k||o==0||Math.abs(y-n)>w/2&&Math.abs(y-(n+o))>w/2)&&e.fillText(y.toString(),4,9),e.restore())}e.stroke(),e.closePath()};function Se(e,t=100){let n=null;const o=function(...i){n!==null&&clearTimeout(n),n=setTimeout(()=>{e(...i)},t)};return o.cancel=function(){n!==null&&(clearTimeout(n),n=null)},o}function Xe(e,t){const n=N(0),o=N(0),i=N(!1),s=H(()=>({backgroundColor:e.palette.hoverBg,color:e.palette.hoverColor,[t?"top":"left"]:"-8px",[t?"left":"top"]:`${n.value+10}px`})),d=({offsetX:p,offsetY:h})=>{n.value=t?p:h},m=(p,h)=>new Promise(L=>{if(e.lockLine)return;const X=t?p.clientY:p.clientX;d(p);const g=h||o.value;let w=g;const C=U=>{let z=((t?U.clientY:U.clientX)-X)/e.scale+g,y=z;const B=(t?e.snapsObj.h:e.snapsObj.v).slice().sort((E,I)=>Math.abs(y-E)-Math.abs(y-I));B.length&&Math.abs(B[0]-z)<e.snapThreshold/e.scale&&(y=B[0],z=y),w=Math.round(z),o.value=w},T=()=>{document.removeEventListener("mousemove",C),u(w,e.index),L()};document.addEventListener("mousemove",C),document.addEventListener("mouseup",T,{once:!0})}),u=(p,h)=>{var L,X;const g=t?(L=e.lines)==null?void 0:L.h:(X=e.lines)==null?void 0:X.v,w=M(p);if(g)if(w)if(typeof h=="number")g.splice(h,1);else return;else typeof h!="number"?g.push(p):g[h]=p},M=p=>{const h=t?e.canvasHeight:e.canvasWidth;return p<0||p>h},S=H(()=>M(o.value)?"放开删除":`${t?"Y":"X"}：${o.value*e.rate}`),A=Se(()=>{i.value=!1},200),k=Se(()=>{i.value=!0},200);return{showLabel:i,startValue:o,actionStyle:s,labelContent:S,handleMouseDown:m,handleMouseenter:p=>{e.lockLine||(d(p),k(),A.cancel())},handleMouseLeave:()=>{A()}}}const Ke={key:0,class:"value"},Ze=he({__name:"ruler-line",props:{scale:{},palette:{},index:{},start:{},vertical:{type:Boolean},value:{},canvasWidth:{},canvasHeight:{},lines:{},isShowReferLine:{type:Boolean},rate:{},snapThreshold:{},snapsObj:{},lockLine:{type:Boolean}},setup(e){const t=e,n=N(!1),{actionStyle:o,handleMouseDown:i,labelContent:s,startValue:d,showLabel:m,handleMouseenter:u,handleMouseLeave:M}=Xe(t,t.vertical),S=H(()=>d.value>=t.start),A=H(()=>{const{lineType:p,lockLineColor:h,lineColor:L}=t.palette,X=t.lockLine?h:L??"black",g=t.lockLine||n.value?"none":"auto",w=t.isShowReferLine&&!t.lockLine?t.vertical?"ns-resize":"ew-resize":"default",C=t.vertical?"borderTop":"borderLeft",T=(d.value-t.start)*t.scale;return{[C]:`1px ${p} ${X}`,pointerEvents:g,cursor:w,[t.vertical?"top":"left"]:`${T}px`}});Ee(()=>{d.value=t.value??0});const k=Se(()=>{n.value=!1},1e3);return Z([()=>t.scale],()=>{n.value=!0,k()}),(p,h)=>J((D(),Q("div",{class:"line",style:V(A.value),onMouseenter:h[0]||(h[0]=de((...L)=>O(u)&&O(u)(...L),["stop"])),onMouseleave:h[1]||(h[1]=de((...L)=>O(M)&&O(M)(...L),["stop"])),onMousedown:h[2]||(h[2]=de((...L)=>O(i)&&O(i)(...L),["stop"]))},[j("div",{class:"action",style:V(O(o))},[O(m)?(D(),Q("span",Ke,Oe(O(s)),1)):Ae("",!0)],4)],36)),[[_,S.value]])}}),$e=he({__name:"index",props:{scale:{},palette:{},vertical:{type:Boolean},showShadowText:{type:Boolean},start:{},width:{},height:{},selectStart:{},selectLength:{},canvasWidth:{},canvasHeight:{},rate:{},gridRatio:{}},emits:["handleDragStart"],setup(e,{emit:t}){const n=e,o=t,i=De({isDragging:!1,canvasContext:null});let s=window.devicePixelRatio;const d=N(null);Ee(()=>{window.addEventListener("resize",m),u(),S(s),A(s)});const m=()=>{s=window.devicePixelRatio,S(s),A(s)},u=()=>{var p;i.canvasContext=((p=d.value)==null?void 0:p.getContext("2d"))||null},M=H(()=>({width:n.width+"px",height:n.height+"px",cursor:n.vertical?"ew-resize":"ns-resize",[n.vertical?"borderRight":"borderBottom"]:`1px solid ${n.palette.borderColor||"#eeeeef"} `}));Ve(()=>{window.removeEventListener("resize",m)});const S=p=>{if(d.value){d.value.width=Math.round(n.width*p),d.value.height=Math.round(n.height*p);const h=i.canvasContext;h&&(h.font=`11px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`,h.lineWidth=1,h.textBaseline="middle")}},A=p=>{const h={scale:n.scale,width:n.width,height:n.height,palette:n.palette,canvasWidth:n.canvasWidth,canvasHeight:n.canvasHeight,ratio:p,rate:n.rate,gridRatio:n.gridRatio,showShadowText:n.showShadowText};h.scale=n.scale/n.rate,h.canvasWidth=n.canvasWidth*n.rate,h.canvasHeight=n.canvasHeight*n.rate,i.canvasContext&&qe(i.canvasContext,n.start*n.rate,n.selectStart,n.selectLength,h,!n.vertical)};Z([()=>n.width,()=>n.height,()=>n.start,()=>n.palette,()=>n.selectStart,()=>n.selectLength],()=>{A(s)}),Z([()=>n.width,()=>n.height],()=>{S(s)});const k=p=>{o("handleDragStart",p)};return(p,h)=>(D(),Q("canvas",{ref_key:"canvas",ref:d,class:"ruler",style:V(M.value),onMousedown:de(k,["stop"])},null,36))}}),Ge={class:"lines"},je={key:0,class:"value"},Be=he({__name:"ruler-wrapper",props:{scale:{},thick:{},canvasWidth:{},canvasHeight:{},palette:{},vertical:{type:Boolean},width:{},height:{},start:{},startOther:{},lines:{},selectStart:{},selectLength:{},isShowReferLine:{type:Boolean},rate:{},snapThreshold:{},snapsObj:{},gridRatio:{},lockLine:{type:Boolean},showShadowText:{type:Boolean}},emits:["changeLineState"],setup(e,{emit:t}){const n=e,{showLabel:o,actionStyle:i,handleMouseenter:s,handleMouseLeave:d,handleMouseDown:m,labelContent:u,startValue:M}=Xe(n,!n.vertical),S=N(!1),A=N(!1),k=H(()=>n.vertical?"v-container":"h-container"),p=t,h=H(()=>{var g,w;return n.vertical?(g=n.lines)==null?void 0:g.h:(w=n.lines)==null?void 0:w.v}),L=H(()=>{const g=n.palette.lineType;let w=n.vertical?"left":"top",C=n.vertical?"top":"left",T=n.vertical?"borderLeft":"borderBottom";const U=(M.value-n.startOther)*n.scale+n.thick;return{[w]:U+"px",[C]:-n.thick+"px",cursor:n.vertical?"ew-resize":"ns-resize",[T]:`1px ${g} ${n.palette.lineColor}`}}),X=async g=>{const{offsetX:w,offsetY:C}=g,{scale:T,vertical:U,thick:z,startOther:y}=n;A.value=!0,S.value=!1,p("changeLineState",!1);let B=Math.round(y-z/T+(U?w:C)/T);M.value=B,await m(g,B),A.value=!1};return Z([()=>n.lockLine],()=>{S.value=n.lockLine}),(g,w)=>(D(),Q("div",{class:be(k.value)},[xe($e,Le(g.$props,{onHandleDragStart:X}),null,16),J(j("div",Ge,[(D(!0),Q(We,null,Ye(h.value,(C,T)=>(D(),Ie(Ze,Le({key:C+T,index:T,value:C>>0,ref_for:!0},g.$props),null,16,["index","value"]))),128))],512),[[_,g.isShowReferLine]]),g.isShowReferLine?J((D(),Q("div",{key:0,class:"indicator",style:V(L.value),onMouseenter:w[0]||(w[0]=(...C)=>O(s)&&O(s)(...C)),onMouseleave:w[1]||(w[1]=(...C)=>O(d)&&O(d)(...C))},[j("div",{class:"action",style:V(O(i))},[O(o)?(D(),Q("span",je,Oe(O(u)),1)):Ae("",!0)],4)],36)),[[_,A.value]]):Ae("",!0)],2))}}),Je="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC",_e="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=";/*!simple-panzoom v1.0.72024年8月Sat Aug 10 2024 16:04:04 GMT+0800 (中国标准时间)制作*/typeof window<"u"&&(window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),typeof window.CustomEvent!="function"&&(window.CustomEvent=function(e,t){t=t||{bubbles:!1,cancelable:!1,detail:null};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n}));function Ne(e,t){let n=e.length;for(;n--;)if(e[n].pointerId===t.pointerId)return n;return-1}function Ce(e,t){let n;if(t.touches){n=0;for(const o of t.touches)o.pointerId=n++,Ce(e,o);return}n=Ne(e,t),n>-1&&e.splice(n,1),e.push(t)}function et(e,t){if(t.touches){for(;e.length;)e.pop();return}const n=Ne(e,t);n>-1&&e.splice(n,1)}function Te(e){e=e.slice(0);let t=e.pop(),n;for(;n=e.pop();)t={clientX:(n.clientX-t.clientX)/2+t.clientX,clientY:(n.clientY-t.clientY)/2+t.clientY};return t}function ge(e){if(e.length<2)return 0;const t=e[0],n=e[1];return Math.sqrt(Math.pow(Math.abs(n.clientX-t.clientX),2)+Math.pow(Math.abs(n.clientY-t.clientY),2))}let le={down:"mousedown",move:"mousemove",up:"mouseup mouseleave"};typeof window<"u"&&(typeof window.PointerEvent=="function"?le={down:"pointerdown",move:"pointermove",up:"pointerup pointerleave pointercancel"}:typeof window.TouchEvent=="function"&&(le={down:"touchstart",move:"touchmove",up:"touchend touchcancel"}));function we(e,t,n,o){le[e].split(" ").forEach(i=>{t.addEventListener(i,n,o)})}function ye(e,t,n){le[e].split(" ").forEach(o=>{t.removeEventListener(o,n)})}const tt=typeof document<"u"&&!!document.documentMode;let Re;function nt(){return Re||(Re=document.createElement("div").style)}const ze=["webkit","moz","ms"],re={};function ke(e){if(re[e])return re[e];const t=nt();if(e in t)return re[e]=e;const n=e[0].toUpperCase()+e.slice(1);let o=ze.length;for(;o--;){const i=`${ze[o]}${n}`;if(i in t)return re[e]=i}}function se(e,t){return parseFloat(t[ke(e)])||0}function ce(e,t,n=window.getComputedStyle(e)){const o=t==="border"?"Width":"";return{left:se(`${t}Left${o}`,n),right:se(`${t}Right${o}`,n),top:se(`${t}Top${o}`,n),bottom:se(`${t}Bottom${o}`,n)}}function G(e,t,n){e.style[ke(t)]=n}function ot(e,t){const n=ke("transform");G(e,"transition",`${n} ${t.duration}ms ${t.easing}`)}function at(e,{x:t,y:n,scale:o,isSVG:i},s){if(G(e,"transform",`scale(${o}) translate(${t}px, ${n}px)`),i&&tt){const d=window.getComputedStyle(e).getPropertyValue("transform");e.setAttribute("transform",d)}}function ue(e){const t=e.parentNode,n=window.getComputedStyle(e),o=window.getComputedStyle(t),i=e.getBoundingClientRect(),s=t.getBoundingClientRect();return{elem:{style:n,width:i.width,height:i.height,top:i.top,bottom:i.bottom,left:i.left,right:i.right,margin:ce(e,"margin",n),border:ce(e,"border",n)},parent:{style:o,width:s.width,height:s.height,top:s.top,bottom:s.bottom,left:s.left,right:s.right,padding:ce(t,"padding",o),border:ce(t,"border",o)}}}function lt(e){let t=e;for(;t&&t.parentNode;){if(t.parentNode===document)return!0;t=t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}return!1}function it(e){return(e.getAttribute("class")||"").trim()}function rt(e,t){return e.nodeType===1&&` ${it(e)} `.indexOf(` ${t} `)>-1}function st(e,t){for(let n=e;n!=null;n=n.parentNode)if(rt(n,t.excludeClass)||t.exclude.indexOf(n)>-1)return!0;return!1}const ct=/^http:[\w\.\/]+svg$/;function ut(e){return ct.test(e.namespaceURI)&&e.nodeName.toLowerCase()!=="svg"}function dt(e){const t={};for(const n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}const He={animate:!1,canvas:!1,cursor:"move",disablePan:!1,disableZoom:!1,disableXAxis:!1,disableYAxis:!1,duration:200,easing:"ease-in-out",exclude:[],excludeClass:"panzoom-exclude",handleStartEvent:e=>{e.preventDefault(),e.stopPropagation()},maxScale:4,minScale:.125,overflow:"hidden",panOnlyWhenZoomed:!1,pinchAndPan:!1,relative:!1,setTransform:at,startX:0,startY:0,startScale:1,step:.3,touchAction:"none"};function Ue(e,t){if(!e)throw new Error("Panzoom requires an element as an argument");if(e.nodeType!==1)throw new Error("Panzoom requires an element with a nodeType of 1");if(!lt(e))throw new Error("Panzoom should be called on elements that have been attached to the DOM");t={...He,...t};const n=ut(e),o=e.parentNode;o.style.overflow=t.overflow,o.style.userSelect="none",o.style.touchAction=t.touchAction,(t.canvas?o:e).style.cursor=t.cursor,e.style.userSelect="none",e.style.touchAction=t.touchAction,G(e,"transformOrigin",typeof t.origin=="string"?t.origin:n?"0 0":"50% 50%");function i(){o.style.overflow="",o.style.userSelect="",o.style.touchAction="",o.style.cursor="",e.style.cursor="",e.style.userSelect="",e.style.touchAction="",G(e,"transformOrigin","")}function s(a={}){for(const c in a)a.hasOwnProperty(c)&&(t[c]=a[c]);(a.hasOwnProperty("cursor")||a.hasOwnProperty("canvas"))&&(o.style.cursor=e.style.cursor="",(t.canvas?o:e).style.cursor=t.cursor),a.hasOwnProperty("overflow")&&(o.style.overflow=a.overflow),a.hasOwnProperty("touchAction")&&(o.style.touchAction=a.touchAction,e.style.touchAction=a.touchAction)}let d=0,m=0,u=1,M=!1;L(t.startScale,{animate:!1,force:!0}),setTimeout(()=>{h(t.startX,t.startY,{animate:!1,force:!0})});function S(a,c,f){if(f.silent)return;const x=new CustomEvent(a,{detail:c});e.dispatchEvent(x)}function A(a,c,f){const x={x:d,y:m,scale:u,isSVG:n,originalEvent:f,dimsOut:{}};typeof c.animate=="boolean"&&(c.animate?ot(e,c):G(e,"transition","none")),c.setTransform(e,x,c);function r(){const b=ue(e);x.dimsOut=b,S(a,x,c),S("panzoomchange",x,c)}return c.animate?setTimeout(()=>{r()},c.duration+50):requestAnimationFrame(()=>{r()}),x}function k(a,c,f,x){const r={...t,...x},b={x:d,y:m,opts:r};if(!r.force&&(r.disablePan||r.panOnlyWhenZoomed&&u===r.startScale))return b;if(a=parseFloat(a),c=parseFloat(c),r.disableXAxis||(b.x=(r.relative?d:0)+a),r.disableYAxis||(b.y=(r.relative?m:0)+c),r.contain){const v=ue(e),Y=v.elem.width/u,W=v.elem.height/u,oe=Y*f,ae=W*f,q=(oe-Y)/2,K=(ae-W)/2;if(r.contain==="inside"){const pe=(-v.elem.margin.left-v.parent.padding.left+q)/f,ve=(v.parent.width-oe-v.parent.padding.left-v.elem.margin.left-v.parent.border.left-v.parent.border.right+q)/f;b.x=Math.max(Math.min(b.x,ve),pe);const fe=(-v.elem.margin.top-v.parent.padding.top+K)/f,me=(v.parent.height-ae-v.parent.padding.top-v.elem.margin.top-v.parent.border.top-v.parent.border.bottom+K)/f;b.y=Math.max(Math.min(b.y,me),fe)}else if(r.contain==="outside"){const pe=(-(oe-v.parent.width)-v.parent.padding.left-v.parent.border.left-v.parent.border.right+q)/f,ve=(q-v.parent.padding.left)/f;b.x=Math.max(Math.min(b.x,ve),pe);const fe=(-(ae-v.parent.height)-v.parent.padding.top-v.parent.border.top-v.parent.border.bottom+K)/f,me=(K-v.parent.padding.top)/f;b.y=Math.max(Math.min(b.y,me),fe)}}return r.roundPixels&&(b.x=Math.round(b.x),b.y=Math.round(b.y)),b}function p(a,c){const f={...t,...c},x={scale:u,opts:f};if(!f.force&&f.disableZoom)return x;let r=t.minScale,b=t.maxScale;if(f.contain){const v=ue(e),Y=v.elem.width/u,W=v.elem.height/u;if(Y>1&&W>1){const oe=v.parent.width-v.parent.border.left-v.parent.border.right,ae=v.parent.height-v.parent.border.top-v.parent.border.bottom,q=oe/Y,K=ae/W;t.contain==="inside"?b=Math.min(b,q,K):t.contain==="outside"&&(r=Math.max(r,q,K))}}return x.scale=Math.min(Math.max(a,r),b),x}function h(a,c,f,x){const r=k(a,c,u,f);return d!==r.x||m!==r.y?(d=r.x,m=r.y,A("panzoompan",r.opts,x)):{x:d,y:m,scale:u,isSVG:n,originalEvent:x}}function L(a,c,f){const x=p(a,c),r=x.opts;if(!r.force&&r.disableZoom)return;a=x.scale;let b=d,v=m;if(r.focal){const W=r.focal;b=(W.x/a-W.x/u+d*a)/a,v=(W.y/a-W.y/u+m*a)/a}const Y=k(b,v,a,{relative:!1,force:!0});return d=Y.x,m=Y.y,u=a,A("panzoomzoom",r,f)}function X(a,c){const f={...t,animate:!0,...c};return L(u*Math.exp((a?1:-1)*f.step),f)}function g(a){return X(!0,a)}function w(a){return X(!1,a)}function C(a,c,f,x){const r=ue(e),b={width:r.parent.width-r.parent.padding.left-r.parent.padding.right-r.parent.border.left-r.parent.border.right,height:r.parent.height-r.parent.padding.top-r.parent.padding.bottom-r.parent.border.top-r.parent.border.bottom};let v=c.clientX-r.parent.left-r.parent.padding.left-r.parent.border.left-r.elem.margin.left,Y=c.clientY-r.parent.top-r.parent.padding.top-r.parent.border.top-r.elem.margin.top;n||(v-=r.elem.width/u/2,Y-=r.elem.height/u/2);const W={x:v/b.width*(b.width*a),y:Y/b.height*(b.height*a)};return L(a,{...f,animate:!1,focal:W},x)}function T(a,c){a.preventDefault();const f={...t,...c,animate:!1},x=(a.deltaY===0&&a.deltaX?a.deltaX:a.deltaY)<0?1:-1,r=p(u*Math.exp(x*f.step/3),f).scale;return C(r,a,f,a)}function U(a){const c={...t,animate:!0,force:!0,...a};u=p(c.startScale,c).scale;const f=k(c.startX,c.startY,u,c);return d=f.x,m=f.y,A("panzoomreset",c)}let z,y,B,E,I,F;const P=[];function ee(a){if(st(a.target,t))return;Ce(P,a),M=!0,t.handleStartEvent(a),z=d,y=m,S("panzoomstart",{x:d,y:m,scale:u,isSVG:n,originalEvent:a},t);const c=Te(P);B=c.clientX,E=c.clientY,I=u,F=ge(P)}function te(a){if(!M||z===void 0||y===void 0||B===void 0||E===void 0)return;Ce(P,a);const c=Te(P),f=P.length>1;let x=u;if(f){F===0&&(F=ge(P));const r=ge(P)-F;x=p(r*t.step/80+I).scale,C(x,c,{animate:!1},a)}(!f||t.pinchAndPan)&&h(z+(c.clientX-B)/x,y+(c.clientY-E)/x,{animate:!1},a)}function $(a){P.length===1&&S("panzoomend",{x:d,y:m,scale:u,isSVG:n,originalEvent:a},t),et(P,a),M&&(M=!1,z=y=B=E=void 0)}let ne=!1;function l(){ne||(ne=!0,we("down",t.canvas?o:e,ee),we("move",document,te,{passive:!0}),we("up",document,$,{passive:!0}))}function R(){ne=!1,ye("down",t.canvas?o:e,ee),ye("move",document,te),ye("up",document,$)}return t.noBind||l(),{bind:l,destroy:R,eventNames:le,getPan:()=>({x:d,y:m}),getScale:()=>u,getOptions:()=>dt(t),handleDown:ee,handleMove:te,handleUp:$,pan:h,reset:U,resetStyle:i,setOptions:s,setStyle:(a,c)=>G(e,a,c),zoom:L,zoomIn:g,zoomOut:w,zoomToPoint:C,zoomWithWheel:T}}Ue.defaultOptions=He;const ht={class:"sketch-ruler"},vt=he({__name:"index",props:{showRuler:{type:Boolean,default:!0},eyeIcon:{},closeEyeIcon:{},scale:{default:1},rate:{default:1},thick:{default:16},palette:{},width:{default:1400},height:{default:800},paddingRatio:{default:.2},autoCenter:{type:Boolean,default:!0},shadow:{default:()=>({x:0,y:0,width:0,height:0})},lines:{default:()=>({h:[],v:[]})},isShowReferLine:{type:Boolean,default:!0},canvasWidth:{default:700},canvasHeight:{default:700},snapsObj:{default:()=>({h:[],v:[]})},snapThreshold:{default:5},gridRatio:{default:1},lockLine:{type:Boolean,default:!1},selfHandle:{type:Boolean,default:!1},showShadowText:{type:Boolean,default:!0},panzoomOption:{}},emits:["onCornerClick","update:scale","zoomchange","update:lockLine"],setup(e,{expose:t,emit:n}){Pe(l=>({"2e1e919e":ne.value}));const o=e,i=n,s=N(null),d=N(0),m=N(0);let u=0,M=0;const S=N(1),A=N(o.isShowReferLine),k=N(null),p=N("defaultCursor"),h=H(()=>({bgColor:"#f6f7f9",longfgColor:"#BABBBC",fontColor:"#7D8694",fontShadowColor:"#106ebe",shadowColor:"#e9f7fe",lineColor:"#51d6a9",lineType:"solid",lockLineColor:"#d4d7dc",hoverBg:"#000",hoverColor:"#fff",borderColor:"#eeeeef",...o.palette})),L=H(()=>({backgroundImage:A.value?`url(${o.eyeIcon??Je})`:`url(${o.closeEyeIcon??_e})`,width:o.thick+"px",height:o.thick+"px",borderRight:`1px solid ${h.value.borderColor}`,borderBottom:`1px solid ${h.value.borderColor}`})),X=H(()=>({background:h.value.bgColor,width:g.value+"px",height:w.value+"px"})),g=H(()=>o.width-o.thick),w=H(()=>o.height-o.thick),C=l=>{var R;(l.ctrlKey||l.metaKey)&&((R=k.value)==null||R.zoomWithWheel(l))},T=l=>{var R;const a=document.activeElement;a!=null&&a.closest(".monaco-editor")||(a==null?void 0:a.tagName)==="INPUT"||(a==null?void 0:a.tagName)==="TEXTAREA"||(a==null?void 0:a.getAttribute("contenteditable"))==="true"||l.key===" "&&(p.value="grabCursor",(R=k.value)==null||R.bind(),l.preventDefault())},U=l=>{var R;const a=document.activeElement;a!=null&&a.closest(".monaco-editor")||(a==null?void 0:a.tagName)==="INPUT"||(a==null?void 0:a.tagName)==="TEXTAREA"||(a==null?void 0:a.getAttribute("contenteditable"))==="true"||l.key===" "&&((R=k.value)==null||R.destroy(),p.value="defaultCursor")};Ee(()=>{if(B(),!o.selfHandle&&s.value){const l=s.value.parentElement;if(!l)return;l.addEventListener("wheel",C),document.addEventListener("keydown",T),document.addEventListener("keyup",U)}});const z=l=>({noBind:!0,startScale:l,startX:u,startY:M,smoothScroll:!0,canvas:!0,...o.panzoomOption}),y=l=>{const{scale:R,dimsOut:a}=l.detail;if(a){i("update:scale",R),S.value=R;const c=(a.parent.left-a.elem.left)/R,f=(a.parent.top-a.elem.top)/R;d.value=c,i("zoomchange",l.detail),m.value=f}},B=()=>{if(s.value=document.querySelector(".canvasedit"),s.value){let l=o.scale;o.autoCenter&&(l=E()),k.value=Ue(s.value,z(l)),s.value&&s.value.addEventListener("panzoomchange",y)}},E=()=>{const l=g.value*(1-o.paddingRatio)/o.canvasWidth,R=w.value*(1-o.paddingRatio)/o.canvasHeight,a=Math.min(l,R);return u=g.value/2-o.canvasWidth/2,a<1?M=(o.canvasHeight*a/2-o.canvasHeight/2)/a-(o.canvasHeight*a-w.value)/a/2:a>1?M=(o.canvasHeight*a-o.canvasHeight)/2/a+(w.value-o.canvasHeight*a)/a/2:M=0,a},I=()=>{var l;return(l=k.value)==null?void 0:l.reset()},F=()=>{var l;return(l=k.value)==null?void 0:l.zoomIn()},P=()=>{var l;return(l=k.value)==null?void 0:l.zoomOut()},ee=()=>{var l;(l=k.value)==null||l.setOptions(z(o.scale))},te=()=>{A.value=!A.value,i("onCornerClick",A.value)},$=l=>{i("update:lockLine",l)},ne=H(()=>o.thick+"px");return Z([()=>o.isShowReferLine],()=>{A.value=o.isShowReferLine}),Z([()=>o.canvasWidth,()=>o.canvasHeight,()=>o.width,()=>o.height],()=>{B()}),Z(()=>o.panzoomOption,()=>{ee()},{deep:!0}),t({initPanzoom:B,panzoomInstance:k,reset:I,zoomIn:F,zoomOut:P,cursorClass:p}),(l,R)=>(D(),Q("div",ht,[Me(l.$slots,"btn",{reset:I,zoomIn:F,zoomOut:P}),j("div",{class:be(["canvasedit-parent",p.value]),style:V(X.value)},[j("div",{class:be(["canvasedit",p.value])},[Me(l.$slots,"default")],2)],6),J(xe(Be,{style:V({marginLeft:l.thick+"px",width:g.value+"px"}),vertical:!1,width:l.width,height:l.thick,"is-show-refer-line":A.value,thick:l.thick,start:d.value,"start-other":m.value,lines:l.lines,"select-start":l.shadow.x,"snap-threshold":l.snapThreshold,"snaps-obj":l.snapsObj,"select-length":l.shadow.width,scale:S.value,palette:h.value,"canvas-width":l.canvasWidth,"show-shadow-text":l.showShadowText,"canvas-height":l.canvasHeight,rate:l.rate,"grid-ratio":l.gridRatio,"lock-line":l.lockLine,onChangeLineState:$},null,8,["style","width","height","is-show-refer-line","thick","start","start-other","lines","select-start","snap-threshold","snaps-obj","select-length","scale","palette","canvas-width","show-shadow-text","canvas-height","rate","grid-ratio","lock-line"]),[[_,l.showRuler]]),J(xe(Be,{style:V({marginTop:l.thick+"px",top:0,height:w.value+"px"}),vertical:!0,width:l.thick,height:l.height,"is-show-refer-line":A.value,thick:l.thick,start:m.value,"start-other":d.value,lines:l.lines,"select-start":l.shadow.y,"select-length":l.shadow.height,"snap-threshold":l.snapThreshold,"snaps-obj":l.snapsObj,scale:S.value,palette:h.value,"canvas-width":l.canvasWidth,"canvas-height":l.canvasHeight,"show-shadow-text":l.showShadowText,rate:l.rate,"grid-ratio":l.gridRatio,"lock-line":l.lockLine,onChangeLineState:$},null,8,["style","width","height","is-show-refer-line","thick","start","start-other","lines","select-start","select-length","snap-threshold","snaps-obj","scale","palette","canvas-width","canvas-height","show-shadow-text","rate","grid-ratio","lock-line"]),[[_,l.showRuler]]),J(j("a",{class:"corner",style:V(L.value),onClick:te},null,4),[[_,l.showRuler]])]))}});export{vt as f};