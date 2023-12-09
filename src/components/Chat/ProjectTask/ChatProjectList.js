import { Flex, Text } from "native-base";
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
  selected,
  setSelected,
  selectedProject,
  setSelectedProject,
  selectedTask,
  setSelectedTask,
}) => {
  return (
    <Flex borderRadius={10} mx={3} flex={1} bgColor="#fafafa">
      {tabValue === "project" ? (
        <FlashList
          data={projects.length ? projects : filteredDataArray}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => (
            <ChatProjectItem
              key={index}
              navigation={navigation}
              name={item?.title}
              date={item?.deadline}
              owner={item?.owner?.name}
              image={item?.owner?.image}
              id={item?.id}
              created_at={item?.created_at}
              description={item?.description}
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
          )}
        />
      ) : (
        <FlashList
          data={tasks.length ? tasks : filteredDataArray}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => (
            <ChatTaskItem
              key={index}
              navigation={navigation}
              name={item?.title}
              date={item?.deadline}
              owner={item?.owner?.name}
              image={item?.owner?.image}
              setBandAttachment={setBandAttachment}
              setBandAttachmentType={setBandAttachmentType}
              task={item}
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
            />
          )}
        />
      )}
    </Flex>
  );
};

export default ChatProjectList;
