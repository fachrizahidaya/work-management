import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../../components/shared/PageHeader";
import { TextProps } from "../../../components/shared/CustomStylings";

const CompanyScreen = () => {
  const userSelector = useSelector((state) => state.auth);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: "flex", marginVertical: 15, paddingHorizontal: 16, gap: 24 }}>
        <PageHeader title="My Company" onPress={() => navigation.goBack()} />

        <View>
          <Text style={TextProps}>
            This account is under subscription of{" "}
            <Text style={[{ fontWeight: "bold" }, TextProps]}>{userSelector.company}</Text>
          </Text>
        </View>
        <View>
          <Text style={[{ fontWeight: "bold" }, TextProps]}>Address:</Text>
          <Text style={TextProps}>
            l. Raya Pajajaran No.14 No 62, RT.002/RW.005, Gandasari, Kec. Jatiuwung, Kabupaten Tangerang, Banten 15137
          </Text>
        </View>
        <View>
          <Text style={[{ fontWeight: "bold" }, TextProps]}>Phone:</Text>
          <Text style={TextProps}>+62 21 588 8220</Text>
        </View>
        <View>
          <Text style={[{ fontWeight: "bold" }, TextProps]}>Email:</Text>
          <Text style={TextProps}>{userSelector.email}</Text>
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
