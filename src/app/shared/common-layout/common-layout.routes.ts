import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../pages/Dashboard/Dashboard.module').then(m => m.DashboardModule)
    }
]