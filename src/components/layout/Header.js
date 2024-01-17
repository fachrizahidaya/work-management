import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { SafeAreaView, View, Pressable, Text, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../shared/AvatarPlaceholder";
import { useFetch } from "../../hooks/useFetch";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import InAppNotificationCard from "./InAppNotificationCard";
import { useDisclosure } from "../../hooks/useDisclosure";
import { TextProps } from "../shared/CustomStylings";

const Header = () => {
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const moduleSelector = useSelector((state) => state.module);
  const [routeName, setRouteName] = useState([]);
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
    laravelEcho?.channel(`unread.message.${userSelector?.id}`)?.listen(".unread.message", (event) => {
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

  useEffect(() => {
    const { routes } = navigation.getState();

    const filteredRoutes = routes.filter((route) => route.name !== "Chat Room");
    setRouteName(filteredRoutes);

    navigation.reset({
      index: filteredRoutes.length - 1,
      routes: filteredRoutes,
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderColor: "#E8E9EB",
          position: "relative",
          display: "flex",
          margin: 0,
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
          {routeName[1]?.name === "Chat List" && (
            <MaterialCommunityIcons name="chevron-left" size={20} onPress={() => navigation.goBack()} color="#3F434A" />
          )}
          <AvatarPlaceholder size="md" image={userSelector.image} name={userSelector.name} isThumb={false} />

          <View>
            <Text
              style={[
                {
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: 24,
                },
                TextProps,
              ]}
            >
              {userSelector.name.length > 30 ? userSelector.split(" ")[0] : userSelector.name}
            </Text>

            {myProfile?.data && (
              <Text style={[{ fontSize: 16 }, TextProps]}>
                {myProfile.data.position_name || "You have no position"}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
          }}
        >
          <View style={{ position: "relative" }}>
            <Pressable
              onPress={() =>
                navigation.navigate("Notification", {
                  module: moduleSelector.module_name,
                  refetch: refetchNotifications,
                })
              }
            >
              <MaterialCommunityIcons name="bell-outline" size={20} color="#3F434A" />
            </Pressable>

            {unreadNotificationList?.length > 0 && (
              <View
                style={{
                  height: 22,
                  width: 22,
                  position: "absolute",
                  top: -12,
                  right: -8,
                  backgroundColor: "#FD7972",
                  borderRadius: 50,
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    display: "flex",
                    fontSize: 12,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  {unreadNotificationList.length <= 5 ? unreadNotificationList.length : "5+"}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={() =>
              routeName[0]?.state?.routeNames[2] == "Setting Tribe"
                ? navigation.navigate("Dashboard")
                : routeName[0]?.state?.routeNames[2] == "Setting Band"
                ? navigation.navigate("Dashboard")
                : navigation.navigate("Chat List")
            }
            style={{ position: "relative" }}
          >
            {!routeName[0]?.state?.routeNames[2].includes("Tribe") &&
              !routeName[0]?.state?.routeNames[2].includes("Band") &&
              unreadMessages?.data?.total_unread > 0 && (
                <View
                  style={{
                    height: 22,
                    width: 22,
                    position: "absolute",
                    top: -12,
                    right: -8,
                    backgroundColor: "#FD7972",
                    borderRadius: 50,
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    {unreadMessages?.data?.total_unread <= 5 ? unreadMessages?.data?.total_unread : "5+"}
                  </Text>
                </View>
              )}

            {routeName[0]?.state?.routeNames[2]?.includes("Tribe") ? (
              <>
                <Image
                  source={require("../../assets/icons/tribe_logo.png")}
                  alt="Tribe"
                  style={{ height: 30, width: 30 }}
                />
              </>
            ) : routeName[0]?.state?.routeNames[2]?.includes("Band") ? (
              <>
                <Image
                  source={require("../../assets/icons/band_logo.png")}
                  alt="Band"
                  style={{ height: 30, width: 30 }}
                />
              </>
            ) : (
              <Image
                source={require("../../assets/icons/nest_logo.png")}
                alt="Nest"
                style={{ height: 30, width: 30 }}
              />
            )}
          </Pressable>
        </View>

        <InAppNotificationCard
          message={unreadMessages?.notification}
          isOpen={notificationCardIsOpen}
          close={toggleNotificationCard}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;
