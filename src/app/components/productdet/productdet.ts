import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../services/producto';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-productdet',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer], // ✅ Se añadió RouterModule
  templateUrl: './productdet.html',
  styleUrls: ['./productdet.css']
})
export class ProductDetComponent implements OnInit {
  product?: Producto;
  productosRelacionados: Producto[] = [];
  productosVistos: Producto[] = [];
  cantidad: number = 1; // cantidad inicial


  @ViewChild('carousel') carousel!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Escucha cambios en el parámetro 'id' de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarProducto(+id);
        this.registrarProductoVisto(+id);
      }
    });
  }

  cargarProducto(id: number): void {
    this.productoService.getProductos().subscribe(
      (data: Producto[]) => {
        this.product = data.find(p => p.id === id);
        if (this.product) {
          this.productosRelacionados = data
            .filter(p => p.id !== id)
            .slice(0, 6);
        }
      },
      error => console.error('Error al cargar el producto:', error)
    );
  }

  agregarAlCarrito(): void {
    if (this.product) {
      const productoCarrito = {
        id: this.product.id,
        nombre: this.product.nombre,
        precio: Number(this.product.precio), // convertir string a number
        stock: this.product.stock,
        imagen: this.product.imagen,        // ej: "mesas/mesa.jpg"
        cantidad: this.cantidad,
        subcategoria: this.product.subcategoria || ''
      };
      this.carritoService.agregarProducto(productoCarrito, this.cantidad);
      alert(`${this.cantidad} unidad(es) de ${this.product.nombre} agregadas al carrito 🛒`);
      this.cantidad = 1;
    }
  }


  registrarProductoVisto(id: number): void {
    let vistos: number[] = JSON.parse(localStorage.getItem('vistos') || '[]');
    if (!vistos.includes(id)) {
      vistos.unshift(id);
      if (vistos.length > 4) vistos = vistos.slice(0, 4);
      localStorage.setItem('vistos', JSON.stringify(vistos));
    }
    this.productoService.getProductos().subscribe((data: Producto[]) => {
      this.productosVistos = data.filter(p => vistos.includes(p.id));
    });
  }

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  aumentarCantidad(): void {
    if (this.product && this.cantidad < this.product.stock) {
      this.cantidad++;
    } else {
      alert('No hay más stock disponible');
    }
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }


}
