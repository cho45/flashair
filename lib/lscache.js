/**
 * lscache library
 * Copyright (c) 2011, Pamela Fox
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var lscache=function(){function j(){if(void 0!==f)return f;try{k("__lscachetest__","__lscachetest__"),e("__lscachetest__"),f=!0}catch(a){f=!1}return f}function n(){void 0===i&&(i=null!=window.JSON);return i}function k(a,b){localStorage.removeItem(d+a);localStorage.setItem(d+a,b)}function e(a){localStorage.removeItem(d+a)}var d="lscache-",o=Math.floor(144E9),f,i;return{set:function(a,b,g){if(j()){if("string"!==typeof b){if(!n())return;try{b=JSON.stringify(b)}catch(f){return}}try{k(a,b)}catch(i){if("QUOTA_EXCEEDED_ERR"===
i.name||"NS_ERROR_DOM_QUOTA_REACHED"===i.name){for(var l=[],c,h=0;h<localStorage.length;h++)if(c=localStorage.key(h),0===c.indexOf(d)&&0>c.indexOf("-cacheexpiration")){c=c.substr(d.length);var m=localStorage.getItem(d+(c+"-cacheexpiration")),m=m?parseInt(m,10):o;l.push({key:c,size:(localStorage.getItem(d+c)||"").length,expiration:m})}l.sort(function(a,b){return b.expiration-a.expiration});for(h=(b||"").length;l.length&&0<h;)c=l.pop(),e(c.key),e(c.key+"-cacheexpiration"),h-=c.size;try{k(a,b)}catch(p){return}}else return}g?
k(a+"-cacheexpiration",(Math.floor((new Date).getTime()/6E4)+g).toString(10)):e(a+"-cacheexpiration")}},get:function(a){if(!j())return null;var b=a+"-cacheexpiration",g=localStorage.getItem(d+b);if(g&&(g=parseInt(g,10),Math.floor((new Date).getTime()/6E4)>=g))return e(a),e(b),null;a=localStorage.getItem(d+a);if(!a||!n())return a;try{return JSON.parse(a)}catch(f){return a}},remove:function(a){if(!j())return null;e(a);e(a+"-cacheexpiration")},supported:function(){return j()},flush:function(){if(j())for(var a=
localStorage.length-1;0<=a;--a){var b=localStorage.key(a);0===b.indexOf(d)&&localStorage.removeItem(b)}}}}();
