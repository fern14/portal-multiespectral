import { NgModule } from '@angular/core';
import { LoginComponent } from './Login.component';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './Login-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        LoginRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        FloatLabelModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        CheckboxModule
    ],
    exports: [LoginComponent]
})
export class LoginModule { }