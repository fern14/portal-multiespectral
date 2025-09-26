import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from './Dashboard.component';
import { DashboardRoutingModule } from './Dashboard-routing.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    exports: [DashboardComponent]
})
export class DashboardModule { }