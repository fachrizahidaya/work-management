import { Text, View } from "react-native";

import GlobalSearchChatList from "./GlobalSearchChatList/GlobalSearchChatList";

const GlobalSearchChatSection = ({ searchResult, globalKeyword }) => {
  return (
    <>
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "500", opacity: 0.5 }}>MESSAGES</Text>
      </View>

      {searchResult.message.map((chat) => {
        return <GlobalSearchChatList key={chat.id} chat={chat} searchKeyword={globalKeyword} group={chat?.group} />;
      })}
    </>
  );
};

export default GlobalSearchChatSection;
