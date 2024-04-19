import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../../components/shared/CustomStylings";

const KPIResultScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();

  const { id, type } = route.params;

  if (type === "personal") {
    var { data } = useFetch(`/hr/performance-result/personal/${id}`);
  } else {
    var { data } = useFetch(`/hr/performance-result/my-team/${id}`);
  }

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title="KPI Result"
            backButton={true}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>

        <View style={styles.container}>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {data?.data?.employee_appraisal?.employee_appraisal_value.map((item, index) => {
              return (
                <View
                  style={{
                    ...card.card,
                    marginVertical: 14,
                    marginBottom: 2,
                    elevation: 1,
                    flexDirection: "column",
                    gap: 5,
                  }}
                  key={index}
                >
                  <Text style={[TextProps]}>{item?.description}</Text>
                  <Text style={[TextProps]}>{item?.choice_text}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default KPIResultScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
