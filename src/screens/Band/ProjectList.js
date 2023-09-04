import React, { useCallback, useEffect, useState } from "react";

import _ from "lodash";

import { Platform, SafeAreaView, StyleSheet } from "react-native";
import { Box, Divider, Flex, Icon, Input, Pressable, Select, Skeleton, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";

import ProjectListItem from "../../components/Band/Project/ProjectList/ProjectListItem";
import { useFetch } from "../../hooks/useFetch";
import Pagination from "../../components/shared/Pagination";

const ProjectList = () => {
  const [status, setStatus] = useState("Open");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const dependencies = [status, currentPage, searchInput];

  const params = {
    page: currentPage,
    search: searchInput,
    status: status !== "Archived" ? status : "",
    archive: status !== "Archived" ? 0 : 1,
    limit: 10,
  };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const { data, isLoading } = useFetch("/pm/projects", dependencies, params);

  useEffect(() => {
    setCurrentPage(1);
  }, [status, searchInput]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between" bgColor="white" py={14} px={15}>
        <Text fontWeight={500} fontSize={16}>
          My Project
        </Text>
      </Flex>

      <Flex gap={14} bgColor={"white"} m={4} borderRadius={15} pb={4}>
        <Box pt={4} px={4} pb={1}>
          <Input
            variant="unstyled"
            size="md"
            InputRightElement={
              <Pressable>
                <Icon as={<MaterialCommunityIcons name="tune-variant" />} size="md" mr={3} color="black" />
              </Pressable>
            }
            InputLeftElement={
              <Pressable>
                <Icon as={<MaterialCommunityIcons name="magnify" />} size="md" ml={2} color="muted.400" />
              </Pressable>
            }
            placeholder="Search project..."
            borderRadius={15}
            borderWidth={1}
            style={{ height: 40 }}
            onChangeText={(value) => handleSearch(value)}
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
          <>
            <Box h={Platform.OS === "ios" ? 400 : 250}>
              <FlashList
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
                  />
                )}
              />
            </Box>
            <Pagination data={data} setCurrentPage={setCurrentPage} currentPage={currentPage} />
          </>
        ) : (
          <Skeleton height={400} />
        )}
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
});

export default ProjectList;
