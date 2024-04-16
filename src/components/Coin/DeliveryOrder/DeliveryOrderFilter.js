import { Pressable, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../shared/Forms/Input";

const DeliveryOrderFilter = ({ inputToShow, setInputToShow, handleSearch, setSearchInput }) => {
  return (
    <Input
      value={inputToShow}
      onChangeText={(value) => {
        handleSearch(value);
        setInputToShow(value);
      }}
      placeHolder="Search DO..."
      endAdornment={
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {inputToShow && (
            <Pressable
              onPress={() => {
                setInputToShow("");
                setSearchInput("");
              }}
            >
              <MaterialCommunityIcons name="close" size={20} color="#3F434A" />
            </Pressable>
          )}
        </View>
      }
    />
  );
};

export default DeliveryOrderFilter;
