import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { SafeAreaView } from "react-native";
import { Box, Flex, Icon, Image, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../shared/AvatarPlaceholder";
import { useFetch } from "../../hooks/useFetch";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import InAppNotificationCard from "./InAppNotificationCard";
import { useDisclosure } from "../../hooks/useDisclosure";

const Header = () => {
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const moduleSelector = useSelector((state) => state.module);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotificationList, setUnreadNotificationList] = useState([]);
  const {
    isOpen: notificationCardIsOpen,
    open: openNotificationCard,
    toggle: toggleNotificationCard,
  } = useDisclosure(false);
  const { laravelEcho } = useWebsocketContext();
  const { data: myProfile } = useFetch("/hr/my-profile");
  const { data: notifications, refetch: refetchNotifications } = useFetch(
    moduleSelector.module_name === "BAND" ? "/pm/notifications/new" : "/hr/notifications/new"
  );
  const { data: unreads } = useFetch("/chat/unread-message");

  /**
   * Unread messages changes event listener
   */
  const unreadMessagesEvent = () => {
    laravelEcho.channel(`unread.message.${userSelector?.id}`).listen(".unread.message", (event) => {
      openNotificationCard();
      setUnreadMessages(event);
    });
  };

  useEffect(() => {
    const unreadData = notifications?.data.filter((val) => {
      return val.is_read == 0;
    });
    setUnreadNotificationList(unreadData || []);
  }, [notifications]);

  useEffect(() => {
    setInterval(() => {
      refetchNotifications();
    }, 300000);
    refetchNotifications();
  }, [moduleSelector.module_name]);

  useEffect(() => {
    if (unreads) {
      setUnreadMessages({ data: { total_unread: unreads.data.total_unread } });
    }
  }, [unreads]);

  useEffect(() => {
    if (userSelector.id) {
      unreadMessagesEvent();
    }
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <Flex
        direction="row"
        bg="#fff"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={3}
        borderBottomWidth={1}
        borderColor="#E8E9EB"
        position="relative"
      >
        <Flex direction="row" alignItems="center" gap={2}>
          <AvatarPlaceholder size="md" image={userSelector.image} name={userSelector.name} isThumb={false} />

          <Box>
            <Text fontWeight={700} fontSize={18} lineHeight={24}>
              {userSelector.name.length > 30 ? userSelector.split(" ")[0] : userSelector.name}
            </Text>

            {myProfile?.data && <Text fontWeight={400}>{myProfile.data.position_name || "You have no position"}</Text>}
          </Box>
        </Flex>

        <Flex flexDir="row" gap={8} alignItems="center">
          {/* {selectedModule && ( */}
          <Box position="relative">
            <Pressable
              onPress={() =>
                navigation.navigate("Notification", {
                  module: moduleSelector.module_name,
                  refetch: refetchNotifications,
                })
              }
            >
              <Icon as={<MaterialCommunityIcons name="bell-outline" />} color="#3f434b" size="md" />
            </Pressable>

            {unreadNotificationList?.length > 0 && (
              <Box
                style={{
                  height: 22,
                  width: 22,
                }}
                position="absolute"
                top={-12}
                right={-8}
                bgColor="#FD7972"
                borderRadius="full"
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={12} textAlign="center" color="white">
                  {unreadNotificationList.length <= 5 ? unreadNotificationList.length : "5+"}
                </Text>
              </Box>
            )}
          </Box>
          {/* )} */}

          <Pressable onPress={() => navigation.navigate("Chat List")} position="relative">
            {unreadMessages?.data?.total_unread > 0 && (
              <Box
                style={{
                  height: 22,
                  width: 22,
                }}
                position="absolute"
                top={-12}
                right={-8}
                bgColor="#FD7972"
                borderRadius="full"
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={12} textAlign="center" color="white">
                  {unreadMessages?.data?.total_unread <= 5 ? unreadMessages?.data?.total_unread : "5+"}
                </Text>
              </Box>
            )}
            <Image source={require("../../assets/icons/nest_logo.png")} alt="nest" style={{ height: 25, width: 25 }} />
          </Pressable>
        </Flex>

        <InAppNotificationCard
          message={unreadMessages?.notification}
          isOpen={notificationCardIsOpen}
          close={toggleNotificationCard}
        />
      </Flex>
    </SafeAreaView>
  );
};

export default Header;
