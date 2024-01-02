import { View, Text, Image } from "react-native";

const AttachmentSection = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../../../assets/vectors/empty.png")}
        alt="attachment"
        style={{
          height: 150,
          width: 180,
          resizeMode: "cover",
        }}
      />
      <View>
        <Text>No Data</Text>
      </View>
    </View>
  );
};

export default AttachmentSection;
