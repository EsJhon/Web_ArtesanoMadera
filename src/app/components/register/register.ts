import { Component, HostListener, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';
  password: string = '';
  confirmPassword: string = '';
  currentImage: string = 'assets/images/imglg/1.png';
  seguirPunteroMouse: boolean = true;

  private anchoMitad: number = window.innerWidth / 2;
  private altoMitad: number = window.innerHeight / 2;
  private animationFrameId: number | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.seguirPunteroMouse) return;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    this.animationFrameId = requestAnimationFrame(() => {
      this.currentImage = (event.clientX < this.anchoMitad)
        ? 'assets/images/imglg/2.png'
        : 'assets/images/imglg/3.png';
    });
  }

  onInputFocus(inputType: string) { this.seguirPunteroMouse = false; }
  onInputBlur() { this.seguirPunteroMouse = true; }

  onForgotPassword() { this.router.navigate(['/login']); }

  onRegister() {
    if (this.nombre.trim().length < 3) { alert('El nombre debe tener al menos 3 caracteres'); return; }
    if (!this.validateEmail(this.email)) { alert('Correo inválido'); return; }
    if (this.telefono.trim().length < 6) { alert('El teléfono debe tener al menos 6 caracteres'); return; }
    if (this.direccion.trim().length < 5) { alert('La dirección debe tener al menos 5 caracteres'); return; }
    if (this.password.length < 6) { alert('La contraseña debe tener al menos 6 caracteres'); return; }
    if (this.password !== this.confirmPassword) { alert('Las contraseñas no coinciden'); return; }

    const payload = { nombre: this.nombre, email: this.email, telefono: this.telefono, direccion: this.direccion, password: this.password };

    this.http.post<any>('http://localhost:3000/api/auth/register', payload)
      .subscribe({
        next: res => {
          if (res.status === 'success') {
            alert('Registro exitoso');
            this.router.navigate(['/login']);
          } else {
            alert('Error: ' + res.message);
          }
        },
        error: err => {
          console.error(err);
          alert('Error en la comunicación con el servidor');
        }
      });
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  ngOnDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}
