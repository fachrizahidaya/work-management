import { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { useNavigation, useRoute } from "@react-navigation/core";

import { Flex, Icon, Pressable, Text } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../hooks/useFetch";
import OptionButton from "../../components/Chat/ProjectTask/OptionButton";
import ChatProjectList from "../../components/Chat/ProjectTask/ChatProjectList";
import SearchBox from "../../components/Chat/ProjectTask/SearchBox";

const ProjectScreen = () => {
  const [tabValue, setTabValue] = useState("project");
  const [searchInput, setSearchInput] = useState("");
  const [currentPageProject, setCurrentPageProject] = useState(1);
  const [currentPageTask, setCurrentPageTask] = useState(1);
  const [inputToShow, setInputToShow] = useState("");
  const [currentOffsetProject, setCurrentOffsetProject] = useState(0);
  const [currentOffsetTask, setCurrentOffsetTask] = useState(0);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reloadProject, setReloadProject] = useState(false);
  const [reloadTask, setReloadTask] = useState(false);
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigation = useNavigation();
  const routes = useRoute();

  const {
    bandAttachment,
    setBandAttachment,
    bandAttachmentType,
    setBandAttachmentType,
    userId,
    name,
    roomId,
    image,
    position,
    email,
    type,
    active_member,
    isPinned,
  } = routes.params;

  const fetchProjectParameters = {
    page: currentPageProject,
    search: searchInput,
    limit: 10,
  };

  const fetchTaskParameters = {
    page: currentPageProject,
    search: searchInput,
    limit: 10,
  };

  const {
    data: project,
    isFetching: projectIsFetching,
    refetch: refetchProject,
  } = useFetch("/chat/project", [currentPageProject, searchInput], fetchProjectParameters);

  const {
    data: task,
    isFetching: taskIsFetching,
    refetch: refetchTask,
  } = useFetch("/chat/task", [currentPageTask, searchInput], fetchTaskParameters);

  const projectEndReachedHandler = () => {
    if (projects.length !== projects.length + project?.data.length) {
      setCurrentOffsetProject(currentOffsetProject + 10);
    }
  };

  const taskEndReachedHandler = () => {
    if (tasks.length !== tasks.length + task?.data.length) {
      setCurrentOffsetTask(currentOffsetTask + 10);
    }
  };

  const projectRefetchHandler = () => {
    setCurrentOffsetProject(0);
    setReloadProject(!reloadProject);
  };

  const taskRefetchHandler = () => {
    setCurrentOffsetTask(0);
    setReloadTask(!reloadTask);
  };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      if (tabValue === "project") {
        setCurrentPageProject(1);
      } else {
        setCurrentPageTask(1);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (project?.data.length && projectIsFetching === false) {
      if (currentOffsetProject === 0) {
        if (!searchInput) {
          setProjects((prevData) => [...prevData, ...project?.data]);
          setFilteredDataArray([]);
        } else {
          setFilteredDataArray((prevData) => [...prevData, ...project?.data]);
          setProjects([]);
        }
      }
    }
  }, [project, projectIsFetching, reloadProject]);

  useEffect(() => {
    if (task?.data.length && taskIsFetching === false) {
      if (currentOffsetTask === 0) {
        if (!searchInput) {
          setTasks((prevData) => [...prevData, ...task?.data]);
          setFilteredDataArray([]);
        } else {
          setFilteredDataArray((prevData) => [...prevData, ...task?.data]);
          setTasks([]);
        }
      }
    }
  }, [task, taskIsFetching, reloadTask]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Flex flex={1} direction="row" alignItems="center">
          <Pressable display="flex" flexDirection="row" alignItems="center" onPress={() => navigation.goBack()}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
          <Icon as={<MateriaCommunitylIcons name="circle-slice-2" />} size="xl" color="#3F434A" />
        </Flex>
      </Flex>
      <OptionButton
        setSearchInput={setSearchInput}
        setInputToShow={setInputToShow}
        tabValue={tabValue}
        setTabValue={setTabValue}
      />
      <SearchBox
        handleSearch={handleSearch}
        inputToShow={inputToShow}
        setInputToShow={setInputToShow}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <ChatProjectList
        navigation={navigation}
        tabValue={tabValue}
        projects={projects}
        tasks={tasks}
        filteredDataArray={filteredDataArray}
        setBandAttachment={setBandAttachment}
        setBandAttachmentType={setBandAttachmentType}
        userId={userId}
        roomId={roomId}
        name={name}
        image={image}
        position={position}
        email={email}
        type={type}
        active_member={active_member}
        isPinned={isPinned}
        selected={selected}
        setSelected={setSelected}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
      {tabValue === "task" ? (
        <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
          <Pressable
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            flex={1}
            direction="row"
            alignItems="center"
            bgColor="#f5f5f5"
            borderRadius={10}
            p={2}
            opacity={!selectedTask ? 0.5 : 1}
            onPress={() => {
              setBandAttachment(selectedTask);
              setBandAttachmentType("task");
              navigation.navigate("Chat Room", {
                userId: userId,
                name: name,
                roomId: roomId,
                image: image,
                position: position,
                email: email,
                type: type,
                active_member: active_member,
                isPinned: isPinned,
              });
            }}
          >
            <Text fontSize={14} fontWeight={400} opacity={!selectedTask ? 0.5 : 1} color="primary.600">
              Import Task
            </Text>
            <Icon
              as={<MateriaCommunitylIcons name="lightning-bolt" />}
              opacity={!selectedTask ? 0.5 : 1}
              size="xl"
              color="primary.600"
            />
          </Pressable>
        </Flex>
      ) : null}
    </SafeAreaView>
  );
};

export default ProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
});
