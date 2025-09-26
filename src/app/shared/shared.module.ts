import { NgModule } from '@angular/core';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-rounting.module';
import { CommonLayoutComponent } from './common-layout/common-layout.component';
import { HeaderComponent } from '../components/header/header.component';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
    declarations: [FullLayoutComponent, CommonLayoutComponent, HeaderComponent],
    imports: [
        CommonModule,
        AppRoutingModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule,
        CalendarModule,
        InputTextModule,
        MenuModule,
        OverlayPanelModule
    ]
})
export class SharedModule { }