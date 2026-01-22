import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LoginComponent } from "../../components/auth/login/login.component";

@Component({
    
    selector: 'login-page',
    standalone: true,
    imports: [CommonModule, LoginComponent],
    templateUrl: './auth-page.component.html',
    styleUrls: ['./auth-page.component.css']
    
    
})

export class LoginPage {}