import Input from "../../shared/Forms/Input";

const SearchBox = ({ inputToShow, searchInput, toggleSearch, clearSearch, setInputToShow, setSearchInput }) => {
  return (
    <Input
      value={inputToShow}
      startIcon="magnify"
      endIcon="close-circle-outline"
      onPressEndIcon={() => (searchInput === "" ? toggleSearch() : clearSearch())}
      // InputLeftElement={
      //   <Pressable>
      //     <Icon as={<MaterialCommunityIcons name="magnify" />} size="md" ml={2} color="muted.400" />
      //   </Pressable>
      // }
      // InputRightElement={
      //   <Pressable onPress={() => (searchInput === "" ? toggleSearch() : clearSearch())}>
      //     <Icon as={<MaterialCommunityIcons name="close-circle-outline" />} size="md" mr={2} color="muted.400" />
      //   </Pressable>
      // }
      onChangeText={(value) => {
        setInputToShow(value);
        setSearchInput(value);
      }}
      // variant="unstyled"
      // size="md"
      placeHolder="Search"
      // borderRadius={15}
      // borderWidth={1}
      // height={10}
      // my={3}
      // mx={3}
    />
  );
};

export default SearchBox;
