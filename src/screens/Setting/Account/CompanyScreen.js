import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../../components/shared/PageHeader";

const CompanyScreen = () => {
  const userSelector = useSelector((state) => state.auth);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: "flex", marginVertical: 15, paddingHorizontal: 16, gap: 24 }}>
        <PageHeader title="My Company" onPress={() => navigation.goBack()} />

        <View>
          <Text style={{ fontWeight: 500 }}>
            This account is under subscription of <Text style={{ fontWeight: "bold" }}>{userSelector.company}</Text>
          </Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>Address:</Text>
          <Text style={{ fontWeight: 500 }}>
            ONE PM Buildiing Level 5, Kav M5 17-18, Boulevard Gading Serpong, Tangerang, Banten, Indonesia, 15810
          </Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>Phone:</Text>
          <Text style={{ fontWeight: 500 }}>+62 21 588 8220</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>Email:</Text>
          <Text>{userSelector.email}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CompanyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
