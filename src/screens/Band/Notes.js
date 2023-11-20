import React, { useState } from "react";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Dimensions, Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Flex, Icon, Pressable, Skeleton, VStack, View, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";

import PageHeader from "../../components/shared/PageHeader";
import { useFetch } from "../../hooks/useFetch";
import NoteItem from "../../components/Band/Note/NoteItem/NoteItem";
import { ErrorToast, SuccessToast } from "../../components/shared/ToastDialog";
import axiosInstance from "../../config/api";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import { useDisclosure } from "../../hooks/useDisclosure";
import NewNoteSlider from "../../components/Band/Note/NewNoteSlider/NewNoteSlider";
import NoteFilter from "../../components/Band/Note/NoteFilter/NoteFilter";
import useCheckAccess from "../../hooks/useCheckAccess";
import { useMutation } from "react-query";

const NotesScreen = () => {
  const { height } = Dimensions.get("screen");
  const toast = useToast();
  const [noteToDelete, setNoteToDelete] = useState({});
  const [selectedNote, setSelectedNote] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: editFormIsOpen, toggle: toggleEditForm } = useDisclosure(false);
  const { isOpen: newFormIsOpen, toggle: toggleNewForm } = useDisclosure(false);
  const createCheckAccess = useCheckAccess("create", "Notes");
  const { data: notes, isLoading, isFetching, refetch } = useFetch("/pm/notes");

  const openDeleteModalHandler = (note) => {
    setNoteToDelete(note);
    toggleDeleteModal();
  };

  const openEditFormHandler = (note) => {
    setSelectedNote(note);
    toggleEditForm();
  };

  const closeEditFormHandler = (resetForm) => {
    setSelectedNote({});
    toggleEditForm();
    resetForm();
  };

  const closeNewFormHandler = (resetForm) => {
    toggleNewForm();
    resetForm();
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
        toast.show({
          render: ({ id }) => {
            return <SuccessToast message={`Note updated!`} toast={toast} close={() => toast.close(id)} />;
          },
        });
      },
      onError: (error) => {
        toast.show({
          render: ({ id }) => {
            return <ErrorToast message={error?.response?.data?.message} toast={toast} close={() => toast.close(id)} />;
          },
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
          <VStack space={21} flex={1}>
            <PageHeader backButton={false} title="Notes" />
            <Flex flexDir="row">
              <NoteFilter data={notes?.data} setFilteredData={setFilteredData} />
            </Flex>

            <ScrollView
              style={{ maxHeight: height }}
              // refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
            >
              <View flex={1} minH={2}>
                {!isLoading ? (
                  <FlashList
                    data={renderList}
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={270}
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
                  <Skeleton height={270} />
                )}
              </View>
            </ScrollView>
          </VStack>
        </TouchableWithoutFeedback>

        {createCheckAccess && (
          <Pressable
            position="absolute"
            right={5}
            bottom={5}
            rounded="full"
            bgColor="primary.600"
            p={15}
            shadow="0"
            borderRadius="full"
            borderWidth={3}
            borderColor="#FFFFFF"
            onPress={toggleNewForm}
          >
            <Icon as={<MaterialCommunityIcons name="plus" />} size="xl" color="white" />
          </Pressable>
        )}
      </SafeAreaView>

      {deleteModalIsOpen && (
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
      )}

      {editFormIsOpen && (
        <NewNoteSlider
          isOpen={editFormIsOpen}
          onClose={closeEditFormHandler}
          noteData={selectedNote}
          refresh={refetch}
        />
      )}

      {newFormIsOpen && <NewNoteSlider isOpen={newFormIsOpen} onClose={closeNewFormHandler} refresh={refetch} />}
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
});
