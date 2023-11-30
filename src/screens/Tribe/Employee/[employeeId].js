import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";

import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { Flex } from "native-base";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import FeedCard from "../../../components/Tribe/FeedPersonal/FeedCard";

const EmployeeProfileScreen = ({ route }) => {
  const [personalPosts, setPersonalPosts] = useState([]);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [reload, setReload] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const { employeeId, loggedEmployeeImage, loggedEmployeeId } = route.params;

  const { isOpen: teammatesIsOpen, toggle: toggleTeammates } = useDisclosure(false);

  const { height } = Dimensions.get("screen");

  const navigation = useNavigation();

  const userSelector = useSelector((state) => state.auth); // User redux to fetch id, name

  // Parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const { data: employee } = useFetch(`/hr/employees/${employeeId}`);

  const { data: teammates } = useFetch(`/hr/employees/${employeeId}/team`);

  const {
    data: personalPost,
    refetch: refetchPersonalPost,
    isFetching: personalPostIsFetching,
    isLoading: personalPostIsLoading,
  } = useFetch(`/hr/posts/personal/${employee?.data?.id}`, [reload, currentOffset], postFetchParameters);

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (personalPosts.length !== personalPosts.length + personalPost?.data.length) {
      setCurrentOffset(currentOffset + 10);
    }
  };

  /**
   * Reset current offset after create a new feed
   */
  const postRefetchHandler = () => {
    setCurrentOffset(0);
    setReload(!reload);
  };

  useEffect(() => {
    if (personalPost?.data && personalPostIsFetching === false) {
      if (currentOffset === 0) {
        setPersonalPosts(personalPost?.data);
      } else {
        setPersonalPosts((prevData) => [...prevData, ...personalPost?.data]);
      }
    }
  }, [personalPostIsFetching]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex style={isHeaderSticky ? styles.stickyHeader : styles.header}>
        <PageHeader
          title={employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Flex>

      <Flex flex={1} minHeight={2} gap={2} height={height}>
        {/* Content here */}
        <FeedCard
          posts={personalPosts}
          loggedEmployeeId={loggedEmployeeId}
          loggedEmployeeName={userSelector?.name}
          loggedEmployeeImage={loggedEmployeeImage}
          postRefetchHandler={postRefetchHandler}
          postEndReachedHandler={postEndReachedHandler}
          personalPostIsFetching={personalPostIsFetching}
          personalPostIsLoading={personalPostIsLoading}
          refetchPersonalPost={refetchPersonalPost}
          employee={employee}
          toggleTeammates={toggleTeammates}
          teammates={teammates}
          teammatesIsOpen={teammatesIsOpen}
          hasBeenScrolled={hasBeenScrolled}
          setHasBeenScrolled={setHasBeenScrolled}
          reload={reload}
          setReload={setReload}
        />
      </Flex>
    </SafeAreaView>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 15,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  createPostIcon: {
    backgroundColor: "#377893",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 2,
  },
});
