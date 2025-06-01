import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TiendatechService,Proveedor} from '../tiendatech.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';





@Component({
  selector: 'app-proveedores',
  imports: [CommonModule,FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit {

  proveedores: any[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;

  proveedorSeleccionado: any = {
    id: 0,
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    categoria: 'componentes',
    condicionesPago: '30dias',
    activo: true,
    cif: ''
  };

  categorias = [
    { value: 'componentes', label: 'Componentes' },
    { value: 'perifericos', label: 'Periféricos' },
    { value: 'software', label: 'Software' }
  ];

  condicionesPago = [
    { value: '30dias', label: '30 días' },
    { value: '60dias', label: '60 días' },
    { value: 'contado', label: 'Contado' }
  ];

constructor(private tiendaService: TiendatechService) {}

    // ✅ Buscar en servidor o frontend
  buscarProveedor(): void {
    if (!this.filtro.trim()) {
      this.cargarProveedores();
      return;
    }

    const term = this.filtro.toLowerCase();
    this.tiendaService.obtenerProveedores().subscribe((res: any) => {
      if (res && res.success && Array.isArray(res.data)) {
        this.proveedores = res.data
          .filter((p: any) =>
            p.nombre.toLowerCase().includes(term) ||
            p.empresa.toLowerCase().includes(term)
          )
          .map((p: any) => ({ ...p, activo: p.activo === 1 }));
      }
    });
  }

ngOnInit(): void {
  this.cargarProveedores();
}

cargarProveedores() {
  this.tiendaService.obtenerProveedores().subscribe((res: any) => {
    if (res && res.success && Array.isArray(res.data)) {
      this.proveedores = res.data.map((p: any) => ({
        ...p,
        activo: p.activo === 1 // ✅ Conversión explícita
      }));
    } else {
      this.proveedores = [];
    }
  }, (err) => {
    console.error('Error al cargar proveedores:', err);
    this.proveedores = [];
  });
}

  nuevoProveedor() {
    this.modoEdicion = false;
    this.proveedorSeleccionado = {
      id: 0,
      nombre: '',
      empresa: '',
      email: '',
      telefono: '',
      categoria: 'componentes',
      condicionesPago: '30dias',
      activo: true,
      cif: ''
    };
    this.mostrarFormulario = true;
  }

  editarProveedor(proveedor: any) {
    this.modoEdicion = true;
    this.proveedorSeleccionado = { ...proveedor };
    this.mostrarFormulario = true;
  }

  eliminarProveedor(id: number) {
    if (confirm('¿Estás seguro?')) {
      this.tiendaService.eliminarProveedor(id).subscribe(() => {
        this.cargarProveedores(); // ✅ Refresca inmediatamente
      });
    }
  }

  guardarProveedor() {
    if (!this.proveedorSeleccionado.nombre || !this.proveedorSeleccionado.empresa) {
      alert('Nombre y Empresa son obligatorios.');
      return;
    }

    if (this.modoEdicion) {
      this.tiendaService.actualizarProveedor(this.proveedorSeleccionado.id, this.proveedorSeleccionado).subscribe(() => {
        this.cargarProveedores(); // ✅ Recarga datos frescos
      });
    } else {
      this.tiendaService.guardarProveedor(this.proveedorSeleccionado).subscribe(() => {
        this.cargarProveedores(); // ✅ Carga datos desde servidor
      });
    }

    this.mostrarFormulario = false;
  }


  cancelar(): void {
    this.mostrarFormulario = false;
  }
}



