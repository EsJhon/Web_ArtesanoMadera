import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../services/producto';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router'; // ✅ Importar Router

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  categorias: string[] = [];
  subcategorias: string[] = [];
  filtroCategoria: string = '';
  filtroSubcategoria: string = '';
  filtroEstado: string = '';
  orden: string = 'nuevo';

  paginaActual: number = 1;
  itemsPorPagina: number = 15;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router // ✅ Inyectar Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data.map(p => ({ ...p, precio: Number(p.precio) }));
        this.categorias = Array.from(new Set(this.productos.map(p => p.categoria)));
        this.aplicarFiltros();
      },
      error => console.error('Error al cargar productos:', error)
    );
  }

  actualizarSubcategorias(): void {
    if (this.filtroCategoria) {
      this.subcategorias = Array.from(new Set(
        this.productos
          .filter(p => p.categoria === this.filtroCategoria)
          .map(p => p.subcategoria)
      ));
    } else {
      this.subcategorias = [];
    }
    this.filtroSubcategoria = '';
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(p => {
      const categoriaOk = this.filtroCategoria ? p.categoria === this.filtroCategoria : true;
      const subcategoriaOk = this.filtroSubcategoria ? p.subcategoria === this.filtroSubcategoria : true;
      const estadoOk = this.filtroEstado ? 
        (this.filtroEstado === 'Disponible' && p.stock > 0) ||
        (this.filtroEstado === 'Agotado' && p.stock === 0) ||
        (this.filtroEstado === 'En Oferta' && p.precio < 500) : true;
      return categoriaOk && subcategoriaOk && estadoOk;
    });

    this.ordenarProductos();
    this.paginaActual = 1;
  }

  ordenarProductos(): void {
    if(this.orden === 'mayor') this.productosFiltrados.sort((a,b) => b.precio - a.precio);
    if(this.orden === 'menor') this.productosFiltrados.sort((a,b) => a.precio - b.precio);
    if(this.orden === 'nuevo') this.productosFiltrados.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  productosPagina(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  paginas(): number[] {
    return Array(Math.ceil(this.productosFiltrados.length / this.itemsPorPagina)).fill(0).map((_, i) => i + 1);
  }

  cambiarPagina(p: number): void {
    if(p < 1) p = 1;
    if(p > this.paginas().length) p = this.paginas().length;
    this.paginaActual = p;
  }

  limpiarFiltros(): void {
    this.filtroCategoria = '';
    this.filtroSubcategoria = '';
    this.subcategorias = [];
    this.filtroEstado = '';
    this.orden = 'nuevo';
    this.aplicarFiltros();
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
    alert(`${producto.nombre} agregado al carrito`);
  }

  /** ✅ Redirige al detalle del producto */
  verDetalle(producto: Producto) {
    this.router.navigate(['/productdet', producto.id]);
  }
}
