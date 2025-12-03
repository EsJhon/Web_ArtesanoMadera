export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  codigo_producto?: string | null;
  created_at: string;
  categoria: string;      // ✅ nuevo
  subcategoria: string;   // ✅ nuevo
}
