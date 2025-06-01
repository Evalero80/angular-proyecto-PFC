import { Routes } from '@angular/router';
import { MainComponent } from './inicio/main/main.component';
import { LoginComponent } from './login/login.component';
import { CrearComponent } from './cliente/crear/crear.component';
import { CrearproductoComponent } from './producto/crearproducto/crearproducto.component';
import { EnTiendaComponent } from './producto/en-tienda/en-tienda.component';
import { Almacen1Component } from './producto/almacen1/almacen1.component';
import { Almacen2Component } from './producto/almacen2/almacen2.component';
import { Almacen3Component } from './producto/almacen3/almacen3.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },     // Redirige a login por defecto
  { path: 'login', component: LoginComponent },             // Login
  { path: 'inicio', component: MainComponent },             // Página principal (Main)

  { path: 'proveedor', component: ProveedoresComponent },
  { path: 'CrearCliente', component: CrearComponent },
  { path: 'CrearProducto', component: CrearproductoComponent },
  { path: 'EnTienda', component: EnTiendaComponent },
  { path: 'alm1', component: Almacen1Component },
  { path: 'alm2', component: Almacen2Component },
  { path: 'alm3', component: Almacen3Component },
  { path: 'calendario', component: CalendarComponent },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }    // Rutas no encontradas → login
];
export const appRoutes = routes;