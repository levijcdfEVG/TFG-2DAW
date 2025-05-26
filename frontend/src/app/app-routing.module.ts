import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoCentroComponent} from "./components/dashboard/info-centro/info-centro.component";
import {InfoFormacionComponent} from "./components/dashboard/info-formacion/info-formacion.component";
import {MenuComponent} from "./components/menu/menu.component";
import {GoogleSignInComponent} from "./components/google-sign-in/google-sign-in.component";
import {AuthGuard} from "./guards/auth.guard";
import { UsuariosComponent} from "./components/usuarios/usuarios.component";
import { UserFileComponent} from "./components/usuarios/user-file/user-file.component";


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
    component: UsuariosComponent, canActivate: [AuthGuard]
  },
  {
    path: "",
    component: MenuComponent, canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: GoogleSignInComponent
  },
  {
    path: "menu",
    component: MenuComponent, canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/menu',
    pathMatch: 'full'
  },
  { path: '', redirectTo: 'usuarios', pathMatch: 'full'},
  { path: 'usuarios/:id', component: UserFileComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
