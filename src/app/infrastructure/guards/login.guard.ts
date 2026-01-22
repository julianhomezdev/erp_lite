import { inject } from "@angular/core";
import { CanActivate, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

export const loginGuard : CanActivateFn = () => {
    
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (authService.isAuthenticated()) {
        
        router.navigateByUrl('/', { replaceUrl : true });
        
        return false;
        
    }
    
    
    return true;
    
}