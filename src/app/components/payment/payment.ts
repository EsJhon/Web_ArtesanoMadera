import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../header/header'; 
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [Header, Footer, CommonModule, RouterModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css'],
})
export class Payment {

  envio: any = {};
  carrito: any[] = [];
  subtotal: number = 0;
  descuento: number = 0;
  total: number = 0;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const data = nav?.extras.state;

    if (data) {
      // Clonar para seguridad
      this.envio = { ...data['envio'] };
      this.carrito = JSON.parse(JSON.stringify(data['carrito']));
      this.subtotal = data['subtotal'];
      this.descuento = data['descuento'];
      this.total = data['total'];
    }
  }

  irAConfirmacion() {
    this.router.navigate(['/confirm'], {
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
