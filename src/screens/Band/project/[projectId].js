import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
import { SheetManager } from "react-native-actions-sheet";
import Toast from "react-native-root-toast";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View, Text, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import Tabs from "../../../components/shared/Tabs";
import ConfirmationModal from "../../../components/shared/ConfirmationModal";
import MemberSection from "../../../components/Band/Project/ProjectDetail/MemberSection";
import StatusSection from "../../../components/Band/Project/ProjectDetail/StatusSection";
import FileSection from "../../../components/Band/Project/ProjectDetail/FileSection";
import CommentInput from "../../../components/Band/shared/CommentInput/CommentInput";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import { useDisclosure } from "../../../hooks/useDisclosure";
import PageHeader from "../../../components/shared/PageHeader";
import AddMemberModal from "../../../components/Band/shared/AddMemberModal/AddMemberModal";
import axiosInstance from "../../../config/api";
import useCheckAccess from "../../../hooks/useCheckAccess";
import Description from "../../../components/Band/Project/ProjectDetail/Description";
import Button from "../../../components/shared/Forms/Button";
import { ErrorToastProps, SuccessToastProps, TextProps } from "../../../components/shared/CustomStylings";
import SuccessModal from "../../../components/shared/Modal/SuccessModal";

const ProjectDetailScreen = ({ route }) => {
  const userSelector = useSelector((state) => state.auth);
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();
  const { projectId } = route.params;
  const [tabValue, setTabValue] = useState("comments");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { isOpen: isSuccess, toggle: toggleSuccess } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle } = useDisclosure(false);
  const { isOpen: userModalIsOpen, toggle: toggleUserModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const deleteCheckAccess = useCheckAccess("delete", "Projects");
  const editCheckAccess = useCheckAccess("update", "Projects");

  const tabs = useMemo(() => {
    return [
      { title: "comments", value: "comments" },
      { title: "activity", value: "activity" },
    ];
  }, []);

  const { data: projectData, isLoading, refetch } = useFetch(`/pm/projects/${projectId}`);
  const { data: activities } = useFetch("/pm/logs/", [], { project_id: projectId });
  const { data: members, refetch: refetchMember } = useFetch(`/pm/projects/${projectId}/member`);

  const isAllowed = projectData?.data?.owner_id === userSelector.id;

  const onDelegateSuccess = async () => {
    try {
      await axiosInstance.post("/pm/projects/member", {
        project_id: projectId,
        user_id: selectedUserId,
      });
      closeUserModal();
      refetch();
      refetchMember();
    } catch (error) {
      console.log(error);
      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handles project status change
   * @param {*} status - selected status
   */
  const changeProjectStatusHandler = async (status) => {
    try {
      await axiosInstance.post(`/pm/projects/${status.toLowerCase()}`, {
        id: projectId,
      });
      refetch();
      Toast.show(`Project ${status}ed`, SuccessToastProps);
    } catch (error) {
      console.log(error);
      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
  }, []);

  const onPressUserToDelegate = (userId) => {
    toggleConfirmationModal();
    setSelectedUserId(userId);
  };

  const closeUserModal = () => {
    toggleUserModal();
    setSelectedUserId(null);
  };

  useEffect(() => {
    return () => {
      setTabValue("comments");
    };
  }, [projectId]);

  return (
    <>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          extraHeight={200}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"}
        >
          <View style={{ display: "flex", gap: 15, marginHorizontal: 16, marginVertical: 13 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <PageHeader
                title={projectData?.data?.title}
                withLoading
                isLoading={isLoading}
                width={width / 1.3}
                onPress={() => navigation.goBack()}
              />

              {isAllowed && (
                <Pressable
                  style={{ marginRight: 1 }}
                  onPress={() =>
                    SheetManager.show("form-sheet", {
                      payload: {
                        children: (
                          <View style={styles.menu}>
                            <View style={styles.wrapper}>
                              <TouchableOpacity
                                onPress={async () => {
                                  await SheetManager.hide("form-sheet");
                                  toggleUserModal();
                                }}
                                style={styles.menuItem}
                              >
                                <Text style={[TextProps, { fontSize: 16 }]}>Change Ownership</Text>
                                <MaterialCommunityIcons name="account-switch" size={20} color="#176688" />
                              </TouchableOpacity>

                              {editCheckAccess && (
                                <TouchableOpacity
                                  onPress={() => {
                                    navigation.navigate("Project Form", {
                                      projectData: projectData?.data,
                                      refetchSelectedProject: refetch,
                                    });
                                    SheetManager.hide("form-sheet");
                                  }}
                                  style={styles.menuItem}
                                >
                                  <Text style={[TextProps, { fontSize: 16 }]}>Edit</Text>
                                  <MaterialCommunityIcons name="file-edit" size={20} color="#176688" />
                                </TouchableOpacity>
                              )}
                            </View>

                            <View style={styles.wrapper}>
                              {deleteCheckAccess && (
                                <TouchableOpacity
                                  onPress={async () => {
                                    await SheetManager.hide("form-sheet");
                                    toggle();
                                  }}
                                  style={[styles.menuItem, { marginTop: 3 }]}
                                >
                                  <Text style={{ fontSize: 16, fontWeight: 700, color: "#EB0E29" }}>Delete</Text>
                                  <MaterialCommunityIcons name="trash-can-outline" color="#EB0E29" size={20} />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        ),
                      },
                    })
                  }
                >
                  <MaterialCommunityIcons name="dots-vertical" size={20} color="#3F434A" />
                </Pressable>
              )}
            </View>

            <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              <StatusSection projectData={projectData?.data} onChange={changeProjectStatusHandler} />

              <Button
                variant="outline"
                backgroundColor="#E8E9EB"
                styles={{ paddingHorizontal: 10, paddingVertical: 2 }}
                onPress={() => navigation.navigate("Project Task", { projectId: projectId, view: "Task List" })}
              >
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#3F434A" />
                  <Text style={TextProps}>Task List</Text>
                </View>
              </Button>
            </View>

            <Description description={projectData?.data?.description} />

            <FileSection projectId={projectId} isAllowed={isAllowed} />

            <MemberSection
              projectId={projectId}
              projectData={projectData?.data}
              members={members}
              refetchMember={refetchMember}
              isAllowed={isAllowed}
            />

            <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />

            {tabValue === "comments" ? (
              <CommentInput projectId={projectId} data={projectData?.data} />
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                <View style={{ flex: 1, minHeight: 2 }}>
                  <FlashList
                    data={activities?.data}
                    keyExtractor={(item) => item.id}
                    onEndReachedThreshold={0.1}
                    estimatedItemSize={191}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          if (item.modul === "Task") {
                            navigation.navigate("Task Detail", {
                              taskId: item.reference_id,
                            });
                          } else if (item.modul === "Project") {
                            navigation.navigate("Project Detail", {
                              projectId: item.reference_id,
                            });
                          }
                        }}
                      >
                        <View style={{ display: "flex", flexDirection: "row", gap: 10, marginBottom: 8 }}>
                          <AvatarPlaceholder
                            name={item.user_name}
                            image={item.user_image}
                            style={{ marginTop: 4 }}
                            size="xs"
                          />

                          <View>
                            <View style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
                              <Text style={[{ fontWeight: 500 }, TextProps]}>{item?.user_name.split(" ")[0]}</Text>
                              <Text style={TextProps}>{dayjs(item?.created_at).fromNow()}</Text>
                            </View>

                            <View>
                              <Text style={TextProps}>{item?.description}</Text>

                              <Text style={[{ width: 300 }, TextProps]} numberOfLines={2}>
                                {item.object_title}
                                <Text style={{ color: "#377893" }}> #{item.reference_no}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>

      {/* Add member modal */}
      <AddMemberModal
        header="New Project Owner"
        isOpen={userModalIsOpen}
        onClose={closeUserModal}
        multiSelect={false}
        onPressHandler={onPressUserToDelegate}
      />

      {/* Delegate project confirmation modal */}
      <ConfirmationModal
        isDelete={false}
        isOpen={confirmationModalIsOpen}
        toggle={toggleConfirmationModal}
        apiUrl={"/pm/projects/delegate"}
        body={{ id: projectId, user_id: selectedUserId }}
        header="Change Project Ownership"
        description="Are you sure to change ownership of this project?"
        successMessage="Project ownership changed"
        hasSuccessFunc
        onSuccess={onDelegateSuccess}
      />

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalIsOpen}
        toggle={toggle}
        apiUrl={`/pm/projects/${projectId}`}
        color="red.600"
        successMessage="Project deleted"
        hasSuccessFunc={true}
        onSuccess={() => navigation.navigate("Projects")}
        header="Delete Project"
        description="Are you sure to delete this project?"
        showSuccessToast={false}
        otherModal={true}
        toggleOtherModal={toggleSuccess}
      />

      <SuccessModal
        isOpen={isSuccess}
        toggle={toggleSuccess}
        title="Changes saved!"
        description="Data has successfully deleted"
        type="danger"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menu: {
    display: "flex",
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
  wrapper: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});

export default ProjectDetailScreen;
