import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Producto } from '../../services/producto';
import { Usuario } from '../../services/usuario';
import { Orden } from '../../services/orden';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  // ================= VARIABLES =================
  seccion: string = 'dashboard';

  productos: Producto[] = [];
  nuevoProducto: any = {
    nombre: '', descripcion: '', precio: 0, stock: 0,
    categoria: '', subcategoria: '', imagen: ''
  };
  productoSeleccionado: any = null;
  imagenSeleccionada: File | null = null;

  usuarios: Usuario[] = [];
  usuarioSeleccionado: any = null;

  ordenes: Orden[] = [];

  // Dashboard
  totalVentas: number = 0;
  totalClientes: number = 0;
  pedidosPendientes: number = 0;
  productoTop: string = '';

  constructor(private adminService: AdminService) {}


  ngOnInit(): void {
    // Obtener usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const token = localStorage.getItem('token');

    // Validar que haya token y que sea admin (id = 8)
    if (!token || !usuario || usuario.id !== 8) {
      alert('Debe iniciar sesión con el usuario admin');
      window.location.href = '/login'; // redirige a la página de login
      return;
    }

    // Si es admin, carga todo normalmente
    this.cargarProductos();
    this.cargarUsuarios();
    this.cargarOrdenes();
    this.cargarDashboard();
  }

  ngAfterViewInit(): void {
    if (this.seccion === 'reportes') this.crearGrafico();
  }

  // =================== PRODUCTOS ===================
  cargarProductos() {
    this.adminService.getProductos().subscribe(data => this.productos = data);
  }

  seleccionarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      this.nuevoProducto.imagen = URL.createObjectURL(file);
    }
  }

  agregarProducto() {
    const formData = new FormData();

    Object.keys(this.nuevoProducto).forEach(key => {
      if (key !== 'imagen') formData.append(key, this.nuevoProducto[key]);
    });

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    this.adminService.agregarProducto(formData).subscribe(() => {
      alert('Producto agregado correctamente');
      this.limpiarFormulario();
      this.cargarProductos();
    });
  }

  limpiarFormulario() {
    this.nuevoProducto = {
      nombre: '', descripcion: '', precio: 0, stock: 0,
      categoria: '', subcategoria: '', imagen: ''
    };
    this.imagenSeleccionada = null;
  }

  editarProducto(p: Producto) {
    this.productoSeleccionado = { ...p };
  }

  guardarCambios() {
    if (!this.productoSeleccionado) return;

    const formData = new FormData();

    Object.keys(this.productoSeleccionado).forEach(key => {
      if (key !== 'imagen') formData.append(key, this.productoSeleccionado[key]);
    });

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    this.adminService.editarProducto(this.productoSeleccionado.id, formData)
      .subscribe(() => {
        alert('Producto actualizado correctamente');
        this.productoSeleccionado = null;
        this.cargarProductos();
      });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar producto?')) return;
    this.adminService.eliminarProducto(id).subscribe(() => this.cargarProductos());
  }

  // =================== USUARIOS ===================
  cargarUsuarios() {
    this.adminService.getUsuarios().subscribe(data => this.usuarios = data);
  }

  editarUsuario(u: Usuario) {
    this.usuarioSeleccionado = { ...u };
  }

  guardarCambiosUsuario() {
    if (!this.usuarioSeleccionado) return;

    // Crear objeto limpio SIN campos prohibidos
    const data = {
      nombre: this.usuarioSeleccionado.nombre,
      email: this.usuarioSeleccionado.email,
      telefono: this.usuarioSeleccionado.telefono,
      direccion: this.usuarioSeleccionado.direccion
    };

    this.adminService.editarUsuario(this.usuarioSeleccionado.id, data)
      .subscribe(() => {
        alert('Usuario actualizado correctamente');
        this.usuarioSeleccionado = null;
        this.cargarUsuarios();
      });
  }
  eliminarUsuario(id: number) {
    if (!confirm('¿Eliminar usuario?')) return;
    this.adminService.eliminarUsuario(id).subscribe(() => this.cargarUsuarios());
  }

  // =================== ÓRDENES ===================
  cargarOrdenes() {
    this.adminService.getOrdenes().subscribe(data => this.ordenes = data);
  }

  cambiarEstado(id: number, estado: string) {
    this.adminService.actualizarEstadoOrden(id, estado)
      .subscribe(() => this.cargarOrdenes());
  }
  // =================== DASHBOARD ===================
  cargarDashboard() {
    this.adminService.getDashboard()
      .subscribe((data: any) => {
        this.totalVentas = data.totalVentas;
        this.totalClientes = data.totalClientes;
        this.pedidosPendientes = data.pedidosPendientes;
        this.productoTop = data.productoTop;
      });
  }

  // =================== REPORTES ===================
  crearGrafico() {
    this.adminService.getReporteVentas().subscribe((data: any) => {
      const ctx = (document.getElementById('ventasChart') as HTMLCanvasElement)?.getContext('2d');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels : data.labels,
          datasets: [{
            label: 'Ventas por mes',
            data: data.values,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        },
        options: { responsive: true }
      });
    });
  }

  cargarReportes() {
    this.seccion = 'reportes';

    // Espera a que el canvas exista en el DOM
    setTimeout(() => this.crearGrafico(), 0);
  }

  listarOrdenes() {
    this.adminService.getOrdenes().subscribe(data => {
      this.ordenes = data;
    });
  }


}
