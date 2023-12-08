import { Flex, Text, Pressable } from "native-base";
import React, { useRef } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const Tab = ({ tab, value, onChange, isValue, flexDir, gap }) => {
  const animatedValue = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    borderBottomWidth: value === tab.title ? withTiming(2) : withTiming(0),
  }));

  return (
    <Pressable onPress={() => onChange(tab.title)}>
      <Animated.View style={[animatedStyles]}>
        <Flex flexDirection={flexDir ? flexDir : null} alignItems="center" px={2} pb={3} gap={gap ? gap : null}>
          <Text textTransform="uppercase">{tab.title}</Text>
          {isValue ? <Text>{tab.number}</Text> : null}
        </Flex>
      </Animated.View>
    </Pressable>
  );
};

const Tabs = ({ tabs = [], value, onChange, justifyContent, flexDir, gap }) => {
  return (
    <Flex
      flexDir="row"
      justifyContent={justifyContent ? justifyContent : null}
      gap={10}
      borderBottomWidth={1}
      borderColor="#E8E9EB"
    >
      {tabs.length > 0 &&
        tabs.map((tab, idx) => (
          <Tab key={idx} tab={tab} value={value} onChange={onChange} flexDir={flexDir} gap={gap} />
        ))}
    </Flex>
  );
};

export default Tabs;
