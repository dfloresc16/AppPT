import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CategoryData } from '../../../interfaces/categoryData';
import { CVFieldDTO } from '../../../interfaces/CVFieldDTO';
import { CurriculumVitaeDTO } from '../../../interfaces/CurriculumVitaeDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-information-cvpage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './informationCVPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InformationCVPageComponent {
  categories: string[] = [];
  fields: string[] = [];
  levels: string[] = [];

  selectedCategory = '';
  selectedField = '';
  selectedLevel = '';

  availableOptions: CategoryData = {};

  curriculumVitae: CurriculumVitaeDTO = {
    cvFieldsDTOs: [], // Inicializa correctamente como un array vacío
  };

  originalData: string = ''; // Guarda el estado original del CV para validar cambios
  isUpdateMode = false; // Bandera para determinar si se debe actualizar o crear

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCVData(); // Cargar datos del CV existente
    this.loadData();   // Cargar datos para categorías y niveles
  }

  loadData(): void {
    this.dataService.getData().subscribe((data: CategoryData) => {
      this.availableOptions = data;
      this.categories = Object.keys(data);
    });
  }

  loadCVData(): void {
    const userId: number = Number(sessionStorage.getItem('userId'));
    if (userId) {
      this.dataService.getDataCV(userId).subscribe(
        (response) => {
          if (response.body?.cvFieldsDTOs && Array.isArray(response.body.cvFieldsDTOs)) {
            this.curriculumVitae.cvFieldsDTOs = [...response.body.cvFieldsDTOs];
            this.isUpdateMode = true; // Habilitar modo de actualización si se cargaron datos
            this.originalData = JSON.stringify(this.curriculumVitae.cvFieldsDTOs); // Guardar estado original
            console.log('Datos del CV cargados:', this.curriculumVitae.cvFieldsDTOs);
          } else {
            this.isUpdateMode = false; // No hay datos, se habilita modo de creación
            console.warn('cvFieldsDTOs no es un array válido o está vacío.');
          }
          this.cdr.markForCheck(); // Forzar detección de cambios si usamos OnPush
        },
        (error) => {
          if (error.status === 404) {
            console.warn('CV no encontrado.');
            this.isUpdateMode = false; // No se encontró el CV, habilitar modo de creación
            this.curriculumVitae.cvFieldsDTOs = []; // Inicializar como vacío
            this.cdr.markForCheck();
          } else {
            console.error('Error al cargar datos del CV:', error);
          }
        }
      );
    } else {
      console.warn('No se encontró userId en sessionStorage.');
    }
  }

  updateCV(): void {
    const userId: number = Number(sessionStorage.getItem('userId'));
    if (userId) {
      console.log('Llamando a actualizarCV con:', this.curriculumVitae);

      this.dataService.actualizarCV(this.curriculumVitae, userId).subscribe(
        (response) => {
          console.log('CV actualizado exitosamente:', response);
          this.originalData = JSON.stringify(this.curriculumVitae.cvFieldsDTOs); // Actualizar estado original
          this.cdr.markForCheck(); // Actualizar vista
        },
        (error) => {
          console.error('Error al actualizar el CV:', error);
        }
      );
    } else {
      console.warn('No se encontró userId en sessionStorage.');
    }
  }

  createCV(): void {
    const userId: number = Number(sessionStorage.getItem('userId'));

    if (!this.curriculumVitae.cvFieldsDTOs?.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Debe agregar valores antes de crear el CV.',
      });
      return; // Salir del método si no hay datos
    }

    if (userId) {
      console.log('Llamando a crearCV con:', this.curriculumVitae);

      this.dataService.crearCV(this.curriculumVitae, userId).subscribe(
        (response) => {
          console.log('CV creado exitosamente:', response);
          this.originalData = JSON.stringify(this.curriculumVitae.cvFieldsDTOs); // Guardar estado original
          this.isUpdateMode = true; // Cambiar a modo de actualización después de crear
          this.cdr.markForCheck(); // Actualizar vista

          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El CV se ha creado exitosamente.',
          });
        },
        (error) => {
          console.error('Error al crear el CV:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear el CV. Por favor, intente nuevamente.',
          });
        }
      );
    } else {
      console.warn('No se encontró userId en sessionStorage.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el identificador de usuario en la sesión.',
      });
    }
  }

  addEntry(): void {
    if (this.selectedCategory && this.selectedField && this.selectedLevel) {
      const newEntry: CVFieldDTO = {
        category: this.selectedCategory,
        field: this.selectedField,
        level: this.selectedLevel,
      };

      // Validar duplicados
      const exists = this.curriculumVitae.cvFieldsDTOs.some(
        (entry) =>
          entry.category === newEntry.category &&
          entry.field === newEntry.field &&
          entry.level === newEntry.level
      );

      if (!exists) {
        this.curriculumVitae.cvFieldsDTOs = [
          ...this.curriculumVitae.cvFieldsDTOs,
          newEntry,
        ]; // Actualizar el array con una nueva referencia

        console.log('Entrada añadida:', newEntry);
        console.log('cvFieldsDTOs actualizado:', this.curriculumVitae.cvFieldsDTOs);
      } else {
        console.warn('El elemento ya existe en el CV.');
      }

      this.cdr.markForCheck(); // Forzar detección de cambios si usamos OnPush

      // Limpiar los combobox
      this.selectedCategory = '';
      this.selectedField = '';
      this.selectedLevel = '';
      this.fields = [];
      this.levels = [];
    } else {
      console.warn('No se puede añadir entrada sin completar todos los campos.');
    }
  }

  removeEntry(index: number): void {
    this.curriculumVitae.cvFieldsDTOs.splice(index, 1); // Eliminar elemento por índice
    console.log('Elemento eliminado. Nuevo estado:', this.curriculumVitae.cvFieldsDTOs);
    this.cdr.markForCheck(); // Forzar detección de cambios
  }

  hasChanges(): boolean {
    return (
      JSON.stringify(this.curriculumVitae.cvFieldsDTOs) !== this.originalData || !this.curriculumVitae.cvFieldsDTOs ||
      this.curriculumVitae.cvFieldsDTOs.length === 0
    ); // Compara con el estado original
  }

  onCategoryChange(): void {
    this.fields = this.availableOptions[this.selectedCategory]?.map((item) => item.field) || [];
    this.selectedField = '';
    this.selectedLevel = '';
  }

  onFieldChange(): void {
    const fieldData = this.availableOptions[this.selectedCategory]?.find(
      (item) => item.field === this.selectedField
    );
    this.levels = fieldData ? fieldData.levels : [];
  }
}
