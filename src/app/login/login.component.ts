import { Component, OnInit } from '@angular/core';
import { TiendatechService } from '../tiendatech.service';
import { NgFor } from '@angular/common'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 vista = 'login'; // Valores posibles: login, registro
  usuario = { correo: '', contrasena: '' };

  constructor(
    private tiendaService: TiendatechService,
    private router: Router
  ) {}

onSubmit() {
  if (this.vista === 'login') {
    this.tiendaService.login(this.usuario).subscribe(
      (res: any) => {
        if (res?.success && res?.database) {
          localStorage.setItem('logueado', 'true');
          localStorage.setItem('usuario', this.usuario.correo);
          localStorage.setItem('database', res.database);

          window.dispatchEvent(new Event('storage'));
          this.router.navigate(['/inicio']);
        } else {
          alert('Credenciales incorrectas');
        }
      },
      (err) => {
        console.error('Error en login:', err);
        alert('No se pudo conectar con el servidor');
      }
    );
  } else if (this.vista === 'registro') {
    this.tiendaService.registrar(this.usuario).subscribe(
      (res: any) => {
        try {
          const respuesta = typeof res === 'string' ? JSON.parse(res) : res;

          // ✅ Validamos por "success" o "message"
          if (respuesta.success || (respuesta.message && respuesta.message.includes("creada"))) {
            const database = strReplaceDatabaseName(this.usuario.correo);
            localStorage.setItem('database', database);
            this.vista = 'login';

            // ✅ Mensaje de éxito
            alert('✅ Registro completado. Ahora puedes iniciar sesión.');
          } else {
            alert('⚠️ Error al registrarse. Inténtalo nuevamente.');
          }
        } catch (e) {
          console.error('Error al parsear:', res);
          alert('La respuesta del servidor es inválida. Revisa la consola para más detalles.');
        }
      },
      (err) => {
        console.error('Error en registro:', err);
        alert('❌ No se pudo conectar con el servidor');
      }
    );
  }
}

  cambiarVista(nuevaVista: string) {
    this.vista = nuevaVista;
  }
}

// ✅ Función auxiliar en TS para generar el nombre de la base de datos
function strReplaceDatabaseName(correo: string): string {
  return correo.replace(/[@.]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}