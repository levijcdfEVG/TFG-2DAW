import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './components/template/template.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { InfoCentroComponent } from './components/dashboard/info-centro/info-centro.component';
import { InfoFormacionComponent } from './components/dashboard/info-formacion/info-formacion.component';
import { InfoCursoComponent } from './components/dashboard/info-curso/info-curso.component';
import { InfoEducadorComponent } from './components/dashboard/info-educador/info-educador.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { AltaCentroComponent } from './components/shared/modal/alta-centro/alta-centro.component';
import { ModificarCentroComponent } from './components/shared/modal/modificar-centro/modificar-centro.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleSignInComponent } from './components/google-sign-in/google-sign-in.component';
import {CookieService} from "ngx-cookie-service";
import { FormacionFormComponent } from './components/shared/modal/formacion/formacion-form/formacion-form.component';
import { CrearFormacionModalComponent } from './components/shared/modal/formacion/crear-formacion-modal/crear-formacion-modal.component';
import { EditarFormacionModalComponent } from './components/shared/modal/formacion/editar-formacion-modal/editar-formacion-modal.component';

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
    AltaCentroComponent,
    ModificarCentroComponent,
    FooterComponent,
    GoogleSignInComponent,
    FormacionFormComponent,
    CrearFormacionModalComponent,
    EditarFormacionModalComponent
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
    HttpClientModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
