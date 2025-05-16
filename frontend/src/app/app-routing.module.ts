import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoCentroComponent} from "./components/dashboard/info-centro/info-centro.component";
import {InfoFormacionComponent} from "./components/dashboard/info-formacion/info-formacion.component";
import {GoogleSignInComponent} from "./components/google-sign-in/google-sign-in.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "info-centros",
    component: InfoCentroComponent, canActivate: [AuthGuard]
  },
  {
    path: "info-formaciones",
    component: InfoFormacionComponent, canActivate: [AuthGuard]
  },
  {
    path: "info-cursos",
    component: InfoFormacionComponent, canActivate: [AuthGuard]
  },
  {
    path: "info-educadores",
    component: InfoFormacionComponent, canActivate: [AuthGuard]
  },
  {
    path: "",
    component: InfoCentroComponent, canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: GoogleSignInComponent
  },
  {
    path: '**',
    redirectTo: '/info-centros',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
