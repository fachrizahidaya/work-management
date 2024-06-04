import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../../components/shared/CustomStylings";

const AppraisalResultScreen = () => {
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
      <SafeAreaView style={{ backgroundColor: "#f8f8f8", flex: 1 }}>
        <View style={styles.header}>
          <PageHeader
            width={200}
            title="Appraisal"
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
                    flexDirection: "column",
                    gap: 10,
                  }}
                  key={index}
                >
                  <Text style={[{ fontSize: 14, fontWeight: "700" }, TextProps]}>{item?.description}</Text>
                  <View style={{ gap: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={[TextProps]}>Employee Score: </Text>
                      <Text style={[TextProps]}>{item?.score}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={[TextProps]}>Supervisor Score: </Text>
                      <Text style={[TextProps]}>{item?.supervisor_score}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AppraisalResultScreen;

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
