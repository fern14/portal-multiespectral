import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-rounting.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
declarations: [AppComponent],
imports: [
  BrowserModule,
  AppRoutingModule,
  HttpClientModule,
  BrowserAnimationsModule,
  SharedModule,
  // PrimeNG Modules
  InputTextModule,
  PasswordModule,
  ButtonModule,
  CheckboxModule,
  CardModule,
  ToastModule
],
providers: [MessageService],
bootstrap: [AppComponent]
})

export class AppModule { }
