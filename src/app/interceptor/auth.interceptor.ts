import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import * as Decode from 'jwt-decode';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router)
    const token = localStorage.getItem('token')


    const isCloudinaryRequest = req.url.includes('cloudinary.com');
    if (isCloudinaryRequest) {
      return next(req);
    }

    

    if (token) {
        try {
            const decodedToken: Decode.JwtPayload = Decode.jwtDecode<Decode.JwtPayload>(token);
            const currentTime = Math.floor(Date.now() / 1000);


            if (decodedToken && decodedToken.exp && decodedToken.exp < currentTime) {
                console.log('Token expired');
                localStorage.removeItem('token');
                return next(req);
            } else {
                const cloned = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${token}`)
                })
                return next(cloned).pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 401) {
                            localStorage.removeItem('token');
                            router.navigate(['/auth']);
                        }
                        return throwError(() => error)
                    })
                )
            }
        } catch (error) {
            console.error('Token decoding failed', error);
            localStorage.removeItem('token');
            router.navigate(['/auth']);
            return next(req);
        }
    } else {
        return next(req);
    }






};