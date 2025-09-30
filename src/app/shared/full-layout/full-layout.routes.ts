import { Routes } from '@angular/router';
import { LoginGuard } from '../../guards/login.guard';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: () => import('../../pages/Login/Login.module').then(m => m.LoginModule),
        canActivate: [LoginGuard]
    }
]