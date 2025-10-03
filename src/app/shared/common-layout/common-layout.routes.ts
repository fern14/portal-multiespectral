import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

export const CommonLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../pages/Dashboard/Dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'my-regions',
        loadChildren: () => import('../../pages/MyRegions/MyRegions.module').then(m => m.MyRegionsModule),
        canActivate: [AuthGuard]
    }
]