function Tu(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const s in r)if(s!=="default"&&!(s in e)){const o=Object.getOwnPropertyDescriptor(r,s);o&&Object.defineProperty(e,s,o.get?o:{enumerable:!0,get:()=>r[s]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}/**
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
 */const Iu=1e-7,_u=1e-4;class Au{constructor(t,n){this.backend=t,this.dataMover=n,this.data=new WeakMap,this.dataIdsCount=0}get(t){return this.data.has(t)||this.dataMover.moveData(this.backend,t),this.data.get(t)}set(t,n){this.dataIdsCount++,this.data.set(t,n)}has(t){return this.data.has(t)}delete(t){return this.dataIdsCount--,this.data.delete(t)}numDataIds(){return this.dataIdsCount}}class Fs{refCount(t){return pt("refCount")}incRef(t){return pt("incRef")}timerAvailable(){return!0}time(t){return pt("time")}read(t){return pt("read")}readSync(t){return pt("readSync")}readToGPU(t,n){return pt("readToGPU")}numDataIds(){return pt("numDataIds")}disposeData(t,n){return pt("disposeData")}write(t,n,r){return pt("write")}move(t,n,r,s,o){return pt("move")}createTensorFromGPUData(t,n,r){return pt("createTensorFromGPUData")}memory(){return pt("memory")}floatPrecision(){return pt("floatPrecision")}epsilon(){return this.floatPrecision()===32?Iu:_u}dispose(){return pt("dispose")}}function pt(e){throw new Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}/**
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
 */function Bs(e){let t=e.length,n=0;for(;t>0;)n=Math.random()*t|0,t--,gn(e,t,n)}function Du(e,t){if(e.length!==t.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${e.length}Second array length was ${t.length}`);let n=e.length,r=0;for(;n>0;)r=Math.random()*n|0,n--,gn(e,n,r),gn(t,n,r)}function De(e,t,n){return Math.max(e,Math.min(t,n))}function Nu(e){return e%2===0?e:e+1}function gn(e,t,n){const r=e[t];e[t]=e[n],e[n]=r}function Mu(e){let t=0;for(let n=0;n<e.length;n++)t+=e[n];return t}function Fu(e,t){const n=Math.random();return t*n+(1-n)*e}function Bu(e,t){let n=0;for(let r=0;r<e.length;r++){const s=Number(e[r])-Number(t[r]);n+=s*s}return n}function p(e,t){if(!e)throw new Error(typeof t=="string"?t:t())}function ht(e,t,n=""){p(Ft(e,t),()=>n+` Shapes ${e} and ${t} must match`)}function ce(e){p(e!=null,()=>"The input to the tensor constructor must be a non-null value.")}function G(e){if(e.length===0)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function Ru(e){return e.length===0}function Rs(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==null&&t[n]!==null&&e[n]!==t[n])return!1;return!0}function Ft(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function we(e){return e%1===0}function Cu(e){if(Math.tanh!=null)return Math.tanh(e);if(e===1/0)return 1;if(e===-1/0)return-1;{const t=Math.exp(2*e);return(t-1)/(t+1)}}function Pu(e){const t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]}function Ou(e){const t=new Uint32Array(e);for(let n=0;n<e;++n)t[n]=n;return Bs(t),t}function Ie(e,t){return t<=e.length?e:e+" ".repeat(t-e.length)}function Lu(e,t=s=>0,n,r){return new Promise((s,o)=>{let i=0;const a=()=>{if(e()){s();return}i++;const c=t(i);if(n!=null&&i>=n){o();return}r!=null?r(a,c):setTimeout(a,c)};a()})}function Wu(e,t){let n=1,r=-1;for(let o=0;o<e.length;++o)if(e[o]>=0)n*=e[o];else if(e[o]===-1){if(r!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${r} and dim ${o}`);r=o}else if(e[o]<0)throw Error(`Shapes can not be < 0. Found ${e[o]} at dim ${o}`);if(r===-1){if(t>0&&t!==n)throw Error(`Size(${t}) must match the product of shape ${e}`);return e}if(n===0)throw Error(`Cannot infer the missing size in [${e}] when there are 0 elements`);if(t%n!==0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${n}`);const s=e.slice();return s[r]=t/n,s}function Ke(e,t){const n=t.length;return e=e==null?t.map((r,s)=>s):[].concat(e),p(e.every(r=>r>=-n&&r<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${e}`),p(e.every(r=>we(r)),()=>`All values in axis param must be integers but got axis ${e}`),e.map(r=>r<0?n+r:r)}function Cs(e,t){const n=[],r=[],s=t!=null&&Array.isArray(t)&&t.length===0,o=t==null||s?null:Ke(t,e).sort();let i=0;for(let a=0;a<e.length;++a){if(o!=null){if(o[i]===a&&e[a]!==1)throw new Error(`Can't squeeze axis ${a} since its dim '${e[a]}' is not 1`);(o[i]==null||o[i]>a)&&e[a]===1&&(n.push(e[a]),r.push(a)),o[i]<=a&&i++}e[a]!==1&&(n.push(e[a]),r.push(a))}return{newShape:n,keptDims:r}}function Ps(e,t){return kr(e,t)}function kr(e,t){let n=null;if(e==null||e==="float32")n=new Float32Array(t);else if(e==="int32")n=new Int32Array(t);else if(e==="bool")n=new Uint8Array(t);else if(e==="string")n=new Array(t);else throw new Error(`Unknown data type ${e}`);return n}function Os(e,t){for(let n=0;n<e.length;n++){const r=e[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${t} being uploaded contains ${r}.`)}}function Ls(e){return e==="bool"||e==="complex64"||e==="float32"||e==="int32"||e==="string"}function qu(e,t){return!(t==="complex64"||t==="float32"&&e!=="complex64"||t==="int32"&&e!=="float32"&&e!=="complex64"||t==="bool"&&e==="bool")}function mn(e){if(e==="float32"||e==="int32")return 4;if(e==="complex64")return 8;if(e==="bool")return 1;throw new Error(`Unknown dtype ${e}`)}function Ws(e){if(e==null)return 0;let t=0;return e.forEach(n=>t+=n.length),t}function Lt(e){return typeof e=="string"||e instanceof String}function qs(e){return typeof e=="boolean"}function Us(e){return typeof e=="number"}function je(e){return Array.isArray(e)?je(e[0]):e instanceof Float32Array?"float32":e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray?"int32":Us(e)?"float32":Lt(e)?"string":qs(e)?"bool":"float32"}function Gt(e){return!!(e&&e.constructor&&e.call&&e.apply)}function bn(e,t){for(let n=t;n<e;++n)if(e%n===0)return n;return e}function ke(e){const t=e.length;if(t<2)return[];const n=new Array(t-1);n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}function Gs(e,t,n,r=!1){const s=new Array;if(t.length===1){const o=t[0]*(r?2:1);for(let i=0;i<o;i++)s[i]=n[e+i]}else{const o=t[0],i=t.slice(1),a=i.reduce((c,u)=>c*u)*(r?2:1);for(let c=0;c<o;c++)s[c]=Gs(e+c*a,i,n,r)}return s}function fe(e,t,n=!1){if(e.length===0)return t[0];const r=e.reduce((s,o)=>s*o)*(n?2:1);if(r===0)return[];if(r!==t.length)throw new Error(`[${e}] does not match the input size ${t.length}${n?" for a complex tensor":""}.`);return Gs(0,e,t,n)}function Uu(e,t){if(Array.isArray(e))return e;if(t==="float32")return e instanceof Float32Array?e:new Float32Array(e);if(t==="int32")return e instanceof Int32Array?e:new Int32Array(e);if(t==="bool"||t==="string")return Uint8Array.from(new Int32Array(e));throw new Error(`Unknown dtype ${t}`)}function xr(e,t){const n=Tn(e,t);for(let r=0;r<n.length;r++)n[r]=1;return n}function Tn(e,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool")return new Uint8Array(e);throw new Error(`Unknown data type ${t}`)}function Gu(e,t){const n=e.reduce((r,s)=>r*s,1);if(t==null||t==="float32")return fe(e,new Float32Array(n));if(t==="int32")return fe(e,new Int32Array(n));if(t==="bool")return fe(e,new Uint8Array(n));throw new Error(`Unknown data type ${t}`)}function mt(e){e.forEach(t=>{p(Number.isInteger(t)&&t>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`)})}function zu(e,t,n){if(t===0)return 0;if(t===1)return e[0];let r=e[e.length-1];for(let s=0;s<e.length-1;++s)r+=n[s]*e[s];return r}function Ku(e,t,n){if(t===0)return[];if(t===1)return[e];const r=new Array(t);for(let s=0;s<r.length-1;++s)r[s]=Math.floor(e/n[s]),e-=r[s]*n[s];return r[r.length-1]=e,r}function In(e){return e&&e.then&&typeof e.then=="function"}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */const cs="tfjsflags";class zs{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=ju,this.populateURLFlags()}setPlatform(t,n){this.platform!=null&&(L().getBool("IS_TEST")||L().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=n}registerFlag(t,n,r){if(this.flagRegistry[t]={evaluationFn:n,setHook:r},this.urlFlags[t]!=null){const s=this.urlFlags[t];L().getBool("IS_TEST")||L().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${s}.`),this.set(t,s)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];const n=this.evaluateFlag(t);if(In(n))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=n,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getString(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,n){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=n,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(n)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;const t=this.getQueryParams(this.global.location.search);cs in t&&t[cs].split(",").forEach(r=>{const[s,o]=r.split(":");this.urlFlags[s]=Hu(s,o)})}}function ju(e){const t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(n,...r)=>(Vu(t,r[0],r[1]),r.join("="))),t}function Vu(e,t,n){e[decodeURIComponent(t)]=decodeURIComponent(n||"")}function Hu(e,t){const n=t.toLowerCase();return n==="true"||n==="false"?n==="true":`${+n}`===n?+n:t}function L(){return vr}let vr=null;function Xu(e){vr=e}/**
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
 */let Gn;function Ks(){if(Gn==null){let e;if(typeof window<"u")e=window;else if(typeof global<"u")e=global;else if(typeof process<"u")e=process;else if(typeof self<"u")e=self;else throw new Error("Could not find a global object");Gn=e}return Gn}function Zu(){const e=Ks();return e._tfGlobals==null&&(e._tfGlobals=new Map),e._tfGlobals}function Sr(e,t){const n=Zu();if(n.has(e))return n.get(e);{const r=t();return n.set(e,r),n.get(e)}}const js="Abs",Vs="Acos",Hs="Acosh",Tr="Add",Xs="AddN",Zs="All",Ys="Any",Js="ArgMax",Qs="ArgMin",to="Asin",eo="Asinh",no="Atan",ro="Atanh",so="Atan2",oo="AvgPool",Yu="AvgPoolGrad",io="AvgPool3D",Ju="AvgPool3DGrad",ao="BatchMatMul",co="BatchToSpaceND",uo="Bincount",lo="BitwiseAnd",Qu="BroadcastTo",ho="BroadcastArgs",Ir="Cast",fo="Ceil",po="ClipByValue",go="Complex",mo="ComplexAbs",bo="Concat",wo="Conv2D",yo="Conv2DBackpropFilter",$o="Conv2DBackpropInput",Eo="Conv3D",tl="Conv3DBackpropFilterV2",ko="Conv3DBackpropInputV2",xo="Cos",vo="Cosh",So="Cumprod",To="Cumsum",Io="CropAndResize",_o="DenseBincount",Ao="DepthToSpace",Do="DepthwiseConv2dNative",No="DepthwiseConv2dNativeBackpropFilter",Mo="DepthwiseConv2dNativeBackpropInput",Fo="Diag",Bo="Dilation2D",el="Dilation2DBackpropInput",nl="Dilation2DBackpropFilter",_r="Draw",Ro="RealDiv",Co="Einsum",Po="Elu",rl="EluGrad",Oo="Erf",Lo="Equal",Wo="Exp",qo="ExpandDims",Uo="Expm1",Go="FFT",zo="Fill",Ko="FlipLeftRight",jo="Floor",Vo="FloorDiv",Ho="FusedBatchNorm",Xo="GatherV2",Zo="GatherNd",Yo="Greater",Jo="GreaterEqual",Ar="Identity",Qo="IFFT",ti="Imag",ei="IsFinite",ni="IsInf",ri="IsNan",si="LeakyRelu",oi="Less",ii="LessEqual",ai="LinSpace",ci="Log",ui="Log1p",li="LogicalAnd",hi="LogicalNot",fi="LogicalOr",sl="LogicalXor",ol="LogSoftmax",il="LowerBound",di="LRN",al="LRNGrad",cl="MatrixBandPart",pi="Max",gi="Maximum",mi="MaxPool",ul="MaxPoolGrad",bi="MaxPool3D",ll="MaxPool3DGrad",wi="MaxPoolWithArgmax",yi="Mean",$i="Min",Ei="Minimum",ki="MirrorPad",xi="Mod",vi="Multinomial",Si="Multiply",Ti="Neg",Ii="NotEqual",_i="NonMaxSuppressionV3",Ai="NonMaxSuppressionV4",Di="NonMaxSuppressionV5",Ni="OnesLike",Mi="OneHot",Fi="Pack",Bi="PadV2",hl="Pool",Ri="Pow",Ci="Prelu",Pi="Prod",Oi="RaggedGather",Li="RaggedRange",Wi="RaggedTensorToTensor",qi="Range",Ui="Real",Gi="Reciprocal",zi="Relu",Ki="Reshape",ji="ResizeNearestNeighbor",fl="ResizeNearestNeighborGrad",Vi="ResizeBilinear",dl="ResizeBilinearGrad",Hi="Relu6",Xi="Reverse",Zi="Round",Yi="Rsqrt",Ji="ScatterNd",Qi="TensorScatterUpdate",ta="SearchSorted",ea="Select",na="Selu",ra="Slice",sa="Sin",oa="Sinh",ia="Sign",aa="Sigmoid",ca="Softplus",ua="Sqrt",la="Sum",ha="SpaceToBatchND",fa="SplitV",da="Softmax",pa="SparseFillEmptyRows",ga="SparseReshape",ma="SparseSegmentMean",ba="SparseSegmentSum",wa="SparseToDense",ya="SquaredDifference",pl="Square",$a="StaticRegexReplace",Ea="StridedSlice",ka="StringNGrams",xa="StringSplit",va="StringToHashBucketFast",Sa="Sub",Ta="Tan",Ia="Tanh",Dr="Tile",_a="TopK",Aa="Transform",rn="Transpose",Da="Unique",Na="Unpack",Ma="UnsortedSegmentSum",gl="UpperBound",Fa="ZerosLike",Ba="Step",Yn="FromPixels",Ra="RotateWithOffset",Jn="_FusedMatMul",Qn="FusedConv2D",tr="FusedDepthwiseConv2D";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Pt(...e){L().getBool("IS_TEST")||L().getBool("PROD")||console.warn(...e)}function ml(...e){L().getBool("IS_TEST")||L().getBool("PROD")||console.log(...e)}/**
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
 */const ye=Sr("kernelRegistry",()=>new Map),Ne=Sr("gradRegistry",()=>new Map);function Me(e,t){const n=Nr(e,t);return ye.get(n)}function er(e){return Ne.get(e)}function wn(e){const t=ye.entries(),n=[];for(;;){const{done:r,value:s}=t.next();if(r)break;const[o,i]=s,[a]=o.split("_");a===e&&n.push(i)}return n}function Ca(e){const{kernelName:t,backendName:n}=e,r=Nr(t,n);ye.has(r)&&Pt(`The kernel '${t}' for backend '${n}' is already registered`),ye.set(r,e)}function bl(e){const{kernelName:t}=e;Ne.has(t)&&L().getBool("DEBUG")&&Pt(`Overriding the gradient for '${t}'`),Ne.set(t,e)}function wl(e,t){const n=Nr(e,t);if(!ye.has(n))throw new Error(`The kernel '${e}' for backend '${t}' is not registered`);ye.delete(n)}function yl(e){if(!Ne.has(e))throw new Error(`The gradient '${e}' for backend is not registered`);Ne.delete(e)}function $l(e,t){wn(e).forEach(r=>{const s=Object.assign({},r,{backendName:t});Ca(s)})}function Nr(e,t){return`${t}_${e}`}/**
 * @license
 * Copyright 2023 Google LLC.
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
 */function Pa(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray}function El(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function kl(e){if(Object.prototype.hasOwnProperty.call(e,"__esModule"))return e;var t=e.default;if(typeof t=="function"){var n=function r(){return this instanceof r?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};n.prototype=t.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(e).forEach(function(r){var s=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(n,r,s.get?s:{enumerable:!0,get:function(){return e[r]}})}),n}var zn,us;function xl(){if(us)return zn;us=1,zn=t;var e=null;try{e=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function t(k,m,I){this.low=k|0,this.high=m|0,this.unsigned=!!I}t.prototype.__isLong__,Object.defineProperty(t.prototype,"__isLong__",{value:!0});function n(k){return(k&&k.__isLong__)===!0}t.isLong=n;var r={},s={};function o(k,m){var I,F,C;return m?(k>>>=0,(C=0<=k&&k<256)&&(F=s[k],F)?F:(I=a(k,(k|0)<0?-1:0,!0),C&&(s[k]=I),I)):(k|=0,(C=-128<=k&&k<128)&&(F=r[k],F)?F:(I=a(k,k<0?-1:0,!1),C&&(r[k]=I),I))}t.fromInt=o;function i(k,m){if(isNaN(k))return m?B:v;if(m){if(k<0)return B;if(k>=y)return R}else{if(k<=-$)return M;if(k+1>=$)return N}return k<0?i(-k,m).neg():a(k%g|0,k/g|0,m)}t.fromNumber=i;function a(k,m,I){return new t(k,m,I)}t.fromBits=a;var c=Math.pow;function u(k,m,I){if(k.length===0)throw Error("empty string");if(k==="NaN"||k==="Infinity"||k==="+Infinity"||k==="-Infinity")return v;if(typeof m=="number"?(I=m,m=!1):m=!!m,I=I||10,I<2||36<I)throw RangeError("radix");var F;if((F=k.indexOf("-"))>0)throw Error("interior hyphen");if(F===0)return u(k.substring(1),m,I).neg();for(var C=i(c(I,8)),O=v,q=0;q<k.length;q+=8){var Z=Math.min(8,k.length-q),st=parseInt(k.substring(q,q+Z),I);if(Z<8){var Q=i(c(I,Z));O=O.mul(Q).add(i(st))}else O=O.mul(C),O=O.add(i(st))}return O.unsigned=m,O}t.fromString=u;function h(k,m){return typeof k=="number"?i(k,m):typeof k=="string"?u(k,m):a(k.low,k.high,typeof m=="boolean"?m:k.unsigned)}t.fromValue=h;var l=65536,f=1<<24,g=l*l,y=g*g,$=y/2,E=o(f),v=o(0);t.ZERO=v;var B=o(0,!0);t.UZERO=B;var S=o(1);t.ONE=S;var _=o(1,!0);t.UONE=_;var A=o(-1);t.NEG_ONE=A;var N=a(-1,2147483647,!1);t.MAX_VALUE=N;var R=a(-1,-1,!0);t.MAX_UNSIGNED_VALUE=R;var M=a(0,-2147483648,!1);t.MIN_VALUE=M;var x=t.prototype;return x.toInt=function(){return this.unsigned?this.low>>>0:this.low},x.toNumber=function(){return this.unsigned?(this.high>>>0)*g+(this.low>>>0):this.high*g+(this.low>>>0)},x.toString=function(m){if(m=m||10,m<2||36<m)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(M)){var I=i(m),F=this.div(I),C=F.mul(I).sub(this);return F.toString(m)+C.toInt().toString(m)}else return"-"+this.neg().toString(m);for(var O=i(c(m,6),this.unsigned),q=this,Z="";;){var st=q.div(O),Q=q.sub(st.mul(O)).toInt()>>>0,tt=Q.toString(m);if(q=st,q.isZero())return tt+Z;for(;tt.length<6;)tt="0"+tt;Z=""+tt+Z}},x.getHighBits=function(){return this.high},x.getHighBitsUnsigned=function(){return this.high>>>0},x.getLowBits=function(){return this.low},x.getLowBitsUnsigned=function(){return this.low>>>0},x.getNumBitsAbs=function(){if(this.isNegative())return this.eq(M)?64:this.neg().getNumBitsAbs();for(var m=this.high!=0?this.high:this.low,I=31;I>0&&(m&1<<I)==0;I--);return this.high!=0?I+33:I+1},x.isZero=function(){return this.high===0&&this.low===0},x.eqz=x.isZero,x.isNegative=function(){return!this.unsigned&&this.high<0},x.isPositive=function(){return this.unsigned||this.high>=0},x.isOdd=function(){return(this.low&1)===1},x.isEven=function(){return(this.low&1)===0},x.equals=function(m){return n(m)||(m=h(m)),this.unsigned!==m.unsigned&&this.high>>>31===1&&m.high>>>31===1?!1:this.high===m.high&&this.low===m.low},x.eq=x.equals,x.notEquals=function(m){return!this.eq(m)},x.neq=x.notEquals,x.ne=x.notEquals,x.lessThan=function(m){return this.comp(m)<0},x.lt=x.lessThan,x.lessThanOrEqual=function(m){return this.comp(m)<=0},x.lte=x.lessThanOrEqual,x.le=x.lessThanOrEqual,x.greaterThan=function(m){return this.comp(m)>0},x.gt=x.greaterThan,x.greaterThanOrEqual=function(m){return this.comp(m)>=0},x.gte=x.greaterThanOrEqual,x.ge=x.greaterThanOrEqual,x.compare=function(m){if(n(m)||(m=h(m)),this.eq(m))return 0;var I=this.isNegative(),F=m.isNegative();return I&&!F?-1:!I&&F?1:this.unsigned?m.high>>>0>this.high>>>0||m.high===this.high&&m.low>>>0>this.low>>>0?-1:1:this.sub(m).isNegative()?-1:1},x.comp=x.compare,x.negate=function(){return!this.unsigned&&this.eq(M)?M:this.not().add(S)},x.neg=x.negate,x.add=function(m){n(m)||(m=h(m));var I=this.high>>>16,F=this.high&65535,C=this.low>>>16,O=this.low&65535,q=m.high>>>16,Z=m.high&65535,st=m.low>>>16,Q=m.low&65535,tt=0,$t=0,at=0,bt=0;return bt+=O+Q,at+=bt>>>16,bt&=65535,at+=C+st,$t+=at>>>16,at&=65535,$t+=F+Z,tt+=$t>>>16,$t&=65535,tt+=I+q,tt&=65535,a(at<<16|bt,tt<<16|$t,this.unsigned)},x.subtract=function(m){return n(m)||(m=h(m)),this.add(m.neg())},x.sub=x.subtract,x.multiply=function(m){if(this.isZero())return v;if(n(m)||(m=h(m)),e){var I=e.mul(this.low,this.high,m.low,m.high);return a(I,e.get_high(),this.unsigned)}if(m.isZero())return v;if(this.eq(M))return m.isOdd()?M:v;if(m.eq(M))return this.isOdd()?M:v;if(this.isNegative())return m.isNegative()?this.neg().mul(m.neg()):this.neg().mul(m).neg();if(m.isNegative())return this.mul(m.neg()).neg();if(this.lt(E)&&m.lt(E))return i(this.toNumber()*m.toNumber(),this.unsigned);var F=this.high>>>16,C=this.high&65535,O=this.low>>>16,q=this.low&65535,Z=m.high>>>16,st=m.high&65535,Q=m.low>>>16,tt=m.low&65535,$t=0,at=0,bt=0,tn=0;return tn+=q*tt,bt+=tn>>>16,tn&=65535,bt+=O*tt,at+=bt>>>16,bt&=65535,bt+=q*Q,at+=bt>>>16,bt&=65535,at+=C*tt,$t+=at>>>16,at&=65535,at+=O*Q,$t+=at>>>16,at&=65535,at+=q*st,$t+=at>>>16,at&=65535,$t+=F*tt+C*Q+O*st+q*Z,$t&=65535,a(bt<<16|tn,$t<<16|at,this.unsigned)},x.mul=x.multiply,x.divide=function(m){if(n(m)||(m=h(m)),m.isZero())throw Error("division by zero");if(e){if(!this.unsigned&&this.high===-2147483648&&m.low===-1&&m.high===-1)return this;var I=(this.unsigned?e.div_u:e.div_s)(this.low,this.high,m.low,m.high);return a(I,e.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?B:v;var F,C,O;if(this.unsigned){if(m.unsigned||(m=m.toUnsigned()),m.gt(this))return B;if(m.gt(this.shru(1)))return _;O=B}else{if(this.eq(M)){if(m.eq(S)||m.eq(A))return M;if(m.eq(M))return S;var q=this.shr(1);return F=q.div(m).shl(1),F.eq(v)?m.isNegative()?S:A:(C=this.sub(m.mul(F)),O=F.add(C.div(m)),O)}else if(m.eq(M))return this.unsigned?B:v;if(this.isNegative())return m.isNegative()?this.neg().div(m.neg()):this.neg().div(m).neg();if(m.isNegative())return this.div(m.neg()).neg();O=v}for(C=this;C.gte(m);){F=Math.max(1,Math.floor(C.toNumber()/m.toNumber()));for(var Z=Math.ceil(Math.log(F)/Math.LN2),st=Z<=48?1:c(2,Z-48),Q=i(F),tt=Q.mul(m);tt.isNegative()||tt.gt(C);)F-=st,Q=i(F,this.unsigned),tt=Q.mul(m);Q.isZero()&&(Q=S),O=O.add(Q),C=C.sub(tt)}return O},x.div=x.divide,x.modulo=function(m){if(n(m)||(m=h(m)),e){var I=(this.unsigned?e.rem_u:e.rem_s)(this.low,this.high,m.low,m.high);return a(I,e.get_high(),this.unsigned)}return this.sub(this.div(m).mul(m))},x.mod=x.modulo,x.rem=x.modulo,x.not=function(){return a(~this.low,~this.high,this.unsigned)},x.and=function(m){return n(m)||(m=h(m)),a(this.low&m.low,this.high&m.high,this.unsigned)},x.or=function(m){return n(m)||(m=h(m)),a(this.low|m.low,this.high|m.high,this.unsigned)},x.xor=function(m){return n(m)||(m=h(m)),a(this.low^m.low,this.high^m.high,this.unsigned)},x.shiftLeft=function(m){return n(m)&&(m=m.toInt()),(m&=63)===0?this:m<32?a(this.low<<m,this.high<<m|this.low>>>32-m,this.unsigned):a(0,this.low<<m-32,this.unsigned)},x.shl=x.shiftLeft,x.shiftRight=function(m){return n(m)&&(m=m.toInt()),(m&=63)===0?this:m<32?a(this.low>>>m|this.high<<32-m,this.high>>m,this.unsigned):a(this.high>>m-32,this.high>=0?0:-1,this.unsigned)},x.shr=x.shiftRight,x.shiftRightUnsigned=function(m){if(n(m)&&(m=m.toInt()),m&=63,m===0)return this;var I=this.high;if(m<32){var F=this.low;return a(F>>>m|I<<32-m,I>>>m,this.unsigned)}else return m===32?a(I,0,this.unsigned):a(I>>>m-32,0,this.unsigned)},x.shru=x.shiftRightUnsigned,x.shr_u=x.shiftRightUnsigned,x.toSigned=function(){return this.unsigned?a(this.low,this.high,!1):this},x.toUnsigned=function(){return this.unsigned?this:a(this.low,this.high,!0)},x.toBytes=function(m){return m?this.toBytesLE():this.toBytesBE()},x.toBytesLE=function(){var m=this.high,I=this.low;return[I&255,I>>>8&255,I>>>16&255,I>>>24,m&255,m>>>8&255,m>>>16&255,m>>>24]},x.toBytesBE=function(){var m=this.high,I=this.low;return[m>>>24,m>>>16&255,m>>>8&255,m&255,I>>>24,I>>>16&255,I>>>8&255,I&255]},t.fromBytes=function(m,I,F){return F?t.fromBytesLE(m,I):t.fromBytesBE(m,I)},t.fromBytesLE=function(m,I){return new t(m[0]|m[1]<<8|m[2]<<16|m[3]<<24,m[4]|m[5]<<8|m[6]<<16|m[7]<<24,I)},t.fromBytesBE=function(m,I){return new t(m[4]<<24|m[5]<<16|m[6]<<8|m[7],m[0]<<24|m[1]<<16|m[2]<<8|m[3],I)},zn}var Oa=xl();const La=El(Oa),vl=Tu({__proto__:null,default:La},[Oa]);/**
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
 */const Yt=La||vl;function Ve(e){return Yt.fromString(e,!0,16)}const Wa=Ve("c3a5c85c97cb3127"),Zt=Ve("b492b66fbe98f273"),ut=Ve("9ae16a3b2f90404f");function nr(e){return e.xor(e.shru(47))}function qa(e,t,n){const r=e.slice(t,t+n);return Yt.fromBytes(Array.from(r),!0,!0)}function K(e,t){return qa(e,t,8)}function ls(e,t){return qa(e,t,4)}function ot(e,t){return t===0?e:e.shru(t).or(e.shl(64-t))}function qt(e,t,n=Ve("9ddfea08eb382d69")){let r=e.xor(t).mul(n);r=r.xor(r.shru(47));let s=t.xor(r).mul(n);return s=s.xor(s.shru(47)),s=s.mul(n),s}function Sl(e,t,n,r,s,o){s=s.add(e),o=ot(o.add(s).add(r),21);const i=s;return s=s.add(t),s=s.add(n),o=o.add(ot(s,44)),[s.add(r),o.add(i)]}function en(e,t,n,r){return Sl(K(e,t),K(e,t+8),K(e,t+16),K(e,t+24),n,r)}function Tl(e,t=e.length){if(t>=8){const n=ut.add(t*2),r=K(e,0).add(ut),s=K(e,t-8),o=ot(s,37).mul(n).add(r),i=ot(r,25).add(s).mul(n);return qt(o,i,n)}if(t>=4){const n=ut.add(t*2),r=ls(e,0);return qt(r.shl(3).add(t),ls(e,t-4),n)}if(t>0){const n=e[0],r=e[t>>1],s=e[t-1],o=n+(r<<8),i=t+(s<<2);return nr(ut.mul(o).xor(Wa.mul(i))).mul(ut)}return ut}function Il(e,t=e.length){const n=ut.add(t*2),r=K(e,0).mul(Zt),s=K(e,8),o=K(e,t-8).mul(n),i=K(e,t-16).mul(ut);return qt(ot(r.add(s),43).add(ot(o,30)).add(i),r.add(ot(s.add(ut),18)).add(o),n)}function _l(e,t=e.length){const n=ut.add(t*2),r=K(e,0).mul(ut),s=K(e,8),o=K(e,t-8).mul(n),i=K(e,t-16).mul(ut),a=ot(r.add(s),43).add(ot(o,30)).add(i),c=qt(a,r.add(ot(s.add(ut),18)).add(o),n),u=K(e,16).mul(n),h=K(e,24),l=a.add(K(e,t-32)).mul(n),f=c.add(K(e,t-24)).mul(n);return qt(ot(u.add(h),43).add(ot(l,30)).add(f),u.add(ot(h.add(r),18)).add(l),n)}function Al(e,t=e.length){const n=Yt.fromNumber(81,!0);if(t<=32)return t<=16?Tl(e,t):Il(e,t);if(t<=64)return _l(e,t);let r=n,s=n.mul(Zt).add(113),o=nr(s.mul(ut).add(113)).mul(ut),i=[Yt.UZERO,Yt.UZERO],a=[Yt.UZERO,Yt.UZERO];r=r.mul(ut).add(K(e,0));let c=0;const u=(t-1>>6)*64,h=u+(t-1&63)-63;do r=ot(r.add(s).add(i[0]).add(K(e,c+8)),37).mul(Zt),s=ot(s.add(i[1]).add(K(e,c+48)),42).mul(Zt),r=r.xor(a[1]),s=s.add(i[0]).add(K(e,c+40)),o=ot(o.add(a[0]),33).mul(Zt),i=en(e,c,i[1].mul(Zt),r.add(a[0])),a=en(e,c+32,o.add(a[1]),s.add(K(e,c+16))),[o,r]=[r,o],c+=64;while(c!==u);const l=Zt.add(o.and(255).shl(1));return c=h,a[0]=a[0].add(t-1&63),i[0]=i[0].add(a[0]),a[0]=a[0].add(i[0]),r=ot(r.add(s).add(i[0]).add(K(e,c+8)),37).mul(l),s=ot(s.add(i[1]).add(K(e,c+48)),42).mul(l),r=r.xor(a[1].mul(9)),s=s.add(i[0].mul(9).add(K(e,c+40))),o=ot(o.add(a[0]),33).mul(l),i=en(e,c,i[1].mul(l),r.add(a[0])),a=en(e,c+32,o.add(a[1]),s.add(K(e,c+16))),[o,r]=[r,o],qt(qt(i[0],a[0],l).add(nr(s).mul(Wa)).add(o),qt(i[1],a[1],l).add(r),l)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */function Dl(e,t){return t==="string"?He(e):_n([e],t)}function Nl(e,t){return e instanceof Float32Array&&t==="float32"||e instanceof Int32Array&&t==="int32"||e instanceof Uint8Array&&t==="bool"}function _n(e,t){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(e)&&(e=zt(e)),L().getBool("DEBUG")&&Os(e,t),Nl(e,t))return e;if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool"){const n=new Uint8Array(e.length);for(let r=0;r<n.length;++r)Math.round(e[r])!==0&&(n[r]=1);return n}else throw new Error(`Unknown data type ${t}`)}function Fe(){return L().platform.now()}function Ml(e,t){return L().platform.fetch(e,t)}function He(e,t="utf-8"){return t=t||"utf-8",L().platform.encode(e,t)}function yn(e,t="utf-8"){return t=t||"utf-8",L().platform.decode(e,t)}function it(e){return L().platform.isTypedArray!=null?L().platform.isTypedArray(e):Pa(e)}function zt(e,t=[],n=!1){if(t==null&&(t=[]),typeof e=="boolean"||typeof e=="number"||typeof e=="string"||In(e)||e==null||it(e)&&n)t.push(e);else if(Array.isArray(e)||it(e))for(let r=0;r<e.length;++r)zt(e[r],t,n);else{let r=-1;for(const s of Object.keys(e))/^([1-9]+[0-9]*|0)$/.test(s)&&(r=Math.max(r,Number(s)));for(let s=0;s<=r;s++)zt(e[s],t,n)}return t}const Fl=Object.freeze(Object.defineProperty({__proto__:null,arraysEqual:Ft,arraysEqualWithNull:Rs,assert:p,assertNonNegativeIntegerDimensions:mt,assertNonNull:ce,assertShapesMatch:ht,bytesFromStringArray:Ws,bytesPerElement:mn,checkConversionForErrors:Os,clamp:De,computeStrides:ke,convertBackendValuesAndArrayBuffer:Uu,createScalarValue:Dl,createShuffledIndices:Ou,decodeString:yn,distSquared:Bu,encodeString:He,fetch:Ml,fingerPrint64:Al,flatten:zt,getArrayFromDType:kr,getTypedArrayFromDType:Ps,hasEncodingLoss:qu,hexToLong:Ve,indexToLoc:Ku,inferDtype:je,inferFromImplicitShape:Wu,isBoolean:qs,isFunction:Gt,isInt:we,isNumber:Us,isPromise:In,isScalarShape:Ru,isString:Lt,isTypedArray:it,isValidDtype:Ls,locToIndex:zu,makeOnesTypedArray:xr,makeZerosNestedTypedArray:Gu,makeZerosTypedArray:Tn,nearestDivisor:bn,nearestLargerEven:Nu,now:Fe,parseAxisParam:Ke,randUniform:Fu,repeatedTry:Lu,rightPad:Ie,shuffle:Bs,shuffleCombo:Du,sizeFromShape:G,sizeToSquarishShape:Pu,squeezeShape:Cs,sum:Mu,swap:gn,tanh:Cu,toNestedArray:fe,toTypedArray:_n},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class Bl{constructor(t,n){this.backendTimer=t,this.logger=n,n==null&&(this.logger=new Cl)}profileKernel(t,n,r){let s;const o=()=>{s=r()};let i;const a=Fe();if(this.backendTimer.timerAvailable())i=this.backendTimer.time(o);else{o();for(const u of s)u.dataSync();i=Promise.resolve({kernelMs:Fe()-a})}if(L().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let u=0;u<s.length;u++){const h=s[u];h.data().then(l=>{Rl(l,h.dtype,t)})}return{kernelName:t,outputs:s,inputs:n,timeMs:i.then(u=>u.kernelMs),extraInfo:i.then(u=>u.getExtraProfileInfo!=null?u.getExtraProfileInfo():"")}}logKernelProfile(t){const{kernelName:n,outputs:r,timeMs:s,inputs:o,extraInfo:i}=t;r.forEach(a=>{Promise.all([a.data(),s,i]).then(c=>{this.logger.logKernelProfile(n,a,c[0],c[1],o,c[2])})})}}function Rl(e,t,n){if(t!=="float32")return!1;for(let r=0;r<e.length;r++){const s=e[r];if(isNaN(s)||!isFinite(s))return console.warn(`Found ${s} in the result of '${n}'`),!0}return!1}class Cl{logKernelProfile(t,n,r,s,o,i){const a=typeof s=="number"?Ie(`${s}ms`,9):s.error,c=Ie(t,25),u=n.rank,h=n.size,l=Ie(n.shape.toString(),14);let f="";for(const g in o){const y=o[g];if(y!=null){const $=y.shape||n.shape,E=$.length;f+=`${g}: ${E}D ${E>0?$:""} `}}console.log(`%c${c}	%c${a}	%c${u}D ${l}	%c${h}	%c${f}	%c${i}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */function Pl(e,t,n){const r={},s={};for(let c=0;c<t.length;c++)r[t[c].id]=!0;for(let c=0;c<e.length;c++){const u=e[c],h=u.inputs;for(const l in h){const f=h[l];let g=!1;for(let y=0;y<t.length;y++)if(r[f.id]){u.outputs.forEach($=>r[$.id]=!0),g=!0,s[u.id]=!0;break}if(g)break}}const o={};o[n.id]=!0;const i={};for(let c=e.length-1;c>=0;c--){const u=e[c],h=u.inputs;for(let l=0;l<u.outputs.length;l++)if(o[u.outputs[l].id]){for(const f in h)o[h[f].id]=!0,i[u.id]=!0;break}}const a=[];for(let c=0;c<e.length;c++){const u=e[c];if(s[u.id]&&i[u.id]){const h={};for(const f in u.inputs){const g=u.inputs[f];r[g.id]&&(h[f]=g)}const l=Object.assign({},u);l.inputs=h,l.outputs=u.outputs,a.push(l)}}return a}function Ol(e,t,n,r){for(let s=t.length-1;s>=0;s--){const o=t[s],i=[];if(o.outputs.forEach(c=>{const u=e[c.id];u!=null?i.push(u):i.push(null)}),o.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${o.kernelName}.`);const a=o.gradient(i);for(const c in o.inputs){if(!(c in a))throw new Error(`Cannot backprop through input ${c}. Available gradients found: ${Object.keys(a)}.`);const u=n(()=>a[c]());if(u.dtype!=="float32")throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input ${c} must have 'float32' dtype, but has '${u.dtype}'`);const h=o.inputs[c];if(!Ft(u.shape,h.shape))throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input '${c}' has shape '${u.shape}', which does not match the shape of the input '${h.shape}'`);if(e[h.id]==null)e[h.id]=u;else{const l=e[h.id];e[h.id]=r(l,u),l.dispose()}}}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const hs=20,ve=3,Kn=7;function Ll(e,t,n,r){const s=ke(t),o=Wl(e,t,n,s),i=t.length,a=sn(e,t,n,s,o),c=["Tensor"];return r&&(c.push(`  dtype: ${n}`),c.push(`  rank: ${i}`),c.push(`  shape: [${t}]`),c.push("  values:")),c.push(a.map(u=>"    "+u).join(`
`)),c.join(`
`)}function Wl(e,t,n,r){const s=G(t),o=r[r.length-1],i=new Array(o).fill(0),a=t.length,c=n==="complex64"?Te(e):e;if(a>1)for(let u=0;u<s/o;u++){const h=u*o;for(let l=0;l<o;l++)i[l]=Math.max(i[l],Se(c[h+l],0,n).length)}return i}function Se(e,t,n){let r;return Array.isArray(e)?r=`${parseFloat(e[0].toFixed(Kn))} + ${parseFloat(e[1].toFixed(Kn))}j`:Lt(e)?r=`'${e}'`:n==="bool"?r=Ua(e):r=parseFloat(e.toFixed(Kn)).toString(),Ie(r,t)}function Ua(e){return e===0?"false":"true"}function sn(e,t,n,r,s,o=!0){const i=n==="complex64"?2:1,a=t[0],c=t.length;if(c===0){if(n==="complex64"){const $=Te(e);return[Se($[0],0,n)]}return n==="bool"?[Ua(e[0])]:[e[0].toString()]}if(c===1){if(a>hs){const E=ve*i;let v=Array.from(e.slice(0,E)),B=Array.from(e.slice((a-ve)*i,a*i));return n==="complex64"&&(v=Te(v),B=Te(B)),["["+v.map((S,_)=>Se(S,s[_],n)).join(", ")+", ..., "+B.map((S,_)=>Se(S,s[a-ve+_],n)).join(", ")+"]"]}return["["+(n==="complex64"?Te(e):Array.from(e)).map((E,v)=>Se(E,s[v],n)).join(", ")+"]"]}const u=t.slice(1),h=r.slice(1),l=r[0]*i,f=[];if(a>hs){for(let $=0;$<ve;$++){const E=$*l,v=E+l;f.push(...sn(e.slice(E,v),u,n,h,s,!1))}f.push("...");for(let $=a-ve;$<a;$++){const E=$*l,v=E+l;f.push(...sn(e.slice(E,v),u,n,h,s,$===a-1))}}else for(let $=0;$<a;$++){const E=$*l,v=E+l;f.push(...sn(e.slice(E,v),u,n,h,s,$===a-1))}const g=c===2?",":"";f[0]="["+(a>0?f[0]+g:"");for(let $=1;$<f.length-1;$++)f[$]=" "+f[$]+g;let y=`,
`;for(let $=2;$<c;$++)y+=`
`;return f[f.length-1]=" "+f[f.length-1]+"]"+(o?"":y),f}function Te(e){const t=[];for(let n=0;n<e.length;n+=2)t.push([e[n],e[n+1]]);return t}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */class $n{constructor(t,n,r){if(this.dtype=n,this.shape=t.slice(),this.size=G(t),r!=null){const s=r.length;p(s===this.size,()=>`Length of values '${s}' does not match the size inferred by the shape '${this.size}'.`)}if(n==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=r||kr(n,this.size),this.strides=ke(t)}set(t,...n){n.length===0&&(n=[0]),p(n.length===this.rank,()=>`The number of provided coordinates (${n.length}) must match the rank (${this.rank})`);const r=this.locToIndex(n);this.values[r]=t}get(...t){t.length===0&&(t=[0]);let n=0;for(const s of t){if(s<0||s>=this.shape[n]){const o=`Requested out of range element at ${t}.   Buffer shape=${this.shape}`;throw new Error(o)}n++}let r=t[t.length-1];for(let s=0;s<t.length-1;++s)r+=this.strides[s]*t[s];return this.values[r]}locToIndex(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];let n=t[t.length-1];for(let r=0;r<t.length-1;++r)n+=this.strides[r]*t[r];return n}indexToLoc(t){if(this.rank===0)return[];if(this.rank===1)return[t];const n=new Array(this.shape.length);for(let r=0;r<n.length-1;++r)n[r]=Math.floor(t/this.strides[r]),t-=n[r]*this.strides[r];return n[n.length-1]=t,n}get rank(){return this.shape.length}toTensor(){return xt().makeTensor(this.values,this.shape,this.dtype)}}let xt=null,ue=null;function ql(e){xt=e}function Ul(e){ue=e}class et{constructor(t,n,r,s){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=n||"float32",this.size=G(t),this.strides=ke(t),this.dataId=r,this.id=s,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const t=await this.data();return ue.buffer(this.shape,this.dtype,t)}bufferSync(){return ue.buffer(this.shape,this.dtype,this.dataSync())}async array(){const t=await this.data();return fe(this.shape,t,this.dtype==="complex64")}arraySync(){return fe(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();const t=xt().read(this.dataId);if(this.dtype==="string"){const n=await t;try{return n.map(r=>yn(r))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),xt().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();const t=xt().readSync(this.dataId);if(this.dtype==="string")try{return t.map(n=>yn(n))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();const t=await xt().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),xt().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return ue.print(this,t)}clone(){return this.throwIfDisposed(),ue.clone(this)}toString(t=!1){const n=this.dataSync();return Ll(n,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),ue.cast(this,t)}variable(t=!0,n,r){return this.throwIfDisposed(),xt().makeVariable(this,t,n,r)}}Object.defineProperty(et,Symbol.hasInstance,{value:e=>!!e&&e.data!=null&&e.dataSync!=null&&e.throwIfDisposed!=null});function Ga(){return Sr("Tensor",()=>et)}Ga();class Be extends et{constructor(t,n,r,s){super(t.shape,t.dtype,t.dataId,s),this.trainable=n,this.name=r}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!Ft(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);xt().disposeTensor(this),this.dataId=t.dataId,xt().incRef(this,null)}dispose(){xt().disposeVariable(this),this.isDisposedInternal=!0}}Object.defineProperty(Be,Symbol.hasInstance,{value:e=>e instanceof et&&e.assign!=null&&e.assign instanceof Function});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */var rr;(function(e){e.R0="R0",e.R1="R1",e.R2="R2",e.R3="R3",e.R4="R4",e.R5="R5",e.R6="R6"})(rr||(rr={}));var sr;(function(e){e.float32="float32",e.int32="int32",e.bool="int32",e.complex64="complex64"})(sr||(sr={}));var or;(function(e){e.float32="float32",e.int32="int32",e.bool="bool",e.complex64="complex64"})(or||(or={}));var ir;(function(e){e.float32="float32",e.int32="float32",e.bool="float32",e.complex64="complex64"})(ir||(ir={}));var ar;(function(e){e.float32="complex64",e.int32="complex64",e.bool="complex64",e.complex64="complex64"})(ar||(ar={}));const Gl={float32:ir,int32:sr,bool:or,complex64:ar};function An(e,t){if(e==="string"||t==="string"){if(e==="string"&&t==="string")return"string";throw new Error(`Can not upcast ${e} with ${t}`)}return Gl[e][t]}function zl(e){return An(e,"int32")}function za(e){return e!=null&&typeof e=="object"&&"texture"in e&&e.texture instanceof WebGLTexture}function Ka(e){return typeof GPUBuffer<"u"&&e!=null&&typeof e=="object"&&"buffer"in e&&e.buffer instanceof GPUBuffer}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function J(e,t){if(e.dtype===t.dtype)return[e,t];const n=An(e.dtype,t.dtype);return[e.cast(n),t.cast(n)]}function ja(e,t){p(e.dtype===t.dtype,()=>`The dtypes of the first(${e.dtype}) and second(${t.dtype}) input must match`)}function Kl(e,t){return t.some(n=>n.id===e.id)}function Mr(e){const t=[];return Va(e,t,new Set),t}function Va(e,t,n){if(e==null)return;if(e instanceof et){t.push(e);return}if(!jl(e))return;const r=e;for(const s in r){const o=r[s];n.has(o)||(n.add(o),Va(o,t,n))}}function jl(e){return Array.isArray(e)||typeof e=="object"}const Vl=Object.freeze(Object.defineProperty({__proto__:null,assertTypesMatch:ja,getTensorsInContainer:Mr,isTensorInList:Kl,makeTypesMatch:J},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function jn(e){return e.kernelName!=null}class fs{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(t=>t.name)))}}}dispose(){for(const t in this.registeredVariables)this.registeredVariables[t].dispose()}}class $e{constructor(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new fs}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;const t=this.getSortedBackends();for(let n=0;n<t.length;n++){const r=t[n];if(await this.initializeBackend(r).success){await this.setBackend(r);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){const{name:t,asyncInit:n}=this.initializeBackendsAndReturnBest();if(n)throw new Error(`The highest priority backend '${t}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(t)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(t){if(!(t in this.registry))if(t in this.registryFactory){const{asyncInit:n}=this.initializeBackend(t);if(n)return null}else return null;return this.registry[t]}findBackendFactory(t){return t in this.registryFactory?this.registryFactory[t].factory:null}registerBackend(t,n,r=1){return t in this.registryFactory?(Pt(`${t} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[t]={factory:n,priority:r},!0)}async setBackend(t){if(this.registryFactory[t]==null)throw new Error(`Backend name '${t}' not found in registry`);if(this.backendName=t,this.registry[t]==null){this.backendInstance=null;const{success:n,asyncInit:r}=this.initializeBackend(t);if(!(r?await n:n))return!1}return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new Bl(this.backendInstance),!0}setupRegisteredKernels(){wn(this.backendName).forEach(n=>{n.setupFunc!=null&&n.setupFunc(this.backendInstance)})}disposeRegisteredKernels(t){wn(t).forEach(r=>{r.disposeFunc!=null&&r.disposeFunc(this.registry[t])})}initializeBackend(t){const n=this.registryFactory[t];if(n==null)throw new Error(`Cannot initialize backend ${t}, no registration found.`);try{const r=n.factory();if(r&&!(r instanceof Fs)&&typeof r.then=="function"){const s=++this.pendingBackendInitId,o=r.then(i=>s<this.pendingBackendInitId?!1:(this.registry[t]=i,this.pendingBackendInit=null,!0)).catch(i=>(s<this.pendingBackendInitId||(this.pendingBackendInit=null,Pt(`Initialization of backend ${t} failed`),Pt(i.stack||i.message)),!1));return this.pendingBackendInit=o,{success:o,asyncInit:!0}}else return this.registry[t]=r,{success:!0,asyncInit:!1}}catch(r){return Pt(`Initialization of backend ${t} failed`),Pt(r.stack||r.message),{success:!1,asyncInit:!1}}}removeBackend(t){if(!(t in this.registryFactory))throw new Error(`${t} backend not found in registry`);this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((t,n)=>this.registryFactory[n].priority-this.registryFactory[t].priority)}initializeBackendsAndReturnBest(){const t=this.getSortedBackends();for(let n=0;n<t.length;n++){const r=t[n],{success:s,asyncInit:o}=this.initializeBackend(r);if(o||s)return{name:r,asyncInit:o}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(t,n){const r=this.state.tensorInfo.get(n),s=r.backend,o=this.readSync(n),i=s.refCount(n);s.disposeData(n,!0),r.backend=t,t.move(n,o,r.shape,r.dtype,i),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(t,n){let r=null;if(n==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");n=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof n!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=t}let s;return this.scopedRun(()=>this.startScope(r),()=>this.endScope(s),()=>(s=n(),s instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),s))}scopedRun(t,n,r){t();try{const s=r();return n(),s}catch(s){throw n(),s}}nextTensorId(){return $e.nextTensorId++}nextVariableId(){return $e.nextVariableId++}clone(t){const n=w.runKernel(Ar,{x:t}),r={x:t},s=i=>({x:()=>{const a="float32",c={x:i},u={dtype:a};return w.runKernel(Ir,c,u)}}),o=[];return this.addTapeNode(this.state.activeScope.name,r,[n],s,o,{}),n}runKernel(t,n,r){if(this.backendName==null&&this.backend,!(Me(t,this.backendName)!=null))throw new Error(`Kernel '${t}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:t,inputs:n,attrs:r})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(t,n,r){const s=this.backend.numDataIds();let o=0;r.forEach(c=>{o+=c.dtype==="complex64"?3:1});const i=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],a=s-n-o-i;if(a>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${a} data ids) after running '${t}'`)}runKernelFunc(t){let n,r=[];const s=this.isTapeOn(),o=this.state.numBytes,i=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let a;this.backendName==null&&this.backend;let c;const u=jn(t)?t.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(jn(t)){const{kernelName:y,inputs:$,attrs:E}=t;this.backendName==null&&this.backend;const v=Me(y,this.backendName);p(v!=null,()=>`Cannot find registered kernel '${y}' for backend '${this.backendName}'`),a=()=>{const B=this.backend.numDataIds();c=v.kernelFunc({inputs:$,attrs:E,backend:this.backend});const S=Array.isArray(c)?c:[c];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(y,B,S);const _=S.map(A=>A.rank!=null?A:this.makeTensorFromTensorInfo(A));if(s){const A=this.getTensorsForGradient(y,$,_);r=this.saveTensorsForBackwardMode(A)}return _}}else{const{forwardFunc:y}=t,$=E=>{s&&(r=E.map(v=>this.keep(this.clone(v))))};a=()=>{const E=this.backend.numDataIds();c=this.tidy(()=>y(this.backend,$));const v=Array.isArray(c)?c:[c];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(u,E,v),v}}const{inputs:h,attrs:l}=t,f=jn(t)?null:t.backwardsFunc;let g;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?n=a():(g=this.profiler.profileKernel(u,h,()=>a()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(g),n=g.outputs)}),s&&this.addTapeNode(u,h,n,f,r,l),this.state.profiling&&this.state.activeProfile.kernels.push({name:u,bytesAdded:this.state.numBytes-o,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-i,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(h).map(y=>h[y]!=null?h[y].shape:null),outputShapes:n.map(y=>y.shape),kernelTimeMs:g.timeMs,extraInfo:g.extraInfo}),Array.isArray(c)?n:n[0]}saveTensorsForBackwardMode(t){return t.map(r=>this.keep(this.clone(r)))}getTensorsForGradient(t,n,r){const s=er(t);if(s!=null){const o=s.inputsToSave||[],i=s.outputsToSave||[];let a;s.saveAllInputs?(p(Array.isArray(n),()=>"saveAllInputs is true, expected inputs to be an array."),a=Object.keys(n).map(u=>n[u])):a=o.map(u=>n[u]);const c=r.filter((u,h)=>i[h]);return a.concat(c)}return[]}makeTensor(t,n,r,s){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");r=r||"float32",s=s||this.backend;let o=t;r==="string"&&Lt(t[0])&&(o=t.map(c=>He(c)));const i=s.write(o,n,r),a=new et(n,r,i,this.nextTensorId());if(this.trackTensor(a,s),r==="string"){const c=this.state.tensorInfo.get(i),u=Ws(o);this.state.numBytes+=u-c.bytes,c.bytes=u}return a}makeTensorFromDataId(t,n,r,s){r=r||"float32";const o={dataId:t,shape:n,dtype:r};return this.makeTensorFromTensorInfo(o,s)}makeTensorFromTensorInfo(t,n){const{dataId:r,shape:s,dtype:o}=t,i=new et(s,o,r,this.nextTensorId());return this.trackTensor(i,n),i}makeVariable(t,n=!0,r,s){r=r||this.nextVariableId().toString(),s!=null&&s!==t.dtype&&(t=t.cast(s));const o=new Be(t,n,r,this.nextTensorId());if(this.state.registeredVariables[o.name]!=null)throw new Error(`Variable with name ${o.name} was already registered`);return this.state.registeredVariables[o.name]=o,this.incRef(o,this.backend),o}trackTensor(t,n){this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++;let r=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(r=t.size*mn(t.dtype)),this.state.numBytes+=r,this.state.tensorInfo.has(t.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(t.dataId,{backend:n||this.backend,dtype:t.dtype,shape:t.shape,bytes:r})),t instanceof Be||this.track(t)}incRef(t,n){this.trackTensor(t,n),this.backend.incRef(t.dataId)}removeDataId(t,n){this.state.tensorInfo.has(t)&&this.state.tensorInfo.get(t).backend===n&&(this.state.tensorInfo.delete(t),this.state.numDataBuffers--)}disposeTensor(t){if(!this.state.tensorInfo.has(t.dataId))return;const n=this.state.tensorInfo.get(t.dataId);if(this.state.numTensors--,t.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=n.bytes),t.dtype!=="complex64"&&t.dtype!=="string"){const r=t.size*mn(t.dtype);this.state.numBytes-=r}n.backend.disposeData(t.dataId)&&this.removeDataId(t.dataId,n.backend)}disposeVariables(){for(const t in this.state.registeredVariables){const n=this.state.registeredVariables[t];this.disposeVariable(n)}}disposeVariable(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]}memory(){const t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t}async profile(t){this.state.profiling=!0;const n=this.state.numBytes,r=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(s=>s.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-n,this.state.activeProfile.newTensors=this.state.numTensors-r;for(const s of this.state.activeProfile.kernels)s.kernelTimeMs=await s.kernelTimeMs,s.extraInfo=await s.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(t,n,r,s,o,i){const a={id:this.state.nextTapeNodeId++,kernelName:t,inputs:n,outputs:r,saved:o},c=er(t);c!=null&&(s=c.gradFunc),s!=null&&(a.gradient=u=>(u=u.map((h,l)=>{if(h==null){const f=r[l],g=Tn(f.size,f.dtype);return this.makeTensor(g,f.shape,f.dtype)}return h}),s(u.length>1?u:u[0],o,i))),this.state.activeTape.push(a)}keep(t){return t.kept=!0,t}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(t){const n={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(n.name=t),this.state.scopeStack.push(n),this.state.activeScope=n}endScope(t){const n=Mr(t),r=new Set(n.map(o=>o.id));for(let o=0;o<this.state.activeScope.track.length;o++){const i=this.state.activeScope.track[o];!i.kept&&!r.has(i.id)&&i.dispose()}const s=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach(o=>{!o.kept&&o.scopeId===s.id&&this.track(o)})}gradients(t,n,r,s=!1){if(p(n.length>0,()=>"gradients() received an empty list of xs."),r!=null&&r.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${r.dtype}'`);const o=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",t));p(o instanceof et,()=>"The result y returned by f() must be a tensor.");const i=Pl(this.state.activeTape,n,o);if(!s&&i.length===0&&n.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{const a={};a[o.id]=r??Hl(o.shape),Ol(a,i,u=>this.tidy(u),Xl);const c=n.map(u=>a[u.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(u=>{for(const h of u.saved)h.dispose()}),this.state.activeTape=null),{value:o,grads:c}})}customGrad(t){return p(Gt(t),()=>"The f passed in customGrad(f) must be a function."),(...n)=>{p(n.every(a=>a instanceof et),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let r;const s={};n.forEach((a,c)=>{s[c]=a});const o=(a,c)=>(r=t(...n,c),p(r.value instanceof et,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),p(Gt(r.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),r.value),i=(a,c)=>{const u=r.gradFunc(a,c),h=Array.isArray(u)?u:[u];p(h.length===n.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),p(h.every(f=>f instanceof et),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");const l={};return h.forEach((f,g)=>{l[g]=()=>f}),l};return this.runKernelFunc({forwardFunc:o,backwardsFunc:i,inputs:s})}}readSync(t){return this.state.tensorInfo.get(t).backend.readSync(t)}read(t){return this.state.tensorInfo.get(t).backend.read(t)}readToGPU(t,n){return this.state.tensorInfo.get(t).backend.readToGPU(t,n)}async time(t){const n=Fe(),r=await this.backend.time(t);return r.wallMs=Fe()-n,r}track(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new fs;for(const t in this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}$e.nextTensorId=0;$e.nextVariableId=0;function Hl(e){const t=xr(G(e),"float32");return w.makeTensor(t,e,"float32")}function Ha(){const e=Ks();if(e._tfengine==null){const t=new zs(e);e._tfengine=new $e(t)}return Xu(e._tfengine.ENV),ql(()=>e._tfengine),e._tfengine}const w=Ha();function Xl(e,t){const n={a:e,b:t};return w.runKernel(Tr,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function _t(e,t){let n=e;if(it(e))return t==="string"?[]:[e.length];if(za(e)){const s=e.channels||"RGBA";return[e.height,e.width*s.length]}else if(Ka(e))return[e.buffer.size/(t==null?4:mn(t))];if(!Array.isArray(e))return[];const r=[];for(;Array.isArray(n)||it(n)&&t!=="string";)r.push(n.length),n=n[0];return Array.isArray(e)&&L().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Xa(e,r,[]),r}function Xa(e,t,n){if(n=n||[],!Array.isArray(e)&&!it(e)){p(t.length===0,()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`);return}p(t.length>0,()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${e.length} elements`),p(e.length===t[0],()=>`Element arr[${n.join("][")}] should have ${t[0]} elements, but has ${e.length} elements`);const r=t.slice(1);for(let s=0;s<e.length;++s)Xa(e[s],r,n.concat(s))}function ds(e,t,n,r){if(e!=="string_or_numeric"){if(e==null)throw new Error("Expected dtype cannot be null.");if(e!=="numeric"&&e!==t||e==="numeric"&&t==="string")throw new Error(`Argument '${n}' passed to '${r}' must be ${e} tensor, but got ${t} tensor`)}}function d(e,t,n,r="numeric"){if(e instanceof Ga())return ds(r,e.dtype,t,n),e;let s=je(e);if(s!=="string"&&["bool","int32","float32"].indexOf(r)>=0&&(s=r),ds(r,s,t,n),e==null||!it(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string"){const c=e==null?"null":e.constructor.name;throw new Error(`Argument '${t}' passed to '${n}' must be a Tensor or TensorLike, but got '${c}'`)}const o=_t(e,s);!it(e)&&!Array.isArray(e)&&(e=[e]);const a=s!=="string"?_n(e,s):zt(e,[],!0);return w.makeTensor(a,o,s)}function Re(e,t,n,r="numeric"){if(!Array.isArray(e))throw new Error(`Argument ${t} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return e.map((o,i)=>d(o,`${t}[${i}]`,n,r))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Vt(e,t,n,r){if(r==null)r=je(e);else if(r==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(Ka(e)||za(e)){if(r!=="float32"&&r!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${r}.`);return w.backend.createTensorFromGPUData(e,t||n,r)}if(!it(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){mt(t);const s=G(t),o=G(n);p(s===o,()=>`Based on the provided shape, [${t}], the tensor should have ${s} values but has ${o}`);for(let i=0;i<n.length;++i){const a=n[i],c=i===n.length-1?a!==G(t.slice(i)):!0;p(n[i]===t[i]||!c,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${t}). `)}}return!it(e)&&!Array.isArray(e)&&(e=[e]),t=t||n,e=r!=="string"?_n(e,r):zt(e,[],!0),w.makeTensor(e,t,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function de(e,t,n){const r=_t(e,n);return Vt(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Et(e,t){ce(e);const n=_t(e,t);if(n.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return Vt(e,null,n,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const Za="__op";function b(e){const t=Object.keys(e);if(t.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let n=t[0];const r=e[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n=n+Za;const s=(...o)=>{w.startScope(n);try{const i=r(...o);return In(i)&&console.error("Cannot return a Promise inside of tidy."),w.endScope(i),i}catch(i){throw w.endScope(null),i}};return Object.defineProperty(s,"name",{value:n,configurable:!0}),s}/**
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
 */function Zl(e,t,n=0){const r=d(e,"x","pad");if(r.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const s={paddings:t,constantValue:n},o={x:r};return w.runKernel(Bi,o,s)}const Xe=b({pad_:Zl});function Yl(e,t,n=0){return p(t.length===4&&t[0].length===2&&t[1].length===2&&t[2].length===2&&t[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Xe(e,t,n)}const Jl=b({pad4d_:Yl});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ql(e,t,n){const r=d(e,"x","slice","string_or_numeric");if(r.rank===0)throw new Error("Slicing scalar is not possible");const s={x:r},o={begin:t,size:n};return w.runKernel(ra,s,o)}const X=b({slice_:Ql});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function th(e,t,n){const r=d(e,"x","slice4d");return p(r.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${r.rank} tensor`),X(r,t,n)}const eh=b({slice4d_:th});/**
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
 */function nh(e){const n={x:d(e,"x","clone","string_or_numeric")};return w.runKernel(Ar,n)}const te=b({clone_:nh});/**
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
 */function rh(e,t=0){p(e.length>=1,()=>"Pass at least one tensor to concat");const n=Re(e,"tensors","concat","string_or_numeric");if(n[0].dtype==="complex64"&&n.forEach(o=>{if(o.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${o.dtype}. `)}),n.length===1)return te(n[0]);const r=n,s={axis:t};return w.runKernel(bo,r,s)}const gt=b({concat_:rh});function sh(e,t){return gt(e,t)}const oh=b({concat4d_:sh});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */function ih(){return typeof navigator<"u"&&navigator!=null}let cr;function ah(e){cr=e}function ch(e){if(cr!==void 0)return cr;if(e||ih()){if(e||(e=navigator),e.product==="ReactNative")return!0;const t=e.userAgent||e.vendor||(typeof window<"u"?window.opera:"");if(!t){const n=e;return n.userAgentData&&n.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))}return!1}function Ya(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}const uh=Object.freeze(Object.defineProperty({__proto__:null,isBrowser:Ya,isMobile:ch,mockIsMobile:ah},Symbol.toStringTag,{value:"Module"}));/**
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
 */const dt=L();dt.registerFlag("DEBUG",()=>!1,e=>{e&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});dt.registerFlag("IS_BROWSER",()=>Ya());dt.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");dt.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));dt.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));dt.registerFlag("PROD",()=>!1);dt.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>dt.getBool("DEBUG"));dt.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);dt.registerFlag("IS_TEST",()=>!1);dt.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>dt.getBool("DEBUG"));dt.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);dt.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);dt.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);/**
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
 */function lh(e,t){const n=d(e,"real","complex"),r=d(t,"imag","complex");ht(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);const s={real:n,imag:r};return w.runKernel(go,s)}const Kt=b({complex_:lh});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const ee={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};class St{static join(t){return new St(t).slice()}constructor(t){if(this.shards=[],this.previousShardIndex=0,t==null||(t instanceof Array||(t=[t]),t=t.map(r=>it(r)?r.buffer:r),t.length===0))return;this.bufferUniformSize=t[0].byteLength;let n=0;for(let r=0;r<t.length;r++){const s=t[r];r!==t.length-1&&s.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);const o=n+s.byteLength;this.shards.push({buffer:s,start:n,end:o}),n=o}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(t=0,n=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(t=isNaN(Number(t))?0:t,n=isNaN(Number(n))?0:n,t=Math.max(0,t),n=Math.min(this.byteLength,n),n<=t)return new ArrayBuffer(0);const r=this.findShardForByte(t);if(r===-1)throw new Error(`Could not find start shard for byte ${t}`);const s=n-t,o=new ArrayBuffer(s),i=new Uint8Array(o);let a=0;for(let c=r;c<this.shards.length;c++){const u=this.shards[c],l=t+a-u.start,f=a,y=Math.min(n,u.end)-u.start,$=new Uint8Array(u.buffer,l,y-l);if(i.set($,f),a+=$.length,n<u.end)break}return o}findShardForByte(t){if(this.shards.length===0||t<0||t>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(t/this.bufferUniformSize),this.previousShardIndex;function n(s){return t<s.start?-1:t>=s.end?1:0}if(n(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;const r=hh(this.shards,n);return r===-1?-1:(this.previousShardIndex=r,this.previousShardIndex)}}function hh(e,t){let n=0,r=e.length;for(;n<=r;){const s=Math.floor((r-n)/2)+n,o=t(e[s]);if(o===0)return s;o<0?r=s:n=s+1}return-1}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function fh(){L().set("PROD",!0)}function dh(){L().set("DEBUG",!0)}function ph(){L().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function gh(e){L().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}function mh(){w.disposeVariables()}function bh(){return w}function wh(){return w.memory()}function yh(e){return w.profile(e)}function nt(e,t){return w.tidy(e,t)}function ft(e){Mr(e).forEach(n=>n.dispose())}function Ja(e){return w.keep(e)}function $h(e){return w.time(e)}function Eh(e){return w.setBackend(e)}function kh(){return w.ready()}function Qa(){return w.backendName}function xh(e){w.removeBackend(e)}function vh(e){return w.findBackend(e)}function Sh(e){return w.findBackendFactory(e)}function Th(e,t,n=1){return w.registerBackend(e,t,n)}function tc(){return w.backend}function Ih(e,t){L().setPlatform(e,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const jt=4;async function _h(e,t){const n=[],r=[],s=Array.isArray(e)?e.map(i=>i.name):Object.keys(e);for(let i=0;i<s.length;++i){const a=s[i],c=Array.isArray(e)?e[i].tensor:e[a];if(c.dtype!=="float32"&&c.dtype!=="int32"&&c.dtype!=="bool"&&c.dtype!=="string"&&c.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${a}': ${c.dtype}`);const u={name:a,shape:c.shape,dtype:c.dtype};if(c.dtype==="string"){const h=new Promise(async l=>{const f=await c.bytes(),g=f.reduce((E,v)=>E+v.length,0)+jt*f.length,y=new Uint8Array(g);let $=0;for(let E=0;E<f.length;E++){const v=f[E],B=new Uint8Array(new Uint32Array([v.length]).buffer);y.set(B,$),$+=jt,y.set(v,$),$+=v.length}l(y)});r.push(h)}else r.push(c.data());t!=null&&(u.group=t),n.push(u)}const o=await Promise.all(r);return{data:Mh(o),specs:n}}function ec(e,t){const n=new St(e),r={};let s=0;for(const o of t){const i=Ah(o,(a,c)=>n.slice(s+a,s+c));r[o.name]=nc(o,n.slice(s,s+i)),s+=i}return r}function Ah(e,t){const n=G(e.shape);let r;if("quantization"in e){const s=e.quantization;r=ee[s.dtype]}else if(e.dtype==="string"){let s=0;for(let o=0;o<n;o++)s+=jt+new Uint32Array(t(s,s+jt))[0];return s}else r=ee[e.dtype];return n*r}async function Dh(e,t){const n=G(e.shape);let r;if("quantization"in e){const s=e.quantization;r=ee[s.dtype]}else if(e.dtype==="string"){let s=0;for(let o=0;o<n;o++)s+=jt+new Uint32Array(await t(s,s+jt))[0];return s}else r=ee[e.dtype];return n*r}function nc(e,t){const n=e.name,r=e.dtype,s=e.shape,o=G(s);let i,a=0;if("quantization"in e){const c=e.quantization;if(c.dtype==="uint8"||c.dtype==="uint16"){if(!("min"in c&&"scale"in c))throw new Error(`Weight ${e.name} with quantization ${c.dtype} doesn't have corresponding metadata min and scale.`)}else if(c.dtype==="float16"){if(r!=="float32")throw new Error(`Weight ${e.name} is quantized with ${c.dtype} which only supports weights of type float32 not ${r}.`)}else throw new Error(`Weight ${e.name} has unknown quantization dtype ${c.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);const u=ee[c.dtype],h=c.dtype==="uint8"?new Uint8Array(t):new Uint16Array(t);if(r==="float32")if(c.dtype==="uint8"||c.dtype==="uint16"){i=new Float32Array(h.length);for(let l=0;l<h.length;l++){const f=h[l];i[l]=f*c.scale+c.min}}else if(c.dtype==="float16")i=Lh()(h);else throw new Error(`Unsupported quantization type ${c.dtype} for weight type float32.`);else if(r==="int32"){if(c.dtype!=="uint8"&&c.dtype!=="uint16")throw new Error(`Unsupported quantization type ${c.dtype} for weight type int32.`);i=new Int32Array(h.length);for(let l=0;l<h.length;l++){const f=h[l];i[l]=Math.round(f*c.scale+c.min)}}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);a+=o*u}else if(r==="string"){const c=G(e.shape);i=[];for(let u=0;u<c;u++){const h=new Uint32Array(t.slice(a,a+jt))[0];a+=jt;const l=new Uint8Array(t.slice(a,a+h));i.push(l),a+=h}}else{const c=ee[r];if(r==="float32")i=new Float32Array(t);else if(r==="int32")i=new Int32Array(t);else if(r==="bool")i=new Uint8Array(t);else if(r==="complex64"){i=new Float32Array(t);const u=new Float32Array(i.length/2),h=new Float32Array(i.length/2);for(let y=0;y<u.length;y++)u[y]=i[y*2],h[y]=i[y*2+1];const l=de(u,s,"float32"),f=de(h,s,"float32"),g=Kt(l,f);return l.dispose(),f.dispose(),g}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);a+=o*c}return de(i,s,r)}async function ps(e,t,n){let r=new Uint8Array(t);for(;r.byteLength<n;){const{done:s,value:o}=await e.read();if(s&&o==null){const a=n-r.byteLength;throw new Error(`Reader is done but ${a} bytes are still expected`)}const i=new Uint8Array(r.length+o.byteLength);i.set(r,0),i.set(new Uint8Array(o),r.length),r=i}return r.buffer}async function Nh(e,t){const n={},r=e.getReader();let s=new ArrayBuffer(0);for(const o of t){const i=await Dh(o,async(u,h)=>(s=await ps(r,s,h),s.slice(u,h)));s=await ps(r,s,i);const a=s.slice(0,i);s=s.slice(i);const c=nc(o,a);if(n[o.name]=c,Qa()==="webgpu"){const u=tc();"uploadToGPU"in u&&G(c.shape)>=L().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&u.uploadToGPU(c.dataId)}}return n}function Mh(e){if(e===null)throw new Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0;const n=[];e.forEach(o=>{if(t+=o.byteLength,n.push(o.byteLength===o.buffer.byteLength?o:new o.constructor(o)),!(o instanceof Float32Array||o instanceof Int32Array||o instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${o.constructor.name}`)});const r=new Uint8Array(t);let s=0;return n.forEach(o=>{r.set(new Uint8Array(o.buffer),s),s+=o.byteLength}),r.buffer}const Fr=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function gs(e){return Fr?Buffer.byteLength(e,"utf8"):new Blob([e]).size}function Fh(e){if(Fr)return Buffer.from(e).toString("base64");const t=new Uint8Array(e);let n="";for(let r=0,s=t.length;r<s;r++)n+=String.fromCharCode(t[r]);return btoa(n)}function Bh(e){if(Fr){const r=Buffer.from(e,"base64");return r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;++r)n.set([t.charCodeAt(r)],r);return n.buffer}function Rh(e){return St.join(e)}function ms(e){for(e=e.trim();e.endsWith("/");)e=e.slice(0,e.length-1);const n=e.split("/");return n[n.length-1]}function rc(e,t){const n={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:t};return e.signature!=null&&(n.signature=e.signature),e.userDefinedMetadata!=null&&(n.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(n.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(n.initializerSignature=e.initializerSignature),e.trainingConfig!=null&&(n.trainingConfig=e.trainingConfig),n}function sc(e,t,n){const r={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};if(e.trainingConfig!=null&&(r.trainingConfig=e.trainingConfig),e.weightsManifest!=null){if(!t)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");r.weightSpecs=t,r.weightData=n}return e.signature!=null&&(r.signature=e.signature),e.userDefinedMetadata!=null&&(r.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(r.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(r.initializerSignature=e.initializerSignature),r}async function Br(e,t){let n,r;return e.weightsManifest!=null&&([n,r]=await t(e.weightsManifest)),sc(e,n,r)}function Ze(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:e.modelTopology==null?0:gs(JSON.stringify(e.modelTopology)),weightSpecsBytes:e.weightSpecs==null?0:gs(JSON.stringify(e.weightSpecs)),weightDataBytes:e.weightData==null?0:new St(e.weightData).byteLength}}function ur(e){const t=[];for(const n of e)t.push(...n.weights);return t}function Ch(){const e=n=>{let r=n<<13,s=0;for(;(r&8388608)===0;)s-=8388608,r<<=1;return r&=-8388609,s+=947912704,r|s},t=new Uint32Array(2048);t[0]=0;for(let n=1;n<1024;n++)t[n]=e(n);for(let n=1024;n<2048;n++)t[n]=939524096+(n-1024<<13);return t}function Ph(){const e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}function Oh(){const e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}function Lh(){const e=Ch(),t=Ph(),n=Oh();return r=>{const s=new ArrayBuffer(4*r.length),o=new Uint32Array(s);for(let i=0;i<r.length;i++){const a=r[i],c=e[n[a>>10]+(a&1023)]+t[a>>10];o[i]=c}return new Float32Array(s)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class Y{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return Y.instance==null&&(Y.instance=new Y),Y.instance}static registerSaveRouter(t){Y.getInstance().saveRouters.push(t)}static registerLoadRouter(t){Y.getInstance().loadRouters.push(t)}static getSaveHandlers(t){return Y.getHandlers(t,"save")}static getLoadHandlers(t,n){return Y.getHandlers(t,"load",n)}static getHandlers(t,n,r){const s=[];return(n==="load"?Y.getInstance().loadRouters:Y.getInstance().saveRouters).forEach(i=>{const a=i(t,r);a!==null&&s.push(a)}),s}}const Wh=e=>Y.registerSaveRouter(e),qh=e=>Y.registerLoadRouter(e),Uh=e=>Y.getSaveHandlers(e),Gh=(e,t)=>Y.getLoadHandlers(e,t);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const lr="tensorflowjs",hr=1,Jt="models_store",Wt="model_info_store";function oc(){if(!L().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const e=typeof window>"u"?self:window,t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB||e.shimIndexedDB;if(t==null)throw new Error("The current browser does not appear to support IndexedDB.");return t}function fr(e){const t=e.result;t.createObjectStore(Jt,{keyPath:"modelPath"}),t.createObjectStore(Wt,{keyPath:"modelPath"})}class ne{constructor(t){if(this.indexedDB=oc(),t==null||!t)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=t}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,t)}async load(){return this.databaseAction(this.modelPath)}databaseAction(t,n){return new Promise((r,s)=>{const o=this.indexedDB.open(lr,hr);o.onupgradeneeded=()=>fr(o),o.onsuccess=()=>{const i=o.result;if(n==null){const a=i.transaction(Jt,"readonly"),u=a.objectStore(Jt).get(this.modelPath);u.onsuccess=()=>{if(u.result==null)return i.close(),s(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));r(u.result.modelArtifacts)},u.onerror=h=>(i.close(),s(u.error)),a.oncomplete=()=>i.close()}else{n.weightData=St.join(n.weightData);const a=Ze(n),c=i.transaction(Wt,"readwrite");let u=c.objectStore(Wt),h;try{h=u.put({modelPath:this.modelPath,modelArtifactsInfo:a})}catch(f){return s(f)}let l;h.onsuccess=()=>{l=i.transaction(Jt,"readwrite");const f=l.objectStore(Jt);let g;try{g=f.put({modelPath:this.modelPath,modelArtifacts:n,modelArtifactsInfo:a})}catch(y){return s(y)}g.onsuccess=()=>r({modelArtifactsInfo:a}),g.onerror=y=>{u=c.objectStore(Wt);const $=u.delete(this.modelPath);$.onsuccess=()=>(i.close(),s(g.error)),$.onerror=E=>(i.close(),s(g.error))}},h.onerror=f=>(i.close(),s(h.error)),c.oncomplete=()=>{l==null?i.close():l.oncomplete=()=>i.close()}}},o.onerror=i=>s(o.error)})}}ne.URL_SCHEME="indexeddb://";const ic=e=>L().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(ne.URL_SCHEME)?zh(e.slice(ne.URL_SCHEME.length)):null;Y.registerSaveRouter(ic);Y.registerLoadRouter(ic);function zh(e){return new ne(e)}function Kh(e){return e.startsWith(ne.URL_SCHEME)?e.slice(ne.URL_SCHEME.length):e}class jh{constructor(){this.indexedDB=oc()}async listModels(){return new Promise((t,n)=>{const r=this.indexedDB.open(lr,hr);r.onupgradeneeded=()=>fr(r),r.onsuccess=()=>{const s=r.result,o=s.transaction(Wt,"readonly"),a=o.objectStore(Wt).getAll();a.onsuccess=()=>{const c={};for(const u of a.result)c[u.modelPath]=u.modelArtifactsInfo;t(c)},a.onerror=c=>(s.close(),n(a.error)),o.oncomplete=()=>s.close()},r.onerror=s=>n(r.error)})}async removeModel(t){return t=Kh(t),new Promise((n,r)=>{const s=this.indexedDB.open(lr,hr);s.onupgradeneeded=()=>fr(s),s.onsuccess=()=>{const o=s.result,i=o.transaction(Wt,"readwrite"),a=i.objectStore(Wt),c=a.get(t);let u;c.onsuccess=()=>{if(c.result==null)return o.close(),r(new Error(`Cannot find model with path '${t}' in IndexedDB.`));{const h=a.delete(t),l=()=>{u=o.transaction(Jt,"readwrite");const g=u.objectStore(Jt).delete(t);g.onsuccess=()=>n(c.result.modelArtifactsInfo),g.onerror=y=>r(c.error)};h.onsuccess=l,h.onerror=f=>(l(),o.close(),r(c.error))}},c.onerror=h=>(o.close(),r(c.error)),i.oncomplete=()=>{u==null?o.close():u.oncomplete=()=>o.close()}},s.onerror=o=>r(s.error)})}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const Dt="/",le="tensorflowjs_models",ac="info",Vh="model_topology",Hh="weight_specs",Xh="weight_data",Zh="model_metadata";function cc(e){return{info:[le,e,ac].join(Dt),topology:[le,e,Vh].join(Dt),weightSpecs:[le,e,Hh].join(Dt),weightData:[le,e,Xh].join(Dt),modelMetadata:[le,e,Zh].join(Dt)}}function uc(e){for(const t of Object.values(e))window.localStorage.removeItem(t)}function Yh(e){const t=e.split(Dt);if(t.length<3)throw new Error(`Invalid key format: ${e}`);return t.slice(1,t.length-1).join(Dt)}function Jh(e){return e.startsWith(re.URL_SCHEME)?e.slice(re.URL_SCHEME.length):e}class re{constructor(t){if(!L().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,t==null||!t)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=t,this.keys=cc(this.modelPath)}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const n=JSON.stringify(t.modelTopology),r=JSON.stringify(t.weightSpecs),s=Ze(t),o=St.join(t.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(s)),this.LS.setItem(this.keys.topology,n),this.LS.setItem(this.keys.weightSpecs,r),this.LS.setItem(this.keys.weightData,Fh(o));const i={format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,signature:t.signature!=null?t.signature:void 0,userDefinedMetadata:t.userDefinedMetadata!=null?t.userDefinedMetadata:void 0,modelInitializer:t.modelInitializer!=null?t.modelInitializer:void 0,initializerSignature:t.initializerSignature!=null?t.initializerSignature:void 0,trainingConfig:t.trainingConfig!=null?t.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(i)),{modelArtifactsInfo:s}}catch{throw uc(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${s.modelTopologyBytes}, weightSpecsBytes=${s.weightSpecsBytes}, weightDataBytes=${s.weightDataBytes}.`)}}}async load(){const t=JSON.parse(this.LS.getItem(this.keys.info));if(t==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(t.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const n={},r=JSON.parse(this.LS.getItem(this.keys.topology));if(r==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);n.modelTopology=r;const s=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(s==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);n.weightSpecs=s;const o=this.LS.getItem(this.keys.modelMetadata);if(o!=null){const a=JSON.parse(o);n.format=a.format,n.generatedBy=a.generatedBy,n.convertedBy=a.convertedBy,a.signature!=null&&(n.signature=a.signature),a.userDefinedMetadata!=null&&(n.userDefinedMetadata=a.userDefinedMetadata),a.modelInitializer!=null&&(n.modelInitializer=a.modelInitializer),a.initializerSignature!=null&&(n.initializerSignature=a.initializerSignature),a.trainingConfig!=null&&(n.trainingConfig=a.trainingConfig)}const i=this.LS.getItem(this.keys.weightData);if(i==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return n.weightData=Bh(i),n}}re.URL_SCHEME="localstorage://";const lc=e=>L().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(re.URL_SCHEME)?Qh(e.slice(re.URL_SCHEME.length)):null;Y.registerSaveRouter(lc);Y.registerLoadRouter(lc);function Qh(e){return new re(e)}class tf{constructor(){p(L().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),p(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){const t={},n=le+Dt,r=Dt+ac;for(let s=0;s<this.LS.length;++s){const o=this.LS.key(s);if(o.startsWith(n)&&o.endsWith(r)){const i=Yh(o);t[i]=JSON.parse(this.LS.getItem(o))}}return t}async removeModel(t){t=Jh(t);const n=cc(t);if(this.LS.getItem(n.info)==null)throw new Error(`Cannot find model at path '${t}'`);const r=JSON.parse(this.LS.getItem(n.info));return uc(n),r}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const pe="://";class ct{constructor(){this.managers={}}static getInstance(){return ct.instance==null&&(ct.instance=new ct),ct.instance}static registerManager(t,n){p(t!=null,()=>"scheme must not be undefined or null."),t.endsWith(pe)&&(t=t.slice(0,t.indexOf(pe))),p(t.length>0,()=>"scheme must not be an empty string.");const r=ct.getInstance();p(r.managers[t]==null,()=>`A model store manager is already registered for scheme '${t}'.`),r.managers[t]=n}static getManager(t){const n=ct.getInstance().managers[t];if(n==null)throw new Error(`Cannot find model manager for scheme '${t}'`);return n}static getSchemes(){return Object.keys(ct.getInstance().managers)}}function on(e){if(e.indexOf(pe)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${ct.getSchemes().join(",")}`);return{scheme:e.split(pe)[0],path:e.split(pe)[1]}}async function hc(e,t,n=!1){p(e!==t,()=>`Old path and new path are the same: '${e}'`);const r=Y.getLoadHandlers(e);p(r.length>0,()=>`Copying failed because no load handler is found for source URL ${e}.`),p(r.length<2,()=>`Copying failed because more than one (${r.length}) load handlers for source URL ${e}.`);const s=r[0],o=Y.getSaveHandlers(t);p(o.length>0,()=>`Copying failed because no save handler is found for destination URL ${t}.`),p(o.length<2,()=>`Copying failed because more than one (${r.length}) save handlers for destination URL ${t}.`);const i=o[0],a=on(e).scheme,c=on(e).path,u=a===on(e).scheme,h=await s.load();n&&u&&await ct.getManager(a).removeModel(c);const l=await i.save(h);return n&&!u&&await ct.getManager(a).removeModel(c),l.modelArtifactsInfo}async function ef(){const e=ct.getSchemes(),t={};for(const n of e){const r=await ct.getManager(n).listModels();for(const s in r){const o=n+pe+s;t[o]=r[s]}}return t}async function nf(e){const t=on(e);return ct.getManager(t.scheme).removeModel(t.path)}async function rf(e,t){return hc(e,t,!1)}async function sf(e,t){return hc(e,t,!0)}/**
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
 */class of{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(t,n){return fetch(t,n)}now(){return performance.now()}encode(t,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${n}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(t)}decode(t,n){return new TextDecoder(n).decode(t)}setTimeoutCustom(t,n){if(typeof window>"u"||!L().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(t,n);return}this.functionRefs.push(t),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},n),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",r=>{if(r.source===window&&r.data.name===this.messageName){r.stopPropagation();const s=this.functionRefs[r.data.index];s(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(t){return Pa(t)}}if(L().get("IS_BROWSER")){L().setPlatform("browser",new of);try{ct.registerManager(re.URL_SCHEME,new tf)}catch{}try{ct.registerManager(ne.URL_SCHEME,new jh)}catch{}}/**
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
 */const af={importFetch:()=>require("node-fetch")};let Vn;class cf{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(t,n){return L().global.fetch!=null?L().global.fetch(t,n):(Vn==null&&(Vn=af.importFetch()),Vn(t,n))}now(){const t=process.hrtime();return t[0]*1e3+t[1]/1e6}encode(t,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${n}`);return this.textEncoder.encode(t)}decode(t,n){return t.length===0?"":new this.util.TextDecoder(n).decode(t)}isTypedArray(t){return this.util.types.isFloat32Array(t)||this.util.types.isInt32Array(t)||this.util.types.isUint8Array(t)||this.util.types.isUint8ClampedArray(t)}}L().get("IS_NODE")&&!L().get("IS_BROWSER")&&L().setPlatform("node",new cf);/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function Nt(e,t="float32",n){return t=t||"float32",mt(e),new $n(e,t,n)}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function uf(e,t){const n=d(e,"x","cast");if(!Ls(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if(t==="string"&&n.dtype!=="string"||t!=="string"&&n.dtype==="string")throw new Error("Only strings can be casted to strings");const r={x:n},s={dtype:t};return w.runKernel(Ir,r,s)}const H=b({cast_:uf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function fc(e,t=!1){console.log(e.toString(t))}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */Ha();const lf={buffer:Nt,cast:H,clone:te,print:fc};Ul(lf);/**
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
 */function hf(e,t){let n=d(e,"a","add"),r=d(t,"b","add");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Tr,s)}const P=b({add_:hf});/**
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
 */function ff(e,t){let n=d(e,"a","floorDiv"),r=d(t,"b","floorDiv");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Vo,s)}const dc=b({floorDiv_:ff});/**
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
 */function df(e,t){let n=d(e,"a","div"),r=d(t,"b","div");if([n,r]=J(n,r),n.dtype==="int32"&&r.dtype==="int32")return dc(n,r);const s={a:n,b:r},o={};return w.runKernel(Ro,s,o)}const V=b({div_:df});/**
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
 */function pf(e,t){let n=d(e,"a","mul"),r=d(t,"b","mul");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Si,s)}const D=b({mul_:pf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function gf(e){const t=d(e,"x","abs");if(t.dtype==="complex64"){const n={x:t};return w.runKernel(mo,n)}else{const n={x:t};return w.runKernel(js,n)}}const wt=b({abs_:gf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function mf(e){const n={x:d(e,"x","acos")};return w.runKernel(Vs,n)}const bf=b({acos_:mf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function wf(e){const n={x:d(e,"x","acosh")};return w.runKernel(Hs,n)}const yf=b({acosh_:wf});/**
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
 */function $f(e){p(Array.isArray(e),()=>"The argument passed to tf.addN() must be a list of tensors"),p(e.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${e.length}`);const t=e.map((s,o)=>d(s,`tensors${o}`,"addN")),n=t[0];t.forEach(s=>{if(s.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),t.forEach(s=>{if(!Ft(s.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});const r=t;return w.runKernel(Xs,r)}const Ef=b({addN_:$f});/**
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
 */function kf(e,t=null,n=!1){const s={x:d(e,"x","all","bool")},o={axis:t,keepDims:n};return w.runKernel(Zs,s,o)}const xf=b({all_:kf});/**
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
 */function vf(e,t=null,n=!1){const s={x:d(e,"x","any","bool")},o={axis:t,keepDims:n};return w.runKernel(Ys,s,o)}const Sf=b({any_:vf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function Tf(e,t=0){const r={x:d(e,"x","argMax")},s={axis:t};return w.runKernel(Js,r,s)}const If=b({argMax_:Tf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function _f(e,t=0){const r={x:d(e,"x","argMin")},s={axis:t};return w.runKernel(Qs,r,s)}const Af=b({argMin_:_f});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Df(e){const n={x:d(e,"x","asin")};return w.runKernel(to,n)}const Nf=b({asin_:Df});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Mf(e){const n={x:d(e,"x","asinh")};return w.runKernel(eo,n)}const Ff=b({asinh_:Mf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Bf(e){const n={x:d(e,"x","atan")};return w.runKernel(no,n)}const Rf=b({atan_:Bf});/**
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
 */function Cf(e,t){let n=d(e,"a","atan2"),r=d(t,"b","atan2");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(so,s)}const Pf=b({atan2_:Cf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Of(e){const n={x:d(e,"x","atanh")};return w.runKernel(ro,n)}const Lf=b({atanh_:Of});/**
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
 */function Wf(e,t,n,r,s="NHWC",o){const i=e[3],a=[...t,i],c=mc(s);return Ye(e,a,n,o,r,null,null,c)}function pc(e,t,n,r,s,o,i="channelsLast"){const[a,c]=Ce(t);let u;if(i==="channelsLast")u=[a,c,e[3],e[3]];else if(i==="channelsFirst")u=[a,c,e[1],e[1]];else throw new Error(`Unknown dataFormat ${i}`);return Ye(e,u,n,r,s,o,!1,i)}function qf(e,t,n,r,s,o,i="NDHWC"){const[a,c,u]=dr(t);let h,l;if(i==="NDHWC")l="channelsLast",h=[a,c,u,e[4],e[4]];else if(i==="NCDHW")l="channelsFirst",h=[a,c,u,e[1],e[1]];else throw new Error(`Unknown dataFormat ${i}`);return gc(e,h,n,r,s,!1,l,o)}function Ye(e,t,n,r,s,o,i=!1,a="channelsLast"){let[c,u,h,l]=[-1,-1,-1,-1];if(a==="channelsLast")[c,u,h,l]=e;else if(a==="channelsFirst")[c,l,u,h]=e;else throw new Error(`Unknown dataFormat ${a}`);const[f,g,,y]=t,[$,E]=Ce(n),[v,B]=Ce(r),S=ge(f,v),_=ge(g,B),{padInfo:A,outHeight:N,outWidth:R}=zf(s,u,h,$,E,S,_,o,a),M=i?y*l:y;let x;return a==="channelsFirst"?x=[c,M,N,R]:a==="channelsLast"&&(x=[c,N,R,M]),{batchSize:c,dataFormat:a,inHeight:u,inWidth:h,inChannels:l,outHeight:N,outWidth:R,outChannels:M,padInfo:A,strideHeight:$,strideWidth:E,filterHeight:f,filterWidth:g,effectiveFilterHeight:S,effectiveFilterWidth:_,dilationHeight:v,dilationWidth:B,inShape:e,outShape:x,filterShape:t}}function gc(e,t,n,r,s,o=!1,i="channelsLast",a){let[c,u,h,l,f]=[-1,-1,-1,-1,-1];if(i==="channelsLast")[c,u,h,l,f]=e;else if(i==="channelsFirst")[c,f,u,h,l]=e;else throw new Error(`Unknown dataFormat ${i}`);const[g,y,$,,E]=t,[v,B,S]=dr(n),[_,A,N]=dr(r),R=ge(g,_),M=ge(y,A),x=ge($,N),{padInfo:k,outDepth:m,outHeight:I,outWidth:F}=Kf(s,u,h,l,v,B,S,R,M,x,a),C=o?E*f:E;let O;return i==="channelsFirst"?O=[c,C,m,I,F]:i==="channelsLast"&&(O=[c,m,I,F,C]),{batchSize:c,dataFormat:i,inDepth:u,inHeight:h,inWidth:l,inChannels:f,outDepth:m,outHeight:I,outWidth:F,outChannels:C,padInfo:k,strideDepth:v,strideHeight:B,strideWidth:S,filterDepth:g,filterHeight:y,filterWidth:$,effectiveFilterDepth:R,effectiveFilterHeight:M,effectiveFilterWidth:x,dilationDepth:_,dilationHeight:A,dilationWidth:N,inShape:e,outShape:O,filterShape:t}}function Uf(e,t,n,r,s){r==null&&(r=Rr(e,t,n));const o=e[0],i=e[1],a=Pe((o-t+2*r)/n+1,s),c=Pe((i-t+2*r)/n+1,s);return[a,c]}function Gf(e,t,n,r,s,o){s==null&&(s=Rr(e,t[0],r[0]));const i=[0,0,0,n];for(let a=0;a<3;a++)e[a]+2*s>=t[a]&&(i[a]=Pe((e[a]-t[a]+2*s)/r[a]+1,o));return i}function Rr(e,t,n,r=1){const s=ge(t,r);return Math.floor((e[0]*(n-1)-n+s)/2)}function Ce(e){return typeof e=="number"?[e,e,e]:e.length===2?[e[0],e[1],1]:e}function dr(e){return typeof e=="number"?[e,e,e]:e}function ge(e,t){return t<=1?e:e+(e-1)*(t-1)}function zf(e,t,n,r,s,o,i,a,c){let u,h,l;if(typeof e=="number"){u={top:e,bottom:e,left:e,right:e,type:e===0?"VALID":"NUMBER"};const g=Uf([t,n],o,r,e,a);h=g[0],l=g[1]}else if(e==="same"){h=Math.ceil(t/r),l=Math.ceil(n/s);const f=Math.max(0,(h-1)*r+o-t),g=Math.max(0,(l-1)*s+i-n),y=Math.floor(f/2),$=f-y,E=Math.floor(g/2),v=g-E;u={top:y,bottom:$,left:E,right:v,type:"SAME"}}else if(e==="valid")u={top:0,bottom:0,left:0,right:0,type:"VALID"},h=Math.ceil((t-o+1)/r),l=Math.ceil((n-i+1)/s);else if(typeof e=="object"){const f=c==="channelsLast"?e[1][0]:e[2][0],g=c==="channelsLast"?e[1][1]:e[2][1],y=c==="channelsLast"?e[2][0]:e[3][0],$=c==="channelsLast"?e[2][1]:e[3][1];u={top:f,bottom:g,left:y,right:$,type:f===0&&g===0&&y===0&&$===0?"VALID":"EXPLICIT"},h=Pe((t-o+f+g)/r+1,a),l=Pe((n-i+y+$)/s+1,a)}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:u,outHeight:h,outWidth:l}}function Kf(e,t,n,r,s,o,i,a,c,u,h){let l,f,g,y;if(e==="valid"&&(e=0),typeof e=="number"){l={top:e,bottom:e,left:e,right:e,front:e,back:e,type:e===0?"VALID":"NUMBER"};const E=Gf([t,n,r,1],[a,c,u],1,[s,o,i],e,h);f=E[0],g=E[1],y=E[2]}else if(e==="same"){f=Math.ceil(t/s),g=Math.ceil(n/o),y=Math.ceil(r/i);const $=(f-1)*s+a-t,E=(g-1)*o+c-n,v=(y-1)*i+u-r,B=Math.floor($/2),S=$-B,_=Math.floor(E/2),A=E-_,N=Math.floor(v/2),R=v-N;l={top:_,bottom:A,left:N,right:R,front:B,back:S,type:"SAME"}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:l,outDepth:f,outHeight:g,outWidth:y}}function Pe(e,t){if(!t)return Math.trunc(e);switch(t){case"round":return Math.round(e);case"ceil":return Math.ceil(e);case"floor":return Math.floor(e);default:throw new Error(`Unknown roundingMode ${t}`)}}function Oe(e){const[t,n,r]=Ce(e);return t===1&&n===1&&r===1}function Bt(e,t){return Oe(e)||Oe(t)}function se(e){return Ce(e).every(t=>t>0)}function mc(e){if(e==="NHWC")return"channelsLast";if(e==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${e}`)}function kt(e,t,n){if(n!=null){if(typeof t=="string")throw Error(`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);if(typeof t=="number")p(we(t),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);else if(typeof t=="object")t.forEach(r=>{r.forEach(s=>{p(we(s),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${s}.`)})});else throw Error(`Error in ${e}: Unknown padding parameter: ${t}`)}}/**
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
 */function jf(e,t){const r={x:d(e,"x","reshape","string_or_numeric")},s={shape:t};return w.runKernel(Ki,r,s)}const T=b({reshape_:jf});/**
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
 */function Vf(e,t,n,r,s){const o=d(e,"x","avgPool","float32"),i=1;p(Bt(n,i),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${i}'`);let a=o,c=!1;o.rank===3&&(c=!0,a=T(o,[1,o.shape[0],o.shape[1],o.shape[2]])),p(a.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${a.rank}.`),kt("avgPool",r,s);const u={x:a},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s};let l=w.runKernel(oo,u,h);return l=H(l,o.dtype),c?T(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const bc=b({avgPool_:Vf});/**
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
 */function Hf(e,t,n,r,s,o="NDHWC"){const i=d(e,"x","avgPool3d","float32");let a=i,c=!1;i.rank===4&&(c=!0,a=T(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),p(a.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${a.rank}.`),p(o==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),p(typeof n=="number"&&n>0||Array.isArray(n)&&n[0]>0&&n[1]>0&&n[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${n}'`),kt("avgPool3d",r,s);const u={x:a},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:o};let l=w.runKernel(io,u,h);return l=H(l,a.dtype),c?T(l,[l.shape[1],l.shape[2],l.shape[3],l.shape[4]]):l}const Xf=b({avgPool3d_:Hf});/**
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
 */function Zf(e,t,n=!1,r=!1){let s=d(e,"a","matMul"),o=d(t,"b","matMul");[s,o]=J(s,o);const i={a:s,b:o},a={transposeA:n,transposeB:r};return w.runKernel(ao,i,a)}const U=b({matMul_:Zf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Yf(e){const n={x:d(e,"x","sigmoid","float32")};return w.runKernel(aa,n)}const me=b({sigmoid_:Yf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Jf(e){const n={x:d(e,"x","tanh","float32")};return w.runKernel(Ia,n)}const pr=b({tanh_:Jf});/**
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
 */function Qf(e,t,n,r,s,o){const i=d(e,"forgetBias","basicLSTMCell"),a=d(t,"lstmKernel","basicLSTMCell"),c=d(n,"lstmBias","basicLSTMCell"),u=d(r,"data","basicLSTMCell"),h=d(s,"c","basicLSTMCell"),l=d(o,"h","basicLSTMCell"),f=gt([u,l],1),g=U(f,a),y=P(g,c),$=y.shape[0],E=y.shape[1]/4,v=[$,E],B=X(y,[0,0],v),S=X(y,[0,E],v),_=X(y,[0,E*2],v),A=X(y,[0,E*3],v),N=P(D(me(B),pr(S)),D(h,me(P(i,_)))),R=D(pr(N),me(A));return[N,R]}const td=b({basicLSTMCell_:Qf});/**
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
 */function ed(e,t,n){const r=d(e,"x","batchToSpaceND"),s=t.reduce((a,c)=>a*c);p(r.rank>=1+t.length,()=>`input rank is ${r.rank} but should be > than blockShape.length ${t.length}`),p(n.length===t.length,()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${t.length}`),p(r.shape[0]%s===0,()=>`input tensor batch is ${r.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${s}`);const o={x:r},i={blockShape:t,crops:n};return w.runKernel(co,o,i)}const wc=b({batchToSpaceND_:ed});function nd(e){let t;return e.rank===0||e.rank===1?t=T(e,[1,1,1,e.size]):e.rank===2?t=T(e,[1,1,e.shape[0],e.shape[1]]):e.rank===3?t=T(e,[1,e.shape[0],e.shape[1],e.shape[2]]):t=e,t}/**
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
 */function rd(e,t,n,r,s,o){o==null&&(o=.001);const i=d(e,"x","batchNorm"),a=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;r!=null&&(h=d(r,"offset","batchNorm")),p(a.rank===c.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),p(h==null||a.rank===h.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),p(u==null||a.rank===u.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");const f={x:nd(i),scale:u,offset:h,mean:a,variance:c},g={varianceEpsilon:o},y=w.runKernel(Ho,f,g);return T(y,i.shape)}const Dn=b({batchNorm_:rd});function sd(e,t,n,r,s,o){const i=d(e,"x","batchNorm"),a=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),p(i.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${i.rank}.`),p(a.rank===2||a.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${a.rank}.`),p(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${c.rank}.`),u!=null&&p(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${u.rank}.`),h!=null&&p(h.rank===2||h.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${h.rank}.`),Dn(i,a,c,h,u,o)}const od=b({batchNorm2d_:sd});function id(e,t,n,r,s,o){const i=d(e,"x","batchNorm"),a=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),p(i.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${i.rank}.`),p(a.rank===3||a.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${a.rank}.`),p(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${c.rank}.`),u!=null&&p(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${u.rank}.`),h!=null&&p(h.rank===3||h.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${h.rank}.`),Dn(i,a,c,h,u,o)}const ad=b({batchNorm3d_:id});function cd(e,t,n,r,s,o){const i=d(e,"x","batchNorm"),a=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),p(i.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${i.rank}.`),p(a.rank===4||a.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${a.rank}.`),p(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${c.rank}.`),u!=null&&p(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${u.rank}.`),h!=null&&p(h.rank===4||h.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${h.rank}.`),Dn(i,a,c,h,u,o)}const ud=b({batchNorm4d_:cd});/**
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
 */function ld(e,t,n){const r=d(e,"x","bincount"),s=d(t,"weights","bincount");p(r.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${r.dtype}`),p(n>=0,()=>`size must be non-negative, but got ${n}.`),p(s.size===r.size||s.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${r.shape}, weights shape: ${s.shape}.`);const o={x:r,weights:s},i={size:n};return w.runKernel(uo,o,i)}const yc=b({bincount_:ld});/**
 * @license
 * Copyright 2023 Google LLC.
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
 */function hd(e,t){const n=d(e,"x","bitwiseAnd"),r=d(t,"y","bitwiseAnd");if(!Ft(n.shape,r.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${n.shape}, y: ${r.shape}`);if(n.dtype!=="int32"||r.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${n.dtype} and type of y: ${r.dtype}`);const s={a:n,b:r};return w.runKernel(lo,s)}const fd=b({bitwiseAnd_:hd});/**
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
 */function dd(e,t){const n=d(e,"s0","broadcastArgs","int32"),r=d(t,"s1","broadcastArgs","int32");if(n.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(r.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${r.rank}`);const s={s0:n,s1:r};return w.runKernel(ho,s)}const pd=b({broadcastArgs_:dd});/**
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
 */function gd(e,t){let n=d(e,"broadcastTo","x");const r=n.shape;if(mt(t),t.length<n.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${n.rank}.`);if(t.length>n.rank){const u=n.shape.slice();for(;u.length<t.length;)u.unshift(1);n=T(n,u)}const s=n.shape,o=Array.from(t);for(let u=t.length-1;u>=0;u--)if(s[u]===t[u])o[u]=1;else if(n.shape[u]!==1)throw new Error(`broadcastTo(): [${r}] cannot be broadcast to [${t}].`);if(o.map((u,h)=>u>1?h:-1).filter(u=>u>=0).length===0)return te(n);const a={x:n},c={reps:o};return w.runKernel(Dr,a,c)}const an=b({broadcastTo_:gd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function md(e){const n={x:d(e,"x","ceil","float32")};return w.runKernel(fo,n)}const bd=b({ceil_:md});/**
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
 */function Je(e,t,n){mt(e),n=n||je(t);const r={shape:e,value:t,dtype:n};return w.runKernel(zo,{},r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function wd(e,t,n){const r=d(e,"x","clipByValue");if(p(t<=n,()=>`Error in clip: min (${t}) must be less than or equal to max (${n}).`),t===n)return Je(r.shape,t,r.dtype);const s={x:r},o={clipValueMin:t,clipValueMax:n};return w.runKernel(po,s,o)}const yd=b({clipByValue_:wd});function $d(e){return gt(e,0)}const Ed=b({concat1d_:$d});function kd(e,t){return gt(e,t)}const xd=b({concat2d_:kd});function vd(e,t){return gt(e,t)}const Sd=b({concat3d_:vd});/**
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
 */function Td(e,t,n,r,s="NHWC",o=[1,1],i){const a=d(e,"x","conv2d","float32"),c=d(t,"filter","conv2d","float32");let u=a,h=!1;a.rank===3&&(h=!0,u=T(a,[1,a.shape[0],a.shape[1],a.shape[2]])),p(u.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${u.rank}.`),p(c.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${c.rank}.`),kt("conv2d",r,i);const l=s==="NHWC"?u.shape[3]:u.shape[1];p(l===c.shape[2],()=>`Error in conv2d: depth of input (${l}) must match input depth for filter ${c.shape[2]}.`),p(Bt(n,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),p(se(o),()=>"Error in conv2D: Dilated rates should be larger than 0."),p(se(n),()=>"Error in conv2D: Strides should be larger than 0.");const f={x:u,filter:c},g={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:i},y=w.runKernel(wo,f,g);return h?T(y,[y.shape[1],y.shape[2],y.shape[3]]):y}const Nn=b({conv2d_:Td});function Id(e,t,n,r,s="NWC",o=1,i){const a=d(e,"x","conv1d"),c=d(t,"filter","conv1d");let u=a,h=!1;a.rank===2&&(h=!0,u=T(a,[1,a.shape[0],a.shape[1]])),p(u.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${u.rank}.`),p(c.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${c.rank}.`),kt("conv1d",r,i),p(u.shape[2]===c.shape[1],()=>`Error in conv1d: depth of input (${u.shape[2]}) must match input depth for filter ${c.shape[1]}.`),p(Bt(n,o),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${o}'`),p(se(o),()=>"Error in conv1D: Dilated rates should be larger than 0."),p(se(n),()=>"Error in conv1D: Stride should be larger than 0."),p(s==="NWC",()=>`Error in conv1d: got dataFormat of ${s} but only NWC is currently supported.`);const l=T(c,[1,c.shape[0],c.shape[1],c.shape[2]]),f=T(u,[u.shape[0],1,u.shape[1],u.shape[2]]),E=Nn(f,l,[1,n],r,"NHWC",[1,o],i);return h?T(E,[E.shape[2],E.shape[3]]):T(E,[E.shape[0],E.shape[2],E.shape[3]])}const _d=b({conv1d_:Id});/**
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
 */function Ad(e,t,n,r,s,o="NHWC",i){p(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let a=e,c=t,u=!1;t.rank===3&&(u=!0,c=T(t,[1,t.shape[0],t.shape[1],t.shape[2]]),a=[1,e[0],e[1],e[2]]),p(a.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${a.length}.`),p(c.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${c.rank}`),p(n.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`);const h=o==="NHWC"?a[3]:a[1],l=o==="NHWC"?c.shape[3]:c.shape[1];p(h===n.shape[2],()=>`Error in conv2dDerInput: depth of input (${h}) must match input depth for filter ${n.shape[2]}.`),p(l===n.shape[3],()=>`Error in conv2dDerInput: depth of output (${l}) must match output depth for filter ${n.shape[3]}.`),kt("conv2dDerInput",s,i);const f={dy:c,filter:n},g={strides:r,pad:s,dataFormat:o,dimRoundingMode:i,inputShape:a},y=w.runKernel($o,f,g);return u?T(y,[y.shape[1],y.shape[2],y.shape[3]]):y}const $c=b({conv2DBackpropInput_:Ad});function Dd(e,t,n,r,s,o){const i=d(e,"x","conv2dTranspose"),a=d(t,"filter","conv2dTranspose");return $c(n,i,a,r,s,"NHWC",o)}const Nd=b({conv2dTranspose_:Dd});/**
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
 */function Md(e,t,n,r,s="NDHWC",o=[1,1,1]){const i=d(e,"x","conv3d"),a=d(t,"filter","conv3d");let c=i,u=!1;i.rank===4&&(u=!0,c=T(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),p(c.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${c.rank}.`),p(a.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${a.rank}.`),p(c.shape[4]===a.shape[3],()=>`Error in conv3d: depth of input (${c.shape[4]}) must match input depth for filter ${a.shape[3]}.`),p(Bt(n,o),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),p(s==="NDHWC",()=>`Error in conv3d: got dataFormat of ${s} but only NDHWC is currently supported.`),p(se(o),()=>"Error in conv3D: Dilated rates should be larger than 0."),p(se(n),()=>"Error in conv3D: Strides should be larger than 0.");const h={x:c,filter:a},l={strides:n,pad:r,dataFormat:s,dilations:o},f=w.runKernel(Eo,h,l);return u?T(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const Fd=b({conv3d_:Md});/**
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
 */function Bd(e,t,n,r,s){p(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let o=e,i=t,a=!1;t.rank===4&&(a=!0,i=T(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),o=[1,e[0],e[1],e[2],e[3]]);const c=o[4],u=i.shape[4];p(o.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${o.length}.`),p(i.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${i.rank}`),p(n.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`),p(c===n.shape[3],()=>`Error in conv3dDerInput: depth of input (${c}) must match input depth for filter ${n.shape[3]}.`),p(u===n.shape[4],()=>`Error in conv3dDerInput: depth of output (${u}) must match output depth for filter ${n.shape[4]}.`);const h={dy:i,filter:n},l={pad:s,strides:r,inputShape:o},f=w.runKernel(ko,h,l);return a?T(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const Rd=b({conv3DBackpropInput_:Bd});function Cd(e,t,n,r,s){const o=d(e,"x","conv3dTranspose"),i=d(t,"filter","conv3dTranspose");return Rd(n,o,i,r,s)}const Pd=b({conv3dTranspose_:Cd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Od(e){const n={x:d(e,"x","cos","float32")};return w.runKernel(xo,n)}const Ld=b({cos_:Od});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Wd(e){const n={x:d(e,"x","cosh","float32")};return w.runKernel(vo,n)}const qd=b({cosh_:Wd});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ud(e,t=0,n=!1,r=!1){const o={x:d(e,"x","cumprod")},i={axis:t,exclusive:n,reverse:r};return w.runKernel(So,o,i)}const Gd=b({cumprod_:Ud});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function zd(e,t=0,n=!1,r=!1){const o={x:d(e,"x","cumsum")},i={axis:t,exclusive:n,reverse:r};return w.runKernel(To,o,i)}const Kd=b({cumsum_:zd});/**
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
 */function jd(e,t,n,r=!1){const s=d(e,"x","denseBincount"),o=d(t,"weights","denseBincount");p(s.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${s.dtype}`),p(s.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${s.rank}.`),p(n>=0,()=>`size must be non-negative, but got ${n}.`),p(o.size===s.size||o.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${s.shape}, weights shape: ${o.shape}.`);const i={x:s,weights:o},a={size:n,binaryOutput:r};return w.runKernel(_o,i,a)}const Vd=b({denseBincount_:jd});/**
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
 */function Hd(e,t,n="NHWC"){const r=d(e,"x","depthToSpace","float32"),s=n==="NHWC"?r.shape[1]:r.shape[2],o=n==="NHWC"?r.shape[2]:r.shape[3],i=n==="NHWC"?r.shape[3]:r.shape[1];p(t>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`),p(s*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${s} and ${t}  for depthToSpace with input shape
    ${r.shape}`),p(o*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${o} and ${t} for depthToSpace with input shape
        ${r.shape}`),p(i%(t*t)===0,()=>`Dimension size must be evenly divisible by ${t*t} but is ${i} for depthToSpace with input shape ${r.shape}`);const a={x:r},c={blockSize:t,dataFormat:n};return w.runKernel(Ao,a,c)}const Xd=b({depthToSpace_:Hd});/**
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
 */function Zd(e,t,n,r,s="NHWC",o=[1,1],i){const a=d(e,"x","depthwiseConv2d","float32"),c=d(t,"filter","depthwiseConv2d","float32");let u=a,h=!1;a.rank===3&&(h=!0,u=T(a,[1,a.shape[0],a.shape[1],a.shape[2]])),p(u.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${u.rank}.`),p(c.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${c.rank}.`);const l=s==="NHWC"?u.shape[3]:u.shape[1];p(l===c.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${l}) must match the inChannels dimension in filter ${c.shape[2]}.`),kt("depthwiseConv2d",r,i);const f={x:u,filter:c},g={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:i},y=w.runKernel(Do,f,g);return h?T(y,[y.shape[1],y.shape[2],y.shape[3]]):y}const Cr=b({depthwiseConv2d_:Zd});/**
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
 */function Yd(e){const n={x:d(e,"x","diag")};return w.runKernel(Fo,n)}const Jd=b({diag_:Yd});/**
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
 */function Qd(e,t,n,r,s=[1,1],o="NHWC"){const i=d(e,"x","dilation2d"),a=d(t,"filter","dilation2d");p(i.rank===3||i.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${i.rank}.`),p(a.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${a.rank}.`),p(o==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${o}`);let c=i,u=!1;i.rank===3&&(c=T(i,[1,i.shape[0],i.shape[1],i.shape[2]]),u=!0),p(c.shape[3]===a.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${c.shape[3]} vs ${a.shape[2]}`);const h={x:c,filter:a},l={strides:n,pad:r,dilations:s},f=w.runKernel(Bo,h,l);return u?T(f,[f.shape[1],f.shape[2],f.shape[3]]):f}const tp=b({dilation2d_:Qd});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */function Ec(e,t){const n=e.length,r=[];for(let s=0;s<n;s++){const o=n-1-s,i=e[o]||1;(t[t.length-1-s]||1)>1&&i===1&&r.unshift(o)}return r}function Pr(e,t){const n=[];for(let r=0;r<t.length;r++){const s=e[e.length-r-1],o=t.length-r-1,i=t[o];(s==null||s===1&&i>1)&&n.unshift(o)}return n}function rt(e,t){const n=Math.max(e.length,t.length),r=new Array(n);for(let s=0;s<n;s++){let o=e[e.length-s-1];o==null&&(o=1);let i=t[t.length-s-1];if(i==null&&(i=1),o===1)r[n-s-1]=i;else if(i===1)r[n-s-1]=o;else if(o!==i){const a=`Operands could not be broadcast together with shapes ${e} and ${t}.`;throw Error(a)}else r[n-s-1]=o}return r}const ep=Object.freeze(Object.defineProperty({__proto__:null,assertAndGetBroadcastShape:rt,getBroadcastDims:Ec,getReductionAxes:Pr},Symbol.toStringTag,{value:"Module"}));/**
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
 */function np(e,t){let n=d(e,"a","equal","string_or_numeric"),r=d(t,"b","equal","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Lo,s)}const kc=b({equal_:np});/**
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
 */function rp(e,t,n){const r=d(t,"a","where"),s=d(n,"b","where"),o=d(e,"condition","where","bool"),i=rt(rt(o.shape,r.shape),s.shape),a=an(o,i),c=an(r,i),u=an(s,i),h={condition:a,t:c,e:u};return w.runKernel(ea,h)}const Ut=b({where_:rp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function sp(e){const n={x:d(e,"x","zerosLike")};return w.runKernel(Fa,n)}const yt=b({zerosLike_:sp});/**
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
 */function op(e,t){let n=d(e,"a","div"),r=d(t,"b","div");[n,r]=J(n,r);const s=V(n,r),o=yt(s),i=kc(r,o);return Ut(i,o,s)}const ip=b({divNoNan_:op});/**
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
 */function ap(e,t){const n=d(e,"t1","dot"),r=d(t,"t2","dot");p((n.rank===1||n.rank===2)&&(r.rank===1||r.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${r.rank}.`);const s=n.rank===1?n.size:n.shape[1],o=r.rank===1?r.size:r.shape[0];if(p(s===o,()=>`Error in dot: inner dimensions of inputs must match, but got ${s} and ${o}.`),n.rank===1&&r.rank===1){const i=T(n,[1,-1]),a=T(r,[-1,1]),c=U(i,a);return T(c,[])}else if(n.rank===1&&r.rank===2){const i=T(n,[1,-1]),a=T(r,[r.shape[0],r.shape[1]]),c=U(i,a);return T(c,[c.size])}else if(n.rank===2&&r.rank===1){const i=T(r,[-1,1]),a=U(n,i);return T(a,[a.size])}else{const i=T(r,[r.shape[0],r.shape[1]]);return U(n,i)}}const cp=b({dot_:ap});/**
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
 */function up(e,...t){const n=t.map((s,o)=>d(s,`tensors${o}`,"einsum")),r={equation:e};return w.runKernel(Co,n,r)}const he=b({einsum_:up});/**
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
 */function lp(e){const n={x:d(e,"x","elu","float32")};return w.runKernel(Po,n)}const xc=b({elu_:lp});/**
 * @license
 * Copyright 2023 Google LLC.
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
 */function hp(e,t){const n=d(e,"x","ensureShape","string_or_numeric");if(!Rs(n.shape,t))throw new Error(`EnsureShape: Shape of tensor ${n.shape} is not compatible with expected shape ${t}`);return e}const fp=b({ensureShape_:hp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function dp(e){let t=d(e,"x","erf");p(t.dtype==="int32"||t.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),t.dtype==="int32"&&(t=H(t,"float32"));const n={x:t};return w.runKernel(Oo,n)}const pp=b({erf_:dp});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */function Or(e,t){for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0}function vc(e,t,n){const r=e.length+t.length,s=[];let o=0,i=0;for(let a=0;a<r;a++)n.indexOf(a)===-1?s.push(e[o++]):s.push(t[i++]);return s}function gp(e,t){const n=[],r=e.length;for(let o=0;o<r;o++)t.indexOf(o)===-1&&n.push(e[o]);const s=t.map(o=>e[o]);return[n,s]}function Qe(e,t){const n=t.map(r=>1);return vc(e,n,t)}function mp(e,t,n){p(Or(t,n),()=>`${e} supports only inner-most axes for now. Got axes ${t} and rank-${n} input.`)}function bp(e,t){if(Or(e,t))return null;const n=[];for(let r=0;r<t;++r)e.indexOf(r)===-1&&n.push(r);return e.forEach(r=>n.push(r)),n}function wp(e){return e.map((t,n)=>[n,t]).sort((t,n)=>t[1]-n[1]).map(t=>t[0])}function yp(e,t){const n=[];for(let r=t-e;r<t;++r)n.push(r);return n}/**
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
 */function $p(e,t=null,n=!1){const s={x:d(e,"x","max")},o={reductionIndices:t,keepDims:n};return w.runKernel(pi,s,o)}const be=b({max_:$p});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function Ep(e,t=null,n=!1){const s={x:d(e,"x","min")},o={axis:t,keepDims:n};return w.runKernel($i,s,o)}const gr=b({min_:Ep});/**
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
 */function kp(e,t){let n=d(e,"base","pow"),r=d(t,"exp","pow");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Ri,s)}const Le=b({pow_:kp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function z(e,t){if((it(e)&&t!=="string"||Array.isArray(e))&&t!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(t==="string"&&it(e)&&!(e instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return Vt(e,[],[],t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function xp(e){const n={x:d(e,"x","sqrt","float32")};return w.runKernel(ua,n)}const Mt=b({sqrt_:xp});/**
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
 */function vp(e){const t=d(e,"x","square"),n={};return w.runKernel("Square",{x:t},n)}const vt=b({square_:vp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Sp(e,t=null,n=!1){let r=d(e,"x","sum");r.dtype==="bool"&&(r=H(r,"int32"));const s={x:r},o={axis:t,keepDims:n};return w.runKernel(la,s,o)}const j=b({sum_:Sp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Tp(e,t="euclidean",n=null,r=!1){e=d(e,"x","norm");const s=Sc(e,t,n);let o=s.shape;if(r){const i=Ke(n,e.shape);o=Qe(s.shape,i)}return T(s,o)}function Sc(e,t,n=null){if(e.rank===0)return wt(e);if(e.rank!==1&&n===null)return Sc(T(e,[-1]),t,n);if(e.rank===1||typeof n=="number"||Array.isArray(n)&&n.length===1){if(t===1)return j(wt(e),n);if(t===1/0)return be(wt(e),n);if(t===-1/0)return gr(wt(e),n);if(t==="euclidean"||t===2)return Mt(j(Le(wt(e),z(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(n)&&n.length===2){if(t===1)return be(j(wt(e),n[0]),n[1]-1);if(t===1/0)return be(j(wt(e),n[1]),n[0]);if(t===-1/0)return gr(j(wt(e),n[1]),n[0]);if(t==="fro"||t==="euclidean")return Mt(j(vt(e),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const Mn=b({norm_:Tp});/**
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
 */function Ip(e,t=null,n=!1){return Mn(e,"euclidean",t,n)}const _p=b({euclideanNorm_:Ip});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ap(e){const n={x:d(e,"x","exp")};return w.runKernel(Wo,n)}const oe=b({exp_:Ap});/**
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
 */function Dp(e,t=0){const n=d(e,"x","expandDims","string_or_numeric");p(t<=n.rank,()=>"Axis must be <= rank of the tensor");const r={input:n},s={dim:t};return w.runKernel(qo,r,s)}const Ct=b({expandDims_:Dp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Np(e){const n={x:d(e,"x","expm1")};return w.runKernel(Uo,n)}const Mp=b({expm1_:Np});/**
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
 */function Fp(e,t){const n=d(e,"x","tile","string_or_numeric");p(n.rank===t.length,()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${t}.`);const r={x:n},s={reps:t};return w.runKernel(Dr,r,s)}const _e=b({tile_:Fp});/**
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
 */function Bp(e,t,n,r="float32"){t==null&&(t=e);const s=Nt([e,t],r),o=e<=t?e:t;for(let a=0;a<o;++a)s.set(1,a,a);const i=T(s.toTensor(),[e,t]);if(n==null)return i;if(n.length===1)return _e(Ct(i,0),[n[0],1,1]);if(n.length===2)return _e(Ct(Ct(i,0),0),[n[0],n[1],1,1]);if(n.length===3)return _e(Ct(Ct(Ct(i,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}const Tc=b({eye_:Bp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Rp(e){const n={x:d(e,"x","floor","float32")};return w.runKernel(jo,n)}const Ic=b({floor_:Rp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Cp(e,t,n=0,r=0){const s=d(e,"x","gather"),o=d(t,"indices","gather","int32"),i={x:s,indices:o},a={axis:n,batchDims:r};return w.runKernel(Xo,i,a)}const _c=b({gather_:Cp});/**
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
 */function Pp(e,t){let n=d(e,"a","greater","string_or_numeric"),r=d(t,"b","greater","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Yo,s)}const Fn=b({greater_:Pp});/**
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
 */function Op(e,t){let n=d(e,"a","greaterEqual","string_or_numeric"),r=d(t,"b","greaterEqual","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Jo,s)}const Ac=b({greaterEqual_:Op});/**
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
 */function Lp(e){const n={input:d(e,"input","imag")};return w.runKernel(ti,n)}const Bn=b({imag_:Lp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Wp(e){const n={x:d(e,"x","isFinite")};return w.runKernel(ei,n)}const qp=b({isFinite_:Wp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Up(e){const n={x:d(e,"x","isInf")};return w.runKernel(ni,n)}const Gp=b({isInf_:Up});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function zp(e){const n={x:d(e,"x","isNaN")};return w.runKernel(ri,n)}const Kp=b({isNaN_:zp});/**
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
 */function jp(e,t=.2){const r={x:d(e,"x","leakyRelu")},s={alpha:t};return w.runKernel(si,r,s)}const Dc=b({leakyRelu_:jp});/**
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
 */function Vp(e,t){let n=d(e,"a","less","string_or_numeric"),r=d(t,"b","less","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(oi,s)}const mr=b({less_:Vp});/**
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
 */function Hp(e,t){let n=d(e,"a","lessEqual","string_or_numeric"),r=d(t,"b","lessEqual","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(ii,s)}const Lr=b({lessEqual_:Hp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Xp(e,t,n){if(n<=0)throw new Error("The number of values should be positive.");const r={start:e,stop:t,num:n};return w.runKernel(ai,{},r)}/**
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
 */function Zp(e,t=5,n=1,r=1,s=.5){const o=d(e,"x","localResponseNormalization");p(o.rank===4||o.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${o.rank}.`),p(we(t),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`);let i=o,a=!1;o.rank===3&&(a=!0,i=T(o,[1,o.shape[0],o.shape[1],o.shape[2]]));const c={x:i},u={depthRadius:t,bias:n,alpha:r,beta:s},h=w.runKernel(di,c,u);return a?T(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const Yp=b({localResponseNormalization_:Zp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Jp(e){const n={x:d(e,"x","log","float32")};return w.runKernel(ci,n)}const We=b({log_:Jp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Qp(e){const n={x:d(e,"x","log1p")};return w.runKernel(ui,n)}const Nc=b({log1p_:Qp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function tg(e){return p(Gt(e),()=>"The f passed in grad(f) must be a function"),(t,n)=>{const r=d(t,"x","tf.grad","string_or_numeric"),s=n!=null?d(n,"dy","tf.grad"):null;return w.tidy(()=>{const{value:o,grads:i}=w.gradients(()=>e(r),[r],s);return s!=null&&ht(o.shape,s.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),Rn(i),i[0]})}}function eg(e){return p(Gt(e),()=>"The f passed in grads(f) must be a function"),(t,n)=>{p(Array.isArray(t),()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s");const r=Re(t,"args","tf.grads","string_or_numeric"),s=n!=null?d(n,"dy","tf.grads"):null;return w.tidy(()=>{const{value:o,grads:i}=w.gradients(()=>e(...r),r,s);return s!=null&&ht(o.shape,s.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Rn(i),i})}}function ng(e){return p(Gt(e),()=>"The f passed in valueAndGrad(f) must be a function"),(t,n)=>{p(t instanceof et,()=>"The x passed in valueAndGrad(f)(x) must be a tensor"),p(n==null||n instanceof et,()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor");const{grads:r,value:s}=w.gradients(()=>e(t),[t],n);return Rn(r),{grad:r[0],value:s}}}function rg(e){return p(Gt(e),()=>"The f passed in valueAndGrads(f) must be a function"),(t,n)=>{p(Array.isArray(t)&&t.every(s=>s instanceof et),()=>"The args passed in valueAndGrads(f)(args) must be array of tensors"),p(n==null||n instanceof et,()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor");const r=w.gradients(()=>e(...t),t,n);return n!=null&&ht(r.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Rn(r.grads),r}}function Mc(e,t){p(Gt(e),()=>"The f passed in variableGrads(f) must be a function"),p(t==null||Array.isArray(t)&&t.every(u=>u instanceof Be),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");const n=t!=null;if(!n){t=[];for(const u in w.registeredVariables)t.push(w.registeredVariables[u])}const r=n?t.filter(u=>!u.trainable):null,s=t.length;t=t.filter(u=>u.trainable),p(t.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${s} variables is trainable.`);const o=!0,{value:i,grads:a}=w.gradients(e,t,null,o);p(a.some(u=>u!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),p(i.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${i.rank} tensor`);const c={};return t.forEach((u,h)=>{a[h]!=null&&(c[u.name]=a[h])}),r?.forEach(u=>c[u.name]=null),{value:i,grads:c}}function At(e){return w.customGrad(e)}function Rn(e){if(e.filter(n=>n==null).length>0)throw new Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that
    the f you passed encloses all operations that lead from x to y.`)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function sg(e){const n={x:d(e,"x","neg")};return w.runKernel(Ti,n)}const It=b({neg_:sg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function og(e){const n={x:d(e,"x","softplus")};return w.runKernel(ca,n)}const Fc=b({softplus_:og});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function ig(e){const t=d(e,"x","logSigmoid");return At(r=>({value:It(Fc(It(r))),gradFunc:i=>D(i,me(It(r)))}))(t)}const ag=b({logSigmoid_:ig});/**
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
 */function cg(e,t){let n=d(e,"a","sub"),r=d(t,"b","sub");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Sa,s)}const W=b({sub_:cg});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function ug(e,t=-1){const n=d(e,"logits","logSoftmax");if(t===-1&&(t=n.rank-1),t!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${t}`);return At((s,o)=>{const a=be(s,t,!0),c=W(s,a),u=W(H(c,"float32"),We(j(oe(c),t,!0)));return o([u]),{value:u,gradFunc:(l,f)=>{const[g]=f,y=!0,$=oe(g);return W(l,D(j(l,t,y),$))}}})(n)}const lg=b({logSoftmax_:ug});/**
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
 */function hg(e,t=null,n=!1){const r=d(e,"x","logSumExp"),s=Ke(t,r.shape),o=be(r,s,!0),i=W(r,o),a=oe(i),c=j(a,s),u=We(c),h=P(T(o,u.shape),u);if(n){const l=Qe(h.shape,s);return T(h,l)}return h}const Bc=b({logSumExp_:hg});/**
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
 */function fg(e,t){const n=d(e,"a","logicalAnd","bool"),r=d(t,"b","logicalAnd","bool");rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(li,s)}const En=b({logicalAnd_:fg});/**
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
 */function dg(e){const n={x:d(e,"x","logicalNot","bool")};return w.runKernel(hi,n)}const Rc=b({logicalNot_:dg});/**
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
 */function pg(e,t){const n=d(e,"a","logicalOr","bool"),r=d(t,"b","logicalOr","bool");rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(fi,s)}const Cc=b({logicalOr_:pg});/**
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
 */function gg(e,t){const n=d(e,"a","logicalXor","bool"),r=d(t,"b","logicalXor","bool");return rt(n.shape,r.shape),En(Cc(e,t),Rc(En(e,t)))}const mg=b({logicalXor_:gg});/**
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
 */const nn=2147483648;function bg(e,t,n="left"){const r=d(e,"sortedSequence","searchSorted"),s=d(t,"values","searchSorted"),o=r.shape[r.shape.length-1],i=s.shape[s.shape.length-1],a=T(r,[-1,o]),c=T(s,[-1,i]);if(a.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(a.shape[0]!==c.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(G(c.shape)>=nn)throw new Error(`values tensor size must less than ${nn}`);if(a.shape[1]>=nn)throw new Error(`trailing dim_size must less than ${nn} for int32 output type, was ${a.shape[1]}`);const u={sortedSequence:a,values:c},h={side:n};return w.runKernel(ta,u,h)}const Wr=b({searchSorted_:bg});/**
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
 */function wg(e,t){return Wr(e,t,"left")}/**
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
 */function yg(e,t,n,r,s){const o=d(e,"x","maxPool"),i=1;let a=o,c=!1;o.rank===3&&(c=!0,a=T(o,[1,o.shape[0],o.shape[1],o.shape[2]])),p(a.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${a.rank}.`),p(Bt(n,i),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${i}'`),kt("maxPool",r,s);const u={x:a},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s},l=w.runKernel(mi,u,h);return c?T(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Pc=b({maxPool_:yg});/**
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
 */function $g(e,t=[1,1,1],n,r,s,o="NDHWC"){const i=d(e,"x","maxPool3d");let a=i,c=!1;i.rank===4&&(c=!0,a=T(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),p(a.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${a.rank}.`),p(o==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),kt("maxPool3d",r,s);const u={x:a},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:o},l=w.runKernel(bi,u,h);return c?T(l,[l.shape[1],l.shape[2],l.shape[3],l.shape[4]]):l}const Eg=b({maxPool3d_:$g});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function kg(e,t,n,r,s=!1){const i={x:d(e,"x","maxPoolWithArgmax")},a={filterSize:t,strides:n,pad:r,includeBatchInIndex:s},c=w.runKernel(wi,i,a);return{result:c[0],indexes:c[1]}}const xg=b({maxPoolWithArgmax_:kg});/**
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
 */function vg(e,t){let n=d(e,"a","maximum"),r=d(t,"b","maximum");[n,r]=J(n,r),n.dtype==="bool"&&(n=H(n,"int32"),r=H(r,"int32")),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(gi,s)}const Oc=b({maximum_:vg});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */function Sg(e,t=null,n=!1){const s={x:d(e,"x","mean")},o={axis:t,keepDims:n};return w.runKernel(yi,s,o)}const kn=b({mean_:Sg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ee(e,t="float32"){if(mt(e),t==="complex64"){const r=Ee(e,"float32"),s=Ee(e,"float32");return Kt(r,s)}const n=Tn(G(e),t);return w.makeTensor(n,e,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Qt(e,t="float32"){if(mt(e),t==="complex64"){const r=Qt(e,"float32"),s=Ee(e,"float32");return Kt(r,s)}const n=xr(G(e),t);return w.makeTensor(n,e,t)}/**
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
 */function Tg(e,t,{indexing:n="xy"}={}){if(n!=="xy"&&n!=="ij")throw new TypeError(`${n} is not a valid third argument to meshgrid`);if(e===void 0)return[];let r=d(e,"x","meshgrid",e instanceof et?e.dtype:"float32");if(t===void 0)return[r];let s=d(t,"y","meshgrid",t instanceof et?t.dtype:"float32");const o=G(r.shape),i=G(s.shape);return n==="xy"?(r=T(r,[1,-1]),s=T(s,[-1,1]),[U(Qt([i,1],r.dtype),r),U(s,Qt([1,o],s.dtype))]):(r=T(r,[-1,1]),s=T(s,[1,-1]),[U(r,Qt([1,i],r.dtype)),U(Qt([o,1],s.dtype),s)])}/**
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
 */function Ig(e,t){let n=d(e,"a","minimum"),r=d(t,"b","minimum");[n,r]=J(n,r),n.dtype==="bool"&&(n=H(n,"int32"),r=H(r,"int32")),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Ei,s)}const xn=b({minimum_:Ig});/**
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
 */function _g(e,t,n){p(n==="reflect"||n==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`);const r=d(e,"x","mirrorPad");if(r.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");p(t.length===r.rank,()=>`Padding doesn't match input. Must be ${r.rank}. Got ${t.length}.`);const s=n==="reflect"?1:0;for(let a=0;a<r.rank;a++)p(t[a].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),p(t[a][0]>=0&&t[a][0]<=r.shape[a]-s&&t[a][1]>=0&&t[a][1]<=r.shape[a]-s,()=>`Padding in dimension ${a} cannot be greater than or equal to ${r.shape[a]-s} or less than 0 for input of shape ${r.shape}`);const o={paddings:t,mode:n},i={x:r};return w.runKernel(ki,i,o)}const Ag=b({mirrorPad_:_g});/**
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
 */function Dg(e,t){let n=d(e,"a","mod"),r=d(t,"b","mod");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(xi,s)}const Ng=b({mod_:Dg});/**
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
 */function Mg(e,t=null,n=!1){e=d(e,"x","moments");const r=Ke(t,e.shape),s=kn(e,r,n);let o=s.shape;n||(o=Qe(s.shape,r));const i=vt(W(H(e,"float32"),T(s,o))),a=kn(i,r,n);return{mean:s,variance:a}}const Fg=b({moments_:Mg});function Bg(e,t,n,r){const s=d(t,"data","multiRNNCell"),o=Re(n,"c","multiRNNCell"),i=Re(r,"h","multiRNNCell");let a=s;const c=[];for(let l=0;l<e.length;l++){const f=e[l](a,o[l],i[l]);c.push(f[0]),c.push(f[1]),a=f[1]}const u=[],h=[];for(let l=0;l<c.length;l+=2)u.push(c[l]),h.push(c[l+1]);return[u,h]}const Rg=b({multiRNNCell_:Bg});/**
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
 */function Cg(e,t,n,r=!1){const s=d(e,"logits","multinomial"),o=s.size,i=s.rank;if(o<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${o}.`);if(i>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${i}`);n=n||Math.random();const c={logits:i===1?T(s,[1,-1]):s},u={numSamples:t,seed:n,normalized:r},h=w.runKernel(vi,c,u);return i===1?T(h,[h.size]):h}const Pg=b({multinomial_:Cg});/**
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
 */function Og(e,t){let n=d(e,"a","notEqual","string_or_numeric"),r=d(t,"b","notEqual","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Ii,s)}const Lc=b({notEqual_:Og});/**
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
 */function Lg(e,t,n=1,r=0,s="int32"){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);const i={indices:d(e,"indices","oneHot","int32")},a={dtype:s,depth:t,onValue:n,offValue:r};return w.runKernel(Mi,i,a)}const br=b({oneHot_:Lg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Wg(e){const n={x:d(e,"x","onesLike")};return w.runKernel(Ni,n)}const qg=b({onesLike_:Wg});function Ug(e,t){const n=d(e,"v1","outerProduct"),r=d(t,"v2","outerProduct");p(n.rank===1&&r.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${r.rank}.`);const s=T(n,[-1,1]),o=T(r,[1,-1]);return U(s,o)}const Gg=b({outerProduct_:Ug});function zg(e,t,n=0){return p(t.length===2,()=>"Invalid number of paddings. Must be length of 2."),Xe(e,[t],n)}const Kg=b({pad1d_:zg});function jg(e,t,n=0){return p(t.length===2&&t[0].length===2&&t[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Xe(e,t,n)}const Vg=b({pad2d_:jg});function Hg(e,t,n=0){return p(t.length===3&&t[0].length===2&&t[1].length===2&&t[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Xe(e,t,n)}const Xg=b({pad3d_:Hg});/**
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
 */function Zg(e,t,n){const r=d(e,"x","spaceToBatchND");p(r.rank>=1+t.length,()=>`input rank ${r.rank} should be > than [blockShape] ${t.length}`),p(n.length===t.length,()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${t.length}`),p(r.shape.reduce((i,a,c)=>c>0&&c<=t.length?i&&(a+n[c-1][0]+n[c-1][1])%t[c-1]===0:i,!0),()=>`input spatial dimensions ${r.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${t.toString()}`);const s={x:r},o={blockShape:t,paddings:n};return w.runKernel(ha,s,o)}const Wc=b({spaceToBatchND_:Zg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Yg(e,t,n,r,s,o,i){s==null&&(s=[1,1]),o==null&&(o=1),r===0&&(r="valid");const a=d(e,"x","maxPool");let c=a,u=!1;a.rank===3&&(u=!0,c=T(a,[1,a.shape[0],a.shape[1],a.shape[2]])),p(Bt(o,s),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${o} and dilations '${s}'`);const h=pc(c.shape,t,o,s,r),l=[h.dilationHeight,h.dilationWidth];let f;r==="same"?f=Qg([h.filterHeight,h.filterWidth],l):f=[[0,0],[0,0]];const g=l[0]===1&&l[1]===1,[y,$]=Jg([h.inHeight,h.inWidth],l,f),E=g?r:"valid",v=g?c:Wc(c,l,y),S=(n==="avg"?()=>bc(v,t,o,E,i):()=>Pc(v,t,o,E,i))(),_=g?S:wc(S,l,$);return u?T(_,[_.shape[1],_.shape[2],_.shape[3]]):_}function Jg(e,t,n){const r=n.map(h=>h[0]),s=n.map(h=>h[1]),o=e.concat(r,s),i=t.map((h,l)=>(h-o[l]%h)%h),a=s.map((h,l)=>h+i[l]),c=t.map((h,l)=>[r[l],a[l]]),u=t.map((h,l)=>[0,i[l]]);return[c,u]}function Qg(e,t){const r=e.map((i,a)=>i+(i-1)*(t[a]-1)).map(i=>i-1),s=r.map(i=>Math.floor(i/2)),o=r.map((i,a)=>i-s[a]);return r.map((i,a)=>[s[a],o[a]])}const tm=b({pool_:Yg});/**
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
 */function em(e,t){const n=d(e,"x","prelu"),r=d(t,"alpha","prelu"),s={x:n,alpha:r};return w.runKernel(Ci,s)}const qc=b({prelu_:em});/**
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
 */function nm(e,t=null,n=!1){let r=d(e,"x","prod");r.dtype==="bool"&&(r=H(r,"int32"));const s={x:r},o={axis:t,keepDims:n};return w.runKernel(Pi,s,o)}const rm=b({prod_:nm});/**
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
 */function sm(e,t,n,r){const s=e.map((h,l)=>d(h,`tensors${l}`,"raggedGather","int32")),o=d(t,"paramsDenseValues","raggedGather"),i=d(n,"indices","raggedGather","int32"),a={paramsNestedSplits:s,paramsDenseValues:o,indices:i},c={outputRaggedRank:r},u=w.runKernel(Oi,a,c);return{outputNestedSplits:u.slice(0,u.length-1),outputDenseValues:u[u.length-1]}}const om=b({raggedGather_:sm});/**
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
 */function im(e,t,n){const r=d(e,"starts","raggedRange"),s=d(t,"limits","raggedRange",r.dtype),o=d(n,"deltas","raggedRange",r.dtype),i={starts:r,limits:s,deltas:o},a=w.runKernel(Li,i);return{rtNestedSplits:a[0],rtDenseValues:a[1]}}const am=b({raggedRange_:im});/**
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
 */function cm(e,t,n,r,s){const o=d(e,"shape","raggedTensorToTensor","int32"),i=d(t,"values","raggedTensorToTensor"),a=d(n,"defaultValue","raggedTensorToTensor",i.dtype),c=r.map((l,f)=>d(l,`tensors${f}`,"raggedTensorToTensor","int32")),u={shape:o,values:i,defaultValue:a,rowPartitionTensors:c},h={rowPartitionTypes:s};return w.runKernel(Wi,u,h)}const um=b({raggedTensorToTensor_:cm});/**
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
 */function lm(e,t,n){mt(e);const r=G(e);let s=null;if(n==null||n==="float32")s=new Float32Array(r);else if(n==="int32")s=new Int32Array(r);else if(n==="bool")s=new Uint8Array(r);else throw new Error(`Unknown data type ${n}`);for(let o=0;o<r;o++)s[o]=t();return w.makeTensor(s,e,n)}const hm=b({rand_:lm});var cn={exports:{}},fm=cn.exports,bs;function dm(){return bs||(bs=1,(function(e){(function(t,n,r){function s(c){var u=this,h=a();u.next=function(){var l=2091639*u.s0+u.c*23283064365386963e-26;return u.s0=u.s1,u.s1=u.s2,u.s2=l-(u.c=l|0)},u.c=1,u.s0=h(" "),u.s1=h(" "),u.s2=h(" "),u.s0-=h(c),u.s0<0&&(u.s0+=1),u.s1-=h(c),u.s1<0&&(u.s1+=1),u.s2-=h(c),u.s2<0&&(u.s2+=1),h=null}function o(c,u){return u.c=c.c,u.s0=c.s0,u.s1=c.s1,u.s2=c.s2,u}function i(c,u){var h=new s(c),l=u&&u.state,f=h.next;return f.int32=function(){return h.next()*4294967296|0},f.double=function(){return f()+(f()*2097152|0)*11102230246251565e-32},f.quick=f,l&&(typeof l=="object"&&o(l,h),f.state=function(){return o(h,{})}),f}function a(){var c=4022871197,u=function(h){h=String(h);for(var l=0;l<h.length;l++){c+=h.charCodeAt(l);var f=.02519603282416938*c;c=f>>>0,f-=c,f*=c,c=f>>>0,f-=c,c+=f*4294967296}return(c>>>0)*23283064365386963e-26};return u}n&&n.exports?n.exports=i:this.alea=i})(fm,e)})(cn)),cn.exports}var un={exports:{}},pm=un.exports,ws;function gm(){return ws||(ws=1,(function(e){(function(t,n,r){function s(a){var c=this,u="";c.x=0,c.y=0,c.z=0,c.w=0,c.next=function(){var l=c.x^c.x<<11;return c.x=c.y,c.y=c.z,c.z=c.w,c.w^=c.w>>>19^l^l>>>8},a===(a|0)?c.x=a:u+=a;for(var h=0;h<u.length+64;h++)c.x^=u.charCodeAt(h)|0,c.next()}function o(a,c){return c.x=a.x,c.y=a.y,c.z=a.z,c.w=a.w,c}function i(a,c){var u=new s(a),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(typeof h=="object"&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=i:this.xor128=i})(pm,e)})(un)),un.exports}var ln={exports:{}},mm=ln.exports,ys;function bm(){return ys||(ys=1,(function(e){(function(t,n,r){function s(a){var c=this,u="";c.next=function(){var l=c.x^c.x>>>2;return c.x=c.y,c.y=c.z,c.z=c.w,c.w=c.v,(c.d=c.d+362437|0)+(c.v=c.v^c.v<<4^(l^l<<1))|0},c.x=0,c.y=0,c.z=0,c.w=0,c.v=0,a===(a|0)?c.x=a:u+=a;for(var h=0;h<u.length+64;h++)c.x^=u.charCodeAt(h)|0,h==u.length&&(c.d=c.x<<10^c.x>>>4),c.next()}function o(a,c){return c.x=a.x,c.y=a.y,c.z=a.z,c.w=a.w,c.v=a.v,c.d=a.d,c}function i(a,c){var u=new s(a),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(typeof h=="object"&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=i:this.xorwow=i})(mm,e)})(ln)),ln.exports}var hn={exports:{}},wm=hn.exports,$s;function ym(){return $s||($s=1,(function(e){(function(t,n,r){function s(a){var c=this;c.next=function(){var h=c.x,l=c.i,f,g;return f=h[l],f^=f>>>7,g=f^f<<24,f=h[l+1&7],g^=f^f>>>10,f=h[l+3&7],g^=f^f>>>3,f=h[l+4&7],g^=f^f<<7,f=h[l+7&7],f=f^f<<13,g^=f^f<<9,h[l]=g,c.i=l+1&7,g};function u(h,l){var f,g=[];if(l===(l|0))g[0]=l;else for(l=""+l,f=0;f<l.length;++f)g[f&7]=g[f&7]<<15^l.charCodeAt(f)+g[f+1&7]<<13;for(;g.length<8;)g.push(0);for(f=0;f<8&&g[f]===0;++f);for(f==8?g[7]=-1:g[f],h.x=g,h.i=0,f=256;f>0;--f)h.next()}u(c,a)}function o(a,c){return c.x=a.x.slice(),c.i=a.i,c}function i(a,c){a==null&&(a=+new Date);var u=new s(a),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(h.x&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=i:this.xorshift7=i})(wm,e)})(hn)),hn.exports}var fn={exports:{}},$m=fn.exports,Es;function Em(){return Es||(Es=1,(function(e){(function(t,n,r){function s(a){var c=this;c.next=function(){var h=c.w,l=c.X,f=c.i,g,y;return c.w=h=h+1640531527|0,y=l[f+34&127],g=l[f=f+1&127],y^=y<<13,g^=g<<17,y^=y>>>15,g^=g>>>12,y=l[f]=y^g,c.i=f,y+(h^h>>>16)|0};function u(h,l){var f,g,y,$,E,v=[],B=128;for(l===(l|0)?(g=l,l=null):(l=l+"\0",g=0,B=Math.max(B,l.length)),y=0,$=-32;$<B;++$)l&&(g^=l.charCodeAt(($+32)%l.length)),$===0&&(E=g),g^=g<<10,g^=g>>>15,g^=g<<4,g^=g>>>13,$>=0&&(E=E+1640531527|0,f=v[$&127]^=g+E,y=f==0?y+1:0);for(y>=128&&(v[(l&&l.length||0)&127]=-1),y=127,$=512;$>0;--$)g=v[y+34&127],f=v[y=y+1&127],g^=g<<13,f^=f<<17,g^=g>>>15,f^=f>>>12,v[y]=g^f;h.w=E,h.X=v,h.i=y}u(c,a)}function o(a,c){return c.i=a.i,c.w=a.w,c.X=a.X.slice(),c}function i(a,c){a==null&&(a=+new Date);var u=new s(a),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(h.X&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=i:this.xor4096=i})($m,e)})(fn)),fn.exports}var dn={exports:{}},km=dn.exports,ks;function xm(){return ks||(ks=1,(function(e){(function(t,n,r){function s(a){var c=this,u="";c.next=function(){var l=c.b,f=c.c,g=c.d,y=c.a;return l=l<<25^l>>>7^f,f=f-g|0,g=g<<24^g>>>8^y,y=y-l|0,c.b=l=l<<20^l>>>12^f,c.c=f=f-g|0,c.d=g<<16^f>>>16^y,c.a=y-l|0},c.a=0,c.b=0,c.c=-1640531527,c.d=1367130551,a===Math.floor(a)?(c.a=a/4294967296|0,c.b=a|0):u+=a;for(var h=0;h<u.length+20;h++)c.b^=u.charCodeAt(h)|0,c.next()}function o(a,c){return c.a=a.a,c.b=a.b,c.c=a.c,c.d=a.d,c}function i(a,c){var u=new s(a),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(typeof h=="object"&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=i:this.tychei=i})(km,e)})(dn)),dn.exports}var pn={exports:{}};const vm={},Sm=Object.freeze(Object.defineProperty({__proto__:null,default:vm},Symbol.toStringTag,{value:"Module"})),Tm=kl(Sm);var Im=pn.exports,xs;function _m(){return xs||(xs=1,(function(e){(function(t,n,r){var s=256,o=6,i=52,a="random",c=r.pow(s,o),u=r.pow(2,i),h=u*2,l=s-1,f;function g(_,A,N){var R=[];A=A==!0?{entropy:!0}:A||{};var M=v(E(A.entropy?[_,S(n)]:_??B(),3),R),x=new y(R),k=function(){for(var m=x.g(o),I=c,F=0;m<u;)m=(m+F)*s,I*=s,F=x.g(1);for(;m>=h;)m/=2,I/=2,F>>>=1;return(m+F)/I};return k.int32=function(){return x.g(4)|0},k.quick=function(){return x.g(4)/4294967296},k.double=k,v(S(x.S),n),(A.pass||N||function(m,I,F,C){return C&&(C.S&&$(C,x),m.state=function(){return $(x,{})}),F?(r[a]=m,I):m})(k,M,"global"in A?A.global:this==r,A.state)}function y(_){var A,N=_.length,R=this,M=0,x=R.i=R.j=0,k=R.S=[];for(N||(_=[N++]);M<s;)k[M]=M++;for(M=0;M<s;M++)k[M]=k[x=l&x+_[M%N]+(A=k[M])],k[x]=A;(R.g=function(m){for(var I,F=0,C=R.i,O=R.j,q=R.S;m--;)I=q[C=l&C+1],F=F*s+q[l&(q[C]=q[O=l&O+I])+(q[O]=I)];return R.i=C,R.j=O,F})(s)}function $(_,A){return A.i=_.i,A.j=_.j,A.S=_.S.slice(),A}function E(_,A){var N=[],R=typeof _,M;if(A&&R=="object")for(M in _)try{N.push(E(_[M],A-1))}catch{}return N.length?N:R=="string"?_:_+"\0"}function v(_,A){for(var N=_+"",R,M=0;M<N.length;)A[l&M]=l&(R^=A[l&M]*19)+N.charCodeAt(M++);return S(A)}function B(){try{var _;return f&&(_=f.randomBytes)?_=_(s):(_=new Uint8Array(s),(t.crypto||t.msCrypto).getRandomValues(_)),S(_)}catch{var A=t.navigator,N=A&&A.plugins;return[+new Date,t,N,t.screen,S(n)]}}function S(_){return String.fromCharCode.apply(0,_)}if(v(r.random(),n),e.exports){e.exports=g;try{f=Tm}catch{}}else r["seed"+a]=g})(typeof self<"u"?self:Im,[],Math)})(pn)),pn.exports}var Hn,vs;function Am(){if(vs)return Hn;vs=1;var e=dm(),t=gm(),n=bm(),r=ym(),s=Em(),o=xm(),i=_m();return i.alea=e,i.xor128=t,i.xorwow=n,i.xorshift7=r,i.xor4096=s,i.tychei=o,Hn=i,Hn}var qr=Am();/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */const Dm=.001,Uc=.1;function Nm(e,t,n){return n==null&&(n=Ur()),wr(e,t,(r,s)=>Gr(r,s,n))}function Ur(){return w.backend.floatPrecision()===32?Dm:Uc}function wr(e,t,n){let r=!0;if((it(e)||it(t))&&(r=!1),it(e)&&it(t)&&(r=!0),r){const i=e.constructor.name,a=t.constructor.name;if(i!==a)throw new Error(`Arrays are of different type. Actual: ${i}. Expected: ${a}`)}if(Array.isArray(e)&&Array.isArray(t)){const i=_t(e),a=_t(t);if(!Ft(i,a))throw new Error(`Arrays have different shapes. Actual: [${i}]. Expected: [${a}]`)}const s=it(e)?e:zt(e),o=it(t)?t:zt(t);if(s.length!==o.length)throw new Error(`Arrays have different lengths actual: ${s.length} vs expected: ${o.length}.
Actual:   ${s}.
Expected: ${o}.`);for(let i=0;i<o.length;++i){const a=s[i],c=o[i];if(!n(a,c))throw new Error(`Arrays differ: actual[${i}] = ${a}, expected[${i}] = ${c}.
Actual:   ${s}.
Expected: ${o}.`)}typeof expect<"u"&&expect().nothing()}function Mm(e,t){e().then(()=>t.fail(),()=>t()),typeof expect<"u"&&expect().nothing()}function Fm(e,t){const n=typeof t=="string"||typeof t=="number"||typeof t=="boolean"?[t]:t;return Lt(e)||Lt(e[0])||Lt(t)||Lt(t[0])?wr(e,n,(r,s)=>r==s):wr(e,t,(r,s)=>Gr(r,s,0))}function Bm(e,t,n){if(n==null&&(n=Ur()),!Gr(e,t,n))throw new Error(`Numbers differ: actual === ${e}, expected === ${t}`);typeof expect<"u"&&expect().nothing()}function Gr(e,t,n){return!isFinite(e)&&!isFinite(t)?!0:!(isNaN(e)||isNaN(t)||Math.abs(e-t)>n)}function Rm(e,t,n){for(let r=0;r<e.length;r++)if(e[r]<t||e[r]>n)throw new Error(`Value out of range:${e[r]} low: ${t}, high: ${n}`)}function Cm(e,t){const n=new Float32Array(e),r=new Float32Array(t);if(n.length!==r.length)throw new Error(`Expected ArrayBuffer to be of length ${r.length}, but it was ${n.length}`);for(let s=0;s<r.length;s++)if(n[s]!==r[s])throw new Error(`Expected ArrayBuffer value at ${s} to be ${r[s]} but got ${n[s]} instead`)}function Gc(e){for(let t=0;t<e.length;t++){const n=e[t];Array.isArray(n)?Gc(n):e[t]=He(n)}return e}function Pm(e){const t=document.createElement("video");return"playsInline"in t&&(t.playsInline=!0),t.muted=!0,t.loop=!0,t.style.position="fixed",t.style.left="0px",t.style.top="0px",t.preload="auto",t.appendChild(e),new Promise(n=>{t.addEventListener("loadeddata",r=>n(t)),t.load()})}async function Om(e){await e.play(),"requestVideoFrameCallback"in e&&await new Promise(t=>{e.requestVideoFrameCallback(t)})}const Lm=Object.freeze(Object.defineProperty({__proto__:null,TEST_EPSILON_FLOAT16:Uc,createVideoElement:Pm,encodeStrings:Gc,expectArrayBuffersEqual:Cm,expectArraysClose:Nm,expectArraysEqual:Fm,expectNumbersClose:Bm,expectPromiseToFail:Mm,expectValuesInRange:Rm,play:Om,testEpsilon:Ur},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class zr{constructor(t,n,r,s,o){this.mean=t,this.stdDev=n,this.dtype=r,this.nextVal=NaN,this.truncated=s,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);const i=o||Math.random();this.random=qr.alea(i.toString())}nextValue(){if(!isNaN(this.nextVal)){const s=this.nextVal;return this.nextVal=NaN,s}let t,n,r=!1;for(;!r;){let s,o,i;do s=2*this.random()-1,o=2*this.random()-1,i=s*s+o*o;while(i>=1||i===0);const a=Math.sqrt(-2*Math.log(i)/i);t=this.mean+this.stdDev*s*a,n=this.mean+this.stdDev*o*a,(!this.truncated||this.isValidTruncated(t))&&(r=!0)}return(!this.truncated||this.isValidTruncated(n))&&(this.nextVal=this.convertValue(n)),this.convertValue(t)}convertValue(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)}isValidTruncated(t){return t<=this.upper&&t>=this.lower}}class Wm{constructor(t,n,r,s){this.alpha=t,this.beta=1/n,this.dtype=r;const o=s||Math.random();this.randu=qr.alea(o.toString()),this.randn=new zr(0,1,r,!1,this.randu()),t<1?this.d=t+2/3:this.d=t-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let t,n,r,s,o,i;for(;;){do s=this.randn.nextValue(),i=1+this.c*s;while(i<=0);if(i*=i*i,t=s*s,n=1-.331*t*t,r=.5*t+this.d*(1-i+Math.log(i)),o=this.randu(),o<n||Math.log(o)<r)break}return i=1/this.beta*this.d*i,this.alpha<1&&(i*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(i)}convertValue(t){return this.dtype==="float32"?t:Math.round(t)}}class qm{constructor(t=0,n=1,r,s){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=t,this.range=n-t,this.dtype=r,s==null&&(s=Math.random()),typeof s=="number"&&(s=s.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${t} - ${n} <= 1 and dtype is not float`);this.random=qr.alea(s)}convertValue(t){return this.canReturnFloat()?t:Math.round(t)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}/**
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
 */function Um(e,t,n=1,r="float32",s){if(mt(e),n==null&&(n=1),r==null&&(r="float32"),r!=="float32"&&r!=="int32")throw new Error(`Unsupported data type ${r}`);const o=new Wm(t,n,r,s),i=Nt(e,r);for(let a=0;a<i.values.length;a++)i.values[a]=o.nextValue();return i.toTensor()}const Gm=b({randomGamma_:Um});/**
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
 */function zm(e,t=0,n=1,r,s){if(mt(e),r!=null&&r==="bool")throw new Error(`Unsupported data type ${r}`);const o=new zr(t,n,r,!1,s),i=Nt(e,r);for(let a=0;a<i.values.length;a++)i.values[a]=o.nextValue();return i.toTensor()}const zc=b({randomNormal_:zm});/**
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
 */function Km(e,t,n){if(t!=null&&t==="bool")throw new Error(`Unsupported data type ${t}`);return zc(e,0,1,t,n)}const jm=b({randomStandardNormal_:Km});/**
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
 */function Vm(e,t=0,n=1,r="float32",s){mt(e);const o=Nt(e,r),i=new qm(t,n,null,s);for(let a=0;a<o.values.length;a++)o.values[a]=i.nextValue();return o.toTensor()}const Kr=b({randomUniform_:Vm});/**
 * @license
 * Copyright 2023 Google LLC.
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
 */function Hm(e,t,n,r){return Kr(e,t,n,"int32",r)}const Xm=b({randomUniformInt_:Hm});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function qe(e,t,n=1,r="float32"){if(n===0)throw new Error("Cannot have a step of zero");const s={start:e,stop:t,step:n,dtype:r};return w.runKernel(qi,{},s)}/**
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
 */function Zm(e){const n={input:d(e,"input","real")};return w.runKernel(Ui,n)}const Ue=b({real_:Zm});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ym(e){const n={x:d(e,"x","reciprocal")};return w.runKernel(Gi,n)}const Jm=b({reciprocal_:Ym});/**
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
 */function Qm(e){const n={x:d(e,"x","relu")};return w.runKernel(zi,n)}const Cn=b({relu_:Qm});/**
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
 */function tb(e){const n={x:d(e,"x","relu6")};return w.runKernel(Hi,n)}const Kc=b({relu6_:tb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function eb(e,t){const r={x:d(e,"x","reverse")},s={dims:t};return w.runKernel(Xi,r,s)}const ie=b({reverse_:eb});/**
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
 */function nb(e){const t=d(e,"x","reverse");return p(t.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`),ie(t,0)}const rb=b({reverse1d_:nb});/**
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
 */function sb(e,t){const n=d(e,"x","reverse");return p(n.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`),ie(n,t)}const ob=b({reverse2d_:sb});/**
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
 */function ib(e,t){const n=d(e,"x","reverse");return p(n.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`),ie(n,t)}const ab=b({reverse3d_:ib});/**
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
 */function cb(e,t){const n=d(e,"x","reverse");return p(n.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`),ie(n,t)}const ub=b({reverse4d_:cb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function lb(e){const n={x:d(e,"x","round")};return w.runKernel(Zi,n)}const jc=b({round_:lb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function hb(e){const n={x:d(e,"x","rsqrt","float32")};return w.runKernel(Yi,n)}const fb=b({rsqrt_:hb});/**
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
 */function db(e){const n={x:d(e,"x","selu")};return w.runKernel(na,n)}const pb=b({selu_:db});function gb(e,t,n,r,s,o=[1,1],i="NHWC"){const a=d(e,"x","separableConv2d"),c=d(t,"depthwiseFilter","separableConv2d"),u=d(n,"pointwiseFilter","separableConv2d");let h=a,l=!1;if(a.rank===3&&(l=!0,h=T(a,[1,a.shape[0],a.shape[1],a.shape[2]])),i==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");p(h.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${h.rank}.`),p(c.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${c.rank}.`),p(u.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${c.rank}.`),p(u.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${u.shape[0]}.`),p(u.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${u.shape[1]}.`);const f=c.shape[2],g=c.shape[3];p(u.shape[2]===f*g,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${f*g}, but got ${u.shape[2]}.`);const y=Cr(h,c,r,s,i,o),E=Nn(y,u,1,"valid",i);return l?T(E,[E.shape[1],E.shape[2],E.shape[3]]):E}const mb=b({separableConv2d_:gb});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
 */async function bb(e,t){const n=d(e,"x","setdiff1d"),r=d(t,"y","setdiff1d");p(n.dtype===r.dtype,()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${r.dtype}).`),p(n.rank===1,()=>`x should be 1D tensor, but got x (${n.shape}).`),p(r.rank===1,()=>`y should be 1D tensor, but got y (${r.shape}).`);const s=await n.data(),o=await r.data(),i=new Set(o);let a=0;for(let h=0;h<s.length;h++)i.has(s[h])||a++;const c=new $n([a],n.dtype),u=new $n([a],"int32");for(let h=0,l=0;h<s.length;h++)i.has(s[h])||(c.values[l]=s[h],u.values[l]=h,l++);return[c.toTensor(),u.toTensor()]}const wb=bb;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function yb(e){const n={x:d(e,"x","sign")};return w.runKernel(ia,n)}const $b=b({sign_:yb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Eb(e){const n={x:d(e,"x","sin","float32")};return w.runKernel(sa,n)}const kb=b({sin_:Eb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function xb(e){const n={x:d(e,"x","sinh")};return w.runKernel(oa,n)}const vb=b({sinh_:xb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Sb(e,t,n){const r=d(e,"x","slice1d");return p(r.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${r.rank} tensor`),X(r,[t],[n])}const Tb=b({slice1d_:Sb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ib(e,t,n){const r=d(e,"x","slice2d");return p(r.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`),X(r,t,n)}const _b=b({slice2d_:Ib});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ab(e,t,n){const r=d(e,"x","slice3d");return p(r.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${r.rank} tensor`),X(r,t,n)}const Db=b({slice3d_:Ab});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Nb(e,t=-1){const n=d(e,"logits","softmax","float32");if(t===-1&&(t=n.rank-1),t!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${t}`);const r={logits:n},s={dim:t};return w.runKernel(da,r,s)}const Mb=b({softmax_:Nb});/**
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
 */function Fb(e){p(e.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${e.dtype}.`);const t={input:e};return w.runKernel(Go,t)}const jr=b({fft_:Fb});/**
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
 */function Bb(e){p(e.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${e.dtype}.`);const t={input:e};return w.runKernel(Qo,t)}const vn=b({ifft_:Bb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Rb(e){const t=e.shape[e.shape.length-1],n=e.size/t;let r;if(t<=2){const s=T(e,[n,t]);r=vn(s)}else{const s=[n,2*(t-1)],o=T(Ue(e),[n,t]),i=T(Bn(e),[n,t]),a=ie(X(o,[0,1],[n,t-2]),1),c=D(ie(X(i,[0,1],[n,t-2]),1),z(-1)),u=gt([o,a],1),h=gt([i,c],1),l=T(Kt(u,h),[s[0],s[1]]);r=vn(l)}if(r=Ue(r),e.rank===3&&e.shape[0]!==0){const s=r,o=e.shape[0];r=T(r,[o,r.shape[0]/o,r.shape[1]]),s.dispose()}return r}const Vc=b({irfft_:Rb});/**
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
 */function Cb(e,t,n=0){const s={x:d(e,"x","split")},o={numOrSizeSplits:t,axis:n};return w.runKernel(fa,s,o)}const Ge=b({split_:Cb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Pb(e,t){p(e.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${e.dtype}`);let n=e.shape[e.shape.length-1];const r=e.size/n;let s;if(t!=null&&t<n){const y=e.shape.map(E=>0),$=e.shape.map(E=>E);$[e.shape.length-1]=t,s=X(e,y,$),n=t}else if(t!=null&&t>n){const y=e.shape.map($=>$);y[e.shape.length-1]=t-n,s=gt([e,Ee(y)],e.shape.length-1),n=t}else s=e;const o=yt(s),i=T(Kt(s,o),[r,n]),a=jr(i),c=Math.floor(n/2)+1,u=Ue(a),h=Bn(a),l=Ge(u,[c,n-c],u.shape.length-1),f=Ge(h,[c,n-c],h.shape.length-1),g=s.shape.slice();return g[s.shape.length-1]=c,T(Kt(l[0],f[0]),g)}const Vr=b({rfft_:Pb});/**
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
 */function Ob(e,t){let n=d(e,"a","squaredDifference"),r=d(t,"b","squaredDifference");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r},o={};return w.runKernel(ya,s,o)}const Hc=b({squaredDifference_:Ob});/**
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
 */function Lb(e,t){const n=d(e,"x","squeeze","string_or_numeric");return T(n,Cs(n.shape,t).newShape)}const Hr=b({squeeze_:Lb});/**
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
 */function Wb(e,t=0){const n=Re(e,"tensors","stack","string_or_numeric");p(n.length>=1,()=>"Pass at least one tensor to tf.stack"),n.length>0&&p(t<=n[0].rank,()=>"Axis must be <= rank of the tensor");const r=n,s={axis:t};return w.runKernel(Fi,r,s)}const ze=b({stack_:Wb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function qb(e,t=0){const r={x:d(e,"x","step")},s={alpha:t};return w.runKernel(Ba,r,s)}const Xc=b({step_:qb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ub(e,t,n,r,s=0,o=0,i=0,a=0,c=0){const h={x:d(e,"x","stridedSlice","string_or_numeric")},l={begin:t,end:n,strides:r,beginMask:s,endMask:o,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:c};return w.runKernel(Ea,h,l)}const Gb=b({stridedSlice_:Ub});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function zb(e){const n={x:d(e,"x","tan","float32")};return w.runKernel(Ta,n)}const Kb=b({tan_:zb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Ae(e,t,n){if(ce(e),t!=null&&t.length!==2)throw new Error("tensor2d() requires shape to have two numbers");const r=_t(e,n);if(r.length!==2&&r.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return Vt(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Zc(e,t,n){if(ce(e),t!=null&&t.length!==3)throw new Error("tensor3d() requires shape to have three numbers");const r=_t(e,n);if(r.length!==3&&r.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return Vt(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function jb(e,t,n){if(ce(e),t!=null&&t.length!==4)throw new Error("tensor4d() requires shape to have four numbers");const r=_t(e,n);if(r.length!==4&&r.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return Vt(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Vb(e,t,n){if(ce(e),t!=null&&t.length!==5)throw new Error("tensor5d() requires shape to have five numbers");const r=_t(e,n);if(r.length!==5&&r.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return Vt(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Hb(e,t,n){if(ce(e),t!=null&&t.length!==6)throw new Error("tensor6d() requires shape to have six numbers");const r=_t(e,n);if(r.length!==6&&r.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return t=t||r,Vt(e,t,r,n)}function Xr(e,t,n){const r=t.rank>1?t.shape[t.rank-1]:1,s=t.rank>1?t.rank-1:1,o=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${t.shape}, shape: ${e}, sliceDim: ${r}, and batchDim: ${s}.`;if(n.rank<s)throw new Error(o+` update.rank < ${s}. `);if(e.length<r+(n.rank-s))throw new Error(o+` Output shape length < ${r+(n.rank-s)}`);if(n.rank!==s+e.length-r)throw new Error(o+` update.rank != ${s+e.length-r}`);for(let i=0;i<s;++i)if(n.shape[i]!==t.shape[i])throw new Error(o+` updates.shape[${i}] (${n.shape[i]}) != indices.shape[${i}] (${t.shape[i]}).`);for(let i=0;i<n.rank-s;++i)if(n.shape[i+s]!==e[i+r])throw new Error(o+` updates.shape[${i+s}] (${n.shape[i+s]}) != shape[${i+s}] (${e[i+s]})`)}function Pn(e,t,n){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${e.rank}.`);if(t.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(n.length===0){if(t.size===0)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(e.size===0)throw new Error(`Updates specified for empty output. updates shape: ${e.shape}`)}Xr(n,t,e)}function Yc(e,t,n){const r=t.shape.length,s=r>1?t.shape[r-1]:1,o=n.length;let i=1;for(let l=s;l<o;++l)i*=n[l];const a=s<1?1:s,c=G(t.shape)/a,u=[...ke(n.slice(0,s)),1],h=G(n);return{sliceRank:s,numUpdates:c,sliceSize:i,strides:u,outputSize:h}}const Xb=Object.freeze(Object.defineProperty({__proto__:null,calculateShapes:Yc,validateInput:Pn,validateUpdateShape:Xr},Symbol.toStringTag,{value:"Module"}));/**
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
 */function Zb(e,t,n){const r=d(e,"tensor","tensorScatterupdate"),s=d(t,"indices","tensorScatterupdate","int32"),o=d(n,"updates","tensorScatterupdate");if(Pn(o,s,r.shape),r.dtype!==o.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${r.dtype} and ${o.dtype}.`);const i={tensor:r,indices:s,updates:o},a={};return w.runKernel(Qi,i,a)}const Yb=b({tensorScatterUpdate_:Zb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Jb(e,t=1,n=!0){const r=d(e,"x","topk");if(r.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");const s=r.shape[r.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>s)throw new Error(`'k' passed to topk() must be <= the last dimension (${s}) but got ${t}`);const o={x:r},i={k:t,sorted:n},[a,c]=w.runKernel(_a,o,i);return{values:a,indices:c}}const Qb=b({topk_:Jb});/**
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
 */function tw(e,t=0,n=1,r,s){if(mt(e),r!=null&&r==="bool")throw new Error("Unsupported data type $ { dtype }");const o=new zr(t,n,r,!0,s),i=Nt(e,r);for(let a=0;a<i.values.length;a++)i.values[a]=o.nextValue();return i.toTensor()}const ew=b({truncatedNormal_:tw});/**
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
 */function nw(e,t=0){const n=d(e,"x","unique","string_or_numeric");p(n.rank>0,()=>"The input tensor must be at least 1D");const r={x:n},s={axis:t},[o,i]=w.runKernel(Da,r,s);return{values:o,indices:i}}const rw=b({unique_:nw});/**
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
 */function sw(e,t,n){const r=d(e,"x","unsortedSegmentSum"),s=d(t,"segmentIds","unsortedSegmentSum","int32");p(we(n),()=>"numSegments must be of dtype int");const o={x:r,segmentIds:s},i={numSegments:n};return w.runKernel(Ma,o,i)}const ow=b({unsortedSegmentSum_:sw});/**
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
 */function iw(e,t=0){const n=d(e,"x","unstack","string_or_numeric");p(t>=-n.shape.length&&t<n.shape.length,()=>`Axis = ${t} is not in [-${n.shape.length}, ${n.shape.length})`);const r={value:n},s={axis:t};return w.runKernel(Na,r,s)}const Zr=b({unstack_:iw});/**
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
 */function aw(e,t){return Wr(e,t,"right")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function cw(e,t=!0,n,r){return w.makeVariable(e,t,n,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function Jc(e,t){const n=[];for(let o=0;o<t.length;o++)t[o]&&n.push(o);const r=Nt(e,"int32"),s=Nt([n.length,e.length],"int32");for(let o=0;o<n.length;o++){const i=r.indexToLoc(n[o]),a=o*e.length;s.values.set(i,a)}return s.toTensor()}/**
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
 */async function uw(e){const t=d(e,"condition","whereAsync","bool"),n=await t.data(),r=Jc(t.shape,n);return e!==t&&t.dispose(),r}const Qc=uw;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */async function lw(e,t,n){const r=d(e,"tensor","boolMask"),s=d(t,"mask","boolMask","bool"),o=n??0,i=s.rank,a=r.shape;p(i>0,()=>"mask cannot be scalar"),ht(a.slice(o,o+i),s.shape,"mask's shape must match the first K dimensions of tensor's shape,");let c=1;for(let $=o;$<o+i;$++)c*=a[$];const u=a.slice(0,o).concat([c],a.slice(o+i)),h=T(r,u),l=T(s,[-1]),f=await Qc(l),g=Hr(f,[1]),y=_c(h,g,o);return e!==r&&r.dispose(),t!==s&&s.dispose(),g.dispose(),h.dispose(),l.dispose(),f.dispose(),y}const hw=lw;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function fw(e,t,n){const r=d(e,"x","transpose");if(t==null&&(t=r.shape.map((i,a)=>a).reverse()),p(r.rank===t.length,()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${t}.`),t.forEach(i=>{p(i>=0&&i<r.rank,()=>`All entries in 'perm' must be between 0 and ${r.rank-1} but got ${t}`)}),r.rank<=1)return r.clone();const s={x:r},o={perm:t};return r.dtype==="complex64"?nt(()=>{let i=Ue(r),a=Bn(r);return i=w.runKernel(rn,{x:i},o),a=w.runKernel(rn,{x:a},o),n&&(a=It(a)),Kt(i,a)}):w.runKernel(rn,s,o)}const Sn=b({transpose_:fw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function dw(e,t,n,r,s=!0){const o=d(e,"v","movingAverage"),i=d(t,"x","movingAverage"),a=d(n,"decay","movingAverage");ja(o,i),p(Ft(o.shape,i.shape),()=>"Shape mismatch in v and x");const c=z(1),u=W(c,a);let h=D(W(i,o),u);if(s){p(r!=null,()=>"When using zeroDebias: true, step is required.");const l=d(r,"step","movingAverage");h=V(h,W(c,Le(a,l)))}return P(o,h)}const pw=b({movingAverage_:dw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function gw(e,t,n){mt(n);const r=d(e,"indices","scatterND","int32"),s=d(t,"updates","scatterND");Pn(s,r,n);const o={indices:r,updates:s},i={shape:n};return w.runKernel(Ji,o,i)}const mw=b({scatterND_:gw});function bw(e,t,n,r){if(e.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${e.shape}.`);const s=e.rank>0?e.shape[0]:1,o=e.rank>1?e.shape[1]:1;if(n.length!==o)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${o}.`);const i=t.size;if(!(t.rank===0||t.rank===1&&i===s))throw new Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${s}]`);if(t.dtype!==r.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function ww(e,t,n,r=0){mt(n);const s=d(e,"sparseIndices","sparseToDense","int32"),o=d(t,"sparseValues","sparseToDense","string_or_numeric"),i=d(r,"defaultValue","sparseToDense",o.dtype);bw(s,o,n,i);const a={sparseIndices:s,sparseValues:o,defaultValue:i},c={outputShape:n};return w.runKernel(wa,a,c)}const yw=b({sparseToDense_:ww});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function $w(e,t){const n=d(t,"indices","gatherND","int32"),s={params:d(e,"x","gatherND","string_or_numeric"),indices:n};return w.runKernel(Zo,s)}const Ew=b({gatherND_:$w});/**
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
 */function kw(e,t){if(t==null)return e.shape.slice();if(Ft(e.shape,t))return t;if(e.shape.length===t.length){const n=[];for(let r=0;r<e.shape.length;r++)t[r]==null&&e.shape[r]!=null?n.push(e.shape[r]):n.push(t[r]);return n}return t}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function xw(e,t,n,r){const s=d(e,"x","dropout");if(p(s.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${s.dtype} tensor instead.`),p(t>=0&&t<1,()=>`rate must be a float in the range [0, 1), but got ${t}.`),t===0)return e instanceof et?s.clone():s;const o=kw(s,n),i=1-t,a=V(Ic(P(Kr(o,0,1,"float32",r),i)),i);return D(s,a)}const vw=b({dropout_:xw});/**
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
 */function tu(e){return Math.floor(Math.pow(2,Math.ceil(Math.log(e)/Math.log(2))))}function Yr(e,t,n){const r=1-e%2,s=new Float32Array(e);for(let o=0;o<e;++o){const i=2*Math.PI*o/(e+r-1);s[o]=t-n*Math.cos(i)}return Et(s,"float32")}/**
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
 */async function Sw(e,t,n=1){const r=d(e,"predictions","inTopK"),s=d(t,"targets","inTopK");p(r.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${r.rank}`),p(r.rank-1===s.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${r.rank} and targets rank ${s.rank}`),ht(r.shape.slice(0,r.shape.length-1),s.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const o=r.shape[r.shape.length-1];p(n>0&&n<=o,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${o}), but got ${n}`);const i=await r.data(),a=await s.data(),[c,u]=[i.length/o,o],h=Ps("bool",c);for(let l=0;l<c;l++){const f=l*u,g=i.subarray(f,f+u),y=[];for(let $=0;$<g.length;$++)y.push({value:g[$],index:$});y.sort(($,E)=>E.value-$.value),h[l]=0;for(let $=0;$<n;$++)if(y[$].index===a[l]){h[l]=1;break}}return e!==r&&r.dispose(),t!==s&&s.dispose(),de(h,s.shape,"bool")}const Tw=Sw;/**
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
 */function Iw(e,t,n,r,s,o="NHWC",i){let a=e;e.rank===3&&(a=T(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=T(t,[1,t.shape[0],t.shape[1],t.shape[2]])),p(a.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${a.shape}.`),p(c.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${c.shape}.`),p(n.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`);const u=o==="NHWC"?a.shape[3]:a.shape[1],h=o==="NHWC"?c.shape[3]:c.shape[1];p(u===n[2],()=>`Error in conv2dDerFilter: depth of input ${u}) must match input depth in filter (${n[2]}.`),p(h===n[3],()=>`Error in conv2dDerFilter: depth of dy (${h}) must match output depth for filter (${n[3]}).`),kt("conv2dDerFilter",s,i);const l={x:a,dy:c},f={strides:r,pad:s,dataFormat:o,dimRoundingMode:i,filterShape:n};return w.runKernel(yo,l,f)}const _w=b({conv2DBackpropFilter_:Iw});/**
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
 */function On(e,t,n){if(n==null||n==="linear")return e;if(n==="relu")return D(e,Xc(t));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function Ln(e,t){let n=t;const r=Pr(e.shape,t.shape);return r.length>0&&(n=j(n,r)),T(n,e.shape)}function Wn(e,t,n,r){if(t==="linear")return e;if(t==="relu")return Cn(e);if(t==="elu")return xc(e);if(t==="relu6")return Kc(e);if(t==="prelu")return qc(e,n);if(t==="leakyrelu")return Dc(e,r);if(t==="sigmoid")return me(e);throw new Error(`Unknown fused activation ${t}.`)}const qn=(e,t)=>!(e>0)||t==="linear";/**
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
 */function Aw({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:o=[1,1],dimRoundingMode:i,bias:a,activation:c="linear",preluActivationWeights:u,leakyreluAlpha:h}){if(c=c||"linear",qn(w.state.gradientDepth,c)===!1){p(s==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${s} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let N=Nn(e,t,n,r,s,o,i);return a!=null&&(N=P(N,a)),Wn(N,c,u,h)}const l=d(e,"x","conv2d","float32"),f=d(t,"filter","conv2d","float32");let g=l,y=!1;l.rank===3&&(y=!0,g=T(l,[1,l.shape[0],l.shape[1],l.shape[2]])),p(g.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${g.rank}.`),p(f.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${f.rank}.`),kt("fused conv2d",r,i);const $=s==="NHWC"?g.shape[3]:g.shape[1];p(f.shape[2]===$,()=>`Error in conv2d: depth of input (${$}) must match input depth for filter ${f.shape[2]}.`),p(Bt(n,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`);const E=Ye(g.shape,f.shape,n,o,r,i);let v;a!=null&&(v=d(a,"bias","fused conv2d"),[v]=J(v,l),s==="NHWC"?rt(E.outShape,v.shape):(p(v.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${v.shape.length}.`),p(v.shape.length===0||v.shape[0]===E.outChannels||v.shape[0]===1,()=>`Error in fused conv2d: bias shape (${v.shape}) is not compatible with the number of output channels (${E.outChannels})`)));let B;if(u!=null){const N=u.shape;if(p(N.length<=1||N.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${N.length}.`),N.length===1)p(N[0]===1||N[0]===E.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${N}) is not compatible with the number of output channels (${E.outChannels}).`);else if(N.length===3)try{rt(N,E.outShape)}catch{const M=`Error in fused conv2d: PReLU activation weights (${N}) is not compatible with the output shape of the conv2d (${E.outShape}).`;throw Error(M)}B=d(u,"prelu weights","fused conv2d")}const S=(N,R)=>{p(s==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${s} but only NHWC is currently supported.`);const[M,x,k,m]=R,I=On(N,k,c);p(Oe(o),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${o}'`);const F=$c(x.shape,I,M,n,r),C=_w(x,I,M.shape,n,r),O=[F,C];if(m!=null){const q=Ln(m,I);O.push(q)}return O},_={x:g,filter:f,bias:v,preluActivationWeights:B},A={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:i,activation:c,leakyreluAlpha:h};return a==null?At((R,M,x)=>{let k=w.runKernel(Qn,_,A);return x([M,R,k]),y&&(k=T(k,[k.shape[1],k.shape[2],k.shape[3]])),{value:k,gradFunc:S}})(g,f):At((R,M,x,k)=>{let m=w.runKernel(Qn,_,A);return k([M,R,m,x]),y&&(m=T(m,[m.shape[1],m.shape[2],m.shape[3]])),{value:m,gradFunc:S}})(g,f,v)}const Dw=b({fusedConv2d_:Aw});/**
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
 */function Nw(e,t,n,r,s,o=[1,1],i){let a=e;e.rank===3&&(a=T(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=T(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const u={x:a,dy:c},h={strides:r,pad:s,dimRoundingMode:i,dilations:o,filterShape:n};return w.runKernel(No,u,h)}const Mw=b({depthwiseConv2dNativeBackpropFilter_:Nw});/**
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
 */function Fw(e,t,n,r,s,o=[1,1],i){let a=t,c=!1;t.rank===3&&(c=!0,a=T(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const u={dy:a,filter:n},h={strides:r,pad:s,dimRoundingMode:i,dilations:o,inputShape:e},l=w.runKernel(Mo,u,h);return c?T(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Bw=b({depthwiseConv2dNativeBackpropInput_:Fw});/**
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
 */function Rw({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:o=[1,1],dimRoundingMode:i,bias:a,activation:c="linear",preluActivationWeights:u,leakyreluAlpha:h}){if(qn(w.state.gradientDepth,c)===!1){let A=Cr(e,t,n,r,s,o,i);return a!=null&&(A=P(A,a)),Wn(A,c,u,h)}const l=d(e,"x","depthwiseConv2d","float32"),f=d(t,"filter","depthwiseConv2d","float32");let g=l,y=!1;l.rank===3&&(y=!0,g=T(l,[1,l.shape[0],l.shape[1],l.shape[2]])),p(g.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${g.rank}.`),p(f.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${f.rank}.`),p(g.shape[3]===f.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${g.shape[3]}) must match the inChannels dimension in filter ${f.shape[2]}.`),o==null&&(o=[1,1]),p(Bt(n,o),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),kt("fused depthwiseConv2d",r,i);const $=Ye(g.shape,f.shape,n,o,r,i,!0);let E;a!=null&&(E=d(a,"bias","fused conv2d"),[E]=J(E,l),rt($.outShape,E.shape));let v;u!=null&&(v=d(u,"prelu weights","fused depthwiseConv2d"));const B=(A,N)=>{p(Oe(o),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${o}'`);const[R,M,x,k]=N,m=On(A,x,c),I=Bw(M.shape,m,R,n,r,o,i),F=Mw(M,m,R.shape,n,r,o,i);if(k!=null){const C=Ln(E,m);return[I,F,C]}return[I,F]},S={x:g,filter:f,bias:E,preluActivationWeights:v},_={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:i,activation:c,leakyreluAlpha:h};return a==null?At((N,R,M)=>{let x=w.runKernel(tr,S,_);return M([R,N,x]),y&&(x=T(x,[x.shape[1],x.shape[2],x.shape[3]])),{value:x,gradFunc:B}})(g,f):At((N,R,M,x)=>{let k=w.runKernel(tr,S,_);return x([R,N,k,M]),y&&(k=T(k,[k.shape[1],k.shape[2],k.shape[3]])),{value:k,gradFunc:B}})(g,f,E)}const Cw=b({fusedDepthwiseConv2d_:Rw});/**
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
 */function Pw({a:e,b:t,transposeA:n=!1,transposeB:r=!1,bias:s,activation:o="linear",preluActivationWeights:i,leakyreluAlpha:a=.2}){if(qn(w.state.gradientDepth,o)===!1){let m=U(e,t,n,r);return s!=null&&(m=P(m,s)),Wn(m,o,i,a)}let c=d(e,"a","fused matMul"),u=d(t,"b","fused matMul");[c,u]=J(c,u);const h=n?c.shape[c.rank-2]:c.shape[c.rank-1],l=r?u.shape[u.rank-1]:u.shape[u.rank-2],f=n?c.shape[c.rank-1]:c.shape[c.rank-2],g=r?u.shape[u.rank-2]:u.shape[u.rank-1],y=c.shape.slice(0,-2),$=u.shape.slice(0,-2),E=G(y),v=G($);p(h===l,()=>`Error in fused matMul: inner shapes (${h}) and (${l}) of Tensors with shapes ${c.shape} and ${u.shape} and transposeA=${n} and transposeB=${r} must match.`);const S=rt(c.shape.slice(0,-2),u.shape.slice(0,-2)).concat([f,g]),_=n?T(c,[E,h,f]):T(c,[E,f,h]),A=r?T(u,[v,g,l]):T(u,[v,l,g]);let N;s!=null&&(N=d(s,"bias","fused matMul"),[N]=J(N,c),rt(S,N.shape));let R;i!=null&&(R=d(i,"prelu weights","fused matMul"));const M=(m,I)=>{const[F,C,O,q]=I,Z=On(T(m,O.shape),O,o);let st,Q;if(!n&&!r?(st=U(Z,C,!1,!0),Q=U(F,Z,!0,!1)):!n&&r?(st=U(Z,C,!1,!1),Q=U(Z,F,!0,!1)):n&&!r?(st=U(C,Z,!1,!0),Q=U(F,Z,!1,!1)):(st=U(C,Z,!0,!0),Q=U(Z,F,!0,!0)),s!=null){const tt=Ln(q,Z);return[st,Q,tt]}else return[st,Q]},x={a:_,b:A,bias:N,preluActivationWeights:R},k={transposeA:n,transposeB:r,activation:o,leakyreluAlpha:a};return s==null?At((I,F,C)=>{const O=w.runKernel(Jn,x,k);return C([I,F,O]),{value:T(O,S),gradFunc:M}})(_,A):At((I,F,C,O)=>{const q=w.runKernel(Jn,x,k);return O([I,F,q,C]),{value:T(q,S),gradFunc:M}})(_,A,N)}const Ow=b({fusedMatMul_:Pw});/**
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
 */const Lw=Object.freeze(Object.defineProperty({__proto__:null,conv2d:Dw,depthwiseConv2d:Cw,matMul:Ow},Symbol.toStringTag,{value:"Module"}));/**
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
 */function Ww(e){return Yr(e,.54,.46)}const qw=b({hammingWindow_:Ww});/**
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
 */function Uw(e){return Yr(e,.5,.5)}const eu=b({hannWindow_:Uw});/**
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
 */function Gw(e,t,n,r=!1,s=0){let o=0;const i=[];for(;o+t<=e.size;)i.push(X(e,o,t)),o+=n;if(r)for(;o<e.size;){const a=o+t-e.size,c=gt([X(e,o,t-a),Je([a],s)]);i.push(c),o+=n}return i.length===0?Ae([],[0,t]):T(gt(i),[i.length,t])}const nu=b({frame_:Gw});/**
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
 */function zw(e,t,n,r,s=eu){r==null&&(r=tu(t));const o=nu(e,t,n),i=D(o,s(t));return Vr(i,r)}const Kw=b({stft_:zw});/**
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
 */function jw(e,t,n,r,s="bilinear",o=0){const i=d(e,"image","cropAndResize"),a=d(t,"boxes","cropAndResize","float32"),c=d(n,"boxInd","cropAndResize","int32"),u=a.shape[0];p(i.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${i.rank}.`),p(a.rank===2&&a.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${u},4] but had shape ${a.shape}.`),p(c.rank===1&&c.shape[0]===u,()=>`Error in cropAndResize: boxInd must be have size [${u}] but had shape ${a.shape}.`),p(r.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${r.length}.`),p(r[0]>=1&&r[1]>=1,()=>`cropSize must be atleast [1,1], but was ${r}`),p(s==="bilinear"||s==="nearest",()=>`method must be bilinear or nearest, but was ${s}`);const h={image:i,boxes:a,boxInd:c},l={method:s,extrapolationValue:o,cropSize:r};return w.runKernel(Io,h,l)}const Vw=b({cropAndResize_:jw});/**
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
 */function Hw(e){const t=d(e,"image","flipLeftRight","float32");p(t.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`);const n={image:t};return w.runKernel(Ko,n,{})}const Xw=b({flipLeftRight_:Hw});/**
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
 */function Zw(e){const t=d(e,"image","grayscaleToRGB"),n=t.rank-1,r=t.shape[n];p(t.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`),p(r===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${r}.`);const s=new Array(t.rank);return s.fill(1,0,n),s[n]=3,_e(t,s)}const Yw=b({grayscaleToRGB_:Zw});/**
 * @license
 * Copyright 2023 Google LLC.
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
 */function Jw(e){const t=d(e,"image","RGBToGrayscale"),n=t.rank-1,r=t.shape[n];p(t.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${t.rank}.`),p(r===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${r}.`);const s=t.dtype,o=H(t,"float32"),i=Et([.2989,.587,.114]);let a;switch(t.rank){case 2:a=he("ij,j->i",o,i);break;case 3:a=he("ijk,k->ij",o,i);break;case 4:a=he("ijkl,l->ijk",o,i);break;case 5:a=he("ijklm,m->ijkl",o,i);break;case 6:a=he("ijklmn,n->ijklm",o,i);break;default:throw new Error("Not a valid tensor rank.")}return a=Ct(a,-1),H(a,s)}const Qw=b({rgbToGrayscale_:Jw});/**
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
 */function t0(e,t,n=0,r=.5){const s=d(e,"image","rotateWithOffset","float32");p(s.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${s.rank}.`);const o={image:s},i={radians:t,fillValue:n,center:r};return w.runKernel(Ra,o,i)}const e0=b({rotateWithOffset_:t0});/**
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
 */function xe(e,t,n,r,s,o){r==null&&(r=.5),s==null&&(s=Number.NEGATIVE_INFINITY),o==null&&(o=0);const i=e.shape[0];return n=Math.min(n,i),p(0<=r&&r<=1,()=>`iouThreshold must be in [0, 1], but was '${r}'`),p(e.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${e.rank}'`),p(e.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${e.shape[1]}`),p(t.rank===1,()=>"scores must be a 1D tensor"),p(t.shape[0]===i,()=>`scores has incompatible shape with boxes. Expected ${i}, but was ${t.shape[0]}`),p(0<=o&&o<=1,()=>`softNmsSigma must be in [0, 1], but was '${o}'`),{maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:o}}/**
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
 */function n0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const o=d(e,"boxes","nonMaxSuppression","float32"),i=d(t,"scores","nonMaxSuppression","float32"),a=xe(o,i,n,r,s);n=a.maxOutputSize,r=a.iouThreshold,s=a.scoreThreshold;const c={maxOutputSize:n,iouThreshold:r,scoreThreshold:s};return w.runKernel(_i,{boxes:o,scores:i},c)}const r0=b({nonMaxSuppression_:n0});/**
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
 */function s0(e,t,n){const r=o0(e,t,n),s=r<0?-(r+1):r;e.splice(s,0,t)}function o0(e,t,n){return a0(e,t,n||i0)}function i0(e,t){return e>t?1:e<t?-1:0}function a0(e,t,n){let r=0,s=e.length,o=0,i=!1;for(;r<s;){o=r+(s-r>>>1);const a=n(t,e[o]);a>0?r=o+1:(s=o,i=!a)}return i?r:-r-1}/**
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
 */function ru(e,t,n,r,s){return Jr(e,t,n,r,s,0)}function su(e,t,n,r,s,o){return Jr(e,t,n,r,s,0,!1,o,!0)}function ou(e,t,n,r,s,o){return Jr(e,t,n,r,s,o,!0)}function Jr(e,t,n,r,s,o,i=!1,a=!1,c=!1){const u=[];for(let E=0;E<t.length;E++)t[E]>s&&u.push({score:t[E],boxIndex:E,suppressBeginIndex:0});u.sort(Ss);const h=o>0?-.5/o:0,l=[],f=[];for(;l.length<n&&u.length>0;){const E=u.pop(),{score:v,boxIndex:B,suppressBeginIndex:S}=E;if(v<s)break;let _=!1;for(let A=l.length-1;A>=S;--A){const N=c0(e,B,l[A]);if(N>=r){_=!0;break}if(E.score=E.score*u0(r,h,N),E.score<=s)break}E.suppressBeginIndex=l.length,_||(E.score===v?(l.push(B),f.push(E.score)):E.score>s&&s0(u,E,Ss))}const g=l.length,y=n-g;a&&y>0&&(l.push(...new Array(y).fill(0)),f.push(...new Array(y).fill(0)));const $={selectedIndices:l};return i&&($.selectedScores=f),c&&($.validOutputs=g),$}function c0(e,t,n){const r=e.subarray(t*4,t*4+4),s=e.subarray(n*4,n*4+4),o=Math.min(r[0],r[2]),i=Math.min(r[1],r[3]),a=Math.max(r[0],r[2]),c=Math.max(r[1],r[3]),u=Math.min(s[0],s[2]),h=Math.min(s[1],s[3]),l=Math.max(s[0],s[2]),f=Math.max(s[1],s[3]),g=(a-o)*(c-i),y=(l-u)*(f-h);if(g<=0||y<=0)return 0;const $=Math.max(o,u),E=Math.max(i,h),v=Math.min(a,l),B=Math.min(c,f),S=Math.max(v-$,0)*Math.max(B-E,0);return S/(g+y-S)}function u0(e,t,n){const r=Math.exp(t*n*n);return n<=e?r:0}function Ss(e,t){return e.score-t.score||e.score===t.score&&t.boxIndex-e.boxIndex}/**
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
 */async function l0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const o=d(e,"boxes","nonMaxSuppressionAsync"),i=d(t,"scores","nonMaxSuppressionAsync"),a=xe(o,i,n,r,s);n=a.maxOutputSize,r=a.iouThreshold,s=a.scoreThreshold;const c=await Promise.all([o.data(),i.data()]),u=c[0],h=c[1],{selectedIndices:l}=ru(u,h,n,r,s);return o!==e&&o.dispose(),i!==t&&i.dispose(),Et(l,"int32")}const h0=l0;/**
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
 */function f0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=0){const i=d(e,"boxes","nonMaxSuppression"),a=d(t,"scores","nonMaxSuppression"),c=xe(i,a,n,r,s,o);n=c.maxOutputSize,r=c.iouThreshold,s=c.scoreThreshold,o=c.softNmsSigma;const u={boxes:i,scores:a},h={maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:o},l=w.runKernel(Di,u,h);return{selectedIndices:l[0],selectedScores:l[1]}}const d0=b({nonMaxSuppressionWithScore_:f0});/**
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
 */async function p0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=0){const i=d(e,"boxes","nonMaxSuppressionAsync"),a=d(t,"scores","nonMaxSuppressionAsync"),c=xe(i,a,n,r,s,o);n=c.maxOutputSize,r=c.iouThreshold,s=c.scoreThreshold,o=c.softNmsSigma;const u=await Promise.all([i.data(),a.data()]),h=u[0],l=u[1],{selectedIndices:f,selectedScores:g}=ou(h,l,n,r,s,o);return i!==e&&i.dispose(),a!==t&&a.dispose(),{selectedIndices:Et(f,"int32"),selectedScores:Et(g)}}const g0=p0;/**
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
 */function m0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=!1){const i=d(e,"boxes","nonMaxSuppression"),a=d(t,"scores","nonMaxSuppression"),c=xe(i,a,n,r,s,null),u=c.maxOutputSize,h=c.iouThreshold,l=c.scoreThreshold,f={boxes:i,scores:a},g={maxOutputSize:u,iouThreshold:h,scoreThreshold:l,padToMaxOutputSize:o},y=w.runKernel(Ai,f,g);return{selectedIndices:y[0],validOutputs:y[1]}}const b0=b({nonMaxSuppressionPadded_:m0});/**
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
 */async function w0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=!1){const i=d(e,"boxes","nonMaxSuppressionAsync"),a=d(t,"scores","nonMaxSuppressionAsync"),c=xe(i,a,n,r,s,null),u=c.maxOutputSize,h=c.iouThreshold,l=c.scoreThreshold,[f,g]=await Promise.all([i.data(),a.data()]),{selectedIndices:y,validOutputs:$}=su(f,g,u,h,l,o);return i!==e&&i.dispose(),a!==t&&a.dispose(),{selectedIndices:Et(y,"int32"),validOutputs:z($,"int32")}}const y0=w0;/**
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
 */function $0(e,t,n=!1,r=!1){const s=d(e,"images","resizeBilinear");p(s.rank===3||s.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${s.rank}.`),p(t.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`),p(r===!1||n===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let o=s,i=!1;s.rank===3&&(i=!0,o=T(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const a={images:o},c={alignCorners:n,halfPixelCenters:r,size:t},u=w.runKernel(Vi,a,c);return i?T(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const E0=b({resizeBilinear_:$0});/**
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
 */function k0(e,t,n=!1,r=!1){const s=d(e,"images","resizeNearestNeighbor");p(s.rank===3||s.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${s.rank}.`),p(t.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`),p(s.dtype==="float32"||s.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),p(r===!1||n===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let o=s,i=!1;s.rank===3&&(i=!0,o=T(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const a={images:o},c={alignCorners:n,halfPixelCenters:r,size:t},u=w.runKernel(ji,a,c);return i?T(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const x0=b({resizeNearestNeighbor_:k0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function v0(e,t="binary",n=!1,r=.5){const s=d(e,"image","threshold"),o=.2989,i=.587,a=.114,c=s.shape[0]*s.shape[1];let u=D(Et([r]),255),h,l,f,g;if(p(s.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${s.rank}.`),p(s.shape[2]===3||s.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${s.shape[2]}.`),p(s.dtype==="int32"||s.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${s.dtype}.`),p(t==="otsu"||t==="binary",()=>`Method must be binary or otsu, but was ${t}`),s.shape[2]===3){[h,l,f]=Ge(s,[1,1,1],-1);const E=D(h,o),v=D(l,i),B=D(f,a);g=P(P(E,v),B)}else g=e;if(t==="otsu"){const E=yc(H(jc(g),"int32"),de([]),256);u=S0(E,c)}const y=n?Lr(g,u):Fn(g,u);return H(D(y,255),"int32")}function S0(e,t){let n=Et([-1]),r=Et([0]),s=Et([0]),o,i,a,c,u,h;for(let l=0;l<e.size-1;l++){o=X(e,0,l+1),i=X(e,l+1),u=V(j(o),t),h=V(j(i),t);const f=j(D(o,qe(0,o.size)));a=V(f,j(o));const g=Je(i.shape,o.size),y=P(qe(0,i.size),g),$=D(i,y);c=V(j($),j(i));const E=W(a,c),v=W(a,c),B=D(u,h);s=D(D(B,E),v);const S=Fn(s,r);r=Ut(S,s,r),n=Ut(S,Et([l]),n)}return n}const T0=b({threshold_:v0});/**
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
 */function I0(e,t,n="nearest",r="constant",s=0,o){const i=d(e,"image","transform","float32"),a=d(t,"transforms","transform","float32");p(i.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${i.rank}.`),p(a.rank===2&&(a.shape[0]===i.shape[0]||a.shape[0]===1)&&a.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),p(o==null||o.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${o}.`);const c={image:i,transforms:a},u={interpolation:n,fillMode:r,fillValue:s,outputShape:o};return w.runKernel(Aa,c,u)}const _0=b({transform_:I0});/**
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
 */function A0(e,t,n){const r=d(e,"a","bandPart");p(r.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${r.rank}.`);const s=r.shape,[o,i]=r.shape.slice(-2);let a,c;typeof t=="number"?(p(t%1===0,()=>`bandPart(): numLower must be an integer, got ${t}.`),p(t<=o,()=>`bandPart(): numLower (${t}) must not be greater than the number of rows (${o}).`),a=d(t<0?o:t,"numLower","bandPart")):(p(t.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),a=Ut(mr(t,0),o,xn(t,o))),typeof n=="number"?(p(n%1===0,()=>`bandPart(): numUpper must be an integer, got ${n}.`),p(n<=i,()=>`bandPart(): numUpper (${n}) must not be greater than the number of columns (${i}).`),c=d(n<0?i:n,"numUpper","bandPart")):(p(n.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),c=Ut(mr(n,0),i,xn(n,i)));const u=T(qe(0,o,1,"int32"),[-1,1]),h=qe(0,i,1,"int32"),l=W(u,h),f=En(Lr(l,a),Ac(l,It(c))),g=Ee([o,i],r.dtype);return T(ze(Zr(T(r,[-1,o,i])).map(y=>Ut(f,y,g))),s)}const D0=b({bandPart_:A0});/**
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
 */function N0(e){let t;if(Array.isArray(e)){t=!1,p(e!=null&&e.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");const s=e[0].shape[0];for(let o=1;o<e.length;++o)p(e[o].shape[0]===s,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${e[o].shape[0]} vs. ${s})`)}else t=!0,e=Ge(e,e.shape[0],0).map(s=>Hr(s,[0]));p(e.length<=e[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${e.length}) exceeds number of dimensions (${e[0].shape[0]}).`);const n=[],r=e;for(let s=0;s<e.length;++s)n.push(w.tidy(()=>{let o=r[s];if(s>0)for(let i=0;i<s;++i){const a=D(j(D(n[i],o)),n[i]);o=W(o,a)}return V(o,Mn(o,"euclidean"))}));return t?ze(n,0):n}const M0=b({gramSchmidt_:N0});/**
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
 */function F0(e,t=!1){if(p(e.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${e.rank}`),e.rank===2)return Ts(e,t);{const n=e.shape.slice(0,e.shape.length-2).reduce((c,u)=>c*u),r=Zr(T(e,[n,e.shape[e.shape.length-2],e.shape[e.shape.length-1]]),0),s=[],o=[];r.forEach(c=>{const[u,h]=Ts(c,t);s.push(u),o.push(h)});const i=T(ze(s,0),e.shape),a=T(ze(o,0),e.shape);return[i,a]}}function Ts(e,t=!1){return w.tidy(()=>{p(e.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${e.shape.length}D Tensor.`);const n=e.shape[0],r=e.shape[1];let s=Tc(n),o=te(e);const i=Ae([[1]],[1,1]);let a=te(i);const c=n>=r?r:n;for(let u=0;u<c;++u){const h=o,l=a,f=s;[a,o,s]=w.tidy(()=>{const g=X(o,[u,u],[n-u,1]),y=Mn(g),$=X(o,[u,u],[1,1]),E=Ut(Fn($,0),Ae([[-1]]),Ae([[1]])),v=W($,D(E,y)),B=V(g,v);B.shape[0]===1?a=te(i):a=gt([i,X(B,[1,0],[B.shape[0]-1,B.shape[1]])],0);const S=It(V(U(E,v),y)),_=X(o,[u,0],[n-u,r]),A=D(S,a),N=Sn(a);if(u===0)o=W(_,U(A,U(N,_)));else{const x=W(_,U(A,U(N,_)));o=gt([X(o,[0,0],[u,r]),x],0)}const R=Sn(A),M=X(s,[0,u],[n,s.shape[1]-u]);if(u===0)s=W(M,U(U(M,a),R));else{const x=W(M,U(U(M,a),R));s=gt([X(s,[0,0],[n,u]),x],1)}return[a,o,s]}),ft([h,l,f])}return!t&&n>r&&(s=X(s,[0,0],[n,r]),o=X(o,[0,0],[r,r])),[s,o]})}const B0=b({qr_:F0});/**
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
 */var lt;(function(e){e[e.NONE=0]="NONE",e[e.MEAN=1]="MEAN",e[e.SUM=2]="SUM",e[e.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(lt||(lt={}));function R0(e,t,n=lt.SUM_BY_NONZERO_WEIGHTS){const r=d(e,"losses","computeWeightedLoss");let s=null;t!=null&&(s=d(t,"weights","computeWeightedLoss"));const o=s==null?r:D(r,s);if(n===lt.NONE)return o;if(n===lt.SUM)return j(o);if(n===lt.MEAN){if(s==null)return kn(o);{const i=r.size/s.size,a=V(j(o),j(s));return i>1?V(a,z(i)):a}}if(n===lt.SUM_BY_NONZERO_WEIGHTS){if(s==null)return V(j(o),z(r.size));{const i=D(s,Qt(r.shape)),a=H(j(Lc(i,z(0))),"float32");return V(j(o),a)}}throw Error(`Unknown reduction: ${n}`)}const Rt=b({computeWeightedLoss_:R0});/**
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
 */function C0(e,t,n,r=lt.SUM_BY_NONZERO_WEIGHTS){const s=d(e,"labels","absoluteDifference"),o=d(t,"predictions","absoluteDifference");let i=null;n!=null&&(i=d(n,"weights","absoluteDifference")),ht(s.shape,o.shape,"Error in absoluteDifference: ");const a=wt(W(s,o));return Rt(a,i,r)}const P0=b({absoluteDifference_:C0});function O0(e,t,n,r,s=lt.SUM_BY_NONZERO_WEIGHTS){const o=d(e,"labels","cosineDistance"),i=d(t,"predictions","cosineDistance");let a=null;r!=null&&(a=d(r,"weights","cosineDistance")),ht(o.shape,i.shape,"Error in cosineDistance: ");const c=z(1),u=W(c,j(D(o,i),n,!0));return Rt(u,a,s)}const L0=b({cosineDistance_:O0});function W0(e,t,n,r=lt.SUM_BY_NONZERO_WEIGHTS){let s=d(e,"labels","hingeLoss");const o=d(t,"predictions","hingeLoss");let i=null;n!=null&&(i=d(n,"weights","hingeLoss")),ht(s.shape,o.shape,"Error in hingeLoss: ");const a=z(1);s=W(D(z(2),s),a);const c=Cn(W(a,D(s,o)));return Rt(c,i,r)}const q0=b({hingeLoss_:W0});/**
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
 */function U0(e,t,n,r=1,s=lt.SUM_BY_NONZERO_WEIGHTS){const o=d(e,"labels","huberLoss"),i=d(t,"predictions","huberLoss");let a=null;n!=null&&(a=d(n,"weights","huberLoss")),ht(o.shape,i.shape,"Error in huberLoss: ");const c=z(r),u=wt(W(i,o)),h=xn(u,c),l=W(u,h),f=P(D(z(.5),vt(h)),D(c,l));return Rt(f,a,s)}const G0=b({huberLoss_:U0});/**
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
 */function z0(e,t,n,r=1e-7,s=lt.SUM_BY_NONZERO_WEIGHTS){const o=d(e,"labels","logLoss"),i=d(t,"predictions","logLoss");let a=null;n!=null&&(a=d(n,"weights","logLoss")),ht(o.shape,i.shape,"Error in logLoss: ");const c=z(1),u=z(r),h=It(D(o,We(P(i,u)))),l=D(W(c,o),We(P(W(c,i),u))),f=W(h,l);return Rt(f,a,s)}const K0=b({logLoss_:z0});/**
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
 */function j0(e,t,n,r=lt.SUM_BY_NONZERO_WEIGHTS){const s=d(e,"labels","meanSquaredError"),o=d(t,"predictions","meanSquaredError");let i=null;n!=null&&(i=d(n,"weights","meanSquaredError")),ht(s.shape,o.shape,"Error in meanSquaredError: ");const a=Hc(s,o);return Rt(a,i,r)}const V0=b({meanSquaredError_:j0});/**
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
 */function H0(e,t){const n=d(e,"labels","sigmoidCrossEntropyWithLogits"),r=d(t,"logits","sigmoidCrossEntropyWithLogits");ht(n.shape,r.shape,"Error in sigmoidCrossEntropyWithLogits: ");const s=Cn(r),o=D(r,n),i=Nc(oe(It(wt(r))));return P(W(s,o),i)}function X0(e,t,n,r=0,s=lt.SUM_BY_NONZERO_WEIGHTS){let o=d(e,"multiClassLabels","sigmoidCrossEntropy");const i=d(t,"logits","sigmoidCrossEntropy");let a=null;if(n!=null&&(a=d(n,"weights","sigmoidCrossEntropy")),ht(o.shape,i.shape,"Error in sigmoidCrossEntropy: "),r>0){const u=z(r),h=z(1),l=z(.5);o=P(D(o,W(h,u)),D(l,u))}const c=H0(o,i);return Rt(c,a,s)}const Z0=b({sigmoidCrossEntropy_:X0});/**
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
 */function Y0(e,t,n=-1){if(n===-1&&(n=t.rank-1),n!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${n}`);return At((s,o,i)=>{const c=Bc(o,[n],!0),u=W(H(o,"float32"),c);i([s,u]);const h=It(D(u,s));return{value:j(h,[n]),gradFunc:(g,y)=>{const[$,E]=y,v=Qe(g.shape,[n]);return[D(T(g,v),W(H($,"float32"),oe(E))),D(T(g,v),W(oe(E),H($,"float32")))]}}})(e,t)}function J0(e,t,n,r=0,s=lt.SUM_BY_NONZERO_WEIGHTS){let o=d(e,"onehotLabels","softmaxCrossEntropy");const i=d(t,"logits","softmaxCrossEntropy");let a=null;if(n!=null&&(a=d(n,"weights","softmaxCrossEntropy")),ht(o.shape,i.shape,"Error in softmaxCrossEntropy: "),r>0){const u=z(r),h=z(1),l=z(o.shape[1]);o=P(D(o,W(h,u)),V(u,l))}const c=Y0(o,i);return Rt(c,a,s)}const Q0=b({softmaxCrossEntropy_:J0});/**
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
 */function t1(e,t,n,r){const s=d(e,"indices","sparseFillEmptyRows","int32"),o=d(t,"values","sparseFillEmptyRows"),i=d(n,"denseShape","sparseFillEmptyRows","int32"),a=d(r,"defaultValue","sparseFillEmptyRows",o.dtype);if(s.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${s.shape}`);if(o.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${o.shape}`);if(i.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${i.shape}`);if(a.rank!==0)throw new Error(`Default value should be a scalar but received shape ${a.shape}`);const c={indices:s,values:o,denseShape:i,defaultValue:a},u=w.runKernel(pa,c);return{outputIndices:u[0],outputValues:u[1],emptyRowIndicator:u[2],reverseIndexMap:u[3]}}const e1=b({sparseFillEmptyRows_:t1});/**
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
 */function n1(e,t,n){const r=d(e,"inputIndices","sparseReshape","int32"),s=d(t,"inputShape","sparseReshape","int32"),o=d(n,"newShape","sparseReshape","int32");if(r.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${r.shape}`);if(s.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${s.shape}`);if(o.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${o.shape}`);const i={inputIndices:r,inputShape:s,newShape:o},a=w.runKernel(ga,i);return{outputIndices:a[0],outputShape:a[1]}}const r1=b({sparseReshape_:n1});/**
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
 */function s1(e,t,n){const r=d(e,"data","sparseSegmentMean"),s=d(t,"indices","sparseSegmentMean","int32"),o=d(n,"segmentIds","sparseSegmentMean","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${s.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${o.shape}`);const i={data:r,indices:s,segmentIds:o};return w.runKernel(ma,i)}const o1=b({sparseSegmentMean_:s1});/**
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
 */function i1(e,t,n){const r=d(e,"data","sparseSegmentSum"),s=d(t,"indices","sparseSegmentSum","int32"),o=d(n,"segmentIds","sparseSegmentSum","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${s.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${o.shape}`);const i={data:r,indices:s,segmentIds:o};return w.runKernel(ba,i)}const a1=b({sparseSegmentSum_:i1});/**
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
 */function c1(e,t,n,r,s,o,i,a){const c=d(e,"data","stringNGrams","string");if(c.dtype!=="string")throw new Error("Data must be of datatype string");if(c.shape.length!==1)throw new Error(`Data must be a vector, saw: ${c.shape}`);const u=d(t,"dataSplits","stringNGrams");if(u.dtype!=="int32")throw new Error("Data splits must be of datatype int32");const h={separator:n,nGramWidths:r,leftPad:s,rightPad:o,padWidth:i,preserveShortSequences:a},l={data:c,dataSplits:u},f=w.runKernel(ka,l,h);return{nGrams:f[0],nGramsSplits:f[1]}}const u1=b({stringNGrams_:c1});/**
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
 */function l1(e,t,n=!0){const r=d(e,"input","stringSplit","string"),s=d(t,"delimiter","stringSplit","string");if(r.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${r.shape}`);if(s.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${s.shape}`);const o={skipEmpty:n},i={input:r,delimiter:s},a=w.runKernel(xa,i,o);return{indices:a[0],values:a[1],shape:a[2]}}const h1=b({stringSplit_:l1});/**
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
 */function f1(e,t){const n=d(e,"input","stringToHashBucketFast","string"),r={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");const s={input:n};return w.runKernel(va,s,r)}const d1=b({stringToHashBucketFast_:f1});/**
 * @license
 * Copyright 2023 Google LLC.
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
 */function p1(e,t,n,r=!0){const s=d(e,"input","staticRegexReplace","string"),o={pattern:t,rewrite:n,replaceGlobal:r};return w.runKernel($a,{x:s},o)}const g1=b({staticRegexReplace_:p1});/**
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
 */const m1={fft:jr,ifft:vn,rfft:Vr,irfft:Vc},b1={hammingWindow:qw,hannWindow:eu,frame:nu,stft:Kw},w1={flipLeftRight:Xw,grayscaleToRGB:Yw,resizeNearestNeighbor:x0,resizeBilinear:E0,rgbToGrayscale:Qw,rotateWithOffset:e0,cropAndResize:Vw,nonMaxSuppression:r0,nonMaxSuppressionAsync:h0,nonMaxSuppressionWithScore:d0,nonMaxSuppressionWithScoreAsync:g0,nonMaxSuppressionPadded:b0,nonMaxSuppressionPaddedAsync:y0,threshold:T0,transform:_0},y1={bandPart:D0,gramSchmidt:M0,qr:B0},$1={absoluteDifference:P0,computeWeightedLoss:Rt,cosineDistance:L0,hingeLoss:q0,huberLoss:G0,logLoss:K0,meanSquaredError:V0,sigmoidCrossEntropy:Z0,softmaxCrossEntropy:Q0},E1={sparseFillEmptyRows:e1,sparseReshape:r1,sparseSegmentMean:o1,sparseSegmentSum:a1},k1={stringNGrams:u1,stringSplit:h1,stringToHashBucketFast:d1,staticRegexReplace:g1};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const x1=new Map,yr=new Map;class iu{getClassName(){return this.constructor.className}static fromConfig(t,n){return new t(n)}}class Ot{constructor(){this.classNameMap={}}static getMap(){return Ot.instance==null&&(Ot.instance=new Ot),Ot.instance}static register(t){Ot.getMap().classNameMap[t.className]=[t,t.fromConfig]}}function au(e,t,n){p(e.className!=null,()=>"Class being registered does not have the static className property defined."),p(typeof e.className=="string",()=>"className is required to be a string, but got type "+typeof e.className),p(e.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof t>"u"&&(t="Custom"),typeof n>"u"&&(n=e.className);const r=n,s=t+">"+r;return Ot.register(e),x1.set(s,e),yr.set(e,s),e}function v1(e){return yr.has(e)?yr.get(e):e.className}const S1=Object.freeze(Object.defineProperty({__proto__:null,Serializable:iu,SerializationMap:Ot,getRegisteredName:v1,registerClass:au},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class Ht extends iu{minimize(t,n=!1,r){const{value:s,grads:o}=this.computeGradients(t,r);if(r!=null){const i=r.map(a=>({name:a.name,tensor:o[a.name]}));this.applyGradients(i)}else this.applyGradients(o);return ft(o),n?s:(s.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(t,n){return Mc(t,n)}dispose(){this.iterations_!=null&&ft(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:z(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(t){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(t){return this.iterations_=(await t[0].tensor.data())[0],t.slice(1)}}Object.defineProperty(Ht,Symbol.hasInstance,{value:e=>e.minimize!=null&&e.computeGradients!=null&&e.applyGradients!=null});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class Qr extends Ht{static get className(){return"Adadelta"}constructor(t,n,r=null){super(),this.learningRate=t,this.rho=n,this.epsilon=r,this.accumulatedGrads=[],this.accumulatedUpdates=[],r==null&&(this.epsilon=w.backend.epsilon())}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r],i=!1;this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accum_grad`,variable:nt(()=>yt(o).variable(i))}),this.accumulatedUpdates[s]==null&&(this.accumulatedUpdates[s]={originalName:`${r}/accum_var`,variable:nt(()=>yt(o).variable(i))});const a=Array.isArray(t)?t[s].tensor:t[r];if(a==null)return;const c=this.accumulatedGrads[s].variable,u=this.accumulatedUpdates[s].variable;nt(()=>{const h=P(D(c,this.rho),D(vt(a),1-this.rho)),l=D(V(Mt(P(u,this.epsilon)),Mt(P(c,this.epsilon))),a),f=P(D(u,this.rho),D(vt(l),1-this.rho));c.assign(h),u.assign(f);const g=P(D(l,-this.learningRate),o);o.assign(g)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(ft(this.accumulatedGrads.map(t=>t.variable)),ft(this.accumulatedUpdates.map(t=>t.variable)))}async getWeights(){const t=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(t.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=t.length/2,r=!1;this.accumulatedGrads=t.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedUpdates=t.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(t,n){return new t(n.learningRate,n.rho,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class ts extends Ht{static get className(){return"Adagrad"}constructor(t,n=.1){super(),this.learningRate=t,this.initialAccumulatorValue=n,this.accumulatedGrads=[]}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r];this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accumulator`,variable:nt(()=>Je(o.shape,this.initialAccumulatorValue).variable(!1))});const i=Array.isArray(t)?t[s].tensor:t[r];if(i==null)return;const a=this.accumulatedGrads[s].variable;nt(()=>{const c=P(a,vt(i));a.assign(c);const u=P(D(V(i,Mt(P(c,w.backend.epsilon()))),-this.learningRate),o);o.assign(u)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&ft(this.accumulatedGrads.map(t=>t.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=!1;this.accumulatedGrads=t.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(t,n){return new t(n.learningRate,n.initialAccumulatorValue)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class es extends Ht{static get className(){return"Adam"}constructor(t,n,r,s=null){super(),this.learningRate=t,this.beta1=n,this.beta2=r,this.epsilon=s,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],nt(()=>{this.accBeta1=z(n).variable(),this.accBeta2=z(r).variable()}),s==null&&(this.epsilon=w.backend.epsilon())}applyGradients(t){const n=Array.isArray(t)?t.map(r=>r.name):Object.keys(t);nt(()=>{const r=W(1,this.accBeta1),s=W(1,this.accBeta2);n.forEach((o,i)=>{const a=w.registeredVariables[o],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${o}/m`,variable:nt(()=>yt(a).variable(c))}),this.accumulatedSecondMoment[i]==null&&(this.accumulatedSecondMoment[i]={originalName:`${o}/v`,variable:nt(()=>yt(a).variable(c))});const u=Array.isArray(t)?t[i].tensor:t[o];if(u==null)return;const h=this.accumulatedFirstMoment[i].variable,l=this.accumulatedSecondMoment[i].variable,f=P(D(h,this.beta1),D(u,1-this.beta1)),g=P(D(l,this.beta2),D(vt(u),1-this.beta2)),y=V(f,r),$=V(g,s);h.assign(f),l.assign(g);const E=P(D(V(y,P(Mt($),this.epsilon)),-this.learningRate),a);a.assign(E)}),this.accBeta1.assign(D(this.accBeta1,this.beta1)),this.accBeta2.assign(D(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&ft(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedSecondMoment!=null&&ft(this.accumulatedSecondMoment.map(t=>t.variable))}async getWeights(){const t=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(t.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(t){t=await this.extractIterations(t),nt(()=>{this.accBeta1.assign(Le(this.beta1,this.iterations_+1)),this.accBeta2.assign(Le(this.beta2,this.iterations_+1))});const n=t.length/2,r=!1;this.accumulatedFirstMoment=t.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedSecondMoment=t.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(t,n){return new t(n.learningRate,n.beta1,n.beta2,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class ns extends Ht{static get className(){return"Adamax"}constructor(t,n,r,s=null,o=0){super(),this.learningRate=t,this.beta1=n,this.beta2=r,this.epsilon=s,this.decay=o,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],nt(()=>{this.iteration=z(0).variable(),this.accBeta1=z(n).variable()}),s==null&&(this.epsilon=w.backend.epsilon())}applyGradients(t){const n=Array.isArray(t)?t.map(r=>r.name):Object.keys(t);nt(()=>{const r=W(1,this.accBeta1),s=V(-this.learningRate,P(D(this.iteration,this.decay),1));n.forEach((o,i)=>{const a=w.registeredVariables[o],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${o}/m`,variable:yt(a).variable(c)}),this.accumulatedWeightedInfNorm[i]==null&&(this.accumulatedWeightedInfNorm[i]={originalName:`${o}/v`,variable:yt(a).variable(c)});const u=Array.isArray(t)?t[i].tensor:t[o];if(u==null)return;const h=this.accumulatedFirstMoment[i].variable,l=this.accumulatedWeightedInfNorm[i].variable,f=P(D(h,this.beta1),D(u,1-this.beta1)),g=D(l,this.beta2),y=wt(u),$=Oc(g,y);h.assign(f),l.assign($);const E=P(D(V(s,r),V(f,P($,this.epsilon))),a);a.assign(E)}),this.iteration.assign(P(this.iteration,1)),this.accBeta1.assign(D(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&ft(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedWeightedInfNorm!=null&&ft(this.accumulatedWeightedInfNorm.map(t=>t.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(t){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(t,n){return new t(n.learningRate,n.beta1,n.beta2,n.epsilon,n.decay)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class Un extends Ht{static get className(){return"SGD"}constructor(t){super(),this.learningRate=t,this.setLearningRate(t)}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=Array.isArray(t)?t[s].tensor:t[r];if(o==null)return;const i=w.registeredVariables[r];nt(()=>{const a=P(D(this.c,o),i);i.assign(a)})}),this.incrementIterations()}setLearningRate(t){this.learningRate=t,this.c!=null&&this.c.dispose(),this.c=Ja(z(-t))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(t){if(t=await this.extractIterations(t),t.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(t,n){return new t(n.learningRate)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class rs extends Un{static get className(){return"Momentum"}constructor(t,n,r=!1){super(t),this.learningRate=t,this.momentum=n,this.useNesterov=r,this.accumulations=[],this.m=z(this.momentum)}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r];this.accumulations[s]==null&&(this.accumulations[s]={originalName:`${r}/momentum`,variable:nt(()=>yt(o).variable(!1))});const i=this.accumulations[s].variable,a=Array.isArray(t)?t[s].tensor:t[r];a!=null&&nt(()=>{let c;const u=P(D(this.m,i),a);this.useNesterov?c=P(D(this.c,P(a,D(u,this.m))),o):c=P(D(this.c,u),o),i.assign(u),o.assign(c)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&ft(this.accumulations.map(t=>t.variable))}setMomentum(t){this.momentum=t}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=!1;this.accumulations=t.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(t,n){return new t(n.learningRate,n.momentum,n.useNesterov)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class ss extends Ht{static get className(){return"RMSProp"}constructor(t,n=.9,r=0,s=null,o=!1){if(super(),this.learningRate=t,this.decay=n,this.momentum=r,this.epsilon=s,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=o,s==null&&(this.epsilon=w.backend.epsilon()),t==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r],i=!1;this.accumulatedMeanSquares[s]==null&&(this.accumulatedMeanSquares[s]={originalName:`${r}/rms`,variable:nt(()=>yt(o).variable(i))}),this.accumulatedMoments[s]==null&&(this.accumulatedMoments[s]={originalName:`${r}/momentum`,variable:nt(()=>yt(o).variable(i))}),this.accumulatedMeanGrads[s]==null&&this.centered&&(this.accumulatedMeanGrads[s]={originalName:`${r}/mg`,variable:nt(()=>yt(o).variable(i))});const a=Array.isArray(t)?t[s].tensor:t[r];if(a==null)return;const c=this.accumulatedMeanSquares[s].variable,u=this.accumulatedMoments[s].variable;nt(()=>{const h=P(D(c,this.decay),D(vt(a),1-this.decay));if(this.centered){const l=this.accumulatedMeanGrads[s].variable,f=P(D(l,this.decay),D(a,1-this.decay)),g=V(D(a,this.learningRate),Mt(W(h,P(vt(f),this.epsilon)))),y=P(D(u,this.momentum),g);c.assign(h),l.assign(f),u.assign(y);const $=W(o,y);o.assign($)}else{const l=P(D(c,this.decay),D(vt(a),1-this.decay)),f=P(D(u,this.momentum),V(D(a,this.learningRate),Mt(P(l,this.epsilon))));c.assign(l),u.assign(f);const g=W(o,f);o.assign(g)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&ft(this.accumulatedMeanSquares.map(t=>t.variable)),this.accumulatedMeanGrads!=null&&this.centered&&ft(this.accumulatedMeanGrads.map(t=>t.variable)),this.accumulatedMoments!=null&&ft(this.accumulatedMoments.map(t=>t.variable))}async getWeights(){const t=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&t.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(t.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=this.centered?t.length/3:t.length/2,r=!1;this.accumulatedMeanSquares=t.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedMoments=t.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.centered&&(this.accumulatedMeanGrads=t.slice(n*2,n*3).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(t,n){return new t(n.learningRate,n.decay,n.momentum,n.epsilon,n.centered)}}/**
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
 */const T1=[Qr,ts,es,ns,rs,ss,Un];function I1(){for(const e of T1)au(e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const _1="model",A1=".json",D1=".weights.bin";function Is(e){return new Promise(t=>setTimeout(t)).then(e)}class ae{constructor(t){if(!L().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");t.startsWith(ae.URL_SCHEME)&&(t=t.slice(ae.URL_SCHEME.length)),(t==null||t.length===0)&&(t=_1),this.modelJsonFileName=t+A1,this.weightDataFileName=t+D1}async save(t){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");const n=St.join(t.weightData),r=window.URL.createObjectURL(new Blob([n],{type:"application/octet-stream"}));if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const s=[{paths:["./"+this.weightDataFileName],weights:t.weightSpecs}],o=rc(t,s),i=window.URL.createObjectURL(new Blob([JSON.stringify(o)],{type:"application/json"})),a=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(a.download=this.modelJsonFileName,a.href=i,await Is(()=>a.dispatchEvent(new MouseEvent("click"))),t.weightData!=null){const c=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;c.download=this.weightDataFileName,c.href=r,await Is(()=>c.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:Ze(t)}}}}ae.URL_SCHEME="downloads://";class N1{constructor(t){if(t==null||t.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${t}`);this.jsonFile=t[0],this.weightsFiles=t.slice(1)}async load(){return new Promise((t,n)=>{const r=new FileReader;r.onload=s=>{const o=JSON.parse(s.target.result),i=o.modelTopology;if(i==null){n(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(o.weightsManifest==null){n(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){t({modelTopology:i});return}const c=Br(o,u=>this.loadWeights(u));t(c)},r.onerror=s=>n(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),r.readAsText(this.jsonFile)})}loadWeights(t){const n=[],r=[];for(const i of t)n.push(...i.weights),r.push(...i.paths);const s=this.checkManifestAndWeightFiles(t),o=r.map(i=>this.loadWeightsFile(i,s[i]));return Promise.all(o).then(i=>[n,i])}loadWeightsFile(t,n){return new Promise((r,s)=>{const o=new FileReader;o.onload=i=>{const a=i.target.result;r(a)},o.onerror=i=>s(`Failed to weights data from file of path '${t}'.`),o.readAsArrayBuffer(n)})}checkManifestAndWeightFiles(t){const n=[],r=this.weightsFiles.map(o=>ms(o.name)),s={};for(const o of t)o.paths.forEach(i=>{const a=ms(i);if(n.indexOf(a)!==-1)throw new Error(`Duplicate file basename found in weights manifest: '${a}'`);if(n.push(a),r.indexOf(a)===-1)throw new Error(`Weight file with basename '${a}' is not provided.`);s[i]=this.weightsFiles[r.indexOf(a)]});if(n.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${n.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return s}}const M1=e=>L().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(ae.URL_SCHEME)?F1(e.slice(ae.URL_SCHEME.length)):null;Y.registerSaveRouter(M1);function F1(e="model"){return new ae(e)}function B1(e){return new N1(e)}/**
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
 */function _s(e,t,n,r){i(e),n=n??0,r=r??1,a(n,r);let s=0;const o=c=>(c.then(u=>{const h=n+ ++s/e.length*(r-n);return t(h),u}),c);function i(c){p(c!=null&&Array.isArray(c)&&c.length>0,()=>"promises must be a none empty array")}function a(c,u){p(c>=0&&c<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${c}`),p(u>=0&&u<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${u}`),p(u>=c,()=>`startFraction must be no more than endFraction, but got startFraction ${c} and endFraction ${u}`)}return Promise.all(e.map(o))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */async function cu(e,t){t==null&&(t={});const n=t.fetchFunc==null?L().platform.fetch:t.fetchFunc,r=e.map(l=>n(l,t.requestInit,{isBinary:!0})),a=(t.onProgress==null?await Promise.all(r):await _s(r,t.onProgress,0,.5)).map(l=>l.arrayBuffer());return t.onProgress==null?await Promise.all(a):await _s(a,t.onProgress,.5,1)}function R1(e,t){var n;const r=t.fetchFunc==null?L().platform.fetch:t.fetchFunc;let s=0,o;return(n=t.onProgress)===null||n===void 0||n.call(t,0),new ReadableStream({pull:async i=>{for(var a;s<e.length;){o||(o=(await r(e[s],t.requestInit,{isBinary:!0})).body.getReader());const{done:c,value:u}=await o.read();if(c){s++,o=void 0,(a=t.onProgress)===null||a===void 0||a.call(t,s/e.length);continue}i.enqueue(u);return}i.close()}})}async function C1(e,t="",n,r){return uu(i=>cu(i,{requestInit:r}))(e,t,n)}function uu(e){return async(t,n="",r)=>{const s=t.map(()=>!1),o={},i=r!=null?r.map(()=>!1):[],a=[];if(t.forEach((g,y)=>{let $=0;g.weights.forEach(E=>{const v="quantization"in E?E.quantization.dtype:E.dtype,B=ee[v]*G(E.shape),S=()=>{s[y]=!0,o[y]==null&&(o[y]=[]),o[y].push({manifestEntry:E,groupOffset:$,sizeBytes:B})};r!=null?r.forEach((_,A)=>{_===E.name&&(S(),i[A]=!0)}):S(),a.push(E.name),$+=B})}),!i.every(g=>g)){const g=r.filter((y,$)=>!i[$]);throw new Error(`Could not find weights in manifest with names: ${g.join(", ")}. 
Manifest JSON has weights with names: ${a.join(", ")}.`)}const c=s.reduce((g,y,$)=>(y&&g.push($),g),[]),u=[];c.forEach(g=>{t[g].paths.forEach(y=>{const $=n+(n.endsWith("/")?"":"/")+y;u.push($)})});const h=await e(u),l={};let f=0;return c.forEach(g=>{const y=t[g].paths.length,$=new St(h.slice(f,f+y));o[g].forEach(v=>{const B=$.slice(v.groupOffset,v.groupOffset+v.sizeBytes),S=ec(B,[v.manifestEntry]);for(const _ in S)l[_]=S[_]}),f+=y}),l}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const P1="application/octet-stream",O1="application/json";class os{constructor(t,n){if(this.DEFAULT_METHOD="POST",n==null&&(n={}),this.weightPathPrefix=n.weightPathPrefix,this.weightUrlConverter=n.weightUrlConverter,n.fetchFunc!=null?(p(typeof n.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=n.fetchFunc):this.fetch=L().platform.fetch,p(t!=null&&t.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(t)&&p(t.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${t.length}).`),this.path=t,n.requestInit!=null&&n.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=n.requestInit||{},this.loadOptions=n}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const n=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);n.body=new FormData;const r=[{paths:["./model.weights.bin"],weights:t.weightSpecs}],s=rc(t,r);if(n.body.append("model.json",new Blob([JSON.stringify(s)],{type:O1}),"model.json"),t.weightData!=null){const i=St.join(t.weightData);n.body.append("model.weights.bin",new Blob([i],{type:P1}),"model.weights.bin")}const o=await this.fetch(this.path,n);if(o.ok)return{modelArtifactsInfo:Ze(t),responses:[o]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${o.status}.`)}async loadModelJSON(){const t=await this.fetch(this.path,this.requestInit);if(!t.ok)throw new Error(`Request to ${this.path} failed with status code ${t.status}. Please verify this URL points to the model JSON of the model to load.`);let n;try{n=await t.json()}catch{let i=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?i+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":i+=" Please make sure the server is serving valid JSON for this request.",new Error(i)}const r=n.modelTopology,s=n.weightsManifest;if(r==null&&s==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return n}async load(){if(this.loadOptions.streamWeights)return this.loadStream();const t=await this.loadModelJSON();return Br(t,n=>this.loadWeights(n))}async loadStream(){const t=await this.loadModelJSON(),n=await this.getWeightUrls(t.weightsManifest),r=ur(t.weightsManifest),s=()=>R1(n,this.loadOptions);return Object.assign(Object.assign({},t),{weightSpecs:r,getWeightStream:s})}async getWeightUrls(t){const n=Array.isArray(this.path)?this.path[1]:this.path,[r,s]=L1(n),o=this.weightPathPrefix||r,i=[],a=[];for(const c of t)for(const u of c.paths)this.weightUrlConverter!=null?a.push(this.weightUrlConverter(u)):i.push(o+u+s);return this.weightUrlConverter&&i.push(...await Promise.all(a)),i}async loadWeights(t){const n=await this.getWeightUrls(t),r=ur(t),s=await cu(n,this.loadOptions);return[r,s]}}os.URL_SCHEME_REGEX=/^https?:\/\//;function L1(e){const t=e.lastIndexOf("/"),n=e.lastIndexOf("?"),r=e.substring(0,t),s=n>t?e.substring(n):"";return[r+"/",s]}function $r(e){return e.match(os.URL_SCHEME_REGEX)!=null}const lu=(e,t)=>{if(typeof fetch>"u"&&(t==null||t.fetchFunc==null))return null;{let n=!0;if(Array.isArray(e)?n=e.every(r=>$r(r)):n=$r(e),n)return is(e,t)}return null};Y.registerSaveRouter(lu);Y.registerLoadRouter(lu);function is(e,t){return new os(e,t)}function W1(e,t){return is(e,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class Xn{constructor(t){this.modelArtifacts=t}load(){return this.modelArtifacts}}class hu{constructor(t){this.saveHandler=t}save(t){return this.saveHandler(t)}}class q1{constructor(t){t.load&&(this.load=()=>Promise.resolve(t.load())),t.save&&(this.save=n=>Promise.resolve(t.save(n)))}}function U1(e,t,n,r){const s=arguments;return new q1(fu(...s))}function fu(e,t,n,r){return arguments.length===1?e.modelTopology!=null||e.weightSpecs!=null?new Xn(e):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Xn({modelTopology:e})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Xn({modelTopology:e,weightSpecs:t,weightData:n,trainingConfig:r}))}function G1(e){return new hu(e)}function z1(e){return new hu(e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const K1=Object.freeze(Object.defineProperty({__proto__:null,CompositeArrayBuffer:St,browserFiles:B1,browserHTTPRequest:W1,concatenateArrayBuffers:Rh,copyModel:rf,decodeWeights:ec,decodeWeightsStream:Nh,encodeWeights:_h,fromMemory:U1,fromMemorySync:fu,getLoadHandlers:Gh,getModelArtifactsForJSON:Br,getModelArtifactsForJSONSync:sc,getModelArtifactsInfoForJSON:Ze,getSaveHandlers:Uh,getWeightSpecs:ur,http:is,isHTTPScheme:$r,listModels:ef,loadWeights:C1,moveModel:sf,registerLoadRouter:qh,registerSaveRouter:Wh,removeModel:nf,weightsLoaderFactory:uu,withSaveHandler:G1,withSaveHandlerSync:z1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function j1(e,t,n){const r=d(e,"labels","confusionMatrix"),s=d(t,"predictions","confusionMatrix");p(n==null||n>0&&Number.isInteger(n),()=>`If provided, numClasses must be a positive integer, but got ${n}`),p(r.rank===1,()=>`Expected the rank of labels to be 1, but got ${r.rank}`),p(s.rank===1,()=>`Expected the rank of predictions to be 1, but got ${s.rank}`),p(r.shape[0]===s.shape[0],()=>`Mismatch in the number of examples: ${r.shape[0]} vs. ${s.shape[0]}. Labels and predictions should have the same number of elements.`),p(n>0&&Number.isInteger(n),()=>`numClasses is required to be a positive integer, but got ${n}`);const o=br(H(r,"int32"),n),i=br(H(s,"int32"),n),a=Sn(o),c=U(a,i);return H(c,"int32")}const V1=b({confusionMatrix_:j1});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const H1=Object.freeze(Object.defineProperty({__proto__:null,confusionMatrix:V1},Symbol.toStringTag,{value:"Module"}));/**
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
 */let Xt,As=!1;function du(e,t=3){if(t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(e==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,r=!1,s=!1,o=!1,i=!1,a=!1;if(e.data instanceof Uint8Array)n=!0;else if(typeof ImageData<"u"&&e instanceof ImageData)r=!0;else if(typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement)s=!0;else if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement)o=!0;else if(e.getContext!=null)i=!0;else if(typeof ImageBitmap<"u"&&e instanceof ImageBitmap)a=!0;else throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${e.constructor.name}`);if(Me(Yn,w.backendName)!=null){const y={pixels:e},$={numChannels:t};return w.runKernel(Yn,y,$)}const[u,h]=s?[e.videoWidth,e.videoHeight]:[e.width,e.height];let l;if(i)l=e.getContext("2d").getImageData(0,0,u,h).data;else if(r||n)l=e.data;else if(o||s||a){if(Xt==null)if(typeof document>"u")if(typeof OffscreenCanvas<"u"&&typeof OffscreenCanvasRenderingContext2D<"u")Xt=new OffscreenCanvas(1,1).getContext("2d");else throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");else Xt=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});Xt.canvas.width=u,Xt.canvas.height=h,Xt.drawImage(e,0,0,u,h),l=Xt.getImageData(0,0,u,h).data}let f;if(t===4)f=new Int32Array(l);else{const y=u*h;f=new Int32Array(y*t);for(let $=0;$<y;$++)for(let E=0;E<t;++E)f[$*t+E]=l[$*4+E]}return Zc(f,[h,u,t],"int32")}function X1(e){return e!=null&&e.data instanceof Uint8Array}function Z1(){return typeof window<"u"&&typeof ImageBitmap<"u"&&window.hasOwnProperty("createImageBitmap")}function Y1(e){return e!=null&&e.width!==0&&e.height!==0}function J1(e){return Z1()&&!(e instanceof ImageBitmap)&&Y1(e)&&!X1(e)}async function Q1(e,t=3){let n=null;if(L().getBool("WRAP_TO_IMAGEBITMAP")&&J1(e)){let r;try{r=await createImageBitmap(e,{premultiplyAlpha:"none"})}catch{r=null}r!=null&&r.width===e.width&&r.height===e.height?n=r:n=e}else n=e;return du(n,t)}function pu(e){if(e.rank!==2&&e.rank!==3)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${e.rank}.`);const t=e.rank===2?1:e.shape[2];if(t>4||t===2)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${t}`);if(e.dtype!=="float32"&&e.dtype!=="int32")throw new Error(`Unsupported type for toPixels: ${e.dtype}. Please use float32 or int32 tensors.`)}function ty(e){const t=e?.alpha||1;if(t>1||t<0)throw new Error(`Alpha value ${t} is suppoed to be in range [0 - 1].`)}async function ey(e,t){let n=d(e,"img","toPixels");if(!(e instanceof et)){const u=n;n=H(u,"int32"),u.dispose()}pu(n);const[r,s]=n.shape.slice(0,2),o=n.rank===2?1:n.shape[2],i=await n.data(),a=n.dtype==="float32"?255:1,c=new Uint8ClampedArray(s*r*4);for(let u=0;u<r*s;++u){const h=[0,0,0,255];for(let f=0;f<o;f++){const g=i[u*o+f];if(n.dtype==="float32"){if(g<0||g>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${g}.`)}else if(n.dtype==="int32"&&(g<0||g>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${g}.`);o===1?(h[0]=g*a,h[1]=g*a,h[2]=g*a):h[f]=g*a}const l=u*4;c[l+0]=Math.round(h[0]),c[l+1]=Math.round(h[1]),c[l+2]=Math.round(h[2]),c[l+3]=Math.round(h[3])}if(t!=null){As||Me(_r,w.backendName)!=null&&(console.warn("tf.browser.toPixels is not efficient to draw tensor on canvas. Please try tf.browser.draw instead."),As=!0),t.width=s,t.height=r;const u=t.getContext("2d"),h=new ImageData(c,s,r);u.putImageData(h,0,0)}return n!==e&&n.dispose(),c}function ny(e,t,n){let r=d(e,"img","draw");if(!(e instanceof et)){const i=r;r=H(i,"int32"),i.dispose()}pu(r),ty(n?.imageOptions);const s={image:r},o={canvas:t,options:n};w.runKernel(_r,s,o)}const ry=b({fromPixels_:du}),sy=Object.freeze(Object.defineProperty({__proto__:null,draw:ny,fromPixels:ry,fromPixelsAsync:Q1,toPixels:ey},Symbol.toStringTag,{value:"Module"}));function gu(e,t){const n=e.shape.length,r=t.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(r<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${r}.`);if(t.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[r-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[r-1]} vs. ${n}`);if(G(e.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${e.shape}.`);const s=t.shape,o=s[s.length-1];let i=1;for(let l=0;l<s.length-1;++l)i*=s[l];const a=e.shape,c=s.slice();c.pop();let u=1;for(let l=o;l<n;++l)u*=a[l],c.push(a[l]);const h=[...ke(e.shape).map(l=>l/u),1].slice(0,o);return[c,i,u,h]}const oy=Object.freeze(Object.defineProperty({__proto__:null,prepareAndValidate:gu},Symbol.toStringTag,{value:"Module"}));/**
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
 */const Er=-2,iy=-1;function ay(e,t,n){const r=e.shape.length;p(r===t.length,()=>`Error in slice${r}D: Length of begin ${t} must match the rank of the array (${r}).`),p(r===n.length,()=>`Error in slice${r}D: Length of size ${n} must match the rank of the array (${r}).`);for(let s=0;s<r;++s)p(t[s]+n[s]<=e.shape[s],()=>`Error in slice${r}D: begin[${s}] + size[${s}] (${t[s]+n[s]}) would overflow input.shape[${s}] (${e.shape[s]})`)}function cy(e){const t=[];let n=0;for(;e>0;)e&1&&t.push(n),e/=2,n++;return t}function uy(e,t,n){const r=[];for(let s=0;s<e.length;s++)r[s]=Math.ceil((t[s]-e[s])/n[s]);return r}function mu(e,t,n,r){const s=[...e];for(let o=s.length;o<r.length;o++)s.push(1);for(let o=0;o<n;o++)o===0?s[t]=1:(s.splice(t,0,1),s.pop());return s}function bu(e,t,n){return n<=e?n:n-(t-1)}function wu(e,t){const n=[];for(let r=0;r<e;r++)n.push(t+r);return n}function ly(e,t,n,r,s,o,i,a,c){const u=e.length;let h=new Array(u),l=new Array(u),f=new Array(u);if(t.length&&n>0){const g=t[0],y=n+1;h=yu(i,g,y,r,e),l=$u(a,g,y,s,e),f=mu(o,g,y,e)}else for(let g=0;g<u;g++)h[g]=ku(i,r,o,e,g,c),l[g]=xu(a,s,o,e,g,c),f[g]=Eu(o,g,c);return{begin:h,end:l,strides:f}}function yu(e,t,n,r,s){const o=[...s],i=wu(n,t);for(let a=0;a<o.length;a++)if(i.indexOf(a)>-1)o[a]=0;else{const c=bu(t,n,a);let u=r[c];e&1<<c&&(u=0),o[a]=u}return o}function $u(e,t,n,r,s){const o=[...s],i=wu(n,t);for(let a=0;a<o.length;a++)if(i.indexOf(a)>-1)o[a]=Number.MAX_SAFE_INTEGER;else{const c=bu(t,n,a);let u=r[c];e&1<<c&&(u=Number.MAX_SAFE_INTEGER),o[a]=u}for(let a=0;a<o.length;a++){const c=s[a];o[a]<0&&(o[a]+=c),o[a]=De(0,o[a],s[a])}return o}function Eu(e,t,n){let r=e[t];return(n&1<<t||r==null)&&(r=1),r}function ku(e,t,n,r,s,o){let i=t[s];const a=n[s]||1;(e&1<<s||o&1<<s||i==null)&&(a>0?i=Number.MIN_SAFE_INTEGER:i=Number.MAX_SAFE_INTEGER);const c=r[s];return i<0&&(i+=c),i=De(0,i,c-1),i}function xu(e,t,n,r,s,o){let i=t[s];const a=n[s]||1;(e&1<<s||o&1<<s||i==null)&&(a>0?i=Number.MAX_SAFE_INTEGER:i=Number.MIN_SAFE_INTEGER);const c=r[s];return i<0&&(i+=c),a>0?i=De(0,i,c):i=De(-1,i,c-1),i}function hy(e,t,n){let r=n.length;for(let s=0;s<n.length;s++)if(n[s]>1){r=s;break}for(let s=r+1;s<n.length;s++)if(t[s]>0||n[s]!==e[s])return!1;return!0}function fy(e,t){let n=e.length>0?e[e.length-1]:1;for(let r=0;r<e.length-1;r++)n+=e[r]*t[r];return n}function dy(e,t,n){let r;const s=e.shape.length;typeof t=="number"?r=[t,...new Array(s-1).fill(0)]:t.length<s?r=t.concat(new Array(s-t.length).fill(0)):r=t.slice(),r.forEach(i=>{p(i!==-1,()=>"slice() does not support negative begin indexing.")});let o;return n==null?o=new Array(s).fill(-1):typeof n=="number"?o=[n,...new Array(s-1).fill(-1)]:n.length<s?o=n.concat(new Array(s-n.length).fill(-1)):o=n,o=o.map((i,a)=>i>=0?i:(p(i===-1,()=>`Negative size values should be exactly -1 but got ${i} for the slice() size at index ${a}.`),e.shape[a]-r[a])),[r,o]}function py(e,t,n,r,s,o,i,a,c){let u;if(r==null?(u=new Array(t.length),u.fill(1)):u=r,i!=null&&(i&i-1)!==0)throw new Error("Multiple ellipses in slice is not allowed.");let h=!1;const l={dims:u.length,numAddAxisAfterEllipsis:0,begin:t.slice(),end:n.slice(),strides:u.slice(),beginMask:s,endMask:o,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:c};for(let S=0;S<l.dims;S++)h&&(1<<S&a)!==0&&l.numAddAxisAfterEllipsis++,1<<S&i&&(h=!0);h||(l.ellipsisMask|=1<<l.dims,l.dims++);const f={dims:e.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};gy(l,f);let g=!0,y=!0,$=!0;const E=[],v=[];for(let S=0;S<e.length;++S){if(f.strides[S]===0)throw Error(`strides[${S}] must be non-zero`);const _=!!(f.shrinkAxisMask&1<<S),A=e[S];if(A===-1){E.push(_?1:-1);continue}const N=[f.beginMask&1<<S,f.endMask&1<<S],R=[f.strides[S]>0?0:-1,f.strides[S]>0?A:A-1];if(_&&f.strides[S]<=0)throw Error("only stride 1 allowed on non-range indexing.");$=$&&f.strides[S]===1;const M=!!(f.beginMask&1<<S&&f.endMask&1<<S);if(f.beginValid&&f.endValid){if(_){const I=f.begin[S]<0?A+f.begin[S]:f.begin[S];if(f.begin[S]=I,f.end[S]=f.begin[S]+1,I<0||I>=A)throw Error(`slice index ${f.begin[S]} of dimension ${S} out of bounds.`)}else f.begin[S]=Ds(f.begin[S],0,f.strides[S],A,N,R),f.end[S]=Ds(f.end[S],1,f.strides[S],A,N,R);const m=f.strides[S]===1&&f.begin[S]===0&&f.end[S]===A;g=g&&m,y=y&&(S===0&&f.strides[S]===1||m)}else g=g&&f.strides[S]===1&&M,y=y&&(S===0&&f.strides[S]===1||M);let x,k=!1;if(f.beginValid&&f.endValid?(x=f.end[S]-f.begin[S],k=!0):_?(x=1,k=!0):M&&A>=0&&(f.strides[S]<0?x=-A:x=A,k=!0),k){let m;x===0||x<0!=f.strides[S]<0?m=0:m=Math.trunc(x/f.strides[S])+(x%f.strides[S]!==0?1:0),E.push(m)}else E.push(-1)}for(let S=0;S<f.finalShapeGatherIndices.length;++S){const _=f.finalShapeGatherIndices[S];_>=0?v.push(E[_]):_===Er&&v.push(1)}return{finalShapeSparse:v.filter((S,_)=>f.finalShapeGatherIndices[_]!==Er),finalShape:v,isIdentity:g,sliceDim0:y,isSimpleSlice:$,begin:f.begin,end:f.end,strides:f.strides}}function gy(e,t){t.beginMask=0,t.endMask=0,t.shrinkAxisMask=0;let n=0;t.beginValid=e.begin!=null,t.endValid=e.end!=null,t.begin=new Array(t.dims),t.end=new Array(t.dims),t.strides=new Array(t.dims),t.finalShapeGatherIndices=[],t.finalShapeGatherIndicesSparse=[],t.inputShapeGatherIndicesSparse=new Array(t.dims);for(let r=0;r<e.dims;r++)if(1<<r&e.ellipsisMask){const s=Math.min(t.dims-(e.dims-r)+1+e.numAddAxisAfterEllipsis,t.dims);for(;n<s;n++)t.begin[n]=0,t.end[n]=0,t.strides[n]=1,t.beginMask|=1<<n,t.endMask|=1<<n,t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(-1),t.inputShapeGatherIndicesSparse[n]=r}else if(1<<r&e.newAxisMask)t.finalShapeGatherIndices.push(Er),t.finalShapeGatherIndicesSparse.push(-1);else{if(n===t.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${t.dims} dims, ${t.begin.length}.`);e.begin!=null&&(t.begin[n]=e.begin[r]),e.end!=null&&(t.end[n]=e.end[r]),t.strides[n]=e.strides[r],e.beginMask&1<<r&&(t.beginMask|=1<<n),e.endMask&1<<r&&(t.endMask|=1<<n),e.shrinkAxisMask&1<<r?(t.finalShapeGatherIndices.push(iy),t.finalShapeGatherIndicesSparse.push(-1),t.shrinkAxisMask|=1<<n):(t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(r)),t.inputShapeGatherIndicesSparse[n]=r,n++}}function Ds(e,t,n,r,s,o){if(s[t])return n>0?o[t]:o[t+1&1];{const i=e<0?r+e:e;return i<o[0]?o[0]:i>o[1]?o[1]:i}}const vu=Object.freeze(Object.defineProperty({__proto__:null,assertParamsValid:ay,computeFlatOffset:fy,computeOutShape:uy,getNormalizedAxes:ly,isSliceContinous:hy,maskToAxes:cy,parseSliceParams:dy,sliceInfo:py,startForAxis:ku,startIndicesWithElidedDims:yu,stopForAxis:xu,stopIndicesWithElidedDims:$u,stridesForAxis:Eu,stridesWithElidedDims:mu},Symbol.toStringTag,{value:"Module"}));/** @license See the LICENSE file. */const my="4.20.0";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */class Su{static sgd(t){return new Un(t)}static momentum(t,n,r=!1){return new rs(t,n,r)}static rmsprop(t,n=.9,r=0,s=null,o=!1){return new ss(t,n,r,s,o)}static adam(t=.001,n=.9,r=.999,s=null){return new es(t,n,r,s)}static adadelta(t=.001,n=.95,r=null){return new Qr(t,n,r)}static adamax(t=.002,n=.9,r=.999,s=null,o=0){return new ns(t,n,r,s,o)}static adagrad(t,n=.1){return new ts(t,n)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const by=Su;/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */const wy=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:e=>e();function yy(){return new Promise(e=>wy(()=>e()))}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */function $y(e,t){const n=e[0].length;e.forEach((s,o)=>{p(s.length===n,()=>`Error in concat${n}D: rank of tensors[${o}] must be the same as the rank of the rest (${n})`)}),p(t>=0&&t<n,()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`);const r=e[0];e.forEach((s,o)=>{for(let i=0;i<n;i++)p(i===t||s[i]===r[i],()=>`Error in concat${n}D: Shape of tensors[${o}] (${s}) does not match the shape of the rest (${r}) along the non-concatenated axis ${o}.`)})}function Ey(e,t){const n=e[0].slice();for(let r=1;r<e.length;r++)n[t]+=e[r][t];return n}/**
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
 */var Tt;(function(e){e[e.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",e[e.VALUE_ROWIDS=1]="VALUE_ROWIDS",e[e.ROW_LENGTHS=2]="ROW_LENGTHS",e[e.ROW_SPLITS=3]="ROW_SPLITS",e[e.ROW_LIMITS=4]="ROW_LIMITS",e[e.ROW_STARTS=5]="ROW_STARTS"})(Tt||(Tt={}));function ky(e,t,n){let r=new Array;if(n==null&&t==null)return r;if(t==null)for(;r.length<e+n.length;)r.push(-1);else r=t.slice();if(n==null)return r;if(e+n.length!==r.length)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.rank = ${e+n.length}, but shape.rank = ${r.length}`);for(let s=1;s<n.length;++s){const o=n[s],i=r[r.length-n.length+s],a=r[i];if(o>=0)if(a>=0){if(a!==o)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.shape[${s+e}] = ${o} but shape[${s+e}] = ${a}`)}else r[i]=o}return r}function xy(e){const t={FIRST_DIM_SIZE:Tt.FIRST_DIM_SIZE,VALUE_ROWIDS:Tt.VALUE_ROWIDS,ROW_LENGTHS:Tt.ROW_LENGTHS,ROW_SPLITS:Tt.ROW_SPLITS,ROW_LIMITS:Tt.ROW_LIMITS,ROW_STARTS:Tt.ROW_STARTS},n=[];for(const r of e)if(r in t)n.push(t[r]);else break;return n}function vy(e){return e.length===0?0:e[0]===Tt.FIRST_DIM_SIZE?e.length-1:e.length}function Sy(e,t){if(e==null||t==null)return;const n=e.length,r=t.length;if(n>=r)throw new Error(`defaultValue.shape=${e} and ragged tensor flatValues.shape=${t}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${r})`);for(let s=0;s<Math.min(n,r-1);++s){const o=e[s],i=t[s+1];if(o>=0&&i>=0&&o!==1&&o!==i)throw new Error(`defaultValue.shape=${e}, and ragged tensor input flatValues.shape=${t} are incompatible: defaultValue.shape[${s-e.length}] = ${o} but ragged tensor input.flatValues.shape[${s-e.length}] = ${i}`)}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */const as=30;function Ty(e){return e<=as?e:bn(e,Math.floor(Math.sqrt(e)))}/**
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
 */function Iy(e,t,n){const r=n*(typeof e=="number"?e:e[0]),s=t*(typeof e=="number"?e:e[1]);return[r,s]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function _y(e,t,n,r=!0){let s=[];if(r)s=s.concat(t.slice(0)),s.push(e[0]/n),s=s.concat(e.slice(1));else{s=s.concat(e[0]);const o=t.length;for(let i=0;i<o;++i)s=s.concat([e[i+1]/t[i],t[i]]);s=s.concat(e.slice(o+1))}return s}function Ay(e,t,n=!0){const r=[];if(n){r.push(t);for(let s=t+1;s<e;++s)s<=2*t?(r.push(s),r.push(s-(t+1))):r.push(s)}else{const s=[],o=[];for(let i=1;i<e;++i)i>=t*2+1||i%2===1?o.push(i):s.push(i);r.push(...s),r.push(0),r.push(...o)}return r}function Dy(e,t,n,r=!0){const s=[];r?s.push(e[0]/n):s.push(e[0]*n);for(let o=1;o<e.length;++o)o<=t.length?r?s.push(t[o-1]*e[o]):s.push(e[o]/t[o-1]):s.push(e[o]);return s}function Ny(e,t){const n=[0];for(let r=0;r<t;++r)n.push(e[r][0]);return n}function My(e,t,n){const r=e.slice(0,1);for(let s=0;s<n;++s)r.push(e[s+1]-t[s][0]-t[s][1]);return r}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const Fy=1.7580993408473768,By=1.0507009873554805;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */const Ry=.3275911,Cy=.254829592,Py=-.284496736,Oy=1.421413741,Ly=-1.453152027,Wy=1.061405429;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function qy(e,t){if(e.length!==t.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${e.length}, imag: ${t.length}.`);const n=new Float32Array(e.length*2);for(let r=0;r<n.length;r+=2)n[r]=e[r/2],n[r+1]=t[r/2];return n}function Uy(e){const t=new Float32Array(e.length/2),n=new Float32Array(e.length/2);for(let r=0;r<e.length;r+=2)t[r/2]=e[r],n[r/2]=e[r+1];return{real:t,imag:n}}function Gy(e){const t=Math.ceil(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let s=0;s<e.length;s+=4)n[Math.floor(s/4)]=e[s],r[Math.floor(s/4)]=e[s+1];return{real:n,imag:r}}function zy(e){const t=Math.floor(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let s=2;s<e.length;s+=4)n[Math.floor(s/4)]=e[s],r[Math.floor(s/4)]=e[s+1];return{real:n,imag:r}}function Ky(e,t){const n=e[t*2],r=e[t*2+1];return{real:n,imag:r}}function jy(e,t,n,r){e[r*2]=t,e[r*2+1]=n}function Vy(e,t){const n=new Float32Array(e/2),r=new Float32Array(e/2);for(let s=0;s<Math.ceil(e/2);s++){const o=(t?2:-2)*Math.PI*(s/e);n[s]=Math.cos(o),r[s]=Math.sin(o)}return{real:n,imag:r}}function Hy(e,t,n){const r=(n?2:-2)*Math.PI*(e/t),s=Math.cos(r),o=Math.sin(r);return{real:s,imag:o}}/**
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
 */const Zn="->",Xy=/->/g,Ns=",",Ms="...";function Zy(e,t){e=e.replace(/\s/g,"");const n=(e.length-e.replace(Xy,"").length)/Zn.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${Zn}").`);const[r,s]=e.split(Zn);p(r.indexOf(Ms)===-1,()=>`The ellipsis notation ("${Ms}") is not supported yet.`);const o=r.split(Ns),i=o.length;if(t!==i)throw new Error(`Expected ${i} input tensors, received ${t}`);if(i>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const a=[];for(let f=0;f<s.length;++f){const g=s[f];if(!o.some(y=>y.indexOf(g)!==-1))throw new Error(`Output subscripts contain the label ${g} not present in the input subscripts.`);a.indexOf(g)===-1&&a.push(g)}for(let f=0;f<r.length;++f){const g=r[f];a.indexOf(g)===-1&&g!==Ns&&a.push(g)}const c=new Array(o.length);for(let f=0;f<i;++f){if(new Set(o[f].split("")).size!==o[f].length)throw new Error(`Found duplicate axes in input component ${o[f]}. Support for duplicate axes in input is not implemented yet.`);c[f]=[];for(let g=0;g<o[f].length;++g)c[f].push(a.indexOf(o[f][g]))}const u=a.length,h=s.length,l=[];for(let f=h;f<u;++f)l.push(f);return{allDims:a,summedDims:l,idDims:c}}function Yy(e,t){let n=new Array(e);n.fill(-1);for(let s=0;s<t.length;++s)n[t[s]]=s;const r=[];for(let s=0;s<e;++s)n[s]===-1&&r.push(s);return n=n.filter(s=>s!==-1),{permutationIndices:n,expandDims:r}}function Jy(e,t,n){const r=new Array(e);for(let s=0;s<n.length;++s){const o=n[s].shape;for(let i=0;i<t[s].length;++i)r[t[s][i]]===void 0?r[t[s][i]]=o[i]:p(r[t[s][i]]===o[i],()=>`Expected dimension ${r[t[s][i]]} at axis ${i} of input shaped ${JSON.stringify(o)}, but got dimension ${o[i]}`)}}function Qy(e,t){const n=e,r=[];let s=0;e.length===0&&n.push(-1),s=e.length+1;for(let i=0;i<s;++i)r.push([]);const o=[];for(let i=0;i<n.length;++i){const a=n[i],c=e$(t,a);for(const u of c)o.indexOf(u)===-1&&(r[i].push(u),o.push(u))}return{path:n,steps:r}}function t$(e){return e.every((t,n)=>t===n)}function e$(e,t){const n=[];for(let r=0;r<e.length;++r)(e[r].length===0||e[r].indexOf(t)!==-1||t===-1)&&n.push(r);return n}function n$(e,t,n=0){let r=[];if(typeof t=="number")p(e.shape[n]%t===0,()=>"Number of splits must evenly divide the axis."),r=new Array(t).fill(e.shape[n]/t);else{const s=t.reduce((i,a)=>(a===-1&&(i+=1),i),0);p(s<=1,()=>"There should be only one negative value in split array.");const o=t.indexOf(-1);if(o!==-1){const i=t.reduce((a,c)=>c>0?a+c:a);t[o]=e.shape[n]-i}p(e.shape[n]===t.reduce((i,a)=>i+a),()=>"The sum of sizes must match the size of the axis dimension."),r=t}return r}/**
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
 */function r$(e){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${e}`}function s$(e,t){return`indices(${e}, 0) is invalid: ${t} < 0`}function o$(e,t,n){return`indices(${e}, 0) is invalid: ${t} >= ${n}`}/**
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
 */function i$(e,t){return`only one output dimension may be -1, not both ${e} and ${t}`}function a$(e,t){return`size ${e} must be non-negative, not ${t}`}function c$(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function u$(e,t){const n=G(e),r=G(t);return`Input to reshape is a SparseTensor with ${n}
  dense values, but the requested shape requires a multiple of ${r}. inputShape=${e} outputShape= ${t}`}function l$(e,t){const n=G(e),r=G(t);return`Input to reshape is a tensor with ${n} dense values, but the requested shape has ${r}. inputShape=${e} outputShape=${t}`}/**
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
 */function h$(){return"segment ids must be >= 0"}function f$(){return"segment ids are not increasing"}function d$(e,t){return`Segment id ${e} out of range [0, ${t}), possibly because segmentIds input is not sorted.`}function p$(e,t,n){return`Bad: indices[${e}] == ${t} out of range [0, ${n})`}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function g$(e,t){let n=!1,r;for(e<=as?(r=e,n=!0):r=bn(e,Math.floor(Math.sqrt(e)));!n;)r>t||r===e?n=!0:r=bn(e,r+1);return r}function m$(e,t,n){const r=[],s=e.length;for(let o=0;o<s;o++)o!==t?r.push(e[o]):r.push(n);return r}function b$(e,t,n,r){const s=t.shape.length,o=e.shape.length;if(r!==0&&(r<-s||r>s))throw new Error(`Expect batchDims in the range of [-${s}, ${s}], but got ${r}`);if(r<0&&(r+=s),r>o)throw new Error(`batchDims (${r}) must be less than rank(x) (
    ${o}).`);if(n<r)throw new Error(`batchDims (${r}) must be less than or equal to axis (${n}).`);for(let l=0;l<r;++l)if(e.shape[l]!==t.shape[l])throw new Error(`x.shape[${l}]: ${e.shape[l]} should be equal to indices.shape[${l}]: ${t.shape[l]}.`);const i=e.shape[n],a=[];let c=1,u=1,h=1;for(let l=0;l<r;++l)a.push(e.shape[l]),c*=e.shape[l];for(let l=r;l<n;l++)a.push(e.shape[l]),u*=e.shape[l];for(let l=r;l<s;l++)a.push(t.shape[l]);for(let l=n+1;l<o;l++)a.push(e.shape[l]),h*=e.shape[l];return{batchSize:c,sliceSize:h,outerSize:u,dimSize:i,outputShape:a}}const w$=Object.freeze(Object.defineProperty({__proto__:null,collectGatherOpShapeInfo:b$,computeOutShape:m$,segOpComputeOptimalWindowSize:g$},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
 */function y$(e){try{return e.map(t=>yn(t))}catch(t){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${t}`)}}function $$(e){return e.map(t=>He(t))}const E$=Object.freeze(Object.defineProperty({__proto__:null,ERF_A1:Cy,ERF_A2:Py,ERF_A3:Oy,ERF_A4:Ly,ERF_A5:Wy,ERF_P:Ry,PARALLELIZE_THRESHOLD:as,get RowPartitionType(){return Tt},SELU_SCALE:By,SELU_SCALEALPHA:Fy,applyActivation:Wn,assertAndGetBroadcastShape:rt,assertAxesAreInnerMostDims:mp,assertParamsConsistent:$y,assignToTypedArray:jy,axesAreInnerMostDims:Or,calculateShapes:Yc,checkEinsumDimSizes:Jy,checkPadOnDimRoundingMode:kt,combineLocations:vc,combineRaggedTensorToTensorShapes:ky,complexWithEvenIndex:Gy,complexWithOddIndex:zy,computeConv2DInfo:Ye,computeConv3DInfo:gc,computeDefaultPad:Rr,computeDilation2DInfo:Wf,computeOptimalWindowSize:Ty,computeOutAndReduceShapes:gp,computeOutShape:Ey,computePool2DInfo:pc,computePool3DInfo:qf,convertConv2DDataFormat:mc,decodeEinsumEquation:Zy,eitherStridesOrDilationsAreOne:Bt,expandShapeToKeepDim:Qe,exponent:Hy,exponents:Vy,fromStringArrayToUint8:$$,fromUint8ToStringArray:y$,getAxesPermutation:bp,getBroadcastDims:Ec,getComplexWithIndex:Ky,getEinsumComputePath:Qy,getEinsumPermutation:Yy,getFusedBiasGradient:Ln,getFusedDyActivation:On,getImageCenter:Iy,getInnerMostAxes:yp,getPermuted:Ay,getRaggedRank:vy,getReductionAxes:Pr,getReshaped:_y,getReshapedPermuted:Dy,getRowPartitionTypesHelper:xy,getSliceBeginCoords:Ny,getSliceSize:My,getSparseFillEmptyRowsIndicesDenseShapeMismatch:r$,getSparseFillEmptyRowsNegativeIndexErrorMessage:s$,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:o$,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:c$,getSparseReshapeInputOutputMismatchErrorMessage:l$,getSparseReshapeInputOutputMultipleErrorMessage:u$,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:i$,getSparseReshapeNegativeOutputDimErrorMessage:a$,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:p$,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:h$,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:f$,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:d$,getUndoAxesPermutation:wp,isIdentityPermutation:t$,log:ml,mergeRealAndImagArrays:qy,prepareAndValidate:gu,prepareSplitSize:n$,segment_util:w$,shouldFuse:qn,slice_util:vu,splitRealAndImagArrays:Uy,stridesOrDilationsArePositive:se,tupleValuesAreOne:Oe,upcastType:An,validateDefaultValueShape:Sy,validateInput:Pn,validateUpdateShape:Xr,warn:Pt},Symbol.toStringTag,{value:"Module"}));/**
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
 */const k$=Object.freeze(Object.defineProperty({__proto__:null,nonMaxSuppressionV3Impl:ru,nonMaxSuppressionV4Impl:su,nonMaxSuppressionV5Impl:ou,whereImpl:Jc},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
 */I1();const x$=Object.freeze(Object.defineProperty({__proto__:null,Abs:js,Acos:Vs,Acosh:Hs,AdadeltaOptimizer:Qr,AdagradOptimizer:ts,AdamOptimizer:es,AdamaxOptimizer:ns,Add:Tr,AddN:Xs,All:Zs,Any:Ys,ArgMax:Js,ArgMin:Qs,Asin:to,Asinh:eo,Atan:no,Atan2:so,Atanh:ro,AvgPool:oo,AvgPool3D:io,AvgPool3DGrad:Ju,AvgPoolGrad:Yu,BatchMatMul:ao,BatchToSpaceND:co,Bincount:uo,BitwiseAnd:lo,BroadcastArgs:ho,BroadcastTo:Qu,Cast:Ir,Ceil:fo,ClipByValue:po,Complex:go,ComplexAbs:mo,Concat:bo,Conv2D:wo,Conv2DBackpropFilter:yo,Conv2DBackpropInput:$o,Conv3D:Eo,Conv3DBackpropFilterV2:tl,Conv3DBackpropInputV2:ko,Cos:xo,Cosh:vo,CropAndResize:Io,Cumprod:So,Cumsum:To,DataStorage:Au,DenseBincount:_o,DepthToSpace:Ao,DepthwiseConv2dNative:Do,DepthwiseConv2dNativeBackpropFilter:No,DepthwiseConv2dNativeBackpropInput:Mo,Diag:Fo,Dilation2D:Bo,Dilation2DBackpropFilter:nl,Dilation2DBackpropInput:el,Draw:_r,get ENV(){return vr},Einsum:Co,Elu:Po,EluGrad:rl,Environment:zs,Equal:Lo,Erf:Oo,Exp:Wo,ExpandDims:qo,Expm1:Uo,FFT:Go,Fill:zo,FlipLeftRight:Ko,Floor:jo,FloorDiv:Vo,FromPixels:Yn,FusedBatchNorm:Ho,FusedConv2D:Qn,FusedDepthwiseConv2D:tr,GatherNd:Zo,GatherV2:Xo,Greater:Yo,GreaterEqual:Jo,IFFT:Qo,Identity:Ar,Imag:ti,IsFinite:ei,IsInf:ni,IsNan:ri,KernelBackend:Fs,LRN:di,LRNGrad:al,LeakyRelu:si,Less:oi,LessEqual:ii,LinSpace:ai,Log:ci,Log1p:ui,LogSoftmax:ol,LogicalAnd:li,LogicalNot:hi,LogicalOr:fi,LogicalXor:sl,LowerBound:il,MatrixBandPart:cl,Max:pi,MaxPool:mi,MaxPool3D:bi,MaxPool3DGrad:ll,MaxPoolGrad:ul,MaxPoolWithArgmax:wi,Maximum:gi,Mean:yi,Min:$i,Minimum:Ei,MirrorPad:ki,Mod:xi,MomentumOptimizer:rs,Multinomial:vi,Multiply:Si,Neg:Ti,NonMaxSuppressionV3:_i,NonMaxSuppressionV4:Ai,NonMaxSuppressionV5:Di,NotEqual:Ii,OP_SCOPE_SUFFIX:Za,OneHot:Mi,OnesLike:Ni,Optimizer:Ht,OptimizerConstructors:Su,Pack:Fi,PadV2:Bi,Pool:hl,Pow:Ri,Prelu:Ci,Prod:Pi,RMSPropOptimizer:ss,RaggedGather:Oi,RaggedRange:Li,RaggedTensorToTensor:Wi,Range:qi,get Rank(){return rr},Real:Ui,RealDiv:Ro,Reciprocal:Gi,get Reduction(){return lt},Relu:zi,Relu6:Hi,Reshape:Ki,ResizeBilinear:Vi,ResizeBilinearGrad:dl,ResizeNearestNeighbor:ji,ResizeNearestNeighborGrad:fl,Reverse:Xi,RotateWithOffset:Ra,Round:Zi,Rsqrt:Yi,SGDOptimizer:Un,ScatterNd:Ji,SearchSorted:ta,Select:ea,Selu:na,Sigmoid:aa,Sign:ia,Sin:sa,Sinh:oa,Slice:ra,Softmax:da,Softplus:ca,SpaceToBatchND:ha,SparseFillEmptyRows:pa,SparseReshape:ga,SparseSegmentMean:ma,SparseSegmentSum:ba,SparseToDense:wa,SplitV:fa,Sqrt:ua,Square:pl,SquaredDifference:ya,StaticRegexReplace:$a,Step:Ba,StridedSlice:Ea,StringNGrams:ka,StringSplit:xa,StringToHashBucketFast:va,Sub:Sa,Sum:la,Tan:Ta,Tanh:Ia,Tensor:et,TensorBuffer:$n,TensorScatterUpdate:Qi,Tile:Dr,TopK:_a,Transform:Aa,Transpose:rn,Unique:Da,Unpack:Na,UnsortedSegmentSum:Ma,UpperBound:gl,Variable:Be,ZerosLike:Fa,_FusedMatMul:Jn,abs:wt,acos:bf,acosh:yf,add:P,addN:Ef,all:xf,any:Sf,argMax:If,argMin:Af,asin:Nf,asinh:Ff,atan:Rf,atan2:Pf,atanh:Lf,avgPool:bc,avgPool3d:Xf,backend:tc,backend_util:E$,basicLSTMCell:td,batchNorm:Dn,batchNorm2d:od,batchNorm3d:ad,batchNorm4d:ud,batchToSpaceND:wc,bincount:yc,bitwiseAnd:fd,booleanMaskAsync:hw,broadcastArgs:pd,broadcastTo:an,broadcast_util:ep,browser:sy,buffer:Nt,cast:H,ceil:bd,clipByValue:yd,clone:te,complex:Kt,concat:gt,concat1d:Ed,concat2d:xd,concat3d:Sd,concat4d:oh,conv1d:_d,conv2d:Nn,conv2dTranspose:Nd,conv3d:Fd,conv3dTranspose:Pd,copyRegisteredKernels:$l,cos:Ld,cosh:qd,cosineWindow:Yr,cumprod:Gd,cumsum:Kd,customGrad:At,denseBincount:Vd,deprecationWarn:gh,depthToSpace:Xd,depthwiseConv2d:Cr,device_util:uh,diag:Jd,dilation2d:tp,disableDeprecationWarnings:ph,dispose:ft,disposeVariables:mh,div:V,divNoNan:ip,dot:cp,dropout:vw,einsum:he,elu:xc,enableDebugMode:dh,enableProdMode:fh,enclosingPowerOfTwo:tu,engine:bh,ensureShape:fp,env:L,equal:kc,erf:pp,euclideanNorm:_p,exp:oe,expandDims:Ct,expm1:Mp,eye:Tc,fft:jr,fill:Je,findBackend:vh,findBackendFactory:Sh,floor:Ic,floorDiv:dc,fused:Lw,gather:_c,gatherND:Ew,gather_util:oy,getBackend:Qa,getGradient:er,getKernel:Me,getKernelsForBackend:wn,grad:tg,grads:eg,greater:Fn,greaterEqual:Ac,ifft:vn,imag:Bn,image:w1,inTopKAsync:Tw,io:K1,irfft:Vc,isFinite:qp,isInf:Gp,isNaN:Kp,keep:Ja,kernel_impls:k$,leakyRelu:Dc,less:mr,lessEqual:Lr,linalg:y1,linspace:Xp,localResponseNormalization:Yp,log:We,log1p:Nc,logSigmoid:ag,logSoftmax:lg,logSumExp:Bc,logicalAnd:En,logicalNot:Rc,logicalOr:Cc,logicalXor:mg,losses:$1,lowerBound:wg,matMul:U,math:H1,max:be,maxPool:Pc,maxPool3d:Eg,maxPoolWithArgmax:xg,maximum:Oc,mean:kn,memory:wh,meshgrid:Tg,min:gr,minimum:xn,mirrorPad:Ag,mod:Ng,moments:Fg,movingAverage:pw,mul:D,multiRNNCell:Rg,multinomial:Pg,neg:It,nextFrame:yy,norm:Mn,notEqual:Lc,oneHot:br,ones:Qt,onesLike:qg,op:b,outerProduct:Gg,pad:Xe,pad1d:Kg,pad2d:Vg,pad3d:Xg,pad4d:Jl,pool:tm,pow:Le,prelu:qc,print:fc,prod:rm,profile:yh,raggedGather:om,raggedRange:am,raggedTensorToTensor:um,rand:hm,randomGamma:Gm,randomNormal:zc,randomStandardNormal:jm,randomUniform:Kr,randomUniformInt:Xm,range:qe,ready:kh,real:Ue,reciprocal:Jm,registerBackend:Th,registerGradient:bl,registerKernel:Ca,relu:Cn,relu6:Kc,removeBackend:xh,reshape:T,reverse:ie,reverse1d:rb,reverse2d:ob,reverse3d:ab,reverse4d:ub,rfft:Vr,round:jc,rsqrt:fb,scalar:z,scatterND:mw,scatter_util:Xb,searchSorted:Wr,selu:pb,separableConv2d:mb,serialization:S1,setBackend:Eh,setPlatform:Ih,setdiff1dAsync:wb,sigmoid:me,sign:$b,signal:b1,sin:kb,sinh:vb,slice:X,slice1d:Tb,slice2d:_b,slice3d:Db,slice4d:eh,slice_util:vu,softmax:Mb,softplus:Fc,spaceToBatchND:Wc,sparse:E1,sparseToDense:yw,spectral:m1,split:Ge,sqrt:Mt,square:vt,squaredDifference:Hc,squeeze:Hr,stack:ze,step:Xc,stridedSlice:Gb,string:k1,sub:W,sum:j,sumOutType:zl,tan:Kb,tanh:pr,tensor:de,tensor1d:Et,tensor2d:Ae,tensor3d:Zc,tensor4d:jb,tensor5d:Vb,tensor6d:Hb,tensorScatterUpdate:Yb,tensor_util:Vl,test_util:Lm,tidy:nt,tile:_e,time:$h,topk:Qb,train:by,transpose:Sn,truncatedNormal:ew,unique:rw,unregisterGradient:yl,unregisterKernel:wl,unsortedSegmentSum:ow,unstack:Zr,upcastType:An,upperBound:aw,util:Fl,valueAndGrad:ng,valueAndGrads:rg,variable:cw,variableGrads:Mc,version_core:my,where:Ut,whereAsync:Qc,zeros:Ee,zerosLike:yt},Symbol.toStringTag,{value:"Module"}));export{mb as $,me as A,Fc as B,pr as C,Mb as D,lg as E,pp as F,Mt as G,Le as H,j as I,ew as J,Kr as K,Ee as L,Qt as M,z as N,Tc as O,G as P,y1 as Q,cw as R,Ot as S,Ft as T,Sn as U,w1 as V,Dw as W,_d as X,Fd as Y,Nd as Z,Pd as _,p as a,y$ as a$,Pc as a0,kn as a1,be as a2,Hr as a3,Eg as a4,Xf as a5,bc as a6,Ic as a7,br as a8,It as a9,_h as aA,Rh as aB,de as aC,oh as aD,Jl as aE,w as aF,L as aG,Ec as aH,ke as aI,Fs as aJ,Au as aK,bh as aL,Uu as aM,qy as aN,yn as aO,Nt as aP,zt as aQ,Mu as aR,Lt as aS,He as aT,Ps as aU,Th as aV,ki as aW,Ar as aX,je as aY,kr as aZ,Bi as a_,We as aa,W as ab,Oc as ac,Je as ad,Nc as ae,oe as af,Ct as ag,En as ah,qg as ai,xf as aj,U as ak,ft as al,yy as am,Us as an,Ja as ao,Ut as ap,Fn as aq,kc as ar,If as as,by as at,te as au,et as av,Ht as aw,Bs as ax,wh as ay,Uh as az,tc as b,Ku as b0,zu as b1,gp as b2,An as b3,Tn as b4,hy as b5,fy as b6,$$ as b7,ra as b8,dy as b9,Ca as bA,x$ as bB,ay as ba,By as bb,Fy as bc,Ry as bd,Cy as be,Py as bf,Oy as bg,Ly as bh,Wy as bi,Wu as bj,rt as bk,Qn as bl,mc as bm,Ye as bn,Ke as bo,bp,yp as bq,mp as br,Qe as bs,zl as bt,mi as bu,pc as bv,ji as bw,Ey as bx,bo as by,$y as bz,eh as c,Db as d,_b as e,Tb as f,gt as g,H as h,P as i,xc as j,yd as k,V as l,D as m,Fe as n,wt as o,zc as p,Et as q,T as r,X as s,nt as t,_c as u,iu as v,au as w,pb as x,Cn as y,xn as z};
