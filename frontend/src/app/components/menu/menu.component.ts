import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() rol: 'admin' | 'responsable' | 'educador' = 'educador';

   cambiarRol(nuevoRol: 'admin' | 'responsable' | 'educador') {
    this.rol = nuevoRol;
  }
}
