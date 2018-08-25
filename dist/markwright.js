!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.markwright=t():e.markwright=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t){e.exports=require("react")},function(e,t){e.exports=require("simple-markdown")},function(e,t){e.exports=require("react-promise")},function(e,t){e.exports=require("react-virtualized")},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n(3),s=n(1);class c{constructor(){this.elements=[]}get size(){return this.elements.length}get height(){const e=e=>e?parseInt(e,10):0;let[t,n]=[0,0];for(const o of this.elements){const{height:r}=o.getBoundingClientRect(),s=getComputedStyle(o),c={bottom:e(s.marginBottom),top:e(s.marginTop)};t+=r+Math.max(n,c.top),n=c.bottom}return t}add(e){this.elements.push(e)}}class i{constructor(){this.regions=[]}add(e){this.regions.push(e)}}function a(e,t,n,o={type:"text",content:""}){return{content:[{content:o,id:`mw-page-${e}-header`,type:"mw-header"},{content:[{content:t,id:`mw-page-${e}-content`,type:"mw-content"},{content:n.map(e=>Object.assign({},e,{inline:!1})),id:`mw-page-${e}-footnotes`,type:"mw-footnotes"}],id:`mw-page-${e}-body`,type:"mw-body"}],id:e,type:"mw-page"}}function l(e,t=[],n=2){let o=[];for(const t of e){let e=o[o.length-1];"heading"===t.type&&1===t.level&&(e&&e.title||!e?(o.push({content:[],id:o.length+1,title:t.content,type:"mw-section"}),e=o[o.length-1]):e&&(e.title=t.content)),e?e.content.push(t):o.push({content:[t],id:1,type:"mw-section"})}if(t.length){let e=1;o=o.map((o,s)=>{const c=[],i=[];let l=0;for(const e of t[s].regions){const t=[];for(const n of e.elements){let e=!1;for(;!e;){const n=o.content[l];if(n){if(t.push(n),l++,"newline"===n.type)continue;e=!0}else e=!0}}i.push(t)}for(;i.length;){const e=[];for(let t=0;t<n;t++)e.push(i.shift());c.push(e)}return o.content=c.map((t,n)=>{const s=[];let c=1;n++,function e(t,n){if(t){if(Array.isArray(t))for(const o of t)e(o,n);if(n(t),t.content)for(const o of t.content)e(o,n)}}(t,e=>{"mw-footnote"===e.type&&(e.key=`mw-page-${n}-footnote-${c++}`,s.push(Object.assign({},e)),e.inline=!0)});const i=t.filter(e=>!!e).map((e,o)=>(r=`mw-page-${n}-column-${o+1}`,t=e,{content:t,id:r,type:"mw-column"})).reduce((e,t,o)=>0===o?[t]:[...e,{id:`mw-page-${n}-column-separator-${o}`,type:"mw-column-separator"},t],[]);return a(e++,i,s,o.title)}),o})}else{let e=0;o=o.map(t=>(e++,t.content=[a(e,{content:t.content,id:`mw-page-${e}-column-1`,type:"mw-column"},[],t.title)],t))}var r,s;return o}var d=n(2),m=n.n(d);function u(e,t="div"){return{react:(n,r,s)=>o.createElement(t,{children:r(n.content),className:e.replace("mw-",""),key:n.id||s.key})}}var p=({highlight:e})=>Object.assign({},s.defaultRules,{blockQuote:Object.assign({},s.defaultRules.blockQuote,{match:Object(s.blockRegex)(/^( *>[^\n]+(\n[^\n]+)*\n*)+\n/)}),codeBlock:Object.assign({},s.defaultRules.codeBlock,{react(t,n,r){const s=e?e(t.content,t.lang):Promise.resolve(t.content);return o.createElement("div",{key:r.key},o.createElement(m.a,{promise:s,pending:()=>o.createElement("pre",null,o.createElement("code",null,t.content)),then:e=>o.createElement("pre",{className:`lang lang-${t.lang}`},o.createElement("code",{dangerouslySetInnerHTML:{__html:e}}))}))}}),heading:Object.assign({},s.defaultRules.heading,{match:Object(s.blockRegex)(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)}),mw:{react:(e,t)=>o.createElement("div",{className:"mw",key:`mw-${e.id}`},t(e.content))},"mw-block":{match:Object(s.blockRegex)(/^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n *)+\n/),order:0,parse:(e,t,n)=>(n.blocks||(n.blocks=1),{block:e[2],content:t(`\n\n${e[3]}\n\n`,{inline:!1},n),id:n.blocks++}),react:(e,t)=>o.createElement("div",{key:e.id,className:`block ${e.block}`},t(e.content))},"mw-body":u("mw-body"),"mw-break":{match:Object(s.blockRegex)(/^\{\.break\}/),order:0,parse:(e,t,n)=>(n.breaks||(n.breaks=1),{id:n.breaks++}),react:e=>o.createElement("div",{key:`mw-break-${e.id}`,className:"break"})},"mw-column":u("mw-column"),"mw-column-separator":{react:e=>o.createElement("hr",{key:e.id,className:"column-separator"})},"mw-content":u("mw-content"),"mw-footnote":{match:Object(s.inlineRegex)(/^\^\[(.+?)\]/),order:s.defaultRules.link.order-1,parse:(e,t,n)=>(n.footnotes||(n.footnotes=1),{content:t(e[1],n),id:n.footnotes++}),react:(e,t)=>e.inline?o.createElement("sup",{key:`${e.id}-inline`},e.id):o.createElement("span",{key:e.id,className:"footnote"},e.id,". ",t(e.content))},"mw-footnotes":{react(e,t){const n=`footnotes ${e.content&&e.content.length?"":"empty"}`;return o.createElement("div",{key:`mw-footnote-${e.id}`,className:n},t(e.content))}},"mw-header":u("mw-header"),"mw-page":{react(e,t){const n=e.id%2?"odd":"even";return o.createElement("div",{key:`mw-page-${e.id}`,className:`page page-${e.id} ${n}`},o.createElement(o.Fragment,null,t(e.content),o.createElement("div",{key:`mw-page-${e.id}-pagination`,className:"pagination"},e.id)))}},"mw-section":{react:(e,t)=>o.createElement("div",{key:`mw-section-${e.id}`,className:`section section-${e.id}`},t(e.content))},paragraph:Object.assign({},s.defaultRules.paragraph,{react:(e,t,n)=>o.createElement("p",{key:`p-${n.key}`},t(e.content))})});class h extends o.Component{constructor(){super(...arguments),this.state={content:this.props.value,flowed:!1,regions:[],style:"\n      .unflowed .footnote { display: block; }\n    "}}static react(e,t,n,c,i){const a=this.rules?this.rules:this.rules=p({highlight:c}),d=l(Object(s.parserFor)(a)(e),t,n),m=d.reduce((e,t)=>e+t.content.length,0)||1,u=this.ref?this.ref.clientWidth:window.innerWidth,h=this.ref?this.ref.clientHeight:window.innerHeight;return o.createElement("div",{className:"section"},o.createElement(r.List,{width:u,height:h,rowHeight:i.height+64,rowCount:m,rowRenderer:function(e,t,n){const r=Object(s.ruleOutput)(n,"react"),c=Object(s.reactFor)(r);return({key:n,index:r,style:s})=>{let i=0;const a=t.find(e=>(i+=e.content.length)>r),l=a.content[r-i+a.content.length];return o.createElement("div",{key:n,style:Object.assign({},s,{left:(window.innerWidth-e.width)/2,marginBottom:32,top:s.top+64})},c(l))}}(i,d,a)}))}static getDerivedStateFromProps(e,t){return e.value!==t.content?{content:e.value,flowed:!1,regions:[]}:e.flowed?{flowed:!0,regions:e.regions}:null}static flow(e){const t=[];for(const n of this.ref.querySelectorAll(".page")){const o=new i,r=n.querySelector(".column");if(r){const n=r.getBoundingClientRect().height-48,s=[].slice.call(r.children);let i=new c;for(const t of s)t.classList.contains("break")?(o.add(i),(i=new c).add(t)):(i.add(t),!e&&i.height>n&&(i.elements.pop(),o.add(i),(i=new c).add(t)));o.add(i),t.push(o)}}return t}reflow(){this.state.flowed||this.props.onFlow(h.flow(this.props.manual))}componentDidUpdate(){this.reflow()}componentDidMount(){this.reflow()}render(){return o.createElement("div",{className:this.state.flowed?"":"unflowed",ref:e=>h.ref=e},o.createElement("style",{type:"text/css"},this.state.style),h.react(this.state.content||" ",this.state.regions,this.props.columns,this.props.highlight,this.props.page))}}t.default=class extends o.Component{constructor(){super(...arguments),this.state={flowed:!1,regions:[]}}config(e,t){return this.props.config&&(e=>void 0!==e&&null!==e)(this.props.config[e])?this.props.config[e]:t}render(){return o.createElement(h,{value:this.props.value,page:this.config("page",{width:816,height:1056}),manual:this.config("manual",!1),columns:this.config("manual",!1)?1:this.config("columns",2),highlight:this.config("highlight"),flowed:this.state.flowed,regions:this.state.regions,onFlow:e=>this.setState({flowed:!0,regions:e})})}}}])});