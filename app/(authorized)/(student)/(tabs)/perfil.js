import { View, Text } from 'react-native'
import React from 'react'
import PerfilInterfaz from '../../../../shared/perfil'


const materias = [
  { label: 'Programación', value: '1' },
  { label: 'Matemáticas', value: '2' },
  { label: 'Mecánica', value: '3' },
]

export default function PerfilStudent() {
  return (
    <PerfilInterfaz
      data={materias}
    />
  )
}