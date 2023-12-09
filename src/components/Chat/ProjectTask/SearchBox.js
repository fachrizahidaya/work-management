import { Box, Icon, Input, Pressable } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SearchBox = () => {
  return (
    <Box bgColor="#FFFFFF">
      <Input
        m={4}
        //   ref={searchFormRef}
        variant="unstyled"
        size="lg"
        placeholder="Search..."
        borderColor="white"
        bgColor="#F8F8F8"
        InputLeftElement={<Icon as={<MaterialCommunityIcons name="magnify" />} size="lg" ml={2} color="muted.400" />}
        InputRightElement={
          // globalKeyword && (
          <Pressable
          // onPress={() => {
          //   searchFormRef.current.clear();
          //   setGlobalKeyword("");
          // }}
          >
            <Icon as={<MaterialCommunityIcons name="close" />} size="lg" mr={3} />
          </Pressable>
          // )
        }
        //   onChangeText={(value) => keywordSearchHandler(value)}
      />
    </Box>
  );
};

export default SearchBox;
