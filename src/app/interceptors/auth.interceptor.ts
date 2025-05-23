import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const excludedUrls = ['/api/auth/login'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    console.log('[Interceptor] Request excluida del Authorization:', req.url);
    return next(req.clone({ withCredentials: true }));
  }

  let modifiedReq = req.clone({ withCredentials: true });

  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[Interceptor] Agregando Authorization a:', req.url);
  }

  return next(modifiedReq);
};
