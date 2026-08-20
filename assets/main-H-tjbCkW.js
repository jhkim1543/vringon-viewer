import{a as O,n as Pi,b as dl,r as X,t as v,s as Oi,c as Vt,d as zn,e as Do,f as Bn,g as Mn,m as L,h as Se,i as H,j as fl,k as Oe,l as he,o as gt,p as pl,q as Ht,u as ml,S as Qt,v as Zt,w as I,x as gl,y as qs,z as zo,A as Bo,B as Fn,C as Un,D as Mo,E as yl,F as bl,G as Wn,H as wl,I as xe,J as Fo,K as Uo,L as Wo,M as Go,N as Ys,O as Sl,P as W,Q as xl,R as Al,T as Ye,U as Z,V as cs,W as vl,X as Cl,Y as _l,Z as Il,_ as $l,$ as Nl,a0 as El,a1 as oe,a2 as Cs,a3 as Gn,a4 as Tl,a5 as Ll,a6 as kl,a7 as Pl,a8 as Ol,a9 as Vn,aa as yt,ab as Ae,ac as es,ad as Rl,ae as Dl,af as zl,ag as Hn,ah as jn,ai as Vo,aj as Bl,ak as Ml,al as Pe,am as Fl,an as Ri,ao as zt,ap as Ul,aq as Ho,ar as at,as as _s,at as ht,au as Wl,av as bt,aw as Gl,ax as Vl,ay as Di,az as Hl,aA as zi,aB as jl,aC as an,aD as ql,aE as Yl,aF as Bt,aG as ce,aH as jo,aI as wt,aJ as Kl,aK as Xl,aL as ln,aM as un,aN as Bi,aO as Jl,aP as Is,aQ as Mi,aR as Ql,aS as Zl,aT as eu,aU as qn,aV as tu,aW as su,aX as nu,aY as iu,aZ as qo,a_ as ou,a$ as Yo,b0 as ru,b1 as au,b2 as Yn,b3 as lu,b4 as uu,b5 as cu,b6 as hu,b7 as du,b8 as fu,b9 as pu,ba as mu,bb as gu,bc as yu,bd as bu,be as wu,bf as Su,bg as xu,bh as Au,bi as vu,bj as Cu,bk as _u,bl as Iu,bm as $u,bn as Nu,bo as Ko,bp as Eu,bq as Tu,br as Lu,bs as ku,bt as Pu,bu as Ou,bv as Ru,bw as Du,bx as jt,by as zu,bz as Bu,bA as Mu}from"./index-B3A5UXME.js";class Fu{dims=[];paddedDims=[];layout="x";dataType="Float32";getByteSize(){let e=1;for(const t of this.paddedDims)e*=t;return this.dataType==="Float32"?e*=4:this.dataType==="Float16"&&(e*=2),e}}class Uu{desc;data;constructor(e,t){this.desc=e,this.data=t}}class Wu{_view;offset=0;constructor(e){this._view=e}read(e){const t=this._view,n=this.offset;switch(this.offset+=e,e){case 1:return t.getUint8(n);case 2:return t.getUint16(n,!0);case 4:return t.getUint32(n,!0);case 8:return Number(t.getBigUint64(n,!0));default:throw new Error("unsupported read size")}}}function Gu(s){const e=new Uint8Array(s),t=new Wu(new DataView(s));if(t.read(2)!==16855)throw new Error("invalid or corrupted weights blob");const i=t.read(1);if(t.read(1),i!==2)throw new Error("unsupported weights blob version");const o=t.read(8);t.offset=o;const r=t.read(4),a=new Map;for(let l=0;l<r;++l){const u=new Fu,c=t.read(2),h=new TextDecoder().decode(e.subarray(t.offset,t.offset+c));t.offset+=c;const d=t.read(1);for(let w=0;w<d;++w)u.dims.push(t.read(4));u.paddedDims=[...u.dims],new TextDecoder().decode(e.subarray(t.offset,t.offset+d))==="oihw"&&(u.layout="oihw"),t.offset+=d;const p=String.fromCharCode(t.read(1));if(p==="f")u.dataType="Float32";else if(p==="h")u.dataType="Float16";else throw new Error("invalid tensor data type");const f=t.read(8),g=e.slice(f,f+u.getByteSize());a.set(h,new Uu(u,g))}return a}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */const Vu=["channelsFirst","channelsLast"],Hu=["nearest","bilinear"],ju=["valid","same","causal"],qu=["max","avg"];/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */class Ke extends Error{constructor(e){super(e),Object.setPrototypeOf(this,Ke.prototype)}}class Je extends Error{constructor(e){super(e),Object.setPrototypeOf(this,Je.prototype)}}class b extends Error{constructor(e){super(e),Object.setPrototypeOf(this,b.prototype)}}class B extends Error{constructor(e){super(e),Object.setPrototypeOf(this,B.prototype)}}class Kn extends Error{constructor(e){super(e),Object.setPrototypeOf(this,Kn.prototype)}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function $s(s,e){if(Array.isArray(s)){let t=[];for(let n=0;n<e;n++)t=t.concat(s);return t}else{const t=new Array(e);return t.fill(s),t}}function Me(s,e){if(!s)throw new Kn(e)}function Fi(s,e){let t=0;for(const n of s)n===e&&t++;return t}function me(s){return s.length===1?s[0]:s}function V(s){return Array.isArray(s)?s:[s]}function He(s){const t=s.replace(/(.)([A-Z][a-z0-9]+)/g,"$1_$2").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();return t[0]!=="_"?t:"private"+t}function tt(s){return s.length<=1||s.indexOf("_")===-1?s:s.replace(/[_]+(\w|$)/g,(e,t)=>t.toUpperCase())}let Ce={};function Xn(s){if(s==null)return null;const e={};return e.className=s.getClassName(),e.config=s.getConfig(),e}function vn(s){if(!(s==null||typeof s!="object"))if(Array.isArray(s))s.forEach(e=>vn(e));else{const e=Object.keys(s);for(const t of e){const n=s[t];n!=null&&typeof n=="object"&&(!Array.isArray(n)&&n.type==="ndarray"&&typeof n.value=="number"?s[t]=n.value:vn(n))}}}function ts(s,e={},t={},n="object",i=!1){if(typeof s=="string"){const o=s;let r;if(o in t)r=t[o];else if(o in Ce)r=Ce[o];else if(r=e[o],r==null)throw new b(`Unknown ${n}: ${s}. This may be due to one of the following reasons:
1. The ${n} is defined in Python, in which case it needs to be ported to TensorFlow.js or your JavaScript code.
2. The custom ${n} is defined in JavaScript, but is not registered properly with tf.serialization.registerClass().`);return r}else{const o=s;if(o.className==null||o.config==null)throw new b(`${n}: Improper config format: ${JSON.stringify(o)}.
'className' and 'config' must set.`);const r=o.className;let a,l;if(r in t?[a,l]=t[r]:r in Ce?[a,l]=Ce.className:r in e&&([a,l]=e[r]),a==null)throw new b(`Unknown ${n}: ${r}. This may be due to one of the following reasons:
1. The ${n} is defined in Python, in which case it needs to be ported to TensorFlow.js or your JavaScript code.
2. The custom ${n} is defined in JavaScript, but is not registered properly with tf.serialization.registerClass().`);if(l!=null){const u={};for(const m of Object.keys(Ce))u[m]=Ce[m];for(const m of Object.keys(t))u[m]=t[m];const c=o.config;c.customObjects=u;const h=Object.assign({},Ce);for(const m of Object.keys(t))Ce[m]=t[m];vn(o.config);const d=l(a,o.config,t,i);return Ce=Object.assign({},h),d}else{const u=Object.assign({},Ce);for(const h of Object.keys(t))Ce[h]=t[h];const c=new a(o.config);return Ce=Object.assign({},u),c}}}function Yu(s,e){return s<e?-1:s>e?1:0}function hs(s,e){return-1*Yu(s,e)}function st(s){if(s==null)return s;const e=[];for(const t of s)e.indexOf(t)===-1&&e.push(t);return e}function Ku(s){if(s==null)throw new b(`Invalid value in obj: ${JSON.stringify(s)}`);for(const e in s)if(s.hasOwnProperty(e))return!1;return!0}function vt(s,e,t){if(t!=null&&s.indexOf(t)<0)throw new b(`${t} is not a valid ${e}.  Valid values are ${s} or null/undefined.`)}function Jn(s,e,t=0,n=1/0){return Me(t>=0),Me(n>=t),Array.isArray(s)&&s.length>=t&&s.length<=n&&s.every(i=>typeof i===e)}function qe(s,e){Array.isArray(s)?(O(s.length>0,()=>`${e} is unexpectedly an empty array.`),s.forEach((t,n)=>qe(t,`element ${n+1} of ${e}`))):O(Number.isInteger(s)&&s>0,()=>`Expected ${e} to be a positive integer, but got ${Xo(s)}.`)}function Xo(s){return s===null?"null":Array.isArray(s)?"["+s.map(e=>Xo(e)).join(",")+"]":typeof s=="string"?`"${s}"`:`${s}`}function Xu(s,e,t){let n=t!=null?t():Pi(),i;return(...r)=>{const a=t!=null?t():Pi();return a-n<e||(n=a,i=s(...r)),i}}function Ju(s){return s==="relu"?"relu":s==="linear"?"linear":s==="elu"?"elu":null}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */const dt=new Map;function te(s){vt(Vu,"DataFormat",s)}function Qu(s){vt(Hu,"InterpolationFormat",s)}function Ie(s){vt(ju,"PaddingMode",s)}function Jo(s){vt(qu,"PoolMode",s)}const Mt=[],Ui="/";function vs(s,e){Mt.push(s);try{const t=e();return Mt.pop(),t}catch(t){throw Mt.pop(),t}}function Zu(){return Mt.length===0?"":Mt.join(Ui)+Ui}function Qo(s){if(!er(s))throw new Error("Not a valid tensor name: '"+s+"'");return Zu()+s}function Zo(s){if(!er(s))throw new Error("Not a valid tensor name: '"+s+"'");dt.has(s)||dt.set(s,0);const e=dt.get(s);if(dt.set(s,dt.get(s)+1),e>0){const t=`${s}_${e}`;return dt.set(t,1),t}else return s}const ec=new RegExp(/^[A-Za-z0-9][-A-Za-z0-9\._\/]*$/);function er(s){return!!s.match(ec)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function tc(s){return s===parseInt(s.toString(),10)}function Ft(s,e,t){e==null&&(e=0),t==null&&(t=s.length);let n=1;for(let i=e;i<t;++i)n*=s[i];return n}function tr(s){if(s.length===0)return Number.NaN;let e=Number.NEGATIVE_INFINITY;for(let t=0;t<s.length;t++){const n=s[t];n>e&&(e=n)}return e}function Ns(s,e){if(e<s)throw new b(`end (${e}) < begin (${s}) is forbidden.`);const t=[];for(let n=s;n<e;++n)t.push(n);return t}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */let cn;function ee(){return cn==null&&(cn=dl().epsilon()),cn}function Ct(){return"channelsLast"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function sr(s,e){return Se(s,e)}function Qn(s,e=-1){const t=s.shape.slice();return e<0&&(e=t.length+e+1),t.splice(e,0,1),X(s,t)}function sc(s){const e=[Ft(s.shape)];return X(s,e)}function nt(s,e,t){return v(()=>{switch(s.rank){case 1:return Bn(s,e,t);case 2:return Do(s,[e,0],[t,s.shape[1]]);case 3:return zn(s,[e,0,0],[t,s.shape[1],s.shape[2]]);case 4:return Vt(s,[e,0,0,0],[t,s.shape[1],s.shape[2],s.shape[3]]);case 5:return Oi(s,[e,0,0,0,0],[t,s.shape[1],s.shape[2],s.shape[3],s.shape[4]]);case 6:return Oi(s,[e,0,0,0,0,0],[t,s.shape[1],s.shape[2],s.shape[3],s.shape[4],s.shape[5]]);default:throw new b(`sliceAlongFirstAxis() received an unsupported tensor rank: ${s.rank}`)}})}function hn(s,e,t){return v(()=>{switch(s.rank){case 1:return Bn(s,e,t);case 2:return Do(s,[0,e],[s.shape[0],t]);case 3:return zn(s,[0,0,e],[s.shape[0],s.shape[1],t]);case 4:return Vt(s,[0,0,0,e],[s.shape[0],s.shape[1],s.shape[2],t]);default:throw new b(`sliceAlongLastAxis() received an unsupported tensor rank: ${s.rank}`)}})}function ds(s,e,t,n){return v(()=>{switch(s.rank){case 1:return Bn(s,e,t);case 2:switch(n){case 1:return nt(s,e,t);case 2:return hn(s,e,t);default:throw new b(`The axis is not within the rank of the tensor ${n}`)}case 3:switch(n){case 1:return nt(s,e,t);case 2:return zn(s,[0,e,0],[s.shape[0],t,s.shape[2]]);case 3:return hn(s,e,t);default:throw new b(`The axis is not within the rank of the tensor ${n}`)}case 4:switch(n){case 1:return nt(s,e,t);case 2:return Vt(s,[0,e,0,0],[s.shape[0],t,s.shape[2],s.shape[3]]);case 3:return Vt(s,[0,0,e,0],[s.shape[0],s.shape[1],t,s.shape[3]]);case 4:return hn(s,e,t);default:throw new b(`The axis is not within the rank of the tensor ${n}`)}default:throw new b(`sliceAlongLastAxis() received an unsupported tensor rank: ${s.rank}`)}})}function nc(s,e=-1){let t;return e<0&&(t=s[0].rank,t!==0?e=t:e=0),e===s[0].rank&&(e=-1),Mn(s,e)}function nr(s,e=0,t=1,n,i){return pl(s,e,t,n,i)}function ic(s,e,t){return v(()=>(Array.isArray(e)?e=Ht(e,"int32"):e=Se(e,"int32"),ml(s,e,t)))}function ss(s){return L(s,s)}function oc(s,e,t){const n=e.shape;if(e.rank!==1&&e.rank!==s)throw new b(`Unexpected bias dimensions: ${e.rank}; expected it to be 1 or ${s}`);if(s===5){if(t==="channelsFirst")return n.length===1?X(e,[1,n[0],1,1,1]):X(e,[1,n[3],n[0],n[1],n[2]]);if(t==="channelsLast")return n.length===1?X(e,[1,1,1,1,n[0]]):X(e,[1].concat(n))}else if(s===4){if(t==="channelsFirst")return n.length===1?X(e,[1,n[0],1,1]):X(e,[1,n[2],n[0],n[1]]);if(t==="channelsLast")return n.length===1?X(e,[1,1,1,n[0]]):X(e,[1].concat(n))}else if(s===3){if(t==="channelsFirst")return n.length===1?X(e,[1,n[0],1]):X(e,[1,n[1],n[0]]);if(t==="channelsLast")return n.length===1?X(e,[1,1,n[0]]):X(e,[1].concat(n))}else if(s<3)return e;throw new b(`Unsupported input rank by biasAdd: ${e.rank}`)}function ns(s,e,t){return v(()=>(t==null&&(t=Ct()),te(t),H(s,oc(s.rank,e,t))))}function rc(s,e=1){if(e!==1)throw new B(`Support for alpha values other than 1 (${e}) is not implemented yet.`);return fl(s)}function ac(s){return v(()=>he(s,H(gt(s),1)))}function lc(s){return v(()=>{const e=H(.5,L(.2,s));return Oe(e,0,1)})}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */class le extends Zt{getConfig(){return{}}}class ir extends le{apply(e,t=1){return rc(e,t)}}ir.className="elu";I(ir);class or extends le{apply(e){return gl(e)}}or.className="selu";I(or);class rr extends le{apply(e){return qs(e)}}rr.className="relu";I(rr);class ar extends le{apply(e){return v(()=>zo(6,qs(e)))}}ar.className="relu6";I(ar);class lr extends le{apply(e){return e}}lr.className="linear";I(lr);class ur extends le{apply(e){return Bo(e)}}ur.className="sigmoid";I(ur);class cr extends le{apply(e){return lc(e)}}cr.className="hardSigmoid";I(cr);class hr extends le{apply(e){return Fn(e)}}hr.className="softplus";I(hr);class dr extends le{apply(e){return ac(e)}}dr.className="softsign";I(dr);class fr extends le{apply(e){return Un(e)}}fr.className="tanh";I(fr);class pr extends le{apply(e,t=-1){return Mo(e,t)}}pr.className="softmax";I(pr);class mr extends le{apply(e,t=-1){return yl(e,t)}}mr.className="logSoftmax";I(mr);class gr extends le{apply(e){return v(()=>v(()=>{const t=Math.sqrt(2),n=L(.5,H(1,bl(he(e,t))));return L(e,n)}))}}gr.className="gelu";I(gr);class yr extends le{apply(e){return v(()=>L(.5,L(e,H(1,Un(L(Wn(he(2,Math.PI)),H(e,L(.044715,wl(e,3)))))))))}}yr.className="gelu_new";I(yr);class br extends le{apply(e){return v(()=>L(e,Un(Fn(e))))}}br.className="mish";I(br);class wr extends le{apply(e,t=1){return v(()=>L(Bo(L(e,t)),e))}}wr.className="swish";I(wr);function uc(s){return s.getClassName()}function dn(s,e={}){return ts(s,Qt.getMap().classNameMap,e,"activation")}function cc(s){if(s==null){const e={};return e.className="linear",e.config={},dn(e)}if(typeof s=="string"){const e={};return e.className=s,e.config={},dn(e)}else return s instanceof le?s:dn(s)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function Zn(s,e){return v(()=>Wn(xe(L(s,s),e,!0)))}class is extends Zt{getConfig(){return{}}}class Sr extends is{constructor(e){super(),this.defaultMaxValue=2,this.defaultAxis=0,this.maxValue=e.maxValue!=null?e.maxValue:this.defaultMaxValue,this.axis=e.axis!=null?e.axis:this.defaultAxis}apply(e){return v(()=>{const t=Zn(e,this.axis),n=Oe(t,0,this.maxValue);return L(e,he(n,H(ee(),t)))})}getConfig(){return{maxValue:this.maxValue,axis:this.axis}}}Sr.className="MaxNorm";I(Sr);class xr extends is{constructor(e){super(),this.defaultAxis=0,this.axis=e.axis!=null?e.axis:this.defaultAxis}apply(e){return v(()=>he(e,H(ee(),Zn(e,this.axis))))}getConfig(){return{axis:this.axis}}}xr.className="UnitNorm";I(xr);class Ar extends is{apply(e){return qs(e)}}Ar.className="NonNeg";I(Ar);class vr extends is{constructor(e){super(),this.defaultMinValue=0,this.defaultMaxValue=1,this.defaultRate=1,this.defaultAxis=0,this.minValue=e.minValue!=null?e.minValue:this.defaultMinValue,this.maxValue=e.maxValue!=null?e.maxValue:this.defaultMaxValue,this.rate=e.rate!=null?e.rate:this.defaultRate,this.axis=e.axis!=null?e.axis:this.defaultAxis}apply(e){return v(()=>{const t=Zn(e,this.axis),n=H(L(this.rate,Oe(t,this.minValue,this.maxValue)),L(1-this.rate,t));return L(e,he(n,H(ee(),t)))})}getConfig(){return{minValue:this.minValue,maxValue:this.maxValue,rate:this.rate,axis:this.axis}}}vr.className="MinMaxNorm";I(vr);const Wi={maxNorm:"MaxNorm",minMaxNorm:"MinMaxNorm",nonNeg:"NonNeg",unitNorm:"UnitNorm"};function Es(s){return Xn(s)}function Gi(s,e={}){return ts(s,Qt.getMap().classNameMap,e,"constraint")}function Ts(s){if(s==null)return null;if(typeof s=="string"){const t={className:s in Wi?Wi[s]:s,config:{}};return Gi(t)}else return s instanceof is?s:Gi(s)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */let hc=0;function Cr(){return hc++}const fs={};function ei(s=""){return s in fs||(fs[s]=0),fs[s]+=1,s+fs[s].toString()}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */const dc=["fanIn","fanOut","fanAvg"],fc=["normal","uniform","truncatedNormal"];/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function pc(s){vt(dc,"FanMode",s)}function mc(s){vt(fc,"Distribution",s)}class Ge extends Zt{fromConfigUsesCustomObjects(){return!1}getConfig(){return{}}}class _r extends Ge{apply(e,t){return Wo(e,t)}}_r.className="Zeros";I(_r);class Ir extends Ge{apply(e,t){return Go(e,t)}}Ir.className="Ones";I(Ir);class $r extends Ge{constructor(e){if(super(),typeof e!="object")throw new b(`Expected argument of type ConstantConfig but got ${e}`);if(e.value===void 0)throw new b(`config must have value set but got ${e}`);this.value=e.value}apply(e,t){return v(()=>L(Ys(this.value),Go(e,t)))}getConfig(){return{value:this.value}}}$r.className="Constant";I($r);class Nr extends Ge{constructor(e){super(),this.DEFAULT_MINVAL=-.05,this.DEFAULT_MAXVAL=.05,this.minval=e.minval||this.DEFAULT_MINVAL,this.maxval=e.maxval||this.DEFAULT_MAXVAL,this.seed=e.seed}apply(e,t){return Uo(e,this.minval,this.maxval,t,this.seed)}getConfig(){return{minval:this.minval,maxval:this.maxval,seed:this.seed}}}Nr.className="RandomUniform";I(Nr);class Er extends Ge{constructor(e){super(),this.DEFAULT_MEAN=0,this.DEFAULT_STDDEV=.05,this.mean=e.mean||this.DEFAULT_MEAN,this.stddev=e.stddev||this.DEFAULT_STDDEV,this.seed=e.seed}apply(e,t){if(t=t||"float32",t!=="float32"&&t!=="int32")throw new B(`randomNormal does not support dType ${t}.`);return nr(e,this.mean,this.stddev,t,this.seed)}getConfig(){return{mean:this.mean,stddev:this.stddev,seed:this.seed}}}Er.className="RandomNormal";I(Er);class Tr extends Ge{constructor(e){super(),this.DEFAULT_MEAN=0,this.DEFAULT_STDDEV=.05,this.mean=e.mean||this.DEFAULT_MEAN,this.stddev=e.stddev||this.DEFAULT_STDDEV,this.seed=e.seed}apply(e,t){if(t=t||"float32",t!=="float32"&&t!=="int32")throw new B(`truncatedNormal does not support dType ${t}.`);return Fo(e,this.mean,this.stddev,t,this.seed)}getConfig(){return{mean:this.mean,stddev:this.stddev,seed:this.seed}}}Tr.className="TruncatedNormal";I(Tr);class Lr extends Ge{constructor(e){super(),this.gain=e.gain!=null?e.gain:1}apply(e,t){return v(()=>{if(e.length!==2||e[0]!==e[1])throw new b("Identity matrix initializer can only be used for 2D square matrices.");return L(this.gain,Sl(e[0]))})}getConfig(){return{gain:this.gain}}}Lr.className="Identity";I(Lr);function gc(s,e="channelsLast"){let t,n;if(te(e),s.length===2)t=s[0],n=s[1];else if([3,4,5].indexOf(s.length)!==-1){if(e==="channelsFirst"){const i=Ft(s,2);t=s[1]*i,n=s[0]*i}else if(e==="channelsLast"){const i=Ft(s,0,s.length-2);t=s[s.length-2]*i,n=s[s.length-1]*i}}else{const i=Ft(s);t=Math.sqrt(i),n=Math.sqrt(i)}return[t,n]}class ge extends Ge{constructor(e){if(super(),e.scale<0)throw new b(`scale must be a positive float. Got: ${e.scale}`);this.scale=e.scale==null?1:e.scale,this.mode=e.mode==null?"fanIn":e.mode,pc(this.mode),this.distribution=e.distribution==null?"normal":e.distribution,mc(this.distribution),this.seed=e.seed}apply(e,t){const n=gc(e),i=n[0],o=n[1];let r=this.scale;if(this.mode==="fanIn"?r/=Math.max(1,i):this.mode==="fanOut"?r/=Math.max(1,o):r/=Math.max(1,(i+o)/2),this.distribution==="normal"){const a=Math.sqrt(r);if(t=t||"float32",t!=="float32"&&t!=="int32")throw new B(`${this.getClassName()} does not support dType ${t}.`);return Fo(e,0,a,t,this.seed)}else{const a=Math.sqrt(3*r);return Uo(e,-a,a,t,this.seed)}}getConfig(){return{scale:this.scale,mode:this.mode,distribution:this.distribution,seed:this.seed}}}ge.className="VarianceScaling";I(ge);class ti extends ge{constructor(e){super({scale:1,mode:"fanAvg",distribution:"uniform",seed:e==null?null:e.seed})}getClassName(){return ge.className}}ti.className="GlorotUniform";I(ti);class si extends ge{constructor(e){super({scale:1,mode:"fanAvg",distribution:"normal",seed:e==null?null:e.seed})}getClassName(){return ge.className}}si.className="GlorotNormal";I(si);class ni extends ge{constructor(e){super({scale:2,mode:"fanIn",distribution:"normal",seed:e==null?null:e.seed})}getClassName(){return ge.className}}ni.className="HeNormal";I(ni);class ii extends ge{constructor(e){super({scale:2,mode:"fanIn",distribution:"uniform",seed:e==null?null:e.seed})}getClassName(){return ge.className}}ii.className="HeUniform";I(ii);class oi extends ge{constructor(e){super({scale:1,mode:"fanIn",distribution:"normal",seed:e==null?null:e.seed})}getClassName(){return ge.className}}oi.className="LeCunNormal";I(oi);class ri extends ge{constructor(e){super({scale:1,mode:"fanIn",distribution:"uniform",seed:e==null?null:e.seed})}getClassName(){return ge.className}}ri.className="LeCunUniform";I(ri);class kr extends Ge{constructor(e){super(),this.DEFAULT_GAIN=1,this.ELEMENTS_WARN_SLOW=2e3,this.gain=e.gain==null?this.DEFAULT_GAIN:e.gain,this.seed=e.seed}apply(e,t){return v(()=>{if(e.length<2)throw new B("Shape must be at least 2D.");if(t!=="int32"&&t!=="float32"&&t!==void 0)throw new TypeError(`Unsupported data type ${t}.`);t=t;const n=W(e.slice(0,-1)),i=e[e.length-1],o=n*i;o>this.ELEMENTS_WARN_SLOW&&console.warn(`Orthogonal initializer is being called on a matrix with more than ${this.ELEMENTS_WARN_SLOW} (${o}) elements: Slowness may result.`);const r=[Math.max(i,n),Math.min(i,n)],a=nr(r,0,1,t,this.seed),l=xl.qr(a,!1);let u=l[0];const h=l[1].flatten().stridedSlice([0],[Math.min(i,n)*Math.min(i,n)],[Math.min(i,n)+1]);return u=L(u,h.sign()),n<i&&(u=u.transpose()),L(Ys(this.gain),u.reshape(e))})}getConfig(){return{gain:this.gain,seed:this.seed}}}kr.className="Orthogonal";I(kr);const Vi={constant:"Constant",glorotNormal:"GlorotNormal",glorotUniform:"GlorotUniform",heNormal:"HeNormal",heUniform:"HeUniform",identity:"Identity",leCunNormal:"LeCunNormal",leCunUniform:"LeCunUniform",ones:"Ones",orthogonal:"Orthogonal",randomNormal:"RandomNormal",randomUniform:"RandomUniform",truncatedNormal:"TruncatedNormal",varianceScaling:"VarianceScaling",zeros:"Zeros"};function Hi(s,e={}){return ts(s,Qt.getMap().classNameMap,e,"initializer")}function Ls(s){return Xn(s)}function qt(s){if(typeof s=="string"){const e=s in Vi?Vi[s]:s;if(e==="GlorotNormal")return new si;if(e==="GlorotUniform")return new ti;if(e==="HeNormal")return new ni;if(e==="HeUniform")return new ii;if(e==="LeCunNormal")return new oi;if(e==="LeCunUniform")return new ri;{const t={};return t.className=e,t.config={},Hi(t)}}else return s instanceof Ge?s:Hi(s)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function ks(s){return s.length===0?[]:Array.isArray(s[0])?s:[s]}function ye(s){let e;if(Array.isArray(s)){if(s.length!==1)throw new b(`Expected Tensor length to be 1; got ${s.length}`);e=s[0]}else e=s;return e}function Re(s){if(Array.isArray(s)&&Array.isArray(s[0])){if(s.length===1)return s=s,s[0];throw new b(`Expected exactly 1 Shape; got ${s.length}`)}else return s}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function Ps(s){let e=0;for(const t of s)t.shape.length===0?e+=1:e+=t.shape.reduce((n,i)=>n*i);return e}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */const ji="Variable";class yc{constructor(e,t="float32",n=ji,i=!0,o=null){this.dtype=t??"float32",this.shape=e.shape,this.id=Cr(),n=n??ji,this.originalName=Qo(n),this.name=Zo(this.originalName),this.trainable_=i,this.constraint=o,this.val=Al(e,this.trainable_,this.name,this.dtype)}read(){return this.assertNotDisposed(),this.val}write(e){return this.assertNotDisposed(),bc(this.val,e),this.val.id!==e.id&&(this.val.assign(e),this.constraint!=null&&this.val.assign(this.constraint.apply(this.val))),this}dispose(){this.assertNotDisposed(),this.val.dispose()}assertNotDisposed(){if(this.val.isDisposed)throw new Error(`LayersVariable ${this.name} is already disposed.`)}get trainable(){return this.trainable_}set trainable(e){this.trainable_=e,this.val.trainable=e}}function bc(s,e){if(s.shape.toString()!==e.shape.toString())throw new Error("Shape mismatch: "+JSON.stringify(s.shape)+" vs. "+JSON.stringify(e.shape))}function qi(s){return s.map(e=>e.read())}function Pr(s){s.forEach(e=>{e[0].write(e[1])})}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */class Ue{constructor(e){this.dtype=e.dtype,this.shape=e.shape,e.shape!=null?this.ndim=e.shape.length:this.ndim=e.ndim,this.maxNDim=e.maxNDim,this.minNDim=e.minNDim,this.axes=e.axes||{}}}class lt{constructor(e,t,n,i,o,r,a){this.dtype=e,this.shape=t,this.sourceLayer=n,this.inputs=i,this.callArgs=o,this.outputTensorIndex=a,this.id=Cr(),r!=null&&(this.originalName=Qo(r),this.name=Zo(this.originalName)),this.rank=t.length}}let wc=0;class ai{constructor(e,t){this.callArgs=t,this.id=wc++,this.outboundLayer=e.outboundLayer,this.inboundLayers=e.inboundLayers,this.nodeIndices=e.nodeIndices,this.tensorIndices=e.tensorIndices,this.inputTensors=e.inputTensors,this.outputTensors=e.outputTensors,this.inputMasks=e.inputMasks,this.outputMasks=e.outputMasks,this.inputShapes=e.inputShapes,this.outputShapes=e.outputShapes;for(const n of e.inboundLayers)n?.outboundNodes.push(this);e.outboundLayer.inboundNodes.push(this)}getConfig(){const e=[];for(const t of this.inboundLayers)t!=null?e.push(t.name):e.push(null);return{outboundLayer:this.outboundLayer?this.outboundLayer.name:null,inboundLayers:e,nodeIndices:this.nodeIndices,tensorIndices:this.tensorIndices}}}let Sc=0;class De extends Zt{constructor(e={}){super(),this._callHook=null,this._addedWeightNames=[],this._stateful=!1,this.id=Sc++,this.activityRegularizer=null,this.inputSpec=null,this.supportsMasking=!1,this._trainableWeights=[],this._nonTrainableWeights=[],this._losses=[],this._updates=[],this._built=!1,this.inboundNodes=[],this.outboundNodes=[];let t=e.name;if(!t){const n=this.getClassName();t=He(n)+"_"+ei(n)}if(this.name=t,this.trainable_=e.trainable==null?!0:e.trainable,e.inputShape!=null||e.batchInputShape!=null){let n;if(e.batchInputShape!=null)n=e.batchInputShape;else if(e.inputShape!=null){let o=null;e.batchSize!=null&&(o=e.batchSize),n=[o].concat(e.inputShape)}this.batchInputShape=n;let i=e.dtype;i==null&&(i=e.inputDType),i==null&&(i="float32"),this.dtype=i}e.weights!=null?this.initialWeights=e.weights:this.initialWeights=null,this._refCount=null,this.fastWeightInitDuringBuild=!1}static nodeKey(e,t){return e.name+"_ib-"+t.toString()}getNodeAtIndex(e,t){if(this.inboundNodes.length===0)throw new Je(`The layer has never been called and thus has no defined ${t}.`);if(this.inboundNodes.length<=e)throw new b(`Asked to get ${t} at node ${e}, but the layer has only ${this.inboundNodes.length} inbound nodes.`);return this.inboundNodes[e]}getInputAt(e){return me(this.getNodeAtIndex(e,"input").inputTensors)}getOutputAt(e){return me(this.getNodeAtIndex(e,"output").outputTensors)}get input(){if(this.inboundNodes.length>1)throw new Ke(`Layer ${this.name} has multiple inbound nodes, hence the notion of "layer input" is ill-defined. Use \`getInputAt(nodeIndex)\` instead.`);if(this.inboundNodes.length===0)throw new Ke(`Layer ${this.name} is not connected, no input to return.`);return me(this.getNodeAtIndex(0,"input").inputTensors)}get output(){if(this.inboundNodes.length===0)throw new Ke(`Layer ${this.name} has no inbound nodes.`);if(this.inboundNodes.length>1)throw new Ke(`Layer ${this.name} has multiple inbound nodes, hence the notion of "layer output" is ill-defined. Use \`getOutputAt(nodeIndex)\` instead.`);return me(this.getNodeAtIndex(0,"output").outputTensors)}get losses(){return this._losses}calculateLosses(){return this.losses.map(e=>e())}get updates(){return this._updates}get built(){return this._built}set built(e){this._built=e}get trainable(){return this.trainable_}set trainable(e){this._trainableWeights.forEach(t=>t.trainable=e),this.trainable_=e}get trainableWeights(){return this.trainable_?this._trainableWeights.filter(e=>e.trainable):[]}set trainableWeights(e){this._trainableWeights=e}get nonTrainableWeights(){return this.trainable?this._trainableWeights.filter(e=>!e.trainable).concat(this._nonTrainableWeights):this._trainableWeights.concat(this._nonTrainableWeights)}set nonTrainableWeights(e){this._nonTrainableWeights=e}get weights(){return this.trainableWeights.concat(this.nonTrainableWeights)}get stateful(){return this._stateful}resetStates(){if(!this.stateful)throw new Error("Cannot call the resetStates() method of a non-stateful Layer object.")}assertInputCompatibility(e){const t=V(e);if(this.inputSpec==null||this.inputSpec.length===0)return;const n=V(this.inputSpec);if(t.length!==n.length)throw new b(`Layer ${this.name} expects ${n.length} inputs, but it received ${t.length} input tensors. Input received: ${e}`);for(let i=0;i<t.length;i++){const o=t[i],r=n[i];if(r==null)continue;const a=o.rank;if(r.ndim!=null&&a!==r.ndim)throw new b(`Input ${i} is incompatible with layer ${this.name}: expected ndim=${r.ndim}, found ndim=${a}`);if(r.maxNDim!=null&&a>r.maxNDim)throw new b(`Input ${i} is incompatible with layer ${this.name}: expected max_ndim=${r.maxNDim}, found ndim=${a}`);if(r.minNDim!=null&&a<r.minNDim)throw new b(`Input ${i} is incompatible with layer ${this.name}: expected min_ndim=${r.minNDim}, found ndim=${a}.`);if(r.dtype!=null&&o.dtype!==r.dtype)throw new b(`Input ${i} is incompatible with layer ${this.name} : expected dtype=${r.dtype}, found dtype=${o.dtype}.`);if(r.axes){const l=o.shape;for(const u in r.axes){const c=Number(u),h=r.axes[u],d=c>=0?l[c]:l[l.length+c];if(h!=null&&[h,null].indexOf(d)===-1)throw new b(`Input ${i} is incompatible with layer ${this.name}: expected axis ${c} of input shape to have value ${h} but got shape ${l}.`)}}if(r.shape!=null)for(let l=0;l<r.shape.length;++l){const u=r.shape[l],c=o.shape[l];if(u!=null&&c!=null&&u!==c)throw new b(`Input ${i} is incompatible with layer ${this.name}: expected shape=${r.shape}, found shape=${o.shape}.`)}}}call(e,t){return e}invokeCallHook(e,t){this._callHook!=null&&this._callHook(e,t)}setCallHook(e){this._callHook=e}clearCallHook(){this._callHook=null}apply(e,t){t=t||{},this.assertNotDisposed();const n=V(e),i=vc(e),o=Cc(e);if(i===o)throw new b("Arguments to apply() must be all SymbolicTensors or all Tensors");return vs(this.name,()=>{if(!this.built){this.assertInputCompatibility(e);const r=[];for(const a of V(e))r.push(a.shape);this.build(me(r)),this.built=!0,this.initialWeights&&this.setWeights(this.initialWeights),this._refCount===null&&o&&(this._refCount=1)}if(this.assertInputCompatibility(e),o){let r=this.call(e,t);this.supportsMasking&&this.setMaskMetadata(e,r);const a=V(r),l=[];for(let u of a)n.indexOf(u)!==-1&&(u=u.clone()),l.push(u);if(r=me(l),this.activityRegularizer!=null)throw new B("Layer invocation in the presence of activity regularizer(s) is not supported yet.");return r}else{const r=xc(e),a=this.computeOutputShape(r);let l;const u=Ac(e);if(this.warnOnIncompatibleInputShape(Array.isArray(e)?r[0]:r),a!=null&&a.length>0&&Array.isArray(a[0])?l=a.map((c,h)=>new lt(u,c,this,V(e),t,this.name,h)):l=new lt(u,a,this,V(e),t,this.name),this.addInboundNode(e,l,null,null,r,a,t),this._refCount++,this.activityRegularizer!=null)throw new B("Layer invocation in the presence of activity regularizer(s) is not supported yet.");return l}})}warnOnIncompatibleInputShape(e){if(this.batchInputShape!=null)if(e.length!==this.batchInputShape.length)console.warn(`The rank of the input tensor provided (shape: ${JSON.stringify(e)}) does not match that of the batchInputShape (${JSON.stringify(this.batchInputShape)}) of the layer ${this.name}`);else{let t=!1;this.batchInputShape.forEach((n,i)=>{n!=null&&e[i]!=null&&e[i]!==n&&(t=!0)}),t&&console.warn(`The shape of the input tensor (${JSON.stringify(e)}) does not match the expectation of layer ${this.name}: ${JSON.stringify(this.batchInputShape)}`)}}get outputShape(){if(this.inboundNodes==null||this.inboundNodes.length===0)throw new Ke(`The layer ${this.name} has never been called and thus has no defined output shape.`);const e=[];for(const t of this.inboundNodes){const n=JSON.stringify(t.outputShapes);e.indexOf(n)===-1&&e.push(n)}if(e.length===1){const t=this.inboundNodes[0].outputShapes;return Array.isArray(t)&&Array.isArray(t[0])&&t.length===1?t[0]:t}else throw new Ke(`The layer ${this.name} has multiple inbound nodes with different output shapes. Hence the notion of "output shape" is ill-defined for the layer.`)}countParams(){if(!this.built)throw new Je(`You tried to call countParams() on ${this.name}, but the layer is not built yet. Build it first by calling build(batchInputShape).`);return Ps(this.weights)}build(e){this.built=!0}getWeights(e=!1){return qi(e?this.trainableWeights:this.weights)}setWeights(e){v(()=>{const t=this.weights;if(t.length!==e.length)throw new b(`You called setWeights(weights) on layer "${this.name}" with a weight list of length ${e.length}, but the layer was expecting ${t.length} weights. Provided weights: ${e}...`);if(t.length===0)return;const n=[],i=qi(t);for(let o=0;o<i.length;++o){const r=i[o],a=t[o],l=e[o];if(!Ye(r.shape,l.shape))throw new b(`Layer weight shape ${r.shape} not compatible with provided weight shape ${l.shape}`);n.push([a,l])}Pr(n)})}addWeight(e,t,n,i,o,r,a,l){if(this._addedWeightNames.indexOf(e)!==-1)throw new b(`Duplicate weight name ${e} for layer ${this.name}`);this._addedWeightNames.push(e),n==null&&(n="float32"),this.fastWeightInitDuringBuild&&(i=l!=null?l():qt("zeros"));const u=i.apply(t,n),c=new yc(u,n,e,r,a);return u.dispose(),o!=null&&this.addLoss(()=>o.apply(c.read())),r==null&&(r=!0),r?this._trainableWeights.push(c):this._nonTrainableWeights.push(c),c}setFastWeightInitDuringBuild(e){this.fastWeightInitDuringBuild=e}addLoss(e){e==null||Array.isArray(e)&&e.length===0||(e=V(e),this._losses!==void 0&&this._losses!==null&&this.losses.push(...e))}computeOutputShape(e){return e}computeMask(e,t){if(!this.supportsMasking){if(t!=null)if(Array.isArray(t))t.forEach(n=>{if(n!=null)throw new TypeError(`Layer ${this.name} does not support masking, but was passed an inputMask.`)});else throw new TypeError(`Layer ${this.name} does not support masking, but was passed an inputMask.`);return null}return t}setMaskMetadata(e,t,n){if(!this.supportsMasking)return;const i=this.computeMask(e,n),o=V(t),r=V(i);if(o.length!==r.length)throw new Error(`${this.name} outputs ${o.length} tensors but ${o.length} masks for those tensors`);for(let a=0;a<o.length;a++)o[a].kerasMask=r[a]}addInboundNode(e,t,n,i,o,r,a=null){const l=V(e);t=V(t),n=V(n),i=V(i),o=ks(o),r=ks(r);const u=[],c=[],h=[];for(const d of l)u.push(d.sourceLayer),c.push(d.nodeIndex),h.push(d.tensorIndex);new ai({outboundLayer:this,inboundLayers:u,nodeIndices:c,tensorIndices:h,inputTensors:l,outputTensors:t,inputMasks:n,outputMasks:i,inputShapes:o,outputShapes:r},a);for(let d=0;d<t.length;d++)t[d].sourceLayer=this,t[d].nodeIndex=this.inboundNodes.length-1,t[d].tensorIndex=d}getConfig(){const e={name:this.name,trainable:this.trainable};return this.batchInputShape!=null&&(e.batchInputShape=this.batchInputShape),this.dtype!=null&&(e.dtype=this.dtype),e}disposeWeights(){return this.weights.forEach(e=>e.dispose()),this.weights.length}assertNotDisposed(){if(this._refCount===0)throw new Error(`Layer '${this.name}' is already disposed.`)}dispose(){if(!this.built)throw new Error(`Cannot dispose Layer ${this.name} because it has not been built yet.`);if(this._refCount===null)throw new Error(`Cannot dispose Layer ${this.name} because it has not been used yet.`);this.assertNotDisposed();let e=0;return--this._refCount===0&&(e=this.disposeWeights()),{refCountAfterDispose:this._refCount,numDisposedVariables:e}}}function xc(s){s=V(s);const e=[];for(const t of s)e.push(t.shape);return me(e)}function Ac(s){return"float32"}function vc(s){let e=!0;for(const t of V(s))if(!(t instanceof lt)){e=!1;break}return e}function Cc(s){let e=!0;for(const t of V(s))if(t instanceof lt){e=!1;break}return e}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function _c(s){if(s!=null&&typeof s!="object")throw new Error(`Argument to L1L2 regularizer's constructor is expected to be an object, but received: ${s}`)}class Or extends Zt{}class Rr extends Or{constructor(e){super(),_c(e),this.l1=e==null||e.l1==null?.01:e.l1,this.l2=e==null||e.l2==null?.01:e.l2,this.hasL1=this.l1!==0,this.hasL2=this.l2!==0}apply(e){return v(()=>{let t=Wo([1]);return this.hasL1&&(t=H(t,xe(L(this.l1,gt(e))))),this.hasL2&&(t=H(t,xe(L(this.l2,ss(e))))),X(t,[])})}getConfig(){return{l1:this.l1,l2:this.l2}}static fromConfig(e,t){return new e({l1:t.l1,l2:t.l2})}}Rr.className="L1L2";I(Rr);const Yi={l1l2:"L1L2"};function Yt(s){return Xn(s)}function Ki(s,e={}){return ts(s,Qt.getMap().classNameMap,e,"regularizer")}function Kt(s){if(s==null)return null;if(typeof s=="string"){const t={className:s in Yi?Yi[s]:s,config:{}};return Ki(t)}else return s instanceof Or?s:Ki(s)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function fn(s,e,t){if(typeof s=="number")return $s(s,e);if(s.length!==e)throw new b(`The ${t} argument must be an integer or tuple of ${e} integers. Received: ${s.length} elements.`);for(let n=0;n<e;++n){const i=s[n];if(!tc(i))throw new b(`The ${t} argument must be an integer or tuple of ${e} integers. Received: ${JSON.stringify(s)} including a non-integer number ${i}`)}return s}function it(s,e,t,n,i=1){if(s==null)return s;const o=e+(e-1)*(i-1);let r;return t==="same"?r=s:r=s-o+1,Math.floor((r+n-1)/n)}function Fe(s,e,t,n){if(s==null)return null;if(n==="valid")s=s*e+tr([t-e,0]);else if(n==="same")s=s*e;else throw new b(`Unsupport padding mode: ${n}.`);return s}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function Dr(s,e){return v(()=>(te(e),e==="channelsFirst"?Z(s,[0,2,3,1]):s))}function zr(s,e){return v(()=>(te(e),e==="channelsFirst"?Z(s,[0,2,3,4,1]):s))}function Ic(s,e,t,n=1,i="valid",o,r=1){return v(()=>{if(o==null&&(o=Ct()),te(o),s.shape.length!==3)throw new b(`The input of a conv1dWithBias operation should be 3, but is ${s.shape.length} instead.`);if(e.shape.length!==3)throw new b(`The kernel for a conv1dWithBias operation should be 3, but is ${e.shape.length} instead`);if(t!=null&&t.shape.length!==1)throw new b(`The bias for a conv1dWithBias operation should be 1, but is ${t.shape.length} instead`);if(o==="channelsFirst"&&(s=Z(s,[0,2,1])),i==="causal")throw new B("The support for CAUSAL padding mode in conv1dWithBias is not implemented yet.");let a=Cl(s,e,n,i==="same"?"same":"valid","NWC",r);return t!=null&&(a=ns(a,t)),a})}function Xi(s,e,t,n=[1,1],i="valid",o,r,a=null){return v(()=>{if(o==null&&(o=Ct()),te(o),s.rank!==3&&s.rank!==4)throw new b(`conv2dWithBiasActivation expects input to be of rank 3 or 4, but received ${s.rank}.`);if(e.rank!==3&&e.rank!==4)throw new b(`conv2dWithBiasActivation expects kernel to be of rank 3 or 4, but received ${s.rank}.`);let l=Dr(s,o);if(i==="causal")throw new B("The support for CAUSAL padding mode in conv1dWithBias is not implemented yet.");return l=vl({x:l,filter:e,strides:n,pad:i==="same"?"same":"valid",dilations:r,dataFormat:"NHWC",bias:t,activation:a}),o==="channelsFirst"&&(l=Z(l,[0,3,1,2])),l})}function $c(s,e,t,n=[1,1,1],i="valid",o,r){return v(()=>{if(o==null&&(o=Ct()),te(o),s.rank!==4&&s.rank!==5)throw new b(`conv3dWithBias expects input to be of rank 4 or 5, but received ${s.rank}.`);if(e.rank!==4&&e.rank!==5)throw new b(`conv3dWithBias expects kernel to be of rank 4 or 5, but received ${s.rank}.`);let a=zr(s,o);if(i==="causal")throw new B("The support for CAUSAL padding mode in conv3dWithBias is not implemented yet.");return a=_l(a,e,n,i==="same"?"same":"valid","NDHWC",r),t!=null&&(a=ns(a,t)),o==="channelsFirst"&&(a=Z(a,[0,4,1,2,3])),a})}class li extends De{constructor(e,t){if(super(t),this.bias=null,this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_BIAS_INITIALIZER="zeros",li.verifyArgs(t),this.rank=e,qe(this.rank,"rank"),this.rank!==1&&this.rank!==2&&this.rank!==3)throw new B(`Convolution layer for rank other than 1, 2, or 3 (${this.rank}) is not implemented yet.`);if(this.kernelSize=fn(t.kernelSize,e,"kernelSize"),this.strides=fn(t.strides==null?1:t.strides,e,"strides"),this.padding=t.padding==null?"valid":t.padding,Ie(this.padding),this.dataFormat=t.dataFormat==null?"channelsLast":t.dataFormat,te(this.dataFormat),this.activation=cc(t.activation),this.useBias=t.useBias==null?!0:t.useBias,this.biasInitializer=qt(t.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.biasConstraint=Ts(t.biasConstraint),this.biasRegularizer=Kt(t.biasRegularizer),this.activityRegularizer=Kt(t.activityRegularizer),this.dilationRate=fn(t.dilationRate==null?1:t.dilationRate,e,"dilationRate"),this.rank===1&&Array.isArray(this.dilationRate)&&this.dilationRate.length!==1)throw new b(`dilationRate must be a number or an array of a single number for 1D convolution, but received ${JSON.stringify(this.dilationRate)}`);if(this.rank===2){if(typeof this.dilationRate=="number")this.dilationRate=[this.dilationRate,this.dilationRate];else if(this.dilationRate.length!==2)throw new b(`dilationRate must be a number or array of two numbers for 2D convolution, but received ${JSON.stringify(this.dilationRate)}`)}else if(this.rank===3){if(typeof this.dilationRate=="number")this.dilationRate=[this.dilationRate,this.dilationRate,this.dilationRate];else if(this.dilationRate.length!==3)throw new b(`dilationRate must be a number or array of three numbers for 3D convolution, but received ${JSON.stringify(this.dilationRate)}`)}}static verifyArgs(e){if(Me("kernelSize"in e,"required key 'kernelSize' not in config"),typeof e.kernelSize!="number"&&!Jn(e.kernelSize,"number",1,3))throw new b(`BaseConv expects config.kernelSize to be number or number[] with length 1, 2, or 3, but received ${JSON.stringify(e.kernelSize)}.`)}getConfig(){const e={kernelSize:this.kernelSize,strides:this.strides,padding:this.padding,dataFormat:this.dataFormat,dilationRate:this.dilationRate,activation:uc(this.activation),useBias:this.useBias,biasInitializer:Ls(this.biasInitializer),biasRegularizer:Yt(this.biasRegularizer),activityRegularizer:Yt(this.activityRegularizer),biasConstraint:Es(this.biasConstraint)},t=super.getConfig();return Object.assign(e,t),e}}class _t extends li{constructor(e,t){super(e,t),this.kernel=null,_t.verifyArgs(t),this.filters=t.filters,qe(this.filters,"filters"),this.kernelInitializer=qt(t.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.kernelConstraint=Ts(t.kernelConstraint),this.kernelRegularizer=Kt(t.kernelRegularizer)}build(e){e=Re(e);const t=this.dataFormat==="channelsFirst"?1:e.length-1;if(e[t]==null)throw new b(`The channel dimension of the input should be defined. Found ${e[t]}`);const n=e[t],i=this.kernelSize.concat([n,this.filters]);this.kernel=this.addWeight("kernel",i,null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[{ndim:this.rank+2,axes:{[t]:n}}],this.built=!0}call(e,t){return v(()=>{e=ye(e);let n;const i=this.bias==null?null:this.bias.read(),o=Ju(this.activation.getClassName());if(o!=null&&this.rank===2)n=Xi(e,this.kernel.read(),i,this.strides,this.padding,this.dataFormat,this.dilationRate,o);else{if(this.rank===1)n=Ic(e,this.kernel.read(),i,this.strides[0],this.padding,this.dataFormat,this.dilationRate[0]);else if(this.rank===2)n=Xi(e,this.kernel.read(),i,this.strides,this.padding,this.dataFormat,this.dilationRate);else if(this.rank===3)n=$c(e,this.kernel.read(),i,this.strides,this.padding,this.dataFormat,this.dilationRate);else throw new B("convolutions greater than 3D are not implemented yet.");this.activation!=null&&(n=this.activation.apply(n))}return n})}computeOutputShape(e){e=Re(e);const t=[],n=this.dataFormat==="channelsLast"?e.slice(1,e.length-1):e.slice(2);for(let o=0;o<n.length;++o){const r=it(n[o],this.kernelSize[o],this.padding,this.strides[o],typeof this.dilationRate=="number"?this.dilationRate:this.dilationRate[o]);t.push(r)}let i=[e[0]];return this.dataFormat==="channelsLast"?(i=i.concat(t),i.push(this.filters)):(i.push(this.filters),i=i.concat(t)),i}getConfig(){const e={filters:this.filters,kernelInitializer:Ls(this.kernelInitializer),kernelRegularizer:Yt(this.kernelRegularizer),kernelConstraint:Es(this.kernelConstraint)},t=super.getConfig();return Object.assign(e,t),e}static verifyArgs(e){if(!("filters"in e)||typeof e.filters!="number"||e.filters<1)throw new b(`Convolution layer expected config.filters to be a 'number' > 0 but got ${JSON.stringify(e.filters)}`)}}class It extends _t{constructor(e){super(2,e),It.verifyArgs(e)}getConfig(){const e=super.getConfig();return delete e.rank,e}static verifyArgs(e){if(typeof e.kernelSize!="number"&&!Jn(e.kernelSize,"number",1,2))throw new b(`Conv2D expects config.kernelSize to be number or number[] with length 1 or 2, but received ${JSON.stringify(e.kernelSize)}.`)}}It.className="Conv2D";I(It);class os extends _t{constructor(e){super(3,e),os.verifyArgs(e)}getConfig(){const e=super.getConfig();return delete e.rank,e}static verifyArgs(e){if(typeof e.kernelSize!="number"&&!(Array.isArray(e.kernelSize)&&(e.kernelSize.length===1||e.kernelSize.length===3)))throw new b(`Conv3D expects config.kernelSize to be number or [number, number, number], but received ${JSON.stringify(e.kernelSize)}.`)}}os.className="Conv3D";I(os);class Br extends It{constructor(e){if(super(e),this.inputSpec=[new Ue({ndim:4})],this.padding!=="same"&&this.padding!=="valid")throw new b(`Conv2DTranspose currently supports only padding modes 'same' and 'valid', but received padding mode ${this.padding}`)}build(e){if(e=Re(e),e.length!==4)throw new b("Input should have rank 4; Received input shape: "+JSON.stringify(e));const t=this.dataFormat==="channelsFirst"?1:e.length-1;if(e[t]==null)throw new b("The channel dimension of the inputs should be defined. Found `None`.");const n=e[t],i=this.kernelSize.concat([this.filters,n]);this.kernel=this.addWeight("kernel",i,"float32",this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[new Ue({ndim:4,axes:{[t]:n}})],this.built=!0}call(e,t){return v(()=>{let n=ye(e);if(n.shape.length!==4)throw new b(`Conv2DTranspose.call() expects input tensor to be rank-4, but received a tensor of rank-${n.shape.length}`);const i=n.shape,o=i[0];let r,a;this.dataFormat==="channelsFirst"?(r=2,a=3):(r=1,a=2);const l=i[r],u=i[a],c=this.kernelSize[0],h=this.kernelSize[1],d=this.strides[0],m=this.strides[1],p=Fe(l,d,c,this.padding),f=Fe(u,m,h,this.padding),g=[o,p,f,this.filters];this.dataFormat!=="channelsLast"&&(n=Z(n,[0,2,3,1]));let w=Il(n,this.kernel.read(),g,this.strides,this.padding);return this.dataFormat!=="channelsLast"&&(w=Z(w,[0,3,1,2])),this.bias!=null&&(w=ns(w,this.bias.read(),this.dataFormat)),this.activation!=null&&(w=this.activation.apply(w)),w})}computeOutputShape(e){e=Re(e);const t=e.slice();let n,i,o;this.dataFormat==="channelsFirst"?(n=1,i=2,o=3):(n=3,i=1,o=2);const r=this.kernelSize[0],a=this.kernelSize[1],l=this.strides[0],u=this.strides[1];return t[n]=this.filters,t[i]=Fe(t[i],l,r,this.padding),t[o]=Fe(t[o],u,a,this.padding),t}getConfig(){const e=super.getConfig();return delete e.dilationRate,e}}Br.className="Conv2DTranspose";I(Br);class Mr extends os{constructor(e){if(super(e),this.inputSpec=[new Ue({ndim:5})],this.padding!=="same"&&this.padding!=="valid")throw new b(`Conv3DTranspose currently supports only padding modes 'same' and 'valid', but received padding mode ${this.padding}`)}build(e){if(e=Re(e),e.length!==5)throw new b("Input should have rank 5; Received input shape: "+JSON.stringify(e));const t=this.dataFormat==="channelsFirst"?1:e.length-1;if(e[t]==null)throw new b("The channel dimension of the inputs should be defined. Found `None`.");const n=e[t],i=this.kernelSize.concat([this.filters,n]);this.kernel=this.addWeight("kernel",i,"float32",this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[new Ue({ndim:5,axes:{[t]:n}})],this.built=!0}call(e,t){return v(()=>{let n=ye(e);if(n.shape.length!==5)throw new b(`Conv3DTranspose.call() expects input tensor to be rank-4, but received a tensor of rank-${n.shape.length}`);const i=n.shape,o=i[0];let r,a,l;this.dataFormat==="channelsFirst"?(l=2,r=3,a=4):(l=1,r=2,a=3);const u=i[l],c=i[r],h=i[a],d=this.kernelSize[0],m=this.kernelSize[1],p=this.kernelSize[2],f=this.strides[0],g=this.strides[1],w=this.strides[2],y=Fe(u,f,d,this.padding),x=Fe(c,g,m,this.padding),S=Fe(h,w,p,this.padding),A=[o,y,x,S,this.filters];this.dataFormat!=="channelsLast"&&(n=Z(n,[0,2,3,4,1]));let C=$l(n,this.kernel.read(),A,this.strides,this.padding);return this.dataFormat!=="channelsLast"&&(C=Z(C,[0,4,1,2,3])),this.bias!==null&&(C=ns(C,this.bias.read(),this.dataFormat)),this.activation!==null&&(C=this.activation.apply(C)),C})}computeOutputShape(e){e=Re(e);const t=e.slice();let n,i,o,r;this.dataFormat==="channelsFirst"?(n=1,i=2,o=3,r=4):(n=4,i=1,o=2,r=3);const a=this.kernelSize[0],l=this.kernelSize[1],u=this.kernelSize[2],c=this.strides[0],h=this.strides[1],d=this.strides[2];return t[n]=this.filters,t[i]=Fe(t[i],c,a,this.padding),t[o]=Fe(t[o],h,l,this.padding),t[r]=Fe(t[r],d,u,this.padding),t}getConfig(){const e=super.getConfig();return delete e.dilationRate,e}}Mr.className="Conv3DTranspose";I(Mr);class Fr extends _t{constructor(e,t){if(super(e,t),this.DEFAULT_DEPTHWISE_INITIALIZER="glorotUniform",this.DEFAULT_POINTWISE_INITIALIZER="glorotUniform",this.depthwiseKernel=null,this.pointwiseKernel=null,t.filters==null)throw new b("The `filters` configuration field is required by SeparableConv, but is unspecified.");if(t.kernelInitializer!=null||t.kernelRegularizer!=null||t.kernelConstraint!=null)throw new b("Fields kernelInitializer, kernelRegularizer and kernelConstraint are invalid for SeparableConv2D. Use depthwiseInitializer, depthwiseRegularizer, depthwiseConstraint, pointwiseInitializer, pointwiseRegularizer and pointwiseConstraint instead.");if(t.padding!=null&&t.padding!=="same"&&t.padding!=="valid")throw new b(`SeparableConv${this.rank}D supports only padding modes: 'same' and 'valid', but received ${JSON.stringify(t.padding)}`);this.depthMultiplier=t.depthMultiplier==null?1:t.depthMultiplier,this.depthwiseInitializer=qt(t.depthwiseInitializer||this.DEFAULT_DEPTHWISE_INITIALIZER),this.depthwiseRegularizer=Kt(t.depthwiseRegularizer),this.depthwiseConstraint=Ts(t.depthwiseConstraint),this.pointwiseInitializer=qt(t.depthwiseInitializer||this.DEFAULT_POINTWISE_INITIALIZER),this.pointwiseRegularizer=Kt(t.pointwiseRegularizer),this.pointwiseConstraint=Ts(t.pointwiseConstraint)}build(e){if(e=Re(e),e.length<this.rank+2)throw new b(`Inputs to SeparableConv${this.rank}D should have rank ${this.rank+2}, but received input shape: ${JSON.stringify(e)}`);const t=this.dataFormat==="channelsFirst"?1:e.length-1;if(e[t]==null||e[t]<0)throw new b(`The channel dimension of the inputs should be defined, but found ${JSON.stringify(e[t])}`);const n=e[t],i=this.kernelSize.concat([n,this.depthMultiplier]),o=[];for(let a=0;a<this.rank;++a)o.push(1);o.push(n*this.depthMultiplier,this.filters);const r=!0;this.depthwiseKernel=this.addWeight("depthwise_kernel",i,"float32",this.depthwiseInitializer,this.depthwiseRegularizer,r,this.depthwiseConstraint),this.pointwiseKernel=this.addWeight("pointwise_kernel",o,"float32",this.pointwiseInitializer,this.pointwiseRegularizer,r,this.pointwiseConstraint),this.useBias?this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,r,this.biasConstraint):this.bias=null,this.inputSpec=[new Ue({ndim:this.rank+2,axes:{[t]:n}})],this.built=!0}call(e,t){return v(()=>{e=ye(e);let n;if(this.rank===1)throw new B("1D separable convolution is not implemented yet.");return this.rank===2&&(this.dataFormat==="channelsFirst"&&(e=Z(e,[0,2,3,1])),n=Nl(e,this.depthwiseKernel.read(),this.pointwiseKernel.read(),this.strides,this.padding,this.dilationRate,"NHWC")),this.useBias&&(n=ns(n,this.bias.read(),this.dataFormat)),this.activation!=null&&(n=this.activation.apply(n)),this.dataFormat==="channelsFirst"&&(n=Z(n,[0,3,1,2])),n})}getConfig(){const e=super.getConfig();return delete e.rank,delete e.kernelInitializer,delete e.kernelRegularizer,delete e.kernelConstraint,e.depthwiseInitializer=Ls(this.depthwiseInitializer),e.pointwiseInitializer=Ls(this.pointwiseInitializer),e.depthwiseRegularizer=Yt(this.depthwiseRegularizer),e.pointwiseRegularizer=Yt(this.pointwiseRegularizer),e.depthwiseConstraint=Es(this.depthwiseConstraint),e.pointwiseConstraint=Es(this.pointwiseConstraint),e}}Fr.className="SeparableConv";class Ur extends Fr{constructor(e){super(2,e)}}Ur.className="SeparableConv2D";I(Ur);class Ks extends _t{constructor(e){super(1,e),Ks.verifyArgs(e),this.inputSpec=[{ndim:3}]}getConfig(){const e=super.getConfig();return delete e.rank,delete e.dataFormat,e}static verifyArgs(e){if(typeof e.kernelSize!="number"&&!Jn(e.kernelSize,"number",1,1))throw new b(`Conv1D expects config.kernelSize to be number or number[] with length 1, but received ${JSON.stringify(e.kernelSize)}.`)}}Ks.className="Conv1D";I(Ks);class Wr extends De{constructor(e){super(e),typeof e.cropping=="number"?this.cropping=[[e.cropping,e.cropping],[e.cropping,e.cropping]]:typeof e.cropping[0]=="number"?this.cropping=[[e.cropping[0],e.cropping[0]],[e.cropping[1],e.cropping[1]]]:this.cropping=e.cropping,this.dataFormat=e.dataFormat===void 0?"channelsLast":e.dataFormat,this.inputSpec=[{ndim:4}]}computeOutputShape(e){return this.dataFormat==="channelsFirst"?[e[0],e[1],e[2]-this.cropping[0][0]-this.cropping[0][1],e[3]-this.cropping[1][0]-this.cropping[1][1]]:[e[0],e[1]-this.cropping[0][0]-this.cropping[0][1],e[2]-this.cropping[1][0]-this.cropping[1][1],e[3]]}call(e,t){return v(()=>{if(e=ye(e),this.dataFormat==="channelsLast"){const n=ds(e,this.cropping[0][0],e.shape[1]-this.cropping[0][0]-this.cropping[0][1],2);return ds(n,this.cropping[1][0],e.shape[2]-this.cropping[1][1]-this.cropping[1][0],3)}else{const n=ds(e,this.cropping[0][0],e.shape[2]-this.cropping[0][0]-this.cropping[0][1],3);return ds(n,this.cropping[1][0],e.shape[3]-this.cropping[1][1]-this.cropping[1][0],4)}})}getConfig(){const e={cropping:this.cropping,dataFormat:this.dataFormat},t=super.getConfig();return Object.assign(e,t),e}}Wr.className="Cropping2D";I(Wr);class ui extends De{constructor(e){super(e),this.DEFAULT_SIZE=[2,2],this.inputSpec=[{ndim:4}],this.size=e.size==null?this.DEFAULT_SIZE:e.size,this.dataFormat=e.dataFormat==null?"channelsLast":e.dataFormat,te(this.dataFormat),this.interpolation=e.interpolation==null?"nearest":e.interpolation,Qu(this.interpolation)}computeOutputShape(e){if(this.dataFormat==="channelsFirst"){const t=e[2]==null?null:this.size[0]*e[2],n=e[3]==null?null:this.size[1]*e[3];return[e[0],e[1],t,n]}else{const t=e[1]==null?null:this.size[0]*e[1],n=e[2]==null?null:this.size[1]*e[2];return[e[0],t,n,e[3]]}}call(e,t){return v(()=>{let n=ye(e);const i=n.shape;if(this.dataFormat==="channelsFirst"){n=Z(n,[0,2,3,1]);const o=this.size[0]*i[2],r=this.size[1]*i[3],a=this.interpolation==="nearest"?cs.resizeNearestNeighbor(n,[o,r]):cs.resizeBilinear(n,[o,r]);return Z(a,[0,3,1,2])}else{const o=this.size[0]*i[1],r=this.size[1]*i[2];return this.interpolation==="nearest"?cs.resizeNearestNeighbor(n,[o,r]):cs.resizeBilinear(n,[o,r])}})}getConfig(){const e={size:this.size,dataFormat:this.dataFormat,interpolation:this.interpolation},t=super.getConfig();return Object.assign(e,t),e}}ui.className="UpSampling2D";I(ui);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function Xs(s,e,t,n,i,o){return v(()=>{te(i),Jo(o),Ie(n),t==null&&(t=[1,1]),n==null&&(n="valid"),i==null&&(i=Ct()),o==null&&(o="max"),s=Dr(s,i);let r;const a=n==="same"?"same":"valid";return o==="max"?r=El(s,e,t,a):r=kl(s,e,t,a),i==="channelsFirst"&&(r=Z(r,[0,3,1,2])),r})}function Gr(s,e,t,n,i,o){return v(()=>{te(i),Jo(o),Ie(n),t==null&&(t=[1,1,1]),n==null&&(n="valid"),i==null&&(i=Ct()),o==null&&(o="max"),s=zr(s,i);let r;const a=n==="same"?"same":"valid";return o==="max"?r=Tl(s,e,t,a):r=Ll(s,e,t,a),i==="channelsFirst"&&(r=Z(r,[0,4,1,2,3])),r})}class Vr extends De{constructor(e){if(e.poolSize==null&&(e.poolSize=2),super(e),typeof e.poolSize=="number")this.poolSize=[e.poolSize];else if(Array.isArray(e.poolSize)&&e.poolSize.length===1&&typeof e.poolSize[0]=="number")this.poolSize=e.poolSize;else throw new b(`poolSize for 1D convolutional layer must be a number or an Array of a single number, but received ${JSON.stringify(e.poolSize)}`);if(qe(this.poolSize,"poolSize"),e.strides==null)this.strides=this.poolSize;else if(typeof e.strides=="number")this.strides=[e.strides];else if(Array.isArray(e.strides)&&e.strides.length===1&&typeof e.strides[0]=="number")this.strides=e.strides;else throw new b(`strides for 1D convolutional layer must be a number or an Array of a single number, but received ${JSON.stringify(e.strides)}`);qe(this.strides,"strides"),this.padding=e.padding==null?"valid":e.padding,Ie(this.padding),this.inputSpec=[new Ue({ndim:3})]}computeOutputShape(e){e=Re(e);const t=it(e[1],this.poolSize[0],this.padding,this.strides[0]);return[e[0],t,e[2]]}call(e,t){return v(()=>{this.invokeCallHook(e,t),e=Qn(ye(e),2);const n=this.poolingFunction(ye(e),[this.poolSize[0],1],[this.strides[0],1],this.padding,"channelsLast");return Gn(n,[2])})}getConfig(){const e={poolSize:this.poolSize,padding:this.padding,strides:this.strides},t=super.getConfig();return Object.assign(e,t),e}}class Hr extends Vr{constructor(e){super(e)}poolingFunction(e,t,n,i,o){return te(o),Ie(i),Xs(e,t,n,i,o,"max")}}Hr.className="MaxPooling1D";I(Hr);class jr extends Vr{constructor(e){super(e)}poolingFunction(e,t,n,i,o){return te(o),Ie(i),Xs(e,t,n,i,o,"avg")}}jr.className="AveragePooling1D";I(jr);class qr extends De{constructor(e){if(e.poolSize==null&&(e.poolSize=[2,2]),super(e),this.poolSize=Array.isArray(e.poolSize)?e.poolSize:[e.poolSize,e.poolSize],e.strides==null)this.strides=this.poolSize;else if(Array.isArray(e.strides)){if(e.strides.length!==2)throw new b(`If the strides property of a 2D pooling layer is an Array, it is expected to have a length of 2, but received length ${e.strides.length}.`);this.strides=e.strides}else this.strides=[e.strides,e.strides];qe(this.poolSize,"poolSize"),qe(this.strides,"strides"),this.padding=e.padding==null?"valid":e.padding,this.dataFormat=e.dataFormat==null?"channelsLast":e.dataFormat,te(this.dataFormat),Ie(this.padding),this.inputSpec=[new Ue({ndim:4})]}computeOutputShape(e){e=Re(e);let t=this.dataFormat==="channelsFirst"?e[2]:e[1],n=this.dataFormat==="channelsFirst"?e[3]:e[2];return t=it(t,this.poolSize[0],this.padding,this.strides[0]),n=it(n,this.poolSize[1],this.padding,this.strides[1]),this.dataFormat==="channelsFirst"?[e[0],e[1],t,n]:[e[0],t,n,e[3]]}call(e,t){return v(()=>(this.invokeCallHook(e,t),this.poolingFunction(ye(e),this.poolSize,this.strides,this.padding,this.dataFormat)))}getConfig(){const e={poolSize:this.poolSize,padding:this.padding,strides:this.strides,dataFormat:this.dataFormat},t=super.getConfig();return Object.assign(e,t),e}}class ci extends qr{constructor(e){super(e)}poolingFunction(e,t,n,i,o){return te(o),Ie(i),Xs(e,t,n,i,o,"max")}}ci.className="MaxPooling2D";I(ci);class Yr extends qr{constructor(e){super(e)}poolingFunction(e,t,n,i,o){return te(o),Ie(i),Xs(e,t,n,i,o,"avg")}}Yr.className="AveragePooling2D";I(Yr);class Kr extends De{constructor(e){if(e.poolSize==null&&(e.poolSize=[2,2,2]),super(e),this.poolSize=Array.isArray(e.poolSize)?e.poolSize:[e.poolSize,e.poolSize,e.poolSize],e.strides==null)this.strides=this.poolSize;else if(Array.isArray(e.strides)){if(e.strides.length!==3)throw new b(`If the strides property of a 3D pooling layer is an Array, it is expected to have a length of 3, but received length ${e.strides.length}.`);this.strides=e.strides}else this.strides=[e.strides,e.strides,e.strides];qe(this.poolSize,"poolSize"),qe(this.strides,"strides"),this.padding=e.padding==null?"valid":e.padding,this.dataFormat=e.dataFormat==null?"channelsLast":e.dataFormat,te(this.dataFormat),Ie(this.padding),this.inputSpec=[new Ue({ndim:5})]}computeOutputShape(e){e=Re(e);let t=this.dataFormat==="channelsFirst"?e[2]:e[1],n=this.dataFormat==="channelsFirst"?e[3]:e[2],i=this.dataFormat==="channelsFirst"?e[4]:e[3];return t=it(t,this.poolSize[0],this.padding,this.strides[0]),n=it(n,this.poolSize[1],this.padding,this.strides[1]),i=it(i,this.poolSize[2],this.padding,this.strides[2]),this.dataFormat==="channelsFirst"?[e[0],e[1],t,n,i]:[e[0],t,n,i,e[4]]}call(e,t){return v(()=>(this.invokeCallHook(e,t),this.poolingFunction(ye(e),this.poolSize,this.strides,this.padding,this.dataFormat)))}getConfig(){const e={poolSize:this.poolSize,padding:this.padding,strides:this.strides,dataFormat:this.dataFormat},t=super.getConfig();return Object.assign(e,t),e}}class Xr extends Kr{constructor(e){super(e)}poolingFunction(e,t,n,i,o){return te(o),Ie(i),Gr(e,t,n,i,o,"max")}}Xr.className="MaxPooling3D";I(Xr);class Jr extends Kr{constructor(e){super(e)}poolingFunction(e,t,n,i,o){return te(o),Ie(i),Gr(e,t,n,i,o,"avg")}}Jr.className="AveragePooling3D";I(Jr);class Qr extends De{constructor(e){super(e),this.inputSpec=[new Ue({ndim:3})]}computeOutputShape(e){return[e[0],e[2]]}call(e,t){throw new B}}class Zr extends Qr{constructor(e){super(e||{})}call(e,t){return v(()=>{const n=ye(e);return oe(n,1)})}}Zr.className="GlobalAveragePooling1D";I(Zr);class ea extends Qr{constructor(e){super(e||{})}call(e,t){return v(()=>{const n=ye(e);return Cs(n,1)})}}ea.className="GlobalMaxPooling1D";I(ea);class ta extends De{constructor(e){super(e),this.dataFormat=e.dataFormat==null?"channelsLast":e.dataFormat,te(this.dataFormat),this.inputSpec=[new Ue({ndim:4})]}computeOutputShape(e){return e=e,this.dataFormat==="channelsLast"?[e[0],e[3]]:[e[0],e[1]]}call(e,t){throw new B}getConfig(){const e={dataFormat:this.dataFormat},t=super.getConfig();return Object.assign(e,t),e}}class sa extends ta{call(e,t){return v(()=>{const n=ye(e);return this.dataFormat==="channelsLast"?oe(n,[1,2]):oe(n,[2,3])})}}sa.className="GlobalAveragePooling2D";I(sa);class na extends ta{call(e,t){return v(()=>{const n=ye(e);return this.dataFormat==="channelsLast"?Cs(n,[1,2]):Cs(n,[2,3])})}}na.className="GlobalMaxPooling2D";I(na);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function Os(s,e){return v(()=>{s.dtype!=="float32"&&(s=Se(s,"float32"));const t=xe(ss(s),e,!0),n=Rl(t.shape,ee()),i=Wn(es(t,n));return he(s,i)})}function Js(s,e){return v(()=>oe(ss(Ae(e,s)),-1))}function hi(s,e){return v(()=>oe(gt(Ae(e,s)),-1))}function di(s,e){return v(()=>{const t=Ae(s,e),n=Oe(gt(s),ee(),Number.MAX_VALUE),i=gt(he(t,n));return L(100,oe(i,-1))})}function Nc(s,e){return v(()=>{const t=Oe(e,ee(),Number.MAX_VALUE),n=yt(H(1,t)),i=Oe(s,ee(),Number.MAX_VALUE),o=yt(H(1,i));return oe(ss(Ae(n,o)),-1)})}function Ec(s,e){return v(()=>{const t=es(0,Ae(1,L(s,e)));return oe(ss(t),-1)})}function Tc(s,e){return v(()=>{const t=es(0,Ae(1,L(s,e)));return oe(t,-1)})}function Lc(s,e){return v(()=>{const t=xe(L(s,e),-1),n=Cs(L(Ae(1,s),e),-1);return es(0,H(1,Ae(n,t)))})}function kc(s,e){return v(()=>{const t=Math.log(2),n=Ae(e,s),i=Ae(H(n,Fn(L(-2,n))),t);return oe(i,-1)})}function Xt(s,e,t=!1){return v(()=>{if(t)e=Mo(e);else{const n=xe(e,e.shape.length-1,!0);e=he(e,n)}return e=Oe(e,ee(),1-ee()),Vn(xe(L(Se(s,"float32"),yt(e)),e.shape.length-1))})}function Rs(s,e,t=!1){return v(()=>{const n=Se(Pl(sc(s)),"int32");e=Oe(e,ee(),1-ee());const i=e.shape,o=X(Ol(n,i[i.length-1]),i);return Xt(o,e,t)})}function Pc(s,e){if(!Ye(s.shape,e.shape))throw new b(`logits and labels must have the same shape, but got shapes ${JSON.stringify(s.shape)} and ${JSON.stringify(e.shape)}`);return v(()=>{const t=qs(e),n=Vn(gt(e));return H(Ae(t,L(e,s)),Dl(zl(n)))})}function Qs(s,e){return v(()=>{let t;return t=Oe(e,ee(),1-ee()),t=yt(he(t,Ae(1,t))),oe(Pc(s,t),-1)})}function Oc(s,e){return v(()=>{const t=Oe(s,ee(),1),n=Oe(e,ee(),1);return xe(L(s,yt(he(t,n))),-1)})}function Rc(s,e){return v(()=>{const t=yt(H(ee(),e));return oe(Ae(e,L(s,t)),-1)})}function ia(s,e){return v(()=>{const t=Os(s,-1),n=Os(e,-1),i=L(t,n);return Vn(xe(i,-1))})}const Ds={meanSquaredError:Js,meanAbsoluteError:hi,meanAbsolutePercentageError:di,meanSquaredLogarithmicError:Nc,squaredHinge:Ec,hinge:Tc,categoricalHinge:Lc,logcosh:kc,categoricalCrossentropy:Xt,sparseCategoricalCrossentropy:Rs,binaryCrossentropy:Qs,kullbackLeiblerDivergence:Oc,poisson:Rc,cosineProximity:ia};function pn(s){if(typeof s=="string"){if(s in Ds)return Ds[s];let e=`Unknown loss ${s}`;throw s.toLowerCase().includes("softmaxcrossentropy")&&(e=`Unknown loss ${s}. Use "categoricalCrossentropy" as the string name for tf.losses.softmaxCrossEntropy`),new b(e)}else return s}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */class ct extends De{constructor(e){super(e||{}),this.supportsMasking=!0}mergeFunction(e){throw new B}computeElementwiseOpOutputShape(e,t){if(e==null||t==null)return null;if(e.length<t.length)return this.computeElementwiseOpOutputShape(t,e);if(t.length===0)return e;const n=e.slice(0,e.length-t.length);for(let i=0;i<t.length;++i){const o=e[e.length-t.length+i],r=t[i];if(o==null||r==null||o<0||r<0)n.push(null);else if(o===1)n.push(r);else if(r===1)n.push(o);else{if(o!==r)throw new b("Operands could not be broadcast together with shapes "+JSON.stringify(e)+" "+JSON.stringify(t));n.push(o)}}return n}build(e){if(Array.isArray(e)&&!Array.isArray(e[0])&&(e=[Re(e)]),e=e,e.length<2)throw new b(`A merge layer should be called on an Array of at least 2 inputs. Got ${e.length} input(s).`);let t=[];for(const o of e)o!=null&&o[0]!==null&&t.push(o[0]);if(t=st(t),t.length>1)throw new b(`Can not merge tensors with different batch sizes. Got tensors with shapes: ${JSON.stringify(e)}.`);let n=e[0]==null?null:e[0].slice(1);for(let o=1;o<e.length;++o){const r=e[o]==null?null:e[o].slice(1);n=this.computeElementwiseOpOutputShape(n,r)}const i=e.map(o=>o.length);e.indexOf(null)===-1&&st(i).length===1?this.reshapeRequired=!1:this.reshapeRequired=!0}call(e,t){return v(()=>{if(e=e,this.reshapeRequired){const n=[],i=e.map(o=>o.rank);if(i.indexOf(null)===-1){const o=tr(i);for(let r of e){const a=r.rank;for(let l=0;l<o-a;++l)r=Qn(r,1);n.push(r)}return this.mergeFunction(n)}else{let o=!1;for(const l of e){const u=l.rank;if(u==null){const c=l.shape,h=c[0],d=c.slice(1).concat([h]);let m=X(l,[h].concat(Ft(c.slice(1))));m=Z(m,[1,0]),m=X(m,d),n.push(m),o=!0}else if(u>1){const c=Ns(1,u).concat([0]);n.push(Z(l,c)),o=!0}else n.push(l)}let r=this.mergeFunction(n);const a=r.rank;if(o){if(a==null){const l=r.shape,u=l.length,c=l[u-1],h=[c].concat(l.slice(0,l.length-1));r=X(Z(X(r,[-1,c]),[1,0]),h)}else if(a>1){const l=[a-1].concat(Ns(0,a-1));r=Z(r,l)}}return r}}else return this.mergeFunction(e)})}computeOutputShape(e){e=e;let t;e[0]==null?t=null:t=e[0].slice(1);for(let i=1;i<e.length;++i){const o=e[i]==null?null:e[i].slice(1);t=this.computeElementwiseOpOutputShape(t,o)}let n=[];for(const i of e)i!=null&&i[0]!==null&&n.push(i[0]);return n=st(n),n.length===1?t=n.concat(t):t=[null].concat(t),t}computeMask(e,t){return v(()=>{if(t==null)return null;if(!Array.isArray(t))throw new b("`mask` should be an Array");if(!Array.isArray(e))throw new b("`inputs` should be an Array");if(t.length!==e.length)throw new b(`The Array 'inputs' and 'mask' are expected to have the same length, but have different lengths (${e.length} vs ${t.length})`);if(t.every(i=>i==null))return null;t=t.map(i=>i==null?i:Hn(i,0));let n=t[0];for(let i=1;i<t.length-1;++i)n=jn(n,t[i]);return n})}}class oa extends ct{constructor(e){super(e)}mergeFunction(e){return v(()=>{let t=e[0].clone();for(let n=1;n<e.length;++n)t=H(t,e[n]);return t})}}oa.className="Add";I(oa);class ra extends ct{constructor(e){super(e)}mergeFunction(e){return v(()=>{let t=e[0].clone();for(let n=1;n<e.length;++n)t=L(t,e[n]);return t})}}ra.className="Multiply";I(ra);class aa extends ct{constructor(e){super(e)}mergeFunction(e){return v(()=>{let t=e[0].clone();for(let n=1;n<e.length;++n)t=H(t,e[n]);return L(1/e.length,t)})}}aa.className="Average";I(aa);class la extends ct{constructor(e){super(e)}mergeFunction(e){return v(()=>{let t=e[0];for(let n=1;n<e.length;++n)t=es(t,e[n]);return t})}}la.className="Maximum";I(la);class ua extends ct{constructor(e){super(e)}mergeFunction(e){return v(()=>{let t=e[0];for(let n=1;n<e.length;++n)t=zo(t,e[n]);return t})}}ua.className="Minimum";I(ua);class fi extends ct{constructor(e){super(e),this.DEFAULT_AXIS=-1,e==null&&(e={}),this.axis=e.axis==null?this.DEFAULT_AXIS:e.axis,this.supportsMasking=!0,this.reshapeRequired=!1}build(e){if(!(Array.isArray(e)&&Array.isArray(e[0]))||e.length===1)throw new b("A `Concatenate` layer should be called on a list of at least 2 inputs");e=e;let t=!0;for(const i of e)if(i!=null){t=!1;break}if(t)return;const n=[];for(let i=0;i<e.length;++i){const o=e[i].slice();o.splice(this.axis,1);let r=!1;for(const a of n)if(Ye(a,o)){r=!0;break}r||n.push(o)}if(n.length>1)throw new b("A `Concatenate` layer requires inputs with matching shapes except for the concat axis. Got input shapes: "+JSON.stringify(e))}mergeFunction(e){return v(()=>nc(e,this.axis))}computeOutputShape(e){if(!(Array.isArray(e)&&Array.isArray(e[0])))throw new b("A `Concatenate` layer should be called on a list of inputs.");const t=e,n=t[0].slice(),i=this.axis<0?n.length+this.axis:this.axis;for(const o of t.slice(1)){if(n[i]==null||o[i]==null){n[i]=null;break}n[i]+=o[i]}return n}computeMask(e,t){if(t==null)return null;if(!Array.isArray(t))throw new b("`mask` should be an array for Concatenate");if(!Array.isArray(e))throw new b("`inputs` should be an array for Concatenate");if(t.length!==e.length)throw new b(`Mismatch in the length of mask (${t.length}) and the legnth of inputs (${e.length})`);return v(()=>{let n=!0;if(t.forEach(r=>{if(r!=null){n=!1;return}}),n)return null;const i=[];for(let r=0;r<e.length;++r)t[r]==null?i.push(Se(Vo(e[r]),"bool")):t[r].rank<e[r].rank?i.push(Hn(t[r],-1)):i.push(t[r]);const o=Mn(i,this.axis);return Bl(o,-1,!1)})}getConfig(){const e={axis:this.axis},t=super.getConfig();return Object.assign(e,t),e}}fi.className="Concatenate";I(fi);function Lt(s,e){for(;s<0;)s+=e;return s}function Dc(s,e,t){if(s.shape.length>3||e.shape.length>3)throw new B("batchDot is not implemented for tensors of 4D or higher rank yet");if(O(s.shape.length>=2,()=>`batchDot requires the rank of x to be >= 2, but got ${s.shape.length}`),O(s.shape.length>=2,()=>`batchDot requires the rank of y to be >= 2, but got ${e.shape.length}`),typeof t=="number"&&(t=[t,t]),s.dtype==="complex64"||e.dtype==="complex64")throw new B("batchDot is not implemented for complex64-type Tensors yet.");const n=s.shape.length,i=e.shape.length;t==null&&(t=[n-1,i-2]);const o=t;return v(()=>{let r;if(n>i){r=n-i;const l=[];for(let u=0;u<r;++u)l.push(1);e=X(e,e.shape.concat(l))}else if(i>n){r=i-n;const l=[];for(let u=0;u<r;++u)l.push(1);s=X(s,s.shape.concat(l))}else r=0;let a;if(s.shape.length===2&&e.shape.length===2)o[0]===o[1]?a=xe(L(s,e),o[0]):a=xe(L(Z(s,[1,0]),e),o[1]);else{const l=o[0]!==s.shape.length-1,u=o[1]===e.shape.length-1;a=Ml(s,e,l,u)}if(r>0){let l;n>i?l=n+i-3:l=n-1;const u=[];for(let c=l;c<l+r;++c)u.push(c);a=Gn(a,u)}return a.shape.length===1&&(a=Hn(a,1)),a})}class ca extends ct{constructor(e){super(e),this.axes=e.axes,this.normalize=e.normalize==null?!1:e.normalize,this.supportsMasking=!0,this.reshapeRequired=!1}build(e){O(Array.isArray(e)&&e.length===2&&Array.isArray(e[0])&&Array.isArray(e[1]),()=>"A `Dot` layer should be called on a list of exactly 2 inputs.");const t=e[0],n=e[1];if(t.length>3||n.length>3)throw new B("Dot layer does not support tensors of 4D or higher rank yet.");const i=this.interpretAxes(t,n);if(t[i[0]]!==n[i[1]])throw new b(`Dimension incompatibility: ${t[i[0]]} !== ${n[i[1]]}`)}mergeFunction(e){if(e.length!==2)throw new b(`A \`Dot\` layer must be called on exactly 2 inputs, but received ${e.length} input(s).`);let t=e[0],n=e[1],i;return Array.isArray(this.axes)?i=this.axes.map((o,r)=>Lt(o,e[r].shape.length)):i=[Lt(this.axes,t.shape.length),Lt(this.axes,n.shape.length)],this.normalize&&(t=Os(t,i[0]),n=Os(n,i[1])),Dc(t,n,i)}interpretAxes(e,t){let n;return Array.isArray(this.axes)?n=this.axes:n=[Lt(this.axes,e.length),Lt(this.axes,t.length)],n}computeOutputShape(e){O(Array.isArray(e)&&e.length===2&&Array.isArray(e[0])&&Array.isArray(e[1]),()=>"A `Dot` layer should be called on a list of exactly 2 inputs.");const t=e[0].slice(),n=e[1].slice();if(t.length>3||n.length>3)throw new B("Dot layer does not support tensors of 4D or higher rank yet.");const i=this.interpretAxes(t,n);t.splice(i[0],1),n.splice(i[1],1),n.splice(0,1);const o=t.concat(n);return o.length===1&&o.push(1),o}computeMask(e,t){return null}getConfig(){const e={axes:this.axes,normalize:this.normalize},t=super.getConfig();return Object.assign(e,t),e}}ca.className="Dot";I(ca);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */async function Ze(s){if(s==null)return;const e=[],t=[],n=[];for(const i in s){const o=s[i];if(typeof o!="number"){const r=o;e.push(r.data()),t.push(i),n.push(r)}}if(e.length>0){const i=await Promise.all(e);for(let o=0;o<i.length;++o)s[t[o]]=i[o][0];Pe(n)}}function ha(s){if(s!=null)for(const e in s){const t=s[e];typeof t!="number"&&t.dispose()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */var Ji;(function(s){s[s.SILENT=0]="SILENT",s[s.VERBOSE=1]="VERBOSE"})(Ji||(Ji={}));const zc=125;class Jt{constructor(){this.validationData=null}setParams(e){this.params=e}async onEpochBegin(e,t){}async onEpochEnd(e,t){}async onBatchBegin(e,t){}async onBatchEnd(e,t){}async onTrainBegin(e){}async onTrainEnd(e){}setModel(e){}}class Bc{constructor(e,t=10){e==null&&(e=[]),this.callbacks=e,this.queueLength=t}append(e){this.callbacks.push(e)}setParams(e){for(const t of this.callbacks)t.setParams(e)}setModel(e){for(const t of this.callbacks)t.setModel(e)}async onEpochBegin(e,t){t==null&&(t={});for(const n of this.callbacks)await n.onEpochBegin(e,t)}async onEpochEnd(e,t){t==null&&(t={});for(const n of this.callbacks)await n.onEpochEnd(e,t)}async onBatchBegin(e,t){t==null&&(t={});for(const n of this.callbacks)await n.onBatchBegin(e,t)}async onBatchEnd(e,t){t==null&&(t={});for(const n of this.callbacks)await n.onBatchEnd(e,t)}async onTrainBegin(e){e==null&&(e={});for(const t of this.callbacks)await t.onTrainBegin(e)}async onTrainEnd(e){e==null&&(e={});for(const t of this.callbacks)await t.onTrainEnd(e)}}class Mc extends Jt{constructor(){super()}async onEpochBegin(e){this.seen=0,this.totals={}}async onBatchEnd(e,t){t==null&&(t={});const n=t.size==null?0:t.size;this.seen+=n;for(const i in t){const o=t[i];if(typeof o=="number")this.totals.hasOwnProperty(i)||(this.totals[i]=0),this.totals[i]=this.totals[i]+o*n;else{let r;i in this.totals?r=this.totals[i]:this.totals[i]=0;const a=v(()=>H(this.totals[i],L(o,n)));this.totals[i]=a,r?.dispose()}}}async onEpochEnd(e,t){if(t!=null)for(const n of this.params.metrics)this.totals[n]!=null&&(typeof this.totals[n]=="number"?t[n]=this.totals[n]/this.seen:v(()=>{const i=L(he(1,this.seen),this.totals[n]);t[n]=i,this.totals[n].dispose(),zt(t[n])}))}}class Fc extends Jt{async onTrainBegin(e){this.epoch=[],this.history={}}async onEpochEnd(e,t){t==null&&(t={}),this.epoch.push(e);for(const n in t)this.history[n]==null&&(this.history[n]=[]),this.history[n].push(t[n])}async syncData(){const e=[],t=[],n=[];for(const o in this.history){const r=this.history[o];for(let a=0;a<r.length;++a)if(typeof r[a]!="number"){const l=r[a];e.push(l.data()),t.push(o),n.push(a)}}const i=await Promise.all(e);for(let o=0;o<i.length;++o)this.history[t[o]][n[o]].dispose(),this.history[t[o]][n[o]]=i[o][0]}}class Uc extends Jt{constructor(e,t){if(super(),this.currentEpoch=0,this.nowFunc=e.nowFunc,this.nextFrameFunc=e.nextFrameFunc||Fl,this.yieldEvery=t||"auto",this.yieldEvery==="auto"&&(this.yieldEvery=zc),this.yieldEvery==="never"&&e.onYield!=null)throw new Error("yieldEvery is `never` but you provided an `onYield` callback. Either change `yieldEvery` or remove the callback");Ri(this.yieldEvery)&&(this.maybeWait=Xu(this.maybeWait.bind(this),this.yieldEvery,this.nowFunc)),this.trainBegin=e.onTrainBegin,this.trainEnd=e.onTrainEnd,this.epochBegin=e.onEpochBegin,this.epochEnd=e.onEpochEnd,this.batchBegin=e.onBatchBegin,this.batchEnd=e.onBatchEnd,this.yield=e.onYield}async maybeWait(e,t,n){const i=[];this.yield!=null&&(await Ze(n),i.push(this.yield(e,t,n))),i.push(this.nextFrameFunc()),await Promise.all(i)}async onEpochBegin(e,t){this.currentEpoch=e,this.epochBegin!=null&&(await Ze(t),await this.epochBegin(e,t))}async onEpochEnd(e,t){const n=[];this.epochEnd!=null&&(await Ze(t),n.push(this.epochEnd(e,t))),this.yieldEvery==="epoch"&&n.push(this.nextFrameFunc()),await Promise.all(n)}async onBatchBegin(e,t){this.batchBegin!=null&&(await Ze(t),await this.batchBegin(e,t))}async onBatchEnd(e,t){const n=[];this.batchEnd!=null&&(await Ze(t),n.push(this.batchEnd(e,t))),this.yieldEvery==="batch"?n.push(this.nextFrameFunc()):Ri(this.yieldEvery)&&n.push(this.maybeWait(this.currentEpoch,e,t)),await Promise.all(n)}async onTrainBegin(e){this.trainBegin!=null&&(await Ze(e),await this.trainBegin(e))}async onTrainEnd(e){this.trainEnd!=null&&(await Ze(e),await this.trainEnd(e))}}function da(s,e){return s==null&&(s={}),s instanceof Jt?[s]:Array.isArray(s)&&s[0]instanceof Jt?s:V(s).map(n=>new Uc(n,e))}class _e{constructor(){}static registerCallbackConstructor(e,t){O(e>=0&&Number.isInteger(e),()=>`Verbosity level is expected to be an integer >= 0, but got ${e}`),_e.checkForDuplicate(t),_e.constructors[e]==null&&(_e.constructors[e]=[]),_e.constructors[e].push(t)}static checkForDuplicate(e){for(const t in _e.constructors)_e.constructors[+t].forEach(i=>{if(i===e)throw new b("Duplicate callback constructor.")})}static clear(){_e.constructors={}}static createCallbacks(e){const t=[];for(const n in _e.constructors){const i=+n;e>=i&&t.push(..._e.constructors[i])}return t.map(n=>new n)}}_e.constructors={};function fa(s,e,t,n,i,o,r,a,l){const u=new Fc,c=[new Mc,..._e.createCallbacks(e)];s!=null&&c.push(...s),c.push(u);const h=new Bc(c);return h.setParams({epochs:t,initialEpoch:n,samples:i,steps:o,batchSize:r,verbose:e,doValidation:a,metrics:l}),{callbackList:h,history:u}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function pa(s,e={},t=!1){return ts(s,Qt.getMap().classNameMap,e,"layer",t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function ma(s,e){return v(()=>{const t=L(.5,Vo(e)),n=sr(Ho(e,t),s.dtype);return oe(at(s,n),-1)})}function ga(s,e){return v(()=>sr(at(_s(s,-1),_s(e,-1)),"float32"))}function Wc(s,e){return v(()=>Se(xe(jn(at(s,1),at(e,1))),"float32"))}function Gc(s,e){return v(()=>Se(xe(jn(at(s,0),at(e,1))),"float32"))}function Vc(s,e){return v(()=>{const t=Wc(s,e),n=Gc(s,e),i=H(t,n);return Se(Ul(Ho(i,0),he(t,i),0),"float32")})}function Hc(s,e){return Qs(s,e)}function jc(s,e){return s.rank===e.rank&&(s=Gn(s,[s.rank-1])),e=_s(e,-1),e.dtype!==s.dtype&&(e=Se(e,s.dtype)),Se(at(s,e),"float32")}const qc=Js,Yc=Js,Kc=hi,Xc=hi,Jc=di,Qc=di,ya=Xt,Zc=ia,ba=Rs,zs={binaryAccuracy:ma,categoricalAccuracy:ga,precision:Vc,categoricalCrossentropy:ya,sparseCategoricalCrossentropy:ba,mse:qc,MSE:Yc,mae:Kc,MAE:Xc,mape:Jc,MAPE:Qc,cosine:Zc};function eh(s){if(typeof s=="string"&&s in zs)return zs[s];if(typeof s!="string"&&s!=null)return s;throw new b(`Unknown metric ${s}`)}function ps(s){if(Me(s!==null,`Unknown LossOrMetricFn ${s}`),typeof s=="string")return s;{let e;for(const t of Object.keys(Ds))if(Ds[t]===s){e=t;break}if(e!==void 0)return e;for(const t of Object.keys(zs))if(zs[t]===s){e=t;break}return e!==void 0?e:s.name}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function th(s){const e={Adagrad:()=>ht.adagrad(.01),Adadelta:()=>ht.adadelta(1,.95,ee()),Adam:()=>ht.adam(.001,.9,.999,ee()),Adamax:()=>ht.adamax(.002,.9,.999,ee(),0),RMSProp:()=>ht.rmsprop(.001,.9,0,ee()),SGD:()=>ht.sgd(.01)};if(e.adagrad=e.Adagrad,e.adadelta=e.Adadelta,e.adam=e.Adam,e.adamax=e.Adamax,e.rmsprop=e.RMSProp,e.sgd=e.SGD,s in e)return e[s]();throw new b(`Unknown Optimizer ${s}`)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */const Qi=1*1024*1024;function Zi(s,e,t=!1){if(s==null||typeof s!="object"||Object.getPrototypeOf(s)!==Object.prototype||!Cn(s))throw new Error("User-defined metadata is expected to be a JSON object, but is not.");if(t){const n=JSON.stringify(s);n.length>Qi&&console.warn(`User-defined metadata of model "${e}" is too large in size (length=${n.length} when serialized). It is not recommended to store such large objects in user-defined metadata. Please make sure its serialized length is <= ${Qi}.`)}}function Cn(s){if(s===null)return!0;if(typeof s=="object")if(Object.getPrototypeOf(s)===Object.prototype){const e=Object.keys(s);for(const t of e)if(typeof t!="string"||!Cn(s[t]))return!1;return!0}else if(Array.isArray(s)){for(const e of s)if(!Cn(e))return!1;return!0}else return!1;else{const e=typeof s;return e==="string"||e==="number"||e==="boolean"}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function sh(s,e,t,n=console.log){const i=ih(s),o=["Layer (type)","Input Shape","Output shape","Param #"];i?(e=e||90,t=t||[.32,.61,.89,1]):(e=e||115,t=t||[.24,.48,.7,.8,1]),t[t.length-1]<=1&&(t=t.map(c=>Math.floor(e*c)));let r;if(!i){o.push("Receives inputs"),r=[];for(const c in s.nodesByDepth)r.push(...s.nodesByDepth[c])}n("_".repeat(e)),Bs(o,t,n),n("=".repeat(e));const a=s.layers;for(let c=0;c<a.length;++c)i?oh(a[c],t,n):rh(a[c],t,r,n),n((c===a.length-1?"=":"_").repeat(e));s.checkTrainableWeightsConsistency();const l=nh(s),u=Ps(s.nonTrainableWeights);n(`Total params: ${l+u}`),n(`Trainable params: ${l}`),n(`Non-trainable params: ${u}`),n("_".repeat(e))}function nh(s){let e;return s.collectedTrainableWeights!=null?e=Ps(s.collectedTrainableWeights):e=Ps(s.trainableWeights),e}function ih(s){let e=!0;const t=[],n=[];for(const i in s.nodesByDepth)t.push(s.nodesByDepth[i]);for(const i of t){if(i.length>1||i.length===1&&i[0].inboundLayers.length>1){e=!1;break}n.push(...i)}if(e)for(const i of s.layers){let o=!1;for(const r of i.inboundNodes)if(n.indexOf(r)!==-1)if(o){e=!1;break}else o=!0;if(!e)break}return e}function Bs(s,e,t=console.log){let n="";for(let i=0;i<s.length;++i)i>0&&(n=n.slice(0,n.length-1)+" "),n+=s[i],n=n.slice(0,e[i]),n+=" ".repeat(e[i]-n.length);t(n)}function oh(s,e,t){let n,i;try{i=s.inboundNodes.map(l=>JSON.stringify(l.inputShapes)).join(",")}catch{i="multiple"}try{n=JSON.stringify(s.outputShape)}catch{n="multiple"}const o=s.name,r=s.getClassName(),a=[`${o} (${r})`,i,n,s.countParams().toString()];Bs(a,e,t)}function rh(s,e,t,n){let i,o;try{o=s.inboundNodes.map(h=>JSON.stringify(h.inputShapes)).join(",")}catch{o="multiple"}try{i=JSON.stringify(s.outputShape)}catch{i="multiple"}const r=[];for(const h of s.inboundNodes)if(!(t!=null&&t.length>0&&t.indexOf(h)===-1))for(let d=0;d<h.inboundLayers.length;++d){const m=h.inboundLayers[d].name,p=h.nodeIndices[d],f=h.tensorIndices[d];r.push(`${m}[${p}][${f}]`)}const a=s.name,l=s.getClassName(),u=r.length===0?"":r[0],c=[`${a} (${l})`,o,i,s.countParams().toString(),u];Bs(c,e,n);for(let h=1;h<r.length;++h)Bs(["","","","",r[h]],e,n)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function wa(s,e,t){return(s==="inboundNodes"||s==="outputLayers"||s==="inputLayers")&&e===0&&typeof t=="string"}function _n(s,e){if(s===null)return null;if(typeof s=="string")return tt(s);if(typeof s=="number"||typeof s=="boolean")return s;if(s instanceof Array){const t=[],n=s.length;for(let i=0;i<n;++i){const o=s[i];wa(e,i,o)?t.push(o):t.push(_n(o,e))}return t}else{const t={};for(const n of Object.keys(s)){const i=s[n];if(n==="name"&&typeof i=="string")t[n]=i;else{const o=tt(n);t[o]=_n(i,o)}}return t}}function In(s,e){if(s==null)return null;if(typeof s=="string")return He(s);if(typeof s=="number"||typeof s=="boolean")return s;if(s instanceof Array){const t=[],n=s.length;for(let i=0;i<n;++i){const o=s[i];wa(e,i,o)?t.push(o):t.push(In(o,e))}return t}else{const t={};for(const n of Object.keys(s)){const i=s[n],o=He(n);(n==="name"||n==="className")&&typeof i=="string"?t[o]=i:t[o]=In(i,n)}return t}}/** @license See the LICENSE file. */const Sa="4.20.0";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */class xa{constructor(e){this.maxEntries=e||100,this.cache=new Map}get(e){let t;return this.cache.has(e)&&(t=this.cache.get(e),this.cache.delete(e),this.cache.set(e,t)),t}put(e,t){if(this.cache.has(e))this.cache.delete(e);else if(this.cache.size>=this.maxEntries){const n=this.cache.keys().next().value;this.cache.delete(n)}this.cache.set(e,t)}getMaxEntries(){return this.maxEntries}setMaxEntries(e){if(e<0)throw new Error(`The maxEntries of LRU caches must be at least 0, but got ${e}.`);if(this.maxEntries>e)for(let t=0;t<this.maxEntries-e;t++){const n=this.cache.keys().next().value;this.cache.delete(n)}this.maxEntries=e}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */class rs extends De{constructor(e){if(super({dtype:e.dtype,name:e.name!=null?e.name:ei("input").toString()}),e.batchSize==null&&(e.batchSize=null),e.sparse==null&&(e.sparse=!1),this.trainable=!1,this.built=!0,this.sparse=e.sparse,e.inputShape!=null&&e.batchInputShape!=null)throw new b("Only provide the inputShape OR batchInputShape argument to inputLayer, not both at the same time.");let t=e.batchInputShape;if(t==null){if(e.inputShape==null)throw new b("An InputLayer should be passed either a `batchInputShape` or an `inputShape`.");t=[e.batchSize].concat(e.inputShape)}else if(e.batchSize!=null)throw new b("Cannot specify batchSize if batchInputShape is specified when creating an InputLayer.");const n=e.dtype||"float32";this.batchInputShape=t,this.dtype=n,this.inputSpec=[{shape:t}];const i=new lt(this.dtype,this.batchInputShape,this,[],{},this.name);i.nodeIndex=0,i.tensorIndex=0,new ai({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:[i],outputTensors:[i],inputMasks:[null],outputMasks:[null],inputShapes:[t],outputShapes:[t]})}apply(e,t){throw new b(`Cannot pass any input to an InputLayer's apply() method. InputLayer name: ${this.name}`)}dispose(){return{refCountAfterDispose:this._refCount,numDisposedVariables:0}}getConfig(){return{batchInputShape:this.batchInputShape,dtype:this.dtype,sparse:this.sparse,name:this.name}}}rs.className="InputLayer";I(rs);function ah(s){if(s.batchShape==null&&s.shape==null)throw new Error("Please provide to Input either a `shape` or a `batchShape` argument. Note that `shape` does not include the batch dimension.");if(s.batchShape!=null&&s.shape!=null)throw new b("Please provide either a `shape` or `batchShape` argument to Input, but not both.");let e=s.batchShape;s.shape!=null&&e==null&&(e=[null].concat(s.shape));let t=s.dtype;return t==null&&(t="float32"),new rs({batchInputShape:e,name:s.name,dtype:t,sparse:s.sparse}).inboundNodes[0].outputTensors[0]}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function lh(s,e){if(s.dtype==null||s.dtype===e.dtype)return e;try{return Se(e,s.dtype)}catch{throw new b(`The dtype of the feed (${e.dtype}) can not be cast to the dtype of the key '${s.name}' (${s.dtype}).`)}}class Xe{constructor(e){if(this.id2Value={},this.id2Mask={},this.name2Id={},e instanceof Xe)for(const t in e.id2Value)this.id2Value[t]=e.id2Value[t],t in e.id2Mask&&(this.id2Mask[t]=e.id2Mask[t]);else{if(e==null)return;for(const t of e)this.add(t.key,t.value)}}add(e,t,n){if(this.id2Value[e.id]==null)this.id2Value[e.id]=lh(e,t),this.name2Id[e.name]=e.id,n!=null&&(this.id2Mask[e.id]=n);else throw new b(`Duplicate key: name=${e.name}, id=${e.id}`);return this}addFeed(e){this.add(e.key,e.value)}hasKey(e){return this.id2Value[e.id]!=null}names(){return Object.keys(this.name2Id)}getValue(e){if(e instanceof lt){if(this.id2Value[e.id]==null)throw new b(`Nonexistent key: ${e.name}`);return this.id2Value[e.id]}else{const t=this.name2Id[e];if(t==null)throw new b(`Feed dict has no SymbolicTensor name: ${e}`);return this.id2Value[t]}}getMask(e){if(e instanceof lt){if(this.id2Value[e.id]==null)throw new b(`Nonexistent key: ${e.name}`);return this.id2Mask[e.id]}else{const t=this.name2Id[e];if(t==null)throw new b(`Feed dict has no SymbolicTensor name: ${e}`);return this.id2Mask[t]}}disposeMasks(){this.id2Mask!=null&&Pe(this.id2Mask)}}const eo=new xa,to=new xa;function Ot(s,e,t,n){const i=t==null?!1:t.training,o=Array.isArray(s),r=o?s:[s],a=r.map(p=>p.name),l=[],u=e.names();for(const p of a)u.indexOf(p)!==-1?l.push(e.getValue(p)):l.push(null);const c=a.join(",")+"|"+e.names().sort().join(",");let h=eo.get(c),d;if(h==null){const p=uh(r,e);h=p.sorted,d=p.recipientCounts,eo.put(c,h),to.put(c,d)}d={},i||Object.assign(d,to.get(c));const m=new Xe(e);for(let p=0;p<h.length;++p){const f=h[p],g=f.sourceLayer;if(g instanceof rs)continue;const w=[],y=[],x=[];let S=!1;for(const _ of f.inputs){const N=m.getValue(_),M=m.getMask(_);w.push(N),y.push(M),M!=null&&(S=!0),i||(d[_.name]--,d[_.name]===0&&!e.hasKey(_)&&a.indexOf(_.name)===-1&&!N.isDisposed&&_.sourceLayer.stateful!==!0&&x.push(N))}S&&(t=t||{},t.mask=y[0]);const A=V(g.apply(w,t));let C=null;g.supportsMasking&&(C=g.computeMask(w,y));const T=hh(f),$=Array.isArray(T)?T:[T];for(let _=0;_<$.length;++_){m.hasKey($[_])||m.add($[_],A[_],Array.isArray(C)?C[0]:C);const N=a.indexOf($[_].name);N!==-1&&(l[N]=A[_])}i||Pe(x)}return m.disposeMasks(),o?l:l[0]}function uh(s,e){O(s!=null&&s.length>0,()=>"Expected at least one fetch, got none");let t=[],n={};if(s.length===1){const i=so(s[0],e);t=i.sorted,n=i.recipientMap}else{const i=new Set;for(const o of s){const{sorted:r,recipientMap:a}=so(o,e);for(const l of r)i.has(l.name)||(t.push(l),i.add(l.name));for(const l in a)n[l]==null&&(n[l]=new Set),a[l].forEach(u=>n[l].add(u))}}return{sorted:t,recipientCounts:ch(n)}}function ch(s){const e={};for(const t in s)e[t]=s[t].size;return e}function so(s,e){const t=new Set,n=[],i={};for(const a of e.names())t.add(a);const o=[],r=[];for(o.push(s);o.length>0;){const a=o[o.length-1];if(t.has(a.name)){o.pop();continue}const l=r[r.length-1]===o.length-1;if(a.inputs.length===0||l)o.pop(),n.push(a),t.add(a.name),l&&r.pop();else{r.push(o.length-1);for(const u of a.inputs)i[u.name]==null&&(i[u.name]=new Set),i[u.name].add(a.name),!t.has(u.name)&&o.push(u)}}return{sorted:n,recipientMap:i}}function hh(s){let e;if(s.sourceLayer.inboundNodes.length===1)e=s.sourceLayer.output;else{let t=null;for(let n=0;n<s.sourceLayer.inboundNodes.length;++n)for(const i of s.sourceLayer.inboundNodes[n].outputTensors)if(i.id===s.id){t=n;break}e=s.sourceLayer.getOutputAt(t)}return e}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */const dh=s=>{const e=Object.keys(s);if(e.length===0)return!1;const t=e[0].split("/");return!isNaN(parseInt(t[t.length-1],10))};class ke extends De{constructor(e){if(super({}),this.containerNodes=new Set,this.name=e.name,this.name==null){const y=this.getClassName().toLowerCase();this.name=ei(y)}if(this.supportsMasking=!1,this.trainable_=!0,Array.isArray(e.inputs)?this.inputs=e.inputs.slice():this.inputs=[e.inputs],Array.isArray(e.outputs)?this.outputs=e.outputs.slice():this.outputs=[e.outputs],st(this.inputs).length!==this.inputs.length)throw new b(`The list of inputs passed to the model is redundant. All inputs should only appear once. Found: ${this.inputs.map(y=>y.name)}`);st(this.outputs).length!==this.outputs.length&&console.warn(`The list of outputs passed to the model is redundant. All outputs should only appear once. Found: ${this.outputs.map(y=>y.name)}`),this.inputLayers=[],this.inputLayersNodeIndices=[],this.inputLayersTensorIndices=[],this.outputLayers=[],this.outputLayersNodeIndices=[],this.outputLayersTensorIndices=[],this.layers=[],this.internalContainerRefs=[];for(const y of this.outputs){const x=y.sourceLayer,S=y.nodeIndex,A=y.tensorIndex;this.outputLayers.push(x),this.outputLayersNodeIndices.push(S),this.outputLayersTensorIndices.push(A)}for(const y of this.inputs){const x=y.sourceLayer,S=y.nodeIndex,A=y.tensorIndex;Me(S===0,"input layer has >1 nodes"),Me(A===0,"input layer has >1 tensors"),this.inputLayers.push(x),this.inputLayersNodeIndices.push(S),this.inputLayersTensorIndices.push(A)}this.inputNames=[],this.outputNames=[],this.feedInputShapes=[],this.feedInputNames=[],this.feedOutputNames=[];for(let y=0;y<this.inputLayers.length;y++){const x=this.inputLayers[y];if(!(x instanceof rs))throw new TypeError(`Input layers to a LayersModel must be InputLayer objects. Received inputs: ${e.inputs}. Input ${y} (0-based) originates from layer type ${x.getClassName()}.`);this.inputNames.push(x.name),this.feedInputShapes.push(x.batchInputShape),this.feedInputNames.push(x.name)}for(const y of this.outputLayers)this.outputNames.push(y.name);this.internalInputShapes=this.inputs.map(y=>y.shape),this.internalOutputShapes=this.outputs.map(y=>y.shape);const t={},n={},i={},o={},r={},a=[],l=(y,x,S,A,C,T)=>{(A==null||C==null||T==null)&&(A=y.sourceLayer,C=y.nodeIndex,T=y.tensorIndex);const $=A.inboundNodes[C];if(S.indexOf($)!==-1)throw new Je(`The tensor ${y.name} at layer "${A.name}" is part of a cycle.`);if(x.indexOf($)!==-1)return;this.containerNodes.add(ke.nodeKey(A,C)),A.id in r||(r[A.id]=Object.keys(r).length),S.indexOf($)===-1&&S.push($);const _=$.inboundLayers.length;for(let N=0;N<_;N++){const M=$.inputTensors[N],Q=$.inboundLayers[N],ne=$.nodeIndices[N],R=$.tensorIndices[N];l(M,x,S,Q,ne,R)}for(x.push($);S.indexOf($)>=0;)S.splice(S.indexOf($),1);a.push($)},u=[],c=[];for(const y of this.outputs)l(y,u,c);const h=a.slice().reverse();for(const y of h){n[y.id]=y,y.id in t||(t[y.id]=0);let x=t[y.id];const S=i[y.outboundLayer.id]==null?0:i[y.outboundLayer.id];x=Math.max(x,S),i[y.outboundLayer.id]=x,o[y.outboundLayer.id]=y.outboundLayer,t[y.id]=x;for(let A=0;A<y.inboundLayers.length;A++){const C=y.inboundLayers[A],T=y.nodeIndices[A],$=C.inboundNodes[T],_=t[$.id]==null?0:t[$.id];t[$.id]=Math.max(x+1,_),n[$.id]=$}}const d={};for(const y in t){const x=t[y];x in d||(d[x]=[]),d[x].push(n[y])}const m={};for(const y in i){const x=i[y];x in m||(m[x]=[]),m[x].push(o[y])}let p=Object.keys(m).map(y=>parseInt(y,10)).sort(hs);this.layers=[];for(const y of p){const x=m[y];x.sort((S,A)=>{const C=r[S.id],T=r[A.id];return C<T?-1:C>T?1:0});for(const S of x)S instanceof ke&&this.internalContainerRefs.push(S),this.layers.push(S)}this.layersByDepth=m,p=Object.keys(d).map(y=>parseInt(y,10)).sort(hs);const f=this.inputs.slice(),g=[];for(const y of p)for(const x of d[y]){const S=x.outboundLayer;if(S!=null){for(const A of x.inputTensors)if(f.indexOf(A)===-1)throw new Je(`Graph disconnected: cannot obtain value for tensor ${A} at layer "${S.name}". The following previous layers were accessed without issue: ${g}`);for(const A of x.outputTensors)f.push(A);g.push(S.name)}}this.nodesByDepth=d;const w=this.layers.map(y=>y.name);for(const y of w){const x=w.filter(S=>S===y).length;if(x!==1)throw new Je(`The name "${y}" is used ${x} times in the model. All layer names should be unique. Layer names: `+JSON.stringify(w))}this.outboundNodes=[],this.inboundNodes=[],new ai({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:this.inputs,outputTensors:this.outputs,inputMasks:this.inputs.map(y=>null),outputMasks:this.outputs.map(y=>null),inputShapes:this.inputs.map(y=>y.shape),outputShapes:this.outputs.map(y=>y.shape)}),this.built=!0,this._refCount=1}assertNotDisposed(){if(this._refCount===0)throw new Error(`Container '${this.name}' is already disposed.`)}dispose(){this.assertNotDisposed();const e={refCountAfterDispose:null,numDisposedVariables:0};if(--this._refCount===0){for(const t of this.layers)e.numDisposedVariables+=t.dispose().numDisposedVariables;for(const t of this.internalContainerRefs)e.numDisposedVariables+=t.dispose().numDisposedVariables}return e.refCountAfterDispose=this._refCount,e}get trainable(){return this.trainable_}set trainable(e){this.layers.forEach(t=>{t._trainableWeights.forEach(n=>n.trainable=e)}),this.trainable_=e}get trainableWeights(){if(this._trainableWeights.length>0)throw new b("Container instance unexpectedly contains _trainableWeights.The trainable weights of a Container are a union of the trainable weights of its consituent Layers. Its own _trainableWeights must remain an empty Array.");if(!this.trainable)return[];let e=[];for(const t of this.layers)e=e.concat(t.trainableWeights);return e}get nonTrainableWeights(){const e=[];for(const t of this.layers)e.push(...t.nonTrainableWeights);if(!this.trainable){const t=[];for(const n of this.layers)t.push(...n.trainableWeights);return t.concat(e)}return e}get weights(){return this.trainableWeights.concat(this.nonTrainableWeights)}loadWeights(e,t=!0){const n={};let i=0;const o=dh(e);o&&this.parseWeights(e);for(const a of this.layers)for(const[l,u]of a.weights.entries()){const c=o?`${u.name.split("/").slice(0,-1).join("/")+"/"}${l}`:u.originalName;if(n[c]!=null)throw new b(`Duplicate weight name: ${c}`);n[c]=u,i++}const r=[];for(const a in e){let l=a;if(n[a]==null){const u=a.split("/");l=u.slice(0,-2).concat([u[u.length-1]]).join("/")}if(n[l]!=null)r.push([n[l],e[a]]);else if(t)throw new b(`Provided weight data has no target variable: ${a}`);delete n[l]}if(t){const a=[];for(const l in n)a.push(l);if(a.length>0)throw new b(`${a.length} of ${i} weights are not set: ${a}`)}Pr(r)}parseWeights(e){for(const t in Object.keys(e)){const n=t.split("/"),i=["vars","layer_checkpoint_dependencies"],o=n.map(r=>r.startsWith("_")?r.slice(1):r).filter(r=>!i.includes(r)).join("/");o!==t&&(e[o]=e[t],delete e[t])}}updatedConfig(){const e=this.getConfig(),t={};return t.className=this.getClassName(),t.config=e,t.kerasVersion=`tfjs-layers ${Sa}`,t.backend="TensorFlow.js",t}toJSON(e,t=!0){const n=In(this.updatedConfig());return t?JSON.stringify(n):n}call(e,t){return v(()=>{e=V(e);const n=new Xe;for(let i=0;i<this.inputs.length;++i)n.add(this.inputs[i],e[i]);return Ot(this.outputs,n,t)})}computeMask(e,t){return v(()=>{e=V(e);let n;return t==null?n=$s(null,e.length):n=V(t),this.runInternalGraph(e,n)[1]})}computeOutputShape(e){const t=ks(e);if(t.length!==this.inputLayers.length)throw new b(`Invalid inputShape argument ${e}: model has ${this.inputLayers.length} tensor inputs.`);const n={};for(let a=0;a<t.length;a++){const l=this.inputLayers[a],u=t[a],c=l.name+"_0_0";n[c]=u}const i=Object.keys(this.nodesByDepth).map(a=>parseInt(a,10)).sort(hs);if(i.length>1)for(const a of i){const l=this.nodesByDepth[a];for(const u of l){const c=u.outboundLayer;if(this.inputLayers.map(f=>f.id).indexOf(c.id)!==-1)continue;const h=[];for(let f=0;f<u.inboundLayers.length;f++){const g=u.inboundLayers[f],w=u.nodeIndices[f],y=u.tensorIndices[f],x=`${g.name}_${w}_${y}`,S=n[x];h.push(S)}const d=c.computeOutputShape(me(h)),m=ks(d),p=c.inboundNodes.indexOf(u);for(let f=0;f<m.length;f++){const g=`${c.name}_${p}_${f}`;n[g]=m[f]}}}const o=[],r=[];for(let a=0;a<this.outputLayers.length;a++){const l=this.outputLayers[a],u=this.outputLayersNodeIndices[a],c=this.outputLayersTensorIndices[a],h=`${l.name}_${u}_${c}`;r.push(h)}for(let a=0;a<r.length;a++){const l=r[a];Me(l in n),o.push(n[l])}return me(o)}runInternalGraph(e,t){t==null&&(t=$s(null,e.length));const n={};for(let l=0;l<this.inputs.length;++l){const u=this.inputs[l],c=e[l],h=t[l];n[u.id]=[c,h]}const i=Object.keys(this.nodesByDepth).map(l=>parseInt(l,10)).sort(hs);for(const l of i){const u=this.nodesByDepth[l];for(const c of u){const h=c.outboundLayer,d=c.inputTensors,m=c.outputTensors,p=new Array;for(const f of d)f.id in n&&p.push(n[f.id]);if(p.length===d.length){let f={},g,w,y,x;if(c.callArgs!=null&&(f=c.callArgs),p.length===1){const[S,A]=p[0];f.mask==null&&(f.mask=A),y=V(h.call(S,f)),x=V(h.computeMask(S,A)),g=[S],w=[A]}else g=p.map(S=>S[0]),w=p.map(S=>S[1]),f.mask==null&&(f.mask=w),y=V(h.call(g,f)),x=V(h.computeMask(g,w));if(h.activityRegularizer)throw new B("LayersModel invocation with concrete Tensor value(s) in the presence of activity regularizer(s) is not supported yet.");for(let S=0;S<m.length;++S){const A=m[S],C=y[S],T=x[S];n[A.id]=[C,T]}}}}const o=[],r=[],a=[];for(const l of this.outputs){Me(l.id in n,`Could not compute output ${l.name} : ${l.id}`);const[u,c]=n[l.id];a.push(u.shape),o.push(u),r.push(c)}return[o,r,a]}buildNodeConversionMap(e){const t={};let n;for(const i of this.layers){n=i instanceof ke?1:0;for(let o=0;o<i.inboundNodes.length;o++){const r=ke.nodeKey(i,o);this.containerNodes.has(r)&&(t[r]=n,n+=1)}}return t}getLayer(e,t){if(t!=null)return this.findLayer(t);if(e==null)throw new b("Provide either a layer name or layer index");if(typeof e=="number")return this.findLayer(e);for(const n of this.layers)if(n.name===e)return n;throw new b(`No such layer: ${e}`)}findLayer(e){if(this.layers.length<=e)throw new b(`Was asked to retrieve layer at index ${e}, but model only has ${this.layers.length} layer(s).`);return this.layers[e]}calculateLosses(){return v(()=>{const e=[];for(const t of this.layers)for(let n=0;n<t.inboundNodes.length;++n){const i=ke.nodeKey(t,n);this.containerNodes.has(i)&&e.push(...t.calculateLosses())}return e})}getConfig(){const e={name:this.name},t=this.buildNodeConversionMap(this.layers),n=[];for(const r of this.layers){const a=r.getClassName(),l=r.getConfig(),u=[];for(let h=0;h<r.inboundNodes.length;h++){const d=r.inboundNodes[h],m=ke.nodeKey(r,h);let p={};if(this.containerNodes.has(m)){if(d.callArgs)try{JSON.stringify(d.callArgs),p=d.callArgs}catch{console.warn(`Layer ${r.name} was passed non-serializable keyword arguments: ${d.callArgs}. They will not be included in the serialized model (and thus will be missing at deserialization time).`),p={}}if(d.inboundLayers.length>0){const f=[];for(let g=0;g<d.inboundLayers.length;g++){const w=d.inboundLayers[g],y=d.nodeIndices[g],x=d.tensorIndices[g],S=ke.nodeKey(w,y);let A=t[S];A==null&&(A=0),f.push([w.name,A,x,p])}u.push(f)}}}const c={};c.name=r.name,c.className=a,c.config=l,c.inboundNodes=u,n.push(c)}e.layers=n;const i=[];for(let r=0;r<this.inputLayers.length;r++){const a=this.inputLayers[r],l=this.inputLayersNodeIndices[r],u=ke.nodeKey(a,l);if(!this.containerNodes.has(u))continue;let c=t[u];c==null&&(c=0);const h=this.inputLayersTensorIndices[r];i.push([a.name,c,h])}e.inputLayers=i;const o=[];for(let r=0;r<this.outputLayers.length;r++){const a=this.outputLayers[r],l=this.outputLayersNodeIndices[r],u=ke.nodeKey(a,l);if(!this.containerNodes.has(u))continue;let c=t[u];c==null&&(c=0);const h=this.outputLayersTensorIndices[r];o.push([a.name,c,h])}return e.outputLayers=o,e}static fromConfig(e,t,n={},i=!1){const o={},r={};function a(g,w){g.name in r?r[g.name].push(w):r[g.name]=[w]}function l(g,w){const y=[];let x;for(const S of w){const A=S[0],C=S[1],T=S[2];if(x=S[3]==null?{}:S[3],!(A in o)){a(g,w);return}const $=o[A];if($.inboundNodes.length<=C){a(g,w);return}const _=$.inboundNodes[C];y.push(_.outputTensors[T])}y.length>0&&g.apply(me(y),x)}function u(g){const w=g.name,y=pa(g,t.customObjects!=null?t.customObjects:{});y.setFastWeightInitDuringBuild(i),o[w]=y,g.inboundNodes.forEach(S=>{if(!(S instanceof Array))throw new b(`Corrupted configuration, expected array for nodeData: ${S}`);a(y,S)})}const c=t.name,h=t.layers;for(const g of h)u(g);for(;!Ku(r);)for(const g of h){const w=o[g.name];if(w.name in r){const y=r[w.name];delete r[w.name];for(const x of y)l(w,x)}}const d=[],m=[],p=t.inputLayers;for(const g of p){const w=g[0],y=g[1],x=g[2];Me(w in o);const A=o[w].inboundNodes[y].outputTensors;d.push(A[x])}const f=t.outputLayers;for(const g of f){const w=g[0],y=g[1],x=g[2];Me(w in o);const A=o[w].inboundNodes[y].outputTensors;m.push(A[x])}return new e({inputs:d,outputs:m,name:c})}get stateful(){if(this._stateful)throw new b("Container instance unexpectedly has _stateful = true. The statefulness of a Container is determined by the Layers it contains. Its _stateful property must remain the default false.");for(const e of this.layers)if(e.stateful)return!0;return!1}resetStates(){v(()=>{this.layers.forEach(e=>{e.stateful&&e.resetStates()})})}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function fh(s,e,t){const n=e.length;if(s==null||Array.isArray(s)&&s.length===0)return e.map(i=>null);if(n===1)return Array.isArray(s)&&s.length===1?s:typeof s=="object"&&e[0]in s?[s[e[0]]]:[s];if(Array.isArray(s)){if(s.length!==n)throw new Error(`Provided ${t} is an array of ${s.length} element(s), but the model has ${n} outputs. Make sure a set of weights is provided for each model output.`);return s}else if(typeof s=="object"&&Object.keys(s).length>0&&typeof s[Object.keys(s)[0]]=="object"){const i=[];return e.forEach(o=>{o in s?i.push(s[o]):i.push(null)}),i}else throw new Error(`The model has multiple (${n}) outputs, so ${t} must be either an array with ${n} elements or an object with ${e} keys. Provided ${t} not understood: ${JSON.stringify(s)}`)}function Aa(s,e){return fh(s,e,"classWeight")}async function va(s,e,t,n){if(t!=null){const i=v(()=>{if(s.shape.length===1)return Wl(s);if(s.shape.length===2){if(s.shape[1]>1)return _s(s,1);if(s.shape[1]===1)return X(s,[s.shape[0]]);throw new Error(`Encountered unexpected last-dimension size (${s.shape[1]}) during handling of class weights. The size is expected to be >= 1.`)}else throw new Error(`Unexpected rank of target (y) tensor (${s.rank}) during handling of class weights. The rank is expected to be 1 or 2.`)}),o=Array.from(await i.data());Pe(i);const r=[];return o.forEach(a=>{if(t[a]==null)throw new Error(`classWeight must contain all classes in the training data. The class ${a} exists in the data but not in classWeight`);r.push(t[a])}),Ht(r,"float32")}else return null}function ph(s,e){return L(s,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */const mh=32;function Ca(s,e){let t,n;const i=e;t=i.xs,n=i.ys,O(t!=null&&n!=null,()=>`A Dataset iterator for fitDataset() is expected to generate objects of the form \`{xs: xVal, ys: yVal}\`, where the two values may be \`tf.Tensor\`, an array of Tensors, or a map of string to Tensor.  The provided Dataset instead generates ${e}`);const o=no("input",s.inputNames,t),r=no("output",s.outputNames,n),a=o[0].shape[0];O(o.length===s.inputs.length,()=>`LayersModel has ${s.inputs.length} inputs, but the dataset provides ${o.length} inputs.  (Expected input keys: ${JSON.stringify(s.inputNames)})`),O(r.length===s.outputs.length,()=>`LayersModel has ${s.outputs.length} outputs, but the dataset provides ${r.length} outputs.  (Expected output keys: ${JSON.stringify(s.outputNames)})`);for(let l=0;l<o.length;l++)O(o[l].shape[0]===a,()=>`Batch size mismatch: input ${s.inputNames[l]} has ${o[l].shape[0]}; expected  ${a} based on input ${s.inputNames[0]}.`);for(let l=0;l<r.length;l++)O(r[l].shape[0]===a,()=>`Batch size mismatch: output ${s.outputNames[l]} has ${r[l].shape[0]}; expected  ${a} based on input ${s.inputNames[0]}.`);return{xs:o,ys:r}}function no(s,e,t){if(t instanceof bt)return[t];if(Array.isArray(t))return O(t.length===e.length,()=>`Received an array of ${t.length} Tensors, but expected ${e.length} to match the ${s} keys ${e}.`),t;{const n=[];for(const i of e){if(t[i]==null)throw new b(`The feature data generated by the dataset lacks the required ${s} key '${i}'.`);n.push(t[i])}return n}}function gh(s){if(s.length===3)throw new B("Validation with sample weights is not implemented yet.");return{xs:s[0],ys:s[1]}}async function yh(s,e,t){const n=t.batchesPerEpoch!=null;if(O(s.optimizer!=null,()=>"You must compile a model before training/testing. Use LayersModel.compile(modelCompileConfig)."),O(t!=null,()=>"For fitDataset(), the 2nd argument (config) is required, but it is not provided in this call."),O(t.epochs!=null&&t.epochs>0&&Number.isInteger(t.epochs),()=>`For fitDataset(), config.epochs is expected to be a positive integer, but got ${t.epochs}`),O(!n||t.batchesPerEpoch>0&&Number.isInteger(t.batchesPerEpoch),()=>`For fitDataset(), config.batchesPerEpoch is expected to be a positive integer if specified, but got ${t.batchesPerEpoch}`),O(t.validationSplit==null,()=>"`validationSplit` is not supported by `fitDataset()`. Use validationData instead."),s.isTraining)throw new Error("Cannot start training because another fit() call is ongoing.");s.isTraining=!0;try{const i=t.validationData!=null;let o,r;if(i)if(io(t.validationData))O(t.validationBatches==null||t.validationBatches>0&&Number.isInteger(t.validationBatches),()=>`For fitDataset() with dataset-based validation, config.validationBatches is expected not to be provided, or to be a positive integer, but got ${t.validationBatches}`);else{const g=gh(t.validationData);o=g.xs,r=g.ys}const a=s.makeTrainFunction(),l=s.getDedupedMetricsNames();let u;i?u=l.slice().concat(l.map(g=>"val_"+g)):u=l.slice();const c=da(t.callbacks,t.yieldEvery),h=t.verbose==null?1:t.verbose,{callbackList:d,history:m}=fa(c,h,t.epochs,null,null,bh(e,t),null,i,u);d.setModel(s),s.history=m,await d.onTrainBegin(),s.stopTraining_=!1;let p=t.initialEpoch==null?0:t.initialEpoch,f=await e.iterator();for(;p<t.epochs;){const g={};await d.onEpochBegin(p);let w=0,y=0;for(n||(f=await e.iterator());!n||w<t.batchesPerEpoch;){const x=await f.next();if(n&&x.done){console.warn(`You provided \`batchesPerEpoch\` as ${t.batchesPerEpoch}, but your dataset iterator ran out of data after ${w} batches; interrupting training. Make sure that your dataset can generate at least \`batchesPerEpoch * epochs\` batches (in this case, ${t.batchesPerEpoch*t.epochs} batches). You may need to use the repeat() function when building your dataset.`);break}if(x.value!=null){const{xs:S,ys:A}=Ca(s,x.value),C={};C.batch=y,C.size=S[0].shape[0],await d.onBatchBegin(y,C);const T=[];if(t.classWeight!=null){const N=Aa(t.classWeight,s.outputNames);for(let M=0;M<N.length;++M)T.push(await va(A[M],null,N[M]))}const $=S.concat(A).concat(T),_=a($);Pe($);for(let N=0;N<l.length;++N){const M=l[N],Q=_[N];C[M]=Q,zt(Q)}await d.onBatchEnd(y,C),ha(C),y++,w++}if(n?w>=t.batchesPerEpoch:x.done){if(i){let S;io(t.validationData)?S=V(await s.evaluateDataset(t.validationData,{batches:t.validationBatches})):S=V(s.evaluate(o,r,{batchSize:t.validationBatchSize==null?mh:t.validationBatchSize,verbose:0}));for(let A=0;A<s.metricsNames.length;++A)g[`val_${s.metricsNames[A]}`]=S[A]}break}if(s.stopTraining_)break}if(await d.onEpochEnd(p,g),p++,s.stopTraining_)break}return await d.onTrainEnd(),await s.history.syncData(),s.history}finally{s.isTraining=!1}}function bh(s,e){let t=null;return e.batchesPerEpoch!=null?t=e.batchesPerEpoch:Number.isFinite(s.size)&&(t=s.size),t}function io(s){return typeof s.iterator=="function"}function wh(s){return typeof s.next=="function"}async function Sh(s,e,t){t=t||{};const n=t.batches!=null,i=s.testFunction;let o=[];if(t.verbose>0)throw new B("Verbose mode is not implemented yet.");O(!n||t.batches>0&&Number.isInteger(t.batches),()=>`Test loop expects \`batches\` to be a positive integer, but received ${JSON.stringify(t.batches)}`);const r=wh(e)?e:await e.iterator();let a=0,l=0;for(;!n||l<t.batches;){const u=await r.next();if(o=v(()=>{if(u.value){const{xs:c,ys:h}=Ca(s,u.value),d=c.concat(h),m=v(()=>i(d));if(Pe(d),l===0)for(let f=0;f<m.length;++f)o.push(Ys(0));const p=d[0].shape[0];for(let f=0;f<m.length;++f){const g=m[f],w=o[f];o[f]=v(()=>H(o[f],L(p,g))),l>0&&Pe(w)}Pe(m),a+=p,++l}return o}),u.done){n&&console.warn(`Your dataset iterator ran out of data during evaluateDataset(). Interrupting evalution. Make sure that your dataset can generate at least \`batches\` batches (in this case, ${t.batches} batches). You may need to use the repeat() function when building your dataset.`);break}}for(let u=0;u<o.length;++u){const c=o[u];o[u]=he(o[u],a),Pe(c)}return me(o)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function mn(s){O(s>0&&Number.isInteger(s),()=>`batchSize is required to be a positive integer, but got ${s}`)}function kt(s,e,t){return s==null?[null]:Array.isArray(s)?s.map(n=>nt(n,e,t-e)):nt(s,e,t-e)}function $n(s,e){return v(()=>s==null?null:Array.isArray(s)?s.map(t=>$n(t,e)):ic(s,e.dtype==="int32"?e:Se(e,"int32")))}function gn(s,e){const t=[];let n=0,i=null;for(;n<s;)i=n+e,i>=s&&(i=s),t.push([n,i]),n=i;return t}function _a(s){const e=[];s instanceof bt&&(s=[s]);for(let t=0;t<s.length;++t){const n=s[t];if(n.rank===1)e.push(Qn(n,1));else{if(n.rank===0)throw new Error("Expected tensor to be at least 1D, but received a 0D tensor (scalar).");e.push(n)}}return e}function Ee(s,e){if(s==null)return;const t=[];if(e instanceof bt)t.push(e.id);else if(Array.isArray(e))e.forEach(i=>t.push(i.id));else if(e!=null)for(const i in e){const o=e[i];t.push(o.id)}const n=[];if(s instanceof bt)t.indexOf(s.id)===-1&&n.push(s);else if(Array.isArray(s))s.forEach(i=>{t.indexOf(i.id)===-1&&n.push(i)});else if(s!=null)for(const i in s){const o=s[i];t.indexOf(o.id)===-1&&n.push(o)}n.forEach(i=>{i.isDisposed||i.dispose()})}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */function xh(s){return s instanceof bt}function Nn(s){return Array.isArray(s)}function oo(s){return!xh(s)&&!Nn(s)}function ro(s,e,t,n=!0,i=""){if(e==null||e.length===0){if(s!=null){let r=!1;if(Nn(s)&&s.length>0)r=!0;else if(oo(s)){for(const a in s)if(s.hasOwnProperty(a)){r=!0;break}}else r=!0;if(r)throw new b(`Error when checking model ${i} expected no data, but got ${s}`)}return[]}if(s==null)return e.map(r=>null);let o;if(oo(s)){s=s,o=[];for(const r of e){if(s[r]==null)throw new b(`No data provided for "${r}". Need data for each key in: ${e}`);o.push(s[r])}}else if(Nn(s)){if(s=s,s.length!==e.length)throw new b(`Error when checking model ${i}: the Array of Tensors that you are passing to your model is not the size the model expected. Expected to see ${e.length} Tensor(s), but instead got the following list of Tensor(s): ${s}`);o=s}else{if(s=s,e.length>1)throw new b(`The model ${i} expects ${e.length} Tensor(s), but only received one Tensor. Found: Tensor with shape ${s.shape}`);o=[s]}if(o=_a(o),t!=null)for(let r=0;r<e.length;++r){if(t[r]==null)continue;const a=o[r];if(a.shape.length!==t[r].length)throw new b(`Error when checking ${i}: expected ${e[r]} to have ${t[r].length} dimension(s). but got array with shape ${a.shape}`);for(let l=0;l<t[r].length;++l){if(l===0&&!n)continue;const u=a.shape[l],c=t[r][l];if(c!=null&&c>=0&&u!==c)throw new b(`${i} expected a batch of elements where each example has shape [${t[r].slice(1,t[r].length)}] (i.e.,tensor shape [*,${t[r].slice(1,t[r].length)}]) but the ${i} received an input with ${a.shape[0]} examples, each with shape [${a.shape.slice(1,a.shape.length)}] (tensor shape [${a.shape}])`)}}return o}function Ah(s,e,t){const n=st(s.map(o=>o.shape[0]));n.sort();const i=st(e.map(o=>o.shape[0]));if(i.sort(),n.length>1)throw new b(`All input Tensors (x) should have the same number of samples. Got array shapes: ${JSON.stringify(s.map(o=>o.shape))}`);if(i.length>1)throw new b(`All target Tensors (y) should have the same number of samples. Got array shapes: ${JSON.stringify(e.map(o=>o.shape))}`);if(n.length>0&&i.length>0&&!Ye(n,i))throw new b(`Input Tensors should have the same number of samples as target Tensors. Found ${n[0]} input sample(s) and ${i[0]} target sample(s).`)}function vh(s,e,t){const n=[Js,Qs,Xt];for(let i=0;i<s.length;++i){const o=s[i],r=e[i],a=t[i];if(r!=null){if(r===Xt&&o.shape[o.shape.length-1]===1)throw new b(`You are passing a target array of shape ${o.shape} while using a loss 'categorical_crossentropy'. 'categorical_crossentropy'expects targets to be binary matrices (1s and 0s) of shape [samples, classes].`);if(n.indexOf(r)!==-1){const l=o.shape.slice(1),u=a.slice(1);for(let c=0;c<l.length;++c){const h=l[c],d=u[c];if(d!=null&&h!==d)throw new b(`A target Tensor with shape ${o.shape} was passed for an output of shape ${a}, while using a loss function that expects targets to have the same shape as the output.`)}}}}}function ao(s,e,t,n=!0,i=""){let o;if(Array.isArray(s)){if(s.length!==e.length)throw new b(`Error when checking model ${i}: the Array of Tensors that you are passing to your model is not the size the the model expected. Expected to see ${e.length} Tensor(s), but instead got ${s.length} Tensors(s).`);o=s}else{if(e.length>1)throw new b(`The model expects ${e.length} ${i} Tensors, but only received one Tensor. Found: array with shape ${JSON.stringify(s.shape)}.`);o=[s]}if(t!=null)for(let r=0;r<e.length;++r){if(t[r]==null)continue;const a=o[r];if(a.shape.length!==t[r].length)throw new b(`Error when checking ${i}: expected ${e[r]} to have ${t[r].length} dimension(s), but got array with shape ${JSON.stringify(a.shape)}`);for(let l=0;l<t[r].length;++l){if(l===0&&!n)continue;const u=a.shape[l],c=t[r][l];if(c!=null&&c!==u)throw new b(`Error when checking ${i}: expected ${e[r]} to have shape ${JSON.stringify(t[r])} but got array with shape ${JSON.stringify(a.shape)}.`)}}}function Ch(s,e){if(s==null||Array.isArray(s)&&s.length===0)return e.map(n=>[]);let t;if(typeof s=="string"||typeof s=="function")t=[s];else if(Array.isArray(s)||typeof s=="object")t=s;else throw new TypeError(`Type of metrics argument not understood. Expected an string,function, Array, or Object, found: ${s}`);if(Array.isArray(t))return e.map(n=>t);{const n=[];for(const i of e){let o=t.hasOwnProperty(i)?t[i]:[];Array.isArray(o)||(o=[o]),n.push(o)}return n}}const _h="layers-model";class Zs extends ke{constructor(e){super(e),this.isTraining=!1}summary(e,t,n=console.log){if(!this.built)throw new b("This model has never been called, thus its weights have not been created yet. So no summary can be displayed. Build the model first (e.g., by calling it on some test data).");sh(this,e,t,n)}compile(e){if(e.loss==null&&(e.loss=[]),this.loss=e.loss,typeof e.optimizer=="string")this.optimizer_=th(e.optimizer),this.isOptimizerOwned=!0;else{if(!(e.optimizer instanceof Gl))throw new b("User-defined optimizer must be an instance of tf.Optimizer.");this.optimizer_=e.optimizer,this.isOptimizerOwned=!1}let t=[];if(!Array.isArray(e.loss)&&typeof e.loss!="string"&&typeof e.loss!="function"){e.loss=e.loss;for(const r in e.loss)if(this.outputNames.indexOf(r)===-1)throw new b(`Unknown entry in loss dictionary: "${r}". Only expected the following keys: ${this.outputNames}`);for(const r of this.outputNames)e.loss[r]==null&&console.warn(`Output "${r}" is missing from loss dictionary. We assume this was done on purpose, and we will not be expecting data to be passed to ${r} during training`),t.push(pn(e.loss[r]))}else if(Array.isArray(e.loss)){if(e.loss.length!==this.outputs.length)throw new b(`When passing an Array as loss, it should have one entry per model output. The model has ${this.outputs.length} output(s), but you passed loss=${e.loss}.`);t=e.loss.map(a=>pn(a))}else{const r=pn(e.loss);this.outputs.forEach(a=>{t.push(r)})}this.lossFunctions=t,this.feedOutputNames=[],this.feedOutputShapes=[],this.feedLossFns=[];for(let r=0;r<this.outputs.length;++r){const a=this.internalOutputShapes[r],l=this.outputNames[r];this.feedOutputNames.push(l),this.feedOutputShapes.push(a),this.feedLossFns.push(this.lossFunctions[r])}const n=[];this.metrics=e.metrics,this.metricsNames=["loss"],this.metricsTensors=[],vs("loss",()=>{for(let r=0;r<this.outputs.length;++r){if(n.indexOf(r)!==-1)continue;const a=this.lossFunctions[r];this.outputs.length>1&&(this.metricsTensors.push([a,r]),this.metricsNames.push(this.outputNames[r]+"_loss"))}});const i=Ch(e.metrics,this.outputNames),o=(r,a,l)=>{this.outputNames.length>1&&(a=this.outputNames[r]+"_"+a),this.metricsNames.push(a),this.metricsTensors.push([l,r])};vs("metric",()=>{for(let r=0;r<this.outputs.length;++r){if(n.indexOf(r)!==-1)continue;const a=i[r];(u=>{let h,d,m;for(const p of u){if(typeof p=="string"&&["accuracy","acc","crossentropy","ce"].indexOf(p)!==-1){const g=this.internalOutputShapes[r];g[g.length-1]===1||this.lossFunctions[r]===Qs?["accuracy","acc"].indexOf(p)!==-1?d=ma:["crossentropy","ce"].indexOf(p)!==-1&&(d=Hc):this.lossFunctions[r]===Rs?["accuracy","acc"].indexOf(p)!==-1?d=jc:["crossentropy","ce"].indexOf(p)!==-1&&(d=ba):["accuracy","acc"].indexOf(p)!==-1?d=ga:["crossentropy","ce"].indexOf(p)!==-1&&(d=ya);let w;["accuracy","acc"].indexOf(p)!==-1?w="acc":["crossentropy","ce"].indexOf(p)!==-1&&(w="ce"),m=d,h=""+w}else m=eh(p),h=""+ps(p);let f;vs(h,()=>{f=m}),o(r,h,f)}})(a)}}),this.collectedTrainableWeights=this.trainableWeights}checkTrainableWeightsConsistency(){this.collectedTrainableWeights!=null&&this.trainableWeights.length!==this.collectedTrainableWeights.length&&console.warn("Discrepancy between trainableweights and collected trainable weights. Did you set `model.trainable` without calling `model.compile()` afterwards?")}evaluate(e,t,n={}){const i=n.batchSize==null?32:n.batchSize;mn(i);const r=this.standardizeUserDataXY(e,t,!0,i);try{const a=r[0].concat(r[1]);this.makeTestFunction();const l=this.testFunction,u=this.testLoop(l,a,i,n.verbose,n.steps);return me(u)}finally{Ee(r[0],e),Ee(r[1],t)}}async evaluateDataset(e,t){return this.makeTestFunction(),Sh(this,e,t)}checkNumSamples(e,t,n,i="steps"){let o;if(n!=null){if(o=null,t!=null)throw new b(`If ${i} is set, batchSize must be null or undefined.Got batchSize = ${t}`)}else if(e!=null)Array.isArray(e)?o=e[0].shape[0]:o=e.shape[0];else throw new b(`Either the input data should have a defined shape, or ${i} shoud be specified.`);return o}execute(e,t){if(Array.isArray(t)&&t.length===0)throw new b("`outputs` is an empty Array, which is not allowed.");const n=Array.isArray(t),i=n?t:[t],o=this.retrieveSymbolicTensors(i),r=new Xe;if(e instanceof bt&&(e=[e]),Array.isArray(e)){if(e.length!==this.inputs.length)throw new b(`The number of inputs provided (${e.length}) does not match the number of inputs of this model (${this.inputs.length}).`);for(let l=0;l<this.inputs.length;++l)r.add(this.inputs[l],e[l])}else for(const l of this.inputs){const u=e[l.name];if(u==null)throw new b(`No value is provided for the model's input ${l.name}`);r.add(l,u)}const a=Ot(o,r);return n?a:a[0]}retrieveSymbolicTensors(e){const t=$s(null,e.length);let n=e.length;for(const i of this.layers){const o=Array.isArray(i.output)?i.output:[i.output],r=o.map(a=>a.name);for(let a=0;a<e.length;++a){const l=r.indexOf(e[a]);if(l!==-1&&(t[a]=o[l],n--),n===0)break}if(n===0)break}if(n>0){const i=[];throw t.forEach((o,r)=>{o==null&&i.push(e[r])}),new b(`Cannot find SymbolicTensors for output name(s): ${JSON.stringify(i)}`)}return t}predictLoop(e,t=32,n=!1){return v(()=>{const i=this.checkNumSamples(e);if(n)throw new B("Verbose predictLoop() is not implemented yet.");const o=gn(i,t),r=this.outputs.map(a=>[]);for(let a=0;a<o.length;++a)v(()=>{const u=o[a][0],c=o[a][1],h=kt(e,u,c),d=[];if(Array.isArray(h))for(let p=0;p<h.length;++p)d.push({key:this.inputs[p],value:h[p]});else d.push({key:this.inputs[0],value:h});const m=new Xe(d);return Ot(this.outputs,m)}).forEach((u,c)=>r[c].push(u));return me(r.map(a=>Mn(a,0)))})}predict(e,t={}){const n=_a(e);ao(n,this.inputNames,this.feedInputShapes,!1);try{const i=t.batchSize==null?32:t.batchSize;return mn(i),this.predictLoop(n,i)}finally{Ee(n,e)}}predictOnBatch(e){ao(e,this.inputNames,this.feedInputShapes,!0);const t=(Array.isArray(e)?e[0]:e).shape[0];return this.predictLoop(e,t)}standardizeUserDataXY(e,t,n=!0,i){if(this.optimizer_==null)throw new Je("You must compile a model before training/testing. Use LayersModel.compile(modelCompileArgs).");const o=[];for(let r=0;r<this.feedOutputShapes.length;++r){const a=this.feedOutputShapes[r];this.feedLossFns[r]===Rs?o.push(a.slice(0,a.length-1).concat([1])):o.push(a)}if(e=ro(e,this.feedInputNames,this.feedInputShapes,!1,"input"),t=ro(t,this.feedOutputNames,o,!1,"target"),Ah(e,t),vh(t,this.feedLossFns,this.feedOutputShapes),this.stateful&&i!=null&&i>0&&e[0].shape[0]%i!==0)throw new b(`In a stateful network, you should only pass inputs with a number of samples that is divisible by the batch size ${i}. Found: ${e[0].shape[0]} sample(s).`);return[e,t]}async standardizeUserData(e,t,n,i,o=!0,r){const[a,l]=this.standardizeUserDataXY(e,t,o,r);if(n!=null)throw new Error("sample weight is not supported yet.");let u=null;if(i!=null){const c=Aa(i,this.outputNames);u=[];for(let h=0;h<c.length;++h)u.push(await va(l[h],null,c[h]))}return[a,l,u]}testLoop(e,t,n,i=0,o){return v(()=>{const r=this.checkNumSamples(t,n,o,"steps"),a=[];if(i>0)throw new B("Verbose mode is not implemented yet.");if(o!=null)throw new B("steps mode in testLoop() is not implemented yet");{const l=gn(r,n),u=Ht(Ns(0,r));for(let c=0;c<l.length;++c){const h=l[c][0],d=l[c][1],m=nt(u,h,d-h),p=$n(t,m),f=e(p);if(c===0)for(let g=0;g<f.length;++g)a.push(Ys(0));for(let g=0;g<f.length;++g){const w=f[g];a[g]=H(a[g],L(d-h,w))}}for(let c=0;c<a.length;++c)a[c]=he(a[c],r)}return a})}getDedupedMetricsNames(){const e=this.metricsNames,t=[];for(let n=0;n<e.length;++n){const i=e[n];let o=i;if(Fi(e,i)>1){const r=Fi(e.slice(0,n),i);o+=`_${r}`}t.push(o)}return t}makeTrainFunction(){return e=>{const t=[],n=e.slice(0,this.inputs.length),i=e.slice(this.inputs.length,this.inputs.length+this.outputs.length),o=e.slice(this.inputs.length+this.outputs.length,this.inputs.length+this.outputs.length*2),r=[],a=()=>{const h=[];for(let f=0;f<this.inputs.length;++f)h.push({key:this.inputs[f],value:n[f]});const d=new Xe(h),m=Ot(this.outputs,d,{training:!0});let p;for(let f=0;f<this.lossFunctions.length;++f){const g=this.lossFunctions[f];let w=g(i[f],m[f]);o[f]!=null&&(w=ph(w,o[f]));const y=oe(w);t.push(y),f===0?p=w:p=H(p,w)}for(let f=0;f<this.metricsTensors.length;++f){let g;if(this.outputs.length>1&&f<this.outputs.length)g=t[f];else{const w=this.metricsTensors[f][0],y=this.metricsTensors[f][1];g=oe(w(i[y],m[y]))}zt(g),r.push(g)}return p=oe(p),this.calculateLosses().forEach(f=>{p=H(p,f)}),p},l=this.collectedTrainableWeights.map(h=>h.read());return[this.optimizer_.minimize(a,!0,l)].concat(r)}}makeTestFunction(){this.testFunction=e=>v(()=>{const t=[];let n;const i=e.slice(0,this.inputs.length),o=e.slice(this.inputs.length,this.inputs.length+this.outputs.length),r=[];for(let u=0;u<this.inputs.length;++u)r.push({key:this.inputs[u],value:i[u]});const a=new Xe(r),l=Ot(this.outputs,a);for(let u=0;u<this.lossFunctions.length;++u){const c=this.lossFunctions[u],h=oe(c(o[u],l[u]));u===0?n=h:n=H(n,h),t.push(n)}for(let u=0;u<this.metricsTensors.length;++u){const c=this.metricsTensors[u][0],h=this.metricsTensors[u][1],d=oe(c(o[h],l[h]));t.push(d)}return t})}async fit(e,t,n={}){if(this.isTraining)throw new Error("Cannot start training because another fit() call is ongoing.");this.isTraining=!0;let i,o,r,a,l,u,c,h,d;try{const m=n.batchSize==null?32:n.batchSize;mn(m);const f=await this.standardizeUserData(e,t,n.sampleWeight,n.classWeight,!1,m);i=f[0],o=f[1],d=f[2];let g=!1,w;if(n.validationData!=null&&n.validationData.length>0){if(g=!0,n.validationData.length===2)l=n.validationData[0],u=n.validationData[1];else throw n.validationData.length===3?new B("validationData including sample weights is not supported yet."):new b(`When passing validation data, it must contain 2 (valX, valY) or 3 (valX, valY, valSampleWeight) items; ${n.validationData} is invalid.`);const N=await this.standardizeUserData(l,u,null,null,!0,m);c=N[0],h=N[1],w=c.concat(h)}else if(n.validationSplit!=null&&n.validationSplit>0&&n.validationSplit<1){g=!0;const _=Math.floor(i[0].shape[0]*(1-n.validationSplit)),N=i[0].shape[0];c=kt(i,_,N),r=i,i=kt(i,0,_),h=kt(o,_,N),a=o,o=kt(o,0,_),w=c.concat(h)}else n.validationSteps!=null&&(g=!0);const y=i.concat(o).concat(d);this.checkTrainableWeightsConsistency();const x=this.makeTrainFunction(),S=this.getDedupedMetricsNames();let A,C;g?(this.makeTestFunction(),A=this.testFunction,C=S.slice().concat(S.map(_=>"val_"+_))):(A=null,w=[],C=S.slice());const T=da(n.callbacks,n.yieldEvery);return await this.fitLoop(x,y,S,m,n.epochs,n.verbose,T,A,w,n.shuffle,C,n.initialEpoch,null,null)}finally{this.isTraining=!1,Ee(i,e),Ee(o,t),Ee(r,e),Ee(a,t),Ee(c,l),Ee(h,u),d!=null&&Pe(d)}}async fitLoop(e,t,n,i,o,r,a,l,u,c,h,d,m,p){i==null&&(i=32),o==null&&(o=1),c==null&&(c=!0),d==null&&(d=0);let f=!1;if(l!=null&&u!=null&&(f=!0),p!=null&&(f=!0,m==null))throw new b("Can only use `validationSteps` when doing step-wise training, i.e., `stepsPerEpoch` must be set.");const g=this.checkNumSamples(t,i,m,"steps_per_epoch");let w;g!=null&&(w=Ns(0,g)),r==null&&(r=1);const{callbackList:y,history:x}=fa(a,r,o,d,g,m,i,f,h);y.setModel(this),this.history=x,await y.onTrainBegin(),this.stopTraining_=!1;for(let S=d;S<o;++S){await y.onEpochBegin(S);const A={};if(m!=null)throw new B("stepsPerEpoch mode is not implemented yet.");{if(c==="batch")throw new B("batch shuffling is not implemneted yet");c&&Vl(w);const C=Ht(w),T=gn(g,i);for(let $=0;$<T.length;++$){const _={};if(await y.onBatchBegin($,_),v(()=>{const N=T[$][0],M=T[$][1],Q=nt(C,N,M-N);_.batch=$,_.size=M-N;const ne=$n(t,Q),R=e(ne);for(let P=0;P<n.length;++P){const z=n[P],be=R[P];_[z]=be,zt(be)}if($===T.length-1&&f){const P=this.testLoop(l,u,i);for(let z=0;z<n.length;++z){const be=n[z],de=P[z];zt(de),A["val_"+be]=de}}}),await y.onBatchEnd($,_),ha(_),this.stopTraining_)break}C.dispose()}if(await y.onEpochEnd(S,A),this.stopTraining_)break}return await y.onTrainEnd(),await this.history.syncData(),this.history}async fitDataset(e,t){return yh(this,e,t)}async trainOnBatch(e,t){const n=await this.standardizeUserData(e,t),i=n[0],o=n[1],a=this.makeTrainFunction()(i.concat(o)),l=[];for(const u of a){const c=await u.data();l.push(c[0])}return Pe(a),Ee(n[0],e),Ee(n[1],t),me(l)}getNamedWeights(e){const t=[],n=e!=null&&e.trainableOnly,i=n?this.trainableWeights:this.weights,o=this.getWeights(n);for(let r=0;r<i.length;++r)n&&!i[r].trainable||t.push({name:i[r].originalName,tensor:o[r]});return t}set stopTraining(e){this.stopTraining_=e}get stopTraining(){return this.stopTraining_}get optimizer(){return this.optimizer_}set optimizer(e){this.optimizer_!==e&&(this.optimizer_=e,this.isOptimizerOwned=!1)}dispose(){const e=super.dispose();if(e.refCountAfterDispose===0&&this.optimizer!=null&&this.isOptimizerOwned){const t=Di().numTensors;this.optimizer_.dispose(),e.numDisposedVariables+=t-Di().numTensors}return e}getLossIdentifiers(){let e;if(typeof this.loss=="string")e=He(this.loss);else if(Array.isArray(this.loss)){for(const t of this.loss)if(typeof t!="string")throw new Error("Serialization of non-string loss is not supported.");e=this.loss.map(t=>He(t))}else{const t=Object.keys(this.loss);e={};const n=this.loss;for(const i of t)if(typeof n[i]=="string")e[i]=He(n[i]);else throw new Error("Serialization of non-string loss is not supported.")}return e}getMetricIdentifiers(){if(typeof this.metrics=="string"||typeof this.metrics=="function")return[He(ps(this.metrics))];if(Array.isArray(this.metrics))return this.metrics.map(e=>He(ps(e)));{const e={};for(const t in this.metrics)e[t]=He(ps(this.metrics[t]));return e}}getTrainingConfig(){return{loss:this.getLossIdentifiers(),metrics:this.getMetricIdentifiers(),optimizer_config:{class_name:this.optimizer.getClassName(),config:this.optimizer.getConfig()}}}loadTrainingConfig(e){if(e.weighted_metrics!=null)throw new Error("Loading weight_metrics is not supported yet.");if(e.loss_weights!=null)throw new Error("Loading loss_weights is not supported yet.");if(e.sample_weight_mode!=null)throw new Error("Loading sample_weight_mode is not supported yet.");const t=_n(e.optimizer_config),n=pa(t);let i;if(typeof e.loss=="string")i=tt(e.loss);else if(Array.isArray(e.loss))i=e.loss.map(r=>tt(r));else if(e.loss!=null){i={};for(const r in e.loss)i[r]=tt(e.loss[r])}let o;if(Array.isArray(e.metrics))o=e.metrics.map(r=>tt(r));else if(e.metrics!=null){o={};for(const r in e.metrics)o[r]=tt(e.metrics[r])}this.compile({loss:i,metrics:o,optimizer:n})}async save(e,t){if(typeof e=="string"){const u=Hl(e);if(u.length===0)throw new b(`Cannot find any save handlers for URL '${e}'`);if(u.length>1)throw new b(`Found more than one (${u.length}) save handlers for URL '${e}'`);e=u[0]}if(e.save==null)throw new b("LayersModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");const n=await zi(this.getNamedWeights(t)),a={modelTopology:this.toJSON(null,!1),format:_h,generatedBy:`TensorFlow.js tfjs-layers v${Sa}`,convertedBy:null};if((t==null?!1:t.includeOptimizer)&&this.optimizer!=null){a.trainingConfig=this.getTrainingConfig();const u="optimizer",{data:c,specs:h}=await zi(await this.optimizer.getWeights(),u);n.specs.push(...h),n.data=jl([n.data,c])}return this.userDefinedMetadata!=null&&(Zi(this.userDefinedMetadata,this.name,!0),a.userDefinedMetadata=this.userDefinedMetadata),a.weightData=n.data,a.weightSpecs=n.specs,e.save(a)}setUserDefinedMetadata(e){Zi(e,this.name),this.userDefinedMetadata=e}getUserDefinedMetadata(){return this.userDefinedMetadata}}Zs.className="Model";I(Zs);class Ia extends Zs{}Ia.className="Functional";I(Ia);const Ih="This is not an object",$h="This is not a Float16Array object",lo="This constructor is not a subclass of Float16Array",$a="The constructor property value is not an object",Nh="Species constructor didn't return TypedArray object",Eh="Derived constructor created TypedArray object which was too small length",Ut="Attempting to access detached ArrayBuffer",En="Cannot convert undefined or null to object",Tn="Cannot mix BigInt and other types, use explicit conversions",uo="@@iterator property is not callable",co="Reduce of empty array with no initial value",Th="The comparison function must be either a function or undefined",yn="Offset is out of bounds";function q(s){return(e,...t)=>pe(s,e,t)}function $t(s,e){return q(St(s,e).get)}const{apply:pe,construct:Rt,defineProperty:ho,get:bn,getOwnPropertyDescriptor:St,getPrototypeOf:as,has:Ln,ownKeys:Na,set:fo,setPrototypeOf:Ea}=Reflect,Lh=Proxy,{EPSILON:kh,MAX_SAFE_INTEGER:po,isFinite:Ta,isNaN:xt}=Number,{iterator:We,species:Ph,toStringTag:pi,for:Oh}=Symbol,At=Object,{create:en,defineProperty:ls,freeze:Rh,is:mo}=At,kn=At.prototype,Dh=kn.__lookupGetter__?q(kn.__lookupGetter__):(s,e)=>{if(s==null)throw K(En);let t=At(s);do{const n=St(t,e);if(n!==void 0)return je(n,"get")?n.get:void 0}while((t=as(t))!==null)},je=At.hasOwn||q(kn.hasOwnProperty),La=Array,ka=La.isArray,tn=La.prototype,zh=q(tn.join),Bh=q(tn.push),Mh=q(tn.toLocaleString),mi=tn[We],Fh=q(mi),{abs:Uh,trunc:Pa}=Math,sn=ArrayBuffer,Wh=sn.isView,Oa=sn.prototype,Gh=q(Oa.slice),Vh=$t(Oa,"byteLength"),Pn=typeof SharedArrayBuffer<"u"?SharedArrayBuffer:null,Hh=Pn&&$t(Pn.prototype,"byteLength"),gi=as(Uint8Array),jh=gi.from,re=gi.prototype,qh=re[We],Yh=q(re.keys),Kh=q(re.values),Xh=q(re.entries),Jh=q(re.set),go=q(re.reverse),Qh=q(re.fill),Zh=q(re.copyWithin),yo=q(re.sort),Pt=q(re.slice),ed=q(re.subarray),ie=$t(re,"buffer"),et=$t(re,"byteOffset"),U=$t(re,"length"),Ra=$t(re,pi),td=Uint8Array,we=Uint16Array,bo=(...s)=>pe(jh,we,s),yi=Uint32Array,sd=Float32Array,ut=as([][We]()),nn=q(ut.next),nd=q((function*(){})().next),id=as(ut),K=TypeError,wn=RangeError,Da=WeakSet,za=Da.prototype,od=q(za.add),rd=q(za.has),on=WeakMap,bi=on.prototype,Ms=q(bi.get),ad=q(bi.has),wi=q(bi.set),Ba=new on,ld=en(null,{next:{value:function(){const e=Ms(Ba,this);return nn(e)}},[We]:{value:function(){return this}}});function ms(s){if(s[We]===mi&&ut.next===nn)return s;const e=en(ld);return wi(Ba,e,Fh(s)),e}const Ma=new on,Fa=en(id,{next:{value:function(){const e=Ms(Ma,this);return nd(e)},writable:!0,configurable:!0}});for(const s of Na(ut))s!=="next"&&ls(Fa,s,St(ut,s));function wo(s){const e=en(Fa);return wi(Ma,e,s),e}function Fs(s){return s!==null&&typeof s=="object"||typeof s=="function"}function So(s){return s!==null&&typeof s=="object"}function Us(s){return Ra(s)!==void 0}function On(s){const e=Ra(s);return e==="BigInt64Array"||e==="BigUint64Array"}function ud(s){try{return ka(s)?!1:(Vh(s),!0)}catch{return!1}}function Ua(s){if(Pn===null)return!1;try{return Hh(s),!0}catch{return!1}}function cd(s){return ud(s)||Ua(s)}function xo(s){return ka(s)?s[We]===mi&&ut.next===nn:!1}function hd(s){return Us(s)?s[We]===qh&&ut.next===nn:!1}function gs(s){if(typeof s!="string")return!1;const e=+s;return s!==e+""||!Ta(e)?!1:e===Pa(e)}const Ws=Oh("__Float16Array__");function dd(s){if(!So(s))return!1;const e=as(s);if(!So(e))return!1;const t=e.constructor;if(t===void 0)return!1;if(!Fs(t))throw K($a);return Ln(t,Ws)}const Rn=1/kh;function fd(s){return s+Rn-Rn}const Wa=6103515625e-14,pd=65504,Ga=.0009765625,Ao=Ga*Wa,md=Ga*Rn;function gd(s){const e=+s;if(!Ta(e)||e===0)return e;const t=e>0?1:-1,n=Uh(e);if(n<Wa)return t*fd(n/Ao)*Ao;const i=(1+md)*n,o=i-(i-n);return o>pd||xt(o)?t*(1/0):t*o}const Va=new sn(4),Ha=new sd(Va),ja=new yi(Va),Te=new we(512),Le=new td(512);for(let s=0;s<256;++s){const e=s-127;e<-24?(Te[s]=0,Te[s|256]=32768,Le[s]=24,Le[s|256]=24):e<-14?(Te[s]=1024>>-e-14,Te[s|256]=1024>>-e-14|32768,Le[s]=-e-1,Le[s|256]=-e-1):e<=15?(Te[s]=e+15<<10,Te[s|256]=e+15<<10|32768,Le[s]=13,Le[s|256]=13):e<128?(Te[s]=31744,Te[s|256]=64512,Le[s]=24,Le[s|256]=24):(Te[s]=31744,Te[s|256]=64512,Le[s]=13,Le[s|256]=13)}function ze(s){Ha[0]=gd(s);const e=ja[0],t=e>>23&511;return Te[t]+((e&8388607)>>Le[t])}const Si=new yi(2048);for(let s=1;s<1024;++s){let e=s<<13,t=0;for(;(e&8388608)===0;)e<<=1,t-=8388608;e&=-8388609,t+=947912704,Si[s]=e|t}for(let s=1024;s<2048;++s)Si[s]=939524096+(s-1024<<13);const Nt=new yi(64);for(let s=1;s<31;++s)Nt[s]=s<<23;Nt[31]=1199570944;Nt[32]=2147483648;for(let s=33;s<63;++s)Nt[s]=2147483648+(s-32<<23);Nt[63]=3347054592;const qa=new we(64);for(let s=1;s<64;++s)s!==32&&(qa[s]=1024);function G(s){const e=s>>10;return ja[0]=Si[qa[e]+(s&1023)]+Nt[e],Ha[0]}function Ve(s){const e=+s;return xt(e)||e===0?0:Pa(e)}function Sn(s){const e=Ve(s);return e<0?0:e<po?e:po}function ys(s,e){if(!Fs(s))throw K(Ih);const t=s.constructor;if(t===void 0)return e;if(!Fs(t))throw K($a);const n=t[Ph];return n??e}function Wt(s){if(Ua(s))return!1;try{return Gh(s,0,0),!1}catch{}return!0}function vo(s,e){const t=xt(s),n=xt(e);if(t&&n)return 0;if(t)return 1;if(n||s<e)return-1;if(s>e)return 1;if(s===0&&e===0){const i=mo(s,0),o=mo(e,0);if(!i&&o)return-1;if(i&&!o)return 1}return 0}const xi=2,Gs=new on;function mt(s){return ad(Gs,s)||!Wh(s)&&dd(s)}function F(s){if(!mt(s))throw K($h)}function bs(s,e){const t=mt(s),n=Us(s);if(!t&&!n)throw K(Nh);if(typeof e=="number"){let i;if(t){const o=k(s);i=U(o)}else i=U(s);if(i<e)throw K(Eh)}if(On(s))throw K(Tn)}function k(s){const e=Ms(Gs,s);if(e!==void 0){const i=ie(e);if(Wt(i))throw K(Ut);return e}const t=s.buffer;if(Wt(t))throw K(Ut);const n=Rt(Y,[t,s.byteOffset,s.length],s.constructor);return Ms(Gs,n)}function Co(s){const e=U(s),t=[];for(let n=0;n<e;++n)t[n]=G(s[n]);return t}const Ya=new Da;for(const s of Na(re)){if(s===pi)continue;const e=St(re,s);je(e,"get")&&typeof e.get=="function"&&od(Ya,e.get)}const yd=Rh({get(s,e,t){return gs(e)&&je(s,e)?G(bn(s,e)):rd(Ya,Dh(s,e))?bn(s,e):bn(s,e,t)},set(s,e,t,n){return gs(e)&&je(s,e)?fo(s,e,ze(t)):fo(s,e,t,n)},getOwnPropertyDescriptor(s,e){if(gs(e)&&je(s,e)){const t=St(s,e);return t.value=G(t.value),t}return St(s,e)},defineProperty(s,e,t){return gs(e)&&je(s,e)&&je(t,"value")&&(t.value=ze(t.value)),ho(s,e,t)}});class Y{constructor(e,t,n){let i;if(mt(e))i=Rt(we,[k(e)],new.target);else if(Fs(e)&&!cd(e)){let r,a;if(Us(e)){r=e,a=U(e);const l=ie(e);if(Wt(l))throw K(Ut);if(On(e))throw K(Tn);const u=new sn(a*xi);i=Rt(we,[u],new.target)}else{const l=e[We];if(l!=null&&typeof l!="function")throw K(uo);l!=null?xo(e)?(r=e,a=e.length):(r=[...e],a=r.length):(r=e,a=Sn(r.length)),i=Rt(we,[a],new.target)}for(let l=0;l<a;++l)i[l]=ze(r[l])}else i=Rt(we,arguments,new.target);const o=new Lh(i,yd);return wi(Gs,o,i),o}static from(e,...t){const n=this;if(!Ln(n,Ws))throw K(lo);if(n===Y){if(mt(e)&&t.length===0){const c=k(e),h=new we(ie(c),et(c),U(c));return new Y(ie(Pt(h)))}if(t.length===0)return new Y(ie(bo(e,ze)));const l=t[0],u=t[1];return new Y(ie(bo(e,function(c,...h){return ze(pe(l,this,[c,...ms(h)]))},u)))}let i,o;const r=e[We];if(r!=null&&typeof r!="function")throw K(uo);if(r!=null)xo(e)?(i=e,o=e.length):hd(e)?(i=e,o=U(e)):(i=[...e],o=i.length);else{if(e==null)throw K(En);i=At(e),o=Sn(i.length)}const a=new n(o);if(t.length===0)for(let l=0;l<o;++l)a[l]=i[l];else{const l=t[0],u=t[1];for(let c=0;c<o;++c)a[c]=pe(l,u,[i[c],c])}return a}static of(...e){const t=this;if(!Ln(t,Ws))throw K(lo);const n=e.length;if(t===Y){const o=new Y(n),r=k(o);for(let a=0;a<n;++a)r[a]=ze(e[a]);return o}const i=new t(n);for(let o=0;o<n;++o)i[o]=e[o];return i}keys(){F(this);const e=k(this);return Yh(e)}values(){F(this);const e=k(this);return wo((function*(){for(const t of Kh(e))yield G(t)})())}entries(){F(this);const e=k(this);return wo((function*(){for(const[t,n]of Xh(e))yield[t,G(n)]})())}at(e){F(this);const t=k(this),n=U(t),i=Ve(e),o=i>=0?i:n+i;if(!(o<0||o>=n))return G(t[o])}with(e,t){F(this);const n=k(this),i=U(n),o=Ve(e),r=o>=0?o:i+o,a=+t;if(r<0||r>=i)throw wn(yn);const l=new we(ie(n),et(n),U(n)),u=new Y(ie(Pt(l))),c=k(u);return c[r]=ze(a),u}map(e,...t){F(this);const n=k(this),i=U(n),o=t[0],r=ys(n,Y);if(r===Y){const l=new Y(i),u=k(l);for(let c=0;c<i;++c){const h=G(n[c]);u[c]=ze(pe(e,o,[h,c,this]))}return l}const a=new r(i);bs(a,i);for(let l=0;l<i;++l){const u=G(n[l]);a[l]=pe(e,o,[u,l,this])}return a}filter(e,...t){F(this);const n=k(this),i=U(n),o=t[0],r=[];for(let u=0;u<i;++u){const c=G(n[u]);pe(e,o,[c,u,this])&&Bh(r,c)}const a=ys(n,Y),l=new a(r);return bs(l),l}reduce(e,...t){F(this);const n=k(this),i=U(n);if(i===0&&t.length===0)throw K(co);let o,r;t.length===0?(o=G(n[0]),r=1):(o=t[0],r=0);for(let a=r;a<i;++a)o=e(o,G(n[a]),a,this);return o}reduceRight(e,...t){F(this);const n=k(this),i=U(n);if(i===0&&t.length===0)throw K(co);let o,r;t.length===0?(o=G(n[i-1]),r=i-2):(o=t[0],r=i-1);for(let a=r;a>=0;--a)o=e(o,G(n[a]),a,this);return o}forEach(e,...t){F(this);const n=k(this),i=U(n),o=t[0];for(let r=0;r<i;++r)pe(e,o,[G(n[r]),r,this])}find(e,...t){F(this);const n=k(this),i=U(n),o=t[0];for(let r=0;r<i;++r){const a=G(n[r]);if(pe(e,o,[a,r,this]))return a}}findIndex(e,...t){F(this);const n=k(this),i=U(n),o=t[0];for(let r=0;r<i;++r){const a=G(n[r]);if(pe(e,o,[a,r,this]))return r}return-1}findLast(e,...t){F(this);const n=k(this),i=U(n),o=t[0];for(let r=i-1;r>=0;--r){const a=G(n[r]);if(pe(e,o,[a,r,this]))return a}}findLastIndex(e,...t){F(this);const n=k(this),i=U(n),o=t[0];for(let r=i-1;r>=0;--r){const a=G(n[r]);if(pe(e,o,[a,r,this]))return r}return-1}every(e,...t){F(this);const n=k(this),i=U(n),o=t[0];for(let r=0;r<i;++r)if(!pe(e,o,[G(n[r]),r,this]))return!1;return!0}some(e,...t){F(this);const n=k(this),i=U(n),o=t[0];for(let r=0;r<i;++r)if(pe(e,o,[G(n[r]),r,this]))return!0;return!1}set(e,...t){F(this);const n=k(this),i=Ve(t[0]);if(i<0)throw wn(yn);if(e==null)throw K(En);if(On(e))throw K(Tn);if(mt(e))return Jh(k(this),k(e),i);if(Us(e)){const l=ie(e);if(Wt(l))throw K(Ut)}const o=U(n),r=At(e),a=Sn(r.length);if(i===1/0||a+i>o)throw wn(yn);for(let l=0;l<a;++l)n[l+i]=ze(r[l])}reverse(){F(this);const e=k(this);return go(e),this}toReversed(){F(this);const e=k(this),t=new we(ie(e),et(e),U(e)),n=new Y(ie(Pt(t))),i=k(n);return go(i),n}fill(e,...t){F(this);const n=k(this);return Qh(n,ze(e),...ms(t)),this}copyWithin(e,t,...n){F(this);const i=k(this);return Zh(i,e,t,...ms(n)),this}sort(e){F(this);const t=k(this),n=e!==void 0?e:vo;return yo(t,(i,o)=>n(G(i),G(o))),this}toSorted(e){F(this);const t=k(this);if(e!==void 0&&typeof e!="function")throw new K(Th);const n=e!==void 0?e:vo,i=new we(ie(t),et(t),U(t)),o=new Y(ie(Pt(i))),r=k(o);return yo(r,(a,l)=>n(G(a),G(l))),o}slice(e,t){F(this);const n=k(this),i=ys(n,Y);if(i===Y){const p=new we(ie(n),et(n),U(n));return new Y(ie(Pt(p,e,t)))}const o=U(n),r=Ve(e),a=t===void 0?o:Ve(t);let l;r===-1/0?l=0:r<0?l=o+r>0?o+r:0:l=o<r?o:r;let u;a===-1/0?u=0:a<0?u=o+a>0?o+a:0:u=o<a?o:a;const c=u-l>0?u-l:0,h=new i(c);if(bs(h,c),c===0)return h;const d=ie(n);if(Wt(d))throw K(Ut);let m=0;for(;l<u;)h[m]=G(n[l]),++l,++m;return h}subarray(e,t){F(this);const n=k(this),i=ys(n,Y),o=new we(ie(n),et(n),U(n)),r=ed(o,e,t),a=new i(ie(r),et(r),U(r));return bs(a),a}indexOf(e,...t){F(this);const n=k(this),i=U(n);let o=Ve(t[0]);if(o===1/0)return-1;o<0&&(o+=i,o<0&&(o=0));for(let r=o;r<i;++r)if(je(n,r)&&G(n[r])===e)return r;return-1}lastIndexOf(e,...t){F(this);const n=k(this),i=U(n);let o=t.length>=1?Ve(t[0]):i-1;if(o===-1/0)return-1;o>=0?o=o<i-1?o:i-1:o+=i;for(let r=o;r>=0;--r)if(je(n,r)&&G(n[r])===e)return r;return-1}includes(e,...t){F(this);const n=k(this),i=U(n);let o=Ve(t[0]);if(o===1/0)return!1;o<0&&(o+=i,o<0&&(o=0));const r=xt(e);for(let a=o;a<i;++a){const l=G(n[a]);if(r&&xt(l)||l===e)return!0}return!1}join(e){F(this);const t=k(this),n=Co(t);return zh(n,e)}toLocaleString(...e){F(this);const t=k(this),n=Co(t);return Mh(n,...ms(e))}get[pi](){if(mt(this))return"Float16Array"}}ls(Y,"BYTES_PER_ELEMENT",{value:xi});ls(Y,Ws,{});Ea(Y,gi);const Vs=Y.prototype;ls(Vs,"BYTES_PER_ELEMENT",{value:xi});ls(Vs,We,{value:Vs.values,writable:!0,configurable:!0});Ea(Vs,re);function bd(s,e){return s.channels===e.channels}const ws=8;class Ss{autoUpdateOutputBuffer=!0;_label;_device;_outputBuffers={};_pipeline;_bindGroups=[];_needsUpdatePipeline=!0;_needsResizeBuffer=!0;_inputs=[];_outputs=[];_uniforms=[];_uniformBuffers={};_width=10;_height=10;_execWidth;_execHeight;_csCode="";_csMain;_csDefine;_groupOffsets={inputs:0,uniforms:1,outputs:2};constructor(e,t,n){this._label=e,this._device=t,this._csMain=n.csMain,this._csDefine=n.csDefine,this._inputs=n.inputs,this._outputs=n.outputs,this._uniforms=n.uniforms,this.autoUpdateOutputBuffer=n.autoUpdateOutputBuffer??!0,n.uniforms.forEach(i=>{this._uniformBuffers[i.label]=t.createBuffer({label:this._label,size:i.data.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._uniformBuffers[i.label],0,i.data)})}setCSCode({csDefine:e,csMain:t}){this._csDefine=e,this._csMain=t,this._needsUpdatePipeline=!0}setSize(e,t){e=Math.ceil(e),t=Math.ceil(t);const n=e!==this._width||t!==this._height;this._width=e,this._height=t,n&&(this._needsResizeBuffer=!0,this._needsUpdatePipeline=!0)}setExecuteSize(e,t){e=Math.ceil(e),t=Math.ceil(t),this._execWidth=e,this._execHeight=t}setOutputParams(e){this.autoUpdateOutputBuffer&&this._updateOutputBuffers(e),this._needsUpdatePipeline=!0}setOutputBuffers(e){this._outputBuffers=Object.keys(e).reduce((t,n)=>(t[n]={buffer:e[n],params:{channels:4}},t),{})}setUniform(e,t){const n=this._uniformBuffers[e];this._device.queue.writeBuffer(n,0,t)}getOutput(e){return this._needsResizeBuffer&&this.autoUpdateOutputBuffer&&(this._resizeOutputBuffers(),this._needsResizeBuffer=!1),this._outputBuffers[e].buffer}dispose(){Object.keys(this._uniformBuffers).forEach(e=>{this._uniformBuffers[e].destroy()}),Object.keys(this._outputBuffers).forEach(e=>{this._outputBuffers[e].buffer.destroy()})}_createBuffer(e){const t=this._width*this._height*4*4;return this._device.createBuffer({label:this._label,size:Math.max(t,80),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}_resizeOutputBuffers(){const e=this._outputBuffers;for(const t in e){const{buffer:n,params:i}=e[t];n.destroy(),e[t].buffer=this._createBuffer(i)}}_updateOutputBuffers(e){const t=this._outputBuffers;for(const n in e){const i=e[n];if(!bd(i,t[n]?.params||{})){t[n]?.buffer.destroy();const o=this._createBuffer(i);t[n]={buffer:o,params:i}}}}_updatePipeline(e,t){if(!this._needsUpdatePipeline)return;this._needsUpdatePipeline=!1;const n=this._device,i=this._getFullCs(e,t);i!==this._csCode&&(this._csCode=i,this._pipeline=n.createComputePipeline({label:this._label,layout:"auto",compute:{module:n.createShaderModule({label:this._label,code:i}),entryPoint:"main"}}),this._updateBindGroups())}_getFullCs(e,t){const n=this._inputs,i=this._uniforms;let o=0;const r=this._groupOffsets={inputs:0,uniforms:0,outputs:0};return n.length>0&&o++,i.length>0&&(r.uniforms=o,o++),r.outputs=o,`
${n.sort().map((l,u)=>{const c=`@group(${r.inputs}) @binding(${u}) `,h=`in_${l}`;return t[l]==="texture"?`${c} var ${h}: texture_2d<f32>;`:`${c} var<storage, read> ${h}: array<vec${e[l].channels}f>;`}).join(`
`)}
${this._uniforms.map((l,u)=>`@group(${r.uniforms}) @binding(${u}) var<uniform> ${l.label}: ${l.type};`).join(`
`)}

${this._outputs.map((l,u)=>`@group(${r.outputs}) @binding(${u}) var<storage, read_write> out_${l}: array<vec${this._outputBuffers[l].params.channels}f>;`).join(`
`)}
${this._csDefine??""}
@compute @workgroup_size(${ws}, ${ws}, 1)
fn main(@builtin(global_invocation_id) globalId: vec3u) {
${this._csMain}
}
`}_updateBindGroups(){const e=[],t=this._device,n=this._groupOffsets;this._uniforms.length>0&&(e[n.uniforms]=t.createBindGroup({label:this._label,layout:this._pipeline.getBindGroupLayout(n.uniforms),entries:this._uniforms.map((i,o)=>({binding:o,resource:{buffer:this._uniformBuffers[i.label]}}))})),this._bindGroups=e}createPass(e,t){this._needsResizeBuffer&&this.autoUpdateOutputBuffer&&(this._resizeOutputBuffers(),this._needsResizeBuffer=!1);const n=this._inputs.reduce((r,a)=>(r[a]=t[a].buffer?"buffer":"texture",r),{});this._updatePipeline(t,n);const i=this._groupOffsets;this._inputs.length>0&&(this._bindGroups[i.inputs]=this._device.createBindGroup({label:this._label,layout:this._pipeline.getBindGroupLayout(i.inputs),entries:this._inputs.map((r,a)=>({binding:a,resource:t[r].buffer?{buffer:t[r].buffer}:t[r].texture.createView()}))})),this._bindGroups[i.outputs]=this._device.createBindGroup({label:this._label,layout:this._pipeline.getBindGroupLayout(i.outputs),entries:this._outputs.map((r,a)=>({binding:a,resource:{buffer:this._outputBuffers[r].buffer}}))});const o=e.beginComputePass();o.setPipeline(this._pipeline),this._bindGroups.forEach((r,a)=>{o.setBindGroup(a,r)}),o.dispatchWorkgroups(Math.ceil((this._execWidth??this._width)/ws),Math.ceil((this._execHeight??this._height)/ws),1),o.end()}}const Ai=1412.83765,vi=1.64593172,Ci=.431384981,_i=-.00294139609,Ii=.192653254,$i=.00626026094,Ni=.998620152,Ka=15794576e-13,Xa=.0322087631,Ja=.00223151711,Qa=.370974749;function Za(s){return s<=Ka?s=Ai*s:s<=Xa?s=vi*Math.pow(s,Ci)+_i:s=Ii*Math.log(s+$i)+Ni,s}function wd(s){return s<=Ja?s=s/Ai:s<=Qa?s=Math.pow((s-_i)/vi,1/Ci):s=Math.exp((s-Ni)/Ii)-$i,s}const Sd=65504,el=Za(Sd),tl=1/el,sl=el;class xn{x;y;width;height;constructor(e,t,n,i){this.x=e,this.y=t,this.width=n,this.height=i}}function xd({data:s,channels:e}){let t=0;for(let r=0;r<s.length;r+=e){const a=s[r],l=s[r+1],u=s[r+2],c=.212671*a+.71516*l+.072169*u;t+=Math.log2(c+1e-4)}const n=s.length/e,i=t/n;return .18/Math.pow(2,i)}function Ad({data:s,channels:e,inputScale:t}){const n=new Float32Array(s.length);n.set(s);for(let i=0;i<n.length;i+=e)for(let o=0;o<3;o++){let r=n[i+o]*t;n[i+o]=Za(r)*tl}return n}function vd({data:s,channels:e,inputScale:t}){const n=new Float32Array(s.length);n.set(s);const i=1/t;for(let o=0;o<n.length;o+=e)for(let r=0;r<3;r++){let a=n[o+r]*sl;n[o+r]=wd(a)*i}return n}const _o=`
const a = ${Ai};
const b = ${vi};
const c = ${Ci};
const d = ${_i};
const e = ${Ii};
const f = ${$i};
const g = ${Ni};
const y0 =${Ka};
const y1 =${Xa};
const x0 =${Ja};
const x1 =${Qa};

const normScale = ${tl};
const rcpNormScale = ${sl};
`;class Cd{_device;_isHDR;_inputPassAux;_inputPassColor;_outputPass;_copyPass;_isInputTexture;constructor(e,t){this._device=e,this._isHDR=t;const n=[{label:"inputScale",type:"f32",data:new Float32Array([1])},{label:"inputSize",type:"vec2i",data:new Int32Array(2)},{label:"outputSize",type:"vec2i",data:new Int32Array(2)},{label:"inputOffset",type:"vec2i",data:new Int32Array(2)}];this._inputPassAux=new Ss("inputPassAux",this._device,{inputs:["color","albedo","normal"],outputs:["color","albedo","normal"],uniforms:n,csDefine:"",csMain:""}),this._inputPassColor=new Ss("inputPassColor",this._device,{inputs:["color"],outputs:["color"],uniforms:n,csDefine:"",csMain:""}),this._outputPass=new Ss("outputPass",this._device,{inputs:["color","raw"],outputs:["color"],uniforms:[{label:"inputScale",type:"f32",data:new Float32Array([1])},{label:"inputSize",type:"vec2i",data:new Int32Array(2)},{label:"outputSize",type:"vec2i",data:new Int32Array(2)},{label:"imageSize",type:"vec2i",data:new Int32Array(2)},{label:"inputOffset",type:"vec2i",data:new Int32Array(2)},{label:"outputOffset",type:"vec2i",data:new Int32Array(2)}],csDefine:"",csMain:""}),this._copyPass=new Ss("copyPass",this._device,{inputs:["color"],outputs:["color"],autoUpdateOutputBuffer:!1,uniforms:[{label:"size",type:"vec2i",data:new Int32Array(2)}],csMain:`
let outIdx = i32(globalId.x + globalId.y * u32(size.x));
out_color[outIdx] = textureLoad(in_color, globalId.xy, 0);
`}),this._inputPassAux.setOutputParams({color:{channels:3},albedo:{channels:3},normal:{channels:3}}),this._inputPassColor.setOutputParams({color:{channels:3}}),this._outputPass.setOutputParams({color:{channels:4}})}_updatePasses(e,t=!1){if(this._isInputTexture!=null&&this._isInputTexture===e)return;this._isInputTexture=e;const n=this._isHDR,i=`
${_o}
fn PUForward(y: f32) -> f32 {
  if (y <= y0) {
    return a * y;
  } else if (y <= y1) {
    return b * pow(y, c) + d;
  } else {
    return e * log(y + f) + g;
  }
}`;function o(a){return e?`textureLoad(in_${a}, globalId.xy + vec2u(inputOffset), 0)`:`in_${a}[inIdx]`}const r=`
let x = i32(globalId.x);
let y = i32(globalId.y);
let inIdx = (y + inputOffset.y) * inputSize.x + (x + inputOffset.x);
let col = ${o("color")};

let outIdx = y * outputSize.x + x;

if (${t}) {
  // Denoise the inversed alpha. Or the anti aliased edge will be too dark after denoised
  out_color[outIdx] = vec3f(1.0 - col.a);
}
else if (${n}) {
  out_color[outIdx] = vec3f(PUForward(col.r * inputScale), PUForward(col.g * inputScale), PUForward(col.b * inputScale)) * normScale;
}
else {
  out_color[outIdx] = col.rgb;
}
`;this._inputPassAux.setCSCode({csDefine:i,csMain:`
${r}
let alb = ${o("albedo")};
let nor = ${o("normal")};
out_normal[outIdx] = nor.rgb;
out_albedo[outIdx] = alb.rgb;
  `}),this._inputPassColor.setCSCode({csDefine:i,csMain:`
${r}
`}),this._outputPass.setCSCode({csDefine:`
${_o}
fn PUInverse(y: f32) -> f32 {
  if (y <= x0) {
    return y / a;
  } else if (y <= x1) {
    return pow((y - d) / b, 1 / c);
  } else {
    return exp((y - g) / e) - f;
  }
}
`,csMain:`
let x = i32(globalId.x);
let y = i32(globalId.y);
if (x >= outputSize.x || y >= outputSize.y) {
  return;
}
let inIdx = (y + inputOffset.y) * inputSize.x + x + inputOffset.x;
let outIdx = (y + outputOffset.y) * imageSize.x + x + outputOffset.x;
let col = in_color[inIdx];
let raw = ${e?"textureLoad(in_raw, globalId.xy + vec2u(outputOffset), 0)":"in_raw[outIdx]"};

if (${t}) {
  out_color[outIdx] = vec4f(raw.rgb, 1.0 - col.r);
}
else if (${n}) {
  out_color[outIdx] = vec4f(
    vec3f(PUInverse(col.r * rcpNormScale), PUInverse(col.g * rcpNormScale), PUInverse(col.b * rcpNormScale)) / inputScale,
    // Pick the alpha
    raw.a
  );
}
else {
  out_color[outIdx] = vec4f(col.rgb, raw.a);
}
`})}setImageSize(e,t){this._inputPassAux.setUniform("inputSize",new Int32Array([e,t])),this._inputPassColor.setUniform("inputSize",new Int32Array([e,t])),this._outputPass.setUniform("imageSize",new Int32Array([e,t])),this._outputPass.setSize(e,t),this._copyPass.setSize(e,t),this._copyPass.setUniform("size",new Int32Array([e,t]))}setInputTile(e){const t=new Int32Array([e.width,e.height]);[this._inputPassAux,this._inputPassColor].forEach(n=>{n.setUniform("inputOffset",new Int32Array([e.x,e.y])),n.setUniform("outputSize",t),n.setSize(t[0],t[1])}),this._outputPass.setUniform("inputSize",t)}setOutputTile(e,t){const n=this._outputPass,i=new Int32Array([e.width,e.height]),o=e.x-t.x,r=e.y-t.y;n.setUniform("outputSize",i),n.setUniform("inputOffset",new Int32Array([o,r])),n.setUniform("outputOffset",new Int32Array([e.x,e.y])),n.setExecuteSize(i[0],i[1])}forward(e,t,n,i){const o=e instanceof GPUTexture;this._updatePasses(o,i);const r=this._inputPassAux,a=this._inputPassColor,l=this._device.createCommandEncoder();function u(c){return c instanceof GPUTexture?{texture:c,channels:4}:{buffer:c,channels:4}}return t&&n?r.createPass(l,{color:u(e),albedo:u(t),normal:u(n)}):a.createPass(l,{color:u(e)}),this._device.queue.submit([l.finish()]),t&&n?{color:r.getOutput("color"),albedo:r.getOutput("albedo"),normal:r.getOutput("normal")}:{color:a.getOutput("color")}}inverse(e,t){const i=this._device.createCommandEncoder(),o=this._outputPass;return o.createPass(i,{color:{buffer:e,channels:4},raw:t instanceof GPUBuffer?{buffer:t,channels:4}:{texture:t,channels:4}}),this._device.queue.submit([i.finish()]),o.getOutput("color")}copyInputDataToOutput(e){const t=this._device.createCommandEncoder(),i=this._outputPass.getOutput("color"),o=this._copyPass;e instanceof GPUTexture?(o.setOutputBuffers({color:i}),o.createPass(t,{color:{texture:e,channels:4}})):t.copyBufferToBuffer(e,0,i,0,i.size),this._device.queue.submit([t.finish()])}dispose(){this._outputPass.dispose(),this._inputPassAux.dispose()}}function Io(s,e){const t=s.buffer;if(e==="Float32")return new Float32Array(s.buffer);const n=new Y(t),i=new Float32Array(n.length);for(let o=0;o<i.length;++o)i[o]=n[o];return i}function _d(s,e){const[t,n,i,o]=e,r=new Float32Array(s.length);for(let a=0;a<t;++a)for(let l=0;l<n;++l)for(let u=0;u<i;++u)for(let c=0;c<o;++c){const h=a*n*i*o+l*i*o+u*o+c,d=u*o*n*t+c*n*t+l*t+a;r[d]=s[h]}return r}function Gt(s,e){return Math.ceil(s/e)*e}function xs(s){return s.data instanceof GPUBuffer||s.data instanceof GPUTexture}const Id=174,$d=202,nl=16,As=Gt(Id/2,nl),$o=Gt($d/2,nl);class Nd{_hostTensors;_backend;_tfModel;_device;_tileWidth=0;_tileHeight=0;_tileOverlapX=0;_tileOverlapY=0;_aux;_hdr;_dataProcessGPU;_maxTileSize;_tensors=new Map;_modelsCache=new Map;constructor(e,t,n={}){this._hostTensors=e,this._backend=t,this._aux=n.aux||!1,this._hdr=n.hdr||!1,this._maxTileSize=Gt(n.maxTileSize??512,2),this._device=this._backend.device}getDevice(){return this._device}_buildModel(e){const n=3+(this._aux?6:0),i=this._getTileSizeWithOverlap(),o=this._modelsCache,r=[i.width,i.height].join(",");if(o.has(r)){this._tfModel=o.get(r);return}const a=ah({name:"input",shape:[i.height,i.width,n],dtype:"float32"});this._tfModel=new Zs({inputs:[a],outputs:e?this._addNetLarge(a):this._addNet(a)}),o.set(r,this._tfModel)}_createConv(e,t,n){const i=e+".weight",o=e+".bias",r=this._tensors;let a=r.get(i),l=r.get(o);const u=this._hostTensors.get(i);if(!a){const h=u.desc.dims;a=an(_d(Io(u.data,u.desc.dataType),h),[h[2],h[3],h[1],h[0]],"float32"),r.set(i,a)}if(!l){const h=this._hostTensors.get(e+".bias");l=Ht(Io(h.data,h.desc.dataType),"float32"),r.set(o,l)}return new It({name:e,filters:u.desc.dims[0],kernelSize:u.desc.dims.slice(2,4),useBias:!0,activation:n,padding:"same",weights:[a,l],trainable:!1}).apply(t)}_createConcatConv(e,t,n){const i=new fi({name:e+"/concat",trainable:!1,axis:3});return this._createConv(e,i.apply([t,n]),"relu")}_createPooling(e){return new ci({name:e.name+"/pooling",poolSize:[2,2],strides:[2,2],padding:"same",trainable:!1}).apply(e)}_addUpsamplingLayer(e){return new ui({name:e.name+"/upsampling",size:[2,2],trainable:!1}).apply(e)}_addNet(e){let t=this._createConv("enc_conv0",e,"relu");const n=t=this._createPooling(this._createConv("enc_conv1",t,"relu")),i=t=this._createPooling(this._createConv("enc_conv2",t,"relu")),o=t=this._createPooling(this._createConv("enc_conv3",t,"relu")),r=t=this._createPooling(this._createConv("enc_conv4",t,"relu"));return t=this._createConv("enc_conv5a",r,"relu"),t=this._addUpsamplingLayer(this._createConv("enc_conv5b",t,"relu")),t=this._createConcatConv("dec_conv4a",t,o),t=this._addUpsamplingLayer(this._createConv("dec_conv4b",t,"relu")),t=this._createConcatConv("dec_conv3a",t,i),t=this._addUpsamplingLayer(this._createConv("dec_conv3b",t,"relu")),t=this._createConcatConv("dec_conv2a",t,n),t=this._addUpsamplingLayer(this._createConv("dec_conv2b",t,"relu")),t=this._createConcatConv("dec_conv1a",t,e),t=this._createConv("dec_conv1b",t,"relu"),t=this._createConv("dec_conv0",t,"relu"),t}_addNetLarge(e){let t=this._createConv("enc_conv1a",e,"relu");const n=t=this._createPooling(this._createConv("enc_conv1b",t,"relu"));t=this._createConv("enc_conv2a",t,"relu");const i=t=this._createPooling(this._createConv("enc_conv2b",t,"relu"));t=this._createConv("enc_conv3a",t,"relu");const o=t=this._createPooling(this._createConv("enc_conv3b",t,"relu"));t=this._createConv("enc_conv4a",t,"relu");const r=t=this._createPooling(this._createConv("enc_conv4b",t,"relu"));return t=this._createConv("enc_conv5a",r,"relu"),t=this._addUpsamplingLayer(this._createConv("enc_conv5b",t,"relu")),t=this._createConcatConv("dec_conv4a",t,o),t=this._addUpsamplingLayer(this._createConv("dec_conv4b",t,"relu")),t=this._createConcatConv("dec_conv3a",t,i),t=this._addUpsamplingLayer(this._createConv("dec_conv3b",t,"relu")),t=this._createConcatConv("dec_conv2a",t,n),t=this._addUpsamplingLayer(this._createConv("dec_conv2b",t,"relu")),t=this._createConcatConv("dec_conv1a",t,e),t=this._createConv("dec_conv1b",t,"relu"),t=this._createConv("dec_conv1c",t,"relu"),t}_updateModel(e,t){const n=this._hostTensors.has("enc_conv1b.weight"),i=this._maxTileSize;let o=i,r=i,a=n?$o:As,l=n?$o:As;e<i+As*2&&(o=Gt(e,i/2),e<=i&&(a=0)),t<i+As*2&&(r=Gt(t,i/2),t<=i&&(l=0));const u=Math.max(o,r),c=Math.max(a,l);o=u,r=u,a=c,l=c,(o!==this._tileWidth||r!==this._tileHeight||a!==this._tileOverlapX||l!==this._tileOverlapY||!this._tfModel)&&(this._tileWidth=o,this._tileHeight=r,this._tileOverlapX=a,this._tileOverlapY=l,this._buildModel(n))}_getTileSizeWithOverlap(){return{width:this._tileWidth+2*this._tileOverlapX,height:this._tileHeight+2*this._tileOverlapY}}_processImageData(e,t,n,i){const o=e.data,r=o.length/4,a=this._aux?9:3,l=new Float32Array(r*a);if(t&&!n||n&&!t)throw new Error("Normal map and albedo map are both required");if(t&&n&&(t.width!==n.width||t.height!==n.height||e.width!==t.width||e.height!==t.height))throw new Error("Image size mismatch");const u=t?.data,c=n?.data;for(let h=0;h<o.length;h+=4){const d=h/4*a;for(let m=0;m<3;m++)i?l[d+m]=o[h+m]:l[d+m]=o[h+m]/255,u&&(l[d+m+3]=u[h+m]/255),c&&(l[d+m+6]=c[h+m]/255)}return l}_readTile(e,t,n,i){const o=new Float32Array(n.width*n.height*t);for(let r=0;r<n.height;r++)for(let a=0;a<n.width;a++){const l=((r+n.y)*i+(a+n.x))*t,u=(r*n.width+a)*t;for(let c=0;c<t;c++)o[u+c]=e[l+c]}return o}_writeTile(e,t,n,i,o,r){const{data:a,width:l}=e,u=n.x-t.x,c=n.y-t.y;for(let h=0;h<n.height;h++)for(let d=0;d<n.width;d++){const m=((h+c)*o+d+u)*3,p=((h+n.y)*l+(d+n.x))*4;for(let f=0;f<3;f++)r?a[p+f]=i[m+f]:a[p+f]=Math.min(Math.max(i[m+f]*255,0),255);e.data[p+3]=r?1:255}}_executeTile(e,t,n,i,o,r,a,l,u){const c=this._aux?9:3,h=this._tileOverlapX,d=this._tileOverlapY;let m=this._getTileSizeWithOverlap(),p={width:this._tileWidth,height:this._tileHeight},f=i>0?i*p.width-h:0,g=Math.min(f+m.width,r);f=Math.max(g-m.width,0);let w=o>0?o*p.height-d:0,y=Math.min(w+m.height,a);w=Math.max(y-m.height,0);const x=m.width,S=m.height,A=new xn(f,w,x,S);let C,T=1;const $=this._device;let _=this._dataProcessGPU;if(e instanceof Float32Array){let P=this._readTile(e,c,A,r);l&&(T=xd({data:P,channels:c}),P=Ad({data:P,channels:c,inputScale:T})),C=an(P,[1,S,x,c],"float32")}else{_||(_=this._dataProcessGPU=new Cd($,l)),_.setImageSize(r,a),_.setInputTile(A),i===0&&o===0&&_.copyInputDataToOutput(e.color);const{color:P,albedo:z,normal:be}=_.forward(e.color,this._aux?e.albedo:void 0,this._aux?e.normal:void 0,u),de=Ne=>{const fe=an({buffer:Ne,zeroCopy:!0},[1,S,x,4]);return Vt(fe,[0,0,0,0],[1,S,x,3])};if(this._aux){const Ne=[P,z,be].map(fe=>de(fe));C=ql(Ne,3)}else C=de(P)}let N;const M=this._tfModel.predict(C),Q=Math.min(p.width,r),ne=Math.min(p.height,a),R=new xn(i*Q,o*ne,Q,ne);if(R.width=Math.min(R.width,r-R.x),R.height=Math.min(R.height,a-R.y),e instanceof Float32Array){let P=M.dataSync();l&&(P=vd({data:P,channels:3,inputScale:T})),this._writeTile(n,A,R,P,m.width,l);for(let z=0;z<ne;z++)for(let be=0;be<Q;be++){const de=(z*Q+be)*4,Ne=((z+R.y)*r+(be+R.x))*4;for(let fe=0;fe<4;fe++)t.data[de+fe]=n.data[Ne+fe]}}else{_.setOutputTile(R,A);const P=Yl(M,[[0,0],[0,0],[0,0],[0,1]]);N=_.inverse(P.dataToGPU().buffer,e.color)}return N}tileExecute({color:e,albedo:t,normal:n,done:i,progress:o,denoiseAlpha:r}){if(this._aux&&(!t||!n))throw new Error("Normal map and albedo map are both required");if(!this._aux&&(t||n))throw new Error("Normal map and albedo map are not required");const a=e.width,l=e.height;this._updateModel(a,l);const u=this._hdr||!1;let c;xs(e)||(c=this._processImageData(e,t,n,u));const h=this._tileWidth,d=this._tileHeight,m=Math.ceil(l/d),p=Math.ceil(a/h);function f(S,A){return u?{data:new Float32Array(S*A*4),width:S,height:A}:new ImageData(S,A)}const g=xs(e)?void 0:f(a,l),w=xs(e)?void 0:f(Math.min(h,a),Math.min(d,l));let y=!1;const x=(S,A)=>{if(y)return;let C;Bt.startScope(),C=this._executeTile(xs(e)?{color:e.data,albedo:t?.data,normal:n?.data}:c,w,g,S,A,a,l,u,r),Bt.endScope();const T=g||{data:C,width:a,height:l};o?.(T,w,new xn(S*h,A*d,h,d),S+A*p,p*m),S+1<p||A+1<m?requestAnimationFrame(()=>{S+1<p?x(S+1,A):A+1<m&&x(0,A+1)}):i(T)};return x(0,0),()=>{y=!0}}dispose(){this._tfModel?.dispose(),this._dataProcessGPU?.dispose(),this._tensors.forEach(e=>e.dispose())}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ve=ce();ve.registerFlag("WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE",()=>15);ve.registerFlag("WEBGPU_CPU_FORWARD",()=>!0);ve.registerFlag("WEBGPU_MATMUL_PROGRAM_TYPE",()=>-1);ve.registerFlag("WEBGPU_USE_NAIVE_CONV2D_TRANSPOSE",()=>!0);ve.registerFlag("WEBGPU_USE_LOW_POWER_GPU",()=>!1);ve.registerFlag("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e3);ve.registerFlag("WEBGPU_USE_PROFILE_TOOL",()=>!1);ve.registerFlag("WEBGPU_IMPORT_EXTERNAL_TEXTURE",()=>!0);ve.registerFlag("WEBGPU_USE_NAIVE_CONV2D_DEBUG",()=>!1);ve.registerFlag("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL",()=>-1);ve.registerFlag("WEBGPU_CONV_SEPARATE_IM2COL_SHADER",()=>!1);ve.registerFlag("WEBGPU_PRINT_SHADER",()=>"");ve.registerFlag("WEBGPU_ENGINE_COMPILE_ONLY",()=>!1);/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Ed{constructor(e){e&&(this.vendor=e.vendor,this.architecture=e.architecture,this.intelGPUGeneration=this.getIntelGPUGeneration())}getIntelGPUGeneration(){if(this.isIntel()){if(this.architecture.startsWith("gen"))return Number(this.architecture.match(/\d+/));if(this.architecture.startsWith("xe"))return 12}return 0}isIntel(){return this.vendor==="intel"}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Td{constructor(e){this.device=e,this.numUsedBuffers=0,this.numFreeBuffers=0,this.freeBuffers=new Map,this.usedBuffers=new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireBuffer(e,t,n=!1,i=!0){let o;const r=No(e,t);return i?(this.freeBuffers.has(r)||this.freeBuffers.set(r,[]),this.freeBuffers.get(r).length>0?(o=this.freeBuffers.get(r).pop(),this.numFreeBuffers--):(o=this.device.createBuffer({size:e,usage:t,mappedAtCreation:n}),this.numBytesAllocated+=e)):(o=this.device.createBuffer({size:e,usage:t,mappedAtCreation:n}),this.numBytesAllocated+=e),this.usedBuffers.has(r)||this.usedBuffers.set(r,[]),this.usedBuffers.get(r).push(o),this.numUsedBuffers++,this.numBytesUsed+=e,o}releaseBuffer(e,t=!0){if(this.freeBuffers.size===0)return;const n=e.size,i=e.usage,o=No(n,i),r=this.usedBuffers.get(o),a=r.indexOf(e);if(a<0)throw new Error("Cannot find the buffer in buffer manager");r[a]=r[r.length-1],r.pop(),this.numUsedBuffers--,this.numBytesUsed-=n,t?(this.freeBuffers.get(o).push(e),this.numFreeBuffers++):(e.destroy(),this.numBytesAllocated-=n)}getNumUsedBuffers(){return this.numUsedBuffers}getNumFreeBuffers(){return this.numFreeBuffers}dispose(){this.freeBuffers.forEach((e,t)=>{e.forEach(n=>{n.destroy()})}),this.usedBuffers.forEach((e,t)=>{e.forEach(n=>{n.destroy()})}),this.freeBuffers=new Map,this.usedBuffers=new Map,this.numUsedBuffers=0,this.numFreeBuffers=0,this.numBytesUsed=0,this.numBytesAllocated=0}}function No(s,e){return`${s}_${e}`}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Ld{constructor(e){this.device=e,this.numUsedTextures=0,this.numFreeTextures=0,this.freeTextures=new Map,this.usedTextures=new Map,this.numBytesUsed=0,this.numBytesAllocated=0}acquireTexture(e,t,n,i){const o=To(n),r=e*t*o,a=Eo(e,t,n,i);if(this.freeTextures.has(a)||this.freeTextures.set(a,[]),this.usedTextures.has(a)||this.usedTextures.set(a,[]),this.numBytesUsed+=r,this.numUsedTextures++,this.freeTextures.get(a).length>0){this.numFreeTextures--;const u=this.freeTextures.get(a).shift();return this.usedTextures.get(a).push(u),u}this.numBytesAllocated+=r;const l=this.device.createTexture({size:[e,t],format:n,usage:i});return this.usedTextures.get(a).push(l),l}releaseTexture(e){if(this.freeTextures.size===0)return;const t=e.width,n=e.height,i=e.format,o=e.usage,r=Eo(t,n,i,o);this.freeTextures.has(r)||this.freeTextures.set(r,[]),this.freeTextures.get(r).push(e),this.numFreeTextures++,this.numUsedTextures--;const a=this.usedTextures.get(r),l=a.indexOf(e);if(l<0)throw new Error("Cannot release a texture that was never provided by this texture manager");a.splice(l,1);const u=To(i),c=t*n*u;this.numBytesUsed-=c}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){this.freeTextures.forEach((e,t)=>{e.forEach(n=>{n.destroy()})}),this.usedTextures.forEach((e,t)=>{e.forEach(n=>{n.destroy()})}),this.freeTextures=new Map,this.usedTextures=new Map,this.numUsedTextures=0,this.numFreeTextures=0,this.numBytesUsed=0,this.numBytesAllocated=0}}function Eo(s,e,t,n){return`${s}_${e}_${t}_${n}`}function To(s){if(s==="rgba8unorm")return 16;throw new Error(`${s} is not supported!`)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kd(s,e){if(Math.max(...s)>5)throw new Error("Cannot symbolically compute strides for rank > 6 tensor.");const t=s.length,n="xyzwuv",i=s.map(r=>`${e}.${n[r]}`),o=new Array(t-1);o[t-2]=i[t-1];for(let r=t-3;r>=0;--r)o[r]=`(${o[r+1]} * ${i[r+1]})`;return o}const Pd=(s,e,t)=>`
          {
            var oldValue = 0;
            loop {
              let newValueF32 = bitcast<f32>(oldValue) + (${e});
              let newValue = bitcast<i32>(newValueF32);
              let res = atomicCompareExchangeWeak(${s}, oldValue, newValue);
              if res.exchanged {
                break;
              }
              oldValue = res.old_value;
            }
          }`;/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Hs;(function(s){s[s.FROM_PIXELS=0]="FROM_PIXELS",s[s.DRAW=1]="DRAW"})(Hs||(Hs={}));const Od=(s,e,t,n,i)=>{const o={dtype:n.dtype,shape:n.shape},r=Dd(t,o,e),a=s.createShaderModule({code:r,label:e.constructor.name});let l=ce().get("WEBGPU_PRINT_SHADER");if(l!==""){l=l.toLowerCase();const u=l.split(",");(l==="all"||u.some(c=>e.shaderKey.toLowerCase().includes(c)))&&(console.group(e.shaderKey),console.debug(r),console.groupEnd())}return i?s.createComputePipelineAsync({compute:{module:a,entryPoint:"_start"},label:e.constructor.name,layout:"auto"}):s.createComputePipeline({compute:{module:a,entryPoint:"_start"},label:e.constructor.name,layout:"auto"})},D=(s,e="f32")=>{switch(s){case 1:return`${e}`;case 2:return`vec2<${e}>`;case 3:return`vec3<${e}>`;case 4:return`vec4<${e}>`;default:throw new Error(`${s}-component ${e} is not supported.`)}};function ue(s){if(s<=1)return"i32";if(s===2)return"vec2<i32>";if(s===3)return"vec3<i32>";if(s===4)return"vec4<i32>";if(s===5)return"vec5";if(s===6)return"vec6";throw Error(`GPU for rank ${s} is not yet supported`)}function ot(s){if(s===0)return"x";if(s===1)return"y";if(s===2)return"z";if(s===3)return"w";if(s===4)return"u";if(s===5)return"v";throw Error(`Index ${s} is not yet supported`)}function se(...s){let e;switch(s.length){case 0:e=`
        fn main()
      `;break;case 1:e=`
        fn main(${s[0]} : i32)
      `;break;default:throw Error("Unreachable")}return e}function Lo(s,e){let t;return t=`
     ${Rd(e)}
      fn _start(@builtin(local_invocation_id) LocalId : vec3<u32>,
                @builtin(global_invocation_id) GlobalId : vec3<u32>,
                @builtin(local_invocation_index) LocalIndex: u32,
                @builtin(workgroup_id) WorkgroupId : vec3<u32>,
                @builtin(num_workgroups) NumWorkgroups : vec3<u32>) {
        localId = LocalId;
        localIndex = LocalIndex;
        globalId = GlobalId;
        numWorkgroups = NumWorkgroups;
        workgroupId = WorkgroupId;
        ${s?"main(getGlobalIndex());":"main();"};
      }
    `,t}function Rd(s){return`
  @compute @workgroup_size(${s.workgroupSize[0]}, ${s.workgroupSize[1]}, ${s.workgroupSize[2]})
`}function Dd(s,e,t){const n=[],i=t.workgroupSize[0]*t.workgroupSize[1]*t.workgroupSize[2];if(t.outputComponent=t.outputComponent?t.outputComponent:1,n.push(`

      var<private> localId: vec3<u32>;
      var<private> localIndex: u32;
      var<private> globalId: vec3<u32>;
      var<private> numWorkgroups: vec3<u32>;
      var<private> workgroupId: vec3<u32>;

      // Only used when the y/z dimension of workgroup size is 1.
      fn getGlobalIndex() -> i32 {
        ${il(t)?"  return i32(globalId.x);":`  return i32((workgroupId.z * numWorkgroups.x * numWorkgroups.y +
                workgroupId.y * numWorkgroups.x + workgroupId.x) * ${i}u +
                localIndex);
        `}
      }
    `),t.pixelsOpType!=null){const p=t.pixelsOpType===Hs.FROM_PIXELS?`@group(0) @binding(0) var<storage, read_write> result: array<${pt(e.dtype,t.outputComponent)}>;`:`@group(0) @binding(1) var<storage, read> inBuf : array<${pt(s[0].dtype,t.outputComponent)}>;`,f=e.shape.length===3?"vec2<i32>":"i32";n.push(`
        struct Uniform {
          outShapeStrides : ${f},
          size            : i32,
          numChannels     : i32,
          alpha           : f32,
        };

        ${p}
        @group(0) @binding(2) var<uniform> uniforms: Uniform;
      `);const g=Po(t);return[ko,n.join(`
`),An(e.shape),t.getUserCode(),Lo(g,t)].join(`
`)}let o,r,a="struct Uniforms { NAN : f32, INFINITY : f32, ";t.variableNames.forEach((p,f)=>{const g=ue(s[f].shape.length);a+=`${p.charAt(0).toLowerCase()+p.slice(1)}Shape : ${g}, `,o=s[f].shape.length-1,r=ue(o),a+=`${p.charAt(0).toLowerCase()+p.slice(1)}ShapeStrides: ${r}, `});const l=ue(e.shape.length);a+=`outShape : ${l}, `,o=e.shape.length-1,r=ue(o),a+=`
         outShapeStrides: ${r}, `,t.size&&(a+="size : i32, "),t.uniforms&&(a+=t.uniforms),a+="};",a=Hd(a),n.push(a),t.atomic?n.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<atomic<i32>>;
    `):n.push(`
      @group(0) @binding(0) var<storage, read_write> result: array<${pt(e.dtype,t.outputComponent)}>;
    `),t.variableNames.forEach((p,f)=>{n.push(`
      @group(0) @binding(${1+f}) var<storage, read> ${p}: array<${t.variableComponents?pt(s[f].dtype,t.variableComponents[f]):pt(s[f].dtype,t.outputComponent)}>;
        `)}),a!==""&&n.push(`
      @group(0) @binding(${1+t.variableNames.length}) var<uniform> uniforms: Uniforms;
      `);const u=Wd(e.shape,t.dispatchLayout),c=[ko,n.join(`
`)+Bd,An(e.shape),u,Gd(e.shape.length)];t.atomic||c.push(Vd(e.shape,e.dtype,t.outputComponent)),t.variableNames.forEach((p,f)=>{c.push(`${An(s[f].shape,p)}`)});const h=s.map((p,f)=>Ud(p,e.shape,t.variableComponents?t.variableComponents[f]:t.outputComponent,t.dispatchLayout.x.length===e.shape.length)).join(`
`);c.push(h),c.push(t.getUserCode());const d=Po(t);return c.push(Lo(d,t)),c.join(`
`)}function zd(s,e,t){let n=s.shaderKey;if(s.pixelsOpType!=null)return n;const i=[],o=[];e.forEach(c=>{i.push(c.shape),o.push(c.dtype)}),i.push(t.shape),o.push(t.dtype);const r=e.map(c=>jo(c.shape,t.shape)),a=e.map(c=>Ye(c.shape,t.shape)).join("_"),l=r.map(c=>c.join("_")).join(";"),u=il(s)?"flatDispatch":"";return n+="_"+(s.workgroupSize?s.workgroupSize.join(","):"")+i.map(c=>c.length).join(",")+o.join(",")+s.variableNames.join(",")+l+a+u,n}const ko=`
  struct vec5 {x: i32, y: i32, z: i32, w: i32, u: i32};
  struct vec6 {x: i32, y: i32, z: i32, w: i32, u: i32, v: i32};

  // Checks whether coordinates lie within the bounds of the shape.
  fn coordsInBounds2D(coord : vec2<i32>, shape : vec2<i32>) -> bool {
    return all(coord >= vec2<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds3D(coord : vec3<i32>, shape : vec3<i32>) -> bool {
    return all(coord >= vec3<i32>(0)) && all(coord < shape);
  }
  fn coordsInBounds4D(coord : vec4<i32>, shape : vec4<i32>) -> bool {
    return all(coord >= vec4<i32>(0)) && all(coord < shape);
  }

  fn getIndexFromCoords1D(coord : i32, shape : i32) -> i32 {
    return coord;
  }
  fn getIndexFromCoords2D(coords : vec2<i32>, shape : vec2<i32>) -> i32 {
    return dot(coords, vec2<i32>(shape.y, 1));
  }
  fn getIndexFromCoords3D(coords : vec3<i32>, shape : vec3<i32>) -> i32 {
    return dot(coords, vec3<i32>(shape.y * shape.z, shape.z, 1));
  }
  fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
    return dot(coords, vec4<i32>(
        shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
  }
  fn getIndexFromCoords5D(coords : vec5, shape : vec5) -> i32 {
    let shapeStrides: vec5 = vec5(shape.y * shape.z * shape.w * shape.u, shape.z * shape.w * shape.u, shape.w * shape.u, shape.u, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u;
  }
  fn getIndexFromCoords6D(coords : vec6, shape : vec6) -> i32 {
    let shapeStrides: vec6 = vec6(shape.y * shape.z * shape.w * shape.u * shape.v, shape.z * shape.w * shape.u * shape.v, shape.w * shape.u * shape.v, shape.u * shape.v, shape.v, 1);
    return coords.x*shapeStrides.x + coords.y*shapeStrides.y + coords.z*shapeStrides.z + coords.w*shapeStrides.w + coords.u*shapeStrides.u + coords.v*shapeStrides.v;
  }

  // NaN defination in IEEE 754-1985 is :
  //   - sign = either 0 or 1.
  //   - biased exponent = all 1 bits.
  //   - fraction = anything except all 0 bits (since all 0 bits represents infinity).
  // https://en.wikipedia.org/wiki/IEEE_754-1985#Representation_of_non-numbers
  fn isnan(val: f32) -> bool {
    let floatToUint: u32 = bitcast<u32>(val);
    return (floatToUint & 0x7fffffffu) > 0x7f800000u;
  }
  fn isnanVec4(val : vec4<f32>) -> vec4<bool> {
    let floatToUint: vec4<u32> = bitcast<vec4<u32>>(val);
    return (floatToUint & vec4<u32>(0x7fffffffu)) > vec4<u32>(0x7f800000u);
  }
`,Bd=`
  fn isinf(val: f32) -> bool {
    return abs(val) == uniforms.INFINITY;
  }
`;function An(s,e=""){const t=s.length,n=e!==""?`get${e.charAt(0).toUpperCase()+e.slice(1)}CoordsFromIndex`:"getCoordsFromIndex",i=e!==""?`${e.charAt(0).toLowerCase()+e.slice(1)}ShapeStrides`:"outShapeStrides";if(t<=1)return`fn ${n}(index : i32) -> i32 { return index; }`;const o=wt(s),r=ue(t),a=[];for(let u=0;u<t;u++)a.push(`d${u}`);if(o.length===1)return`    fn ${n}(index : i32) -> vec2<i32> {
      let d0 = index / uniforms.${i}; let d1 = index - d0 * uniforms.${i};
      return vec2<i32>(d0, d1);
    }`;let l;return l="var index2 = index;"+o.map((u,c)=>{const h=`let ${a[c]} = index2 / uniforms.${i}.${ot(c)}`,d=c===o.length-1?`let ${a[c+1]} = index2 - ${a[c]} * uniforms.${i}.${ot(c)}`:`index2 = index2 - ${a[c]} * uniforms.${i}.${ot(c)}`;return`${h}; ${d};`}).join(""),`
    fn ${n}(index : i32) -> ${r} {
      ${l}
      return ${r}(${a.join(",")});
    }
  `}function Md(s,e){const t=s.name,n=s.shape.length,i=ue(n),o="get"+t.charAt(0).toUpperCase()+t.slice(1),r=["d0","d1","d2","d3","d4","d5"].slice(0,n),a=r.map(c=>`${c} : i32`).join(", ");if(n<1)return`
      fn ${o}() -> ${D(e)} {
        return ${D(e)}(${t}[0]);
      }
    `;const l=`uniforms.${t.charAt(0).toLowerCase()+t.slice(1)}Shape`;let u=`${n}D`;return n===0&&(u="1D"),`
    fn ${o}(${a}) -> ${D(e)} {
      return ${D(e)}(${t}[getIndexFromCoords${u}(${i}(${r.join(",")}),
        ${l})${e===1?"":` / ${e}`}]);
    }
   `}function Fd(s,e,t,n){const i=s.name,o=i.charAt(0).toUpperCase()+i.slice(1),r="get"+o+"ByOutput",a=s.shape.length,l=e.length,u=ue(l);if(Ye(s.shape,e)&&n)return`
    fn ${r}Index(globalIndex : i32) -> ${D(t)} {
      return ${D(t)}(${i}[globalIndex]);
    }

    fn ${r}Coords(coords : ${u}) -> ${D(t)} {
      return ${D(t)}(${i}[${l>1?"getOutputIndexFromCoords(coords)":"coords"}${t===1?"":` / ${t}`}]);
    }
    `;const c=jo(s.shape,e),h=l-a;let d="";if(a===0)return`
    fn ${r}Index(globalIndex : i32) -> ${D(t)}{
      return get${o}();
    }

    fn ${r}Coords(coords : ${u}) -> ${D(t)}{
      return get${o}();
    }
  `;l<2&&c.length>=1?d="coords = 0;":d=c.map(g=>`coords.${ot(g+h)} = 0;`).join(`
`);let m="";if(l<2&&a>0)m="coords";else if(l>1){const g=ue(a),w=s.shape.map((y,x)=>`coords.${ot(x+h)}`).join(", ");m=`${g}(${w})`}else m="coords";const p=`uniforms.${i.charAt(0).toLowerCase()+i.slice(1)}Shape`,f=`${a}D`;return`
  fn ${r}Index(globalIndex : i32) -> ${D(t)} {
    var coords = getCoordsFromIndex(globalIndex);
    ${d}
    return ${D(t)}(${i}[getIndexFromCoords${f}(${m}, ${p})${t===1?"":` / ${t}`}]);
  }

  fn ${r}Coords(coordsIn : ${u}) -> ${D(t)} {
    var coords = coordsIn;
    ${d}
    return ${D(t)}(${i}[getIndexFromCoords${f}(${m}, ${p})${t===1?"":` / ${t}`}]);
  }
`}function Ud(s,e,t,n){let i=Md(s,t);return s.shape.length<=e.length&&(i+=Fd(s,e,t,n)),i}function Wd(s,e){const{x:t,y:n=[],z:i=[]}=e,o=s.length,r=t.length+n.length+i.length;if(r!==o)return"";if(t.length===o)return`fn getOutputCoords() -> ${ue(o)}{
    let globalIndex = getGlobalIndex();
    return getCoordsFromIndex(globalIndex);
  }
  `;let a="";const l=[t,n,i];for(let d=0;d<l.length;d++){const m=l[d];if(m.length!==0)if(m.length===1)a+=`let d${m[0]} = i32(globalId[${d}]);`;else{const p=kd(m,"uniforms.outShape");a+=`var index${d} = i32(globalId[${d}]);`;for(let f=0;f<p.length;f++)a+=`let d${m[f]} = index${d} / ${p[f]};`,f===p.length-1?a+=`let d${m[f+1]} = index${d} - d${m[f]} * ${p[f]};`:a+=`index${d} = index${d} - d${m[f]} * ${p[f]};`}}const u=[];for(let d=0;d<r;d++)u.push(`d${d}`);const c=ue(r);let h=`fn getOutputCoords() -> ${c} {
  ${a}
`;return u.length===0?h+=`return ${c}(0); }`:h+=`return ${c}(${u.join(",")}); }`,h}function Gd(s){let e="";switch(s){case 0:case 1:e+=`
        fn getOutputIndexFromCoords(coords : i32) -> i32 {
          return coords;
        }
        `;break;case 2:e+=`
        fn getOutputIndexFromCoords(coords : vec2<i32>) -> i32 {
          return dot(coords, vec2<i32>(uniforms.outShapeStrides, 1));
        }
        `;break;case 3:e+=`
        fn getOutputIndexFromCoords(coords : vec3<i32>) -> i32 {
          return dot(coords, vec3<i32>(uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, 1));
        }
        `;break;case 4:e+=`
        fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
          return dot(coords, vec4<i32>(
            uniforms.outShapeStrides.x, uniforms.outShapeStrides.y, uniforms.outShapeStrides.z, 1));
        }
        `;break;case 5:e+=`
        fn getOutputIndexFromCoords(coords : vec5) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u;
        }
        `;break;case 6:e+=`
        fn getOutputIndexFromCoords(coords : vec6) -> i32 {
          return coords.x * uniforms.outShapeStrides.x +
              coords.y * uniforms.outShapeStrides.y +
              coords.z * uniforms.outShapeStrides.z +
              coords.w * uniforms.outShapeStrides.w +
              coords.u * uniforms.outShapeStrides.u +
              coords.v;
        }
        `;break;default:O(!1,()=>`Unsupported ${s}D shape`);break}return e}function il(s){return s.dispatch[1]===1&&s.dispatch[2]===1}function pt(s,e=1){if(s==="float32")return D(e,"f32");if(s==="int32"||s==="bool")return D(e,"i32");throw new Error(`type ${s} is not supported.`)}function Vd(s,e,t){const n=s.length,i=pt(e,t);let o=`fn setOutputAtIndex(flatIndex : i32, value : ${D(t)}) {
      result[flatIndex] = ${i}(value);
    }

    fn setOutputAtIndexI32(flatIndex : i32, value : ${D(t,"i32")}) {
      result[flatIndex] = ${i}(value);
    }
    `;if(n>=2){const r=["d0","d1","d2","d3","d4","d5"].slice(0,n),a=ue(n);o+=`
      fn setOutputAtCoords(${r.map(l=>`${l} : i32`).join(", ")}, value : ${D(t)}) {
        let flatIndex = getOutputIndexFromCoords(${a}(${r.join(", ")}));
        setOutputAtIndex(flatIndex${t===1?"":` / ${t}`}, value);
      }
      fn setOutputAtCoordsI32(${r.map(l=>`${l} : i32`).join(", ")}, value : ${D(t,"i32")}) {
        let flatIndex = getOutputIndexFromCoords(${a}(${r.join(", ")}));
        setOutputAtIndexI32(flatIndex${t===1?"":` / ${t}`}, value);
      }
    `}return o}function Hd(s){const e=/(\w+)\s*:\s*vec(5|6)/g;s=s.replace(e,n=>"@align(16) "+n);const t=/vec(5|6)\s*,\s*(\w+)/g;return s=s.replace(t,(n,i,o)=>`vec${i}, @align(16) ${o}`),s}function Po(s){return!(s.dispatchLayout.hasOwnProperty("y")&&s.dispatchLayout.y.length!==0||s.dispatchLayout.hasOwnProperty("z")&&s.dispatchLayout.z.length!==0)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const rt=s=>{let e=1;for(let t=0;t<s.length;t++)e*=s[t];return e};function ae(s,e,t=[1,1,1],n=[1,1,1]){const[i,o,r]=[Math.ceil(rt(s.x.map(a=>e[a]))/(t[0]*n[0])),s.y?Math.ceil(rt(s.y.map(a=>e[a]))/(t[1]*n[1])):1,s.z?Math.ceil(rt(s.z.map(a=>e[a]))/(t[2]*n[2])):1];return[i,o,r]}function jd(s,e,t,n=!1){const i=[8,8,1],o=[4,4,1];return n||(s<=8&&(o[1]=1),e<=16&&t<=16&&(i[0]=4)),{workgroupSize:i,elementsPerThread:o}}function qd(s,e,t=!1){if(t)return[8,8,1];const n=rt(s.x.map(o=>e[o])),i=rt(s.y.map(o=>e[o]));return n<=4?[4,16,1]:i<=4?[16,4,1]:[16,16,1]}function Yd(s,e,t=!1){if(t)return[4,4,1];const n=rt(s.x.map(o=>e[o])),i=rt(s.y.map(o=>e[o]));return n<=4?[1,2,1]:i<=4?[2,1,1]:[2,2,1]}function $e(s){return{x:s.map((e,t)=>t)}}function Oo(s){if(s==="float32"||s==="int32"||s==="bool"||s==="string")return 4;if(s==="complex64")return 8;throw new Error(`Unknown dtype ${s}`)}function ol(){return!!(typeof globalThis<"u"&&globalThis.navigator&&globalThis.navigator.gpu)}var Be;(function(s){s[s.MatMulReduceProgram=0]="MatMulReduceProgram",s[s.MatMulSplitKProgram=1]="MatMulSplitKProgram",s[s.MatMulSmallOutputSizeProgram=2]="MatMulSmallOutputSizeProgram",s[s.MatMulPackedProgram=3]="MatMulPackedProgram",s[s.MatMulMax=4]="MatMulMax"})(Be||(Be={}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Kd=ce().getNumber("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD"),Xd=(s,e)=>{const t=s.limits.maxComputeWorkgroupsPerDimension,n=e.dispatchLayout,i=e.dispatch;if(i.every(r=>r<=t))return i;O(i[0]>t&&n.y===void 0&&n.z===void 0,()=>"Dispatch size exceeds WebGPU limits in Y or Z dimension.");let o=Math.ceil(Math.sqrt(i[0]));return o>t?(o=Math.ceil(Math.cbrt(i[0])),O(o<=t,()=>"Total dispatch size exceeds WebGPU maximum."),[o,o,o]):[o,o,1]};class us extends Kl{nextDataId(){return us.nextDataId++}constructor(e,t){if(super(),this.commandQueueOwnedIds=new WeakSet,this.dispatchCountInPass=0,this.disposed=!1,this.downloadWaitMs=0,this.tensorDataPendingDisposal=[],this.queryResolveBuffer=null,this.querySet=null,this.querySetCount=2,this.stagingPendingDisposal=[],this.uniformPendingDisposal=[],this.uploadWaitMs=0,this.hasReadSyncWarned=!1,this.hasTimestampQueryWarned=!1,!ol())throw new Error("WebGPU is not supported on this device");this.pipelineCache={},this.device=e,this.queue=e.queue,this.commandEncoder=null,this.computePassEncoder=null,this.adapterInfo=new Ed(t),this.supportTimestampQuery=this.device.features.has("timestamp-query"),this.thresholdToIncreaseWorkgroups=this.adapterInfo.intelGPUGeneration>=12?16:8,this.bufferManager=new Td(this.device),this.textureManager=new Ld(this.device),this.tensorMap=new Xl(this,ln()),ce().getBool("WEBGPU_USE_PROFILE_TOOL")&&(this.dummyCanvas=document.createElement("canvas"),this.dummyCanvas.width=1,this.dummyCanvas.height=1,this.dummyContext=this.dummyCanvas.getContext("webgpu"),this.dummyContext.configure({device:e,format:"bgra8unorm"}),document.body.appendChild(this.dummyCanvas))}floatPrecision(){return 32}disposeData(e,t=!1){if(!this.tensorMap.has(e))return!0;const n=this.tensorMap.get(e);return t?n.refCount=0:n.refCount--,n.refCount>0?!1:(n.complexTensorInfos!=null&&(this.disposeData(n.complexTensorInfos.real.dataId),this.disposeData(n.complexTensorInfos.imag.dataId)),this.commandQueueOwnedIds.has(e)?(this.tensorDataPendingDisposal.push(e),!0):(this.releaseResource(e),this.tensorMap.delete(e),!0))}memory(){return{numBytesInGPU:this.bufferManager.numBytesUsed,numBytesAllocatedInGPU:this.bufferManager.numBytesAllocated,unreliable:!1}}releaseResource(e){const t=this.tensorMap.get(e);if(!(!t||!t.resource)){if(t.external){t.resource=null;return}t.resource instanceof GPUBuffer?this.bufferManager.releaseBuffer(t.resource):t.resource instanceof GPUTexture&&this.textureManager.releaseTexture(t.resource),t.resource=null}}refCount(e){return this.tensorMap.has(e)?this.tensorMap.get(e).refCount:0}incRef(e){const t=this.tensorMap.get(e);t.refCount++}decRef(e){if(this.tensorMap.has(e)){const t=this.tensorMap.get(e);t.refCount--}}write(e,t,n){if(n==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");const i={id:this.nextDataId()};return this.tensorMap.set(i,{dtype:n,shape:t,values:e,refCount:1}),i}move(e,t,n,i,o){if(i==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.tensorMap.set(e,{dtype:i,shape:n,values:t,refCount:o})}submitQueue(){this.queue.submit([this.commandEncoder.finish()]),this.commandEncoder=null,this.dispatchCountInPass=0,this.commandQueueOwnedIds=new WeakSet,this.tensorDataPendingDisposal.forEach(e=>{this.releaseResource(e),this.tensorMap.delete(e)}),this.uniformPendingDisposal.forEach(e=>this.bufferManager.releaseBuffer(e)),this.stagingPendingDisposal.forEach(e=>this.bufferManager.releaseBuffer(e,!1)),this.tensorDataPendingDisposal=[],this.uniformPendingDisposal=[],this.stagingPendingDisposal=[]}ensureCommandEncoderReady(){this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder())}endComputePassEncoder(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}async checkCompileCompletionAsync(){let e;try{e=await Promise.all(Object.values(this.pipelineCache))}catch(t){throw new Error(t.message)}Object.keys(this.pipelineCache).map((t,n)=>{this.pipelineCache[t]=e[n]})}async getBufferData(e){if(ce().getBool("WEBGPU_ENGINE_COMPILE_ONLY"))return console.warn("The data may be invalid since WEBGPU_ENGINE_COMPILE_ONLY is true, this can only be called when WEBGPU_ENGINE_COMPILE_ONLY is false"),null;const t=e.size,n=this.bufferManager.acquireBuffer(t,GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(e,0,n,0,t),this.submitQueue(),await n.mapAsync(GPUMapMode.READ);const i=n.getMappedRange().slice(0);return n.unmap(),n!=null&&this.bufferManager.releaseBuffer(n),ce().getBool("WEBGPU_USE_PROFILE_TOOL")&&(O(this.dummyContext!==void 0,()=>"Fail to get context for profiling tool"),this.dummyContext.getCurrentTexture()),i}convertAndCacheOnCPU(e,t){const n=this.tensorMap.get(e);return n.values=t,n.values}readSync(e){const t=this.tensorMap.get(e),{values:n,complexTensorInfos:i}=t;if(n!=null||t.dtype==="string")return n;if(t.dtype==="complex64"){const f=this.readSync(i.real.dataId),g=this.readSync(i.imag.dataId),w=un(Bi(f,g).buffer,"float32");return this.convertAndCacheOnCPU(e,w),w}this.hasReadSyncWarned||(this.hasReadSyncWarned=!0,console.warn("The performance of synchronously reading data from GPU to CPU is poor on the webgpu backend, please use asynchronous APIs instead."));const o=["opaque","premultiplied"],r=t.resource,a=r.size;O(a%4===0,()=>"Because there is 4 bytes for one pixel, buffer size must be multiple of 4.");const l=a/4,u=new ArrayBuffer(a),c=256,h=256,d=o.map(f=>new OffscreenCanvas(c,h)),m=new OffscreenCanvas(c,h);this.endComputePassEncoder(),d.map((f,g)=>{const w=f.getContext("webgpu");return w.configure({device:this.device,format:"bgra8unorm",usage:GPUTextureUsage.COPY_DST,alphaMode:o[g]}),w.getCurrentTexture()}).map((f,g)=>{const w=c*4,y=($,_,N)=>{this.ensureCommandEncoderReady(),this.commandEncoder.copyBufferToTexture({buffer:r,bytesPerRow:w,offset:N},{texture:f},{width:$,height:_}),this.submitQueue();const M=m.getContext("2d",{willReadFrequently:!0});M.clearRect(0,0,$,_),M.drawImage(d[g],0,0);const Q=M.getImageData(0,0,$,_).data,ne=o[g],R=new Uint8ClampedArray(u,N,$*_*4);for(let P=0;P<R.length;P+=4)if(ne==="premultiplied")R[P+3]=Q[P+3];else{const z=Q[P];R[P]=Q[P+2],R[P+1]=Q[P+1],R[P+2]=z}},x=Math.floor(l/(c*h));let S=c,A=h,C=0;for(let $=0;$<x;$++)y(S,A,C),C+=c*h*4;const T=l%(c*h);A=Math.floor(T/c),A>0&&(y(S,A,C),C+=A*(c*4)),S=T%c,S>0&&y(S,1,C)});const p=un(u,t.dtype);return this.convertAndCacheOnCPU(e,p),p}async read(e){if(!this.tensorMap.has(e))throw new Error(`Tensor ${e} was not registered!`);const t=this.tensorMap.get(e),{values:n}=t;if(n!=null)return n;let i;if(t.dtype==="complex64"){const o=await Promise.all([this.read(t.complexTensorInfos.real.dataId),this.read(t.complexTensorInfos.imag.dataId)]),r=o[0],a=o[1];i=Bi(r,a)}else{const o=await this.getBufferData(t.resource);i=un(o,t.dtype)}return this.convertAndCacheOnCPU(e,i),i}copyBuffer(e){const t=e.size,n=e.usage,i=this.bufferManager.acquireBuffer(t,n);return this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(e,0,i,0,t),this.submitQueue(),i}createTensorFromGPUData(e,t,n){let i=e.buffer;if(n==="complex64")throw new Error("Cannot write to a complex64 dtype. ");const o={id:this.nextDataId()};this.tensorMap.set(o,{dtype:n,shape:t,values:null,refCount:1,external:e.zeroCopy});const r=this.tensorMap.get(o),a=Oo(r.dtype)*W(r.shape);if(e.buffer.size<a)throw new Error(`GPUBuffer size(${e.buffer.size}) is smaller than tensor size(${a})!`);if((e.buffer.usage&(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))!==(GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC))throw new Error("GPUBuffer.usage should include GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC!");return e.zeroCopy!==!0&&(i=this.copyBuffer(i)),r.resource=i,ln().makeTensorFromDataId(o,t,n,this)}readToGPU(e){const t=this.tensorMap.get(e),{values:n,dtype:i,shape:o,resource:r}=t;if(i==="complex64")throw new Error("Does not support reading buffer for complex64 dtype.");if(r==null)throw n!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");const a=r,l=a.size,u=a.usage,c=this.bufferManager.acquireBuffer(l,u);this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(r,0,c,0,l),this.submitQueue();const h=this.makeTensorInfo(o,i),d=ln().makeTensorFromTensorInfo(h),m=this.tensorMap.get(h.dataId);return m.resource=c,{tensorRef:d,buffer:c}}bufferSync(e){const t=this.readSync(e.dataId);if(e.dtype==="string")try{const n=t.map(i=>Jl(i));return Is(e.shape,e.dtype,n)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return Is(e.shape,e.dtype,t)}async time(e){!this.supportTimestampQuery&&!this.hasTimestampQueryWarned&&(console.warn("This device doesn't support timestamp-query extension. Start Chrome browser with flag --enable-dawn-features=allow_unsafe_apis to try it again. Otherwise, zero will be shown for the kernel time when profiling mode is enabled."),this.hasTimestampQueryWarned=!0);const t=this.activeTimers,n=[];let i=!1;this.programTimersStack==null?(this.programTimersStack=n,i=!0):this.activeTimers.push(n),this.activeTimers=n,e();const o=Mi(this.activeTimers.map(u=>u.query)).filter(u=>u!=null),r=Mi(this.activeTimers.map(u=>u.name)).filter(u=>u!=null);this.activeTimers=t,i&&(this.programTimersStack=null);const a={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null},l=await Promise.all(o);return a.kernelMs=Ql(l),a.getExtraProfileInfo=()=>l.map((u,c)=>({name:r[c],ms:u})).map(u=>`${u.name}: ${u.ms}`).join(", "),this.uploadWaitMs=0,this.downloadWaitMs=0,a}makeTensorInfo(e,t,n){return t==="string"&&n!=null&&n.length>0&&Zl(n[0])&&(n=n.map(o=>eu(o))),{dataId:this.write(n,e,t),shape:e,dtype:t}}tensorToBinding(e){if(!e)return null;const n=this.tensorMap.get(e.dataId).resource;return n instanceof GPUBuffer?{buffer:n}:n instanceof GPUTexture?n.createView():n}uploadToGPU(e){const t=this.tensorMap.get(e);if(t.resource!=null)return;const n=Oo(t.dtype)*W(t.shape);let i;const o=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST;if(t.values){if(i=this.bufferManager.acquireBuffer(n,o,!0),i.mapState==="unmapped"){const r=this.bufferManager.acquireBuffer(n,GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC,!0,!1),a=r.getMappedRange();t.dtype==="int32"||t.dtype==="bool"?new Int32Array(a).set(t.values):new Float32Array(a).set(t.values),r.unmap(),this.ensureCommandEncoderReady(),this.endComputePassEncoder(),this.commandEncoder.copyBufferToBuffer(r,0,i,0,n),this.stagingPendingDisposal.push(r)}else{const r=i.getMappedRange();t.dtype==="int32"||t.dtype==="bool"?new Int32Array(r).set(t.values):new Float32Array(r).set(t.values),i.unmap()}t.values=null}else i=this.bufferManager.acquireBuffer(n,o);t.resource=i}makeUniforms(e){let t=0,n=0;const i=[];let o=1;e.forEach(l=>{l.data.length===0&&(l.data=[1]);let u;switch(l.data.length){case 1:u=4;break;case 2:u=8;break;case 3:u=16;break;case 4:u=16;break;case 5:u=16;break;case 6:u=16;break;default:O(!1,()=>`Unsupported ${l.data.length}D shape`)}(n===5||n===6)&&(u=16),u>o&&(o=u),t=Math.ceil(t/u)*u,n=l.data.length,i.push(t),t+=l.data.length*4}),t=Math.ceil(t/o)*o;const r=new ArrayBuffer(t);e.forEach((l,u)=>{const c=i[u];l.type==="int32"?new Int32Array(r,c,l.data.length).set(l.data):l.type==="uint32"?new Uint32Array(r,c,l.data.length).set(l.data):new Float32Array(r,c,l.data.length).set(l.data)});const a=this.bufferManager.acquireBuffer(t,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);return this.queue.writeBuffer(a,0,r,0,t),this.uniformPendingDisposal.push(a),{offset:0,size:t,buffer:a}}runWebGPUProgram(e,t,n,i,o){if(o||(o=this.makeTensorInfo(e.outputShape,n)),W(o.shape)===0)return this.tensorMap.get(o.dataId).values=qn(o.dtype,0),o;this.uploadToGPU(o.dataId),e.dispatch=Xd(this.device,e);const r=t.map((l,u)=>{if(l.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");return this.uploadToGPU(l.dataId),{dtype:this.tensorMap.get(l.dataId).dtype,shape:l.shape,name:e.variableNames[u]}});e.shaderKey=zd(e,r,o);const a=ce().getBool("WEBGPU_ENGINE_COMPILE_ONLY");return e.shaderKey in this.pipelineCache||(this.pipelineCache[e.shaderKey]=Od(this.device,e,r,o,a)),e.pipeline=this.pipelineCache[e.shaderKey],a||this.recordAndSubmit(e,o,t,i),o}recordAndSubmit(e,t,n,i){if(e.pipeline instanceof Promise)throw new Error("Please call checkCompileCompletionAsync to ensure parallel compilation is done!");let o=[],r=[];const a="int32";if(e.pixelsOpType==null){o.push({type:"float32",data:[NaN]},{type:"float32",data:[1/0]}),r=n.concat(t).map(m=>m.shape);const d="int32";r.map(m=>{o.push({type:d,data:m});const p=wt(m);o.push({type:d,data:p})})}else{const d=wt(t.shape);o.push({type:a,data:d})}if(e.size){const d=W(e.outputShape);o.push({type:a,data:[e.outputComponent?d/e.outputComponent:d]})}i&&(o=[...o,...i]);const l=[this.tensorToBinding(t),...n.map(d=>this.tensorToBinding(d)),this.makeUniforms(o)];n.forEach(d=>{this.commandQueueOwnedIds.add(d.dataId)}),this.commandQueueOwnedIds.add(t.dataId);const u=this.device.createBindGroup({layout:e.pipeline.getBindGroupLayout(0),entries:l.map((d,m)=>({binding:m,resource:d}))}),c=this.activeTimers!=null;this.ensureCommandEncoderReady();const h={};c&&this.supportTimestampQuery?(this.endComputePassEncoder(),this.querySet==null&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.querySetCount})),h.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:0,endOfPassWriteIndex:1},this.computePassEncoder=this.commandEncoder.beginComputePass(h)):this.computePassEncoder||(this.computePassEncoder=this.commandEncoder.beginComputePass(h)),this.computePassEncoder.setPipeline(e.pipeline),this.computePassEncoder.setBindGroup(0,u),this.computePassEncoder.dispatchWorkgroups(e.dispatch[0],e.dispatch[1],e.dispatch[2]),this.dispatchCountInPass++,(c||ce().get("WEBGPU_DEFERRED_SUBMIT_BATCH_SIZE")<=this.dispatchCountInPass||e.pixelsOpType===Hs.DRAW)&&(this.endComputePassEncoder(),c?this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime()}):this.submitQueue())}async getQueryTime(){if(!this.supportTimestampQuery)return 0;this.queryResolveBuffer==null&&(this.queryResolveBuffer=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST|GPUBufferUsage.QUERY_RESOLVE)),this.commandEncoder.resolveQuerySet(this.querySet,0,this.querySetCount,this.queryResolveBuffer,0);const e=this.bufferManager.acquireBuffer(this.querySetCount*8,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.querySetCount*8),this.submitQueue(),await e.mapAsync(GPUMapMode.READ);const t=new BigUint64Array(e.getMappedRange()),n=Number(t[1]-t[0])/1e6;return e.unmap(),this.bufferManager.releaseBuffer(e),n}shouldExecuteOnCPU(e,t=Kd){return ce().getBool("WEBGPU_CPU_FORWARD")&&e.every(n=>this.tensorMap.get(n.dataId).resource==null&&W(n.shape)<t)}numDataIds(){return this.tensorMap.numDataIds()-this.tensorDataPendingDisposal.length}dispose(){this.disposed||(this.querySet!=null&&this.querySet.destroy(),this.bufferManager.dispose(),this.textureManager.dispose(),this.disposed=!0)}}us.nextDataId=0;/**
 * @license
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */ol()&&tu("webgpu",async()=>{const s={powerPreference:ce().get("WEBGPU_USE_LOW_POWER_GPU")?"low-power":"high-performance"},e=await navigator.gpu.requestAdapter(s),t={},n=[];e.features.has("timestamp-query")&&n.push("timestamp-query"),e.features.has("bgra8unorm-storage")&&n.push(["bgra8unorm-storage"]),t.requiredFeatures=n;const i=e.limits;t.requiredLimits={maxComputeWorkgroupStorageSize:i.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:i.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:i.maxStorageBufferBindingSize,maxBufferSize:i.maxBufferSize,maxComputeWorkgroupSizeX:i.maxComputeWorkgroupSizeX,maxComputeInvocationsPerWorkgroup:i.maxComputeInvocationsPerWorkgroup};const o=await e.requestDevice(t),r=await e.requestAdapterInfo();return new us(o,r)},3);/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Jd{constructor(e,t,n){this.uniforms="",this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.map((i,o)=>i[0]+e[o]+i[1]),this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.xShape=e,t.map((i,o)=>{this.uniforms+=` pad${o} : vec2<i32>,`}),this.offset=n==="reflect"?0:1,this.shaderKey=`mirrorPad_${n}`}getUserCode(){const e=this.xShape.length,t=this.xShape.map((u,c)=>`uniforms.pad${c}[0]`).join(","),n=this.xShape.map((u,c)=>`uniforms.pad${c}[0] + uniforms.xShape${e>1?`[${c}]`:""}`).join(","),i=e===1?"start":"start[i]",o=e===1?"end":"end[i]",r=e===1?"outC":"outC[i]",a=ue(e),l=e>1?["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,e):"coords";return`
      ${se("index")} {
        if (index < uniforms.size) {
          let start = ${a}(${t});
          let end = ${a}(${n});
          var outC = getCoordsFromIndex(index);
          for (var i = 0; i < ${e}; i = i + 1) {
            if (${r} < ${i}) {
              ${r} = ${i} * 2 - ${r} - ${this.offset};
            } else if(${r} >= ${o}) {
              ${r} = (${o} - 1) * 2 - ${r} + ${this.offset};
            }
          }
          let coords = outC - start;
          setOutputAtIndex(index, getX(${l}));
        }
      }
    `}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Qd={kernelName:su,backendName:"webgpu",kernelFunc:({inputs:s,attrs:e,backend:t})=>{const{x:n}=s,{paddings:i,mode:o}=e,r=t,a=i.map(c=>({type:"int32",data:[c[0],c[1]]})),l=new Jd(n.shape,i,o);return r.runWebGPUProgram(l,[n],n.dtype,a)}};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qe(s){const{inputs:e}=s,{x:t}=e;return s.backend.incRef(t.dataId),{dataId:t.dataId,shape:t.shape,dtype:t.dtype}}const Zd={kernelName:nu,backendName:"webgpu",kernelFunc:Qe};/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ef(s,e=!1){const t=s.length,n=ue(t),i=s.map((h,d)=>`uniforms.pad${d}[0]`).join(","),o=s.map((h,d)=>`uniforms.pad${d}[0] + uniforms.xShape${t>1?`[${d}]`:""}`).join(","),r=t>1?`${n}(${i})`:`${i}`,a=t>1?`${n}(${o})`:`${o}`,l=t>1?"any(paddedCoords < start)":"paddedCoords < start",u=t>1?"any(paddedCoords >= end)":"paddedCoords >= end",c=t>1?["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,t):"coords";return`
        let start = ${r};
        let end = ${a};
        if (${l} || ${u}) {
          setOutputAtIndex(index, ${e?0:"uniforms.constantValue"});
        } else {
          let coords = paddedCoords - start;
          setOutputAtIndex(index, getX(${c}));
        }
  `}class tf{constructor(e,t){this.variableNames=["x"],this.uniforms="constantValue : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t.map((n,i)=>n[0]+e[i]+n[1]),this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),t.map((n,i)=>{this.uniforms+=` pad${i} : vec2<i32>,`}),this.xShape=e,this.shaderKey="pad"}getUserCode(){return`
      ${se("index")} {
        if (index < uniforms.size) {
          let paddedCoords = getCoordsFromIndex(index);
          ${ef(this.xShape)}
        }
      }
    `}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class sf{constructor(e){this.variableNames=[],this.outputShape=[],this.uniforms="value : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="fill"}getUserCode(){return`
    ${se("index")} {
      if (index < uniforms.size) {
        setOutputAtIndex(index, uniforms.value);
      }
    }
  `}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rl(s){const{backend:e,attrs:t}=s,{shape:n,value:i}=t;let{dtype:o}=t;if(o=o||iu(i),o==="string"){const r=qo(o,W(n));return r.fill(i),e.makeTensorInfo(n,o,r)}else{const r=new sf(n),a=[{type:"float32",data:[i]}];return e.runWebGPUProgram(r,[],o,a)}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const nf=s=>{const{inputs:e,backend:t,attrs:n}=s,{x:i}=e,{paddings:o,constantValue:r}=n;if(o.every(u=>Ye(u,[0,0])))return Qe({inputs:{x:i},backend:t});if(W(i.shape)===0){const u=o.map((c,h)=>c[0]+i.shape[h]+c[1]);return rl({backend:t,attrs:{shape:u,value:r,dtype:i.dtype}})}const a=[{type:"float32",data:[r]}];o.map(u=>a.push({type:"int32",data:[u[0],u[1]]}));const l=new tf(i.shape,o);return t.runWebGPUProgram(l,[i],i.dtype,a)},of={kernelName:ou,backendName:"webgpu",kernelFunc:nf};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rf(s,e,t,n){const i=qo(t,W(e));if(n&&t!=="string"){let o=0;s.forEach(r=>{const a=W(r.shape);i.set(r.vals,o),o+=a})}else{let o=0;s.forEach(r=>{const a=t==="string"?Yo(r.vals):r.vals;let l=0;for(let u=0;u<r.shape[0];++u){const c=u*e[1]+o;for(let h=0;h<r.shape[1];++h)i[c+h]=a[l++]}o+=r.shape[1]})}return i}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function af(s,e,t,n){const i=qn(n,W(t));for(let o=0;o<i.length;++o){const r=o*e;let a=s[r];for(let l=0;l<e;++l){const u=s[r+l];(Number.isNaN(u)||u>a)&&(a=u)}i[o]=a}return i}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lf(s,e,t,n,i){const o=e.length,r=W(e),a=wt(e),l=wt(i),u=qn(t,W(i));for(let c=0;c<r;++c){const h=ru(c,o,a),d=new Array(h.length);for(let p=0;p<d.length;p++)d[p]=h[n[p]];const m=au(d,o,l);u[m]=s[c]}return u}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function uf(s,e,t,n){const[i,o]=Yn(s,n),r=lu(e,"int32"),a=uu(W(i),r),l=W(o);for(let u=0;u<a.length;++u){const c=u*l;let h=1;for(let d=0;d<l;++d)h*=t[c+d];a[u]=h}return{outVals:a,outShape:i,outDtype:r}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cf(s,e,t,n,i){const o=cu(n,e,t),r=W(t),a=wt(n);if(o){const h=hu(e,a);return i==="string"?s.slice(h,h+r):s.subarray(h,h+r)}const l=i==="string"?Yo(s):s,u=Is(n,i,l),c=Is(t,i);for(let h=0;h<c.size;++h){const d=c.indexToLoc(h),m=d.map((p,f)=>p+e[f]);c.set(u.get(...m),...d)}return i==="string"?du(c.values):c.values}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hf=Object.freeze(Object.defineProperty({__proto__:null,concatImpl:rf,maxImpl:af,prodImpl:uf,sliceImpl:cf,transposeImpl:lf},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const{concatImpl:df,maxImpl:ff,prodImpl:pf,sliceImpl:mf,transposeImpl:gf}=hf;/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class yf{constructor(e,t){this.variableNames=["source"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=t,this.rank=t.length,this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.start=e,this.uniforms=`start : ${ue(e.length)}, `,this.shaderKey="slice"}getUserCode(){const e=ue(this.rank),t=bf(this.rank);let n;return this.start.length===1?n=this.outputShape.map((o,r)=>"sourceLoc = uniforms.start + coords;"):n=this.outputShape.map((o,r)=>`sourceLoc.${Dn[r]} = uniforms.start.${ot(r)} + coords.${Dn[r]};`),`
      ${se("index")} {
        if (index < uniforms.size) {
          var sourceLoc : ${e};
          let coords = getCoordsFromIndex(index);
          ${n.join(`
`)}
          setOutputAtIndex(index, getSource(${t}));
        }
      }
    `}}const Dn=["x","y","z","w","u","v"];function bf(s){if(s===1)return"sourceLoc";if(s<=6)return Dn.slice(0,s).map(e=>`sourceLoc.${e}`).join(",");throw Error(`Slicing for rank ${s} is not yet supported`)}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wf(s){const{inputs:e,backend:t,attrs:n}=s,{x:i}=e,{begin:o,size:r}=n,[a,l]=pu(i,o,r);if(mu(i,a,l),t.shouldExecuteOnCPU([i])||i.dtype==="string"){const h=t.tensorMap.get(i.dataId),d=mf(h.values,a,l,i.shape,i.dtype);return t.makeTensorInfo(l,i.dtype,d)}if(W(l)===0)return t.makeTensorInfo(l,i.dtype,[]);const u=new yf(a,l),c=[{type:"int32",data:a}];return t.runWebGPUProgram(u,[i],i.dtype,c)}const Sf={kernelName:fu,backendName:"webgpu",kernelFunc:wf};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var j;(function(s){s[s.ADD=0]="ADD",s[s.ATAN2=1]="ATAN2",s[s.COMPLEX_MULTIPLY_IMAG=2]="COMPLEX_MULTIPLY_IMAG",s[s.COMPLEX_MULTIPLY_REAL=3]="COMPLEX_MULTIPLY_REAL",s[s.DIV=4]="DIV",s[s.ELU_DER=5]="ELU_DER",s[s.EQUAL=6]="EQUAL",s[s.FLOOR_DIV=7]="FLOOR_DIV",s[s.GREATER=8]="GREATER",s[s.GREATER_EQUAL=9]="GREATER_EQUAL",s[s.LESS=10]="LESS",s[s.LESS_EQUAL=11]="LESS_EQUAL",s[s.LOGICAL_AND=12]="LOGICAL_AND",s[s.LOGICAL_OR=13]="LOGICAL_OR",s[s.MAX=14]="MAX",s[s.MIN=15]="MIN",s[s.MOD=16]="MOD",s[s.MUL=17]="MUL",s[s.NOT_EQUAL=18]="NOT_EQUAL",s[s.POW=19]="POW",s[s.PRELU=20]="PRELU",s[s.SQUARED_DIFFERENCE=21]="SQUARED_DIFFERENCE",s[s.SUB=22]="SUB"})(j||(j={}));const xf="let resultTemp = a + b;",Af="let resultTemp = atan2(a, b);",vf="let resultTemp = areal * breal - aimag * bimag;",Cf="let resultTemp = areal * bimag + aimag * breal;",_f="let resultTemp = a / b;",If="let resultTemp = select(a * (b + 1.0), a, b >= b - b);",$f=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a == b);
`,Nf=`
  let remainder =
      select(a % b, round(a % b), (round(a) == a) & (round(b) == b));
  let quotient = (a - remainder) / b;
  let resultTemp =
      round(select(quotient, quotient - 1, sign(remainder) == -sign(b)));
`,Ef=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a > b);
`,Tf=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a >= b);
`,Lf=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a < b);
`,kf=`
  let zero = sign(a) * 0 + 0;
  let one = sign(b) * 0 + 1;
  let resultTemp = select(zero, one, a <= b);
`,Pf="return f32(a >= 1.0 && b >= 1.0);",Of=`return (vec4<f32>(a >= vec4<f32>(1.0)) *
  vec4<f32>(b >= vec4<f32>(1.0)));`,Rf="return f32(a >= 1.0 || b >= 1.0);",Df=`return min(vec4<f32>(a >= vec4<f32>(1.0)) +
  vec4<f32>(b >= vec4<f32>(1.0)), vec4<f32>(1.0));`,zf="let resultTemp = max(a, b);",Bf="let resultTemp = min(a, b);",Mf=`
  let isNaN = b == 0.;
  var resultTemp = a % b;
  resultTemp = select((resultTemp + b) % b, resultTemp,
      (a < 0. && b < 0.) || (a >= 0. && b > 0.));
`,Ff=`
  let isNaN = !vec4<bool>(b);
  var resultTemp = vec4<f32>(a % b);
  if (!((a[0] < 0. && b[0] < 0.) || (a[0] >= 0. && b[0] > 0.))) {
    resultTemp[0] = (resultTemp[0] + b[0]) % b[0];
  }
  if (!((a[1] < 0. && b[1] < 0.) || (a[1] >= 0. && b[1] > 0.))) {
    resultTemp[1] = (resultTemp[1] + b[1]) % b[1];
  }
  if (!((a[2] < 0. && b[2] < 0.) || (a[2] >= 0. && b[2] > 0.))) {
    resultTemp[2] = (resultTemp[2] + b[2]) % b[2];
  }
  if (!((a[3] < 0. && b[3] < 0.) || (a[3] >= 0. && b[3] > 0.))) {
    resultTemp[3] = (resultTemp[3] + b[3]) % b[3];
  }
`,Uf="let resultTemp = a * b;",Wf=`
  var resultTemp = f32(a != b);
  let valueForNaN = 1.0;
`,Gf=`
  var resultTemp = vec4<f32>(a != b);
  let valueForNaN = 1.0;
`,Vf=`
  let isNaN = a < 0.0 && floor(b) < b;
  if (b == 0.0) {
    return 1.0;
  }
  var resultTemp = select(sign(a) * pow(abs(a), b), pow(abs(a), b),
      round(abs(b) % 2.0) != 1.0);
`,Hf=`
  let isModRound1Bool = vec4<i32>(round(abs(b) % vec4<f32>(2.0))) == vec4<i32>(1);
  let isModRound1 = vec4<f32>(isModRound1Bool);
  let multiplier = sign(a) * isModRound1 + (vec4<f32>(1.0) - isModRound1);
  var resultTemp = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  let isExpZero = b == vec4<f32>(0.0);
  if (isExpZero.r) {
    resultTemp.r = 1.0;
  }
  if (isExpZero.g) {
    resultTemp.g = 1.0;
  }
  if (isExpZero.b) {
    resultTemp.b = 1.0;
  }
  if (isExpZero.a) {
    resultTemp.a = 1.0;
  }
  let isNaN = (a < vec4<f32>(0.0)) & (floor(b) < b);
`,jf="if (a < 0.0) { return b * a; }  return a;",qf=`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (b * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`,Yf="let resultTemp = (a - b) * (a - b);",Kf="let resultTemp = a - b;";function Xf(s,e){let t;do{switch(s){case j.ATAN2:t=Af;break;case j.MAX:t=zf;break;case j.MIN:t=Bf;break;case j.MOD:t=e?Ff:Mf;break;case j.NOT_EQUAL:t=e?Gf:Wf;break;case j.POW:t=e?Hf:Vf;break;default:continue}let n,i,o;return e?(n="isnanVec4",i="vec4<f32>",o="vec4<bool>"):(n="isnan",i="f32",o="bool"),`
      let aIsNaN = ${n}(a);
      let aPostLegalization = select(a, ${i}(42), aIsNaN);
      let bIsNaN = ${n}(b);
      let bPostLegalization = select(b, ${i}(42), bIsNaN);
      let isNaN = false;
      let valueForNaN = uniforms.NAN;
      {
        let a = aPostLegalization;
        let b = bPostLegalization;
        ${t}
        return select(
            resultTemp, ${i}(valueForNaN),
            ${o}(isNaN) | aIsNaN | bIsNaN);
      }
    `}while(!1);switch(s){case j.ADD:t=xf;break;case j.COMPLEX_MULTIPLY_IMAG:t=Cf;break;case j.COMPLEX_MULTIPLY_REAL:t=vf;break;case j.DIV:t=_f;break;case j.ELU_DER:t=If;break;case j.EQUAL:t=$f;break;case j.FLOOR_DIV:t=Nf;break;case j.GREATER:t=Ef;break;case j.GREATER_EQUAL:t=Tf;break;case j.LESS:t=Lf;break;case j.LESS_EQUAL:t=kf;break;case j.LOGICAL_AND:return e?Of:Pf;case j.LOGICAL_OR:return e?Df:Rf;case j.MUL:t=Uf;break;case j.PRELU:return e?qf:jf;case j.SQUARED_DIFFERENCE:t=Yf;break;case j.SUB:t=Kf;break}return`
    ${t}
    return resultTemp;
  `}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var E;(function(s){s[s.ABS=0]="ABS",s[s.ACOS=1]="ACOS",s[s.ACOSH=2]="ACOSH",s[s.ASIN=3]="ASIN",s[s.ASINH=4]="ASINH",s[s.ATAN=5]="ATAN",s[s.ATANH=6]="ATANH",s[s.CEIL=7]="CEIL",s[s.COS=8]="COS",s[s.COSH=9]="COSH",s[s.ELU=10]="ELU",s[s.ERF=11]="ERF",s[s.EXP=12]="EXP",s[s.EXPM1=13]="EXPM1",s[s.FLOOR=14]="FLOOR",s[s.IS_FINITE=15]="IS_FINITE",s[s.IS_INF=16]="IS_INF",s[s.IS_NAN=17]="IS_NAN",s[s.LINEAR=18]="LINEAR",s[s.LOG=19]="LOG",s[s.LOG1P=20]="LOG1P",s[s.LOGICAL_NOT=21]="LOGICAL_NOT",s[s.NEG=22]="NEG",s[s.RELU=23]="RELU",s[s.RELU6=24]="RELU6",s[s.LEAKYRELU=25]="LEAKYRELU",s[s.RECIPROCAL=26]="RECIPROCAL",s[s.ROUND=27]="ROUND",s[s.RSQRT=28]="RSQRT",s[s.SELU=29]="SELU",s[s.SIGMOID=30]="SIGMOID",s[s.SIGN=31]="SIGN",s[s.SIN=32]="SIN",s[s.SINH=33]="SINH",s[s.SOFTPLUS=34]="SOFTPLUS",s[s.SQRT=35]="SQRT",s[s.SQUARE=36]="SQUARE",s[s.STEP=37]="STEP",s[s.TAN=38]="TAN",s[s.TANH=39]="TANH",s[s.TO_INT=40]="TO_INT"})(E||(E={}));const Jf="return abs(a);",Qf=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return acos(a);
`,Zf=`
  if (a < 1.) {
    return uniforms.NAN;
  }
  return acosh(a);
`,ep=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  return asin(a);
`,tp="return asinh(a);",sp=`
  if (isnan(a)) {
    return uniforms.NAN;
  }
  return atan(a);
`,np=`
  if (abs(a) > 1.) {
    return uniforms.NAN;
  }
  if (a == 1.) {
    return uniforms.INFINITY;
  }
  if (a == -1.) {
    return -uniforms.INFINITY;
  }
  return atanh(a);
`,ip="return ceil(a);",op="return cos(a);",rp=`
  let e2x = exp(-a);
  return (e2x + 1.0 / e2x) / 2.0;
`,ap="return exp(a) - 1.0;",lp="if (a >= 0.0) { return a; }  return (exp(a) - 1.0);",up=`
  var resFloat = exp(a) - vec4<f32>(1.0);
  if (a.r >= 0.0) {
    resFloat.r = a.r;
  }
  if (a.g >= 0.0) {
    resFloat.g = a.g;
  }
  if (a.b >= 0.0) {
    resFloat.b = a.b;
  }
  if (a.a >= 0.0) {
    resFloat.a = a.a;
  }
  return resFloat;
`,cp=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  let p = ${bu};
  let a1 = ${wu};
  let a2 = ${Su};
  let a3 = ${xu};
  let a4 = ${Au};
  let a5 = ${vu};

  let sign = sign(a);
  let absA = abs(a);
  let t = 1.0 / (1.0 + p * absA);
  return sign * (1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * exp(-absA * absA));
`,hp="return exp(a);",dp="return floor(a);",fp="return f32(!isnan(a) && !isinf(a));",pp="return f32(isinf(a));",mp="return f32(isnan(a));",gp="return a;",yp=`if (a < 0.0) { return uniforms.NAN; }
  return log(a);`,bp=`
  if (isnan(a)) { return a; }
  return log(1.0 + a);
`,wp="return f32(!(a >= 1.0));",Sp="return -a;",xp="if (a < 0.0) { return uniforms.alpha * a; } return a;",Ap=`
  let aLessThanZero = vec4<f32>(a < vec4<f32>(0.0));
  return (aLessThanZero * (uniforms.alpha * a)) + ((vec4<f32>(1.0) - aLessThanZero) * a);
`,vp="return 1.0 / a;",Cp="return select(a, 0.0, a < 0.0);",_p="return clamp(a, 0.0, 6.0);",Ip="return clamp(a, vec4<f32>(0.0, 0.0, 0.0, 0.0), vec4<f32>(6.0, 6.0, 6.0, 6.0));",$p=`
  return select(a, vec4<f32>(0.0), a < vec4<f32>(0.0));
`,Np="return round(a);",Ep="return inverseSqrt(a);",Tp=`
  if (a >= 0.0) {
    return ${gu} * a;
  } else {
    return ${yu} * (exp(a) - 1.0);
  }
`,Lp="return 1.0 / (1.0 + exp(-1.0 * a));",kp="return sign(a);",Pp="return sin(a);",Op=`
  let e2x = exp(a);
  return (e2x - 1.0 / e2x) / 2.0;
`,Rp=`
  let epsilon = 1.1920928955078125e-7;
  let threshold = log(epsilon) + 2.0;

  let too_large = a > -threshold;
  let too_small = a < threshold;
  let exp_a = exp(a);

  if (too_large) {
    return a;
  } else if (too_small) {
    return exp_a;
  } else {
    return log(exp_a + 1.0);
  }
`,Dp="return sqrt(a);",zp="return a * a;",Bp=`
  if (isnan(a)) {
    return a;
  }

  return select(uniforms.stepAlpha, 1.0, a > 0.0);
`,Mp="return tan(a);",Fp=`
  let e2x = exp(-2.0 * abs(a));
  return sign(a) * (1.0 - e2x) / (1.0 + e2x);
`,Up="return f32(i32((a)));";function ft(s,e){switch(s){case E.ABS:return Jf;case E.ACOS:return Qf;case E.ACOSH:return Zf;case E.ASIN:return ep;case E.ASINH:return tp;case E.ATAN:return sp;case E.ATANH:return np;case E.COS:return op;case E.COSH:return rp;case E.CEIL:return ip;case E.ELU:return e?up:lp;case E.ERF:return cp;case E.EXP:return hp;case E.EXPM1:return ap;case E.FLOOR:return dp;case E.IS_FINITE:return fp;case E.IS_INF:return pp;case E.IS_NAN:return mp;case E.LINEAR:return gp;case E.LOG:return yp;case E.LOG1P:return bp;case E.LOGICAL_NOT:return wp;case E.NEG:return Sp;case E.LEAKYRELU:return e?Ap:xp;case E.RECIPROCAL:return vp;case E.RELU:return e?$p:Cp;case E.RELU6:return e?Ip:_p;case E.ROUND:return Np;case E.RSQRT:return Ep;case E.SELU:return Tp;case E.SIGMOID:return Lp;case E.SIGN:return kp;case E.SIN:return Pp;case E.SINH:return Op;case E.SOFTPLUS:return Rp;case E.SQRT:return Dp;case E.SQUARE:return zp;case E.STEP:return Bp;case E.TAN:return Mp;case E.TANH:return Fp;case E.TO_INT:return Up;default:throw new Error(`BinaryType ${s} is not implemented!`)}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Et(s,e=!1,t=!1,n=3){if(s===null)return"";let i="";if(s==="linear")i=ft(E.LINEAR);else if(s==="relu")i=ft(E.RELU,t);else if(s==="elu")i=ft(E.ELU,t);else if(s==="relu6")i=ft(E.RELU6,t);else if(s==="prelu")i=Xf(j.PRELU,t);else if(s==="sigmoid")i=ft(E.SIGMOID,t);else if(s==="leakyrelu")i=ft(E.LEAKYRELU,t);else throw new Error(`Activation ${s} has not been implemented for the WebGPU backend.`);const r=D(t?4:1);let a="";return e?a=`
      fn activation(a : ${r}, coords : vec${n}<i32>) -> ${r} {
        let b = getPreluActivationWeightsByOutputCoords(coords);
        ${i}
      }`:a=`
      fn activation(a : ${r}, coords : vec${n}<i32>) -> ${r} {
        ${i}
      }`,a}function rn(s,e){return`
      ${s?"value = value + getBiasByOutputCoords(coords);":""}
      ${e?"value = activation(value, coords);":""}
      `}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function al(s,e,t=!1,n=!1,i=!1,o=1){O(s&&o===1||!s,()=>`transposeA ${s} is not compatible with component size ${o}`);const r=`
      ${s?"value = getA(batch, col, row);":"value = getA(batch, row, col);"}

    `,a=e?"value = getB(batch, col, row);":"value = getB(batch, row, col);";return`
  fn mm_readA(batch: i32, row: i32, col: i32) -> ${D(o)} {
    var value = ${D(o)}(0.0);
    ${t&&i?r:`
    ${s?"if(row < uniforms.dimAOuter && col < uniforms.dimInner)":"if(row < uniforms.aShape[1] && col < uniforms.aShape[2])"}
    {
      ${r}
    }
    `}
    return value;
  }

  fn mm_readB(batch: i32, row: i32, col: i32) -> ${D(o)} {
    var value = ${D(o)}(0.0);
    ${a}
    return value;
  }
  `}function Ei(s,e,t,n,i=!1,o=!1,r=!1,a=1){return`
  ${al(t,n,i,o,r,a)}
  fn mm_write(batch: i32, row: i32, col: i32, valueIn: ${D(a)}) {
    ${i&&o?"":"if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)"}
    {
      var value = valueIn;
      let coords = vec3<i32>(batch, row, col);
      ${rn(s,e)}
      setOutputAtCoords(coords[0], coords[1], coords[2], value);
    }
  }
  `}const Wp=(s,e)=>s?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol * ${e});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRow + innerRow,
          kStart + inputCol * ${e});
        `,Gp=(s,e,t,n)=>{if(s)return`
      for (var k = 0; k < ${n}; k++) {
        let BCached0 = mm_Bsub[k][tileCol];
        let ACached0 = mm_Asub[k][localRow];
        for (var i = 0; i < ${t}; i++) {
          acc[i] = fma(BCached0, vec4<f32>(ACached0[i]), acc[i]);
        }
      }`;{let i="",o="";for(let r=0;r<e;r++)i+=`let BCached${r} = mm_Bsub[k * ${e} + ${r}][tileCol];`,o+=`acc[i] = fma(BCached${r}, vec4<f32>(ACached[${r}]), acc[i]);`;return`
      for (var k = 0; k < ${n/e}; k++) {
        ${i}
        for (var i = 0; i < ${t}; i++) {
          let ACached = mm_Asub[tileRow + i][k];
          ${o}
        }
      }`}};function Ti(s,e,t=!1,n=32,i=!1,o=32,r=!1){const a=e[1]*s[1],l=e[0]*s[0],u=t?a:n,c=t?n:a,h=u/e[0],d=n/e[1],m=s[1],p=s[0];return O((t&&h===4&&s[1]===4||!t&&(h===3||h===4))&&u%e[0]===0&&n%e[1]===0&&s[0]===4,()=>`If transposeA ${t} is true, innerElementSize ${h} and workPerThread[1] ${s[1]} must be 4.
          Otherwise, innerElementSize ${h} must be 3 or 4.
      tileAWidth ${u} must be divisible by workgroupSize[0]${e[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${e[1]}. colPerThread ${s[0]} must be 4.`),`
  var<workgroup> mm_Asub : array<array<vec${h}<f32>, ${u/h}>, ${c}>;
  var<workgroup> mm_Bsub : array<array<vec4<f32>, ${l/s[0]}>, ${n}>;

  ${se()} {
    let localRow = i32(localId.y);
    let tileRow = localRow * ${m};
    let tileCol = i32(localId.x);

    let globalRow = i32(globalId.y) * ${m};
    let globalCol = i32(globalId.x) * ${p};
    let batch = ${i?"0":"i32(globalId.z)"};
    let batchA = ${i||!r?"batch":"batch % uniforms.aShape[0]"};
    let batchB = ${i||!r?"batch":"batch % uniforms.bShape[0]"};
    let globalRowStart = i32(workgroupId.y) * ${a};

    let numTiles = ${i?`${Math.ceil(o/n)}`:`(uniforms.dimInner - 1) / ${n} + 1`};
    var kStart = ${i?`i32(globalId.z) * ${o}`:"0"};

    var acc: array<vec4<f32>, ${m}>;

    // Loop over shared dimension.
    let tileRowB = localRow * ${d};
    for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var innerRow = 0; innerRow < ${m}; innerRow++) {
            let inputRow = tileRow + innerRow;
            let inputCol = tileCol;
            ${Wp(t,h)}
        }

        // Load one tile of B into local memory.
        for (var innerRow = 0; innerRow < ${d}; innerRow++) {
            let inputRow = tileRowB + innerRow;
            let inputCol = tileCol;
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB, kStart + inputRow, globalCol);
        }
        kStart = kStart + ${n};
        workgroupBarrier();

        // Compute acc values for a single thread.
        ${Gp(t,h,m,n)}
        workgroupBarrier();
    }

    for (var innerRow = 0; innerRow < ${m}; innerRow++) {
        mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
    }
  }`}const Ro=s=>s?`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          kStart + inputRow,
          globalRowStart + inputCol);
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batchA,
          globalRowStart + inputRow,
          kStart + inputCol);
        `,Vp=s=>s?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];";function Li(s,e,t=!1,n=32,i=!1,o=32,r=!1,a=!1){const l=s[1]*e[1],u=s[0]*e[0],c=t?l:n,h=t?n:l;O(h%e[1]===0&&c%e[0]===0&&n%e[1]===0,()=>`tileAHight ${h} must be divisible by workgroupSize[1]${e[1]}, tileAWidth ${c} must be divisible by workgroupSize[0]${e[0]}, tileInner ${n} must be divisible by workgroupSize[1]${e[1]}`);const d=h/e[1],m=c/e[0],p=n/e[1],f=s[1],g=s[0],w=r?`
      let localRow = i32(localId.y);
      let localCol = i32(localId.x);
      let globalRowStart = i32(workgroupId.y) * ${l};
      let globalColStart = i32(workgroupId.x) * ${u};

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${e[1]}) {
          for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${e[0]}) {
            ${Ro(t)}
          }
        }
        // Load one tile of B into local memory.
        for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${e[1]}) {
              for (var inputCol = localCol; inputCol < ${u}; inputCol = inputCol + ${e[0]}) {
            mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
              kStart + inputRow,
              globalColStart + inputCol);
          }
        }
        kStart = kStart + ${n};
        workgroupBarrier();

        // Compute acc values for a single thread.
        var BCached : array<f32, ${g}>;
        for (var k = 0; k < ${n}; k++) {
          for (var inner = 0; inner < ${g}; inner++) {
            BCached[inner] = mm_Bsub[k][localCol + inner * ${e[0]}];
          }
          for (var innerRow = 0; innerRow < ${f}; innerRow++) {
            let ACached = ${t?`mm_Asub[k][localRow + innerRow * ${e[1]}];`:`mm_Asub[localRow + innerRow * ${e[1]}][k];`}
            for (var innerCol = 0; innerCol < ${g}; innerCol++) {
              acc[innerRow][innerCol] =
                  fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
            }
          }
        }
        workgroupBarrier();
      }
      for (var innerRow = 0; innerRow < ${f}; innerRow++) {
        let gRow = globalRowStart + localRow + innerRow * ${e[1]};
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          let gCol = globalColStart + localCol + innerCol * ${e[0]};
          mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
        }
      }
      `:`
  let tileRow = i32(localId.y) * ${f};
  let tileCol = i32(localId.x) * ${g};

  let globalRow = i32(globalId.y) * ${f};
  let globalCol = i32(globalId.x) * ${g};
  let globalRowStart = i32(workgroupId.y) * ${l};

  let tileRowA = i32(localId.y) * ${d};
  let tileColA = i32(localId.x) * ${m};
  let tileRowB = i32(localId.y) * ${p};
  // Loop over shared dimension.
  for (var t = 0; t < numTiles; t++) {
    // Load one tile of A into local memory.
    for (var innerRow = 0; innerRow < ${d}; innerRow++) {
      for (var innerCol = 0; innerCol < ${m}; innerCol++) {
        let inputRow = tileRowA + innerRow;
        let inputCol = tileColA + innerCol;
        ${Ro(t)}
      }
    }

    // Load one tile of B into local memory.
    for (var innerRow = 0; innerRow < ${p}; innerRow++) {
      for (var innerCol = 0; innerCol < ${g}; innerCol++) {
        let inputRow = tileRowB + innerRow;
        let inputCol = tileCol + innerCol;
        mm_Bsub[inputRow][inputCol] = mm_readB(batchB,
          kStart + inputRow,
          globalCol + innerCol);
      }
    }
    kStart = kStart + ${n};
    workgroupBarrier();

    // Compute acc values for a single thread.
    var BCached : array<f32, ${g}>;
    for (var k = 0; k < ${n}; k++) {
      for (var inner = 0; inner < ${g}; inner++) {
        BCached[inner] = mm_Bsub[k][tileCol + inner];
      }

      for (var innerRow = 0; innerRow < ${f}; innerRow++) {
        ${Vp(t)}
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] =
              fma(ACached, BCached[innerCol], acc[innerRow][innerCol]);
        }
      }
    }

    workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < ${f}; innerRow++) {
    for (var innerCol = 0; innerCol < ${g}; innerCol++) {
      mm_write(batch, globalRow + innerRow, globalCol + innerCol,
          acc[innerRow][innerCol]);
    }
  }
  `;return`
    var<workgroup> mm_Asub : array<array<f32, ${c}>, ${h}>;
    var<workgroup> mm_Bsub : array<array<f32, ${u}>, ${n}>;

    ${se()} {
      let batch = ${i?"0":"i32(globalId.z)"};
      let batchA = ${i||!a?"batch":"batch % uniforms.aShape[0]"};
      let batchB = ${i||!a?"batch":"batch % uniforms.bShape[0]"};
      let numTiles = ${i?`${Math.ceil(o/n)}`:`(uniforms.dimInner - 1) / ${n} + 1`};
      var kStart = ${i?`i32(globalId.z) * ${o}`:"0"};

      var acc : array<array<f32, ${g}>, ${f}>;

      // Without this initialization strange values show up in acc.
      for (var innerRow = 0; innerRow < ${f}; innerRow++) {
        for (var innerCol = 0; innerCol < ${g}; innerCol++) {
          acc[innerRow][innerCol] = 0.0;
        }
      }
      ${w}
    }
  `}const Hp=s=>s?`
      mm_readA(batchA, colA, globalRow),
      mm_readA(batchA, colA + 1, globalRow),
      mm_readA(batchA, colA + 2, globalRow),
      mm_readA(batchA, colA + 3, globalRow)
  `:`
      mm_readA(batchA, globalRow, colA),
      mm_readA(batchA, globalRow, colA + 1),
      mm_readA(batchA, globalRow, colA + 2),
      mm_readA(batchA, globalRow, colA + 3)
  `;function jp(s,e=!1){O(s[1]===1&&s[2]===1,()=>`A linear work group size is required. But got ${s}.`);const t=s[0]*4;return`
    var<workgroup> mm_Asub : array<vec4<f32>, ${s[0]}>;

    ${se()} {
      let tileCol = i32(localId.x);
      let globalCol = i32(globalId.x);
      let globalRow = i32(globalId.y);

      let numTiles = (uniforms.dimInner - 1) / ${t} + 1;
      let batch = i32(globalId.z);
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      // Without this initialization strange values show up in acc.
      var acc = 0.0;

      // Loop over shared dimension.
      for (var t = 0; t < numTiles; t++) {
        // Load one tile of A into local memory.
        let colA = t * ${t} + tileCol * 4;
        mm_Asub[tileCol] = vec4<f32>(${Hp(e)});
        workgroupBarrier();

        // Compute acc values for a single thread.
        for (var k = 0; k < ${t/4}; k++) {
          let rowB = t * ${t} + k * 4;
          let BCached = vec4<f32>(mm_readB(batchB, rowB, globalCol),
                              mm_readB(batchB, rowB + 1, globalCol),
                              mm_readB(batchB, rowB + 2, globalCol),
                              mm_readB(batchB, rowB + 3, globalCol));

          let ACached = mm_Asub[k];
          acc = acc + dot(ACached, BCached);
        }

        workgroupBarrier();
      }

      mm_write(batch, globalRow, globalCol, acc);
    }
  `}class qp{constructor(e,t,n=!1,i=!1,o=null,r=null,a=null,l=!1){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=t,this.dispatchLayout={x:[2],y:[1],z:[0]};const u=n?e[1]:e[2];if(this.isVec4=(u%4===0&&!n||t[1]%4===0&&n)&&t[2]%4===0&&!i,this.outputComponent=this.isVec4?4:1,this.isVectorA=t[1]===1&&!n,!this.isVec4&&this.isVectorA)this.elementsPerThread=[1,1,1],this.workgroupSize=[32,1,1];else{const d=jd(t[1],u,t[2],n);this.workgroupSize=d.workgroupSize,this.elementsPerThread=d.elementsPerThread}this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread);const c=o!=null,h=a!=null;c&&this.variableNames.push("bias"),h&&this.variableNames.push("preluActivationWeights"),this.sequentialAccessByThreads=l,this.transposeA=n,this.transposeB=i,this.addBias=c,this.activation=r,this.hasPreluActivationWeights=h,[this.fitAOuter,this.fitBOuter,this.fitInner]=this.getShapeFit(t[1],t[2],u),this.shaderKey=`matMulPacked_${this.elementsPerThread}_${n}_${i}_${this.activation}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.isVectorA}_${this.sequentialAccessByThreads}`}getShapeFit(e,t,n){const i=this.workgroupSize[1]*this.elementsPerThread[1],o=this.workgroupSize[0]*this.elementsPerThread[0];!this.isVec4&&this.isVectorA?this.tileInner=this.workgroupSize[0]*4:this.tileInner=o;const r=e%i===0,a=t%o===0,l=n%this.tileInner===0;return[r,a,l]}getUserCode(){return`
      ${Et(this.activation,this.hasPreluActivationWeights,this.isVec4)}
      ${Ei(this.addBias,this.activation,!1,this.transposeB,this.fitAOuter,this.fitBOuter,this.fitInner,this.isVec4?4:1)}
      ${this.isVec4?Ti(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,!0):this.isVectorA?jp(this.workgroupSize,this.transposeA):Li(this.elementsPerThread,this.workgroupSize,this.transposeA,this.tileInner,!1,null,this.sequentialAccessByThreads,!0)}
    `}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yp(s,e,t,n,i=!1,o=null,r=!1,a=4,l=4,u=4){const c=_=>{switch(_){case 1:return"resData = f32(x[xIndex]);";case 3:return"resData = vec3<f32>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);";case 4:return"resData = vec4<f32>(x[xIndex / 4]);";default:throw new Error(`innerElementSize ${_} is not supported.`)}},h=_=>{switch(_){case 1:return"return f32(W[row * uniforms.wShape[3] + col]);";case 4:return"return vec4<f32>(W[(row * uniforms.wShape[3] + col) / 4]);";default:throw new Error(`innerElementSize ${_} is not supported.`)}},d=s?`
      let coord = vec4<i32>(batch, xRow, xCol, xCh);
      `:`
      let coord = vec4<i32>(batch, xCh, xRow, xCol);
      `,m=s?`
      let coords = vec4<i32>(
        batch,
        row / outWidth,
        row % outWidth,
        col);
      `:`
      let coords = vec4<i32>(
        batch,
        row,
        col / outWidth,
        col % outWidth);
      `,p=s?"uniforms.xShape[1]":"uniforms.xShape[2]",f=s?"uniforms.xShape[2]":"uniforms.xShape[3]",g=s?"row":"col",w=s?"col":"row",y=`
      let inChannels = uniforms.wShape[2];
      let outWidth = ${s?"uniforms.outShape[2]":"uniforms.outShape[3]"};
      let outRow = ${g} / outWidth;
      let outCol = ${g} % outWidth;

      let WRow = ${w} / (uniforms.filterDims[1] * inChannels);
      let WCol = ${w} / inChannels % uniforms.filterDims[1];
      let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * WRow - uniforms.pads[0];
      let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * WCol - uniforms.pads[1];
      let xCh = ${w} % inChannels;
      var resData = ${D(a)}(0.0);
      // The bounds checking is always needed since we use it to pad zero for
      // the 'same' padding type.
      if (xRow >= 0 && xRow < ${p} && xCol >= 0 && xCol < ${f}) {
        ${d}
        let xIndex = getIndexFromCoords4D(coord, uniforms.xShape);
        ${c(a)}
      }
      return resData;`,x=s?e&&n?`
      ${y}`:`
      if (row < uniforms.dimAOuter && col < uniforms.dimInner) {
        ${y}
      }
      return ${D(a)}(0.0);`:n&&t?`
      ${y}`:`
      if (row < uniforms.dimInner && col < uniforms.dimBOuter) {
        ${y}
      }
      return ${D(a)}(0.0);`,S=`${h(l)}`,A=D(u),C=D(s?a:l),T=D(s?l:a);return`
      ${Et(o,r,u===4,4)}
      fn mm_readA(batch: i32, row : i32, col : i32) -> ${C} {
        ${s?x:S}
      }

      fn mm_readB(batch: i32, row : i32, col : i32) -> ${T} {
        ${s?S:x}
      }

      fn mm_write(batch: i32, row : i32, col : i32, valueIn : ${A}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter)
        {
        var value = valueIn;
        let outWidth = ${s?"uniforms.outShape[2]":"uniforms.outShape[3]"};
        ${m}
        ${rn(i,o)}
        setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
        }
      }`}class Kp{constructor(e,t,n,i,o=!1,r=null,a=!1,l=!1){this.variableNames=["x","W"],this.uniforms="filterDims : vec2<i32>, pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.outputShape=e.outShape,this.isChannelsLast=e.dataFormat==="channelsLast",this.isVec4=((e.inChannels%4===0||e.inChannels%3===0)&&this.isChannelsLast||e.outWidth%4===0&&!this.isChannelsLast)&&e.outChannels%4===0,this.dispatchLayout=this.isChannelsLast?{x:[3],y:[1,2],z:[0]}:{x:[2,3],y:[1],z:[0]},this.workgroupSize=qd(this.dispatchLayout,this.outputShape,this.isVec4),this.elementsPerThread=Yd(this.dispatchLayout,this.outputShape,this.isVec4),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize,this.elementsPerThread),this.isVec4?(this.outputComponent=4,this.isChannelsLast&&e.inChannels%4!==0?(this.innerElementSize=3,this.variableComponents=[1,4]):(this.innerElementSize=4,this.variableComponents=[4,4]),o&&(this.variableNames.push("bias"),this.variableComponents.push(4)),a&&(this.variableNames.push("preluActivationWeights"),this.variableComponents.push(4))):(this.innerElementSize=this.elementsPerThread[0],o&&this.variableNames.push("bias"),a&&this.variableNames.push("preluActivationWeights")),this.sequentialAccessByThreads=l,this.addBias=o,this.activation=r,this.hasPreluActivationWeights=a,this.tileAOuter=this.workgroupSize[1]*this.elementsPerThread[1],this.tileBOuter=this.workgroupSize[0]*this.elementsPerThread[0],this.tileInner=Math.max(this.workgroupSize[0]*this.innerElementSize,this.workgroupSize[1]),this.fitAOuter=t%this.tileAOuter===0,this.fitBOuter=n%this.tileBOuter===0,this.fitInner=i%this.tileInner===0,this.shaderKey=`conv2DMM_${this.elementsPerThread}_${this.activation}}_${this.fitAOuter}_${this.fitBOuter}_${this.fitInner}_${this.isVec4}_${this.innerElementSize}_${this.isChannelsLast}_${this.sequentialAccessByThreads}`}getUserCode(){const e=this.isVec4?Ti(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner):Li(this.elementsPerThread,this.workgroupSize,!this.isChannelsLast,this.tileInner,!1,null,this.sequentialAccessByThreads),t=this.isVec4?[this.innerElementSize,4,4]:[1,1,1];return`
    ${Yp(this.isChannelsLast,this.fitAOuter,this.fitBOuter,this.fitInner,this.addBias,this.activation,this.hasPreluActivationWeights,t[0],t[1],t[2])}
    ${e}
  `}}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Xp{constructor(e,t=!1,n=null,i=!1){this.variableNames=["x","W"],this.uniforms="filterDims: vec2<i32>, pads: vec2<i32>, strides: vec2<i32>, dilations: vec2<i32>,",this.workgroupSize=[4,4,8],this.outputShape=e.outShape,this.isChannelsLast=e.dataFormat==="channelsLast",this.dispatchLayout=this.isChannelsLast?{x:[2],y:[1],z:[0,3]}:{x:[3],y:[2],z:[0,1]},this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=t,this.activation=n,this.hasPreluActivationWeights=i,t&&this.variableNames.push("bias"),i&&this.variableNames.push("preluActivationWeights"),this.shaderKey=`conv2dnaive_${this.activation}_${this.isChannelsLast}`}getUserCode(){return`
       ${Et(this.activation,this.hasPreluActivationWeights,!1,4)}
       fn readInp(batch : i32, row : i32, col : i32, chan : i32) -> f32{
         let coords = vec4<i32>(batch, row, col, chan);
         if (coordsInBounds4D(coords, uniforms.xShape)) {
           return  getX(batch, row, col, chan);
         } else {
          return 0.0;
         }
       }
       fn readFilt(row : i32, col : i32, xChannel : i32, outChannel : i32) -> f32{
         let coords = vec4<i32>(row, col, xChannel, outChannel);
         if(coordsInBounds4D(coords, uniforms.wShape)) {
           return getW(row, col, xChannel, outChannel);
          } else {
            return 0.0;
          }
       }
       fn writeResult(batch : i32, row : i32, col : i32, chan : i32, valueIn : f32) {
         let coords = ${this.isChannelsLast?"vec4<i32>(batch, row, col, chan);":"vec4<i32>(batch, chan, row, col);"}
         if (coordsInBounds4D(coords, uniforms.outShape)) {
           var value = valueIn;
           ${rn(this.addBias,this.activation)}
           setOutputAtCoords(coords.x, coords.y, coords.z, coords.w, value);
         }
       }
       ${se("index")} {
         let coords = getOutputCoords();
         let batch = coords[0];
         let outChannel = ${this.isChannelsLast?"coords[3];":"coords[1];"}
         let outRow = ${this.isChannelsLast?"coords[1];":"coords[2];"}
         let outCol = ${this.isChannelsLast?"coords[2];":"coords[3];"}
         var acc : f32 = 0.0;
         for (var row = 0; row < uniforms.filterDims[0]; row = row + 1) {
           for (var col = 0; col < uniforms.filterDims[1]; col = col + 1) {
             let xRow = outRow * uniforms.strides[0] + uniforms.dilations[0] * row - uniforms.pads[0];
             let xCol = outCol * uniforms.strides[1] + uniforms.dilations[1] * col - uniforms.pads[1];
             for (var xChannel = 0; xChannel < ${this.isChannelsLast?"uniforms.xShape[3];":"uniforms.xShape[1];"} xChannel = xChannel + 1) {
               ${this.isChannelsLast?"let v = readInp(batch, xRow, xCol, xChannel);":"let v = readInp(batch, xChannel, xRow, xCol);"}
               let f = readFilt(row, col, xChannel, outChannel);
               acc = acc + v * f;
             }
           }
         }
         writeResult(batch, outRow, outCol, outChannel, acc);
       }
     `}}/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Jp{constructor(e,t){this.variableNames=["x"],this.uniforms=`pads : vec2<i32>, strides : vec2<i32>, dilations : vec2<i32>, outWidth : i32, itemsPerBlockRow : i32,
       inChannels : i32,`,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.isChannelsLast=t,this.shaderKey=`im2col_${this.isChannelsLast}`}getUserCode(){const e=this.isChannelsLast?1:2,t=this.isChannelsLast?2:3,n=this.isChannelsLast?"coords[1]":"coords[2]",i=this.isChannelsLast?"coords[2]":"coords[1]",o=this.isChannelsLast?"getX(batch, xRow, xCol, ch)":"getX(batch, ch, xRow, xCol)";return`
    ${se("index")} {
      let coords = getCoordsFromIndex(index);
      if(index < uniforms.size) {
        let batch = coords[0];
        let row = ${n};
        let col = ${i};
        let offsetY = (row / uniforms.outWidth) * uniforms.strides[0] - uniforms.pads[0];
        let xRow = offsetY + uniforms.dilations[0] * (col / uniforms.itemsPerBlockRow);
        var value = 0.0;
        if(xRow < uniforms.xShape[${e}] && xRow >= 0) {
          let offsetX = (row % uniforms.outWidth) * uniforms.strides[1] -
              uniforms.pads[1];
          let xCol = offsetX + uniforms.dilations[1] * ((col %
              uniforms.itemsPerBlockRow) / uniforms.inChannels);
          let ch = col % uniforms.inChannels;
          if(xCol < uniforms.xShape[${t}] && xCol >= 0) {
            value = ${o};
          }
        }
        setOutputAtIndex(index, value);
      }
    }
   `}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qp(s){return`
    var<workgroup> sumValues : array<f32, ${s}>;
    ${se()} {
      let coords = getOutputCoords();
      let batch = coords[0];
      let batchA = batch % uniforms.aShape[0];
      let batchB = batch % uniforms.bShape[0];
      let row = coords[1];
      let col = coords[2];
      var sum = 0.0;
      let Length = uniforms.dimInner;
      for (var k = i32(localId.x); k < Length; k = k + ${s}) {
        let dataA = mm_readA(batchA, row, k);
        let dataB = mm_readB(batchB, k, col);
        sum = sum + dataA * dataB;
      }
      sumValues[localId.x] = sum;
      workgroupBarrier();

      for(var currentSize = ${s/2}u; currentSize > 1u;
          currentSize = currentSize / 2u) {
        if (localId.x < currentSize)
        {
          sumValues[localId.x] = sumValues[localId.x] + sumValues[localId.x + currentSize];
        }
        workgroupBarrier();
      }

      if (localId.x == 0u) {
        sum = sumValues[0] + sumValues[1];
        mm_write(batch, row, col, sum);
      }
    }
  `}class Zp{constructor(e,t=!1,n=!1,i=null,o=null,r=null){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[256,1,1],this.outputShape=e,this.dispatchLayout={x:[],y:[1,2],z:[0]},this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize);const a=i!=null,l=r!=null;a&&this.variableNames.push("bias"),l&&this.variableNames.push("preluActivationWeights"),this.transposeA=t,this.transposeB=n,this.addBias=a,this.activation=o,this.hasPreluActivationWeights=l,this.shaderKey=`matMulReduce_${this.activation}_${t}_${n}`}getUserCode(){return`
      ${Et(this.activation,this.hasPreluActivationWeights)}
      ${Ei(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${Qp(this.workgroupSize[0])}
    `}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function em(s){const e=s[1],t=s[0],n=e>t?e:t;return`
  var<workgroup> mm_Asub : array<array<f32, ${n}>, ${e}>;
  var<workgroup> mm_Bsub : array<array<f32, ${t}>, ${n}>;

  // If the output size is small for matrix multiplication, avoid to use vec4
  // and handle some elements per thread to optimally utilize the ALU.
  // Read data from global memory to registers firstly, then store them into
  // shared memory, so it is instruction-Level parallelism for arithmetic
  // operations and others handle IO operations between barrier api, makes ALU
  // and load/store units work simultaneously, could improves the performance.
  ${se()} {
    let tileRow = i32(localId.y);
    let tileCol = i32(localId.x);
    let globalRow = i32(globalId.y);
    let globalCol = i32(globalId.x);
    let batch = i32(globalId.z);
    let batchA = batch % uniforms.aShape[0];
    let batchB = batch % uniforms.bShape[0];

    // uniforms.dimInner should be greater than 0.
    let numTiles = (uniforms.dimInner - 1) / ${n} + 1;
    var acc = 0.0;

    var globalColA = tileCol;
    var globalRowB = 0;
    var regA = mm_readA(batchA, globalRow, globalColA);
    var regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
    var regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
    globalColA = globalColA + ${n};
    globalRowB = globalRowB + ${n};

    for (var t = 0; t < numTiles; t = t + 1) {
      mm_Asub[tileRow][tileCol] = regA;
      mm_Bsub[2 * tileRow][tileCol] = regB0;
      mm_Bsub[2 * tileRow + 1][tileCol] = regB1;

      workgroupBarrier();

      regA = mm_readA(batchA, globalRow, globalColA);
      regB0 = mm_readB(batchB, globalRowB + 2 * tileRow, globalCol);
      regB1 = mm_readB(batchB, globalRowB + 2 * tileRow + 1, globalCol);
      globalColA = globalColA + ${n};
      globalRowB = globalRowB + ${n};

      for (var k = 0; k < ${n}; k = k + 1) {
        acc = acc + mm_Asub[tileRow][k] * mm_Bsub[k][tileCol];
      }
      workgroupBarrier();
    }

    mm_write(batch, globalRow, globalCol, acc);
  }
  `}class tm{constructor(e,t,n,i=!1,o=!1,r=null,a=null,l=null){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[16,8,1],this.outputShape=n,this.dispatchLayout={x:[2],y:[1],z:[0]},this.dispatch=[Math.ceil(n[2]/this.workgroupSize[0]),Math.ceil(n[1]/this.workgroupSize[1]),n[0]];const u=r!=null;u&&this.variableNames.push("bias");const c=l!=null;c&&this.variableNames.push("preluActivationWeights"),this.transposeA=i,this.transposeB=o,this.addBias=u,this.activation=a,this.hasPreluActivationWeights=c,this.shaderKey=`matMulSmallOutputSize_${this.activation}_${i}_${o}`}getUserCode(){return`
      ${Et(this.activation,this.hasPreluActivationWeights)}
      ${Ei(this.addBias,this.activation,this.transposeA,this.transposeB)}
      ${em(this.workgroupSize)}
    `}}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class sm{constructor(e,t,n=!1,i=!1){this.variableNames=["A","B"],this.uniforms="dimAOuter : i32, dimBOuter : i32, dimInner : i32,",this.workgroupSize=[8,8,1],this.atomic=!0,this.splitedDimInner=128,O(e[0]===1,()=>"MatMulSplitKProgram only supports batch = 1."),this.outputShape=e,this.dispatchLayout={x:[2],y:[1],z:[0,3]};const o=(n&&this.outputShape[1]%4===0||!n&&t%4===0)&&this.outputShape[2]%4===0;this.elementsPerThread=[4,4,this.splitedDimInner],this.outputComponent=o?4:1,o||(this.outputShape[1]<16&&(this.elementsPerThread[1]=1),this.outputShape[2]<16&&(this.elementsPerThread[0]=1)),this.dispatch=ae(this.dispatchLayout,[this.outputShape[0],this.outputShape[1],this.outputShape[2],t],this.workgroupSize,this.elementsPerThread),this.transposeA=n,this.transposeB=i,this.shaderKey=`matMulSplitK_${n}_${i}_${this.elementsPerThread}_${this.outputComponent}`}getUserCode(){const e=this.outputComponent;return`
      ${al(!1,this.transposeB,!1,!1,!1,e)}
      fn mm_write(batch: i32, row : i32, col : i32, value : ${D(e)}) {
        if (row < uniforms.dimAOuter && col < uniforms.dimBOuter) {
          let coords = vec3<i32>(batch, row, col);
          let flatIndex = getOutputIndexFromCoords(coords);
          // The problem is that we should initialize output to zero before using.
          // Otherwise, the original value will be added to the result.
          for (var i = 0; i < ${e}; i = i + 1) {
            ${Pd("&result[flatIndex + i]",`${e>1?"value[i]":"value"}`)}
          }
        }
      }
      ${e===4?Ti(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner):Li(this.elementsPerThread,this.workgroupSize,this.transposeA,32,!0,this.splitedDimInner)}
    `}}class nm{constructor(e,t=null,n=null,i=null){this.uniforms="",this.variableNames=["x"],this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=e,this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.addBias=t!=null,this.hasPreluActivationWeights=i!=null,this.activation=n,this.addBias&&this.variableNames.push("bias"),this.hasPreluActivationWeights&&this.variableNames.push("preluActivationWeights"),this.shaderKey=`biasActivation_${n}`}getUserCode(){return`
    ${Et(this.activation,this.hasPreluActivationWeights)}
    ${se("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
        var value = getXByOutputIndex(index);
        ${rn(this.addBias,this.activation)}
        setOutputAtIndex(index, value);
      }
    }
    `}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function J(s){const{inputs:e,attrs:t}=s,{x:n}=e,{shape:i}=t,o=W(n.shape),r=Cu(i,o),a=W(r);return O(o===a,()=>`The new shape (${r}) has ${a} elements and the old shape (${n.shape}) has ${o} elements. The new shape and old shape must have the same number of elements.`),s.backend.incRef(n.dataId),{dataId:n.dataId,shape:r,dtype:n.dtype}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ll({a:s,b:e,transposeA:t,transposeB:n,backend:i,bias:o=null,preluActivationWeights:r=null,leakyreluAlpha:a=0,activation:l=null}){const u=s.shape.length,c=e.shape.length,h=t?s.shape[u-2]:s.shape[u-1],d=e.shape[c-2],m=t?s.shape[u-1]:s.shape[u-2],p=e.shape[c-1],f=s.shape.slice(0,-2),g=e.shape.slice(0,-2),w=W(f),y=W(g),S=_u(s.shape.slice(0,-2),e.shape.slice(0,-2)).concat([m,p]);O(h===d,()=>`Error in matMul: inner shapes (${h}) and (${d}) of Tensors with shapes ${s.shape} and ${e.shape} and transposeA=${t} and transposeB=${n} must match.`);const A=t?[w,h,m]:[w,m,h],C=[y,d,p],T=J({inputs:{x:s},backend:i,attrs:{shape:A}}),$=J({inputs:{x:e},backend:i,attrs:{shape:C}}),_=[T,$],N=Math.max(w,y),M=[T,$],Q=[{type:"int32",data:[m]},{type:"int32",data:[p]},{type:"int32",data:[h]}];let ne,R;const P=[N,m,p];let z=ce().get("WEBGPU_MATMUL_PROGRAM_TYPE");if(z<0){const de=ce().getNumber("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL"),Ne=de>0?de:i.thresholdToIncreaseWorkgroups,fe=N*Math.ceil(m/32)*Math.ceil(p/32);fe<=Ne||m<=8&&fe<=Ne*2?N*m*p<=128?z=Be.MatMulReduceProgram:N===1&&d>=2e3?z=Be.MatMulSplitKProgram:z=Be.MatMulSmallOutputSizeProgram:z=Be.MatMulPackedProgram}switch(z){case Be.MatMulReduceProgram:ne=new Zp(P,t,n,o,l,r);break;case Be.MatMulSplitKProgram:{if(R=rl({backend:i,attrs:{shape:P,value:0,dtype:s.dtype}}),ne=new sm(P,d,t,n),o||l){R=i.runWebGPUProgram(ne,M,s.dtype,Q,R);const Ne=new nm(R.shape,o,l,r);let fe=null;const Tt=[R];o&&Tt.push(o),r&&Tt.push(r),l==="leakyrelu"&&(fe=[{type:"float32",data:[a]}],Ne.uniforms+=" alpha : f32,");const ki=i.runWebGPUProgram(Ne,Tt,R.dtype,fe);_.push(R);const cl=J({inputs:{x:ki},backend:i,attrs:{shape:S}});_.push(ki);for(const hl of _)i.disposeData(hl.dataId);return cl}break}case Be.MatMulSmallOutputSizeProgram:ne=new tm(A,C,P,t,n,o,l,r);break;case Be.MatMulPackedProgram:const de=i.adapterInfo.isIntel();ne=new qp(A,P,t,n,o,l,r,de);break;default:throw new Error(`Unsupported MatMulProgramType ${z}.`)}o&&M.push(o),r&&M.push(r),l==="leakyrelu"&&(Q.push({type:"float32",data:[a]}),ne.uniforms+=" alpha : f32,"),R=i.runWebGPUProgram(ne,M,s.dtype,Q,R);const be=J({inputs:{x:R},backend:i,attrs:{shape:S}});_.push(R);for(const de of _)i.disposeData(de.dataId);return be}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function js(s,e){const t=s.length;return t>=3?e?[...s.slice(0,-3),s[t-3]*s[t-2],s[t-1]]:[...s.slice(0,-3),s[t-3],s[t-2]*s[t-1]]:!e&&t===1&&s[0]>1?[s[0],1]:null}function im({x:s,filter:e,convInfo:t,backend:n,bias:i=null,preluActivationWeights:o=null,leakyreluAlpha:r=0,activation:a=null}){const l=t.dataFormat==="channelsLast",u=!l,c=!1,h=l&&t.filterHeight===t.inHeight&&t.filterWidth===t.inWidth&&t.padInfo.type==="VALID",d=[];let m,p;if(h){const w=t.inHeight*t.inWidth*t.inChannels;m=J({inputs:{x:s},backend:n,attrs:{shape:[1,t.batchSize,w]}}),p=J({inputs:{x:e},backend:n,attrs:{shape:[1,w,t.outChannels]}})}else m=J({inputs:{x:s},backend:n,attrs:{shape:l?[t.batchSize,t.inHeight*t.inWidth,t.inChannels]:[t.batchSize,t.inChannels,t.inHeight*t.inWidth]}}),p=J({inputs:{x:e},backend:n,attrs:{shape:[1,t.inChannels,t.outChannels]}});if(d.push(m),d.push(p),o!=null){const w=js(o.shape,l);w!=null&&(o=J({inputs:{x:o},backend:n,attrs:{shape:w}}),d.push(o))}if(i!=null){const w=js(i.shape,l);w!=null&&(i=J({inputs:{x:i},backend:n,attrs:{shape:w}}),d.push(i))}const f=ll({a:l?m:p,b:l?p:m,transposeA:u,transposeB:c,backend:n,bias:i,activation:a,preluActivationWeights:o,leakyreluAlpha:r}),g=J({inputs:{x:f},backend:n,attrs:{shape:t.outShape}});d.push(f);for(const w of d)n.disposeData(w.dataId);return g}function om({x:s,filter:e,convInfo:t,backend:n,bias:i=null,preluActivationWeights:o=null,leakyreluAlpha:r=0,activation:a=null}){const{filterWidth:l,filterHeight:u,inChannels:c,strideWidth:h,strideHeight:d,padInfo:m,outWidth:p,outHeight:f,dilationWidth:g,dilationHeight:w,dataFormat:y}=t,x=y==="channelsLast",S=l*u*c,A=f*p,C=x?[t.batchSize,A,S]:[t.batchSize,S,A],T=new Jp(C,x),$=[{type:"int32",data:[m.top,m.left]},{type:"int32",data:[d,h]},{type:"int32",data:[w,g]},{type:"int32",data:[p]},{type:"int32",data:[c*l]},{type:"int32",data:[c]}],_=n.runWebGPUProgram(T,[s],s.dtype,$),N=[];N.push(_);const M=J({inputs:{x:e},backend:n,attrs:{shape:[1,S,-1]}});if(N.push(M),o!=null){const z=js(o.shape,x);z!=null&&(o=J({inputs:{x:o},backend:n,attrs:{shape:z}}),N.push(o))}if(i!=null){const z=js(i.shape,x);z!=null&&(i=J({inputs:{x:i},backend:n,attrs:{shape:z}}),N.push(i))}const R=ll({a:x?_:M,b:x?M:_,transposeA:!x,transposeB:!1,backend:n,bias:i,activation:a,preluActivationWeights:o,leakyreluAlpha:r}),P=J({inputs:{x:R},backend:n,attrs:{shape:t.outShape}});N.push(R);for(const z of N)n.disposeData(z.dataId);return P}function rm({x:s,filter:e,convInfo:t,backend:n,bias:i=null,preluActivationWeights:o=null,leakyreluAlpha:r=0,activation:a=null}){const l=i!=null,u=o!=null,c=t.dataFormat==="channelsLast",h=c&&t.filterHeight===t.inHeight&&t.filterWidth===t.inWidth&&t.padInfo.type==="VALID",d=ce().getBool("WEBGPU_USE_NAIVE_CONV2D_DEBUG");if(!d&&(h||t.filterHeight===1&&t.filterWidth===1&&t.dilationHeight===1&&t.dilationWidth===1&&t.strideHeight===1&&t.strideWidth===1&&(t.padInfo.type==="SAME"||t.padInfo.type==="VALID")))return im({x:s,filter:e,convInfo:t,backend:n,bias:i,activation:a,preluActivationWeights:o,leakyreluAlpha:r});const m=ce().getNumber("WEBGPU_THRESHOLD_TO_INCREASE_WORKGROUPS_FOR_MATMUL"),p=m>-1?m:n.thresholdToIncreaseWorkgroups,f=t.batchSize*Math.ceil(t.outHeight*t.outWidth/32)*Math.ceil(t.outChannels/32);if(ce().getBool("WEBGPU_CONV_SEPARATE_IM2COL_SHADER")||f<=p)return om({x:s,filter:e,convInfo:t,backend:n,bias:i,preluActivationWeights:o,leakyreluAlpha:r,activation:a});let g;const w=[t.padInfo.top,t.padInfo.left],y=[{type:"int32",data:[t.filterHeight,t.filterWidth]},{type:"int32",data:[...w]},{type:"int32",data:[t.strideHeight,t.strideWidth]},{type:"int32",data:[t.dilationHeight,t.dilationWidth]}];if(d)g=new Xp(t,l,a,u);else{const C=c?t.outHeight*t.outWidth:t.outChannels,T=c?t.outChannels:t.outHeight*t.outWidth,$=t.filterHeight*t.filterWidth*t.inChannels;y.push({type:"int32",data:[C]},{type:"int32",data:[T]},{type:"int32",data:[$]});const _=n.adapterInfo.isIntel();g=new Kp(t,C,T,$,l,a,u,_)}const x=[],S=[s,e];l&&(!c&&i.shape.length===1&&(i=J({inputs:{x:i},backend:n,attrs:{shape:[i.shape[0],1,1]}}),x.push(i)),S.push(i)),u&&(!c&&o.shape.length===1&&(o=J({inputs:{x:o},backend:n,attrs:{shape:[o.shape[0],1,1]}}),x.push(o)),S.push(o)),a==="leakyrelu"&&(y.push({type:"float32",data:[r]}),g.uniforms+=" alpha : f32,");const A=n.runWebGPUProgram(g,S,s.dtype,y);for(const C of x)n.disposeData(C.dataId);return A}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function am(s){const{inputs:e,backend:t,attrs:n}=s,{x:i,filter:o,bias:r,preluActivationWeights:a}=e,{strides:l,pad:u,dataFormat:c,dilations:h,dimRoundingMode:d,activation:m,leakyreluAlpha:p}=n,f=$u(c),g=Nu(i.shape,o.shape,l,h,u,d,!1,f);return rm({x:i,filter:o,convInfo:g,backend:t,bias:r,preluActivationWeights:a,leakyreluAlpha:p,activation:m})}const lm={kernelName:Iu,backendName:"webgpu",kernelFunc:am};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class um{constructor(e){this.variableNames=["x"],this.uniforms="strides : vec2<i32>,",this.workgroupSize=[256,1,1],this.size=!0,this.outputShape=e.outShape,this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="poolWithFilterSizeEqualsOne"}getUserCode(){return`
      ${se("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];

          let xRCCorner = coords.yz * uniforms.strides;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          let value = getX(batch, xRCorner, xCCorner, d);
          setOutputAtIndex(index, value);
        }
      }
    `}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class cm{constructor(e,t,n=!1,i=!1,o=!1){if(this.variableNames=["x"],this.uniforms="strides : vec2<i32>, pads : vec2<i32>, dilations : vec2<i32>, convDims : vec2<i32>, filterDims : vec2<i32>,",this.workgroupSize=[128,1,1],this.size=!0,t==="avg"&&n)throw new Error("Cannot compute positions for average pool.");this.outputShape=e.outShape,this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.poolType=t,this.computePositions=n,this.flattenPositions=i,this.includeBatchIndex=o,this.shaderKey=`pool2D_${t}_${n}_${i}_${o}`}getUserCode(){let e;this.poolType==="avg"?e="resultValue = resultValue + value; count = count + 1.0;":this.computePositions?e=`let currMaxValue = mix(value, maxValue, maxValueFound);
      if (value >= currMaxValue) {
        maxValue = value;
        maxValueFound = 1.0;
        maxPosition = ${this.flattenPositions?this.includeBatchIndex?"((batch * uniforms.xShape[1] + xR) * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d":"(xR * uniforms.xShape[2] + xC) * uniforms.xShape[3] + d":"wR * uniforms.filterDims.y + wC"};
      }`:e="resultValue = max(value, resultValue);";let t="resultValue";return this.poolType==="avg"&&(t="resultValue / max(count, 1.0)"),`
      ${se("index")} {
      if (index < uniforms.size) {
        let coords = getCoordsFromIndex(index);
          let batch = coords[0];
          let d = coords[3];
          let xRCCorner = vec2<i32>(coords.yz) * uniforms.strides - uniforms.pads;
          let xRCorner = xRCCorner.x;
          let xCCorner = xRCCorner.y;

          ${this.computePositions?`var maxValue = 0.0;
            var maxValueFound = 0.0;
            var maxPosition = 0;`:`var resultValue = ${this.poolType==="avg"?"0.0":"-1.0 / pow(10.0, -20.0)"};`}

          var count = 0.0;
          for (var wR = 0; wR < uniforms.filterDims.x; wR = wR + uniforms.dilations.x) {
            let xR = xRCorner + wR;

            if (xR < 0 || xR >= uniforms.convDims.x) {
              continue;
            }

            for (var wC = 0; wC < uniforms.filterDims.y; wC = wC + uniforms.dilations.y) {
              let xC = xCCorner + wC;
              if (xC < 0 || xC >= uniforms.convDims.y) {
                continue;
              }

              let value = getX(batch, xR, xC, d);
              ${e}
            }
          }

          ${this.computePositions?"setOutputAtIndexI32(index, maxPosition);":`setOutputAtIndex(index, ${t});`}
        }
      }
    `}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class hm{constructor(e,t){this.variableNames=["A"],this.workgroupSize=[16,16,1];const n=new Array(e.length);for(let i=0;i<n.length;i++)n[i]=e[t[i]];this.outputShape=n,this.dispatchLayout={x:[0],y:[1]},this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize,[1,1,1]),this.shaderKey="transposeShared"}getUserCode(){O(this.workgroupSize[0]===this.workgroupSize[1],()=>`Must be a square tile, current tile shape is ${this.workgroupSize[0]} x ${this.workgroupSize[1]}`);const e=this.workgroupSize[0];return`
      var<workgroup> tile : array<array<f32, ${this.workgroupSize[0]+1}>, ${this.workgroupSize[0]}>;
      ${se()} {
        var x = i32(workgroupId.x) * ${e} + i32(localId.x);
        var y = i32(workgroupId.y) * ${e} + i32(localId.y);
        let width = uniforms.outShape[0];
        let height = uniforms.outShape[1];
        if (x < width && y < height) {
          tile[localId.y][localId.x] = f32(A[y * width + x]);
        }
        workgroupBarrier();

        x = i32(workgroupId.y) * ${e} + i32(localId.x);
        y = i32(workgroupId.x) * ${e} + i32(localId.y);
        if (x < height && y < width) {
          setOutputAtIndex((y * height + x), tile[localId.x]
            [localId.y]);
        }
      }
    `}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class dm{constructor(e,t){this.variableNames=["A"],this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0;const n=new Array(e.length);for(let i=0;i<n.length;i++)n[i]=e[t[i]];this.outputShape=n,this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.newDim=t,this.shaderKey=`transpose_${t}`}getUserCode(){const e=ue(this.outputShape.length),t=fm(this.newDim);return`
      ${se("index")} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            setOutputAtIndex(flatIndex, A[getIndexFromCoords${this.outputShape.length}D(
              ${e}(${t}), uniforms.aShape)]);
          }
        }
      }
    `}}function fm(s){const e=s.length;if(e>6)throw Error(`Transpose for rank ${e} is not yet supported`);const t=new Array(e);for(let n=0;n<s.length;n++)t[s[n]]=`coords.${ot(n)}`;return t.join()}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pm(s){const{inputs:e,backend:t,attrs:n}=s,{x:i}=e,{perm:o}=n,r=t,a=i.shape.length,l=new Array(a);for(let c=0;c<l.length;c++)l[c]=i.shape[o[c]];if(t.shouldExecuteOnCPU([i])){const h=r.tensorMap.get(i.dataId).values,d=gf(h,i.shape,i.dtype,o,l);return t.makeTensorInfo(l,i.dtype,d)}if(i.shape.length===2&&Ye(o,[1,0])){const c=new hm(i.shape,o);return r.runWebGPUProgram(c,[i],i.dtype)}const u=new dm(i.shape,o);return r.runWebGPUProgram(u,[i],i.dtype)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class mm{constructor(e,t,n){this.variableNames=["x"],this.uniforms="reduceSize : i32,",this.size=!0,this.inputShape=[e.batchSize,e.inSize];const[i]=Yn(this.inputShape,[1]);this.outputShape=i.length===0?[1]:i,e.inSize>=32768&&n>=512?this.workgroupSize=[512,1,1]:e.inSize>=4096?this.workgroupSize=[256,1,1]:this.workgroupSize=[64,1,1],this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,[1,1,1]),this.reduceType=t,this.shaderKey=`reduce_${t}`}getUserCode(){let e="",t="0.0";const n=this.workgroupSize[0];this.reduceType==="min"||this.reduceType==="max"?(e=`
         if (isnan(candidate)) {
          bestValue = uniforms.NAN;
         } else if (!isnan(bestValue) && candidate ${this.reduceType==="min"?"<":">"} bestValue)
           {  bestValue = candidate; }`,t="f32(x[offset])"):this.reduceType==="sum"||this.reduceType==="mean"?e=" bestValue = bestValue + candidate; ":this.reduceType==="prod"?(e=" bestValue = bestValue * candidate; ",t="1.0"):this.reduceType==="all"?(e=" bestValue = f32(bestValue >= 1.0 && candidate >= 1.0); ",t="1.0"):this.reduceType==="any"&&(e=" bestValue = f32(bestValue >= 1.0 || candidate >= 1.0); ",t="0.0");const i=this.reduceType==="mean"?"setOutputAtIndex(outputIndex, bestValue / f32(uniforms.reduceSize));":"setOutputAtIndex(outputIndex, bestValue);";return`
       fn DIV_CEIL(a : u32, b : u32) -> u32 {
        return ((a - 1u) / b + 1u);
       }

       ${`
         var<workgroup> xBestValues : array<f32, ${n}>;
       `}
       fn getOffset(outputIndex : i32) -> i32 {
         let outputCoords = getCoordsFromIndex(outputIndex);
         let offset = ${this.outputShape.length===1?"outputCoords":"outputCoords[0]"} * uniforms.reduceSize;
          return offset;
       }
       ${se("index")} {
         let outputIndex = index / ${n};
         let offset = getOffset(outputIndex);
         var bestValue = ${t};
         let Length = uniforms.reduceSize;
         let WorkPerThread = DIV_CEIL(u32(Length), ${n}u);
         for (var k = i32(localId.x); k < Length && outputIndex < uniforms.size;
             k = k + ${n}) {
           let candidate = f32(x[offset + k]);
           ${e}
         }
         xBestValues[localId.x] = bestValue;
         workgroupBarrier();

         var reduceSize = min(u32(Length), ${n}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (localId.x < currentSize) {
            let candidate = xBestValues[localId.x + interval];
            ${e}
            xBestValues[localId.x] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (localId.x == 0u && outputIndex < uniforms.size) {
          ${i}
        }
       }
     `}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gm={mean:"float32",all:"bool",any:"bool"};function ym(s,e,t,n,i){const o=s.shape.length,r=[],a=Ko(e,s.shape);let l=a;const u=Eu(l,o);let c=s;u!=null&&(c=pm({inputs:{x:s},attrs:{perm:u},backend:i}),l=Tu(l.length,o),r.push(c)),Lu(n,l,o);const[h,d]=Yn(c.shape,l);let m=h;t&&(m=ku(h,a));let p;if(i.shouldExecuteOnCPU([c])){const f=i.tensorMap.get(c.dataId).values;switch(n){case"max":const g=ff(f,W(d),m,s.dtype);p=i.makeTensorInfo(m,s.dtype,g);break;case"prod":const{outVals:w,outShape:y,outDtype:x}=pf(c.shape,c.dtype,f,l);p=i.makeTensorInfo(y,x,w);break;default:throw new Error(`${n} CPU implementation is not yet supported.`)}}else{const f=W(d),w=W(c.shape)/f,y={windowSize:f,inSize:f,batchSize:w,outSize:1},x=gm[n]||Pu(s.dtype),S=[{type:"int32",data:[f]}],A=new mm(y,n,i.device.limits.maxComputeWorkgroupSizeX),C=i.runWebGPUProgram(A,[c],x,S);r.push(C),p=J({inputs:{x:C},attrs:{shape:m},backend:i})}return r.forEach(f=>i.disposeData(f.dataId)),p}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bm(s){const{inputs:e,backend:t,attrs:n}=s,{x:i}=e,{reductionIndices:o,keepDims:r}=n;return ym(i,o,r,"max",t)}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wm(s,e,t,n){if(e.filterWidth===1&&e.filterHeight===1&&Ye(e.inShape,e.outShape))return Qe({inputs:{x:s},backend:n});if(e.filterWidth===e.inWidth&&e.filterHeight===e.inHeight&&e.batchSize===1&&e.padInfo.type==="VALID"){const r=s.shape.length,a=J({inputs:{x:s},backend:n,attrs:{shape:[s.shape[r-3]*s.shape[r-2],s.shape[r-1]]}});let l;O(t==="max",()=>`Invalid pool type ${t}`),l=bm({inputs:{x:a},backend:n,attrs:{reductionIndices:0,keepDims:!1}});const u=J({inputs:{x:l},backend:n,attrs:{shape:e.outShape}});return n.disposeData(a.dataId),n.disposeData(l.dataId),u}let i;const o=[{type:"int32",data:[e.strideHeight,e.strideWidth]}];return e.filterHeight===1&&e.filterWidth===1?i=new um(e):(O(t==="max",()=>`Invalid pool type ${t}`),i=new cm(e,"max"),o.push({type:"int32",data:[e.padInfo.top,e.padInfo.left]},{type:"int32",data:[e.dilationHeight,e.dilationWidth]},{type:"int32",data:[e.inHeight,e.inWidth]},{type:"int32",data:[e.effectiveFilterHeight,e.effectiveFilterWidth]})),n.runWebGPUProgram(i,[s],s.dtype,o)}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sm(s){const{inputs:e,backend:t,attrs:n}=s,{x:i}=e,{filterSize:o,strides:r,pad:a,dimRoundingMode:l}=n,c=Ru(i.shape,o,r,1,a,l);return wm(i,c,"max",t)}const xm={kernelName:Ou,backendName:"webgpu",kernelFunc:Sm};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Am{constructor(e,t,n,i){this.variableNames=["x"],this.uniforms="adjustHeightWidth : vec2<f32>, roundBase : f32,",this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=[e[0],t,n,e[3]],this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize),this.halfPixelCenters=i,this.shaderKey=`resizeNearest_${i}`}getUserCode(){let e;return this.halfPixelCenters?e="max((vec2<f32>(rc) + vec2<f32>(0.5)) * effectiveInputOverOutputRatioRC, vec2<f32>(0.0))":e="vec2<f32>(rc) * effectiveInputOverOutputRatioRC",`
      ${se("index")} {
        if (index < uniforms.size) {
          let coords = getCoordsFromIndex(index);
          let b = coords[0];
          let d = coords[3];
          let rc = coords.yz;

          let effectiveInSize = vec2<f32>(
            f32(uniforms.xShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.xShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveOutSize = vec2<f32>(
            f32(uniforms.outShape.y) - uniforms.adjustHeightWidth[0],
            f32(uniforms.outShape.z) - uniforms.adjustHeightWidth[1]);

          let effectiveInputOverOutputRatioRC =
              effectiveInSize / effectiveOutSize;

          // Fractional source index
          let sourceFracIndexRC = ${e};

          // Compute the coordinators of nearest neighbor point.
          let inputShapeRC = vec2<f32>(f32(uniforms.xShape.y), f32(uniforms.xShape.z));
          let sourceNearestRC = vec2<i32>(
            min(inputShapeRC - 1.0, floor(sourceFracIndexRC + uniforms.roundBase)));
          let newValue = getX(b, sourceNearestRC.x, sourceNearestRC.y, d);

          setOutputAtIndex(index, newValue);
        }
      }
    `}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vm(s){const{inputs:e,backend:t,attrs:n}=s,{images:i}=e,{alignCorners:o,halfPixelCenters:r,size:a}=n,[l,u]=a,c=o&&l>1?1:0,h=o&&u>1?1:0,m=[{type:"float32",data:[c,h]},{type:"float32",data:[o?.5:0]}],p=new Am(i.shape,l,u,r);return t.runWebGPUProgram(p,[i],i.dtype,m)}const Cm={kernelName:Du,backendName:"webgpu",kernelFunc:vm};/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class _m{constructor(e){this.uniforms="",this.workPerThread=1,this.workgroupSize=[64,1,1],this.size=!0,this.outputShape=jt(e,1),this.variableNames=e.map((t,n)=>`T${n}`),this.dispatchLayout=$e(this.outputShape),this.dispatch=ae(this.dispatchLayout,this.outputShape,this.workgroupSize,[this.workPerThread,1,1]),this.offsetLength=e.length-1;for(let t=0;t<this.offsetLength;t++)this.uniforms+=`offset${t} : i32,`;this.shaderKey="concat"}getUserCode(){const e=[];if(this.offsetLength>0){e.push("if (yC < uniforms.offset0){ setOutputAtCoords(coords.x, coords.y, getT0(yR, yC)); }");for(let o=1;o<this.offsetLength;o++)e.push(`else if (yC < uniforms.offset${[o]}){ setOutputAtCoords(coords.x, coords.y, getT${o}(yR, yC - uniforms.offset${o-1})); }`);const n=this.offsetLength,i=this.offsetLength-1;e.push(`else { setOutputAtCoords(coords.x, coords.y, getT${n}(yR, yC - uniforms.offset${i})); }`)}else e.push("setOutputAtCoords(coords.x, coords.y, getT0(yR, yC));");return`
      ${se("index")} {
        for(var i = 0; i < ${this.workPerThread}; i = i + 1) {
          let flatIndex = index * ${this.workPerThread} + i;
          if(flatIndex < uniforms.size) {
            let coords = getCoordsFromIndex(flatIndex);
            let yR = coords.x;
            let yC = coords.y;

            ${e.join(`
        `)}
          }
        }
      }
    `}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Im(s){const{inputs:e,backend:t}=s,{real:n,imag:i}=e,o=t.makeTensorInfo(n.shape,"complex64"),r=t.tensorMap.get(o.dataId),a=Qe({inputs:{x:n},backend:t}),l=Qe({inputs:{x:i},backend:t});return r.complexTensorInfos={real:a,imag:l},o}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $m(s){const{inputs:e,backend:t}=s,{input:n}=e,i=t.tensorMap.get(n.dataId);return Qe({inputs:{x:i.complexTensorInfos.imag},backend:t})}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nm(s){const{inputs:e,backend:t}=s,{input:n}=e,i=t.tensorMap.get(n.dataId);return Qe({inputs:{x:i.complexTensorInfos.real},backend:t})}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dt(s,e,t){const n=s[0].dtype;if(n==="complex64"){const p=s.map(x=>Nm({inputs:{input:x},backend:t})),f=s.map(x=>$m({inputs:{input:x},backend:t})),g=Dt(p,e,t),w=Dt(f,e,t),y=Im({inputs:{real:g,imag:w},backend:t});return p.forEach(x=>t.disposeData(x.dataId)),f.forEach(x=>t.disposeData(x.dataId)),t.disposeData(g.dataId),t.disposeData(w.dataId),y}let i=t.shouldExecuteOnCPU(s);if(n==="string"&&(i=!0),i){const p=s.map(A=>{const T=[-1,W(A.shape.slice(e))];return J({inputs:{x:A},backend:t,attrs:{shape:T}})}),f=p.map(A=>({vals:t.readSync(A.dataId),shape:A.shape})),g=jt(p.map(A=>A.shape),1),w=p[0].shape[0]===1,y=df(f,g,n,w),x=jt(s.map(A=>A.shape),e),S=t.makeTensorInfo(x,n,y);return p.forEach(A=>t.disposeData(A.dataId)),S}const o=t.device.limits.maxStorageBuffersPerShaderStage-1;if(s.length>o){const p=[];for(let g=0;g<s.length;g+=o){const w=s.slice(g,g+o);p.push(Dt(w,e,t))}const f=Dt(p,e,t);for(const g of p)t.disposeData(g.dataId);return f}const{tensors2D:r,outShape:a}=Em(s,e,t),l=r.map(p=>p.shape),u=new _m(l),c=[],h=new Array(l.length-1);if(h.length>0){h[0]=l[0][1],c.push({type:"int32",data:[h[0]]});for(let p=1;p<h.length;p++)h[p]=h[p-1]+l[p][1],c.push({type:"int32",data:[h[p]]})}const d=t.runWebGPUProgram(u,r,r[0].dtype,c);r.forEach(p=>t.disposeData(p.dataId));const m=J({inputs:{x:d},backend:t,attrs:{shape:a}});return t.disposeData(d.dataId),m}function Em(s,e,t){const n=jt(s.map(o=>o.shape),e);return{tensors2D:s.map(o=>J({inputs:{x:o},backend:t,attrs:{shape:[W(o.shape.slice(0,e)),W(o.shape.slice(e))]}})),outShape:n}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tm(s){const{inputs:e,backend:t,attrs:n}=s,{axis:i}=n,o=Ko(i,e[0].shape)[0],r=e.map(u=>u.shape);Bu(r,o);const a=jt(e.map(u=>u.shape),o);if(W(a)===0)return t.makeTensorInfo(a,e[0].dtype,[]);const l=e.filter(u=>W(u.shape)>0);return l.length===1?Qe({inputs:{x:l[0]},backend:t}):Dt(l,o,t)}const Lm={kernelName:zu,backendName:"webgpu",kernelFunc:Tm},km=[Qd,of,Sf,lm,xm,Cm,Lm,Zd];for(const s of km)Mu({...s,backendName:"webgpu-oidn"});async function Pm(){try{const s={powerPreference:"high-performance"},e=await navigator.gpu.requestAdapter(s),t={},n=[];e.features.has("timestamp-query")&&n.push("timestamp-query"),e.features.has("bgra8unorm-storage")&&n.push(["bgra8unorm-storage"]),t.requiredFeatures=n;const i=e.limits;t.requiredLimits={maxComputeWorkgroupStorageSize:i.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:i.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:i.maxStorageBufferBindingSize,maxBufferSize:i.maxBufferSize,maxComputeWorkgroupSizeX:i.maxComputeWorkgroupSizeX,maxComputeInvocationsPerWorkgroup:i.maxComputeInvocationsPerWorkgroup};const o=await e.requestDevice(t),r=e.info??await e.requestAdapterInfo?.();return ul(o,r)}catch{}}async function ul(s,e){let t=Bt.findBackend("webgpu-oidn");return t!=null||(t=new us(s,e),Bt.registerBackend("webgpu-oidn",()=>t),await Bt.setBackend("webgpu-oidn")),t}async function Om(s,e,t){const n=await(e?ul(e.device,e.adapterInfo):Pm()),i=Gu(s);return new Nd(i,n,t)}async function Dm(s,e,t){return fetch(s).then(n=>n.arrayBuffer()).then(n=>Om(n,e,t))}export{Nd as UNet,Om as initUNetFromBuffer,Dm as initUNetFromURL,Gu as parseTZA};
