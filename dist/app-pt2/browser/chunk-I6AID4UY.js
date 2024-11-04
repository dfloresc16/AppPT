import{a as G}from"./chunk-4XNZD2BV.js";import"./chunk-NKPXLLZK.js";import{a as j}from"./chunk-64S5AWJR.js";import{a as N,b as p,c as D,d as q,f as P,g as R,h as I,l as T,m as M,n as V,o as k}from"./chunk-Y5P3WVKB.js";import{Cb as S,Db as y,Ia as s,Ka as l,Pa as r,Qa as e,Ra as u,Ua as w,Za as i,aa as _,d as L,fb as F,va as a,wa as h}from"./chunk-OZKSLEUV.js";var b=L(j());function U(t,d){t&1&&(r(0,"div",17),i(1," El nombre es obligatorio. "),e())}function B(t,d){t&1&&(r(0,"div",17),i(1," El apellido es obligatorio. "),e())}function O(t,d){t&1&&(r(0,"div",17),i(1," El username es obligatorio. "),e())}function $(t,d){t&1&&(r(0,"div",17),i(1," El n\xFAmero de celular es obligatorio. "),e())}function Z(t,d){t&1&&(r(0,"div",17),i(1," El correo es obligatorio. "),e())}function z(t,d){t&1&&(r(0,"div",17),i(1,' El correo debe tener dominio"@"ipn.mx o "@"alumno.ipn.mx. '),e())}function H(t,d){t&1&&(r(0,"div",17),i(1," La contrase\xF1a es obligatoria. "),e())}function J(t,d){t&1&&(r(0,"div",17),i(1,' La contrase\xF1a debe tener m\xE1s de 8 caracteres, una may\xFAscula, un n\xFAmero y el car\xE1cter especial"@". '),e())}function K(t,d){t&1&&(r(0,"div",17),i(1," Las contrase\xF1as no coinciden. "),e())}var re=(()=>{class t{constructor(m,o){this.fb=m,this.authService=o,this.passwordsMatchValidator=n=>{let c=n.get("password")?.value,g=n.get("confirmPassword")?.value;return c===g?null:{passwordMismatch:!0}},this.registerForm=this.fb.group({firstName:["",p.required],lastName:["",p.required],userName:["",p.required],phoneNumber:["",p.required],email:["",[p.required,this.emailDomainValidator]],password:["",[p.required,this.passwordStrengthValidator]],confirmPassword:["",p.required]},{validators:this.passwordsMatchValidator})}onSubmit(){if(this.registerForm.valid){let m=this.registerForm.value;this.authService.create(m).subscribe(o=>{o.success?b.default.fire({icon:"success",title:"Usuario creado",text:`El usuario ${o.body.userName} ha sido creado exitosamente.`}):b.default.fire({icon:"error",title:"Error al crear el usuario",text:o.message||"Ocurri\xF3 un error inesperado."})},o=>{b.default.fire({icon:"error",title:"Error al crear el usuario",text:o.errorMessage||"Ocurri\xF3 un error inesperado."})})}}emailDomainValidator(m){let o=m.value||"";return/@(ipn\.mx|alumno\.ipn\.mx)$/.test(o)?null:{emailDomain:!0}}passwordStrengthValidator(m){let o=m.value||"",n=/[A-Z]/.test(o),c=/[0-9]/.test(o),g=/[@]/.test(o),f=o.length>8;return n&&c&&g&&f?null:{passwordStrength:!0}}static{this.\u0275fac=function(o){return new(o||t)(h(M),h(G))}}static{this.\u0275cmp=_({type:t,selectors:[["app-register-page"]],standalone:!0,features:[F],decls:52,vars:11,consts:[[1,"flex","items-center","justify-center","min-h-screen","bg-[#111827]"],[1,"bg-[hsl(215,28%,17%)]","shadow-md","rounded-lg","p-8","max-w-lg","w-full"],[1,"text-2xl","font-bold","text-center","mb-6","text-[#6A5ACD]"],[1,"space-y-4",3,"ngSubmit","formGroup"],[1,"grid","grid-cols-2","gap-4"],[1,"block","text-sm","font-medium","text-[#E5E7EB]"],["type","text","formControlName","firstName","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["class","text-red-500 text-sm mt-1",4,"ngIf"],["type","text","formControlName","lastName","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["type","text","formControlName","userName","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["type","tel","formControlName","phoneNumber","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["type","email","formControlName","email","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["type","password","formControlName","password","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["type","password","formControlName","confirmPassword","required","",1,"mt-1","block","w-full","border","border-[#374151]","bg-[#1F2937]","text-white","rounded-md","p-2","focus:ring-[#6A5ACD]","focus:border-[#6A5ACD]"],["type","submit",1,"w-full","bg-[#6A5ACD]","text-white","py-2","px-4","rounded-md","hover:bg-indigo-700","focus:outline-none","focus:ring-2","focus:ring-[#6A5ACD]","focus:ring-offset-2","disabled:bg-gray-500",3,"disabled"],[1,"text-center","text-sm","text-[#9CA3AF]","mt-4"],["href","#",1,"text-[#6A5ACD]","hover:underline"],[1,"text-red-500","text-sm","mt-1"]],template:function(o,n){if(o&1&&(r(0,"div",0)(1,"div",1)(2,"h2",2),i(3,"Crear Cuenta"),e(),r(4,"form",3),w("ngSubmit",function(){return n.onSubmit()}),r(5,"div",4)(6,"div")(7,"label",5),i(8,"Nombre"),e(),u(9,"input",6),s(10,U,2,0,"div",7),e(),r(11,"div")(12,"label",5),i(13,"Apellido"),e(),u(14,"input",8),s(15,B,2,0,"div",7),e()(),r(16,"div",4)(17,"div")(18,"label",5),i(19,"Username"),e(),u(20,"input",9),s(21,O,2,0,"div",7),e(),r(22,"div")(23,"label",5),i(24,"N\xFAmero de Celular"),e(),u(25,"input",10),s(26,$,2,0,"div",7),e()(),r(27,"div")(28,"label",5),i(29,"Correo Electr\xF3nico"),e(),u(30,"input",11),s(31,Z,2,0,"div",7)(32,z,2,0,"div",7),e(),r(33,"div",4)(34,"div")(35,"label",5),i(36,"Contrase\xF1a"),e(),u(37,"input",12),s(38,H,2,0,"div",7)(39,J,2,0,"div",7),e(),r(40,"div")(41,"label",5),i(42,"Repite la Contrase\xF1a"),e(),u(43,"input",13),s(44,K,2,0,"div",7),e()(),r(45,"button",14),i(46," Crear Cuenta "),e(),r(47,"div",15),i(48," Al continuar, aceptas nuestro "),r(49,"a",16),i(50,"Aviso de Privacidad"),e(),i(51,". "),e()()()()),o&2){let c,g,f,v,x,C,E,A;a(4),l("formGroup",n.registerForm),a(6),l("ngIf",(c=n.registerForm.get("firstName"))==null?null:c.hasError("required")),a(5),l("ngIf",(g=n.registerForm.get("lastName"))==null?null:g.hasError("required")),a(6),l("ngIf",(f=n.registerForm.get("userName"))==null?null:f.hasError("required")),a(5),l("ngIf",(v=n.registerForm.get("phoneNumber"))==null?null:v.hasError("required")),a(5),l("ngIf",(x=n.registerForm.get("email"))==null?null:x.hasError("required")),a(),l("ngIf",(C=n.registerForm.get("email"))==null?null:C.hasError("emailDomain")),a(6),l("ngIf",(E=n.registerForm.get("password"))==null?null:E.hasError("required")),a(),l("ngIf",(A=n.registerForm.get("password"))==null?null:A.hasError("passwordStrength")),a(5),l("ngIf",n.registerForm.hasError("passwordMismatch")),a(),l("disabled",n.registerForm.invalid)}},dependencies:[y,S,V,P,N,D,q,T,k,R,I],encapsulation:2})}}return t})();export{re as default};
