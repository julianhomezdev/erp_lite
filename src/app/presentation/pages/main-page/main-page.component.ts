import { CommonModule } from "@angular/common";

import { Component, OnDestroy, OnInit, NgZone } from "@angular/core";

import { interval, Subscription } from 'rxjs';

@Component({
    
    selector: 'main-page',
    
    imports: [CommonModule],
    
    standalone: true,
    
    templateUrl: './main-page.component.html',
    
    styleUrl: './main-page.component.css'
    
})

export class MainPage implements OnInit {
    
    
    userName: string = '';
    
    
    ngOnInit(): void {
        
        this.loadUserName();
        
    }
    
    loadUserName(): void {
        
        if (typeof window === 'undefined') {
            
            return;
            
        }
        
        const authUserRaw = localStorage.getItem('auth_user');
        
        if ( !authUserRaw ) {
            
            console.warn('No auth user in localstorage');
            
            return;
        }
        
        
        try {
            
            const authUser = JSON.parse(authUserRaw);
            
            this.userName = authUser.userName ?? '';
            
        } catch (error) {
            
            console.error('Error parsing auth user', error);
            
        }
        
    }
  
}