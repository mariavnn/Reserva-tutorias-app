import { View } from 'react-native'
import React, { useState } from 'react'
import BloqueTab from '../salones/bloque';
import SalonTab from '../salones/salon';
import { Screen } from '../../../../components/Screen';

export default function Salones() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [refreshBlocks, setRefreshBlocks] = useState(0);

  const handleSelectBlock = (block) => {
    setSelectedBlock(block);
  };

  const handleBackToBlocks = () => {
    setSelectedBlock(null);
  };

  const handleRefreshBlocks = () => {
    setRefreshBlocks(prev => prev + 1);
  };

  return (
    <Screen>
      <View className="flex-1 w-full">
        {selectedBlock ? (
          <SalonTab 
            selectedBlock={selectedBlock}
            onBackToBlocks={handleBackToBlocks}
            onRefreshBlocks={handleRefreshBlocks}
          />
        ) : (
          <BloqueTab 
            onSelectBlock={handleSelectBlock}
            refreshTrigger={refreshBlocks}
          />
        )}
      </View>
    </Screen>
  );
}