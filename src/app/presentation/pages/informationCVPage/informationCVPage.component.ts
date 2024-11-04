import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CategoryData } from '../../../interfaces/categoryData';
import { Field } from '../../../interfaces/field';
import { EntryDTO } from '../../../interfaces/entryDTO';

@Component({
  selector: 'app-information-cvpage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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
  entries: EntryDTO[] = []; // Almacena las entradas agregadas

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getData().subscribe((data: CategoryData) => {
      this.availableOptions = data;
      this.categories = Object.keys(data);
    });
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
      const newEntry: EntryDTO = {
        category: this.selectedCategory,
        field: this.selectedField,
        level: this.selectedLevel,
      };
      this.entries.push(newEntry);

      // Limpiar los combobox
      this.selectedCategory = '';
      this.selectedField = '';
      this.selectedLevel = '';
      this.fields = [];
      this.levels = [];
    }
  }

  createOrUpdate(): void {
    console.log('Entradas:', this.entries);
    alert('Datos creados/actualizados exitosamente.');
  }
}
