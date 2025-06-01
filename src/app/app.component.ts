import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet,RouterLink,RouterLinkActive} from '@angular/router';
import { HeaderComponent } from './inicio/header/header.component';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  template: `
    <h1>Mi Calendario</h1>
    <app-calendar></app-calendar>
  `,
  imports: [CalendarComponent,RouterOutlet,CommonModule,RouterLink,RouterLinkActive,HeaderComponent,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InformaticaTienda';
    showHeader = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // ✅ Oculta el header si es /login
        this.showHeader = !event.url.includes('/login');
      }
    });
  }
}
