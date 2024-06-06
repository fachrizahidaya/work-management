import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { TextProps } from "../../../components/shared/CustomStylings";
import { privacy } from "../../../components/Setting/privacy";
import PageHeader from "../../../components/shared/PageHeader";

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator>
        <View style={styles.wrapper}>
          <PageHeader backButton={true} title="Privacy and Policy" onPress={() => navigation.goBack()} />

          <Text style={[TextProps, { fontSize: 16, fontWeight: "700" }]}>{privacy.title}</Text>
          <Text style={[TextProps, { fontWeight: "600" }]}>
            Last updated {dayjs(privacy.date).format("MMM DD, YYYY")}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text style={[TextProps]}>{privacy.description}</Text>
          <View style={{ height: 20 }}></View>
          <Text style={[TextProps, { fontWeight: "700" }]}>SUMMARY OF KEY POINTS</Text>
          <Text style={[TextProps]}>{privacy.summary}</Text>
          <Text style={[TextProps, { fontWeight: "700" }]}>TABLE OF CONTENTS</Text>
          {privacy.contents.map((item, index) => {
            return (
              <View key={index} style={{ marginVertical: 3 }}>
                <Text style={[TextProps, { color: "blue" }]}>{item}</Text>
              </View>
            );
          })}
          {privacy.data.map((item, index) => {
            return (
              <View key={index} style={{ gap: 5, marginVertical: 10 }}>
                <Text style={[TextProps]}>{item.name}</Text>
                <Text style={[TextProps]}>{item.description}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 42,
    padding: 8,
  },
  wrapper: {
    gap: 15,
    marginHorizontal: 16,
    marginVertical: 13,
    flex: 1,
  },
});
