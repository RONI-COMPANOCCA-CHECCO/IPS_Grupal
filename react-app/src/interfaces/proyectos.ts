interface Project{
  id: number;
  nombre: string;
  descripcion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  tipo: string;
  estado: string;
  presupuesto: number;
  avance?: number;
  isFavorite?: boolean;
}
