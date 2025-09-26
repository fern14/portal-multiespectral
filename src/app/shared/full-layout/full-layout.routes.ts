import { Routes } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: () => import('../../pages/Login/Login.module').then(m => m.LoginModule)
    }
]