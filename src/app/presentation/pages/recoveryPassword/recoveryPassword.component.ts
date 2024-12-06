import { UserDTO } from './../../../interfaces/UserDTO';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Ajustar la ruta según tu proyecto
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    HttpClientModule],
  templateUrl: './recoveryPassword.component.html',
})
export default class RecoveryPasswordComponent {
  recoveryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar el formulario con validaciones
    this.recoveryForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@(ipn\.mx|alumno\.ipn\.mx)$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
        ],
      ],
    });
  }

  onRecover() {
    if (this.recoveryForm.valid) {
      // Crear un objeto UserDTO a partir de los datos del formulario
      const userData: UserDTO = {
        userId: 0, // Llenar con un valor predeterminado si no es necesario
        name: '',
        lastName: '',
        userName: '',
        phoneNumber: '',
        password: this.recoveryForm.get('password')?.value,
        email: this.recoveryForm.get('email')?.value,
        pin: '', // Llenar con un valor predeterminado si no es necesario
      };

      // Llamar al servicio para recuperar la contraseña
      this.authService.recoveryPassword(userData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Solicitud enviada',
            text: 'Se ha cambiado la contraseña con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['/auth/login']); // Redirigir al login en caso de éxito
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'No se ha podido cambiar la contraseña',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, revisa los campos y corrige los errores.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
  }
}
