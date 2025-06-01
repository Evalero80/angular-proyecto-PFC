import { Component, OnInit } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { TiendatechService } from '../../tiendatech.service';
import { CommonModule } from '@angular/common'; // Necesario para ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { MatFormFieldModule } from '@angular/material/form-field'; // Para mat-form-field
import { MatInputModule } from '@angular/material/input'; // Para matInput
import { MatTableModule } from '@angular/material/table';

export interface Producto {
  id: number;
  marca: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  precio: number;
  stock: number;
  seleccionado?: boolean;
  editando?: boolean;
}

// ✅ Nueva interfaz con campos adicionales del proveedor
export interface ProductoConProveedor extends Producto {
  nombreProveedor?: string | null;
  empresa?: string | null;
}
@Component({
  selector: 'app-en-tienda',
  imports: [RouterLink,RouterLinkActive,CommonModule,FormsModule,MatFormFieldModule,MatInputModule,MatTableModule],
  templateUrl: './en-tienda.component.html',
  styleUrl: './en-tienda.component.css'
})
export class EnTiendaComponent implements OnInit{
   productos: ProductoConProveedor[] = [];
  productosFiltrados: any[] = [];
  filtro: string = '';
  todosSeleccionados = false;
  ubicacionSeleccionada: string = 'tienda';
columnas: string[] = ['seleccion', 'id', 'marca', 'nombre', 'categoria', 'subcategoria', 'proveedor', 'precio', 'stock', 'accion'];
  constructor(private tiendaService: TiendatechService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

obtenerProductos(event?: any) {
  let ubicacion = event?.target?.value ? event.target.value : 'tienda';

  this.tiendaService.obtenerProductosPorUbicacion(ubicacion).subscribe({
    next: (response: any) => {
      if (response?.data) {
        this.productos = response.data.map((p: any) => ({
          id: p.id,
          marca: p.marca,
          nombre: p.nombre,
          categoria: p.categoria,
          subcategoria: p.subcategoria,
          precio: parseFloat(p.precio),
          stock: parseInt(p.stock),
          seleccionado: false,
          editando: false,
          nombreProveedor: p.nombreProveedor || 'Sin proveedor',
          empresa: p.empresa || ''
        }));
        this.productosFiltrados = [...this.productos];
      } else {
        this.productos = [];
        this.productosFiltrados = [];
      }
    },
    error: (err: any) => {
      console.error('Error obteniendo productos:', err);
      alert('Error al obtener productos. Verifica conexión.');
    }
  });
}

  filtrarProductos(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre?.toLowerCase().includes(valor) ||
      p.marca?.toLowerCase().includes(valor)
    );
  }

  toggleSeleccionTodos() {
    this.productosFiltrados.forEach(p => p.seleccionado = this.todosSeleccionados);
  }

  getProductosSeleccionados() {
    return this.productosFiltrados.filter(p => p.seleccionado);
  }

  moverProductos(nuevaUbicacion: string) {
    const seleccionados = this.getProductosSeleccionados();

    if (seleccionados.length === 0) {
      alert('Selecciona al menos un producto.');
      return;
    }

    const ids = seleccionados.map(p => p.id);

    this.tiendaService.moverProductos(ids, nuevaUbicacion).subscribe(() => {
      this.productos = this.productos.filter(p => !p.seleccionado);
      this.productosFiltrados = [...this.productos];
      alert(`Productos movidos a ${nuevaUbicacion}`);
    });
  }

  editarProducto(producto: any) {
    producto.editando = true;
  }

  guardarCambios(producto: any) {
    const confirmacion = confirm('¿Guardar cambios?');
    if (!confirmacion) return;

    this.tiendaService.actualizarProducto(producto.id, producto.precio, producto.stock).subscribe(() => {
      producto.editando = false;
      alert('Producto actualizado');
    });
  }

  eliminarProducto(id: number) {
    const confirmacion = confirm('¿Eliminar este producto?');
    if (!confirmacion) return;

    this.tiendaService.eliminarProducto(id).subscribe(() => {
      this.productos = this.productos.filter(p => p.id !== id);
      this.productosFiltrados = [...this.productos];
      alert('Producto eliminado');
    });
  }
}