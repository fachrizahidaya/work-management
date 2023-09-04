import React, { useState } from "react";

import { Avatar, Box, FlatList, Flex, FormControl, Icon, IconButton, Input, Pressable, Text } from "native-base";
import { SafeAreaView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import chats from "../../fakeDB/dummyChats.json";
import ChatBubble from "../../components/Chat/ChatBubble";

import { useNavigation, useRoute } from "@react-navigation/native";

const ChatRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, image } = route.params;
  const [allChats, setAllChats] = useState(chats);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <Flex direction="row" justifyContent="space-between" bg="white" borderBottomWidth={1} borderColor="#E8E9EB" p={4}>
        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>

          <Avatar
            source={{
              uri: image,
            }}
          >
            BG
          </Avatar>

          <Box>
            <Text fontSize={15}>{name}</Text>
            <Text fontSize={13}>Project Analyst</Text>
          </Box>
        </Flex>

        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable>
            <Icon as={<MaterialIcons name="add" />} size="xl" color="#8A9099" />
          </Pressable>

          <Pressable>
            <Icon as={<MaterialIcons name="more-horiz" />} size="xl" color="#8A9099" />
          </Pressable>
        </Flex>
      </Flex>

      <Flex flex={1} bg="#FAFAFA" paddingX={2}>
        <FlatList
          inverted
          data={allChats}
          renderItem={({ item }) => (
            <ChatBubble
              image={image}
              chat={item}
              id={item.id}
              content={item.content}
              alignSelf={item.alignSelf}
              color={item.color}
              read={item.read}
            />
          )}
        />

        <FormControl pt={2} pb={52} borderTopWidth={1} borderColor="#E8E9EB">
          <Input
            padding={4}
            variant="unstyled"
            size="lg"
            multiline
            maxH={75}
            InputLeftElement={
              <Flex direction="row" justifyContent="space-between" px={2} gap={4}>
                <Pressable>
                  <Icon
                    as={<MaterialIcons name={"attach-file"} />}
                    size={6}
                    style={{ transform: [{ rotate: "35deg" }] }}
                    color="#8A9099"
                  />
                </Pressable>

                <Pressable>
                  <Icon as={<MaterialIcons name={"insert-emoticon"} />} size={6} color="#8A9099" />
                </Pressable>
              </Flex>
            }
            InputRightElement={
              <IconButton
                mx={3}
                bgColor="#176688"
                size="md"
                borderRadius="full"
                icon={
                  <Icon
                    as={<MaterialIcons name="send" />}
                    color="white"
                    style={{ transform: [{ rotate: "-35deg" }] }}
                  />
                }
              />
            }
            placeholder="Type a message..."
          />
        </FormControl>
      </Flex>
    </SafeAreaView>
  );
};

export default ChatRoom;
