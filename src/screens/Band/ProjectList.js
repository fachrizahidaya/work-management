import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useFormik } from "formik";
import _ from "lodash";

import { SafeAreaView, StyleSheet } from "react-native";
import { Box, Divider, Flex, Icon, Input, Pressable, Select, Skeleton, VStack } from "native-base";
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

const ProjectList = () => {
  const firstTimeRef = useRef(true);
  const [status, setStatus] = useState("On Progress");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const createActionCheck = useCheckAccess("create", "Projects");
  console.log(createActionCheck);
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
        <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
          <PageHeader title="My Project" backButton={false} />
        </Flex>

        <Flex flex={1} gap={14} bgColor={"white"} m={4} borderRadius={15} pb={4}>
          <Box pt={4} px={4}>
            <Input
              value={formik.values.search}
              size="md"
              InputRightElement={
                searchInput && (
                  <Pressable
                    onPress={() => {
                      handleSearch("");
                      formik.resetForm();
                    }}
                  >
                    <Icon as={<MaterialCommunityIcons name="close" />} size="md" mr={3} />
                  </Pressable>
                )
              }
              InputLeftElement={
                <Pressable>
                  <Icon as={<MaterialCommunityIcons name="magnify" />} size="md" ml={2} color="muted.400" />
                </Pressable>
              }
              placeholder="Search project..."
              onChangeText={(value) => {
                handleSearch(value);
                formik.setFieldValue("search", value);
              }}
            />
          </Box>

          <Box px={4} pb={1}>
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
          </Box>

          <Divider></Divider>

          {!isLoading ? (
            data?.data?.data?.length > 0 ? (
              <>
                <Box flex={1}>
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
                </Box>

                {data?.data?.last_page > 1 && (
                  <Pagination data={data} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                )}
              </>
            ) : (
              <EmptyPlaceholder height={200} width={240} text="No project" />
            )
          ) : (
            <VStack px={2} space={2}>
              {renderSkeletons()}
            </VStack>
          )}
        </Flex>

        {createActionCheck && (
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
            onPress={toggleProjectForm}
          >
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
});

export default ProjectList;
