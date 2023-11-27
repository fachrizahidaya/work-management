import { useCallback, useState } from "react";
import _ from "lodash";

import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";
import { Box, Flex, Icon, Input, Modal, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";

const ProjectAttachment = ({ projectListIsOpen, toggleProjectList, setBandAttachment }) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputToShow, setInputToShow] = useState("");

  const fetchProjectParameters = {
    page: currentPage,
    search: searchInput,
    limit: 100,
  };

  const {
    data: projectList,
    isFetching: projectListIsFetching,
    refetch: refetchProjectList,
  } = useFetch("/chat/project", [currentPage, searchInput], fetchProjectParameters);

  const selectProjectHandler = (project) => {
    setBandAttachment(project);
    toggleProjectList();
  };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  return (
    <Modal isOpen={projectListIsOpen} onClose={toggleProjectList} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Choose Project</Modal.Header>
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
              data={projectList?.data}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Flex my={1} gap={2} flexDirection="row">
                  <Pressable
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="#bdbdbd"
                    padding={1}
                  >
                    <Icon as={<MaterialCommunityIcons name="lightning-bolt" />} color="#FFFFFF" size={5} />
                  </Pressable>
                  <TouchableOpacity onPress={() => selectProjectHandler(item)}>
                    <Text fontSize={14} fontWeight={400} color="#000000">
                      {item?.title}
                    </Text>
                    <Text fontSize={12} fontWeight={400} color="#b2b2b2">
                      #{item?.project_no}
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

export default ProjectAttachment;
