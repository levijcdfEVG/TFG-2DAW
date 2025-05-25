import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../interfaces/user.interface";

@Component({
  selector: 'app-user-file',
  templateUrl: './user-file.component.html',
  styleUrls: ['./user-file.component.css']
})
export class UserFileComponent implements OnInit {
  imgPath = 'assets/avatar.png';

  userId!: number;
  userData!: User;
  formaciones: any[] = [];
  formacionesPendientes: any[] = [];
  formacionesFinalizadas: any[] = [];

  activeTab: string = 'general';

  constructor(private userService: UsuarioService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.loadUser();
  }

  loadUser() {
    this.userService.getUserById(this.userId).subscribe(
      (response: any) => {
        // this.imgPath = user.avatar;
        this.userData = response;
      }
    );
  }
}
