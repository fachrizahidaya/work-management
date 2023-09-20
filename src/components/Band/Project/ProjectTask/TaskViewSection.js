import React from "react";

import { Button, Flex, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TaskViewSection = ({ changeView, view }) => {
  return (
    <Flex flexDir="row" style={{ gap: 8 }}>
      <Button
        flex={1}
        variant="outline"
        borderColor={view === "Task List" ? "primary.600" : "#E8E9EB"}
        onPress={() => changeView("Task List")}
      >
        <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
          <Icon
            as={<MaterialCommunityIcons name="format-list-bulleted" />}
            color={view === "Task List" ? "primary.600" : "#3F434A"}
            size="md"
          />
          <Text color={view === "Task List" ? "primary.600" : "#3F434A"}>Task List</Text>
        </Flex>
      </Button>
      <Button
        flex={1}
        variant="outline"
        borderColor={view === "Kanban" ? "primary.600" : "#E8E9EB"}
        onPress={() => changeView("Kanban")}
      >
        <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
          <Icon
            as={<MaterialCommunityIcons name="map-outline" />}
            color={view === "Kanban" ? "primary.600" : "#3F434A"}
            size="md"
          />
          <Text color={view === "Kanban" ? "primary.600" : "#3F434A"}>Kanban</Text>
        </Flex>
      </Button>
      <Button
        flex={1}
        variant="outline"
        borderColor={view === "Gantt Chart" ? "primary.600" : "#E8E9EB"}
        onPress={() => changeView("Gantt Chart")}
      >
        <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
          <Icon
            as={<MaterialCommunityIcons name="chart-gantt" />}
            color={view === "Gantt Chart" ? "primary.600" : "#3F434A"}
            size="md"
          />
          <Text color={view === "Gantt Chart" ? "primary.600" : "#3F434A"}>Gantt Chart</Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default TaskViewSection;
