import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [Header, Footer, CommonModule, RouterModule],
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.css'],
})
export class Confirm {

  envio: any = {};
  carrito: any[] = [];
  subtotal: number = 0;
  descuento: number = 0;
  total: number = 0;

  constructor(private router: Router, private http: HttpClient, private carritoService: CarritoService) {
    const nav = this.router.getCurrentNavigation();
    const data = nav?.extras.state;

    if (data) {
      this.envio = { ...data['envio'] };
      this.carrito = JSON.parse(JSON.stringify(data['carrito']));
      this.subtotal = data['subtotal'];
      this.descuento = data['descuento'];
      this.total = data['total'];
    }
  }

  ngOnInit() {
    console.log("🟩 CARRITO EN OnInit:", this.carrito);

    if (this.carrito.length > 0) {
      this.registrarOrden();
    } else {
      console.warn("⚠️ El carrito está vacío, no se registra la orden.");
    }
  }

  registrarOrden() {
    const data = {
      usuario_id: this.envio.usuario_id,
      total: this.total,
      descuento: this.descuento,
      envio: this.envio,
      items: this.carrito
    };

    console.log("🟦 CARRITO QUE SE ENVÍA:", this.carrito);

    this.http.post('http://localhost:3000/api/ordenes', data).subscribe({
      next: (res: any) => {
        console.log("Orden registrada correctamente", res);
        // 🔹 Limpiar carrito localStorage
        this.carritoService.limpiarCarrito();
      },
      error: (err) => console.error("Error al guardar orden", err)
    });
  }
}
