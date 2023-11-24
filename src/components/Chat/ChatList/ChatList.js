import { useCallback, useState, memo } from "react";
import dayjs from "dayjs";

import { FlashList } from "@shopify/flash-list";
import { Flex, Spinner } from "native-base";

import ChatBubble from "../ChatBubble/ChatBubble";
import ChatMessageTimeStamp from "../ChatMessageTimeStamp/ChatMessageTimeStamp";
import ImageAttachment from "../Attachment/ImageAttachment";
import FileAttachment from "../Attachment/FileAttachment";
import ProjectTaskAttachmentPreview from "../Attachment/ProjectTaskAttachmentPreview";

const ChatList = ({
  type,
  chatList,
  fetchChatMessageHandler,
  isLoading,
  openChatBubbleHandler,
  toggleFullScreen,
  fileAttachment,
  setFileAttachment,
  bandAttachment,
  bandAttachmentType,
  setBandAttachment,
}) => {
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);

  /**
   * Decide when user avatar should be rendered at
   */
  const userImageRenderCheck = useCallback(
    (currentMessage, nextMessage) => {
      const currentMessageDate = dayjs(currentMessage?.created_at).format("YYYY-MM-DD");
      const nextMessageDate = dayjs(nextMessage?.created_at).format("YYYY-MM-DD");

      if (nextMessage) {
        if (currentMessage?.from_user_id !== nextMessage?.from_user_id) {
          return currentMessage?.user?.image;
        } else {
          if (dayjs(currentMessageDate).isBefore(dayjs(nextMessageDate))) {
            return currentMessage?.user?.image;
          }
          return;
        }
      } else {
        return currentMessage?.user?.image;
      }
    },
    [chatList]
  );

  /**
   * Decide when username should be rendered at
   */
  const userNameRenderCheck = useCallback(
    (prevMessage, currentMessage) => {
      const prevMessageDate = dayjs(prevMessage?.created_at).format("YYYY-MM-DD");
      const currentMessageDate = dayjs(currentMessage?.created_at).format("YYYY-MM-DD");

      if (prevMessage) {
        if (prevMessage?.from_user_id !== currentMessage?.from_user_id) {
          return currentMessage?.user?.name;
        } else {
          if (dayjs(prevMessageDate).isBefore(dayjs(currentMessageDate))) {
            return currentMessage?.user?.name;
          }
          return;
        }
      } else {
        return currentMessage?.user?.name;
      }
    },
    [chatList]
  );

  /**
   * Decide when messages should be grouped closer together or not
   */
  const messageIsGrouped = useCallback(
    (currentMessage, nextMessage) => {
      const currentMessageDate = dayjs(currentMessage?.created_at).format("YYYY-MM-DD");
      const nextMessageDate = dayjs(nextMessage?.created_at).format("YYYY-MM-DD");

      if (
        nextMessage &&
        currentMessage?.from_user_id == nextMessage?.from_user_id &&
        dayjs(currentMessageDate).isSame(dayjs(nextMessageDate))
      ) {
        return true;
      } else {
        return false;
      }
    },
    [chatList]
  );

  return (
    <Flex flex={1} bg="#FAFAFA" paddingX={2} position="relative">
      <FlashList
        inverted
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={20}
        ListFooterComponent={() => isLoading && <Spinner size="sm" />}
        keyExtractor={(item, index) => index}
        onScrollBeginDrag={() => setHasBeenScrolled(true)}
        onEndReached={() => hasBeenScrolled && fetchChatMessageHandler()}
        onEndReachedThreshold={0.1}
        estimatedItemSize={200}
        data={chatList}
        renderItem={({ item, index }) => (
          <>
            {chatList[index + 1] ? (
              !dayjs(item?.created_at).isSame(dayjs(chatList[index + 1]?.created_at), "date") ? (
                <>
                  <ChatMessageTimeStamp key={`${item?.id}_${index}_timestamp-group`} timestamp={item?.created_at} />
                </>
              ) : (
                ""
              )
            ) : (
              <ChatMessageTimeStamp key={`${item?.id}_${index}_timestamp-group`} timestamp={item?.created_at} />
            )}
            <ChatBubble
              chat={item}
              fromUserId={item?.from_user_id}
              id={item?.id}
              content={item?.message}
              type={type}
              time={item?.created_time}
              file_path={item?.file_path}
              file_name={item?.file_name}
              file_type={item?.mime_type}
              file_size={item?.file_size}
              band_attachment_id={item?.project_id ? item?.project_id : item?.task_id}
              band_attachment_no={item?.project?.project_no ? item?.project?.project_no : item?.task?.task_no}
              band_attachment_type={item?.project_id ? "Project" : "Task"}
              band_attachment_title={item?.project_title ? item?.project_title : item?.task_title}
              reply_to={item?.reply_to}
              isDeleted={item?.delete_for_everyone}
              name={userNameRenderCheck(chatList[index + 1], item)}
              image={userImageRenderCheck(item, chatList[index - 1])}
              isGrouped={messageIsGrouped(item, chatList[index - 1])}
              openChatBubbleHandler={openChatBubbleHandler}
              toggleFullScreen={toggleFullScreen}
            />
          </>
        )}
      />

      {fileAttachment && (
        <>
          {fileAttachment.type === "image/jpg" ? (
            <ImageAttachment image={fileAttachment} setImage={setFileAttachment} />
          ) : (
            <FileAttachment file={fileAttachment} setFile={setFileAttachment} />
          )}
        </>
      )}

      {bandAttachment && (
        <ProjectTaskAttachmentPreview
          bandAttachmentType={bandAttachmentType}
          bandAttachment={bandAttachment}
          setBandAttachment={setBandAttachment}
        />
      )}
    </Flex>
  );
};

export default memo(ChatList);
