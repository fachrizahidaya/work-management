import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { View, Text, Image } from "react-native";
// import { Image, Modal, Skeleton, VStack } from "native-base";

import ActiveTaskList from "./ActiveTaskList";
import { card } from "../../../../styles/Card";
import { useFetch } from "../../../../hooks/useFetch";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";
import Button from "../../../shared/Forms/Button";

const ActiveTaskCard = () => {
  const navigation = useNavigation();
  const [status, setStatus] = useState("week");
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, toggle } = useDisclosure(false);
  const { isOpen: openMore, toggle: toggleMore, close: closeMore } = useDisclosure(false);

  const { data: tasks, isLoading, refetch } = useFetch(`/pm/tasks/${status}`, [status], { limit: 10 });
  const { data: allTasks, isLoading: allTasksLoading } = useFetch(openMore && `/pm/tasks/${status}`);

  const onPressTaskItem = (id) => {
    navigation.navigate("Task Detail", { taskId: id });
    closeMore();
  };

  const openCloseModal = useCallback((task) => {
    setSelectedTask(task);
    toggle();
  }, []);

  return (
    <>
      <View style={[card.card, { minHeight: 300 }]}>
        <View style={{ display: "flex", gap: 3 }}>
          <Text style={{ fontSize: 20, fontWeight: 500 }}>Active Tasks</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              borderRadius: 12,
              borderWidth: 1,
              padding: 0.5,
              borderColor: "#E8E9EB",
            }}
          >
            <Button
              flex={1}
              backgroundColor={status === "month" ? "#176688" : "#fff"}
              onPress={() => setStatus("month")}
            >
              <Text
                style={{
                  color: status === "month" ? "#fff" : "#3F434A",
                }}
              >
                Month
              </Text>
            </Button>
            <Button flex={1} backgroundColor={status === "week" ? "#176688" : "#fff"} onPress={() => setStatus("week")}>
              <Text
                style={{
                  color: status === "week" ? "#fff" : "#3F434A",
                }}
              >
                Week
              </Text>
            </Button>
            <Button flex={1} backgroundColor={status === "day" ? "#176688" : "#fff"} onPress={() => setStatus("day")}>
              <Text
                style={{
                  color: status === "day" ? "#fff" : "#3F434A",
                }}
              >
                Day
              </Text>
            </Button>
          </View>
          {!isLoading ? (
            tasks?.data?.data?.length > 0 ? (
              <>
                {tasks.data.data.slice(0, 4).map((task) => (
                  <ActiveTaskList
                    key={task.id}
                    id={task.id}
                    task={task}
                    title={task.title}
                    responsible={task.responsible_name}
                    status={task.status}
                    priority={task.priority}
                    onPress={openCloseModal}
                    onPressItem={onPressTaskItem}
                  />
                ))}
                {tasks.data.data.length > 4 && (
                  <Button variant="ghost" onPress={toggleMore} title="More">
                    More
                  </Button>
                )}
              </>
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/vectors/items.jpg")}
                  alt="empty"
                  style={{ height: 200, width: 200, resizeMode: "contain" }}
                />
                <Text>You have no tasks.</Text>
              </View>
            )
          ) : (
            // <VStack space={2}>
            //   <Skeleton h={41} />
            //   <Skeleton h={41} />
            //   <Skeleton h={41} />
            //   <Skeleton h={41} />
            // </VStack>
            <Text>Loading... </Text>
          )}
        </View>
      </View>

      {/* {isOpen && (
        <ConfirmationModal
          isDelete={false}
          isOpen={isOpen}
          toggle={toggle}
          apiUrl={"/pm/tasks/close"}
          body={{ id: selectedTask?.id }}
          header="Close Task"
          description={`Are you sure to close task ${selectedTask?.title}?`}
          successMessage="Task closed"
          hasSuccessFunc
          onSuccess={refetch}
        />
      )} */}

      {/* More tasks modal */}
      {/* {openMore && (
        <Modal isOpen={openMore} onClose={toggleMore} size="xl">
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>
              <Text bold>This {status} tasks</Text>
            </Modal.Header>
            <Modal.Body>
              {!allTasksLoading ? (
                allTasks?.data?.length > 0 &&
                allTasks.data.map((task) => {
                  return (
                    <ActiveTaskList
                      id={task.id}
                      key={task.id}
                      task={task}
                      title={task.title}
                      responsible={task.responsible_name}
                      status={task.status}
                      priority={task.priority}
                      onPress={openCloseModal}
                      onPressItem={onPressTaskItem}
                    />
                  );
                })
              ) : (
                <Skeleton h={41} />
              )}
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )} */}
    </>
  );
};

export default ActiveTaskCard;
