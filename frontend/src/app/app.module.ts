import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './components/template/template.component';
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

/* Centros */
import { InfoCentroComponent } from './components/dashboard/info-centro/info-centro.component';
import { AltaCentroComponent } from './components/shared/modal/alta-centro/alta-centro.component';
import { ModificarCentroComponent } from './components/shared/modal/modificar-centro/modificar-centro.component';

/* Formaciones */
import { InfoFormacionComponent } from './components/dashboard/info-formacion/info-formacion.component';
import { FormacionFormComponent } from './components/shared/modal/formacion/formacion-form/formacion-form.component';
import { CrearFormacionModalComponent } from './components/shared/modal/formacion/crear-formacion-modal/crear-formacion-modal.component';
import { EditarFormacionModalComponent } from './components/shared/modal/formacion/editar-formacion-modal/editar-formacion-modal.component';

/* Cursos */
import { InfoCursoComponent } from './components/dashboard/info-curso/info-curso.component';

/* Educadores */
import { InfoEducadorComponent } from './components/dashboard/info-educador/info-educador.component';
import { UserFileComponent } from './components/dashboard/info-educador/user-file/user-file.component';
import { UserModalComponent } from './components/shared/modal/user-modal/user-modal.component';
import { EditUserComponent } from './components/shared/modal/edit-user/edit-user.component';


/* Componentes */
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleSignInComponent } from './components/google-sign-in/google-sign-in.component';
import { CookieService } from "ngx-cookie-service";
import {NgSelectModule} from "@ng-select/ng-select";

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
    UserFileComponent,
    UserModalComponent,
    FooterComponent,
    AltaCentroComponent,
    ModificarCentroComponent,
    FooterComponent,
    GoogleSignInComponent,
    FormacionFormComponent,
    CrearFormacionModalComponent,
    EditarFormacionModalComponent,
    MenuComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
