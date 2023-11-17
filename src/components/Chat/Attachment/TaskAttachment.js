import React, { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { Box, Flex, Input, Modal, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";

const TaskAttachment = ({
  taskListIsOpen,
  toggleTaskList,
  bandAttachmentType,
  setBandAttachmentType,
  onSelectBandAttachment,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const { data: taskList, isFetching: taskListIsFetching, refetch: refetchTaskList } = useFetch("/chat/task");

  return (
    <Modal isOpen={taskListIsOpen} onClose={toggleTaskList} size="xl">
      <Modal.Content>
        <Modal.Header>Choose Task</Modal.Header>
        <Modal.Body>
          <Input placeholder="test" />
          <Box flex={1} height={300} mt={4}>
            <FlashList
              data={taskList?.data}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Flex>
                  <Flex>
                    <Text>{item?.title}</Text>
                    <Text>{item?.task_no}</Text>
                  </Flex>
                </Flex>
              )}
            />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default TaskAttachment;
