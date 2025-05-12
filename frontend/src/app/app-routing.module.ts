import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent} from "./components/usuarios/usuarios.component";
import { UserFileComponent} from "./components/usuarios/user-file/user-file.component";


const routes: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full'},
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'usuarios/:id', component: UserFileComponent},
  // { path: 'formaciones', component: InfoFormacionComponent},
  // { path: 'curso', component: InfoCursoComponent},
  // { path: 'centros', component: InfoCentroComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
