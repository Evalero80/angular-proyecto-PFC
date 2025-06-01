import { Component, OnInit } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { TiendatechService,Producto } from '../../tiendatech.service';
import { CommonModule } from '@angular/common'; // Necesario para ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { MatFormFieldModule } from '@angular/material/form-field'; // Para mat-form-field
import { MatInputModule } from '@angular/material/input'; // Para matInput
import { MatTableModule } from '@angular/material/table';


export interface ProductoConProveedor extends Producto {
  nombreProveedor?: string | null;
  empresa?: string | null;
}


@Component({
  selector: 'app-almacen3',
  imports: [RouterLink,RouterLinkActive,CommonModule,FormsModule,MatFormFieldModule,MatInputModule,MatTableModule],
  templateUrl: './almacen3.component.html',
  styleUrl: './almacen3.component.css'
})
export class Almacen3Component implements OnInit{
  productos: ProductoConProveedor[] = [];
  productosFiltrados: ProductoConProveedor[] = [];
  filtro: string = '';
  todosSeleccionados = false;
  ubicacionSeleccionada: string = 'tienda';
  columnas: string[] = ['seleccion', 'id', 'marca', 'nombre', 'categoria', 'subcategoria', 'precio', 'stock', 'proveedor', 'accion']; // ✅ Nueva columna

  constructor(private tiendaService: TiendatechService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(event?: any) {
    let ubicacion = event?.target?.value ? event.target.value : 'almacen3';

    this.tiendaService.obtenerAlmacenTres().subscribe((response: any) => {
      if (response.status === 'success') {
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

  moverAlmacenTres(nuevaUbicacion: string) {
    const seleccionados = this.getProductosSeleccionados();

    if (seleccionados.length === 0) {
      alert('Selecciona al menos un producto.');
      return;
    }

    const ids = seleccionados.map(p => p.id);

    this.tiendaService.moverAlmacenTres(ids, nuevaUbicacion).subscribe(() => {
      this.productos = this.productos.filter(p => !p.seleccionado);
      this.productosFiltrados = [...this.productos];
      alert(`Productos movidos a ${nuevaUbicacion}`);
    });
  }

  editarProducto(producto: ProductoConProveedor) {
    producto.editando = true;
  }

  guardarCambios(producto: ProductoConProveedor) {
    const confirmacion = confirm('¿Guardar cambios?');
    if (!confirmacion) return;

    this.tiendaService.actualizarAlmacenTres(producto.id, producto.precio, producto.stock).subscribe(() => {
      producto.editando = false;
      alert('Producto actualizado');
    });
  }

  eliminarProductoA3(id: number) {
    const confirmacion = confirm('¿Eliminar este producto?');
    if (!confirmacion) return;

    this.tiendaService.eliminarProductoA3(id).subscribe(() => {
      this.productos = this.productos.filter(p => p.id !== id);
      this.productosFiltrados = [...this.productos];
    });
  }
}