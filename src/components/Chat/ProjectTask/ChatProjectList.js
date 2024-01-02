import { View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";

import ChatProjectItem from "./ChatProjectItem";
import ChatTaskItem from "./ChatTaskItem";

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
  projectIsFetching,
  taskIsFetching,
  projectIsLoading,
  taskIsLoading,
  taskId,
  setTaskId,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA", borderRadius: 10, paddingHorizontal: 10 }}>
      {tabValue === "project" ? (
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
      )}
    </View>
  );
};

export default ChatProjectList;
