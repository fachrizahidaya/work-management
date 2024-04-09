import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SearchBox from "./SearchBox";
import { TextProps } from "../../shared/CustomStylings";
import ContactDescription from "./ContactDescription";

const ChatHeader = ({
  name,
  image,
  position,
  email,
  type,
  active_member,
  toggleExitModal,
  toggleDeleteGroupModal,
  loggedInUser,
  toggleDeleteModal,
  roomId,
  isLoading,
  onUpdatePinHandler,
  isPinned,
  navigation,
  searchMessage,
  setSearchMessage,
  searchFormRef,
  searchVisible,
  groupName,
  toggleSearch,
}) => {
  const optionsArr =
    type === "personal"
      ? [
          // {
          //   name: "Search",
          //   onPress: () => {
          //     toggleSearch();
          //     SheetManager.hide("form-sheet");
          //   },
          // },
          {
            name: `${isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}`,
            onPress: () => {
              onUpdatePinHandler(type, roomId, isPinned?.pin_chat ? "unpin" : "pin", navigation);
              SheetManager.hide("form-sheet");
            },
          },
          {
            name: "Delete Chat",
            onPress: async () => {
              await SheetManager.hide("form-sheet");
              toggleDeleteModal();
            },
          },
        ]
      : [
          // {
          //   name: "Search",
          //   onPress: () => {
          //     toggleSearch();
          //     SheetManager.hide("form-sheet");
          //   },
          // },
          {
            name: `${isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}`,
            onPress: () => {
              onUpdatePinHandler(type, roomId, isPinned?.pin_chat ? "unpin" : "pin");
              SheetManager.hide("form-sheet");
            },
          },
          type === "group" && active_member === 1
            ? {
                name: "Exit Group",
                onPress: async () => {
                  await SheetManager.hide("form-sheet");
                  toggleExitModal();
                },
              }
            : {
                name: "Delete Group",
                onPress: async () => {
                  await SheetManager.hide("form-sheet");
                  toggleDeleteGroupModal();
                },
              },
        ];

  const params = {
    name: name,
    image: image,
    position: position,
    type: type,
    roomId: roomId,
    loggedInUser: loggedInUser,
    active_member: active_member,
  };

  const renderHeaderOptions = () => (
    <View style={styles.wrapper}>
      <View
        style={{
          gap: 1,
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        {optionsArr.map((item, index) => {
          return (
            <TouchableOpacity key={index} style={styles.content} onPress={item.onPress}>
              <Text style={[{ fontSize: 16 }, TextProps]}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <ContactDescription
          name={name}
          image={image}
          email={email}
          isLoading={isLoading}
          navigation={navigation}
          params={params}
          concatenatedNames={groupName}
          type={type}
        />
        <Pressable
          style={{ marginRight: 1 }}
          onPress={() =>
            SheetManager.show("form-sheet", {
              payload: {
                children: renderHeaderOptions(),
              },
            })
          }
        >
          <MaterialIcons name="more-horiz" size={20} color="#3F434A" />
        </Pressable>
      </View>

      {/* Handle for search message */}
      {searchVisible && (
        <SearchBox
          toggleSearch={toggleSearch}
          searchMessage={searchMessage}
          setSearchMessage={setSearchMessage}
          searchFormRef={searchFormRef}
        />
      )}
    </>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  wrapper: {
    gap: 21,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: -20,
  },
});
