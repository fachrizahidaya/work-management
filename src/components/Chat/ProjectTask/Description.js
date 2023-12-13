import { Box, ScrollView, Text } from "native-base";

const Description = ({ navigation, description }) => {
  return (
    <Box bgColor="#FFFFFF" gap={2} p={3} borderRadius={10} minH={100} maxH={150}>
      <ScrollView>
        <Text fontSize={14} fontWeight={400}>
          {description}
        </Text>
      </ScrollView>
    </Box>
  );
};

export default Description;
