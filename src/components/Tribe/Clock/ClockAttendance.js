import dayjs from "dayjs";

import { View, Text, Platform, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  runOnJS,
  useDerivedValue,
  interpolateColor,
} from "react-native-reanimated";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
const AnimatedText = Animated.createAnimatedComponent(Text);

const ClockAttendance = ({ attendance, onClock, location, locationOn, modalIsOpen }) => {
  const translateX = useSharedValue(0);
  const screenWidth = Dimensions.get("screen");
  const minimumTranslation = Platform.OS === "ios" ? 270 : 280;
  const MIN_TRANSLATE_X = screenWidth.width - minimumTranslation;

  /**
   * Handle animation for slide button
   */
  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      // while slide the button
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, screenWidth.width - MIN_TRANSLATE_X);
      }
    },
    onEnd: (event) => {
      // when finished the slide
      if (event.translationX > 0) {
        if (translateX.value > MIN_TRANSLATE_X) {
          runOnJS(onClock)();
        }
      }
      translateX.value = withTiming(0);
    },
  });

  const limitedTranslateX = useDerivedValue(() => Math.max(translateX.value, 0));

  /**
   * Handle animation for background
   */
  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      limitedTranslateX.value,
      [0, screenWidth.width - MIN_TRANSLATE_X],
      ["#87878721", "#186688"]
    );
    return {
      transform: [],
      backgroundColor: modalIsOpen ? "#186688" : backgroundColor,
    };
  });

  /**
   * Handle animation for button
   */
  const rTaskContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      limitedTranslateX.value,
      [0, screenWidth.width - MIN_TRANSLATE_X],
      ["#186688", "#FFFFFF"]
    );
    return {
      transform: [
        {
          translateX: limitedTranslateX.value,
        },
      ],
      backgroundColor: modalIsOpen ? "#FFFFFF" : backgroundColor,
    };
  });

  /**
   * Handle animation for text color
   */
  const textContainerStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      limitedTranslateX.value,
      [0, screenWidth.width - MIN_TRANSLATE_X],
      ["#186688", "#FFFFFF"]
    );
    return {
      color: modalIsOpen ? "#FFFFFF" : textColor,
    };
  });

  return (
    <>
      <View style={{ gap: 20 }}>
        <View style={styles.container}>
          <View
            style={{
              ...styles.clockData,
              backgroundColor: attendance?.late ? "#feedaf" : "#daecfc",
            }}
          >
            <Text style={{ color: attendance?.late ? "#fdc500" : "#377893" }}>Clock-in</Text>
            <Text
              style={{
                fontWeight: "500",
                color: attendance?.late ? "#fdc500" : "#377893",
                textAlign: "center",
              }}
            >
              {attendance?.time_in ? dayjs(attendance?.time_in).format("HH:mm") || attendance?.time_in : "-:-"}
            </Text>
          </View>
          <View
            style={{
              ...styles.clockData,
              backgroundColor: attendance?.early ? "#feedaf" : "#daecfc",
            }}
          >
            <Text style={{ color: attendance?.early ? "#fdc500" : "#377893" }}>Clock-out</Text>
            <Text
              style={{
                fontWeight: "500",
                color: attendance?.early ? "#fdc500" : "#377893",
                textAlign: "center",
              }}
            >
              {attendance?.time_out ? dayjs(attendance?.time_out).format("HH:mm") || attendance?.time_out : "-:-"}
            </Text>
          </View>
        </View>

        <Animated.View
          style={[
            {
              ...styles.slideTrack,
              backgroundColor: modalIsOpen ? "#186688" : "#87878721",
            },
            rContainerStyle,
          ]}
        >
          <PanGestureHandler onGestureEvent={panGesture}>
            <Animated.View
              style={[
                rTaskContainerStyle,
                {
                  ...styles.slideArrow,
                  backgroundColor: modalIsOpen ? "#FFFFFF" : "#186688",
                },
              ]}
            >
              <AnimatedIcon name="chevron-right" size={50} color={modalIsOpen ? "#186688" : "#FFFFFF"} />
            </Animated.View>
          </PanGestureHandler>

          <View style={styles.slideWording}>
            {modalIsOpen ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <ActivityIndicator color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "500" }}>Processing</Text>
              </View>
            ) : (
              <AnimatedText
                style={[
                  textContainerStyle,
                  {
                    fontSize: 16,
                    fontWeight: "500",
                    color: !modalIsOpen ? "#FFFFFF" : "#186688",
                  },
                ]}
              >
                {(modalIsOpen && !location) || (modalIsOpen && !locationOn)
                  ? `${!attendance?.time_out ? "Clock-in" : "Clock-out"} failed!`
                  : `Slide to ${!attendance?.time_in ? "Clock-in" : "Clock-out"}`}
              </AnimatedText>
            )}
          </View>
        </Animated.View>
      </View>
    </>
  );
};

export default ClockAttendance;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 1,
  },
  clockData: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
    width: "40%",
  },
  slideArrow: {
    zIndex: 3,
    borderRadius: 50,
    padding: 6,
  },
  slideTrack: {
    borderRadius: 60,
    paddingVertical: 15,
    paddingHorizontal: 10,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  slideWording: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    zIndex: 0,
  },
});
