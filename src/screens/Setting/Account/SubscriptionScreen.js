import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../../components/shared/PageHeader";

const SubscriptionScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ display: "flex", marginVertical: 15, paddingHorizontal: 16, gap: 24 }}>
        <PageHeader title="Subscribtions" onPress={() => navigation.goBack()} />

        <Text style={{ fontWeight: 500 }}>redirect to website</Text>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
