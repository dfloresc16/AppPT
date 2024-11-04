import{a as P}from"./chunk-4XNZD2BV.js";import"./chunk-NKPXLLZK.js";import{a as h,b as d,c as F,d as S,f as y,g as D,h as w,l as I,m as N,o as q}from"./chunk-Y5P3WVKB.js";import{Cb as C,Db as _,Ia as c,Ka as l,Pa as i,Qa as e,Ra as u,Ua as x,Za as n,aa as A,fb as E,va as a,wa as f}from"./chunk-OZKSLEUV.js";function k(t,s){t&1&&(i(0,"div",12),n(1," El nombre de usuario es obligatorio. "),e())}function T(t,s){t&1&&(i(0,"div",12),n(1," El correo es obligatorio. "),e())}function B(t,s){t&1&&(i(0,"div",12),n(1," Ingrese un correo v\xE1lido. "),e())}function G(t,s){t&1&&(i(0,"div",12),n(1," El PIN es obligatorio. "),e())}var z=(()=>{class t{constructor(m,o){this.fb=m,this.activationService=o}ngOnInit(){this.activationForm=this.fb.group({username:["",d.required],email:["",[d.required,d.email]],pin:["",d.required]})}onActivate(){if(this.activationForm.valid){let m=this.activationForm.value;console.log("Datos de activaci\xF3n enviados:",m),this.activationService.activarCuenta(m).subscribe(o=>{console.log("Cuenta activada con \xE9xito:",o)},o=>{console.error("Error en la activaci\xF3n:",o)})}}static{this.\u0275fac=function(o){return new(o||t)(f(N),f(P))}}static{this.\u0275cmp=A({type:t,selectors:[["app-active-page"]],standalone:!0,features:[E],decls:23,vars:6,consts:[[1,"flex","items-center","justify-center","min-h-screen","bg-[#111827]"],[1,"bg-[#1F2937]","shadow-md","rounded-lg","p-8","max-w-sm","w-full"],[1,"text-2xl","font-bold","text-center","mb-6","text-[#6A5ACD]"],[1,"space-y-4",3,"ngSubmit","formGroup"],["for","username",1,"block","text-sm","font-medium","text-[#E5E7EB]"],["id","username","type","text","formControlName","username","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["class","text-red-500 text-sm",4,"ngIf"],["for","email",1,"block","text-sm","font-medium","text-[#E5E7EB]"],["id","email","type","email","formControlName","email","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["for","pin",1,"block","text-sm","font-medium","text-[#E5E7EB]"],["id","pin","type","password","formControlName","pin","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["type","submit",1,"w-full","bg-[#6A5ACD]","text-white","py-2","px-4","rounded-md","hover:bg-indigo-700","focus:outline-none","focus:ring-2","focus:ring-[#6A5ACD]","focus:ring-offset-2","disabled:bg-gray-500",3,"disabled"],[1,"text-red-500","text-sm"]],template:function(o,r){if(o&1&&(i(0,"div",0)(1,"div",1)(2,"h2",2),n(3,"Activaci\xF3n de Cuenta"),e(),i(4,"form",3),x("ngSubmit",function(){return r.onActivate()}),i(5,"div")(6,"label",4),n(7,"Nombre de Usuario"),e(),u(8,"input",5),c(9,k,2,0,"div",6),e(),i(10,"div")(11,"label",7),n(12,"Correo Electr\xF3nico"),e(),u(13,"input",8),c(14,T,2,0,"div",6)(15,B,2,0,"div",6),e(),i(16,"div")(17,"label",9),n(18,"PIN"),e(),u(19,"input",10),c(20,G,2,0,"div",6),e(),i(21,"button",11),n(22," Activar Cuenta "),e()()()()),o&2){let p,v,g,b;a(4),l("formGroup",r.activationForm),a(5),l("ngIf",(p=r.activationForm.get("username"))==null?null:p.hasError("required")),a(5),l("ngIf",(v=r.activationForm.get("email"))==null?null:v.hasError("required")),a(),l("ngIf",(g=r.activationForm.get("email"))==null?null:g.hasError("email")),a(5),l("ngIf",(b=r.activationForm.get("pin"))==null?null:b.hasError("required")),a(),l("disabled",r.activationForm.invalid)}},dependencies:[q,y,h,F,S,I,D,w,_,C],encapsulation:2})}}return t})();export{z as default};
