import React from "react";
import { useNavigation } from "@react-navigation/native";

import RenderHtml from "react-native-render-html";
import { Box, Flex, Text, VStack } from "native-base";
import { Dimensions, TouchableOpacity } from "react-native";

const NotificationItem = ({ name, modul, content, itemId, time }) => {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (modul === "Task") {
          navigation.navigate("Task Detail", { taskId: itemId });
        } else if (modul === "Project") {
          navigation.navigate("Project Detail", { projectId: itemId });
        }
      }}
    >
      <Flex flexDir="row" mb={25} style={{ gap: 12 }} alignItems="center">
        <Text style={{ width: 42 }}>{time.split(" ")[1]}</Text>

        <Box borderWidth={2} borderRadius={10} h="full" borderColor={modul === "Task" ? "#FF965D" : "#49C96D"} />

        <VStack flex={1}>
          <Text fontWeight={400}>{name}</Text>
          <Box>
            <RenderHtml
              contentWidth={width}
              source={{
                html: content,
              }}
            />
          </Box>
        </VStack>
      </Flex>
    </TouchableOpacity>
  );
};

export default NotificationItem;
