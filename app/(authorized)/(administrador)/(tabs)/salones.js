import { View, Text, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import BloqueTab from '../salones/bloque';
import SalonTab from '../salones/salon';
import { SceneMap, TabView } from 'react-native-tab-view';
import CustomTabBar from '../../../../components/CustomTabBar';
import { Screen } from '../../../../components/Screen';

export default function Salones() {
  const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: "building", title: "Bloque" },
      { key: "classroom", title: "Salones" },
    ]);
  
    const renderScene = SceneMap({
      building: BloqueTab,
      classroom: SalonTab,
    });
  
    return (
      <Screen>
        <View className="flex-1 w-full">
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => <CustomTabBar {...props} />}
          />
        </View>
      </Screen>
    );
}