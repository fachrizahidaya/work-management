import React from "react";

import dayjs from "dayjs";

import { FlashList } from "@shopify/flash-list";
import { SafeAreaView, StyleSheet } from "react-native";
import { Flex, Skeleton, Text } from "native-base";

import { useFetch } from "../hooks/useFetch";
import NotificationItem from "../components/Notification/NotificationItem/NotificationItem";
import PageHeader from "../components/shared/PageHeader";
import NotificationTimeStamp from "../components/Notification/NotificationTimeStamp/NotificationTimeStamp";

const NotificationScreen = ({ route }) => {
  const { module } = route.params;
  const { data: notifications, isLoading: notificationIsLoading } = useFetch(
    module === "BAND" ? "/pm/notifications/new" : "/hr/notifications/new"
  );

  return (
    <SafeAreaView style={styles.container}>
      <Flex marginHorizontal={16} marginVertical={13} flex={1} style={{ gap: 24 }}>
        <PageHeader backButton={false} title="Notifications" />

        {!notificationIsLoading ? (
          <FlashList
            data={notifications?.data}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.1}
            estimatedItemSize={50}
            renderItem={({ item, index }) => (
              <>
                {notifications.data[index - 1] ? (
                  item?.created_at.split(" ")[0] !== notifications?.data[index - 1]?.created_at.split(" ")[0] ? (
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
          <Skeleton height={41} />
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
