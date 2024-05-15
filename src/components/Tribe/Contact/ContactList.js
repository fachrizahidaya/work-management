import { ActivityIndicator, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import ContactItem from "./ContactItem";
import { memo } from "react";

const ContactList = ({
  data,
  filteredData,
  hasBeenScrolled,
  setHasBeenScrolled,
  handleFetchMoreContact,
  isFetching,
  navigation,
  userSelector,
}) => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 14 }}>
      <FlashList
        data={data.length ? data : filteredData}
        onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={60}
        onEndReached={hasBeenScrolled ? handleFetchMoreContact : null}
        ListFooterComponent={() => isFetching && hasBeenScrolled && <ActivityIndicator />}
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
    </View>
  );
};

export default memo(ContactList);
