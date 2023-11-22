import { useState, useCallback } from "react";
import _ from "lodash";

import { TouchableOpacity } from "react-native";
import { Box, Flex, Icon, Input, Modal, Pressable, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";

const TaskAttachment = ({
  taskListIsOpen,
  toggleTaskList,
  bandAttachment,
  setBandAttachment,
  bandAttachmentType,
  setBandAttachmentType,
  onSelectBandAttachment,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputToShow, setInputToShow] = useState("");

  const fetchTaskParameters = {
    page: currentPage,
    search: searchInput,
    limit: 100,
  };

  const {
    data: taskList,
    isFetching: taskListIsFetching,
    refetch: refetchTaskList,
  } = useFetch("/chat/task", [currentPage, searchInput], fetchTaskParameters);

  const selectTaskHandler = (task) => {
    setBandAttachment(task);
    toggleTaskList();
  };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 1000),
    []
  );

  return (
    <Modal isOpen={taskListIsOpen} onClose={toggleTaskList} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Choose Task</Modal.Header>
        <Modal.Body>
          <Input
            value={inputToShow}
            placeholder="Search here..."
            InputRightElement={
              inputToShow && (
                <Pressable
                  onPress={() => {
                    setInputToShow("");
                    setSearchInput("");
                  }}
                >
                  <Icon
                    as={<MaterialCommunityIcons name="close-circle-outline" />}
                    size="md"
                    mr={2}
                    color="muted.400"
                  />
                </Pressable>
              )
            }
            onChangeText={(value) => {
              handleSearch(value);
              setInputToShow(value);
            }}
          />
          <Box flex={1} height={300} mt={4}>
            <FlashList
              data={taskList?.data}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Flex my={1} gap={2} flexDirection="row">
                  <Flex
                    rounded="full"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="#f1f1f1"
                    padding={1}
                  >
                    <Icon as={<MaterialCommunityIcons name="checkbox-marked-circle-outline" />} size={5} />
                  </Flex>
                  <TouchableOpacity onPress={() => selectTaskHandler(item)}>
                    <Text fontSize={14} fontWeight={400} color="#000000">
                      {item?.title}
                    </Text>
                    <Text fontSize={12} fontWeight={400} color="#b2b2b2">
                      #{item?.task_no}
                    </Text>
                  </TouchableOpacity>
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
