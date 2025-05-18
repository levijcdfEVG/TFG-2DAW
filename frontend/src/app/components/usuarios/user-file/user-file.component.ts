import { Component } from '@angular/core';

@Component({
  selector: 'app-user-file',
  templateUrl: './user-file.component.html',
  styleUrls: ['./user-file.component.css']
})
export class UserFileComponent {
  user = {
    nombre_user: 'Ernesto',
    apellido_user: 'Gonzalez',
    correo_user: 'egonzalez.evg.es',
    provincia: 'Badajoz',
    localidad: 'Badajoz'
  };
  userPhotoUrl: string = '';
  activeTab: string = 'formaciones';

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userPhotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getInitials(nombre: string, apellido: string): string {
    return (nombre?.charAt(0) || '') + (apellido?.charAt(0) || '');
  }
}
