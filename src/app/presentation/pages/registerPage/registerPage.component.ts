import { UserDTO } from './../../../interfaces/UserDTO';
import { ApiResponse } from './../../../interfaces/ApiResponse';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './registerPage.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export default class RegisterPageComponent {
  registerForm: FormGroup;
  isLoading = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userName: ['', Validators.required],
        phoneNumber: ['', [Validators.required, this.phoneNumberValidator,Validators.minLength(10),Validators.maxLength(10)]], // Validador actualizado
        email: ['', [Validators.required, this.emailDomainValidator]],
        password: ['', [Validators.required, this.passwordStrengthValidator]], // Validación de contraseña actualizada
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true; // Activa el spinner
      const formValues = this.registerForm.value;

      const userData: UserDTO = {
        userId: 0,
        name: formValues.firstName,
        lastName: formValues.lastName,
        userName: formValues.userName,
        phoneNumber: formValues.phoneNumber,
        password: formValues.password,
        email: formValues.email,
        pin: ""
      };

      this.authService.create(userData).subscribe(
        (response: ApiResponse<UserDTO>) => {
          this.isLoading = false; // Desactiva el spinner
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Usuario creado',
              text: `El usuario ${response.body.userName} ha sido creado exitosamente.`,
            }).then(() => {
              this.router.navigate(['/auth/active']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear el usuario',
              text: 'Ocurrió un error inesperado.',
            });
          }
        },
        (error) => {
          this.isLoading = false; // Desactiva el spinner
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el usuario',
            text: 'Ocurrió un error inesperado.',
          });
        }
      );
    }
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phone = control.value || '';
    const valid = /^\d{10}$/.test(phone); // Validar 10 dígitos
    return valid ? null : { phoneNumberInvalid: true };
  }

  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value || '';
    const valid = /@(ipn\.mx|alumno\.ipn\.mx)$/.test(email);
    return valid ? null : { emailDomain: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value || '';
    const hasUpperCase = /[A-Z]/.test(password); // Verifica mayúsculas
    const hasNumber = /[0-9]/.test(password);    // Verifica números
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Verifica caracteres especiales
    const validLength = password.length >= 8;     // Verifica longitud mínima de 8

    const valid = hasUpperCase && hasNumber && hasSpecialChar && validLength;
    return valid ? null : { passwordStrength: true };
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
