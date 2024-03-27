import { useNavigation } from "@react-navigation/native";

import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import { TextProps } from "../../components/shared/CustomStylings";
import { card } from "../../styles/Card";

const FrequentlyAskedQuestions = () => {
  const navigation = useNavigation();

  const topicArr = [
    { name: "ACCOUNT", image: null, icon: "account-outline", navigate: "FAQ Account" },
    { name: "TRIBE", image: "../../assets/icons/tribe_logo.png", icon: null, navigate: "FAQ Tribe" },
    { name: "BAND", image: "../../assets/icons/band_logo.png", icon: null, navigate: "FAQ Band" },
    { name: "COIN", image: null, icon: "bitcoin", navigate: null },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ gap: 24, display: "flex", marginHorizontal: 16, marginVertical: 13, flex: 1 }}>
        <PageHeader title="FAQs" onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, gap: 10 }}>
          {topicArr.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(item.navigate)}
                style={{
                  ...card.card,
                  elevation: 4,
                  shadowColor: "rgba(0, 0, 0, 1)",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  {item.image ? (
                    <Image
                      source={
                        item.name === "TRIBE"
                          ? require("../../assets/icons/tribe_logo.png")
                          : require("../../assets/icons/band_logo.png")
                      }
                      alt={item.image}
                      style={styles.image}
                    />
                  ) : (
                    <MaterialCommunityIcons name={item.icon} size={20} />
                  )}
                  <Text style={[TextProps]}>{item.name}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} />
              </TouchableOpacity>
            );
          })}
        </View>
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
  image: {
    height: 30,
    width: 25,
    borderRadius: 50,
    resizeMode: "contain",
  },
});
