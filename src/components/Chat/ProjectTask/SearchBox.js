import { View } from "react-native";

import Input from "../../shared/Forms/Input";

const SearchBox = ({ handleSearch, inputToShow, setInputToShow, searchInput, setSearchInput }) => {
  return (
    <View style={{ backgroundColor: "#FFFFFF", padding: 10 }}>
      <Input
        value={inputToShow}
        placeHolder="Search..."
        startIcon="magnify"
        endIcon="close"
        onPressEndIcon={() => {
          setInputToShow("");
          setSearchInput("");
        }}
        onChangeText={(value) => {
          handleSearch(value);
          setInputToShow(value);
        }}
      />
    </View>
  );
};

export default SearchBox;
