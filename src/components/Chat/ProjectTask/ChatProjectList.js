import { View, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import ChatProjectItem from "./ChatProjectItem";
import ChatTaskItem from "./ChatTaskItem";
import EmptyPlaceholder from "../../shared/EmptyPlaceholder";

const ChatProjectList = ({
  navigation,
  tabValue,
  projects,
  filteredDataArray,
  tasks,
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
  selectedProject,
  setSelectedProject,
  selectedTask,
  setSelectedTask,
  projectIsLoading,
  taskIsLoading,
  taskId,
  setTaskId,
  refetchProject,
  refetchTask,
  projectIsFetching,
  taskIsFetching,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FAFAFA",
        borderRadius: 10,
        paddingHorizontal: 16,
      }}
    >
      {tabValue === "project" ? (
        projects?.length > 0 || filteredDataArray?.length > 0 ? (
          <FlashList
            data={projects.length ? projects : filteredDataArray}
            estimatedItemSize={100}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            renderItem={({ item, index }) =>
              projectIsLoading ? (
                <ActivityIndicator />
              ) : (
                <ChatProjectItem
                  key={index}
                  navigation={navigation}
                  name={item?.title}
                  date={item?.deadline}
                  owner={item?.owner?.name}
                  image={item?.owner?.image}
                  id={item?.id}
                  selected={selectedProject}
                  setSelected={setSelectedProject}
                  nameUser={name}
                  imageUser={image}
                  email={email}
                  active_member={active_member}
                  isPinned={isPinned}
                  type={type}
                  project={item}
                  userId={userId}
                  roomId={roomId}
                  position={position}
                  setBandAttachment={setBandAttachment}
                  setBandAttachmentType={setBandAttachmentType}
                />
              )
            }
          />
        ) : (
          <ScrollView
            style={{ height: Platform.OS === "ios" ? 570 : 600 }}
            refreshControl={
              <RefreshControl
                refreshing={projectIsFetching}
                onRefresh={() => {
                  refetchProject();
                }}
              />
            }
          >
            <View style={styles.content}>
              <EmptyPlaceholder height={250} width={250} text="No Data" />
            </View>
          </ScrollView>
        )
      ) : tasks?.length > 0 || filteredDataArray?.length > 0 ? (
        <FlashList
          data={tasks.length ? tasks : filteredDataArray}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) =>
            taskIsLoading ? (
              <ActivityIndicator />
            ) : (
              <ChatTaskItem
                id={item?.id}
                key={index}
                navigation={navigation}
                name={item?.title}
                date={item?.deadline}
                owner={item?.owner?.name}
                image={item?.owner?.image}
                setBandAttachment={setBandAttachment}
                setBandAttachmentType={setBandAttachmentType}
                userId={userId}
                roomId={roomId}
                position={position}
                email={email}
                nameUser={name}
                imageUser={image}
                type={type}
                active_member={active_member}
                isPinned={isPinned}
                selected={selectedTask}
                setSelected={setSelectedTask}
                taskId={taskId}
                setTaskId={setTaskId}
                item={item}
              />
            )
          }
        />
      ) : (
        <ScrollView
          style={{ height: Platform.OS === "ios" ? 570 : 600 }}
          refreshControl={
            <RefreshControl
              refreshing={taskIsFetching}
              onRefresh={() => {
                refetchTask();
              }}
            />
          }
        >
          <View style={styles.content}>
            <EmptyPlaceholder height={250} width={250} text="No Data" />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ChatProjectList;

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
