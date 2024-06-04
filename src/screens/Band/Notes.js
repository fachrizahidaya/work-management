import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { useMutation } from "react-query";
import Toast from "react-native-root-toast";

import { RefreshControl } from "react-native-gesture-handler";
import { FlatList, Keyboard, Pressable, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Skeleton } from "moti/skeleton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import NoteItem from "../../components/Band/Note/NoteItem/NoteItem";
import axiosInstance from "../../config/api";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import { useDisclosure } from "../../hooks/useDisclosure";
import NoteFilter from "../../components/Band/Note/NoteFilter/NoteFilter";
import useCheckAccess from "../../hooks/useCheckAccess";
import { ErrorToastProps, SkeletonCommonProps, SuccessToastProps } from "../../components/shared/CustomStylings";

const NotesScreen = () => {
  const navigation = useNavigation();
  const firstTimeRef = useRef(true);
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
        Toast.show("Note updated", SuccessToastProps);
      },
      onError: (error) => {
        Toast.show(error.response.data.message, ErrorToastProps);
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

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <>
            <View style={{ gap: 15, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: "#fff" }}>
              <PageHeader backButton={false} title="Notes" />

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
                <Skeleton width="100%" height={270} radius={10} {...SkeletonCommonProps} />
              )}
            </View>
          </>
        </TouchableWithoutFeedback>

        {createCheckAccess && (
          <Pressable
            style={styles.hoverButton}
            onPress={() => navigation.navigate("Note Form", { noteData: null, refresh: refetch, refreshFunc: true })}
          >
            <MaterialCommunityIcons name="plus" size={30} color="white" />
          </Pressable>
        )}
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
    backgroundColor: "#f8f8f8",
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
