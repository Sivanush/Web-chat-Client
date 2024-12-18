import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  
  if (auth.isTokenValid()) {
    return true
  }else{
    router.navigate(['/auth']); 
    return false;
  }
};
