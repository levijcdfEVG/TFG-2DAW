import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoCentroComponent} from "./components/dashboard/info-centro/info-centro.component";
import {InfoFormacionComponent} from "./components/dashboard/info-formacion/info-formacion.component";
import {MenuComponent} from "./components/menu/menu.component";
import {GoogleSignInComponent} from "./components/google-sign-in/google-sign-in.component";
import {AuthGuard} from "./guards/auth.guard";
import { UserFileComponent} from "./components/dashboard/info-educador/user-file/user-file.component";
import {InfoEducadorComponent} from "./components/dashboard/info-educador/info-educador.component";


const routes: Routes = [
  { path: "info-centros", component: InfoCentroComponent, canActivate: [AuthGuard] },
  { path: "info-formaciones", component: InfoFormacionComponent, canActivate: [AuthGuard] },
  { path: "info-cursos", component: InfoFormacionComponent, canActivate: [AuthGuard] },
  { path: "info-educadores", component: InfoEducadorComponent, canActivate: [AuthGuard] },
  { path: "login", component: GoogleSignInComponent },
  { path: "menu", component: MenuComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'usuarios/:id', component: UserFileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
