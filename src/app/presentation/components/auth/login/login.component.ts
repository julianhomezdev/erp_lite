import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit() {
    
    this.errorMessage = '';
    
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña';
      return;
    }
    
    this.isLoading = true;
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }
}