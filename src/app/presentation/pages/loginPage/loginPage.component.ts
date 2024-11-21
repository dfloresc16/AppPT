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

  // Inyecta los servicios necesarios
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.emailDomainValidator]],
      password: ['', [Validators.required, this.passwordStrengthValidator]]
    });
  }

  ngOnInit(): void {
    console.log('LoginPageComponent loaded'); // Confirmación en consola
  }

  // Lógica del envío del formulario
  // login.component.ts
  onSubmit(): void {
    if (this.loginForm.valid) {
      const userLogin: UserLoginDTO = this.loginForm.value;
      this.authService.login(userLogin).subscribe({
        next: (response) => {
          if (response.success && response.body?.token) {
            console.log(userLogin.id)
            this.handleLoginSuccess(response.body.token, userLogin);
          } else {
            this.showErrorAlert('Error', response.errorMessage || 'Error desconocido');
          }
        },
        error: (error) => {
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
    console.log(`userLogin.email :: ${userLogin.email}`);

    this.authService.getUserByEmail(userLogin.email).subscribe({
      next: (response) => {
        if (response && response.body) {
          const user: UserRespLoginDTO = response.body;

          // Guardar cada propiedad individualmente en Session Storage
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


  // Redirección a la página de registro
  redirectToSignUp(): void {
    console.log('Redirigiendo a Crear Cuenta...');
    this.router.navigate(['/auth/register']); // Cambia la ruta según sea necesario
  }

  // Validador personalizado para el dominio del correo
  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const valid = /@(?:ipn\.mx|alumno\.ipn\.mx)$/.test(email);
    return valid ? null : { emailDomain: true };
  }

  // Validador personalizado para la fortaleza de la contraseña
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const validLength = password?.length > 8;

    const valid = hasUpperCase && hasNumber && hasSpecialChar && validLength;
    return valid ? null : { passwordStrength: true };
  }

  // Mostrar alerta de éxito
  showSuccessAlert(title: string, text: string): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar'
    });
  }

  // Mostrar alerta de error
  showErrorAlert(title: string, text: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar'
    });
  }
}
