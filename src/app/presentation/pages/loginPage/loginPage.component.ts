import { UserLoginDTO } from './../../../interfaces/userLoginDTO';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserRespLoginDTO } from '../../../interfaces/UserRespLoginDTO';

@Component({
  selector: 'login-page',
  templateUrl: './loginPage.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export default class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false; // Estado para manejar el spinner

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.emailDomainValidator]],
      password: ['', [Validators.required, this.passwordStrengthValidator]]
    });
  }

  ngOnInit(): void {
    console.log('LoginPageComponent loaded');
    sessionStorage.clear(); // Limpia el sessionStorage al cargar el login
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true; // Muestra el spinner
      const userLogin: UserLoginDTO = this.loginForm.value;

      this.authService.login(userLogin).subscribe({
        next: (response) => {
          this.isLoading = false; // Oculta el spinner
          if (response.success && response.body?.token) {
            this.handleLoginSuccess(response.body.token, userLogin);
          } else {
            this.showErrorAlert('Error', response.errorMessage || 'Error desconocido');
          }
        },
        error: (error) => {
          this.isLoading = false; // Oculta el spinner
          this.showErrorAlert('Error', error.errorMessage || 'Error en el servidor');
        },
      });
    }
  }

  private handleLoginSuccess(token: string, userLogin: UserLoginDTO): void {
    sessionStorage.setItem('access_token', token);
    this.getDataUser(userLogin);
    this.showSuccessAlert('¡Login exitoso!', 'Bienvenido a APP PT');
    this.router.navigateByUrl('/dashboard');
  }

  private getDataUser(userLogin: UserLoginDTO): void {
    this.authService.getUserByEmail(userLogin.email).subscribe({
      next: (response) => {
        if (response && response.body) {
          const user: UserRespLoginDTO = response.body;

          sessionStorage.setItem('userId', user.id.toString());
          sessionStorage.setItem('name', user.name);
          sessionStorage.setItem('lastName', user.lastName);
          sessionStorage.setItem('userName', user.userName);
          sessionStorage.setItem('phoneNumber', user.phoneNumber);
          sessionStorage.setItem('email', user.email);
          sessionStorage.setItem('pin', user.pin);
          sessionStorage.setItem('active', user.active.toString());
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No se encontraron datos del usuario',
            text: 'El usuario no está registrado en el sistema.',
          });
        }
      },
      error: (error) => {
        const errorMessage = error.message || 'Ocurrió un error inesperado al buscar el usuario.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      },
    });
  }

  redirectToSignUp(): void {
    this.router.navigate(['/auth/register']);
  }

  redirecToRecoveryPassword(): void{
    this.router.navigate(['/auth/recovery']);
  }

  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const valid = /@(?:ipn\.mx|alumno\.ipn\.mx)$/.test(email);
    return valid ? null : { emailDomain: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const validLength = password?.length >= 8;

    const valid = hasUpperCase && hasNumber && hasSpecialChar && validLength;
    return valid ? null : { passwordStrength: true };
  }

  showSuccessAlert(title: string, text: string): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar'
    });
  }

  showErrorAlert(title: string, text: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: 'Usuario y/o contraseña incorrectos',
      confirmButtonText: 'Aceptar'
    });
  }
}
