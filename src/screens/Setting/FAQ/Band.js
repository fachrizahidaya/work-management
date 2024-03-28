import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";

import PageHeader from "../../../components/shared/PageHeader";
import FAQCard from "../../../components/Setting/FAQ/FAQCard";
import { band } from "../../../components/Setting/FAQ/data/band";

const Band = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24, display: "flex", marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
        <PageHeader title="Tribe FAQs" onPress={() => navigation.goBack()} />
        <View style={{ display: "flex", gap: 17 }}>
          {band.map((item, index) => {
            return <FAQCard question={item.question} answer={item.answer} index={index} />;
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Band;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
