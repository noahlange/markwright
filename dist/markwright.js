!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.markwright=t():e.markwright=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var c=t[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,n),c.l=!0,c.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports=require("react")},function(e,t){e.exports=require("simple-markdown")},function(e,t,n){"use strict";n.r(t);var o=n(0),c=n(1);class r{constructor(){this.elements=[]}get size(){return this.elements.length}get height(){const e=e=>e?parseInt(e,10):0;let[t,,n]=[0,0,0];for(const o of this.elements){const c=getComputedStyle(o),r={bottom:e(c.marginBottom),top:e(c.marginTop)};t+=e(c.height)+Math.max(n,r.top),n=r.bottom}return t}add(e){this.elements.push(e)}}class s{constructor(){this.regions=[]}add(e){this.regions.push(e)}}function a(e,t,n,o={type:"text",content:""}){return{content:[{content:o,id:`mw-page-${e}-header`,type:"mw-header"},{content:[{content:t,id:`mw-page-${e}-content`,type:"mw-content"},{content:n.map(e=>Object.assign({},e,{inline:!1})),id:`mw-page-${e}-footnotes`,type:"mw-footnotes"}],id:`mw-page-${e}-body`,type:"mw-body"}],id:e,type:"mw-page"}}function i(e,t=[],n=2){let o=[];for(const t of e){let e=o[o.length-1];"heading"===t.type&&1===t.level&&(e&&e.title||!e?(o.push({content:[],id:o.length+1,title:t.content,type:"mw-section"}),e=o[o.length-1]):e&&(e.title=t.content)),e?e.content.push(t):o.push({content:[t],id:1,type:"mw-section"})}if(t.length){let e=1;o=o.map((o,r)=>{const s=[],i=[];let l=0;for(const e of t[r].regions){const t=[];for(const n of e.elements){let e=!1;for(;!e;){const n=o.content[l];if(n){if(t.push(n),l++,"newline"===n.type)continue;e=!0}else e=!0}}i.push(t)}for(;i.length;){const e=[];for(let t=0;t<n;t++)e.push(i.shift());s.push(e)}return o.content=s.map((t,n)=>{const r=[];let s=1;n++,function e(t,n){if(t){if(Array.isArray(t))for(const o of t)e(o,n);if(n(t),t.content)for(const o of t.content)e(o,n)}}(t,e=>{"mw-footnote"===e.type&&(e.key=`mw-page-${n}-footnote-${s++}`,r.push(Object.assign({},e)),e.inline=!0)});const i=t.filter(e=>!!e).map((e,o)=>(c=`mw-page-${n}-column-${o+1}`,t=e,{content:t,id:c,type:"mw-column"})).reduce((e,t,o)=>0===o?[t]:[...e,{id:`mw-page-${n}-column-separator-${o}`,type:"mw-column-separator"},t],[]);return a(e++,i,r,o.title)}),o})}else{let e=0;o=o.map(t=>(e++,t.content=a(e,{content:t.content,id:`mw-page-${e}-column-1`,type:"mw-column"},[],t.title),t))}var c,r;return[{type:"mw",id:1,content:o}]}function l(e,t="div"){return{react:(n,c,r)=>o.createElement(t,{children:c(n.content),className:e,key:n.id||r.key})}}var m=Object.assign({},c.defaultRules,{blockQuote:Object.assign({},c.defaultRules.blockQuote,{match:Object(c.blockRegex)(/^( *>[^\n]+(\n[^\n]+)*\n*)+\n/)}),heading:Object.assign({},c.defaultRules.heading,{match:Object(c.blockRegex)(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)}),mw:{react:(e,t)=>o.createElement("div",{className:"mw",key:`mw-${e.id}`},t(e.content))},"mw-block":{match:Object(c.blockRegex)(/^:::(.+)\n((.|\n)+)\n:::/),order:0,parse:(e,t,n)=>(n.blocks||(n.blocks=1),{block:e[1],content:t(`\n\n${e[2]}\n\n`,{inline:!1},n),id:n.blocks++}),react:(e,t)=>o.createElement("div",{key:e.id,className:`block block-${e.block}`},t(e.content))},"mw-body":l("mw-body"),"mw-break":{match:Object(c.blockRegex)(/^\{\.break\}/),order:0,parse:(e,t,n)=>(n.breaks||(n.breaks=1),{id:n.breaks++}),react:e=>o.createElement("div",{key:`mw-break-${e.id}`,className:"mw-break"})},"mw-column":l("mw-column"),"mw-column-separator":{react:e=>o.createElement("div",{key:e.id,className:"mw-column-separator"})},"mw-content":l("mw-content"),"mw-footnote":{match:Object(c.inlineRegex)(/^\^\[(.+?)\]/),order:c.defaultRules.link.order-1,parse:(e,t,n)=>(n.footnotes||(n.footnotes=1),{content:t(e[1],n),id:n.footnotes++}),react:(e,t)=>e.inline?o.createElement("sup",{key:`${e.id}-inline`},e.id):o.createElement("span",{key:e.id,className:"mw-footnote"},e.id,". ",t(e.content))},"mw-footnotes":{react(e,t){const n=`mw-footnotes ${e.content&&e.content.length?"":"mw-empty"}`;return o.createElement("div",{key:e.id,className:n},t(e.content))}},"mw-header":l("mw-header"),"mw-page":{react(e,t){const n=e.id%2?"mw-odd":"mw-even";return o.createElement("div",{key:`mw-page-${e.id}`,className:`mw-page ${n}`},o.createElement("div",{key:`mw-page-${e.id}-content`},t(e.content)),o.createElement("div",{key:`mw-page-${e.id}-pagination`,className:"mw-pagination"},e.id))}},"mw-section":{react:(e,t)=>o.createElement("div",{key:`mw-section-${e.id}`,className:"mw-section"},t(e.content))},paragraph:Object.assign({},c.defaultRules.paragraph,{react:(e,t,n)=>o.createElement("p",{key:n.key},t(e.content))})});class d extends o.Component{constructor(){super(...arguments),this.state={content:this.props.value,flowed:!1,regions:[],style:"\n      .mw-unflowed .mw-footnote { display: block; }\n    "}}static react(e,t,n){const o=Object(c.parserFor)(m)(e),r=Object(c.ruleOutput)(m,"react");return Object(c.reactFor)(r)(i(o,t,n))}static getDerivedStateFromProps(e,t){return e.value!==t.content?{content:e.value,flowed:!1,regions:[]}:e.flowed?{flowed:!0,regions:e.regions}:null}static flow(){const e=[];for(const t of document.querySelectorAll(".mw-section")){const n=new s,o=t.querySelector(".mw-column");if(o){const t=o.getBoundingClientRect().height-48,c=[].slice.call(o.children);let s=new r;for(const e of c)e.classList.contains("mw-break")?(n.add(s),(s=new r).add(e)):(s.add(e),s.height>t&&(s.elements.pop(),n.add(s),(s=new r).add(e)));n.add(s),e.push(n)}}return e}reflow(){this.state.flowed||this.props.onFlow(d.flow())}componentDidUpdate(){this.reflow()}componentDidMount(){this.reflow()}render(){return o.createElement("div",{className:this.state.flowed?"":"mw-unflowed"},o.createElement("style",{type:"text/css"},this.state.style),d.react(this.state.content||" ",this.state.regions,this.props.columns))}}t.default=class extends o.Component{constructor(){super(...arguments),this.state={flowed:!1,regions:[]}}config(e,t){return this.props.config&&(e=>void 0!==e&&null!==e)(this.props.config[e])?this.props.config[e]:t}render(){return o.createElement(d,{value:this.props.value,columns:this.config("columns",2),flowed:this.state.flowed,regions:this.state.regions,onFlow:e=>this.setState({flowed:!0,regions:e})})}}}])});