!function(){function e(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}System.register(["./vendor-legacy.eb2932d9.js","./role-legacy.f5d7fd74.js","./index-legacy.c78219f2.js"],(function(t){"use strict";var n,u,s;return{setters:[function(e){n=e.r},function(e){u=e.u},function(e){s=e.r}],execute:function(){var r;t({a:function(e){return s({url:o.update,method:"post",data:e},{successMsg:"更新成功"})},b:function(e){return s({url:o.info,method:"get",params:e})},c:function(e){return s({url:o.add,method:"post",data:e},{successMsg:"创建成功"})},d:function(e){return s({url:o.delete,method:"post",data:e},{successMsg:"删除成功"})},g:function(){return s({url:o.list,method:"get"})},u:function(e,t){void 0===t&&(t=[]);var s=u(e,t,{loading:!0}),r=s[0],o=s[1];return n.exports.useEffect((function(){o()}),[o]),r}});var o={list:"sys/menu/list",add:"sys/menu/add",update:"sys/menu/update",info:"sys/menu/info",delete:"sys/menu/delete"},c=Object.values(o),d=Object.freeze((e(r={__proto__:null},Symbol.toStringTag,"Module"),e(r,"sysMenu",o),e(r,"deptValues",c),e(r,"default",o),r));t("_",d)}}}))}();