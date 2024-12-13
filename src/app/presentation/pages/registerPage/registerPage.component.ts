import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './registerPage.component.html',
  standalone: true,
  imports:[
    ReactiveFormsModule
  ]
})
export default class RegisterPageComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator]],
      email: ['', [Validators.required, this.emailDomainValidator]],
      password: ['', [Validators.required]],
    });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  limitToTenDigits(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phone = control.value || '';
    const valid = /^\d{10}$/.test(phone);
    return valid ? null : { phoneNumberInvalid: true };
  }

  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value || '';
    const valid = /@(ipn\.mx|alumno\.ipn\.mx)$/.test(email);
    return valid ? null : { emailDomain: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formValues = this.registerForm.value;

      // Lógica para enviar los datos al servidor
    }
  }
}
