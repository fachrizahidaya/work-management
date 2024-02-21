import { useEffect } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
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

const ClockAttendance = ({ attendance, onClock, location, locationOn, success, setSuccess, isLoading }) => {
  const translateX = useSharedValue(0);

  const MIN_TRANSLATE_X = 180;
  if (Platform.OS === "ios") {
    var parentWidth = 450;
  } else {
    var parentWidth = 470;
  }

  /**
   * Handle animation for slide button
   */
  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      // while slide the button
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, parentWidth - MIN_TRANSLATE_X);
      }
    },
    onEnd: (event) => {
      // when finished the slide
      if (event.translationX > 0) {
        if (translateX.value > MIN_TRANSLATE_X) {
          runOnJS(onClock)();
          runOnJS(setSuccess)(true);
        }
      }
      translateX.value = withTiming(0);
    },
  });

  const limitedTranslateX = useDerivedValue(() => Math.max(translateX.value, 0));
  const textOpacity = useDerivedValue(() => {
    const threshold = 50;
    const fadeOutRange = 100;
    return Math.max(0, 1 - (limitedTranslateX.value - threshold) / fadeOutRange);
  });

  /**
   * Handle animation for background
   */
  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      limitedTranslateX.value,
      [0, parentWidth - MIN_TRANSLATE_X],
      ["#87878721", "#186688"]
    );
    return {
      transform: [],
      backgroundColor: success || isLoading ? "#186688" : backgroundColor,
    };
  });

  /**
   * Handle animation for button
   */
  const rTaskContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      limitedTranslateX.value,
      [0, parentWidth - MIN_TRANSLATE_X],
      ["#186688", "#FFFFFF"]
    );
    return {
      transform: [
        {
          translateX: limitedTranslateX.value,
        },
      ],
      backgroundColor: success || isLoading ? "#FFFFFF" : backgroundColor,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const iconColor = interpolateColor(
      limitedTranslateX.value,
      [0, parentWidth - MIN_TRANSLATE_X],
      ["#FFFFFF", success ? "#FFFFFF" : "#186688"]
    );
    return {
      color: iconColor,
    };
  });

  /**
   * Handle animation for text color
   */
  const textContainerStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      limitedTranslateX.value,
      [0, parentWidth - MIN_TRANSLATE_X],
      ["#186688", "#FFFFFF"]
    );
    return {
      color: success ? "#FFFFFF" : textColor,
    };
  });

  useEffect(() => {
    const resetSuccess = setTimeout(() => {
      setSuccess(false);
    }, 1000);
    return () => clearTimeout(resetSuccess);
  }, [success]);

  return (
    <>
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
              padding: 20,
              backgroundColor: attendance?.late ? "#feedaf" : "#daecfc",
              borderRadius: 10,
              width: "40%",
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
              padding: 20,
              backgroundColor: attendance?.early ? "#feedaf" : "#daecfc",
              borderRadius: 10,
              width: "40%",
            }}
          >
            <Text style={{ color: attendance?.early ? "#fdc500" : "#377893" }}>Clock-out</Text>
            <Text style={{ fontWeight: "500", color: attendance?.early ? "#fdc500" : "#377893", textAlign: "center" }}>
              {attendance?.time_out ? attendance?.time_out : "-:-"}
            </Text>
          </View>
        </View>

        <Animated.View
          style={[
            {
              backgroundColor: success || isLoading ? "#186688" : "#87878721",
              borderRadius: 60,
              paddingVertical: 15,
              paddingHorizontal: 10,
              position: "relative",
              flexDirection: "row",
              alignItems: "center",
            },
            rContainerStyle,
          ]}
        >
          <PanGestureHandler onGestureEvent={panGesture}>
            <Animated.View
              style={[
                rTaskContainerStyle,
                {
                  zIndex: 3,
                  backgroundColor: success || isLoading ? "#FFFFFF" : "#186688",
                  borderRadius: 50,
                  padding: 6,
                },
              ]}
            >
              <AnimatedIcon
                name="chevron-right"
                size={50}
                color={success ? "#186688" : "#FFFFFF"}
                style={[
                  // animatedIconStyle,
                  {},
                ]}
              />
            </Animated.View>
          </PanGestureHandler>

          <View
            style={[
              {
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 30,
                zIndex: 0,
              },
            ]}
          >
            {isLoading ? <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10}}><ActivityIndicator color='#FFFFFF' /><Text style={{color:'#FFFFFF', fontSize: 16,
                  fontWeight: "500",}}>Processing</Text></View> :
            <AnimatedText
              style={[
                textContainerStyle,
                {
                  fontSize: 16,
                  fontWeight: "500",
                  color: success ? "#FFFFFF" : "#186688",
                },
              ]}
            >
              {success && !location
                ? `${!attendance?.time_out ? "Clock-in" : "Clock-out"} failed!`
                : success && !locationOn
                ? `${!attendance?.time_out ? "Clock-in" : "Clock-out"} failed!`
                : `Slide to ${!attendance?.time_in ? "Clock-in" : "Clock-out"}`}
            </AnimatedText>
            }
          </View>
        </Animated.View>
      </View>
    </>
  );
};

export default ClockAttendance;