import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { ActivatedRoute } from "@angular/router";
import { User } from "../../../../interfaces/user.interface";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-file',
  templateUrl: './user-file.component.html',
  styleUrls: ['./user-file.component.css']
})
export class UserFileComponent implements OnInit, OnDestroy {
  imgPath = 'assets/avatar.png';

  userId!: number;
  userData: User | null = null;
  formaciones: any[] = [];
  formacionesPendientes: any[] = [];
  formacionesFinalizadas: any[] = [];

  activeTab: string = 'general';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UsuarioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.loadUser();
      }
    });
  }

  loadUser() {
    this.userService.getUserById(this.userId).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response: User) => {
        if (response) {
          this.userData = response;
          console.log('User data loaded:', response);
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
