// api/proyects.ts
export async function fetchProjects(
  search = "",
  departamento = "",
  provincia = "",
  tipo = ""
) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (departamento) params.append("departamento", departamento);
  if (provincia) params.append("provincia", provincia);
  if (tipo) params.append("tipo", tipo);

  const response = await fetch(
    `http://localhost:8000/api/proyectos/?${params}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener los proyectos");
  }

  return response.json();
}
