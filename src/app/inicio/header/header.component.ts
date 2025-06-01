import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TiendatechService } from '../../tiendatech.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 mostrarMenu = false;
  nombreUsuario = 'Invitado';
  logueado = false;

  constructor(
    public tiendaService: TiendatechService,
    public router: Router, // ✅ Ahora es público
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.actualizarEstado();

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', () => {
        this.actualizarEstado();
      });
    }
  }

  actualizarEstado() {
    if (isPlatformBrowser(this.platformId)) {
      this.logueado = localStorage.getItem('logueado') === 'true';
      this.nombreUsuario = localStorage.getItem('usuario') || 'Invitado';
    }
  }

  toggleMenu() {
    if (!this.logueado) return;
    this.mostrarMenu = !this.mostrarMenu;
  }

  cerrarSesion() {
    this.tiendaService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}