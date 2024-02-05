import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextProps } from "../../shared/CustomStylings";

const Options = ({ profile }) => {
  const navigation = useNavigation();
  const titles = [
    {
      id: 1,
      name: "Name, Phone Numbers, Email, Username",
      navigate: () =>
        navigation.navigate("Profile Screen", {
          profile: profile,
        }),
    },
    {
      id: 2,
      name: "Company",
      navigate: () =>
        navigation.navigate("Company Screen", {
          profile: profile,
        }),
    },
    // {
    //   id: 3,
    //   name: "Subscriptions",
    //   navigate: () =>
    //     navigation.navigate("Subscription Screen", {
    //       profile: profile,
    //     }),
    // },
    // {
    //   id: 4,
    //   name: "Payments",
    //   navigate: () =>
    //     navigation.navigate("Payment Screen", {
    //       profile: profile,
    //     }),
    // },
  ];

  return (
    <View style={{ backgroundColor: "#FAFAFA", borderRadius: 10 }}>
      {titles.map((title) => {
        return (
          <Pressable
            key={title.id}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 42,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}
            onPress={title.navigate}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={[{ fontWeight: 400 }, TextProps]}>{title.name}</Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={20} color="#3F434A" />
          </Pressable>
        );
      })}
    </View>
  );
};

export default Options;
