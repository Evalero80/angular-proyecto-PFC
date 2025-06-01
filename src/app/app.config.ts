import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';


import { provideAnimations } from '@angular/platform-browser/animations'; // Necesario para animaciones
import { IgxGridModule } from 'igniteui-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Configura las rutas
    provideHttpClient(),
    provideAnimations(), // Asegúrate de incluir las animaciones
  // Importa HttpClientModule
  ],
};