import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, Footer, CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  public banner = 'assets/images/banners/img_001.jpg';
  productos: any[] = [];

  constructor(
    private router: Router, 
    private productoService: ProductoService,
    private route: ActivatedRoute  // ← Añadido ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarProductos();
    
    // Manejar fragmentos de URL
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'contacto') {
        console.log('Fragmento contacto detectado');
        this.scrollToContacto();
      }
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        console.log("PRODUCTOS RECIBIDOS:", data);
        this.productos = data;
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  scrollToContacto() {
    // Esperar a que la página se renderice completamente
    setTimeout(() => {
      const elemento = document.getElementById('contacto');
      console.log('Buscando elemento contacto:', elemento);
      
      if (elemento) {
        console.log('Elemento encontrado, haciendo scroll...');
        
        // Método 1: scrollIntoView con offset para header fijo
        const yOffset = -100; // Ajusta este valor según la altura de tu header
        const y = elemento.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
        
        // Método 2: Intentar también con scrollIntoView directo
        setTimeout(() => {
          elemento.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }, 300);
      }
    }, 500);
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  irAId(id: string) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  irADetalle(id: number) {
    console.log("👉 ID RECIBIDO:", id);
    this.router.navigate(['/productdet', id]);
  }
}