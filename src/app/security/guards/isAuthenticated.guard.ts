import type { CanActivateFn } from '@angular/router';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const url = state.url;
  localStorage.setItem('url',url);




  console.log('isAuthenticatedGuard');
  console.log({url});

  return true;
};
