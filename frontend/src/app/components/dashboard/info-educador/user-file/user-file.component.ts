declare const bootstrap: any;

import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { ActivatedRoute } from "@angular/router";
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormacionesService } from 'src/app/services/formaciones.service';

@Component({
  selector: 'app-user-file',
  templateUrl: './user-file.component.html',
  styleUrls: ['./user-file.component.css']
})
export class UserFileComponent implements OnInit {
  imgPath = 'assets/avatar.png';

  selectedUser: any;
  userId!: number;
  userData: any | null = null;
  
// VARIABLES FORMACIONES ------------------------------------------
  formationData: any[] = [];

  activeTab: string = 'general';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UsuarioService,
    private formationService: FormacionesService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.loadUser();
      }
    });

    this.loadUserFormations();
  }

// CARGAD DE DATOS --------------------------------------------
  loadUser() {
    this.userService.getUserById(this.userId).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        if (response) {
          this.userData = response;
        } else {
          console.error('No user data received');
        }
      },
      error: (error) => {
        console.error('Error al obtener al usuario', error);
        this.userData = null;
      }
    });
  }

  loadUserFormations() {
    this.formationService.getFormationsByUserId(this.userId).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        if(response) {
          this.formationData = response;
        } else {
          console.error('No formation data received');
        }
      },
      error: (error) => {
        console.error('Error al obtener las formaciones del usuario', error);
      }
    });
  }

  changeStatus() {
    const newStatus = this.userData.estado_user === 1 ? 'deshabilitar' : 'habilitar';
    if (confirm(`¿Estás seguro de que deseas ${newStatus} este usuario?`)) {
      this.userService.changeStatus(this.userId).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(`Usuario ${newStatus}do correctamente`);
            this.loadUser(); // Recargar los datos del usuario
          } else {
            this.toastr.error(response.error || 'Error al cambiar el estado del usuario');
          }
        },
        error: (error) => {
          console.error('Error al cambiar el estado del usuario:', error);
          this.toastr.error('Error al cambiar el estado del usuario');
        }
      });
    }
  }

  openEditModal() {
    this.selectedUser = this.userData;
    // Espera a que Angular pase los datos, luego abre el modal con JS (Bootstrap)
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('editUserModal')!);
      modal.show();
    }, 100);
  }
}
