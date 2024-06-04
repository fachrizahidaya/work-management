import { useNavigation } from "@react-navigation/native";

import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { card } from "../../../styles/Card";
import { TextProps } from "../../../components/shared/CustomStylings";

const PurchaseScreen = () => {
  const navigation = useNavigation();
  const purchaseOptions = [
    {
      name: "Purchase Order",
      navigate: "Purchase Order",
    },
    {
      name: "Receipt Purchase Order",
      navigate: "Receipt Purchase Order",
    },
    {
      name: "Supplier",
      navigate: "Supplier",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Purchase" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ paddingHorizontal: 14 }}>
        {purchaseOptions.map((item, index) => {
          return (
            <Pressable
              key={index}
              style={[
                card.card,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 16,
                  paddingHorizontal: 14,
                  marginVertical: 4,
                },
              ]}
              onPress={() => navigation.navigate(item.navigate)}
            >
              <Text style={[TextProps]}>{item.name}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#3F434A" />
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default PurchaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
});
