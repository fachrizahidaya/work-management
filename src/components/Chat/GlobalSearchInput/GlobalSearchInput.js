import React, { useCallback } from "react";

import _ from "lodash";

import { View } from "react-native";

import Input from "../../shared/Forms/Input";

const GlobalSearchInput = ({ setGlobalKeyword, globalKeyword, searchFormRef }) => {
  const keywordSearchHandler = useCallback(
    _.debounce((value) => {
      setGlobalKeyword(value);
    }, 500),
    []
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <Input
        innerRef={searchFormRef}
        placeHolder="Search..."
        startIcon="magnify"
        endIcon={globalKeyword && "close"}
        onPressEndIcon={() => {
          searchFormRef.current.clear();
          setGlobalKeyword("");
        }}
        onChangeText={(value) => keywordSearchHandler(value)}
      />
    </View>
  );
};

export default GlobalSearchInput;
