import { isPlatformBrowser } from "@angular/common";
import {inject, Injectable, PLATFORM_ID} from "@angular/core";

import {Router, CanActivateChildFn} from "@angular/router";

export const authGuard: CanActivateChildFn = () => {
    
    
    
    const router = inject(Router);
    
    // To verify is it is on browser
    const platFormId = inject(PLATFORM_ID);
    
    
    // If is not a navigator -> there are not localstorage
    if(!isPlatformBrowser(platFormId)) {
        
        return true;
        
    }
    
    const token = localStorage.getItem('auth_token');
    
    
    if(!token) {
        
        router.navigate(['/login']);
        
        return false;
        
    }
    
    
    return true;
    
    
}