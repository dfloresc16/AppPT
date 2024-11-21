import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CategoryData } from '../../../interfaces/categoryData';
import { CVFieldDTO } from '../../../interfaces/CVFieldDTO';
import { CurriculumVitaeDTO } from '../../../interfaces/CurriculumVitaeDTO';

@Component({
  selector: 'app-information-cvpage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './informationCVPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // Optamos por OnPush para optimización
})
export default class InformationCVPageComponent {
  categories: string[] = [];
  fields: string[] = [];
  levels: string[] = [];

  selectedCategory = '';
  selectedField = '';
  selectedLevel = '';

  availableOptions: CategoryData = {};

  // Objeto CurriculumVitaeDTO para almacenar las entradas
  curriculumVitae: CurriculumVitaeDTO = {
    cvFieldsDTOs: [] // Inicializa correctamente como un array vacío
  };

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
            this.curriculumVitae = response.body;
            this.curriculumVitae.cvFieldsDTOs = [...response.body.cvFieldsDTOs];
            console.log('Datos del CV cargados:', this.curriculumVitae.cvFieldsDTOs);
            this.cdr.markForCheck(); // Forzar detección de cambios si usamos OnPush
          } else {
            console.warn('cvFieldsDTOs no es un array válido o está vacío.');
          }
        },
        (error) => {
          console.error('Error al cargar datos del CV:', error);
        }
      );
    } else {
      console.warn('No se encontró userId en sessionStorage.');
    }
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

  addEntry(): void {
    if (this.selectedCategory && this.selectedField && this.selectedLevel) {
      const newEntry: CVFieldDTO = {
        category: this.selectedCategory,
        field: this.selectedField,
        level: this.selectedLevel,
      };
      this.curriculumVitae.cvFieldsDTOs.push(newEntry);

      // Forzar detección de cambios si usamos ChangeDetectionStrategy.OnPush
      this.cdr.markForCheck();

      // Limpiar los combobox
      this.selectedCategory = '';
      this.selectedField = '';
      this.selectedLevel = '';
      this.fields = [];
      this.levels = [];
    }
  }

  createOrUpdate(): void {
    console.log('Llamando a crearCV con:', this.curriculumVitae);
    const userId: number = Number(sessionStorage.getItem('userId'));
    if (userId) {
      this.dataService.crearCV(this.curriculumVitae, userId).subscribe(
        (response) => {
          console.log('Respuesta recibida en el componente:', response);
        },
        (error) => {
          console.error('Error en el componente:', error);
        }
      );
    } else {
      console.warn('No se encontró userId en sessionStorage.');
    }
  }
}
