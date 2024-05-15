import { Pressable, View, Text, StyleSheet } from "react-native";
import Animated, { withTiming } from "react-native-reanimated";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
const AnimatedText = Animated.createAnimatedComponent(Text);

const ContactSlideAction = ({ translateX, onTogglePin, type, id, isPinned, onClickMore, chat }) => {
  return (
    <View style={styles.backgroundAction}>
      <Pressable
        onPress={() => {
          translateX.value = withTiming(0);
          onTogglePin(type, id, isPinned?.pin_chat ? "unpin" : "pin");
        }}
        style={{
          alignItems: "center",
          paddingLeft: isPinned?.pin_chat ? 5 : 10,
        }}
      >
        <AnimatedIcon name="pin" color="#ffffff" size={20} />
        <AnimatedText
          style={{
            color: "#FFFFFF",
          }}
        >
          {isPinned?.pin_chat ? "Unpin" : "Pin"}
        </AnimatedText>
      </Pressable>

      <Pressable
        onPress={() => {
          translateX.value = withTiming(0);
          onClickMore(chat);
        }}
        style={{ alignItems: "center", paddingRight: 5 }}
      >
        <AnimatedIcon name="dots-horizontal" color="#ffffff" size={20} />
        <AnimatedText style={{ color: "#ffffff" }}>More</AnimatedText>
      </Pressable>
    </View>
  );
};

export default ContactSlideAction;

const styles = StyleSheet.create({
  backgroundAction: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
