import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import PageHeader from "../../../components/shared/PageHeader";
import FAQCard from "../../../components/Setting/FAQ/FAQCard";
import { TextProps } from "../../../components/shared/CustomStylings";

const FAQDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { data, name, description } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24, marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
        <PageHeader title={name} onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, gap: 17 }}>
          {description && <Text style={[TextProps]}>{description}</Text>}
          <FlashList
            data={data}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            estimatedItemSize={60}
            renderItem={({ item, index }) => (
              <FAQCard key={index} question={item.question} answer={item.answer} index={index} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FAQDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
