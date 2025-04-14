import { View, Text } from 'react-native'
import React from 'react'
import GeneralTitle from '../../../../components/GeneralTitle'
import SizedBox from '../../../../components/SizedBox'
import TutoriasCard from '../../../../components/tutoriasCard'
import { useState } from 'react'
import { Screen } from '../../../../components/Screen'
import { ScrollView } from 'react-native'

const infoTutorias = [
  {
    id: '1',
    nombreMateria: 'Matemáticas Avanzadas',
    fecha: '2025-04-15',
    horario: '10:00 - 12:00',
    ubicacion: 'Aula 202, Edificio B',
    estudiantes: [
      { nombre: 'Carlos Ramírez', id: 'est001' },
      { nombre: 'Lucía Gómez', id: 'est002' },
      { nombre: 'Marco Ruiz', id: 'est003' },
    ],
  },
  {
    id: '2',
    nombreMateria: 'Programación en JavaScript',
    fecha: '2025-04-16',
    horario: '14:00 - 16:00',
    ubicacion: 'Laboratorio 1, Edificio A',
    estudiantes: [
      { nombre: 'Andrea Torres', id: 'est004' },
      { nombre: 'Luis Hernández', id: 'est005' },
    ],
  },
  {
    id: '3',
    nombreMateria: 'Física I',
    fecha: '2025-04-17',
    horario: '08:00 - 09:30',
    ubicacion: 'Aula 105, Edificio C',
    estudiantes: [],
  },
  {
    id: '4',
    nombreMateria: 'Física I',
    fecha: '2025-04-17',
    horario: '08:00 - 09:30',
    ubicacion: 'Aula 105, Edificio C',
    estudiantes: [],
  },
  {
    id: '5',
    nombreMateria: 'Física I',
    fecha: '2025-04-17',
    horario: '08:00 - 09:30',
    ubicacion: 'Aula 105, Edificio C',
    estudiantes: [],
  },
];



export default function HomeTutor() {
  const [tutorias, setTutorias] = useState(infoTutorias);

  const handleDelete = (id) => {
    const nuevasTutorias = infoTutorias.filter((tutoria) => tutoria.id !== id);
    setTutorias(nuevasTutorias);
  }

  return (
    <Screen>
      <View className="w-full">
        <GeneralTitle
          label={"Mis Tutorias"}
          type='primary'
          className='!text-blue-500 mt-4'
        />
        <SizedBox height={10}/>
        <ScrollView className="w-full py-5" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {tutorias.map((tutoria) => (
            <TutoriasCard
              key={tutoria.id}
              tutoriaInfo={tutoria}
              onDelete={() => handleDelete(tutoria.id)}
            />
          ))}
        </ScrollView>
      </View>
    </Screen>
    
  )
}