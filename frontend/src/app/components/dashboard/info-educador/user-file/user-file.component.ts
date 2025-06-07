import {CookieService} from "ngx-cookie-service";

declare const bootstrap: any;

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { ActivatedRoute } from "@angular/router";
import {Subject, takeUntil, timeout} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormacionService } from 'src/app/services/formacion.service';
import { jwtDecode } from "jwt-decode";
import Swal2 from "sweetalert2";
import Swal from "sweetalert2";

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
  finalizedFormations: any[] = [];
  pendingFormations: any[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UsuarioService,
    private formationService: FormacionService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.loadUserImage();
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
          console.log(response);
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
    this.formationService.getFormationByUserId(this.userId).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: any) => {
        console.log(response);
        if(response && response.success) {
          this.formationData = response.data;
          this.finalizedFormations = this.formationData.filter(f => f.estado == 'Finalizada');
          this.pendingFormations = this.formationData.filter(f => f.estado == 'En curso');
        } else {
          console.error('No formation data received or error in response');
          this.formationData = [];
        }
      },
      error: (error) => {
        console.error('Error al obtener las formaciones del usuario', error);
        this.formationData = [];
      }
    });
  }

  changeStatus() {
    const newStatus = this.userData.estado === 1 ? 'deshabilitar' : 'habilitar';
    const newStatusPast = this.userData.estado === 1 ? 'deshabilitado' : 'habilitado';

    Swal.fire({
      title: `¿Estás seguro?`,
      text: `El usuario será ${newStatusPast}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${newStatus}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeStatus(this.userId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (response: any) => {
                if (response.success) {
                  this.toastr.success(`Usuario ${newStatusPast} correctamente`);
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
    });
  }

  openEditModal() {
    this.selectedUser = this.userData;
    // Espera a que Angular pase los datos, luego abre el modal con JS (Bootstrap)
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('editUserModal')!);
      modal.show();
    }, 100);
  }

  toggleEstado(formation: any) {
    const id_formacion = formation.id;
    this.formationService.cambiarEstado(id_formacion, this.userId).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success) {
          console.log(response.message);

          this.loadUserFormations();
        }
      },
      error: (error) => {
        console.error("Error al actualizar la formacion asignada al usuario", error);
      }
    });
  }

  private loadUserImage() {
    const token = this.cookieService.get('token');
    const decodedInfo: any = jwtDecode(token);
    const rawUrl = decodedInfo.picture;
    this.imgPath = `http://15.proyectos.esvirgua.com/backend/src/helpers/proxy_image.php?url=${encodeURIComponent(rawUrl)}`;
  }


}
