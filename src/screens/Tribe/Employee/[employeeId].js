import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";

import { Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { Flex, Icon, Image, Pressable, Text, useToast } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import { useDisclosure } from "../../../hooks/useDisclosure";
import axiosInstance from "../../../config/api";
import FeedCard from "../../../components/Tribe/FeedPersonal/FeedCard";
import { ErrorToast } from "../../../components/shared/ToastDialog";

const EmployeeProfileScreen = ({ route }) => {
  const [personalPosts, setPersonalPosts] = useState([]);
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [reload, setReload] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const { employeeId, loggedEmployeeImage, loggedEmployeeId, refetch } = route.params;

  const { isOpen: teammatesIsOpen, toggle: toggleTeammates } = useDisclosure(false);

  const { height } = Dimensions.get("screen");

  const navigation = useNavigation();

  const toast = useToast();

  const userSelector = useSelector((state) => state.auth); // User redux to fetch id, name

  // Parameters for fetch posts
  const postFetchParameters = {
    offset: currentOffset,
    limit: 10,
  };

  const { data: employee } = useFetch(`/hr/employees/${employeeId}`);

  const { data: teammates } = useFetch(`/hr/employees/${employeeId}/team`);

  const {
    data: personalFeeds,
    refetch: refetchPersonalFeeds,
    isFetching: personalFeedsIsFetching,
  } = useFetch(`/hr/posts/personal/${employee?.data?.id}`, [reload, currentOffset], postFetchParameters);
  console.log(personalFeeds?.data);

  /**
   * Fetch more Posts handler
   * After end of scroll reached, it will added other earlier posts
   */
  const postEndReachedHandler = () => {
    if (personalPosts.length !== personalPosts.length + personalFeeds?.data.length) {
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

  /**
   * Like a Post handler
   * @param {*} post_id
   * @param {*} action
   */
  const postLikeToggleHandler = async (post_id, action) => {
    try {
      const res = await axiosInstance.post(`/hr/posts/${post_id}/${action}`);
      console.log("Process success");

      refetchPersonalFeeds();
      refetch();
    } catch (err) {
      console.log(err);
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={"Process error, please try again later"} close={() => toast.close(id)} />;
        },
      });
    }
  };

  useEffect(() => {
    if (personalFeeds?.data && personalFeedsIsFetching === false) {
      if (currentOffset === 0) {
        setPersonalPosts(personalFeeds?.data);
      } else {
        setPersonalPosts((prevData) => [...prevData, ...personalFeeds?.data]);
      }
    }
  }, [personalFeedsIsFetching]);

  return (
    <SafeAreaView style={styles.container}>
      <Flex style={isHeaderSticky ? styles.stickyHeader : styles.header}>
        <PageHeader
          title={employee?.data?.name.length > 30 ? employee?.data?.name.split(" ")[0] : employee?.data?.name}
          onPress={() => {
            navigation.goBack();
            refetch();
          }}
        />
      </Flex>

      <Pressable
        style={styles.createPostIcon}
        shadow="0"
        borderRadius="full"
        borderWidth={3}
        borderColor="#FFFFFF"
        onPress={() => {
          navigation.navigate("New Feed", {
            refetch: refetchPersonalFeeds,
            postRefetchHandler: postRefetchHandler,
            loggedEmployeeImage: loggedEmployeeImage,
            loggedEmployeeName: userSelector?.name,
            employeeId: employeeId,
          });
        }}
      >
        <Icon as={<MaterialCommunityIcons name="pencil" />} size={30} color="#FFFFFF" />
      </Pressable>

      <Flex flex={1} minHeight={2} gap={2} height={height}>
        {/* Content here */}
        <FeedCard
          posts={personalPosts}
          loggedEmployeeId={loggedEmployeeId}
          loggedEmployeeName={userSelector?.name}
          loggedEmployeeImage={loggedEmployeeImage}
          onToggleLike={postLikeToggleHandler}
          postRefetchHandler={postRefetchHandler}
          postEndReachedHandler={postEndReachedHandler}
          personalFeedsIsFetching={personalFeedsIsFetching}
          refetchPersonalFeeds={refetchPersonalFeeds}
          refetchFeeds={refetch}
          employee={employee}
          toggleTeammates={toggleTeammates}
          teammates={teammates}
          teammatesIsOpen={teammatesIsOpen}
          hasBeenScrolled={hasBeenScrolled}
          setHasBeenScrolled={setHasBeenScrolled}
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
