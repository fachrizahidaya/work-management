import React from "react";

import { Flex, Text } from "native-base";

import GlobalSearchChatList from "./GlobalSearchChatList/GlobalSearchChatList";

const GlobalSearchChatSection = ({ searchResult, globalKeyword }) => {
  return (
    <>
      <Flex p={4}>
        <Text opacity={0.5} fontWeight={500}>
          MESSAGES
        </Text>
      </Flex>

      {searchResult.message.map((chat) => {
        return <GlobalSearchChatList key={chat.id} chat={chat} searchKeyword={globalKeyword} group={chat?.group} />;
      })}
    </>
  );
};

export default GlobalSearchChatSection;
