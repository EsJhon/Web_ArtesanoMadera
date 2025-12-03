import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoKey = 'miCarrito';

  constructor() {}

  /** Devuelve el carrito desde localStorage o vacío */
  getCarrito(): any[] {
    const data = localStorage.getItem(this.carritoKey);
    return data ? JSON.parse(data) : [];
  }

  /** 🔹 Devuelve la cantidad total de productos en el carrito */
  getCantidadTotal(): number {
    const carrito = this.getCarrito();
    return carrito.reduce((total, p) => total + (p.cantidad || 0), 0);
  }

  /** Guarda el carrito en localStorage */
  private guardarCarrito(carrito: any[]) {
    localStorage.setItem(this.carritoKey, JSON.stringify(carrito));
  }

  /** Agrega un producto al carrito (controlando stock y cantidad) */
  agregarProducto(producto: any, cantidad: number = 1) {
    const carrito = this.getCarrito();
    const existente = carrito.find((p: any) => p.id === producto.id);

    if (existente) {
      existente.cantidad += cantidad;
      if (existente.cantidad > producto.stock) {
        existente.cantidad = producto.stock;
      }
    } else {
      carrito.push({ ...producto, cantidad });
    }

    this.guardarCarrito(carrito);
  }

  /** Actualiza un producto (por ejemplo, cantidad) */
  updateProducto(producto: any) {
    const carrito = this.getCarrito();
    const index = carrito.findIndex(p => p.id === producto.id);
    if (index >= 0) {
      carrito[index] = producto;
      this.guardarCarrito(carrito);
    }
  }

  /** Elimina un producto del carrito */
  eliminarProducto(id: number) {
    let carrito = this.getCarrito();
    carrito = carrito.filter(p => p.id !== id);
    this.guardarCarrito(carrito);
  }

  /** Vacía todo el carrito */
  limpiarCarrito() {
    localStorage.removeItem(this.carritoKey);
  }
  
  /** Calcula el subtotal del carrito */
  getSubtotal(): number {
    const carrito = this.getCarrito();
    return carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  }

  /** Guarda el descuento aplicado */
  private descuento: number = 0;

  /** Asigna un descuento */
  setDescuento(valor: number) {
    this.descuento = valor;
  }

  /** Obtiene el descuento actual */
  getDescuento(): number {
    return this.descuento;
  }

  /** Calcula el total final */
  getTotal(): number {
    return this.getSubtotal() - this.getDescuento();
  }


  /** Reemplaza todo el carrito con uno nuevo */
  setCarrito(carrito: any[]) {
    this.guardarCarrito(carrito);
  }
  
}
