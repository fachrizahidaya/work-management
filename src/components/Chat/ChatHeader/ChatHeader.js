import { memo } from "react";

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
  onToggleExitModal,
  onToggleDeleteGroupModal,
  loggedInUser,
  onToggleDeleteModal,
  roomId,
  isLoading,
  onUpdatePin,
  isPinned,
  navigation,
  searchMessage,
  setSearchMessage,
  searchFormRef,
  searchVisible,
  groupName,
  toggleSearch,
  calendarRef,
}) => {
  const optionsArr =
    type === "personal"
      ? [
          // {
          //   name: "Search",
          //   onPress: () => toggleSearch(),
          // },
          {
            name: `${isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}`,
            onPress: () => onUpdatePin(),
          },
          {
            name: "Delete Chat",
            onPress: () => onToggleDeleteModal(),
          },
        ]
      : [
          // {
          //   name: "Search",
          //   onPress: () => toggleSearch(),
          // },
          {
            name: `${isPinned?.pin_chat ? "Unpin Chat" : "Pin Chat"}`,
            onPress: () => onUpdatePin(),
          },
          type === "group" && active_member === 1
            ? {
                name: "Exit Group",
                onPress: () => onToggleExitModal(),
              }
            : {
                name: "Delete Group",
                onPress: () => onToggleDeleteGroupModal(),
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <Pressable style={{ marginRight: 1 }} onPress={() => calendarRef.current?.show()}>
            <MaterialIcons name="calendar-today" size={20} color="#3F434A" />
          </Pressable>
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
      </View>

      {/* Handle for search message */}
      {searchVisible && (
        <SearchBox
          onToggleSearch={toggleSearch}
          searchMessage={searchMessage}
          setSearchMessage={setSearchMessage}
          searchFormRef={searchFormRef}
        />
      )}
    </>
  );
};

export default memo(ChatHeader);

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
