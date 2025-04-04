import { View, Text } from 'react-native'
import React from 'react'

export default function GeneralTitle({label, type = 'primary', className = '', ...props}) {
    const typeStyles = {
        'primary': 'font-bold text-3xl mt-20 text-text-light-primary dark:text-text-dark-primary text-left',
        'secondary': 'text-right text-blue-500 font-semibold text-lg',
    };

    const combinedClassName = `${typeStyles[type]} ${className}`;

    return (
      <Text className={combinedClassName} {...props}>
        {label}
      </Text>
    );
}