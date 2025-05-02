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

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    HeaderComponent,
    InfoCentroComponent,
    InfoFormacionComponent,
    InfoCursoComponent,
    InfoEducadorComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
