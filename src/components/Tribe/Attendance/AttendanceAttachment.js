import { FlashList } from "@shopify/flash-list";
import dayjs from "dayjs";
import { Box, Flex, Icon, Image, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AttendanceAttachment = ({ attachment, toggle, onSelectFile, onDelete, setAttachmentId, forceRenderer }) => {
  return (
    <Flex gap={3} my={2} px={3}>
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text fontSize={14}>Attachment(s)</Text>
        <Icon onPress={toggle} as={<MaterialCommunityIcons name="plus" />} size={5} />
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
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
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
          <Box alignItems="center" justifyContent="center">
            <Image
              alt="attachment"
              h={150}
              w={180}
              resizeMode="cover"
              source={require("../../../assets/vectors/empty.png")}
            />
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default AttendanceAttachment;
