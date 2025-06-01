import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TiendatechService } from '../../tiendatech.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import {
CdkDragDrop,
moveItemInArray,
transferArrayItem,
} from '@angular/cdk/drag-drop';
import { isPlatformBrowser } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Modelo de datos para los elementos
export interface Item {
nombre: string;
apellidos: string;
telefono: string;
dni: string;
problemasTecnicos: string;
}



@Component({
selector: 'app-crear',
standalone: true,
imports: [FormsModule,DragDropModule,CommonModule],
templateUrl: './crear.component.html',
styleUrl: './crear.component.css'
})
export class CrearComponent {
todo: Item[] = [];
  done: Item[] = [];

  selectedElement: Item | null = null;
  showModal: boolean = false;
  model: any = {};
  isBrowser: boolean;

  constructor(
    private tiendatechService: TiendatechService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const database = localStorage.getItem('database');

      // 👇 Cargar desde localStorage para esta cuenta
      const savedTodo = localStorage.getItem(`todoList_${database}`);
      const savedDone = localStorage.getItem(`doneList_${database}`);

      if (savedTodo && savedDone) {
        this.todo = JSON.parse(savedTodo);
        this.done = JSON.parse(savedDone);
        return;
      }

      // Si no hay datos locales, cargar desde backend
      this.tiendatechService.obtenerClientes().subscribe((res: any) => {
        if (res.status === 'success') {
          this.todo = res.data.map((item: any) => ({
            nombre: item.nombre,
            apellidos: item.apellidos,
            telefono: item.numTelefono,
            dni: item.dni,
            problemasTecnicos: item.problemaTecnico,
          }));
          this.done = [];

          // Guardar por primera vez en localStorage para esta cuenta
          localStorage.setItem(`todoList_${database}`, JSON.stringify(this.todo));
          localStorage.setItem(`doneList_${database}`, JSON.stringify(this.done));
        } else {
          this.todo = [];
          this.done = [];
        }
      });
    }
  }

  /**
   * Maneja el evento de arrastrar y soltar entre listas.
   */
  drop(event: CdkDragDrop<Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const database = localStorage.getItem('database');
    // ✅ Guardar cambios en localStorage, con clave única por cuenta
    localStorage.setItem(`todoList_${database}`, JSON.stringify(this.todo));
    localStorage.setItem(`doneList_${database}`, JSON.stringify(this.done));
  }

  openDetails(item: Item) {
    this.selectedElement = item;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedElement = null;
  }

  onSubmit() {
    const formData = {
      nombreT: this.model.nombre,
      apellidosT: this.model.apellidos,
      telefonoT: this.model.telefono,
      dniT: this.model.dni,
      problemaT: this.model.problemaTecnico,
    };

    this.tiendatechService.guardarCliente(formData).subscribe((res: any) => {
      if (res.status === 'success') {
        alert('Cliente guardado correctamente');
        this.todo.push({
          nombre: formData.nombreT,
          apellidos: formData.apellidosT,
          telefono: formData.telefonoT,
          dni: formData.dniT,
          problemasTecnicos: formData.problemaT,
        });

        const database = localStorage.getItem('database');
        localStorage.setItem(`todoList_${database}`, JSON.stringify(this.todo));
        localStorage.setItem(`doneList_${database}`, JSON.stringify(this.done));
        this.model = {};
      } else {
        alert('Error al guardar cliente');
      }
    });
  }

  eliminarClientePorNombre() {
    if (!this.selectedElement) return;

    const nombre = this.selectedElement.nombre;

    this.tiendatechService.eliminarClientePorNombre(nombre).subscribe(() => {
      this.todo = this.todo.filter(cliente => cliente.nombre !== nombre);
      this.done = this.done.filter(cliente => cliente.nombre !== nombre);

      const database = localStorage.getItem('database');
      localStorage.setItem(`todoList_${database}`, JSON.stringify(this.todo));
      localStorage.setItem(`doneList_${database}`, JSON.stringify(this.done));

      this.closeModal();
    });
  }

  imprimirDatos(cliente?: Item) {
    const data = cliente || this.model;
    if (!data.nombre && !cliente) {
      alert('No hay datos para imprimir.');
      return;
    }

    const printContents = `
    <html>
      <head>
        <title>Ticket - TiendaTech</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            font-family: 'Helvetica Neue', sans-serif;
            background-color: #fff;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .ticket-container {
            width: 100%;
            max-width: 100%;
            height: 98vh;
            background: white;
            border: 2px solid #00b578;
            border-radius: 12px;
            padding: 32px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #00b578;
            margin-bottom: 24px;
          }
          .store-logo {
            font-size: 26px;
            font-weight: bold;
            color: #1e3c72;
            letter-spacing: 1px;
            line-height: 1.2;
            position: relative;
          }
          .store-logo::before {
            content: '';
            position: absolute;
            left: -10px;
            top: -10px;
            bottom: -10px;
            right: -10px;
            border: 2px dashed #00b578;
            border-radius: 8px;
            z-index: -1;
            pointer-events: none;
          }
          .store-subtitle {
            font-size: 14px;
            color: #555;
            margin-top: 6px;
            font-style: italic;
          }
          .content {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            flex: 1;
          }
          .info-block {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .info-label {
            font-weight: 600;
            font-size: 14px;
            color: #1e3c72;
            letter-spacing: 0.5px;
          }
          .info-value {
            padding: 12px 16px;
            background-color: #f9f9f9;
            border-left: 5px solid #0abe73;
            font-size: 13px;
            color: #333;
            border-radius: 6px;
            min-height: 40px;
          }
          .problem-section {
            padding: 12px 16px;
            background-color: #f1f9f5;
            border-left: 5px solid #009966;
            font-size: 13px;
            color: #2d2d2d;
            border-radius: 6px;
            min-height: 80px;
            overflow-y: auto;
          }
          .footer {
            margin-top: 24px;
            padding-top: 20px;
            border-top: 2px dotted #ddd;
            font-size: 12px;
            text-align: center;
            color: #666;
          }

          /* Estilo para impresión */
          @media print {
            body {
              background-color: white !important;
              color: black !important;
              margin: 0;
              padding: 0;
            }
            .ticket-container {
              box-shadow: none;
              height: 100vh;
              width: 100%;
              padding: 24px;
              border: none;
            }
            .header {
              border-bottom: 2px solid #000;
              margin-bottom: 20px;
            }
            .store-logo {
              font-size: 26px;
              font-weight: bold;
              color: #000;
            }
            .store-logo::before {
              display: none;
            }
            .store-subtitle {
              color: #444;
              font-size: 14px;
              margin-top: 6px;
            }
            .info-label {
              color: #000;
              font-weight: bold;
            }
            .info-value,
            .problem-section {
              background-color: white;
              border-left: 5px solid #000;
              color: black;
              padding: 10px;
            }
            .footer {
              border-top: 1px dotted #aaa;
              color: #555;
              font-size: 11px;
              padding-top: 16px;
            }
          }
        </style>
      </head>
      <body onload="window.print()">
        <div class="ticket-container">
          <!-- HEADER CON NOMBRE DE LA TIENDA -->
          <div class="header">
            <div class="store-logo">TiendaTech_</div>
            <div class="store-subtitle">Gestor de tienda • Reparaciones Rápidas • Soporte Oficial</div>
          </div>

          <!-- CONTENIDO DEL TICKET -->
          <div class="content">
            <div class="info-block">
              <span class="info-label">Nombre</span>
              <div class="info-value">${data.nombre}</div>
            </div>
            <div class="info-block">
              <span class="info-label">Apellidos</span>
              <div class="info-value">${data.apellidos || 'No especificado'}</div>
            </div>
            <div class="info-block">
              <span class="info-label">Teléfono</span>
              <div class="info-value">${data.telefono || 'No especificado'}</div>
            </div>
            <div class="info-block">
              <span class="info-label">DNI</span>
              <div class="info-value">${data.dni || 'No especificado'}</div>
            </div>
            <div class="info-block" style="grid-column: span 2;">
              <span class="info-label">Problema técnico</span>
              <div class="problem-section">${data.problemasTecnicos || data.problemaTecnico || 'No se ha especificado ningún problema técnico.'}</div>
            </div>
          </div>

          <!-- FOOTER CON FECHA Y CONTACTO -->
          <div class="footer">
            Fecha: ${new Date().toLocaleString()}<br>
            www.tiendatech.com | contacto@tiendatech.com
          </div>
        </div>
      </body>
    </html>
  </html>
  `;

  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(printContents);
    win.document.close();

    setTimeout(() => {
      win.focus();
      win.print();
      win.close();
    }, 200);
  }
}
}









