import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, Platform, SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Button, Flex, Icon, Menu, Pressable, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import Tabs from "../../../components/shared/Tabs";
import ProjectForm from "../../../components/Band/Project/NewProjectSlider/NewProjectSlider";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import MemberSection from "../../../components/Band/Project/ProjectDetail/MemberSection";
import StatusSection from "../../../components/Band/Project/ProjectDetail/StatusSection";
import FileSection from "../../../components/Band/Project/ProjectDetail/FileSection";
import CommentInput from "../../../components/Band/shared/CommentInput/CommentInput";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PageHeader from "../../../components/shared/PageHeader";

const ProjectDetailScreen = ({ route }) => {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();
  const { projectId } = route.params;
  const [projectData, setProjectData] = useState({});
  const [tabValue, setTabValue] = useState("comments");
  const [openEditForm, setOpenEditForm] = useState(false);
  const { isOpen: deleteModalIsOpen, toggle } = useDisclosure(false);

  const tabs = useMemo(() => {
    return [{ title: "comments" }, { title: "activity" }];
  }, []);

  const { data, isLoading, refetch } = useFetch(`/pm/projects/${projectId}`);
  const { data: activities } = useFetch("/pm/logs/", [], { project_id: projectId });

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  const openEditFormHandler = () => {
    setOpenEditForm(true);
  };

  const onCloseEditForm = () => {
    setOpenEditForm(false);
  };

  useEffect(() => {
    setProjectData(data?.data);
  }, [data]);

  useEffect(() => {
    return () => {
      setTabValue("comments");
    };
  }, [projectId]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={200}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        <Flex gap={15} marginHorizontal={16} marginVertical={13}>
          <Flex flexDir="row" alignItems="center" justifyContent="space-between">
            <PageHeader
              title={projectData?.title}
              withLoading
              isLoading={isLoading}
              width={width / 1.3}
              onPress={() => navigation.navigate("Project List")}
            />

            <Menu
              trigger={(triggerProps) => {
                return (
                  <Pressable {...triggerProps} mr={1}>
                    <Icon as={<MaterialCommunityIcons name="dots-vertical" />} color="black" size="md" />
                  </Pressable>
                );
              }}
            >
              <Menu.Item onPress={openEditFormHandler}>Edit</Menu.Item>
              <Menu.Item onPress={toggle}>
                <Text color="red.600">Delete</Text>
              </Menu.Item>
            </Menu>

            {/* Delete confirmation modal */}
            {deleteModalIsOpen && (
              <ConfirmationModal
                isOpen={deleteModalIsOpen}
                toggle={toggle}
                apiUrl={`/pm/projects/${projectId}`}
                color="red.600"
                successMessage={`${projectData?.title} deleted`}
                hasSuccessFunc={true}
                onSuccess={() => navigation.navigate("Project List")}
                header="Delete Project"
                description="Are you sure to delete this project?"
              />
            )}
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
            <CommentInput projectId={projectId} />
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
                      <AvatarPlaceholder name={item.user_name} image={item.user_image} />

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
      </KeyboardAwareScrollView>

      {openEditForm && (
        <ProjectForm
          isOpen={openEditForm}
          projectData={projectData}
          refetchSelectedProject={refetch}
          onClose={onCloseEditForm}
        />
      )}
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
