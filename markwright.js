(function(a,b){'object'==typeof exports&&'object'==typeof module?module.exports=b():'function'==typeof define&&define.amd?define([],b):'object'==typeof exports?exports.markwright=b():a.markwright=b()})('undefined'==typeof self?this:self,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s='./src/markwright/index.tsx')}({"./src/markwright/Markwright.tsx":function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0});const d=c('react'),e=c('simple-markdown'),f=c('./src/markwright/markdown/ast.ts'),g=c('./src/markwright/markdown/rules.tsx'),h=c('./src/markwright/lib/Region.ts'),i=c('./src/markwright/lib/Section.ts');class j extends d.Component{constructor(){super(...arguments),this.state={content:this.props.content,flowed:!1,regions:[]}}static react(a,b){const c=e.parserFor(g.default),d=c(a),h=e.reactFor(e.ruleOutput(g.default,'react'));return h(f.default(d,b))}static heightOf(a){const c=a.offsetHeight,d=getComputedStyle(a),e=parseInt(d.marginLeft,10),f=parseInt(d.marginRight,10),g=parseInt(d.marginTop,10),h=parseInt(d.marginBottom,10);return c+e+g+h+f}static getDerivedStateFromProps(a,b){return a.content===b.content?a.flowed?{flowed:!0,regions:a.regions}:null:{content:a.content,flowed:!1,regions:[]}}static flow(){const a=[];for(const b of document.querySelectorAll('.mw-section')){const c=new i.default,d=b.querySelector('.mw-column'),e=d.clientHeight;for(let a=[].slice.call(d.children);a.length;){const b=a.map(j.heightOf);let[d,f]=[0,0];for(;d<e;){const c=a[f];if(c&&c.classList.contains('mw-break')){f++;break}if(d+b[f]>e){f++;break}else d+=b[f],f++}const g=new h.default;if(g.elements=a.slice(0,f),0===g.size)break;c.regions.push(g),a=a.slice(f)}a.push(c)}return a}reflow(){if(!this.state.flowed){const a=j.flow();this.props.onFlow(a)}}componentDidUpdate(){this.reflow()}componentDidMount(){this.reflow()}render(){return j.react(this.state.content,this.state.regions)}}b.default=j},"./src/markwright/index.tsx":function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0});const d=c('react'),e=c('./src/markwright/Markwright.tsx');class f extends d.Component{constructor(){super(...arguments),this.state={flowed:!1,regions:[]}}render(){return d.createElement(e.default,{content:this.props.content,flowed:this.state.flowed,regions:this.state.regions,onFlow:(a)=>this.setState({flowed:!0,regions:a})})}}b.default=f},"./src/markwright/lib/Region.ts":function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0});class c{constructor(){this.elements=[]}get size(){return this.elements.length}add(a){this.elements.push(a)}}b.default=c},"./src/markwright/lib/Section.ts":function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0});b.default=class{constructor(){this.regions=[]}add(a){this.regions.push(a)}}},"./src/markwright/markdown/ast.ts":function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0});const d=c('./src/markwright/utils/makeCol.ts'),e=c('./src/markwright/utils/makePage.ts'),f=c('./src/markwright/utils/reach.ts');b.default=function(a,b=[]){let c=[];const g=[];for(const d of a){let a=c[c.length-1];'heading'===d.type&&1===d.level&&(c.push({content:[],id:c.length+1,type:'mw-section'}),a=c[c.length-1],g.push(d.content)),a?a.content.push(d):c.push({content:[d],id:1,type:'mw-section'})}if(!b.length){let a=0;c=c.map((b,c)=>(a++,b.content=e.default(a,{content:b.content,id:`page-${a}-column-1`,type:'mw-column'},[],g[c]),b))}else{let a=1;c=c.map((c,h)=>{const i=[],j=[];let k=0;for(const a of b[h].regions){const b=[];for(const d of a.elements)for(let a=!1;!a;){const d=c.content[k];if(!d)a=!0;else if(b.push(d),k++,'newline'===d.type)continue;else a=!0}j.push(b)}for(;j.length;)i.push([j.shift(),j.shift()]);return c.content=i.map((b)=>{const c=[];let i=1;f.default(b,(a)=>{'mw-footnote'===a.type&&(a.id=i++,c.push(a),a.inline=!0)});const j=b.filter((a)=>!!a).map((a)=>d.default(a)).reduce((c,a,b)=>0===b?[a]:[...c,{type:'mw-column-separator'},a],[]);return e.default(a++,j,c,g[h])}),c})}return[{type:'mw',content:c}]}},"./src/markwright/markdown/rules.tsx":function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0});const d=c('react'),e=c('simple-markdown'),f=c('./src/markwright/utils/divOf.tsx');b.default=Object.assign({},e.defaultRules,{heading:Object.assign({},e.defaultRules.heading,{match:e.blockRegex(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)}),mw:{react(a,b){return d.createElement('div',{className:'mw'},b(a.content))}},"mw-block":{match:e.blockRegex(/^:::(.+)\n(.+)\n:::/),order:0,parse(a,b){return{block:a[1],content:b(a[2])}},react(a,b){return d.createElement('div',{className:`block block-${a.block}`},b(a.content))}},"mw-body":f.default('mw-body'),"mw-break":{match:e.blockRegex(/^\{\.break\}/),order:0,parse(){return{content:null}},react(){return d.createElement('div',{className:'mw-break'})}},"mw-column":f.default('mw-column'),"mw-column-separator":{react(){return d.createElement('div',{className:'mw-column-separator'})}},"mw-content":f.default('mw-content'),"mw-footnote":{match:e.inlineRegex(/^\^\[(.+?)\]/),order:e.defaultRules.link.order-1,parse(a,b,c){return{content:b(a[1],c)}},react(a,b){return a.inline?d.createElement('sup',null,a.id):d.createElement('div',{id:`footnote-${a.id}`,className:'mw-footnote'},a.id,'. ',b(a.content))}},"mw-footnotes":{react(a,b){const c=`mw-footnotes ${a.content&&a.content.length?'':'mw-empty'}`;return d.createElement('div',{key:a.id,className:c},b(a.content))}},"mw-header":f.default('mw-header'),"mw-page":{react(a,b){const c=a.id%2?'mw-odd':'mw-even';return d.createElement('div',{key:`mw-page-${a.id}`,className:`mw-page ${c}`},b(a.content),d.createElement('div',{className:'mw-pagination'},a.id))}},"mw-section":{react(a,b){return d.createElement('div',{key:`mw-section-${a.id}`,className:'mw-section'},b(a.content))}},paragraph:Object.assign({},e.defaultRules.paragraph,{react(a,b){return d.createElement('p',null,b(a.content))}})})},"./src/markwright/utils/divOf.tsx":function(a,b,c){'use strict';Object.defineProperty(b,'__esModule',{value:!0});const d=c('react');b.default=function(a){return{react(b,c){return d.createElement('div',{key:b.id,className:a},c(b.content))}}}},"./src/markwright/utils/makeCol.ts":function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0}),b.default=function(a){return{content:a,type:'mw-column'}}},"./src/markwright/utils/makePage.ts":function(a,b){'use strict';Object.defineProperty(b,'__esModule',{value:!0}),b.default=function(a,b,c,d={type:'text',content:'markwright'}){return{content:[{content:d,id:`page-${a}-header`,type:'mw-header'},{content:[{content:b,id:`page-${a}-content`,type:'mw-content'},{content:c.map((a)=>Object.assign({},a,{inline:!1})),id:`page-${a}-footnotes`,type:'mw-footnotes'}],id:`page-${a}-body`,type:'mw-body'}],id:a,type:'mw-page'}}},"./src/markwright/utils/reach.ts":function(a,b){'use strict';function c(a,b){if(a){if(Array.isArray(a))for(const d of a)c(d,b);if(b(a),a.content)for(const d of a.content)c(d,b)}else return}Object.defineProperty(b,'__esModule',{value:!0}),b.default=c},react:function(a){a.exports=require('react')},"simple-markdown":function(a){a.exports=require('simple-markdown')}})});