import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useFormik } from "formik";
import _ from "lodash";

import { SafeAreaView, StyleSheet, View, Pressable } from "react-native";
import { Divider, Icon, Select } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import ProjectListItem from "../../components/Band/Project/ProjectList/ProjectListItem";
import { useFetch } from "../../hooks/useFetch";
import Pagination from "../../components/shared/Pagination";
import PageHeader from "../../components/shared/PageHeader";
import EmptyPlaceholder from "../../components/shared/EmptyPlaceholder";
import ProjectSkeleton from "../../components/Band/Project/ProjectList/ProjectSkeleton";
import useCheckAccess from "../../hooks/useCheckAccess";
import { useDisclosure } from "../../hooks/useDisclosure";
import NewProjectSlider from "../../components/Band/Project/NewProjectSlider/NewProjectSlider";
import Input from "../../components/shared/Forms/Input";

const ProjectList = () => {
  const firstTimeRef = useRef(true);
  const [status, setStatus] = useState("On Progress");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const createActionCheck = useCheckAccess("create", "Projects");
  const { isOpen: projectFormIsOpen, toggle: toggleProjectForm } = useDisclosure(false);

  const dependencies = [status, currentPage, searchInput];

  const params = {
    page: currentPage,
    search: searchInput,
    status: status !== "Archived" ? status : "",
    archive: status !== "Archived" ? 0 : 1,
    limit: 10,
  };
  const { data, isLoading, isFetching, refetch } = useFetch("/pm/projects", dependencies, params);

  const closeProjectFormHandler = (resetForm) => {
    toggleProjectForm();
    resetForm();
  };

  const formik = useFormik({
    initialValues: {
      search: "",
    },
  });

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 2; i++) {
      skeletons.push(<ProjectSkeleton key={i} />);
    }
    return skeletons;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [status, searchInput]);

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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 14,
            paddingHorizontal: 15,
          }}
        >
          <PageHeader title="My Project" backButton={false} />
        </View>

        <View
          style={{
            display: "flex",
            flex: 1,
            gap: 14,
            backgroundColor: "white",
            paddingTop: 17,
            paddingBottom: 4,
            marginHorizontal: 16,
            marginVertical: 20,
            borderRadius: 10,
          }}
        >
          <View style={{ paddingTop: 4, paddingHorizontal: 16 }}>
            <Input
              value={formik.values.search}
              onChangeText={(value) => {
                handleSearch(value);
                formik.setFieldValue("search", value);
              }}
              placeHolder="Search project..."
              endAdornment={
                formik.values.search && (
                  <Pressable
                    onPress={() => {
                      handleSearch("");
                      formik.resetForm();
                    }}
                  >
                    <MaterialCommunityIcons name="close" size={20} />
                  </Pressable>
                )
              }
              startAdornment={
                <Pressable>
                  <MaterialCommunityIcons name="magnify" size={20} />
                </Pressable>
              }
            />
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 1 }}>
            <Select
              variant="unstyled"
              size="md"
              dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
              borderRadius={15}
              borderWidth={1}
              style={{ height: 40 }}
              onValueChange={(value) => setStatus(value)}
              defaultValue={status}
            >
              <Select.Item label="Open" value="Open" />
              <Select.Item label="On Progress" value="On Progress" />
              <Select.Item label="Finish" value="Finish" />
              <Select.Item label="Archived" value="Archived" />
            </Select>
          </View>

          <Divider></Divider>

          {!isLoading ? (
            data?.data?.data?.length > 0 ? (
              <>
                <View style={{ flex: 1 }}>
                  <FlashList
                    refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                    data={data?.data.data}
                    keyExtractor={(item) => item.id}
                    onEndReachedThreshold={0.1}
                    estimatedItemSize={200}
                    renderItem={({ item }) => (
                      <ProjectListItem
                        id={item.id}
                        title={item.title}
                        status={item.status}
                        deadline={item.deadline}
                        isArchive={item.archive}
                        image={item.owner_image}
                        ownerName={item.owner_name}
                        ownerEmail={item.owner_email}
                      />
                    )}
                  />
                </View>

                {data?.data?.last_page > 1 && (
                  <Pagination data={data} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                )}
              </>
            ) : (
              <EmptyPlaceholder height={200} width={240} text="No project" />
            )
          ) : (
            <View style={{ display: "flex", paddingHorizontal: 2, gap: 2 }}>{renderSkeletons()}</View>
          )}
        </View>

        {createActionCheck && (
          <Pressable style={styles.hoverButton} onPress={toggleProjectForm}>
            <Icon as={<MaterialCommunityIcons name="plus" />} size="xl" color="white" />
          </Pressable>
        )}
      </SafeAreaView>

      {/* Create project form */}
      {projectFormIsOpen && <NewProjectSlider isOpen={projectFormIsOpen} onClose={closeProjectFormHandler} />}
    </>
  );
};

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

export default ProjectList;
