import { UserDTO } from './../../../interfaces/UserDTO';
import { ApiResponse } from './../../../interfaces/ApiResponse';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, this.emailDomainValidator]],
        password: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData: UserDTO = this.registerForm.value;
      this.authService.create(userData).subscribe(
        (response: ApiResponse<UserDTO>) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Usuario creado',
              text: `El usuario ${response.body.userName} ha sido creado exitosamente.`,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear el usuario',
              text: response.message || 'Ocurrió un error inesperado.',
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el usuario',
            text: error.errorMessage || 'Ocurrió un error inesperado.',
          });
        }
      );
    }
  }

  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value || '';
    const valid = /@(ipn\.mx|alumno\.ipn\.mx)$/.test(email);
    return valid ? null : { emailDomain: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value || '';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@]/.test(password);
    const validLength = password.length > 8;

    const valid = hasUpperCase && hasNumber && hasSpecialChar && validLength;
    return valid ? null : { passwordStrength: true };
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
