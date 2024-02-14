import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native-gesture-handler";

import ProjectListItem from "../../components/Band/Project/ProjectList/ProjectListItem";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/shared/PageHeader";
import EmptyPlaceholder from "../../components/shared/EmptyPlaceholder";
import ProjectSkeleton from "../../components/Band/Project/ProjectList/ProjectSkeleton";
import useCheckAccess from "../../hooks/useCheckAccess";
import ProjectFilter from "../../components/Band/Project/ProjectFilter/ProjectFilter";
import Tabs from "../../components/shared/Tabs";
import Pagination from "../../components/shared/Pagination";

const ProjectList = () => {
  const navigation = useNavigation();
  const firstTimeRef = useRef(true);
  const [ownerName, setOwnerName] = useState("");
  const [status, setStatus] = useState("On Progress");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [deadlineSort, setDeadlineSort] = useState("asc");
  const [tabValue, setTabValue] = useState("On Progress");
  const createActionCheck = useCheckAccess("create", "Projects");

  const dependencies = [status, currentPage, searchInput, selectedPriority, deadlineSort, ownerName];

  const params = {
    page: currentPage,
    search: searchInput,
    status: status !== "Archived" ? status : "",
    archive: status !== "Archived" ? 0 : 1,
    limit: 10,
    priority: selectedPriority,
    sort_deadline: deadlineSort,
    owner_name: ownerName,
  };
  const { data, isLoading, isFetching, refetch } = useFetch("/pm/projects", dependencies, params);

  const tabs = [
    { title: "Open", value: "Open" },
    { title: "On Progress", value: "On Progress" },
    { title: "Finish", value: "Finish" },
    { title: "Archived", value: "Archived" },
  ];

  const onChangeTab = useCallback((value) => {
    setTabValue(value);
    setStatus(value);
  }, []);

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 2; i++) {
      skeletons.push(<ProjectSkeleton key={i} />);
    }
    return skeletons;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [status, searchInput, selectedPriority, deadlineSort, ownerName]);

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
            paddingHorizontal: 16,
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
            paddingBottom: 10,
          }}
        >
          <ProjectFilter
            setSearchInput={setSearchInput}
            setDeadlineSort={setDeadlineSort}
            setSelectedPriority={setSelectedPriority}
            setOwnerName={setOwnerName}
            ownerName={ownerName}
            deadlineSort={deadlineSort}
            selectedPriority={selectedPriority}
          />

          <View style={{ paddingHorizontal: 16 }}>
            <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
          </View>

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
          <Pressable
            style={styles.hoverButton}
            onPress={() => navigation.navigate("Project Form", { projectData: null })}
          >
            <MaterialCommunityIcons name="plus" size={30} color="white" />
          </Pressable>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
