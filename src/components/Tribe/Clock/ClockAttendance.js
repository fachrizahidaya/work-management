import { StyleSheet, View, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ClockAttendance = ({ attendance, onClock }) => {
  const translateX = useSharedValue(0);

  const MIN_TRANSLATE_X = 180;
  const parentWidth = 460;

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, parentWidth - MIN_TRANSLATE_X);
      }
    },
    onEnd: (event) => {
      if (event.translationX > 0) {
        if (translateX.value > MIN_TRANSLATE_X) {
          runOnJS(onClock)();
        }
      }
      translateX.value = withTiming(0);
    },
  });

  const limitedTranslateX = useDerivedValue(() => Math.max(translateX.value, 0));

  const rTaskContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: limitedTranslateX.value,
        },
      ],
    };
  });

  const textOpacity = useDerivedValue(() => {
    const threshold = 50;
    const fadeOutRange = 100;
    return Math.max(0, 1 - (limitedTranslateX.value - threshold) / fadeOutRange);
  });

  const textContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={{ gap: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 1,
        }}
      >
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            backgroundColor: attendance?.late ? "#feedaf" : "#daecfc",
            borderRadius: 5,
            width: "48%",
          }}
        >
          <Text style={{ color: attendance?.late ? "#fdc500" : "#377893" }}>Clock-in</Text>
          <Text style={{ fontWeight: "500", color: attendance?.late ? "#fdc500" : "#377893", textAlign: "center" }}>
            {attendance?.time_in ? attendance?.time_in : "-:-"}
          </Text>
        </View>
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            backgroundColor: attendance?.early ? "#feedaf" : "#daecfc",
            borderRadius: 5,
            width: "48%",
          }}
        >
          <Text style={{ color: attendance?.early ? "#fdc500" : "#377893" }}>Clock-out</Text>
          <Text style={{ fontWeight: "500", color: attendance?.early ? "#fdc500" : "#377893", textAlign: "center" }}>
            {attendance?.time_out ? attendance?.time_out : "-:-"}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#E8E9EB",
          borderRadius: 60,
          paddingVertical: 5,
          paddingHorizontal: 5,
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={panGesture}>
          <Animated.View
            style={[rTaskContainerStyle, { zIndex: 3, backgroundColor: "#FFFFFF", borderRadius: 50, padding: 6 }]}
          >
            <MaterialCommunityIcons name="chevron-right" size={70} color="#3F434A" />
          </Animated.View>
        </PanGestureHandler>

        <Animated.View
          style={[
            textContainerStyle,
            {
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 30,
              zIndex: 0,
            },
          ]}
        >
          <Text style={{ fontSize: 16, opacity: 0.3 }}>Slide to {!attendance?.time_in ? "Clock-in" : "Clock-out"}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default ClockAttendance;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
});
