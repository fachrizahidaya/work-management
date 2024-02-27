import { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { useNavigation, useRoute } from "@react-navigation/core";

import { SafeAreaView, StyleSheet, View, Pressable } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import OptionButton from "../../../components/Chat/ProjectTask/OptionButton";
import ChatProjectList from "../../../components/Chat/ProjectTask/ChatProjectList";
import SearchBox from "../../../components/Chat/ProjectTask/SearchBox";

const ChatProjectTaskScreen = () => {
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
  const [isReady, setIsReady] = useState(false);

  const navigation = useNavigation();
  const routes = useRoute();

  const {
    setBandAttachment,
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
    limit: 30,
  };

  const fetchTaskParameters = {
    page: currentPageTask,
    search: searchInput,
    limit: 30,
  };

  const {
    data: project,
    isFetching: projectIsFetching,
    isLoading: projectIsLoading,
    refetch: refetchProject,
  } = useFetch(
    tabValue === "project" && "/chat/project",
    [currentPageProject, searchInput],
    fetchProjectParameters
  );

  const {
    data: task,
    isFetching: taskIsFetching,
    isLoading: taskIsLoading,
    refetch: refetchTask,
  } = useFetch(
    tabValue === "task" && "/chat/task",
    [currentPageTask, searchInput],
    fetchTaskParameters
  );

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
    }, 500),
    []
  );

  useEffect(() => {
    setFilteredDataArray([]);
  }, [searchInput]);

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

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 300);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isReady ? (
        <>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#FFFFFF",
              paddingVertical: 14,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Pressable
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
              </Pressable>
              <MateriaCommunitylIcons
                name="circle-slice-2"
                size={20}
                color="#3F434A"
              />
              <OptionButton
                setSearchInput={setSearchInput}
                setInputToShow={setInputToShow}
                tabValue={tabValue}
                setTabValue={setTabValue}
                setProjects={setProjects}
                setTasks={setTasks}
              />
            </View>
          </View>

          <SearchBox
            handleSearch={handleSearch}
            inputToShow={inputToShow}
            setInputToShow={setInputToShow}
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
            projectIsLoading={projectIsLoading}
            taskIsLoading={taskIsLoading}
            refetchProject={refetchProject}
            refetchTask={refetchTask}
            projectIsFetching={projectIsFetching}
            taskIsFetching={taskIsFetching}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default ChatProjectTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
});
