import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../header/header'; 
import { Footer } from '../footer/footer';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usuario: string = '';
  clave: string = '';
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
      if (event.clientX < this.anchoMitad) {
        this.currentImage = 'assets/images/imglg/2.png';
      } else {
        this.currentImage = 'assets/images/imglg/3.png';
      }
    });
  }

  onInputFocus(inputType: string) {
    this.seguirPunteroMouse = false;
    if (inputType === 'clave') {
      this.animatePasswordBox('close');
    }
  }

  onInputBlur() {
    this.seguirPunteroMouse = true;
    if (this.clave) this.animatePasswordBox('open');
  }

  onUsuarioKeyup() {
    if (this.usuario) this.currentImage = 'assets/images/imglg/4.png';
  }

  private animatePasswordBox(action: 'open' | 'close') {
    const frames = action === 'close' ? [1, 2, 3] : [3, 2, 1];
    let currentFrame = 0;

    const animate = () => {
      if (currentFrame < frames.length) {
        this.currentImage = `assets/images/imglg/imc/${frames[currentFrame]}.png`;
        currentFrame++;
        setTimeout(animate, 60);
      }
    };

    animate();
  }

  onLogin() {
  if (!this.usuario || !this.clave) {
    alert('Ingrese email y contraseña');
    return;
  }

  this.http.post<any>('http://localhost:3000/api/auth/login', {
    email: this.usuario,
    password: this.clave
  }).subscribe({
    next: res => {
      if (res.status === 'success') {

        // 🔹 Validar que sea el usuario admin (id = 8)
        if (res.user.id !== 8) {
          alert('Solo el usuario admin puede iniciar sesión');
          return;
        }

        alert('Login exitoso');

        localStorage.setItem('usuario', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario_id', res.user.id); // 🔹 Guardar el ID
        localStorage.setItem('nombre', res.user.nombre);

        this.router.navigate(['/']); // Redirige al dashboard
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


  onGoToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}
