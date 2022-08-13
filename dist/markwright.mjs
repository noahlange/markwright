var ne=Object.defineProperty;var ie=(e,t,o)=>t in e?ne(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var x=(e,t,o)=>(ie(e,typeof t!="symbol"?t+"":t,o),o);import ae from"react";import{jsx as se}from"react/jsx-runtime";var R=ae.forwardRef((e,t)=>se("div",{className:"mw",style:{position:"absolute",left:-1e4},ref:t,children:e.children}));import{useCallback as ke,useEffect as Ne,useMemo as j,useState as ee}from"react";import{outputFor as oe,parserFor as Te}from"simple-markdown";var me="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";function s(e=8){let t="",o=e;for(;o--;)t+=me[Math.random()*64|0];return t}import{cloneElement as le,createElement as ue}from"react";function h(e,t){if(e)if(Array.isArray(e))for(let o of e)h(o,t);else e.content&&h(e.content,t),t(e);else return}function u(e,t){let o=[];return h(t,r=>{r.type===e&&o.push(r)}),o}function l(e="div",t){return{react:(o,r,n)=>ue(e,{children:o.content?r(o.content):null,className:t?.replace("mw-",""),key:n.key?.toString()??o.id})}}function F(e){return(t,o,r)=>({...e(t,o,r),id:s()})}function E(e){return(t,o,r)=>{let n=e(t,o,r);return n?.props?le(n,{...n.props,id:t.id,key:t.id}):n}}function M(e){return e.length?{type:"mw-section",id:s(),content:{type:"mw-page",id:s(),content:{type:"mw-body",id:s(),content:{type:"mw-content",id:s(),content:e}}}}:null}function b(e){let t=[],o=0;for(let r of u("heading",e))if(r.level===1){let n=e.indexOf(r);t.push(M(e.slice(o,n))),o=n}return t.push(M(e.slice(o))),t.filter(r=>r!==null)}var S=e=>e?parseInt(e):0,c=class{number=0;elementNotes=new Map;bounds;container;elements=[];constructor(t,o){this.container=o,this.number=t;let r=o.getBoundingClientRect(),n=S(getComputedStyle(o).columnCount)||1,i=r.width,a=r.height*n;this.bounds={width:i,height:a}}get ids(){return this.elements.map(t=>t.id)}get footnotes(){return Array.from(this.elementNotes.values()).reduce((t,o)=>t+o,0)}get height(){let[t,o]=[0,0];for(let r of this.elements){let n=getComputedStyle(r),i=r.offsetHeight,[a,m]=[S(n.marginTop),S(n.marginBottom)];t+=i+Math.max(a,o),o=m}return t+=o,t}get isOverflowing(){return this.height>this.bounds.height}add(t){this.elements.push(t);let o=Array.from(t.querySelectorAll(".footnote")).length;o&&this.elementNotes.set(t,o)}pop(){let t=this.elements.pop();return t&&this.elementNotes.delete(t),t??null}};x(c,"FOOTNOTE_BLOCK_HEIGHT",48);var g=class{pages=[];number;start;name=null;constructor(t,o){this.number=t,this.start=o}get ids(){return this.pages.flatMap(t=>t.ids)}add(t){this.pages.push(t)}};function $(e){return Array.from(e)}function H(e){let t=1;return $(e.querySelectorAll(".section .content")).map((o,r)=>{let n=new g(r+1,t),i=new c(t++,o);for(let a of $(o.children)){i.add(a);let m=i.isOverflowing,d=a.classList.contains("mw-break-page");if(m||d){let p=i;if(p.pop(),n.add(p),i=new c(t++,o),m){let f=p.pop();f&&(/h/i.test(f.tagName)?i.add(f):p.add(f))}i.add(a)}}return n.add(i),n})}function L(e,t,o,r,n){let i=n.map(a=>({...a,...a.node}));return{id:t.number,type:"mw-page",content:[{type:"mw-header",content:r,data:{page:t,section:e}},{type:"mw-body",content:[{content:o,type:"mw-content"},{content:i,id:`mw-page-${t.number}-footnotes`,type:"mw-footnotes"}]},{type:"mw-footer",id:`mw-page-${t.number}-footer`,data:{page:t,section:e},content:[]}]}}function C(e,t){let o=e.reduce((i,a)=>({...i,[a.anchor]:a}),{}),r=0,n={};for(let i of u("mw-footnote",t))i.inline&&(i.number=++r,n[i.anchor]=i.number);return Object.entries(n).map(([i,a])=>({node:o[i],anchor:i,number:a}))}function y(e,t){return H(t).map(o=>{let r=u("heading",e).filter(n=>o.ids.includes(n.id)&&n.level===1).flatMap(n=>n.content);return{type:"mw-section",id:o.number,content:o.pages.map(n=>{let i=e.filter(m=>n.ids.includes(m.id)),a=C(u("mw-footnote",e).filter(m=>!m.inline),i);return L(o,n,i,r,a)})}})}import{defaultRules as z}from"simple-markdown";import{blockRegex as ce}from"simple-markdown";import{jsx as de}from"react/jsx-runtime";var pe={match:ce(/^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n *)+\n/),order:0,parse(e,t,o){return o.blocks||(o.blocks=1),{block:e[2],content:t(`

${e[3]}

`,o),id:s()}},react(e,t){return de("div",{id:e.id,className:`block ${e.block}`,children:t(e.content)},e.id)}},k=pe;import{blockRegex as fe}from"simple-markdown";import{jsx as D}from"react/jsx-runtime";var ge={match:fe(/^<br(?:-(page|col))?\s?\/?>/),order:0,parse(e){return{breakType:e[1]||"line",id:s()}},react(e){switch(e.breakType){case"col":case"page":return D("div",{id:e.id,className:`mw-break-${e.breakType}`},e.id);default:return D("br",{id:e.id},e.id)}}},N=ge;import{defaultRules as we,inlineRegex as Re}from"simple-markdown";import{jsx as T,jsxs as he}from"react/jsx-runtime";var P={match:Re(/^\[\^([\d\w]+)\](?::(\s.+))?/),order:we.link.order-1,parse(e,t,o){let[,r,n]=e;return{id:s(),anchor:r,inline:!n,content:t(n??null,o)}},react(e,t){let o=`footnote-${e.anchor}`,r=e.content?t(e.content):null,n=e.number??e.anchor;return e.inline?T("sup",{children:T("a",{href:o,children:n})},e.id):he("span",{id:o,className:"footnote",children:[n,".",r]},e.id)}},B={react(e,t){let o=`footnotes ${e.content?.length?"":"empty"}`;return T("div",{className:o,children:t(e.content)},`mw-footnote-${e.id}`)}};import{blockRegex as W,defaultRules as A}from"simple-markdown";var J={...A.heading,match:W(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)},X={...A.blockQuote,match:W(/^( *>[^\n]+(\n[^\n]+)*\n*)/),...l("blockquote")},O={...A.paragraph,...l("p")};import{jsx as w}from"react/jsx-runtime";var q={react(e,t){return w("div",{className:"mw",children:t(e.content)},`mw-${e.id}`)}},I={react(e,t){let o=e.id%2?"odd":"even";return w("div",{className:`page page-${e.id} ${o}`,children:t(e.content)},`mw-page-${e.id}`)}};function Q(e){return{react(t,o){let{section:r,page:n}=t.data,i=`mw-${r.number}-header-${n.number}`;return r.name=o(t.content),w("header",{children:e(r,n)},i)}}}function _(e){return{react(t,o){let{section:r,page:n}=t.data,i=`mw-${r.number}-footer-${n.number}`;return r.name=o(t.content),w("footer",{children:e(r,n)},i)}}}import{jsx as Se}from"react/jsx-runtime";var be={react(e,t){return Se("section",{className:`section section-${e.id}`,children:t(e.content)},`section-${e.id}`)}},G=be;import{Fragment as K,jsx as U}from"react/jsx-runtime";var v={...z,mw:q,paragraph:O,"mw-block":k,"mw-break":N,"mw-footnote":P,"mw-footnotes":B,"mw-page":I,"mw-section":G,"mw-column-separator":l("hr","mw-column-separator"),"mw-body":l("div","mw-body"),"mw-column":l("div","mw-column"),"mw-content":l("div","mw-content"),"mw-header":l("div","mw-header")};function V(){let e={};for(let t in v){let o={...v[t]};if(!t.startsWith("mw")){let r=o.react;r&&(o.react=E(r))}e[t]=o}return e}function Y(e={}){let t=e.header??(r=>U(K,{children:r.name})),o=e.footer??((r,n)=>U(K,{children:n.number}));return{...v,"mw-header":Q(t),"mw-footer":_(o)}}function Z(){let e={...z,blockQuote:X,heading:J,paragraph:O,"mw-block":k,"mw-break":N,"mw-footnote":P},t={};for(let o in e){let r={...e[o]},n=r.parse;r.parse=F(n),t[o]=r}return t}import{jsx as te,jsxs as Oe}from"react/jsx-runtime";var Pe=Te(Z()),Ae=oe(V(),"react");function re(e){let[t,o]=ee(null),[r,n]=ee(null),i=j(()=>oe(Y(e),"react"),[e.header,e.footer]),a=j(()=>Pe(e.value),[e.value]);Ne(()=>o(Ae(b(a))),[a]);let m=ke(d=>{if(d&&t){let p=y(a,d);n(i(p))}},[t,e.className]);return Oe("div",{className:e.className,children:[te(R,{ref:m,children:t}),te("div",{className:"mw",children:r})]})}export{re as default};
