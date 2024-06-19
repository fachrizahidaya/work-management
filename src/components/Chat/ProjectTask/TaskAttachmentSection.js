import { Image, Text, View } from "react-native";

import { TextProps } from "../../shared/CustomStylings";

const TaskAttachmentSection = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 16,
        gap: 5,
        borderRadius: 10,
      }}
    >
      <Text style={[TextProps]}>Attachment</Text>
      <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
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

export default TaskAttachmentSection;
