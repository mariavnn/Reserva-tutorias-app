export const quitarSegundos = (horaCompleta) => {
  if (!horaCompleta) return "";
  return horaCompleta.split(":").slice(0, 2).join(":");
}

export const formatDate = (dateString) => {
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};