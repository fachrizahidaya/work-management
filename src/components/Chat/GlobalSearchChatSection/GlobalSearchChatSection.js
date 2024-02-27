import { Text, View } from "react-native";

import GlobalSearchChatList from "./GlobalSearchChatList/GlobalSearchChatList";

const GlobalSearchChatSection = ({
  searchResult,
  globalKeyword,
  memberName,
}) => {
  return (
    <>
      <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
        <Text style={{ fontWeight: "500", opacity: 0.5 }}>MESSAGES</Text>
      </View>

      {searchResult.message.map((chat) => {
        return (
          <GlobalSearchChatList
            key={chat.id}
            chat={chat}
            message={chat?.message}
            searchKeyword={globalKeyword}
            group={chat?.group}
            memberName={memberName}
          />
        );
      })}
    </>
  );
};

export default GlobalSearchChatSection;
