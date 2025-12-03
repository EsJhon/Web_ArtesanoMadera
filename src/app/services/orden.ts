export interface Orden {
  id: number;
  usuario_id: number;
  total: number;
  estado: string;
  created_at?: string;
}
