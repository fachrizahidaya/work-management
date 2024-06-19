import { View, Text, Image } from "react-native";

import { TextProps } from "../../shared/CustomStylings";

const AttachmentSection = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        gap: 5,
      }}
    >
      <Text style={[TextProps]}>Attachment</Text>
      <View style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
        {/* <Image
          source={require("../../../assets/vectors/empty.png")}
          alt="attachment"
          style={{
            height: 150,
            width: 180,
            resizeMode: "cover",
          }}
        /> */}
        <View>
          <Text style={[{ fontSize: 12 }, TextProps]}>No Data</Text>
        </View>
      </View>
    </View>
  );
};

export default AttachmentSection;
