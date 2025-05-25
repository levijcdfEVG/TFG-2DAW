import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './components/template/template.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { InfoCentroComponent } from './components/dashboard/info-centro/info-centro.component';
import { InfoFormacionComponent } from './components/dashboard/info-formacion/info-formacion.component';
import { InfoCursoComponent } from './components/dashboard/info-curso/info-curso.component';
import { InfoEducadorComponent } from './components/dashboard/info-educador/info-educador.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UserFileComponent } from './components/usuarios/user-file/user-file.component';
import { UserModalComponent } from './components/usuarios/modal/user-modal/user-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    HeaderComponent,
    InfoCentroComponent,
    InfoFormacionComponent,
    InfoCursoComponent,
    InfoEducadorComponent,
    FooterComponent,
    UsuariosComponent,
    UserFileComponent,
    UserModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
