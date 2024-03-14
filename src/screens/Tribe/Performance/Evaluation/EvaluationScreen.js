import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../../components/shared/PageHeader";
import { TextProps } from "../../../../components/shared/CustomStylings";

const EvaluationScreen = () => {
  const navigation = useNavigation();

  const options = [
    { name: "Employee KPI", navigate: "Employee KPI" },
    { name: "Employee Appraisal", navigate: "Employee Appraisal" },
    { name: "Employee Review", navigate: "Employee Review" },
    { name: "Performance Result", navigate: "Performance Result" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Evaluation" backButton={false} />
      </View>
      <View style={{ paddingHorizontal: 14 }}>
        {options.map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => navigation.navigate(item.navigate)}
              style={{
                flexDirection: "column",
                backgroundColor: "#ffffff",
                gap: 10,
                borderRadius: 10,
                paddingVertical: 16,
                paddingHorizontal: 14,
                marginVertical: 8,
                marginTop: 10,
                elevation: 1,
                // shadowColor: "rgba(0, 0, 0, 1)",
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.1,
                // shadowRadius: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[{ fontSize: 14, color: "#3F434A" }, TextProps]}>{item.name}</Text>

                <Pressable>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#3F434A" />
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default EvaluationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
});
