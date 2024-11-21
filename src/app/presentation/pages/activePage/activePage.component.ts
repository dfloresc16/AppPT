import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Activacion } from '../../../interfaces/Activation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-page',
  templateUrl: './activePage.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export default class ActivePageComponent implements OnInit {
  activationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activationService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicialización del formulario con validaciones
    this.activationForm = this.fb.group({
      pin: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^\d+$/)  // Solo números
        ]
      ]
    });
  }

  // Método para manejar el envío del formulario de activación
  onActivate(): void {
    if (this.activationForm.valid) {
      const datosActivacion: Activacion = this.activationForm.value;
      console.log('Datos de activación enviados:', datosActivacion);

      // Mostrar SweetAlert2 con spinner de carga
      Swal.fire({
        title: 'Activando cuenta...',
        text: 'Por favor, espera un momento.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.activationService.activarCuenta(datosActivacion).subscribe(
        response => {
          Swal.close();  // Cerrar el spinner de carga
          Swal.fire({
            icon: 'success',
            title: '¡Cuenta activada!',
            text: 'Tu cuenta ha sido activada exitosamente.',
            confirmButtonColor: '#6A5ACD'
          }).then(() => {
            // Redirige a la ruta /auth/login en caso de éxito
            this.router.navigate(['/auth/login']);
          });
        },
        error => {
          Swal.close();  // Cerrar el spinner de carga
          Swal.fire({
            icon: 'error',
            title: 'Error en la activación',
            text: 'Hubo un problema al activar tu cuenta. Por favor, intenta nuevamente.',
            confirmButtonColor: '#6A5ACD'
          });
          console.error('Error en la activación:', error);
        }
      );
    }
  }
}
