export const quitarSegundos = (horaCompleta) => {
  if (!horaCompleta) return "";
  return horaCompleta.split(":").slice(0, 2).join(":");
}

export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // Esto NO usa zona horaria UTC
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('es-ES', options);
};
