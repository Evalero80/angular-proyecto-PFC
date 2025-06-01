import { Component,Inject,PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TiendatechService } from '../../tiendatech.service';
import { response } from 'express';

export interface Item {
  marca: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  precio: String;
  stock: String;
  }

@Component({
  selector: 'app-crearproducto',
  imports: [FormsModule,CommonModule],
  templateUrl: './crearproducto.component.html',
  styleUrl: './crearproducto.component.css'
})
export class CrearproductoComponent {

  model: any = {
    marca: '',
    nombre: '',
    categoria: '',
    subcategoria: '',
    precio: '',
    stock: '',
    idProveedor: '' // ✅ Nuevo campo
  };

  showModal: boolean = false;
  selectedTable: string = '';
  proveedores: any[] = [];

  constructor(
    private tiendatechService: TiendatechService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.cargarProveedores(); // ✅ Carga proveedores desde servidor
  }
    onSubmit() {


    // Abre el modal cuando el usuario hace clic en "Enviar"
    this.showModal = true;
  }

  cargarProveedores() {
    this.tiendatechService.obtenerProveedores().subscribe((res: any) => {
      if (res?.data) {
        this.proveedores = res.data;
      }
    });
  }

  confirmSelection() {
    if (!this.selectedTable) {
      alert('Por favor, selecciona una ubicación');
      return;
    }

    const formProducto = {
      marca: this.model.marca,
      nombre: this.model.nombre,
      categoria: this.model.categoria || '',
      subcategoria: this.model.subcategoria || '',
      precio: parseFloat(this.model.precio),
      stock: parseInt(this.model.stock),
      idProveedor: parseInt(this.model.idProveedor) // ✅ Envía ID del proveedor
    };

    this.tiendatechService.guardarProducto(formProducto, this.selectedTable).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          alert('Producto guardado correctamente');
          this.showModal = false;
          this.model = {};
        } else {
          alert('Error: ' + response.message);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
        alert('Error inesperado al guardar el producto');
      }
    );
  }

  cancelSelection() {
    this.showModal = false;
  }
}