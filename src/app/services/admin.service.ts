import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrlProductos = 'http://localhost:3000/api/productos';
  private apiUrlUsuarios  = 'http://localhost:3000/api/usuarios';
  private apiUrlOrdenes   = 'http://localhost:3000/api/ordenes';
  private apiUrlReportes  = 'http://localhost:3000/api/reportes';

  constructor(private http: HttpClient) {}

  // ================= PRODUCTOS =================
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlProductos);
  }

  agregarProducto(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrlProductos}/agregar`, data);
  }

  editarProducto(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrlProductos}/editar/${id}`, data);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlProductos}/eliminar/${id}`);
  }

  // ================= USUARIOS =================
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlUsuarios);
  }

  editarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrlUsuarios}/editar/${id}`, data);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlUsuarios}/eliminar/${id}`);
  }

  // ================= ORDENES =================
  getOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlOrdenes);
  }

  actualizarEstadoOrden(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrlOrdenes}/estado/${id}`, { estado });
  }

  // ================= DASHBOARD =================
  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlReportes}/dashboard`);
  }

  // ================= REPORTES =================
  getReporteVentas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlReportes}/ventas`);
  }
}
