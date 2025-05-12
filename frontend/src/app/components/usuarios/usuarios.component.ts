import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  users: User[] = [];
  filterForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalUsers: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  hasSearched: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router) {
    this.filterForm = this.fb.group({
      nombre: ['', [Validators.maxLength(40)]],
      apellidos: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.email, Validators.maxLength(70)]],
      telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
      rol: [''],
      estado: [null],
      nuevo_educador: [null]
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes for real-time filtering
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        // Reset search state when form changes
        this.hasSearched = false;
      });
  }

  loadUsers(): void {
    if (!this.filterForm.valid) {
      return;
    }

    this.loading = true;
    const filterParams = this.filterForm.value;
    
    // Remove empty values from filter params
    Object.keys(filterParams).forEach(key => {
      if (filterParams[key] === '' || filterParams[key] === null || filterParams[key] === undefined) {
        delete filterParams[key];
      }
    });
    
    // Here you would make the HTTP request to your PHP backend
    // For now, we'll simulate the API call
    fetch(`/api/usuarios?page=${this.currentPage}&limit=${this.itemsPerPage}&${new URLSearchParams(filterParams)}`)
      .then(response => response.json())
      .then(data => {
        this.users = data.users;
        this.totalUsers = data.total;
        this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
        this.loading = false;
        this.hasSearched = true;
      })
      .catch(error => {
        console.error('Error loading users:', error);
        this.loading = false;
        this.hasSearched = true;
        this.users = [];
        this.totalUsers = 0;
        this.totalPages = 0;
      });
  }

  applyFilter(): void {
    if (this.filterForm.valid) {
      this.currentPage = 1;
      this.loadUsers();
    }
  }

  resetFilter(): void {
    this.filterForm.reset({
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      rol: '',
      estado: null,
      nuevo_educador: null
    });
    this.currentPage = 1;
    this.hasSearched = false;
    this.users = [];
    this.totalUsers = 0;
    this.totalPages = 0;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  viewUserDetails(userId: number): void {
    this.router.navigate(['/usuarios', userId]);
  }

  // Helper methods for form validation
  getErrorMessage(controlName: string): string {
    const control = this.filterForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('maxlength')) {
      return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    return '';
  }
}
