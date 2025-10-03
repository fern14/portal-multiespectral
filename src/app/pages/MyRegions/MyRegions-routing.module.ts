import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyRegionsComponent } from './MyRegions.component';

const routes: Routes = [
    {
        path: '',
        component: MyRegionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MyRegionsRoutingModule { }