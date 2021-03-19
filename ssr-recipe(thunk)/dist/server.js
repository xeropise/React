!function(e){var r={};function t(n){if(r[n])return r[n].exports;var c=r[n]={i:n,l:!1,exports:{}};return e[n].call(c.exports,c,c.exports,t),c.l=!0,c.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var c in e)t.d(n,c,function(r){return e[r]}.bind(null,c));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="/",t(t.s=15)}([function(e,r){e.exports=require("react/jsx-runtime")},function(e,r){e.exports=require("react")},function(e,r){e.exports=require("react-router-dom")},function(e,r,t){e.exports=t(14)},function(e,r){e.exports=require("react-redux")},function(e,r){e.exports=require("redux")},function(e,r){e.exports=require("redux-saga/effects")},function(e,r){e.exports=require("react-dom/server")},function(e,r){e.exports=require("express")},function(e,r){e.exports=require("axios")},function(e,r){e.exports=require("path")},function(e,r){e.exports=require("@babel/runtime/helpers/esm/defineProperty")},function(e,r){e.exports=require("fs")},function(e,r){e.exports=require("redux-thunk")},function(e,r){e.exports=require("regenerator-runtime")},function(e,r,t){"use strict";t.r(r);var n=t(3),c=t.n(n);function o(e,r,t,n,c,o,u){try{var i=e[o](u),s=i.value}catch(e){return void t(e)}i.done?r(s):Promise.resolve(s).then(n,c)}function u(e){return function(){var r=this,t=arguments;return new Promise((function(n,c){var u=e.apply(r,t);function i(e){o(u,n,c,i,s,"next",e)}function s(e){o(u,n,c,i,s,"throw",e)}i(void 0)}))}}var i=t(1),s=t(7),a=t.n(s),l=t(8),d=t.n(l),f=t(2),p=t(0),j=function(){return Object(p.jsxs)("ul",{children:[Object(p.jsx)("li",{children:Object(p.jsx)(f.Link,{to:"/red",children:"Red"})}),Object(p.jsx)("li",{children:Object(p.jsx)(f.Link,{to:"/blue",children:"Blue"})}),Object(p.jsx)("li",{children:Object(p.jsx)(f.Link,{to:"/users",children:"Users"})})]})},b=function(){return Object(p.jsx)("div",{className:"Red",children:"Red"})},O=function(){return Object(p.jsx)(b,{})},x=function(){return Object(p.jsx)("div",{className:"Blue",children:"Blue"})},h=function(){return Object(p.jsx)(x,{})},v=t(4),m=function(e){var r=e.users;return r?Object(p.jsx)("div",{children:Object(p.jsx)("ul",{children:r.map((function(e){return Object(p.jsx)("li",{children:Object(p.jsx)(f.Link,{to:"/users/".concat(e.id),children:e.username})},e.id)}))})}):null},y=Object(i.createContext)(null),g=y,S=function(e){var r=Object(i.useContext)(y);return r?r.done?null:void r.promises.push(Promise.resolve(e())):null},E=t(11),P=t.n(E);function _(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function R(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?_(Object(t),!0).forEach((function(r){P()(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):_(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}t(9),t(6);var w="users/GET_USER",k=function(e){return{type:w,payload:e}};var q={users:null,loading:{users:!1,user:!1},error:{users:null,user:null}};var T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:q,r=arguments.length>1?arguments[1]:void 0;switch(r.type){case"users/GET_USERS_PENDING":return R(R({},e),{},{loading:R(R({},e.loading),{},{users:!0}),error:R(R({},e.error),{},{users:null})});case"users/GET_USERS_SUCCESS":return R(R({},e),{},{loading:R(R({},e.loading),{},{users:!1}),users:r.payload.data});case"users/GET_USERS_FAILURE":return R(R({},e),{},{loading:R(R({},e.loading),{},{users:!1}),error:R(R({},e.error),{},{users:r.payload})});case w:return R(R({},e),{},{loading:R(R({},e.loading),{},{user:!0}),error:R(R({},e.error),{},{user:null})});case"users/GET_USER_SUCCESS":return R(R({},e),{},{loading:R(R({},e.loading),{},{user:!1}),user:r.payload});case"users/GET_USER_FAILURE":return R(R({},e),{},{loading:R(R({},e.loading),{},{user:!1}),error:R(R({},e.error),{},{user:r.payload})});default:return e}},U=function(e){var r=e.id,t=Object(v.useSelector)((function(e){return e.users.user})),n=Object(v.useDispatch)();return S((function(){return n(k(r))})),Object(i.useEffect)((function(){t&&t.id===parseInt(r,10)||n(k(r))}),[n,r,t]),t?Object(p.jsx)(m,{user:t}):null},D=function(e){var r=e.id,t=Object(v.useSelector)((function(e){return e.users.user})),n=Object(v.useDispatch)();return S((function(){return n(k(r))})),Object(i.useEffect)((function(){t&&t.id===parseInt(r,10)||n(k(r))}),[n,r,t]),t?Object(p.jsx)(m,{user:t}):null},C=function(){return Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(U,{}),";",Object(p.jsx)(f.Route,{path:"/users/:id",render:function(e){var r=e.match;return Object(p.jsx)(D,{id:r.params.id})}})]})},G=function(){return Object(p.jsxs)("div",{children:[Object(p.jsx)(j,{}),Object(p.jsx)("hr",{}),Object(p.jsx)(f.Route,{path:"/red",component:O}),Object(p.jsx)(f.Route,{path:"/blue",component:h}),Object(p.jsx)(f.Route,{path:"/users",component:C})]})},L=t(10),M=t.n(L),N=t(12),A=t.n(N),I=t(5),F=t(13),B=t.n(F),J=Object(I.combineReducers)({users:T}),Y=JSON.parse(A.a.readFileSync(M.a.resolve("./build/asset-manifest.json"),"utf8")),$=Object.keys(Y.files).filter((function(e){return/chunk\.js$/.exec(e)})).map((function(e){return'<script src="'.concat(Y.files[e],'"><\/script>')})).join("");function z(e,r){return'<!DOCTYPE html>\n    <html lang="en">\n    <head>\n      <meta charset="utf-8" />\n      <link rel="shortcut icon" href="/favicon.ico" />\n      <meta\n        name="viewport"\n        content="width=device-width,initial-scale=1,shrink-to-fit=no"\n      />\n      <meta name="theme-color" content="#000000" />\n      <title>React App</title>\n      <link href="'.concat(Y.files["main.css"],'" rel="stylesheet" />\n    </head>\n    <body>\n      <noscript>You need to enable JavaScript to run this app.</noscript>\n      <div id="root">\n        ').concat(e,"\n      </div>\n      ").concat(r,'\n      <script src="').concat(Y.files["runtime-main.js"],'"><\/script>\n      ').concat($,'\n      <script src="').concat(Y.files["main.js"],'"><\/script>\n    </body>\n    </html>\n      ')}var H=d()(),K=function(){var e=u(c.a.mark((function e(r,t,n){var o,u,i,s,l,d,j;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o={},u=Object(I.createStore)(J,Object(I.applyMiddleware)(B.a)),i={done:!1,promises:[]},s=Object(p.jsx)(g.Provider,{value:i,children:Object(p.jsx)(v.Provider,{store:u,children:Object(p.jsx)(f.StaticRouter,{location:r.url,context:o,children:Object(p.jsx)(G,{})})})}),a.a.renderToStaticMarkup(s),e.prev=5,e.next=8,Promise.all(i.promises);case 8:e.next=13;break;case 10:return e.prev=10,e.t0=e.catch(5),e.abrupt("return",t.staus(500));case 13:i.done=!0,l=a.a.renderToString(s),d=JSON.stringify(u.getState()).replace(/</g,"\\u003c"),j="<script>__PRELOADED_STATE__ = ".concat(d,"<\/script>"),t.send(z(l,j));case 18:case"end":return e.stop()}}),e,null,[[5,10]])})));return function(r,t,n){return e.apply(this,arguments)}}(),Q=d.a.static(M.a.resolve("./build"),{index:!1});H.use(Q),H.use(K),H.listen(5e3,(function(){console.log("Running on http://localhost:5000")}))}]);