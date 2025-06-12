import { View, Text, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import { Screen } from "../../../../components/Screen";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import CareerTab from "../materia/careerTab";
import SubjectTab from "../materia/subjectTab";
import CustomTabBar from "../../../../components/CustomTabBar";
import GeneralTitle from "../../../../components/GeneralTitle";

export default function Materia() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "careers", title: "Carreras" },
    { key: "subjects", title: "Materias" },
  ]);

  const renderScene = SceneMap({
    careers: CareerTab,
    subjects: SubjectTab,
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
