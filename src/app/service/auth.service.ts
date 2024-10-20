import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router) { }


    getToken(): string | null {
        return localStorage.getItem('token');
    }


    isTokenValid(): boolean {
        const token = this.getToken()
        if (!token) return false

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.exp > Date.now() / 1000
        } catch (error) {
            return false
        }
    }


    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
    }
}