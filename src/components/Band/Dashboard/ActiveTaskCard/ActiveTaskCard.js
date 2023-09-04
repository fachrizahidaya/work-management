import React, { useState } from "react";

import { Button, Flex, Text } from "native-base";

import ActiveTaskList from "./ActiveTaskList";
import { card } from "../../../../styles/Card";

const ActiveTaskCard = () => {
  const [status, setStatus] = useState("Month");

  return (
    <Flex style={card.card}>
      <Flex gap={3}>
        <Text fontSize={20} fontWeight={500}>
          Active Tasks
        </Text>
        <Flex direction="row" w="100%" borderWidth={1} borderRadius={12} p={0.5} borderColor="#E8E9EB">
          <Button
            flex={1}
            rounded={"xl"}
            bgColor={status === "Month" ? "primary.600" : "#fff"}
            onPress={() => setStatus("Month")}
          >
            <Text color={status === "Month" ? "#fff" : "black"}>Month</Text>
          </Button>
          <Button
            flex={1}
            rounded={"xl"}
            bgColor={status === "Week" ? "primary.600" : "#fff"}
            onPress={() => setStatus("Week")}
          >
            <Text color={status === "Week" ? "#fff" : "black"}>Week</Text>
          </Button>
          <Button
            flex={1}
            rounded={"xl"}
            bgColor={status === "Day" ? "primary.600" : "#fff"}
            onPress={() => setStatus("Day")}
          >
            <Text color={status === "Day" ? "#fff" : "black"}>Day</Text>
          </Button>
        </Flex>
        <ActiveTaskList />
        <ActiveTaskList />
        <ActiveTaskList />
        <ActiveTaskList />
        <ActiveTaskList />
        <ActiveTaskList />
      </Flex>
    </Flex>
  );
};

export default ActiveTaskCard;
