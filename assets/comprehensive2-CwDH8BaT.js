import{d as W,r as a,a as C,c as h,b as f,e,t as A,g as c,i as F,j as q,w as b,u as y,k as G,n as x,o as p}from"./index-BWyYrWVH.js";import{b as J}from"./bg-ByMLKr0n.js";import{f as K}from"./index-BLMazZqo.js";/* empty css              */const Q={class:"demo"},X={class:"top font16"},Y={class:"scale mr10"},ee=["value"],te=["value"],oe=["value"],ne=["src"],se={class:"btns"},ae=["onClick"],le=["onClick"],ie=["onClick"],de=W({__name:"comprehensive2",setup(re){const k=a(1470),g=a(800),d=a(1e3),v=a(500),w=a(0);a(1);const l=a(),i=a(!0),u=C({maxScale:3,minScale:.3,disablePan:!1,disableZoom:!1,contain:"none",handleStartEvent:o=>{o.preventDefault(),console.log("handleStartEvent",o)}}),m=a(!1),r=a({h:[0,100,200],v:[130]}),B=()=>{l.value&&l.value.zoomOut()},S=()=>{i.value=!i.value},z=()=>{l.value&&l.value.reset()},_=()=>{n.isBlack=!n.isBlack,w.value++},n=C({scale:1,isBlack:!1,lines:{h:[0,250],v:[0,500]},thick:20,shadow:{x:0,y:0,width:300,height:300},isShowRuler:!0,isShowReferLine:!0}),R=h(()=>({width:`${k.value}px`,height:`${g.value}px`})),L=h(()=>n.isBlack?{bgColor:"transparent",hoverBg:"#fff",hoverColor:"#000",longfgColor:"#BABBBC",fontColor:"#DEDEDE",shadowColor:"#525252",lineColor:"#51d6a9",borderColor:"#B5B5B5"}:{bgColor:"transparent",lineColor:"#51d6a9",lineType:"dashed"}),I=h(()=>Number(n.scale).toFixed(1)),M=h(()=>({width:`${d.value}px`,height:`${v.value}px`})),E=o=>{n.scale=o.target.value*1,l.value&&l.value.panzoomInstance.zoom(n.scale)},$=o=>{console.log("handleCornerClick",o)},j=o=>{console.log("zoomchange",o)},D=()=>{n.isShowReferLine=!n.isShowReferLine,console.log(n.isShowReferLine,"state.isShowReferLine")},N=o=>{const t=o.target.value.split(",");r.value.h=t.map(s=>Number(s))},O=o=>{const t=o.target.value.split(",");r.value.v=t.map(s=>Number(s))},V=o=>{u.disableZoom=o.target.checked},P=o=>{u.disablePan=o.target.checked},T=o=>{u.contain=o.target.checked?"inside":"none"},Z=()=>{n.shadow.x=Math.random()*d.value,n.shadow.y=Math.random()*v.value};return(o,t)=>(p(),f("div",Q,[e("div",X,[e("div",Y," 缩放比:"+A(I.value),1),i.value?(p(),f("button",{key:0,class:"mr10 font16",onClick:t[0]||(t[0]=s=>i.value=!1)},"隐藏规尺")):(p(),f("button",{key:1,class:"mr10 font16",onClick:S},"显示规尺")),e("button",{class:"mr10 font16",onClick:D},"辅助线开关"),e("button",{class:"mr10 font16",onClick:t[1]||(t[1]=s=>m.value=!0)},"锁定参考线"),e("button",{class:"mr10 font16",onClick:Z},"模拟阴影切换"),e("button",{class:"mr10 font16",onClick:_},"主题切换"),e("button",{class:"mr10 font16",onClick:c(z,["stop"])},"还原"),e("button",{class:"mr10 font16",onClick:c(B,["stop"])},"缩小"),t[4]||(t[4]=e("span",null,"禁止缩放",-1)),e("input",{type:"checkbox",class:"switch",onChange:V},null,32),t[5]||(t[5]=e("span",null,"禁止移动",-1)),e("input",{type:"checkbox",class:"switch mr10",onChange:P},null,32),t[6]||(t[6]=e("span",null,"框内移动",-1)),e("input",{type:"checkbox",class:"switch mr10",onChange:T},null,32),e("input",{class:"mr10 font16",value:n.scale,type:"range",min:"0.3",max:"3",step:"0.1",defaultValue:"1",onInput:E},null,40,ee),t[7]||(t[7]=e("div",{class:"mr10"}," 吸附横线: ",-1)),e("input",{class:"mr10",style:{width:"90px"},value:r.value.h,onBlur:N},null,40,te),t[8]||(t[8]=e("div",{class:"mr10"}," 吸附纵线: ",-1)),e("input",{class:"mr10",style:{width:"90px"},value:r.value.v,onBlur:O},null,40,oe),t[9]||(t[9]=e("a",{href:"https://github.com/kakajun/vue3-sketch-ruler",target:"_blank",rel:"noopener noreferrer"},[e("i",{class:"fas fa-external-link-alt"}),F(" git源码 ")],-1))]),e("div",{class:G(["wrapper",[n.isBlack?"balckwrapper":"whitewrapper"]]),style:x(R.value)},[(p(),q(y(K),{key:w.value,ref_key:"sketchruleRef",ref:l,scale:n.scale,"onUpdate:scale":t[2]||(t[2]=s=>n.scale=s),"lock-line":m.value,"onUpdate:lockLine":t[3]||(t[3]=s=>m.value=s),thick:n.thick,width:k.value,"show-ruler":i.value,height:g.value,palette:L.value,"snaps-obj":r.value,shadow:n.shadow,"canvas-width":d.value,"canvas-height":v.value,"panzoom-option":u,"is-show-refer-line":n.isShowReferLine,lines:n.lines,onOnCornerClick:$,onZoomchange:j},{default:b(()=>[e("div",{"data-type":"page",style:x(M.value)},[e("img",{class:"img-style",src:y(J),alt:""},null,8,ne)],4)]),btn:b(({reset:s,zoomIn:H,zoomOut:U})=>[e("div",se,[e("button",{onClick:c(s,["stop"])},"还原",8,ae),e("button",{onClick:c(H,["stop"])},"放大",8,le),e("button",{onClick:c(U,["stop"])},"缩小",8,ie)])]),_:1},8,["scale","lock-line","thick","width","show-ruler","height","palette","snaps-obj","shadow","canvas-width","canvas-height","panzoom-option","is-show-refer-line","lines"]))],6)]))}});export{de as default};