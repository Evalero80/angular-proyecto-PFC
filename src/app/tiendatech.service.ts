import { Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,tap } from 'rxjs';
import { Evento } from './calendar/evento.model';
import { isPlatformBrowser } from '@angular/common';

export interface Producto {
  id: number;
  marca: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  precio: number;
  stock: number;

  // Propiedades dinámicas (para edición y selección)
  seleccionado?: boolean;
  editando?: boolean;
  
}

export interface Proveedor {
  id: number;
  nombre: string;
  empresa: string;
  email?: string;
  telefono?: string;
  categoria: string;
  condicionesPago: string;
  direccion?: string;
  paginaWeb?: string;
  cif: string;
  notas?: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TiendatechService {




 private apiUrlAuth = 'http://localhost/appTiendaTech/auth.php'
 private apiUrlProveedores = 'http://localhost/appTiendaTech/proveedores.php'
  private apiUrlCliente = 'http://localhost/appTiendaTech/guardar.php'; 
  private apiUrlProducto = 'http://localhost/appTiendaTech/guardarProducto.php';
  private apiProductoListar = 'http://localhost/appTiendaTech/listarProductosEnTienda.php';
  private apiAlmacen1 = 'http://localhost/appTiendaTech/listaAlmacen1.php';
  private apiAlmacen2 = 'http://localhost/appTiendaTech/listaAlmacen2.php';
  private apiAlmacen3 = 'http://localhost/appTiendaTech/listaAlmacen3.php';
  private calendario = 'http://localhost/appTiendaTech/calendarioEventos.php';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}






  // Método para obtener todos los clientes
guardarCliente(data: any): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  return this.http.post(this.apiUrlCliente, data, { headers });
}

// Obtener clientes
obtenerClientes(): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({ 'Database': database || '' });
  return this.http.get(`${this.apiUrlCliente}?action=obtener`, { headers });
}

// Marcar cliente como finalizado
marcarClienteComoFinalizado(cliente: any): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  const body = { nombre: cliente.nombre, estado: 'finalizado' };
  return this.http.put(`${this.apiUrlCliente}?action=estado`, body, { headers });
}

// Marcar cliente como pendiente
marcarClienteComoPendiente(cliente: any): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  const body = { nombre: cliente.nombre, estado: 'pendiente' };
  return this.http.put(`${this.apiUrlCliente}?action=estado`, body, { headers });
}

// Eliminar cliente por nombre
eliminarClientePorNombre(nombre: string): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  const body = { nombre };
  return this.http.delete(`${this.apiUrlCliente}?action=delete`, {
    headers,
    body
  });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------ALMACEN en TIENDA----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------

 /**
   * Método para obtener todos los productos.
   */
  // Método para obtener productos
 private getDatabase(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('database') : null;
  }

  // Método privado para crear encabezados con Database
  private getHeaders() {
    const database = this.getDatabase();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Database': database || ''
    });
  }

  // Obtener productos desde tienda

obtenerProductosTienda(): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  return this.http.get(`${this.apiProductoListar}?action=obtener`, {
    headers,
    responseType: 'json'
  });
}
  // Mover productos desde tienda
  moverProductos(ids: number[], nuevaUbicacion: string): Observable<any> {
    const headers = this.getHeaders();
    const body = { ids, nuevaUbicacion };
    return this.http.put(`${this.apiProductoListar}?action=mover`, body, { headers });
  }

  // Actualizar producto en tienda
  actualizarProducto(id: number, precio: number, stock: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { precio, stock };
    return this.http.put(`${this.apiProductoListar}?action=actualizar&id=${id}`, body, { headers });
  }

  // Eliminar producto en tienda
  eliminarProducto(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiProductoListar}?action=eliminar&id=${id}`, { headers });
  }

  // Obtener productos por ubicación (almacen1, almacen2, etc.)
  obtenerProductosPorUbicacion(ubicacion: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiProductoListar}?action=obtener&ubicacion=${ubicacion}`, { headers });
  }

  //---------------------------------------------------------------------
  // Métodos para Almacén 1
  //---------------------------------------------------------------------

  obtenerAlmacenUno(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiAlmacen1}?action=obtener`, { headers });
  }

moverAlmacenUno(ids: number[], nuevaUbicacion: string): Observable<any> {
  const headers = this.getHeaders();
  const body = { ids, nuevaUbicacion };
  return this.http.put(`${this.apiAlmacen1}?action=mover`, body, { headers });
}

  actualizarAlmacenUno(id: number, precio: number, stock: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { precio, stock };
    return this.http.put(`${this.apiAlmacen1}?action=actualizar&id=${id}`, body, { headers });
  }

  eliminarProductoA1(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiAlmacen1}?action=eliminar&id=${id}`, { headers });
  }

obtenerAlmacenUnoPorUbicacion(ubicacion: string): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${this.apiAlmacen1}?action=obtener&ubicacion=${ubicacion}`, { headers });
}
  //---------------------------------------------------------------------
  // Métodos para Almacén 2
  //---------------------------------------------------------------------

  obtenerAlmacenDos(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiAlmacen2}?action=obtener`, { headers });
  }

moverAlmacenDos(ids: number[], nuevaUbicacion: string): Observable<any> {
  const headers = this.getHeaders();
  const body = { ids, nuevaUbicacion };
  return this.http.put(`${this.apiAlmacen2}?action=mover`, body, { headers });
}

  actualizarAlmacenDos(id: number, precio: number, stock: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { precio, stock };
    return this.http.put(`${this.apiAlmacen2}?action=actualizar&id=${id}`, body, { headers });
  }

  eliminarProductoA2(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiAlmacen2}?action=eliminar&id=${id}`, { headers });
  }

  obtenerAlmacenDosPorUbicacion(ubicacion: string): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${this.apiAlmacen2}?action=obtener&ubicacion=${ubicacion}`, { headers });
}


  //---------------------------------------------------------------------
  // Métodos para Almacén 3
  //---------------------------------------------------------------------

obtenerAlmacenTres(): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${this.apiAlmacen3}?action=obtener`, { headers });
}


moverAlmacenTres(ids: number[], nuevaUbicacion: string): Observable<any> {
  const headers = this.getHeaders();
  const body = { ids, nuevaUbicacion };
  return this.http.put(`${this.apiAlmacen3}?action=mover`, body, { headers });
}
actualizarAlmacenTres(id: number, precio: number, stock: number): Observable<any> {
  const headers = this.getHeaders();
  const body = { precio, stock };
  return this.http.put(`${this.apiAlmacen3}?action=actualizar&id=${id}`, body, { headers });
}
eliminarProductoA3(id: number): Observable<any> {
  const headers = this.getHeaders();
  return this.http.delete(`${this.apiAlmacen3}?action=eliminar&id=${id}`, { headers });
}
  obtenerAlmacenTresPorUbicacion(ubicacion: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiAlmacen3}?action=obtener&ubicacion=${ubicacion}`, { headers });
  }


// --------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------
 // --------------------------------------------------------------------------------------------------------------------------
// Guardar Producto--------------------------------------------------------------------------------------------------------------------------
guardarProducto(producto: any, tabla: string): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  const body = {
    ...producto,
    table: tabla
  };

  return this.http.post(`${this.apiUrlProducto}?action=saveProduct`, body, {
    headers,
    responseType: 'json'
  });
}



// --------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------
 // --------------------------------------------------------------------------------------------------------------------------
// CALENDARIO--------------------------------------------------------------------------------------------------------------------------




 // Obtener eventos
obtenerEventos(): Observable<{ status: string; data: Evento[] }> {
  const database = isPlatformBrowser(this.platformId) 
    ? localStorage.getItem('database') || '' 
    : '';

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database
  });

  return this.http.get<{ status: string; data: Evento[] }>(
    `${this.calendario}?action=obtener`, { headers }
  );
}
  // Guardar evento
  guardarEvento(evento: Evento): Observable<any> {
    const database = localStorage.getItem('database');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Database': database || ''
    });

    return this.http.post(this.calendario + '?action=guardar', evento, { headers });
  }

  // Actualizar evento
  actualizarEvento(id: number, evento: Evento): Observable<any> {
    const database = localStorage.getItem('database');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Database': database || ''
    });

    return this.http.put(`${this.calendario}?action=actualizar&id=${id}`, evento, { headers });
  }

  // Eliminar evento
  eliminarEvento(id: number): Observable<any> {
    const database = localStorage.getItem('database');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Database': database || ''
    });

    return this.http.delete(`${this.calendario}?action=eliminar&id=${id}`, { headers });
  }

// --------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------
 // --------------------------------------------------------------------------------------------------------------------------
// PROVEEDORES--------------------------------------------------------------------------------------------------------------------------

// ✅ Guardar nuevo proveedor
guardarProveedor(proveedor: any): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  const body = {
    ...proveedor,
    activo: proveedor.activo ? 1 : 0
  };

  return this.http.post(`${this.apiUrlProveedores}?action=guardar`, body, { headers });
}
// ✅ Obtener proveedores
obtenerProveedores(): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  return this.http.get(`${this.apiUrlProveedores}?action=obtener`, {
    headers,
    withCredentials: true
  });
}

// ✅ Actualizar proveedor existente
actualizarProveedor(id: number, proveedor: any): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  const body = {
    ...proveedor,
    activo: proveedor.activo ? 1 : 0 // ✅ Conversión explícita
  };

  return this.http.put(`${this.apiUrlProveedores}?action=actualizar&id=${id}`, body, { headers });
}

// ✅ Eliminar proveedor
eliminarProveedor(id: number): Observable<any> {
  const database = localStorage.getItem('database');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Database': database || ''
  });

  return this.http.delete(`${this.apiUrlProveedores}?action=eliminar&id=${id}`, {
    headers,
    withCredentials: true
  });
}

  
// --------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------
 // --------------------------------------------------------------------------------------------------------------------------
// registro--------------------------------------------------------------------------------------------------------------------------

login(usuario: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.apiUrlAuth}?action=login`, usuario, {
    headers,
    withCredentials: true
  }).pipe(
    tap((res: any) => {
      if (res && res.success && res.database) {
        localStorage.setItem('logueado', 'true');
        localStorage.setItem('usuario', usuario.correo);
        localStorage.setItem('database', res.database);
      }
    })
  );
}


registrar(usuario: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(`${this.apiUrlAuth}?action=registro`, usuario, {
    headers,
    withCredentials: true
  }).pipe(
    tap((res: any) => {
      if (res && res.success && res.database) {
        localStorage.setItem('database', res.database);
      }
    })
  );
}
  // 🔒 Cerrar sesión
logout(): Observable<any> {
  return this.http.post(`${this.apiUrlAuth}?action=logout`, {}, {
    withCredentials: true
  }).pipe(
    tap(() => {
      localStorage.removeItem('logueado');
      localStorage.removeItem('usuario');
      localStorage.removeItem('database');
    })
  );
}
}
  
