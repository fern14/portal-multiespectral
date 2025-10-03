import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyRegionsComponent } from './MyRegions.component';
import { MyRegionsRoutingModule } from './MyRegions-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [MyRegionsComponent],
    imports: [
        CommonModule,
        MyRegionsRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        AccordionModule,
        ButtonModule,
    ],
    exports: [MyRegionsComponent]
})
export class MyRegionsModule { }