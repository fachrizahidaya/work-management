import React, { useCallback, useRef } from "react";

import _ from "lodash";

import { View } from "react-native";

import Input from "../../shared/Forms/Input";

const GlobalSearchInput = ({ setGlobalKeyword, globalKeyword }) => {
  const searchFormRef = useRef();

  const keywordSearchHandler = useCallback(
    _.debounce((value) => {
      setGlobalKeyword(value);
    }, 500),
    []
  );

  return (
    <View style={{ padding: 10 }}>
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
