/*
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without 
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice, 
    this list of conditions and the following disclaimer.
  
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the 
    documentation and/or other materials provided with the distribution.
  
  * Neither the name of Adobe Systems Incorporated nor the names of its 
    contributors may be used to endorse or promote products derived from 
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*
JPEG encoder ported to JavaScript and optimized by Andreas Ritter, www.bytestrom.eu, 11/2009

Basic GUI blocking jpeg encode

v 0.9a

Licensed under the MIT License

Copyright (c) 2009 Andreas Ritter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

function JPEGEncoder(B){function y(c,o){for(var a=0,b=0,d=[],h=1;16>=h;h++){for(var i=1;i<=c[h];i++)d[o[b]]=[],d[o[b]][0]=a,d[o[b]][1]=h,b++,a++;a*=2}return d}function u(c){for(var o=c[0],c=c[1]-1;0<=c;)o&1<<c&&(w|=1<<v),c--,v--,0>v&&(255==w?(a(255),a(0)):a(w),v=7,w=0)}function a(c){z.push(J[c])}function i(c){a(c>>8&255);a(c&255)}function D(c,o,a,b,d){var h=d[0],i=d[240],n,l,p,j,m,g,f,q,k,e=0;for(n=0;8>n;++n){l=c[e];p=c[e+1];j=c[e+2];m=c[e+3];g=c[e+4];f=c[e+5];q=c[e+6];k=c[e+7];var r=l+k;l-=k;k=p+
q;p-=q;q=j+f;j-=f;f=m+g;m-=g;g=r+f;r-=f;f=k+q;k-=q;c[e]=g+f;c[e+4]=g-f;g=0.707106781*(k+r);c[e+2]=r+g;c[e+6]=r-g;g=m+j;f=j+p;k=p+l;j=0.382683433*(g-k);m=0.5411961*g+j;g=1.306562965*k+j;f*=0.707106781;j=l+f;l-=f;c[e+5]=l+m;c[e+3]=l-m;c[e+1]=j+g;c[e+7]=j-g;e+=8}for(n=e=0;8>n;++n)l=c[e],p=c[e+8],j=c[e+16],m=c[e+24],g=c[e+32],f=c[e+40],q=c[e+48],k=c[e+56],r=l+k,l-=k,k=p+q,p-=q,q=j+f,j-=f,f=m+g,m-=g,g=r+f,r-=f,f=k+q,k-=q,c[e]=g+f,c[e+32]=g-f,g=0.707106781*(k+r),c[e+16]=r+g,c[e+48]=r-g,g=m+j,f=j+p,k=p+
l,j=0.382683433*(g-k),m=0.5411961*g+j,g=1.306562965*k+j,f*=0.707106781,j=l+f,l-=f,c[e+40]=l+m,c[e+24]=l-m,c[e+8]=j+g,c[e+56]=j-g,e++;for(n=0;64>n;++n)e=c[n]*o[n],K[n]=0<e?e+0.5|0:e-0.5|0;c=K;for(o=0;64>o;++o)t[x[o]]=c[o];c=t[0]-a;a=t[0];0==c?u(b[0]):(n=32767+c,u(b[A[n]]),u(s[n]));for(b=63;0<b&&0==t[b];b--);if(0==b)return u(h),a;for(c=1;c<=b;){for(o=c;0==t[c]&&c<=b;++c);o=c-o;if(16<=o){n=o>>4;for(e=1;e<=n;++e)u(i);o&=15}n=32767+t[c];u(d[(o<<4)+A[n]]);u(s[n]);c++}63!=b&&u(h);return a}function L(c){0>=
c&&(c=1);100<c&&(c=100);if(M!=c){for(var a=0,a=50>c?Math.floor(5E3/c):Math.floor(200-2*c),h=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],b=0;64>b;b++){var d=N((h[b]*a+50)/100);1>d?d=1:255<d&&(d=255);E[x[b]]=d}h=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,
99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99];for(b=0;64>b;b++)d=N((h[b]*a+50)/100),1>d?d=1:255<d&&(d=255),F[x[b]]=d;a=[1,1.387039845,1.306562965,1.175875602,1,0.785694958,0.5411961,0.275899379];for(b=h=0;8>b;b++)for(d=0;8>d;d++)O[h]=1/(8*E[x[h]]*a[b]*a[d]),G[h]=1/(8*F[x[h]]*a[b]*a[d]),h++;M=c;console.log("Quality set to: "+c+"%")}}var N=Math.floor,E=Array(64),F=Array(64),O=Array(64),G=Array(64),P,H,Q,I,s=Array(65535),A=Array(65535),K=Array(64),t=Array(64),z=[],w=0,v=7,R=Array(64),
S=Array(64),T=Array(64),J=Array(256),h=Array(2048),M,x=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],U=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],V=[0,1,2,3,4,5,6,7,8,9,10,11],W=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],X=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,
53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],Y=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],Z=[0,1,2,3,4,5,6,7,8,9,10,11],$=[0,0,2,1,
2,4,4,3,4,7,5,4,4,0,1,2,119],aa=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,
211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];this.encode=function(c,o){var C=(new Date).getTime();o&&L(o);z=[];w=0;v=7;i(65496);i(65504);i(16);a(74);a(70);a(73);a(70);a(0);a(1);a(1);a(0);i(1);i(1);a(0);a(0);i(65499);i(132);a(0);for(var b=0;64>b;b++)a(E[b]);a(1);for(b=0;64>b;b++)a(F[b]);var b=c.width,d=c.height;i(65472);i(17);a(8);i(d);i(b);a(3);a(1);a(17);a(0);a(2);a(17);a(1);a(3);a(17);a(1);i(65476);i(418);a(0);for(b=0;16>b;b++)a(U[b+1]);
for(b=0;11>=b;b++)a(V[b]);a(16);for(b=0;16>b;b++)a(W[b+1]);for(b=0;161>=b;b++)a(X[b]);a(1);for(b=0;16>b;b++)a(Y[b+1]);for(b=0;11>=b;b++)a(Z[b]);a(17);for(b=0;16>b;b++)a($[b+1]);for(b=0;161>=b;b++)a(aa[b]);i(65498);i(12);a(3);a(1);a(0);a(2);a(17);a(3);a(17);a(0);a(63);a(0);var s=d=b=0;w=0;v=7;this.encode.displayName="_encode_";for(var t=c.data,n=c.height,l=4*c.width,p,j=0,m,g,f,q,k;j<n;){for(p=0;p<l;){q=l*j+p;for(k=0;64>k;k++)g=k>>3,m=4*(k&7),f=q+g*l+m,j+g>=n&&(f-=l*(j+1+g-n)),p+m>=l&&(f-=p+m-l+4),
m=t[f++],g=t[f++],f=t[f++],R[k]=(h[m]+h[g+256>>0]+h[f+512>>0]>>16)-128,S[k]=(h[m+768>>0]+h[g+1024>>0]+h[f+1280>>0]>>16)-128,T[k]=(h[m+1280>>0]+h[g+1536>>0]+h[f+1792>>0]>>16)-128;b=D(R,O,b,P,Q);d=D(S,G,d,H,I);s=D(T,G,s,H,I);p+=32}j+=8}0<=v&&(b=[],b[1]=v+1,b[0]=(1<<v+1)-1,u(b));i(65497);b="data:image/jpeg;base64,"+btoa(z.join(""));z=[];C=(new Date).getTime()-C;console.log("Encoding time: "+C+"ms");return b};(function(){var c=(new Date).getTime();B||(B=50);for(var a=String.fromCharCode,i=0;256>i;i++)J[i]=
a(i);P=y(U,V);H=y(Y,Z);Q=y(W,X);I=y($,aa);for(var a=1,i=2,b=1;15>=b;b++){for(var d=a;d<i;d++)A[32767+d]=b,s[32767+d]=[],s[32767+d][1]=b,s[32767+d][0]=d;for(d=-(i-1);d<=-a;d++)A[32767+d]=b,s[32767+d]=[],s[32767+d][1]=b,s[32767+d][0]=i-1+d;a<<=1;i<<=1}for(a=0;256>a;a++)h[a]=19595*a,h[a+256>>0]=38470*a,h[a+512>>0]=7471*a+32768,h[a+768>>0]=-11059*a,h[a+1024>>0]=-21709*a,h[a+1280>>0]=32768*a+8421375,h[a+1536>>0]=-27439*a,h[a+1792>>0]=-5329*a;L(B);c=(new Date).getTime()-c;console.log("Initialization "+
c+"ms")})()};
