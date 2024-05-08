import dayjs from "dayjs";
import Modal from "react-native-modal";
import { View, Text, Dimensions, Platform } from "react-native";
import Button from "../shared/Forms/Button";
import { eula } from "../Setting/eula";
import { TextProps } from "../shared/CustomStylings";
import { ScrollView } from "react-native-gesture-handler";

const EULA = ({ isOpen, toggle }) => {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => null}
      onBackButtonPress={() => null}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
    >
      <View style={{ backgroundColor: "white", padding: 10, borderRadius: 12, gap: 10 }}>
        <ScrollView style={{ height: Platform.OS === "ios" ? "80%" : "90%", padding: 10 }}>
          <Text style={[TextProps, { textAlign: "center", fontWeight: "700" }]}>{eula.title}</Text>
          <View style={{ height: 20 }}></View>
          <Text style={[TextProps, { fontWeight: "600" }]}>Last updated {dayjs(eula.date).format("MMM DD, YYYY")}</Text>
          <View style={{ height: 30 }}></View>
          <Text style={[TextProps]}>{eula.description}</Text>
          <View style={{ height: 30 }}></View>
          <Text style={[TextProps, { fontWeight: "700" }]}>TABLE OF CONTENTS</Text>
          <View style={{ height: 20 }}></View>
          {eula.contents.map((item, index) => {
            return (
              <View key={index} style={{ marginVertical: 3 }}>
                <Text style={[TextProps, { color: "blue" }]}>{item}</Text>
              </View>
            );
          })}
          <View style={{ height: 10 }}></View>
          {eula.data.map((item, index) => {
            return (
              <View key={index} style={{ gap: 5, marginVertical: 10 }}>
                <Text style={[TextProps]}>{item.name}</Text>
                <Text style={[TextProps]}>{item.description}</Text>
              </View>
            );
          })}
        </ScrollView>
        <Button onPress={toggle}>
          <Text style={{ color: "#FFFFFF" }}>Agree</Text>
        </Button>
      </View>
    </Modal>
  );
};

export default EULA;
