import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import PageHeader from "../../../components/shared/PageHeader";
import FAQCard from "../../../components/Setting/FAQ/FAQCard";
import { tribe } from "../../../components/Setting/FAQ/data/tribe";

const Tribe = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24, marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
        <PageHeader title="Tribe FAQs" onPress={() => navigation.goBack()} />
        <ScrollView>
          <View style={{ gap: 17 }}>
            {tribe.map((item, index) => {
              return <FAQCard key={index} question={item.question} answer={item.answer} index={index} />;
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Tribe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
