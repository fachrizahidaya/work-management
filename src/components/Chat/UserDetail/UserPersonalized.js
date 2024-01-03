import { View, Text } from "react-native";

const UserPersonalized = () => {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 5,
      }}
    >
      <View>
        <Text style={{ fontSize: 14, fontWeight: "400" }}>Search message</Text>
      </View>

      <View>
        <Text style={{ fontSize: 14, fontWeight: "400" }}>Mute notifications</Text>
      </View>
    </View>
  );
};

export default UserPersonalized;
