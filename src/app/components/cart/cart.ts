import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {

  carrito: any[] = [];
  subtotal: number = 0;
  descuento: number = 0;
  total: number = 0;
  codigoCupon: string = '';

  // URL base para imágenes desde el backend
  backendUrl: string = 'http://localhost:3000/uploads/productos/';

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCarrito();
    console.log('Carrito:', this.carrito);
  }

  /** Carga los productos del carrito desde el servicio */
  cargarCarrito() {
    this.carrito = this.carritoService.getCarrito().map(p => ({
      id: p.id,
      nombre: p.nombre || 'Producto',
      precio: Number(p.precio) || 0,
      stock: p.stock || 0,
      cantidad: p.cantidad || 1,
      imagen: p.imagen || 'default.png',
      subcategoria: p.subcategoria || '',
      codigo_cupon: p.codigo_cupon || null   // 🔹 agregar esto
    }));
    this.calcularTotales();
  }

  irADelivery() {
    // 1️⃣ Leer usuario desde localStorage
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      alert('Debes iniciar sesión para continuar');
      this.router.navigate(['/login']);
      return;
    }

    const usuario = JSON.parse(usuarioStr);

    // 2️⃣ Validar que tenga ID
    if (!usuario?.id) {
      alert('Debes iniciar sesión para continuar');
      this.router.navigate(['/login']);
      return;
    }

    // 3️⃣ Guardar carrito actualizado en el servicio y en localStorage
    this.carritoService.setCarrito(this.carrito);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));

    // 4️⃣ Navegar a delivery
    this.router.navigate(['/delivery'], {
      state: {
        usuario,
        carrito: this.carrito,
        subtotal: this.subtotal,
        descuento: this.descuento,
        total: this.total
      }
    });
  }





  /** Aumenta cantidad del producto respetando stock máximo */
  aumentarCantidad(producto: any) {
    if (producto.cantidad < producto.stock) {
      producto.cantidad += 1;
      this.calcularTotales();
      this.carritoService.updateProducto(producto);
    }
  }

  /** Disminuye cantidad del producto respetando mínimo 1 */
  disminuirCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad -= 1;
      this.calcularTotales();
      this.carritoService.updateProducto(producto);
    }
  }

  /** Elimina producto del carrito */
    eliminarProducto(producto: any) {
      this.carrito = this.carrito.filter(p => p.id !== producto.id);
      this.carritoService.eliminarProducto(producto.id);
      this.calcularTotales();
    }

/** Aplica cupón de descuento solo a los productos elegibles */
  aplicarCupon() {
    if (this.codigoCupon.trim() === '') {
      alert('Ingresa un código de cupón');
      return;
    }

    if (this.codigoCupon === 'DESC10') {
      // Filtra los productos del carrito que tengan el cupón 'DESC10'
      const productosConCupon = this.carrito.filter(p => p.codigo_cupon === 'DESC10');

      if (productosConCupon.length === 0) {
        alert('Ningún producto del carrito aplica para este cupón');
        this.descuento = 0;
      } else {
        // Calcula descuento por producto * cantidad
        this.descuento = productosConCupon.reduce(
          (acc, p) => acc + (p.precio * p.cantidad * 0.10), 0
        );
        alert(`Cupón aplicado: 10% de descuento en ${productosConCupon.length} productos`);
      }
    } else {
      this.descuento = 0;
      alert('Cupón inválido');
    }

    this.carritoService.setDescuento(this.descuento);
    this.calcularTotales(); // Actualiza subtotal y total
  }


  /** Calcula subtotal, descuento y total */
  calcularTotales() {
    this.subtotal = this.carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    this.total = this.subtotal - this.descuento;
  }

  /** Devuelve URL completa de la imagen */
  imagenUrl(producto: any): string {
    return producto.imagen ? `http://localhost:3000/uploads/productos/${producto.imagen}` : '';
  }
}
