import dayjs from "dayjs";

import { Box, Flex, Icon, Pressable, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";

const AttendanceAttachment = ({ attachment, toggle, setAttachmentId, forceRenderer }) => {
  return (
    <Flex gap={3} my={2} px={3}>
      <Flex style={styles.header}>
        <Text fontSize={14}>Attachment(s)</Text>
        {attachment?.data.length > 0 && <Icon onPress={toggle} as={<MaterialCommunityIcons name="plus" />} size={5} />}
      </Flex>
      <Box gap={2} flex={1}>
        {attachment?.data.length > 0 ? (
          <FlashList
            data={attachment?.data}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.1}
            extraData={forceRenderer}
            estimatedItemSize={30}
            renderItem={({ item, index }) => (
              <Flex style={styles.card}>
                <Flex flexDirection="row" alignItems="center" gap={3}>
                  <Icon as={<MaterialCommunityIcons name="file-outline" />} size={6} />
                  <Box>
                    <Text fontSize={14} fontWeight={500}>
                      {item?.title}
                    </Text>
                    <Text fontSize={12} fontWeight={400} opacity={0.5}>
                      {dayjs(item?.begin_date).format("DD MMM YYYY")} - {dayjs(item?.end_date).format("DD MMM YYYY")}
                    </Text>
                  </Box>
                </Flex>
                <Icon
                  onPress={() => setAttachmentId(item?.id)}
                  as={<MaterialCommunityIcons name="trash-can-outline" />}
                  size={6}
                />
              </Flex>
            )}
          />
        ) : (
          <Box gap={3} alignItems="center" justifyContent="center">
            <Pressable onPress={toggle} style={styles.addIcon}>
              <Icon as={<MaterialCommunityIcons name="plus" />} size={75} />
            </Pressable>
            <Text>No Data</Text>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default AttendanceAttachment;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addIcon: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#E8E9EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
