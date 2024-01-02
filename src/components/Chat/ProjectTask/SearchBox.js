import { View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../shared/Forms/Input";

const SearchBox = ({ handleSearch, inputToShow, setInputToShow, searchInput, setSearchInput }) => {
  return (
    <View style={{ backgroundColor: "#FFFFFF" }}>
      <Input
        // m={4}
        value={inputToShow}
        // variant="unstyled"
        // size="lg"
        placeHolder="Search..."
        // borderColor="white"
        // bgColor="#F8F8F8"
        startIcon="magnify"
        endIcon="close"
        onPressEndIcon={() => {
          setInputToShow("");
          setSearchInput("");
        }}
        // InputLeftElement={<Icon as={<MaterialCommunityIcons name="magnify" />} size="lg" ml={2} color="muted.400" />}
        // InputRightElement={
        //   inputToShow && (
        //     <Pressable
        //       onPress={() => {
        //         setInputToShow("");
        //         setSearchInput("");
        //       }}
        //     >
        //       <Icon as={<MaterialCommunityIcons name="close" />} size="lg" mr={3} />
        //     </Pressable>
        //   )
        // }
        onChangeText={(value) => {
          handleSearch(value);
          setInputToShow(value);
        }}
      />
    </View>
  );
};

export default SearchBox;
