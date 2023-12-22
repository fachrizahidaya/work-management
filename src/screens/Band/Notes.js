import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useMutation } from "react-query";

import { RefreshControl } from "react-native-gesture-handler";
import {
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import NoteItem from "../../components/Band/Note/NoteItem/NoteItem";
import axiosInstance from "../../config/api";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import { useDisclosure } from "../../hooks/useDisclosure";
import NoteFilter from "../../components/Band/Note/NoteFilter/NoteFilter";
import useCheckAccess from "../../hooks/useCheckAccess";

const NotesScreen = () => {
  const navigation = useNavigation();
  const [noteToDelete, setNoteToDelete] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const createCheckAccess = useCheckAccess("create", "Notes");
  const { data: notes, isLoading, refetch } = useFetch("/pm/notes");

  const openDeleteModalHandler = (note) => {
    setNoteToDelete(note);
    toggleDeleteModal();
  };

  const openEditFormHandler = (note) => {
    navigation.navigate("Note Form", { noteData: note, refresh: refetch, refreshFunc: true });
  };

  const {
    mutate,
    isLoading: pinIsLoading,
    variables,
  } = useMutation(
    (note) => {
      return axiosInstance.patch(`/pm/notes/${note.id}/${note.status}`);
    },
    {
      onSuccess: () => {
        refetch();
        Toast.show({
          type: "success",
          text1: "Note updated!",
          position: "bottom",
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error.response.data.message,
          position: "bottom",
        });
      },
    }
  );

  let optimisticList = [];
  const index = filteredData?.findIndex((note) => note.id === variables?.id);

  if (variables?.status === "pinned") {
    optimisticList =
      index !== -1
        ? [...filteredData?.slice(0, index), { ...variables, pinned: 1 }, ...filteredData?.slice(index + 1)]
        : [...filteredData, { ...variables, pinned: 1 }];
  } else {
    optimisticList =
      index !== -1
        ? [...filteredData?.slice(0, index), { ...variables, pinned: 0 }, ...filteredData?.slice(index + 1)]
        : [...filteredData, { ...variables, pinned: 0 }];
  }

  const renderList = pinIsLoading ? optimisticList : filteredData;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ display: "flex", gap: 21, flex: 1 }}>
            <PageHeader backButton={false} title="Notes" />
            <View style={{ display: "flex", flexDirection: "row" }}>
              <NoteFilter data={notes?.data} setFilteredData={setFilteredData} />
            </View>

            <View style={{ flex: 1 }}>
              {!isLoading ? (
                <FlatList
                  refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
                  data={renderList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <NoteItem
                      note={item}
                      id={item.id}
                      title={item.title}
                      date={item.created_at}
                      isPinned={item.pinned}
                      onPress={mutate}
                      openDeleteModal={openDeleteModalHandler}
                      openEditForm={openEditFormHandler}
                    />
                  )}
                />
              ) : (
                <Text>Loading...</Text>
                // <Skeleton height={270} />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>

        {createCheckAccess && (
          <Pressable
            style={styles.hoverButton}
            onPress={() => navigation.navigate("Note Form", { noteData: null, refresh: refetch, refreshFunc: true })}
          >
            <MaterialCommunityIcons name="plus" size={30} color="white" />
          </Pressable>
        )}

        <Toast />
      </SafeAreaView>

      <ConfirmationModal
        isOpen={deleteModalIsOpen}
        toggle={toggleDeleteModal}
        apiUrl={`/pm/notes/${noteToDelete?.id}`}
        successMessage="Note deleted"
        header="Delete Note"
        description={`Are you sure to delete ${noteToDelete?.title}?`}
        hasSuccessFunc={true}
        onSuccess={refetch}
      />
    </>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 13,
    position: "relative",
  },
  hoverButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    borderRadius: 50,
    backgroundColor: "#176688",
    padding: 15,
    elevation: 0,
    borderWidth: 3,
    borderColor: "white",
  },
});
