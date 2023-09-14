import React from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Box, Flex, FormControl, Icon, Text } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AttachmentList from "./AttachmentList/AttachmentList";
import { useFetch } from "../../../../../hooks/useFetch";

const AttachmentSection = ({ taskId }) => {
  const { data: attachments } = useFetch(taskId && `/pm/tasks/${taskId}/attachment`);

  return (
    <Flex gap={2}>
      <FormControl>
        <FormControl.Label>ATTACHMENTS</FormControl.Label>
        <ScrollView style={{ maxHeight: 200 }}>
          <Box flex={1} minHeight={2}>
            <FlashList
              data={attachments?.data}
              keyExtractor={(item) => item?.id}
              onEndReachedThreshold={0.1}
              estimatedItemSize={200}
              renderItem={({ item }) => (
                <AttachmentList
                  title={item?.file_name}
                  size={item?.file_size}
                  time={item?.uploaded_at}
                  type={item?.mime_type}
                />
              )}
            />
          </Box>
        </ScrollView>
      </FormControl>

      <TouchableOpacity>
        <Flex flexDir="row" alignItems="center" gap={3}>
          <Icon as={<MaterialCommunityIcons name="plus" />} color="blue.600" size="md" />
          <Text color="blue.600">Add attachment</Text>
        </Flex>
      </TouchableOpacity>
    </Flex>
  );
};

export default AttachmentSection;
