import { create } from 'zustand';
import { scheduleService } from '../service/scheduleService';
import { userInfoService } from '../service/infoUser';

const mapToSessionCardData = (horarios = []) =>
  horarios
    .slice()
    .sort((a, b) => new Date(a.fechaHorario) - new Date(b.fechaHorario))
    .map((horario) => ({
      id: horario.idHorario,
      title: `${horario.materia.nombreMateria}`,
      tutor: `Tutor ${horario.usuario.nombre} ${horario.usuario.apellido}`,
      description: horario.descripcion,
      starTime: horario.horaInicio.substring(0, 5),
      endTime: horario.horaFin.substring(0, 5),
      current: horario.agendados?.length ?? 0,
      max: 5,
      status: horario.modo === 'DISPONIBLE' ? 'Disponible' : 'Agendada',
      mode: horario.tipo,
      date: horario.fechaHorario,
      location: horario.salon
        ? `${horario.salon.descripcion ? horario.salon.descripcion + ' - ' : ''}${horario.salon.ubicacion} (${horario.salon.bloque?.seccion})`
        : null,
    }));

export const useTutoriaStore = create((set) => ({
  sesiones: [],
  loading: false,
  error: null,

  setSesiones: (data) => set({ sesiones: data }),
  setLoading: (state) => set({ loading: state }),
  setError: (msg) => set({ error: msg }),

  loadAvailableTutorings: async () => {
    set({ loading: true, error: null });
    try {
      const user = await userInfoService.getUserInfo();
      const subjectIds = user.subjectUsers.map((s) => s.subjectId);

      const { message, data } = await scheduleService.getScheduleWithFilters({
        subjectIds,
        mode: 'DISPONIBLE',
      });
      const sesionesMapeadas = mapToSessionCardData(data);
      set({ sesiones: sesionesMapeadas });
      console.log(message, data);
    } catch (err) {
      console.error('Error al cargar tutorías:', err);
      set({ error: 'Error al cargar las tutorías disponibles' });
    } finally {
      set({ loading: false });
    }
  },
}));
