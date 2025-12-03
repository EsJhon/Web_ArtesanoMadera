import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, Header, Footer, FormsModule],
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.css'],
})
export class Delivery implements OnInit {

  envio: any = {
    titulo: '', nombre: '', segundoNombre: '', apellido: '',
    direccion: '', zip: '', pais: '', ciudad: '', celular: '',
    telefono: '', horario: ''
  };

  carrito: any[] = [];
  subtotal: number = 0;
  descuento: number = 0;
  total: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) {}

ngOnInit(): void {
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras.state as any;

  // 1️⃣ Validar sesión
  const usuario = state?.usuario ?? JSON.parse(localStorage.getItem('usuario') || '{}');
  if (!usuario?.id) {
    alert('Debes iniciar sesión para continuar');
    this.router.navigate(['/login']);
    return;
  }
  this.envio.usuario_id = usuario.id;

  // 2️⃣ Cargar carrito
  // Prioridad: state -> CarritoService -> localStorage
  if (state?.carrito && state.carrito.length > 0) {
    this.carrito = state.carrito;
  } else if (this.carritoService.getCarrito().length > 0) {
    this.carrito = this.carritoService.getCarrito();
  } else {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  // 3️⃣ Si el carrito está vacío, regresar al carrito
  if (this.carrito.length === 0) {
    alert('Tu carrito está vacío');
    this.router.navigate(['/cart']);
    return;
  }

  // 4️⃣ Calcular totales
  this.subtotal = state?.subtotal ?? this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  this.descuento = state?.descuento ?? this.carritoService.getDescuento() ?? 0;
  this.total = state?.total ?? (this.subtotal - this.descuento);
}




  cargarDatos() {
    // Clonamos el carrito para evitar referencias
    this.carrito = JSON.parse(JSON.stringify(this.carritoService.getCarrito()));

    this.subtotal = this.carritoService.getSubtotal();
    this.descuento = this.carritoService.getDescuento();
    this.total = this.carritoService.getTotal();

    console.log("Delivery recibió:", {
      carrito: this.carrito, subtotal: this.subtotal,
      descuento: this.descuento, total: this.total
    });
  }

  volverAlCarrito() {
    this.router.navigate(['/cart']);
  }

  irAPayment() {
    if (!this.envio.titulo || !this.envio.nombre || !this.envio.apellido ||
        !this.envio.direccion || !this.envio.celular || !this.envio.horario) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    this.router.navigate(['/payment'], {
      state: {
        envio: this.envio,
        carrito: JSON.parse(JSON.stringify(this.carrito)),
        subtotal: this.subtotal,
        descuento: this.descuento,
        total: this.total
      }
    });
  }
}
