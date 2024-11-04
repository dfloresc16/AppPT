import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Activacion } from '../../../interfaces/Activation';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-active-page',
  templateUrl: './activePage.component.html',
  standalone: true,
  imports:[
    ReactiveFormsModule,
    CommonModule
  ]
})
export default class ActivePageComponent implements OnInit {
  activationForm!: FormGroup;

  constructor(private fb: FormBuilder, private activationService: AuthService) {}

  ngOnInit(): void {
    // Inicialización del formulario con validaciones
    this.activationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pin: ['', Validators.required]
    });
  }

  // Método para manejar el envío del formulario de activación
  onActivate(): void {
    if (this.activationForm.valid) {
      const datosActivacion: Activacion= this.activationForm.value;
      console.log('Datos de activación enviados:', datosActivacion);

      this.activationService.activarCuenta(datosActivacion).subscribe(
        response => {
          console.log('Cuenta activada con éxito:', response);
        },
        error => {
          console.error('Error en la activación:', error);
        }
      );
    }
  }
}
