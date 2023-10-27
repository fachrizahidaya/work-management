import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";

import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { Flex, Icon, Image, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import axiosInstance from "../../../config/api";
import FeedCard from "../../../components/Tribe/FeedPersonal/FeedCard";
import { ScrollView } from "react-native-gesture-handler";

const EmployeeProfileScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const [fetchIsDone, setFetchIsDone] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [fetchingMore, setFetchingMore] = useState(false);
  const { height } = Dimensions.get("screen");

  const { isOpen: commentIsOpen, toggle: toggleComment } = useDisclosure(false);

  // parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const { employeeId, returnPage, loggedEmployeeImage, loggedEmployeeName, loggedEmployeeId, refetch } = route.params;

  const { isOpen: teammatesIsOpen, toggle: toggleTeammates } = useDisclosure(false);

  const navigation = useNavigation();

  // User redux to fetch id, name
  const userSelector = useSelector((state) => state.auth);

  const {
    data: employee,
    isFetching: employeeIsFetching,
    refetch: refetchEmployee,
  } = useFetch(`/hr/employees/${employeeId}`);

  const {
    data: teammates,
    refetch: refetchTeammates,
    isFetching: teammatesIsFetching,
  } = useFetch(`/hr/employees/${employeeId}/team`);

  const {
    data: personalFeeds,
    refetch: refetchPersonalFeeds,
    isFetching: personalFeedsIsFetching,
  } = useFetch(!fetchIsDone && `/hr/posts/personal/${employee?.data?.id}`, [currentOffset], postFetchParameters);

  /**
   * Header when screen scrolling handler
   */
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > 0) {
      setIsHeaderSticky(true);
    } else {
      setIsHeaderSticky(false);
    }
  };

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (!fetchingMore && !fetchIsDone) {
      setFetchingMore(true);
      if (posts.length !== posts.length + personalFeeds?.data.length) {
        setCurrentOffset(currentOffset + 10);
      } else {
        setFetchIsDone(true);
      }
    }
  };

  /**
   * Reset current offset after create a new feed
   */
  const postRefetchHandler = () => {
    setCurrentOffset(0);
    setFetchIsDone(false);
  };

  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      refetch();
      refetchPersonalFeeds();
      setTimeout(() => {
        console.log("liked this post!");
      }, 500);
      refetchPersonalFeeds();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (personalFeeds?.data) {
      if (currentOffset === 0) {
        setPosts(personalFeeds?.data);
      } else {
        setPosts((prevData) => [...prevData, ...personalFeeds?.data]);
      }
      setFetchingMore(false);
    }
  }, [personalFeeds?.data]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex style={isHeaderSticky ? styles.stickyHeader : styles.header}>
        <PageHeader
          title={employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
          onPress={() => {
            navigation.navigate(returnPage);
          }}
        />
      </Flex>

      <Pressable
        style={styles.createIcon}
        shadow="0"
        borderRadius="full"
        borderWidth={3}
        borderColor="#FFFFFF"
        onPress={() => {
          navigation.navigate("New Feed", {
            refetch: postRefetchHandler,
            loggedEmployeeImage: loggedEmployeeImage,
            loggedEmployeeName: userSelector?.name,
            employeeId: employeeId,
          });
        }}
      >
        <Icon as={<MaterialCommunityIcons name="pencil" />} size={30} color="#FFFFFF" />
      </Pressable>

      <Flex flex={1} minHeight={2} gap={2} height={height}>
        {/* Posts that created by employee handler */}

        <FeedCard
          posts={posts}
          loggedEmployeeId={loggedEmployeeId}
          loggedEmployeeName={userSelector?.name}
          loggedEmployeeImage={loggedEmployeeImage}
          onToggleLike={postLikeToggleHandler}
          postRefetchHandler={postRefetchHandler}
          handleEndReached={postEndReachedHandler}
          personalFeedsIsFetching={personalFeedsIsFetching}
          refetchPersonalFeeds={refetchPersonalFeeds}
          refetchFeeds={refetch}
          employee={employee}
          toggleTeammates={toggleTeammates}
          teammates={teammates}
          teammatesIsOpen={teammatesIsOpen}
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
  createIcon: {
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
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  stickyListContainer: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E9EB",
    borderBottomWidth: 1,
  },
});
