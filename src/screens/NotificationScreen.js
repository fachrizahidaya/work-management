import React, { useEffect, useState } from "react";

import { FlashList } from "@shopify/flash-list";
import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Skeleton, Spinner } from "native-base";

import { useFetch } from "../hooks/useFetch";
import NotificationItem from "../components/Notification/NotificationItem/NotificationItem";
import PageHeader from "../components/shared/PageHeader";
import NotificationTimeStamp from "../components/Notification/NotificationTimeStamp/NotificationTimeStamp";
import axiosInstance from "../config/api";

const NotificationScreen = ({ route }) => {
  const { module, refetch } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const [cumulativeNotifs, setCumulativeNotifs] = useState([]);

  const notificationFetchParameters = {
    page: currentPage,
    limit: 20,
  };

  const { data: notifications, isFetching: notifIsFetching } = useFetch(
    module === "BAND" ? "/pm/notifications" : "/hr/notifications",
    [currentPage],
    notificationFetchParameters
  );

  const fetchMoreData = () => {
    if (currentPage < notifications?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (notifications?.data?.data?.length) {
      setCumulativeNotifs((prevData) => [...prevData, ...notifications?.data?.data]);
    }
  }, [notifications]);

  useEffect(() => {
    const readAllNotifications = async () => {
      try {
        await axiosInstance.get(module === "BAND" ? "/pm/notifications/read" : "/hr/notifications/read");
        refetch();
      } catch (error) {
        console.log(error);
      }
    };

    readAllNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Flex marginHorizontal={16} marginVertical={13} flex={1} style={{ gap: 24 }}>
        <PageHeader backButton={false} title="Notifications" />

        {cumulativeNotifs.length > 0 ? (
          <FlashList
            data={cumulativeNotifs}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.1}
            onEndReached={fetchMoreData}
            estimatedItemSize={50}
            ListFooterComponent={notifIsFetching && <Spinner color="primary.600" size="sm" />}
            renderItem={({ item, index }) => (
              <>
                {cumulativeNotifs[index - 1] ? (
                  item?.created_at.split(" ")[0] !== cumulativeNotifs[index - 1]?.created_at.split(" ")[0] ? (
                    <>
                      <NotificationTimeStamp
                        key={`${item.id}_${index}_timestamp-group`}
                        timestamp={item?.created_at.split(" ")[0]}
                      />
                    </>
                  ) : (
                    ""
                  )
                ) : (
                  <NotificationTimeStamp timestamp={item?.created_at.split(" ")[0]} />
                )}

                <NotificationItem
                  name={item.from_user_name}
                  modul={item.modul}
                  content={item.description}
                  itemId={item.reference_id}
                  time={item.created_at}
                />
              </>
            )}
          />
        ) : (
          <Skeleton h={41} />
        )}
      </Flex>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
