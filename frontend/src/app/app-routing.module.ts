import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoCentroComponent} from "./components/dashboard/info-centro/info-centro.component";
import {InfoFormacionComponent} from "./components/dashboard/info-formacion/info-formacion.component";
import {MenuComponent} from "./components/menu/menu.component";
import {GoogleSignInComponent} from "./components/google-sign-in/google-sign-in.component";
import {AuthGuard} from "./guards/auth.guard";
import { UserFileComponent} from "./components/dashboard/info-educador/user-file/user-file.component";
import {InfoEducadorComponent} from "./components/dashboard/info-educador/info-educador.component";
import {
  InscripcionFormacionComponent
} from "./components/dashboard/info-formacion/inscripcion-formacion/inscripcion-formacion.component";

import { NoAutorizadoComponent } from './pages/no-autorizado/no-autorizado.component';
import { ResponsableCentroGuard } from './guards/responsable-centro.guard';
import { RoleGuard } from './guards/role.guard';
import { FormacionesGuard } from './guards/formaciones.guard';


const routes: Routes = [
  { path: "info-centros", component: InfoCentroComponent, canActivate: [RoleGuard] },
  { path: "info-formaciones", component: InfoFormacionComponent, canActivate: [AuthGuard, FormacionesGuard] },
  { path: "info-cursos", component: InfoFormacionComponent, canActivate: [AuthGuard] },
  { path: "info-educadores", component: InfoEducadorComponent, canActivate: [AuthGuard] },
  { path: "info-educadores/:id", component: UserFileComponent, canActivate: [AuthGuard, ResponsableCentroGuard]},
  { path: "login", component: GoogleSignInComponent },
  { path: "menu", component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'inscribir-usuarios/formacion/:id', component: InscripcionFormacionComponent,  canActivate: [AuthGuard] },
  { path: "no-autorizado", component: NoAutorizadoComponent },
  { path: '**', redirectTo: '/menu', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
