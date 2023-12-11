import { Box, Icon, Input, Pressable } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SearchBox = ({ handleSearch, inputToShow, setInputToShow, searchInput, setSearchInput }) => {
  return (
    <Box bgColor="#FFFFFF">
      <Input
        m={4}
        value={inputToShow}
        variant="unstyled"
        size="lg"
        placeholder="Search..."
        borderColor="white"
        bgColor="#F8F8F8"
        InputLeftElement={<Icon as={<MaterialCommunityIcons name="magnify" />} size="lg" ml={2} color="muted.400" />}
        InputRightElement={
          inputToShow && (
            <Pressable
              onPress={() => {
                setInputToShow("");
                setSearchInput("");
              }}
            >
              <Icon as={<MaterialCommunityIcons name="close" />} size="lg" mr={3} />
            </Pressable>
          )
        }
        onChangeText={(value) => {
          handleSearch(value);
          setInputToShow(value);
        }}
      />
    </Box>
  );
};

export default SearchBox;
