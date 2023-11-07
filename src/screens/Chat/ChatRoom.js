import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import Pusher from "pusher-js/react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector } from "react-redux";

import { FlashList } from "@shopify/flash-list";
import { Flex, Icon, Pressable } from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";

import ChatBubble from "../../components/Chat/ChatBubble/ChatBubble";
import axiosInstance from "../../config/api";
import ChatHeader from "../../components/Chat/ChatHeader/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput/ChatInput";
import { useKeyboardChecker } from "../../hooks/useKeyboardChecker";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import ImageAttachment from "../../components/Chat/Attachment/ImageAttachment";
import { useDisclosure } from "../../hooks/useDisclosure";
import FileAttachment from "../../components/Chat/Attachment/FileAttachment";

const ChatRoom = () => {
  const [imageAttachment, setImageAttachment] = useState(null);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  window.Pusher = Pusher;
  const route = useRoute();
  const { name, userId, image, type } = route.params;
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardChecker();
  const [chatList, setChatList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { laravelEcho, setLaravelEcho } = useWebsocketContext();
  const { isOpen: attachmentIsOpen, toggle: toggleAttachment } = useDisclosure(false);

  /**
   * Event listener for new personal chat messages
   */
  const getPersonalChat = () => {
    laravelEcho.channel(`personal.chat.${userSelector.id}.${userId}`).listen(".personal.chat", (event) => {
      setChatList((currentChats) => [...currentChats, event.data]);
    });
  };

  /**
   * Event listener for new group chat messages
   */
  const groupChatMessageEvent = () => {
    laravelEcho.channel(`group.chat.${userId}`).listen(".group.chat", (event) => {
      setChatMessages((prevState) => [...prevState, event.data]);
    });
  };

  /**
   * Fetch personal chat messages
   */
  const getPersonalMessage = async () => {
    try {
      if (hasMore) {
        const res = await axiosInstance.get(`/chat/${type}/${userId}/message`, {
          params: {
            offset: offset,
            limit: 20,
          },
        });
        setChatList((currentChats) => [...res.data.data, ...currentChats]);
        // setChatList((currentChats) => {
        //   if (currentChats.length !== currentChats.length + res.data.data.length) {
        //     return [...res.data.data, ...currentChats];
        //   } else {
        //     setHasMore(false);
        //     return currentChats;
        //   }
        // });
        // setOffset((prevState) => prevState + 20);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fetch group chat messages
   */
  const fetchGroupChatMessages = async () => {
    if (hasMore) {
      try {
        const res = await axiosInstance.get(`/chat/${type}/${userId}/message`, {
          params: {
            offset: offset,
            limit: 20,
          },
        });
        setChatMessages((currentChats) => [...res.data.data, ...currentChats]);

        // setChatMessages((prevState) => {
        //   if (prevState.length !== prevState.length + res.data.data.length) {
        //     return [...res.data.data, ...prevState];
        //   } else {
        //     setHasMore(false);
        //     return prevState;
        //   }
        // });
        // setOffset((prevState) => prevState + 20);
      } catch (err) {
        console.log(err);
      }
    }
  };

  /**
   * Pick an image Handler
   */
  const pickImageHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    // Handling for name
    var filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1,
      result.assets[0].uri.length
    );

    const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri); // Handling for file information

    if (result) {
      setImageAttachment({
        name: filename,
        size: fileInfo.size,
        type: `${result.assets[0].type}/jpg`,
        webkitRelativePath: "",
        uri: result.assets[0].uri,
      });
    }
  };

  // const handleUploadFile = async (formData) => {
  //   try {
  //     // Sending the formData to backend
  //     await axiosInstance.post("/pm/projects/attachment", formData, {
  //       headers: {
  //         "content-type": "multipart/form-data",
  //       },
  //     });
  //     // Refetch project's attachments
  //     refetchAttachments();

  //     // Display toast if success
  //     toast.show({
  //       render: ({ id }) => {
  //         return <SuccessToast message={"Attachment uploaded"} close={() => toast.close(id)} />;
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     // Display toast if error
  //     toast.show({
  //       render: ({ id }) => {
  //         return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
  //       },
  //     });
  //   }
  // };

  /**
   * Select file handler
   */
  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      // Check if there is selected file
      if (result) {
        if (result.assets[0].size < 3000001) {
          // formData format
          setFileAttachment({
            name: result.assets[0].name,
            size: result.assets[0].size,
            type: result.assets[0].mimeType,
            uri: result.assets[0].uri,
            webkitRelativePath: "",
          });

          // Call upload handler and send formData to the api
          // handleUploadFile(formData);
        } else {
          Alert.alert("Max file size is 3MB");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getPersonalMessage();
      fetchGroupChatMessages();
    }
    getPersonalChat();
    groupChatMessageEvent();
  }, [userId]);

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: Platform.OS === "ios" && keyboardHeight }]}>
      <ChatHeader
        name={name}
        image={image}
        navigation={navigation}
        userId={userId}
        imageAttachment={imageAttachment}
        fileAttachment={fileAttachment}
      />

      <Flex
        flex={1}
        bg="#FAFAFA"
        paddingX={2}
        position="relative"
        // style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <FlashList
          // inverted
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          // onEndReached={getPersonalMessage}
          estimatedItemSize={200}
          data={chatList}
          renderItem={({ item }) => (
            <ChatBubble
              chat={item}
              image={image}
              name={name}
              fromUserId={item.from_user_id}
              id={item.id}
              content={item.message}
              time={item.created_time}
            />
          )}
        />
        {imageAttachment || fileAttachment ? (
          <Flex px={5} py={5} gap={5} bgColor="white" position="absolute" top={0} bottom={0} left={0} right={0}>
            <Flex flexDir="row" justifyContent="end" alignItems="flex-end">
              <Pressable onPress={imageAttachment ? () => setImageAttachment(null) : () => setFileAttachment(null)}>
                <Icon as={<MaterialCommunityIcons name="close" />} size={5} />
              </Pressable>
            </Flex>
            {fileAttachment && <FileAttachment file={fileAttachment} setFile={setFileAttachment} />}
            {imageAttachment && <ImageAttachment image={imageAttachment} setImage={setImageAttachment} />}
          </Flex>
        ) : null}
      </Flex>

      <ChatInput
        userId={userId}
        type={type}
        imageAttachment={imageAttachment}
        fileAttachment={fileAttachment}
        selectFile={selectFile}
        pickImageHandler={pickImageHandler}
      />
    </SafeAreaView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
