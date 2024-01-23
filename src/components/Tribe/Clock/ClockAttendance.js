import { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";
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

const ClockAttendance = ({ attendance, onClock, location }) => {
  const [success, setSuccess] = useState(false);
  const translateX = useSharedValue(0);

  const MIN_TRANSLATE_X = 180;
  if (Platform.OS === "ios") {
    var parentWidth = 450;
  } else {
    var parentWidth = 470;
  }

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
          runOnJS(setSuccess)(true);
        }
      }
      translateX.value = withTiming(0);
    },
  });

  const limitedTranslateX = useDerivedValue(() => Math.max(translateX.value, 0));

  const rContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      limitedTranslateX.value,
      [0, parentWidth - MIN_TRANSLATE_X],
      ["#87878721", "#186688"]
    );

    return {
      transform: [],
      backgroundColor: success ? "#186688" : backgroundColor,
    };
  });

  const rTaskContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      limitedTranslateX.value,
      [0, parentWidth - MIN_TRANSLATE_X],
      ["#186688", "#FFFFFF"]
    );
    const iconTintColor = interpolateColor(
      limitedTranslateX.value,
      [0, parentWidth - MIN_TRANSLATE_X],
      ["#186688", success ? "#FFFFFF" : "#186688"]
    );

    return {
      transform: [
        {
          translateX: limitedTranslateX.value,
        },
      ],
      backgroundColor: success ? "#FFFFFF" : backgroundColor,
      tintColor: iconTintColor,
    };
  });

  const textOpacity = useDerivedValue(() => {
    const threshold = 50;
    const fadeOutRange = 100;
    return Math.max(0, 1 - (limitedTranslateX.value - threshold) / fadeOutRange);
  });

  const textContainerStyle = useAnimatedStyle(() => {
    const textColor = success ? "#FFFFFF" : "#186688";

    return {
      opacity: textOpacity.value,
      color: textColor,
    };
  });

  useEffect(() => {
    const resetSuccess = setTimeout(() => {
      setSuccess(false);
    }, 1000);
    return () => clearTimeout(resetSuccess);
  }, [success]);

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
            backgroundColor: success ? "#186688" : "#87878721",
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
                backgroundColor: success ? "#FFFFFF" : "#186688",
                borderRadius: 50,
                padding: 6,
              },
            ]}
          >
            <MaterialCommunityIcons name="chevron-right" size={50} color={success ? "#186688" : "#FFFFFF"} />
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
          <Text style={{ fontSize: 16, fontWeight: "500", color: success ? "#FFFFFF" : "#186688" }}>
            {success && location
              ? `${!attendance?.time_out ? "Clock-in" : "Clock-out"} success!`
              : success && !location
              ? `${!attendance?.time_out ? "Clock-in" : "Clock-out"} failed!`
              : `Slide to ${!attendance?.time_in ? "Clock-in" : "Clock-out"}`}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default ClockAttendance;
