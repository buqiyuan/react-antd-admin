import{g as e,s as a,r as s,j as r,c as i,P as l,Q as n,U as t,V as o,W as c,B as m}from"./vendor.0941f634.js";import{g as d,a as p}from"./index.3ed70d1a.js";const g={username:"rootadmin",password:"123456",captchaId:"",verifyCode:""},h=()=>{const h=e(),f=a(),[u,x]=s.exports.useState({id:"",img:""}),v=async e=>{null==e||e.preventDefault();const a=await d();x(a)};s.exports.useEffect((()=>{v()}),[]);return r("div",{className:"login-page",children:i(l,{onFinish:async e=>{var a;e.captchaId=u.id;const s=await p.login(e);if(Object.is(s,!1))return v();const r=new URLSearchParams(f.search),i=(null==(a=f.state)?void 0:a.from)||r.get("from")||{pathname:"/dashboard"};h(i,{replace:!0})},className:"login-page-form",initialValues:g,children:[r("h2",{children:"REACT ANTD ADMIN"}),r(l.Item,{name:"username",rules:[{required:!0,message:"请输入用户名！"}],children:r(n,{placeholder:"用户名",prefix:r(t,{}),size:"large"})}),r(l.Item,{name:"password",rules:[{required:!0,message:"请输入密码！"}],children:r(n.Password,{placeholder:"密码",prefix:r(o,{}),size:"large"})}),r(l.Item,{name:"verifyCode",rules:[{required:!0,message:"请输入密码！"}],children:r(n,{placeholder:"验证码",prefix:r(c,{}),size:"large",maxLength:4,suffix:r("img",{src:u.img,onClick:v,className:"login-page-form_capatcha",alt:"验证码"})})}),r(l.Item,{children:r(m,{htmlType:"submit",type:"primary",className:"login-page-form_button",children:"登录"})})]})})};export{h as default};
