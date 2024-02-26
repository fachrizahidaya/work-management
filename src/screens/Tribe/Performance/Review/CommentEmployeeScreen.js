import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useFetch } from "../../../../hooks/useFetch";
import PageHeader from "../../../../components/shared/PageHeader";
import { card } from "../../../../styles/Card";
import { TextProps } from "../../../../components/shared/CustomStylings";

const CommentEmployeeScreen = () => {
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
            title="Comment "
            backButton={true}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>

        <View style={styles.container}>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {data?.data?.comment?.employee_review_comment_value.map(
              (item, index) => {
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
                    <Text
                      style={[{ fontSize: 14, fontWeight: "700" }, TextProps]}
                    >
                      {item?.performance_review_comment?.description}
                    </Text>
                    <Text style={[TextProps]}>{item?.comment}</Text>
                  </View>
                );
              }
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CommentEmployeeScreen;

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
