import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import PageHeader from "../../../components/shared/PageHeader";
import { account } from "../../../components/Setting/FAQ/data/account";
import FAQCard from "../../../components/Setting/FAQ/FAQCard";

const Account = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24, marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
        <PageHeader title="Account FAQs" onPress={() => navigation.goBack()} />
        <ScrollView>
          <View style={{ gap: 17 }}>
            {account.map((item, index) => {
              return <FAQCard key={index} question={item.question} answer={item.answer} index={index} />;
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
