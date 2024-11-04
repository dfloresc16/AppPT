import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('access_token'); // Obtén el token del almacenamiento

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }, // Agrega el Bearer token al header
      })
    : req;

  console.log('Solicitud interceptada:', authReq); // Verifica si el token está presente

  return next(authReq); // Continuar con la solicitud
};
