import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common'; // ✅ Import necesario

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIf], // ✅ Agregar imports
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  banner = 'assets/images/banners/img_001.jpg';

  constructor(private router: Router) {}

  // Getter para obtener el nombre del usuario
  get nombreUsuario(): string | null {
    return localStorage.getItem('nombre');
  }

  irA(ruta: string, fragment?: string) {
        if (fragment) {
      // Si hay fragmento, navegar con fragment
      this.router.navigate([ruta], { fragment: fragment });
    } else {
      // Navegación normal
      this.router.navigate([ruta]);
    }
  }
  
  irAContacto() {
    this.router.navigate(['/'], { fragment: 'contacto' });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    this.router.navigate(['/login']);
  }
}
