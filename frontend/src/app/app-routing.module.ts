import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoCentroComponent} from "./components/dashboard/info-centro/info-centro.component";
import {InfoFormacionComponent} from "./components/dashboard/info-formacion/info-formacion.component";

const routes: Routes = [
  {
    path: "info-centros",
    component: InfoCentroComponent
  },
  {
    path: "info-formaciones",
    component: InfoFormacionComponent
  },
  {
    path: "info-cursos",
    component: InfoFormacionComponent
  },
  {
    path: "info-educadores",
    component: InfoFormacionComponent
  },
  {
    path: "",
    component: InfoCentroComponent
  },
  {
    path: '**',
    redirectTo: '/info-centros'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
