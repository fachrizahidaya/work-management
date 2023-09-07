import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import { SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Box, Button, Flex, Icon, IconButton, Input, Menu, Pressable, Skeleton, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import Tabs from "../../../components/shared/Tabs";
import NewProjectSlider from "../../../components/Band/Project/NewProjectSlider/NewProjectSlider";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import MemberSection from "../../../components/Band/Project/ProjectDetail/MemberSection";
import StatusSection from "../../../components/Band/Project/ProjectDetail/StatusSection";
import FileSection from "../../../components/Band/Project/ProjectDetail/FileSection";

const ProjectDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { projectId } = route.params;
  const [projectData, setProjectData] = useState({});
  const [tabValue, setTabValue] = useState("comments");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const tabs = [{ title: "comments" }, { title: "activity" }];

  const onChangeTab = (value) => {
    setTabValue(value);
  };

  const openEditFormHandler = () => {
    setOpenEditForm(true);
  };

  const { data, isLoading, refetch } = useFetch(`/pm/projects/${projectId}`);
  const { data: comments } = useFetch(`/pm/projects/${projectId}/comment`);
  const { data: activities } = useFetch("/pm/logs/", [], { project_id: projectId });

  useEffect(() => {
    setProjectData(data?.data);
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 16, marginVertical: 13 }}>
        <Flex gap={15}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
              <Pressable onPress={() => navigation.navigate("Project List")}>
                <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
              </Pressable>

              {!isLoading ? <Text fontSize={16}>{projectData?.title}</Text> : <Skeleton h={8} w={200} />}
            </Flex>

            <Menu
              w="190"
              trigger={(triggerProps) => {
                return (
                  <IconButton
                    {...triggerProps}
                    size="md"
                    borderRadius="full"
                    icon={<Icon as={<MaterialCommunityIcons name="dots-vertical" />} color="black" />}
                  />
                );
              }}
            >
              <Menu.Item onPress={openEditFormHandler}>Edit</Menu.Item>
              <Menu.Item onPress={() => setDeleteModalIsOpen(true)}>Delete</Menu.Item>
            </Menu>

            {/* Delete confirmation modal */}
            <ConfirmationModal
              isOpen={deleteModalIsOpen}
              setIsOpen={setDeleteModalIsOpen}
              apiUrl={`/pm/projects/${projectId}`}
              color="red.600"
              successMessage={`${projectData?.title} deleted`}
              hasSuccessFunc={true}
              onSuccess={() => navigation.navigate("Project List")}
              header="Delete Project"
              description="Are you sure to delete this project?"
            />
          </Flex>

          <StatusSection projectId={projectId} projectData={projectData} refetch={refetch} />

          <Box>
            <Text>{projectData?.description}</Text>
          </Box>

          <Flex flexDir="row" style={{ gap: 8 }}>
            <Button
              flex={1}
              variant="outline"
              onPress={() => navigation.navigate("Project Task", { projectId: projectId })}
            >
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="format-list-bulleted" />} color="#3F434A" size="md" />
                <Text>Task List</Text>
              </Flex>
            </Button>
            <Button flex={1} variant="outline">
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="map-outline" />} color="#3F434A" size="md" />
                <Text>Kanban</Text>
              </Flex>
            </Button>
            <Button flex={1} variant="outline">
              <Flex flexDir="row" alignItems="center" style={{ gap: 6 }}>
                <Icon as={<MaterialCommunityIcons name="chart-gantt" />} color="#3F434A" size="md" />
                <Text>Gantt Chart</Text>
              </Flex>
            </Button>
          </Flex>

          <FileSection projectId={projectId} projectData={projectData} />

          <MemberSection projectId={projectId} projectData={projectData} />

          <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

          {tabValue === "comments" ? (
            <Flex gap={5}>
              <Box borderWidth={1} borderRadius={10} borderColor="gray.300" p={2}>
                <Input variant="unstyled" placeholder="Add comment..." multiline h={20} />

                <Flex flexDir="row" justifyContent="space-between" alignItems="center">
                  <Button>Comment</Button>

                  <Flex flexDir="row" alignItems="center" gap={1}>
                    <IconButton
                      size="sm"
                      borderRadius="full"
                      icon={
                        <Icon
                          as={<MaterialCommunityIcons name="attachment" />}
                          color="gray.500"
                          size="lg"
                          style={{ transform: [{ rotate: "-35deg" }] }}
                        />
                      }
                    />
                  </Flex>
                </Flex>
              </Box>

              {/* Comment list */}
              <ScrollView style={{ maxHeight: 400 }}>
                <Box flex={1} minHeight={2}>
                  <FlashList
                    data={comments?.data}
                    keyExtractor={(item) => item.id}
                    onEndReachedThreshold={0.1}
                    estimatedItemSize={200}
                    renderItem={({ item }) => (
                      <Flex flexDir="row" alignItems="center" gap={1.5} mb={2}>
                        <Avatar
                          size="xs"
                          source={{
                            uri: `https://dev.kolabora-app.com/api-dev/image/${item?.comment_image}/thumb`,
                          }}
                        />

                        <Box>
                          <Flex flexDir="row" gap={1} alignItems="center">
                            <Text>{item?.comment_name}</Text>
                            <Text color="#8A9099">{dayjs(item?.comment_time).fromNow()}</Text>
                          </Flex>

                          <Text>{item?.comments}</Text>
                        </Box>
                      </Flex>
                    )}
                  />
                </Box>
              </ScrollView>
            </Flex>
          ) : (
            <ScrollView style={{ maxHeight: 400 }}>
              <Box flex={1} minHeight={2}>
                <FlashList
                  data={activities?.data}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.1}
                  estimatedItemSize={200}
                  renderItem={({ item }) => (
                    <Flex flexDir="row" alignItems="center" gap={1.5} mb={2}>
                      <Avatar
                        size="xs"
                        source={{
                          uri: `https://dev.kolabora-app.com/api-dev/image/${item?.user_image}/thumb`,
                        }}
                      />

                      <Box>
                        <Flex flexDir="row" gap={1} alignItems="center">
                          <Text>{item?.user_name}</Text>
                          <Text color="#8A9099">{dayjs(item?.created_date + item?.create_time).fromNow()}</Text>
                        </Flex>

                        <Flex alignItems="center" gap={1} flexDir="row">
                          <Text>{item?.description}</Text>
                          <Text color="#377893">#{item?.id}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  )}
                />
              </Box>
            </ScrollView>
          )}
        </Flex>
      </ScrollView>

      <NewProjectSlider isOpen={openEditForm} setIsOpen={setOpenEditForm} projectData={projectData} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ProjectDetailScreen;
