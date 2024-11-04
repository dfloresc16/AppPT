import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import LoginPageComponent from '../../pages/loginPage/loginPage.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './authLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent { }
