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
} from "react-native-reanimated";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ClockAttendance = ({ attendance, onClock }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const translateX = useSharedValue(0);

  const MIN_TRANSLATE_X = 180;
  if (Platform.OS === "ios") {
    var parentWidth = 450;
  } else {
    var parentWidth = 470;
  }

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.translationX > 0 && !clockedIn) {
        translateX.value = Math.min(event.translationX, parentWidth - MIN_TRANSLATE_X);
      }
    },
    onEnd: (event) => {
      if (event.translationX > 0 && !clockedIn) {
        if (translateX.value > MIN_TRANSLATE_X) {
          runOnJS(onClock)();
          runOnJS(setClockedIn)(true);
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

  useEffect(() => {
    const resetSuccess = setTimeout(() => {
      setClockedIn(false);
    }, 2000);
    return () => clearTimeout(resetSuccess);
  }, [clockedIn]);

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

      <View
        style={{
          backgroundColor: clockedIn ? "#186688" : "#87878721",
          borderRadius: 60,
          paddingVertical: 15,
          paddingHorizontal: 10,
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={panGesture}>
          <Animated.View
            style={[
              rTaskContainerStyle,
              { zIndex: 3, backgroundColor: clockedIn ? "#FFFFFF" : "#186688", borderRadius: 50, padding: 6 },
            ]}
          >
            <MaterialCommunityIcons name="chevron-right" size={50} color={clockedIn ? "#186688" : "#FFFFFF"} />
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
          <Text style={{ fontSize: 16, fontWeight: "500", color: clockedIn ? "#FFFFFF" : "#186688" }}>
            {clockedIn
              ? `${!attendance?.time_out ? "Clock-in" : "Clock-out"} success!`
              : `Slide to ${!attendance?.time_in ? "Clock-in" : "Clock-out"}`}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default ClockAttendance;
