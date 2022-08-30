"use strict";var z=Object.defineProperty;var L=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var O=(e,t,o)=>t in e?z(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,V=(e,t)=>{for(var o in t||(t={}))T.call(t,o)&&O(e,o,t[o]);if(L)for(var o of L(t))$.call(t,o)&&O(e,o,t[o]);return e};/*!vue3-sketch-ruler v1.3.52022年8月Tue Aug 30 2022 22:27:22 GMT+0800 (中国标准时间)制作*/Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});var u=require("vue-demi"),n=require("vue");var S=(e,t)=>{for(const[o,s]of t)e[o]=s;return e};const M=u.defineComponent({name:"LineRuler",props:{scale:Number,thick:Number,palette:Object,index:Number,start:Number,vertical:Boolean,value:Number,isShowReferLine:Boolean},emits:["onMouseDown","onRelease","onRemove"],setup(e,{emit:t}){const o=u.ref(0),s=u.ref(!0);u.onMounted(()=>{o.value=e.value});const h=l=>{s.value=l>=0},d=u.computed(()=>{const l=(o.value-e.start)*e.scale;h(l);const v=l+"px";return e.vertical?{top:v}:{left:v}}),r=u.computed(()=>{var f;const l=`1px solid ${(f=e.palette)==null?void 0:f.lineColor}`,v=e.vertical?{borderTop:l}:{borderLeft:l},m=e.isShowReferLine?e.vertical?"ns-resize":"ew-resize":"none";return V({cursor:m},v)}),c=u.computed(()=>e.vertical?{left:e.thick+"px"}:{top:e.thick+"px"});return{startValue:o,showLine:s,offset:d,borderCursor:r,actionStyle:c,handleDown:l=>{const v=e.vertical?l.clientY:l.clientX,m=o.value;t("onMouseDown");const f=y=>{const g=e.vertical?y.clientY:y.clientX,b=Math.round(m+(g-v)/e.scale);o.value=b},p=()=>{t("onRelease",o.value,e.index),document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",p)};document.addEventListener("mousemove",f),document.addEventListener("mouseup",p)},handleRemove:()=>{t("onRemove",e.index)}}}}),Q={class:"value"};function F(e,t,o,s,h,d){return n.withDirectives((n.openBlock(),n.createElementBlock("div",{class:"line",style:n.normalizeStyle([e.offset,e.borderCursor]),onMousedown:t[1]||(t[1]=(...r)=>e.handleDown&&e.handleDown(...r))},[n.createElementVNode("div",{class:"action",style:n.normalizeStyle(e.actionStyle)},[n.createElementVNode("span",{class:"del",onClick:t[0]||(t[0]=(...r)=>e.handleRemove&&e.handleRemove(...r))},"\xD7"),n.createElementVNode("span",Q,n.toDisplayString(e.startValue),1)],4)],36)),[[n.vShow,e.showLine]])}var K=S(M,[["render",F],["__scopeId","data-v-074b3d94"]]);const Y=e=>e<=.25?40:e<=.5?20:e<=1?10:e<=2?5:e<=4?2:1,D=.83,P=(e,t,o,s,h,d)=>{const{scale:r,width:c,height:i,ratio:a,palette:l}=h,{bgColor:v,fontColor:m,shadowColor:f,longfgColor:p,shortfgColor:y}=l;if(e.scale(a,a),e.clearRect(0,0,c,i),e.fillStyle=v,e.fillRect(0,0,c,i),s){const C=(o-t)*r,A=s*r;e.fillStyle=f,d?e.fillRect(C,0,A,i*3/8):e.fillRect(0,C,c*3/8,A)}const g=Y(r),b=g*r,N=g*10,R=N*r,k=Math.floor(t/g)*g,B=Math.floor(t/N)*N,I=(k-t)/g*b,X=(B-t)/N*R,E=t+Math.ceil((d?c:i)/r);e.beginPath(),e.fillStyle=m,e.strokeStyle=p;for(let C=B,A=0;C<E;C+=N,A++){const w=X+A*R+.5;d?e.moveTo(w,0):e.moveTo(0,w),e.save(),d?e.translate(w,i*.4):e.translate(c*.4,w),d||e.rotate(-Math.PI/2),e.scale(D/a,D/a),e.fillText(C.toString(),4*a,7*a),e.restore(),d?e.lineTo(w,i*9/16):e.lineTo(c*9/16,w)}e.stroke(),e.closePath(),e.beginPath(),e.strokeStyle=y;for(let C=k,A=0;C<E;C+=g,A++){const w=I+A*b+.5;d?e.moveTo(w,0):e.moveTo(0,w),C%N!=0&&(d?e.lineTo(w,i*1/4):e.lineTo(c*1/4,w))}e.stroke(),e.closePath(),e.setTransform(1,0,0,1,0,0)},q=u.defineComponent({name:"CanvasRuler",props:{showIndicator:Boolean,valueNum:Number,scale:Number,ratio:Number,palette:Object,vertical:Boolean,start:Number,width:Number,height:Number,selectStart:Number,selectLength:Number},emits:["onAddLine","update:showIndicator","update:valueNum"],setup(e,{emit:t}){const o=u.reactive({canvasContext:null});let s=1;const h=u.ref(null);u.onMounted(()=>{s=e.ratio||window.devicePixelRatio||1,d(),r(s),c(s)});const d=()=>{o.canvasContext=h.value&&h.value.getContext("2d")},r=a=>{if(h.value){h.value.width=e.width*a,h.value.height=e.height*a;const l=o.canvasContext;l&&(l.font=`${12*a}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`,l.lineWidth=1,l.textBaseline="middle")}},c=a=>{const l={scale:e.scale,width:e.width,height:e.height,palette:e.palette,ratio:a};o.canvasContext&&P(o.canvasContext,e.start,e.selectStart,e.selectLength,l,!e.vertical)};return u.watch(()=>e.start,()=>c(s)),u.watch([()=>e.width,()=>e.height],()=>{r(s),c(s)}),{handle:(a,l)=>{const v=(p,y,g)=>Math.round(y+p/g),m=e.vertical?a.offsetY:a.offsetX,f=v(m,e.start,e.scale);switch(l){case"click":t("onAddLine",f);break;case"enter":t("update:valueNum",f),t("update:showIndicator",!0);break;default:t("update:valueNum",f);break}},canvas:h}}});function G(e,t,o,s,h,d){return n.openBlock(),n.createElementBlock("canvas",{ref:"canvas",class:"ruler",onClick:t[0]||(t[0]=r=>e.handle(r,"click")),onMouseenter:t[1]||(t[1]=r=>e.handle(r,"enter")),onMousemove:t[2]||(t[2]=r=>e.handle(r,"move")),onMouseleave:t[3]||(t[3]=r=>e.$emit("update:showIndicator",!1))},null,544)}var H=S(q,[["render",G]]);const W={scale:Number,ratio:Number,thick:Number,palette:Object,vertical:{type:Boolean,default:!0},width:{type:Number,default:200},height:{type:Number,default:200},start:{type:Number,default:0},lines:{type:Array,default:()=>[]},selectStart:{type:Number},selectLength:{type:Number},isShowReferLine:{type:Boolean}};const Z=u.defineComponent({name:"RulerWrapper",components:{CanvasRuler:H,RulerLine:K},props:W,setup(e){const t=u.ref(!1),o=u.ref(0),s=u.computed(()=>e.vertical?"v-container":"h-container"),h=u.computed(()=>{const a={width:`calc(100% - ${e.thick}px)`,height:`${e.thick+1}px`,left:`${e.thick}px`},l={width:`${e.thick&&e.thick+1}px`,height:`calc(100% - ${e.thick}px)`,top:`${e.thick}px`};return e.vertical?l:a}),d=u.computed(()=>{var m;const a=(o.value-e.start)*e.scale;let l="top",v="borderLeft";return l=e.vertical?"top":"left",v=e.vertical?"borderBottom":"borderLeft",{[l]:a+"px",[v]:`1px solid ${(m=e.palette)==null?void 0:m.lineColor}`}}),r=a=>{e.lines.push(a)},c=(a,l)=>{const v=a-e.start,m=(e.vertical?e.height:e.width)/e.scale;v<0||v>m?i(l):e.lines[l]=a},i=a=>{e.lines.splice(a,1)};return{showIndicator:t,valueNum:o,rwClassName:s,rwStyle:h,indicatorStyle:d,handleNewLine:r,handleLineRelease:c,handleLineRemove:i}}}),j={class:"lines"},J={class:"value"};function _(e,t,o,s,h,d){const r=n.resolveComponent("CanvasRuler"),c=n.resolveComponent("RulerLine");return n.openBlock(),n.createElementBlock("div",{class:n.normalizeClass(e.rwClassName),style:n.normalizeStyle(e.rwStyle)},[n.createVNode(r,{vertical:e.vertical,scale:e.scale,width:e.width,height:e.height,start:e.start,ratio:e.ratio,"select-start":e.selectStart,"select-length":e.selectLength,palette:e.palette,valueNum:e.valueNum,"onUpdate:valueNum":t[0]||(t[0]=i=>e.valueNum=i),showIndicator:e.showIndicator,"onUpdate:showIndicator":t[1]||(t[1]=i=>e.showIndicator=i),onOnAddLine:e.handleNewLine},null,8,["vertical","scale","width","height","start","ratio","select-start","select-length","palette","valueNum","showIndicator","onOnAddLine"]),n.withDirectives(n.createElementVNode("div",j,[(n.openBlock(!0),n.createElementBlock(n.Fragment,null,n.renderList(e.lines,(i,a)=>(n.openBlock(),n.createBlock(c,{key:i+a,index:a,value:i>>0,scale:e.scale,start:e.start,thick:e.thick,palette:e.palette,vertical:e.vertical,"is-show-refer-line":e.isShowReferLine,onOnRemove:e.handleLineRemove,onOnRelease:e.handleLineRelease},null,8,["index","value","scale","start","thick","palette","vertical","is-show-refer-line","onOnRemove","onOnRelease"]))),128))],512),[[n.vShow,e.isShowReferLine]]),n.withDirectives(n.createElementVNode("div",{class:"indicator",style:n.normalizeStyle(e.indicatorStyle)},[n.createElementVNode("div",J,n.toDisplayString(e.valueNum),1)],4),[[n.vShow,e.showIndicator]])],6)}var x=S(Z,[["render",_],["__scopeId","data-v-5cc064d4"]]);const ee="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAopJREFUOE/FlE9IVEEcx7+/N9ouds1Mu0QUSFZYdIgoUqQoKPBQHsKozpXE7jbTO/U8xLJvn6usBHWQ6hBFXupSkQeVbh0KJEPp0sH+eLGTsKs77xcj78m0ax0E8cHjzZv5zef3/c33xxA24KENYGJzoEEQbNNaN4Zh2OQ4znwYhr9c1/39vwrXVDo0NNS0tLR0GYB5D64BmAMwzMyvlFKz1es10Hw+f4mZ7wHYBeA9gNdENFepVOaEEM3M3OI4Thczn41gt6WUgQ3+C+r7/h0AWQD3mXnYqPA8L9nQ0HCemduIaFpKOWoAhUJhT6VSuQXgOjP3K6W8GLwKzeVyp4jonR0QBEErM48w8zFLyayUsjX+z+VyHhHdZebTSqkxM78CHRgYOKS1/ghgVErZY214RkQ7ADyRUj72ff8qgCtmXUrZGcf5vv8CwEUhxOF0Ov1pBRpla5dSdseBhUJhpznH6tIsZb1KqacW+BGArUaUXX63UuplHJTNZjuEEONSyhozfd/n6mQ1RkXZL2itz7mu+80EDA4ONi8vL/8AcM2UbikyR2BU9cSmmTU70YqKIAj2hWFo2uenlHK/BRg3Y2aeNO5GyU8S0ZbFxcUuz/NKEXAGQKPjOCcymcyX1dIi8DSAiWQyeaavr68cbSgCuBknYubnQoj+TCYzUywWE6VS6S2ADsdx2gxw1X3L7SNENMbMnwE8qK+vf5NKpRaMaeVyeW8ikfiaSqW+R7BuZr5BRMe11p2u607U9Gk8kc/ntzPzQwCmExYATDLzVBiGE0KIowAOADDf3QA+aK2VDaxRajto3K+rq+tl5nYAzQBamHmeiOYBTGmtR6ph/1Rqg9c73pz7dD1qN0TpHyNQRCUDJXrAAAAAAElFTkSuQmCC",te="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAjtJREFUOE/NlD9oFEEUxn9v9ghC0hpRUogIAUmniGAT/5Q2FrETPSNRJILg7RwimI0ox85eQFCEBGIUO1PYpFM0jSConQoBEZGgGPsgl+w+2eM2bC57SopAFqYZ3v7m+977ZoQt+GQLmGxPaBiGgYiMWWvXBHZUGoZhH3BERPYC+4F+4Keq/urt7b1RLpf/ZEBVHa9Wq0HWyg3QKIoGVPU8cA7wgK/pUtXPQJ8xZk+pVBpuNBqXUoUiEvi+P56fzTpo6+SbwHNg1lo7WzTITGEKXFlZeeB53tVCpa3CK8AFa+1cBgvD8LKIXAQOJkkyICJDeYVBEJS6u7s/qeoLa+1o+l9TqXNuBLhmjDlbqVQ+5ICjInIfOBPH8W9jzGCR5YmJiRNxHM+papgqzqDvgSlr7VTernPuO3An3c9bBt74vv+yrdaKyLDv+/1Sq9UGPc97nY9EVuycU2AQOA7cAm4Dr4D5TvVxHB9rKo2iaEFVp621Ln96FEUngaOqGmSxabVqsh3a2h+x1h5qQjNrae/yE4+iaCwDJkky73neTuBZe129Xk+H+BS4l7ZqLVIZ2BhzuFKpvMsDVXXWGPMxFdAedOfcKeCRqj7MYrUhpz09PfXl5eXrectFWXXODQHpOq2qd/95o/JXr6ura3J1dXU6SZIfwKKIHAD2tVYMPBGRx77vN10UXtO85fTkmZmZHUtLSzUR2QXsBhaAL6r6DXhbrVYXi1yss59GqOgub/bN3Z7v6X/tb9Zmp/q/kN8s+lJb8oEAAAAASUVORK5CYII=",ne={eyeIcon:{type:String},closeEyeIcon:{type:String},scale:{type:Number,default:1},ratio:{type:Number},thick:{type:Number,default:16},palette:Object,startX:{type:Number},startY:{type:Number,default:0},width:{type:Number,default:200},height:{type:Number,default:200},shadow:{type:Object,default:()=>({x:0,y:0,width:0,height:0})},lines:{type:Object,default:()=>({h:[],v:[]})},isShowReferLine:{type:Boolean,default:!0}};const oe=u.defineComponent({name:"SketchRule",components:{RulerWrapper:x},props:ne,emits:["onCornerClick","handleLine"],setup(e,{emit:t}){let o=u.ref(!0);o.value=e.isShowReferLine;const s=u.computed(()=>{function r(i,a){return Object.keys(i).forEach(l=>{l&&i.hasOwnProperty(l)&&(typeof a.key=="object"?i[l]=r(i[l],a[l]):a.hasOwnProperty(l)&&(i[l]=a[l]))}),i}return r({bgColor:"rgba(225,225,225, 0)",longfgColor:"#BABBBC",shortfgColor:"#C8CDD0",fontColor:"#7D8694",shadowColor:"#E8E8E8",lineColor:"#EB5648",borderColor:"#DADADC",cornerActiveColor:"rgb(235, 86, 72, 0.6)",menu:{bgColor:"#fff",dividerColor:"#DBDBDB",listItem:{textColor:"#415058",hoverTextColor:"#298DF8",disabledTextColor:"rgba(65, 80, 88, 0.4)",bgColor:"#fff",hoverBgColor:"#F2F2F2"}}},e.palette||{})}),h=u.computed(()=>({backgroundImage:o.value?`url(${e.eyeIcon||ee})`:`url(${e.closeEyeIcon||te})`,width:e.thick+"px",height:e.thick+"px",borderRight:`1px solid ${s.value.borderColor}`,borderBottom:`1px solid ${s.value.borderColor}`}));return{showReferLine:o,paletteCpu:s,cornerStyle:h,onCornerClick:r=>{o.value=!o.value,t("handleCornerClick",o.value)}}}}),le={id:"mb-ruler",class:"style-ruler mb-ruler"};function ae(e,t,o,s,h,d){const r=n.resolveComponent("RulerWrapper");return n.openBlock(),n.createElementBlock("div",le,[n.createVNode(r,{vertical:!1,width:e.width,height:e.thick,"is-show-refer-line":e.showReferLine,thick:e.thick,ratio:e.ratio,start:e.startX,lines:e.lines.h,"select-start":e.shadow.x,"select-length":e.shadow.width,scale:e.scale,palette:e.paletteCpu},null,8,["width","height","is-show-refer-line","thick","ratio","start","lines","select-start","select-length","scale","palette"]),n.createVNode(r,{vertical:!0,width:e.thick,height:e.height,"is-show-refer-line":e.showReferLine,thick:e.thick,ratio:e.ratio,start:e.startY,lines:e.lines.v,"select-start":e.shadow.y,"select-length":e.shadow.height,scale:e.scale,palette:e.paletteCpu},null,8,["width","height","is-show-refer-line","thick","ratio","start","lines","select-start","select-length","scale","palette"]),n.createElementVNode("a",{class:"corner",style:n.normalizeStyle(e.cornerStyle),onClick:t[0]||(t[0]=(...c)=>e.onCornerClick&&e.onCornerClick(...c))},null,4)])}var U=S(oe,[["render",ae]]);exports.SketchRule=U;exports.default=U;