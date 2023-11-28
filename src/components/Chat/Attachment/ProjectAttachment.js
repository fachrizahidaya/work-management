import { useCallback, useState, useEffect } from "react";
import _ from "lodash";

import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";
import { Box, Flex, Icon, Input, Modal, Pressable, Text } from "native-base";
import { GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";

const ProjectAttachment = ({ projectListIsOpen, toggleProjectList, setBandAttachment }) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputToShow, setInputToShow] = useState("");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [projects, setProjects] = useState([]);
  const [reload, setReload] = useState(false);
  const [filteredDataArray, setFilteredDataArray] = useState([]);

  const fetchProjectParameters = {
    page: currentPage,
    search: searchInput,
    limit: 10,
  };

  const {
    data: projectList,
    isFetching: projectListIsFetching,
    refetch: refetchProjectList,
  } = useFetch("/chat/project", [currentPage, searchInput], fetchProjectParameters);

  const projectEndReachedHandler = () => {
    if (projects.length !== projects.length + projectList?.data.length) {
      setCurrentOffset(currentOffset + 10);
    }
  };

  const projectRefetchHandler = () => {
    setCurrentOffset(0);
    setReload(!reload);
  };

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

  useEffect(() => {
    if (projectList?.data.length && projectListIsFetching === false) {
      if (currentOffset === 0) {
        if (!searchInput) {
          setProjects((prevData) => [...prevData, ...projectList?.data]);
          setFilteredDataArray([]);
        } else {
          setFilteredDataArray((prevData) => [...prevData, ...projectList?.data]);
          setProjects([]);
        }
      }
    }
  }, [projectList, projectListIsFetching, reload]);

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
          <GestureHandlerRootView>
            <Box flex={1} height={300} mt={4}>
              <FlashList
                data={projects.length ? projects : filteredDataArray}
                estimatedItemSize={100}
                keyExtractor={(item, index) => index}
                onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
                onEndReached={hasBeenScrolled === true ? projectEndReachedHandler : null}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => (
                  <Flex my={1} gap={2} flexDirection="row">
                    <Flex
                      borderRadius="full"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="#f1f1f1"
                      padding={1}
                    >
                      <Icon
                        as={<MaterialCommunityIcons name="lightning-bolt" />}
                        color="#FFFFFF"
                        size={5}
                        borderRadius="full"
                      />
                    </Flex>
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
          </GestureHandlerRootView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ProjectAttachment;
