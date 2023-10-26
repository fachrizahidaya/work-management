import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";

import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Icon, Image, Pressable } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import FeedCardItem from "../../../components/Tribe/Feed/FeedCardItem";
import { useDisclosure } from "../../../hooks/useDisclosure";
import EmployeeContact from "../../../components/Tribe/Employee/EmployeeContact";
import EmployeeTeammates from "../../../components/Tribe/Employee/EmployeeTeammates";
import EmployeeProfile from "../../../components/Tribe/Employee/EmployeeProfile";
import EmployeeSelfProfile from "../../../components/Tribe/Employee/EmployeeSelfProfile";
import FeedComment from "../../../components/Tribe/Feed/FeedComment/FeedComment";
import axiosInstance from "../../../config/api";
import { LikeToggle } from "../../../components/shared/LikeToggle";
import FeedCard from "../../../components/Tribe/FeedPersonal/FeedCard";

const EmployeeProfileScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const [fetchIsDone, setFetchIsDone] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

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
  } = useFetch(!fetchIsDone && `/hr/posts/personal/${employeeId}`, [currentOffset], postFetchParameters);
  console.log("tes", personalFeeds?.data);

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
    if (!fetchIsDone) {
      if (posts.length !== posts.length + personalFeeds?.data.length) {
        setCurrentOffset(currentOffset + 10);
      } else {
        setFetchIsDone(true);
      }
    }
  };

  const postRefetchHandler = () => {
    setCurrentOffset(0);
    setFetchIsDone(false);
  };

  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
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
        console.log("1", posts);
      } else {
        setPosts((prevData) => [...prevData, ...personalFeeds?.data]);
        console.log("2", posts);
      }
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
            refetch: refetch,
            loggedEmployeeImage: loggedEmployeeImage,
            loggedEmployeeName: userSelector?.name,
            employeeId: employeeId,
          });
        }}
      >
        <Icon as={<MaterialCommunityIcons name="pencil" />} size={30} color="#FFFFFF" />
      </Pressable>

      <ScrollView onScroll={handleScroll} style={{ height: 200, overflow: "scroll" }}>
        {/* <Image
          source={require("../../../assets/profile_banner.jpg")}
          alignSelf="center"
          h={200}
          w={500}
          alt="empty"
          resizeMode="cover"
        /> */}
        <Flex flex={1} gap={5}>
          {/* When the employee id is not equal, it will appear the contacts of employee */}
          {/* <Flex px={3} position="relative" flexDir="column" bgColor="#FFFFFF">
            {userSelector?.id !== employee?.data?.user_id ? (
              <>
                <Flex pt={2} gap={2} flexDirection="row-reverse" alignItems="center">
                  <EmployeeContact employee={employee} />
                </Flex>
                <EmployeeProfile employee={employee} toggleTeammates={toggleTeammates} teammates={teammates} />
              </>
            ) : (
              <EmployeeSelfProfile employee={employee} toggleTeammates={toggleTeammates} teammates={teammates} />
            )}

            <EmployeeTeammates
              teammatesIsOpen={teammatesIsOpen}
              toggleTeammates={toggleTeammates}
              teammates={teammates}
            />
          </Flex> */}

          <Flex px={3} minHeight={100} flex={1} flexDir="column" gap={2}>
            {/* Posts that created by employee handler */}
            <FeedCard
              posts={posts}
              loggedEmployeeId={loggedEmployeeId}
              loggedEmployeeName={loggedEmployeeName}
              loggedEmployeeImage={loggedEmployeeImage}
              onToggleLike={postLikeToggleHandler}
              postRefetchHandler={postRefetchHandler}
              handleEndReached={postEndReachedHandler}
              personalFeedsIsFetching={personalFeedsIsFetching}
              refetchPersonalFeeds={refetchPersonalFeeds}
              refetchFeeds={refetch}
            />
          </Flex>
        </Flex>
      </ScrollView>
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
