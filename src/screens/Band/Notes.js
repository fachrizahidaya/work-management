import React, { useState } from "react";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { Button, Flex, Icon, IconButton, Skeleton, VStack, View, useToast } from "native-base";
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

const NotesScreen = () => {
  const { height } = Dimensions.get("screen");
  const toast = useToast();
  const [noteToDelete, setNoteToDelete] = useState({});
  const [selectedNote, setSelectedNote] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: editFormIsOpen, toggle: toggleEditForm } = useDisclosure(false);
  const { isOpen: newFormIsOpen, toggle: toggleNewForm } = useDisclosure(false);

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

  const pinHandler = async (noteId, status) => {
    try {
      await axiosInstance.patch(`/pm/notes/${noteId}/${status}`);
      refetch();
      toast.show({
        render: () => {
          return <SuccessToast message={`Note ${status}`} toast={toast} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} toast={toast} />;
        },
      });
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <VStack space={21} flex={1}>
          <PageHeader backButton={false} title="Notes" />
          <Flex flexDir="row" justifyContent="space-between" alignItems="center">
            <NoteFilter data={notes?.data} setFilteredData={setFilteredData} />

            <Button
              size="lg"
              startIcon={<Icon as={<MaterialCommunityIcons name="plus" />} color="white" />}
              onPress={toggleNewForm}
            >
              Note
            </Button>
          </Flex>

          <ScrollView
            style={{ maxHeight: height }}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          >
            <View flex={1} minH={2}>
              {!isLoading ? (
                <FlashList
                  data={filteredData}
                  keyExtractor={(item) => item.id}
                  estimatedItemSize={270}
                  renderItem={({ item }) => (
                    <NoteItem
                      note={item}
                      id={item.id}
                      title={item.title}
                      content={item.content}
                      date={item.created_at}
                      isPinned={item.pinned}
                      onPress={pinHandler}
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

      {editFormIsOpen && <NewNoteSlider onClose={closeEditFormHandler} noteData={selectedNote} refresh={refetch} />}

      {newFormIsOpen && <NewNoteSlider onClose={closeNewFormHandler} refresh={refetch} />}
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
  },
});
