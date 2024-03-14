import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Keyboard, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

import PageHeader from "../../components/shared/PageHeader";

const FrequentlyAskedQuestions = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24, display: "flex", marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
        <PageHeader title="FAQs" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

export default FrequentlyAskedQuestions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
