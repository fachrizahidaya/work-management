import React, { memo, useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import RenderHtml from "react-native-render-html";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import { useFetch } from "../../../hooks/useFetch";
import ChecklistSection from "../../../components/Band/Task/TaskDetail/ChecklistSection/ChecklistSection";
import CostSection from "../../../components/Band/Task/TaskDetail/CostSection/CostSection";
import LabelSection from "../../../components/Band/Task/TaskDetail/LabelSection/LabelSection";
import PeopleSection from "../../../components/Band/Task/TaskDetail/PeopleSection/PeopleSection";
import DeadlineSection from "../../../components/Band/Task/TaskDetail/DeadlineSection/DeadlineSection";
import ControlSection from "../../../components/Band/Task/TaskDetail/ControlSection/ControlSection";
import AttachmentSection from "../../../components/Band/Task/TaskDetail/AttachmentSection/AttachmentSection";
import CommentInput from "../../../components/Band/shared/CommentInput/CommentInput";
import PageHeader from "../../../components/shared/PageHeader";
import MenuSection from "../../../components/Band/Task/TaskDetail/MenuSection/MenuSection";
import { hyperlinkConverter } from "../../../helpers/hyperlinkConverter";
import axiosInstance from "../../../config/api";
import { useLoading } from "../../../hooks/useLoading";
import { ErrorToastProps, SuccessToastProps, TextProps } from "../../../components/shared/CustomStylings";

const TaskDetailScreen = ({ route }) => {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const { taskId } = route.params;
  const loggedUser = userSelector.id;
  const { isLoading: statusIsLoading, toggle: toggleLoading } = useLoading(false);

  const { data: selectedTask, refetch: refetchSelectedTask } = useFetch(taskId && `/pm/tasks/${taskId}`);
  const { data: observers, refetch: refetchObservers } = useFetch(taskId && `/pm/tasks/${taskId}/observer`);
  const { data: responsible, refetch: refetchResponsible } = useFetch(taskId && `/pm/tasks/${taskId}/responsible`);

  const taskUserRights = [selectedTask?.data?.project_owner_id, selectedTask?.data?.responsible_id];
  const inputIsDisabled = !taskUserRights.includes(loggedUser);

  const onOpenTaskForm = useCallback(() => {
    navigation.navigate("Task Form", { taskData: selectedTask?.data, refetch: refetchSelectedTask });
  }, []);

  /**
   * Handles take task as responsible
   */
  const takeTask = async () => {
    try {
      if (!selectedTask.data.responsible_id) {
        await axiosInstance.post("/pm/tasks/responsible", {
          task_id: selectedTask.data.id,
          user_id: loggedUser,
        });
      } else {
        // Update the responsible user if it already exists
        await axiosInstance.patch(`/pm/tasks/responsible/${responsible.data[0].id}`, {
          user_id: loggedUser,
        });
      }
      refetchResponsible();
      refetchSelectedTask();
      Toast.show("Task assigned", SuccessToastProps);
    } catch (error) {
      console.log(error);
      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };

  /**
   * Handles change task status
   */
  const changeTaskStatus = async (status) => {
    try {
      toggleLoading();
      await axiosInstance.post(`/pm/tasks/${status}`, {
        id: selectedTask.data.id,
      });

      toggleLoading();
      refetchSelectedTask();

      Toast.show(`Task ${status}ed`, SuccessToastProps);
    } catch (error) {
      console.log(error);
      toggleLoading();

      Toast.show(error.response.data.message, ErrorToastProps);
    }
  };

  const baseStyles = useMemo(
    () => ({
      color: "#3F434A",
    }),
    []
  );

  const { routes } = navigation.getState();

  const onPressBackButton = () => {
    const previousScreenIndex = routes.length - 2;
    const screenToRedirect = routes.length - 3;
    if (routes[previousScreenIndex].name === "Task Form") {
      // If previous screen is task form, redirect to the screen before task form
      navigation.navigate(`${routes[screenToRedirect].name}`);
    } else {
      // If previous screen is not task form, go back to previous screen
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={200}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        <View
          style={{
            backgroundColor: "white",
            display: "flex",
            gap: 20,
            marginTop: 13,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ display: "flex", gap: 20 }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <PageHeader
                title={selectedTask?.data?.title}
                subTitle={selectedTask?.data?.task_no}
                onPress={onPressBackButton}
                width={width - 100}
              />

              {!inputIsDisabled && (
                <MenuSection
                  selectedTask={selectedTask?.data}
                  onTakeTask={takeTask}
                  openEditForm={onOpenTaskForm}
                  disabled={inputIsDisabled}
                />
              )}
            </View>

            <ControlSection
              taskStatus={selectedTask?.data?.status}
              selectedTask={selectedTask?.data}
              onChangeStatus={changeTaskStatus}
              isLoading={statusIsLoading}
            />
          </View>

          {/* Reponsible, Creator and Observer section */}
          <PeopleSection
            observers={observers?.data}
            responsibleArr={responsible?.data}
            ownerId={selectedTask?.data?.owner_id}
            ownerImage={selectedTask?.data?.owner_image}
            ownerName={selectedTask?.data?.owner_name}
            ownerEmail={selectedTask?.data?.owner_email}
            refetchObservers={refetchObservers}
            refetchTask={refetchSelectedTask}
            disabled={inputIsDisabled}
            selectedTask={selectedTask?.data}
            refetchResponsible={refetchResponsible}
          />

          {/* Labels */}
          <LabelSection projectId={selectedTask?.data?.project_id} taskId={taskId} disabled={inputIsDisabled} />

          {/* Due date and cost */}
          <View style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
            <DeadlineSection
              deadline={selectedTask?.data?.deadline}
              projectDeadline={selectedTask?.data?.project_deadline}
              disabled={inputIsDisabled}
              taskId={taskId}
            />

            <CostSection taskId={taskId} disabled={inputIsDisabled} />
          </View>

          {/* Description */}
          <View style={{ display: "flex", gap: 10 }}>
            <Text style={[{ fontWeight: 500 }, TextProps]}>DESCRIPTION</Text>

            <RenderHtml
              contentWidth={width}
              baseStyle={baseStyles}
              source={{
                html: hyperlinkConverter(selectedTask?.data?.description) || "",
              }}
            />
          </View>

          {/* Checklists */}
          <ChecklistSection taskId={taskId} disabled={inputIsDisabled} />

          {/* Attachments */}
          <AttachmentSection taskId={taskId} disabled={inputIsDisabled} />

          {/* Comments */}
          <View style={{ display: "flex", gap: 10 }}>
            <Text style={[{ fontWeight: 500 }, TextProps]}>COMMENTS</Text>
            <CommentInput taskId={taskId} data={selectedTask?.data} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default memo(TaskDetailScreen);
