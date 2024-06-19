import { memo } from "react";

import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import ContactItem from "./ContactItem";
import EmptyPlaceholder from "../../shared/EmptyPlaceholder";

const height = Dimensions.get("screen").height - 300;

const ContactList = ({
  data,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
  handleFetchMoreContact,
  isFetching,
  isLoading,
  refetch,
  navigation,
  userSelector,
}) => {
  return (
    <View style={{ flex: 1 }}>
      {data?.length > 0 || filteredData?.length ? (
        <FlashList
          data={data.length ? data : filteredData}
          onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={200}
          onEndReached={hasBeenScrolled ? handleFetchMoreContact : null}
          refreshing={true}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          ListFooterComponent={() => isLoading && <ActivityIndicator />}
          renderItem={({ item, index }) => (
            <ContactItem
              key={index}
              id={item?.id}
              name={item?.name}
              position={item?.position_name}
              image={item?.image}
              phone={item?.phone_number}
              email={item?.email}
              user={item?.user}
              user_id={item?.user?.id}
              room_id={item?.chat_personal_id}
              user_name={item?.user?.name}
              user_type={item?.user?.user_type}
              user_image={item?.user?.image}
              loggedEmployeeId={userSelector?.user_role_id}
              navigation={navigation}
              leave_status={item?.is_leave_today}
            />
          )}
        />
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
          <View style={styles.wrapper}>
            <EmptyPlaceholder height={250} width={250} text="No Data" />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default memo(ContactList);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
});
