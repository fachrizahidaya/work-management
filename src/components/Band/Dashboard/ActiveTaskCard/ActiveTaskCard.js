import React, { memo, useState } from "react";

import { Button, Flex, Image, Modal, Skeleton, Text, VStack } from "native-base";

import ActiveTaskList from "./ActiveTaskList";
import { card } from "../../../../styles/Card";
import { useFetch } from "../../../../hooks/useFetch";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import { useDisclosure } from "../../../../hooks/useDisclosure";

const ActiveTaskCard = () => {
  const [status, setStatus] = useState("week");
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, toggle } = useDisclosure(false);
  const { isOpen: openMore, toggle: toggleMore } = useDisclosure(false);

  const { data: tasks, isLoading, refetch } = useFetch(`/pm/tasks/${status}`, [status], { limit: 10 });
  const { data: allTasks, isLoading: allTasksLoading } = useFetch(openMore && `/pm/tasks/${status}`);

  const openCloseModal = (task) => {
    setSelectedTask(task);
    toggle();
  };

  return (
    <>
      <Flex style={card.card} minH={300}>
        <Flex gap={3}>
          <Text fontSize={20} fontWeight={500}>
            Active Tasks
          </Text>
          <Flex direction="row" w="100%" borderWidth={1} borderRadius={12} p={0.5} borderColor="#E8E9EB">
            <Button
              flex={1}
              rounded={"xl"}
              bgColor={status === "month" ? "primary.600" : "#fff"}
              onPress={() => setStatus("month")}
            >
              <Text color={status === "month" ? "#fff" : "black"}>Month</Text>
            </Button>
            <Button
              flex={1}
              rounded={"xl"}
              bgColor={status === "week" ? "primary.600" : "#fff"}
              onPress={() => setStatus("week")}
            >
              <Text color={status === "week" ? "#fff" : "black"}>Week</Text>
            </Button>
            <Button
              flex={1}
              rounded={"xl"}
              bgColor={status === "day" ? "primary.600" : "#fff"}
              onPress={() => setStatus("day")}
            >
              <Text color={status === "day" ? "#fff" : "black"}>Day</Text>
            </Button>
          </Flex>
          {!isLoading ? (
            tasks?.data?.data?.length > 0 ? (
              <>
                {tasks.data.data.slice(0, 4).map((task) => (
                  <ActiveTaskList
                    key={task.id}
                    task={task}
                    title={task.title}
                    responsible={task.responsible_name}
                    status={task.status}
                    priority={task.priority}
                    onPress={openCloseModal}
                  />
                ))}
                {tasks.data.data.length > 4 && (
                  <Button variant="ghost" onPress={toggleMore}>
                    More
                  </Button>
                )}
              </>
            ) : (
              <VStack space={2} alignItems="center" justifyContent="center">
                <Image
                  source={require("../../../../assets/vectors/items.jpg")}
                  h={200}
                  w={200}
                  alt="empty"
                  resizeMode="contain"
                />
                <Text>You have no tasks.</Text>
              </VStack>
            )
          ) : (
            <VStack space={2}>
              <Skeleton h={41} />
              <Skeleton h={41} />
              <Skeleton h={41} />
              <Skeleton h={41} />
            </VStack>
          )}
        </Flex>
      </Flex>

      {isOpen && (
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
      )}

      {/* More tasks modal */}
      {openMore && (
        <Modal isOpen={openMore} onClose={toggleMore}>
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
                      key={task.id}
                      task={task}
                      title={task.title}
                      responsible={task.responsible_name}
                      status={task.status}
                      priority={task.priority}
                    />
                  );
                })
              ) : (
                <Skeleton h={41} />
              )}
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
};

export default memo(ActiveTaskCard);
