import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullLayoutComponent } from './shared/full-layout/full-layout.component';
import { FullLayout_ROUTES } from './shared/full-layout/full-layout.routes';
import { LoginComponent } from './pages/Login/Login.component';
import { CommonLayoutComponent } from './shared/common-layout/common-layout.component';
import { CommonLayout_ROUTES } from './shared/common-layout/common-layout.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: FullLayoutComponent,
        children: FullLayout_ROUTES
    },
    {
        path: '',
        component: CommonLayoutComponent,
        children: CommonLayout_ROUTES
    },
    {
        path: '**',
        component: LoginComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }