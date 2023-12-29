import React, { useCallback, useRef } from "react";

import _ from "lodash";

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
    <Input
      // m={4}
      // variant="unstyled"
      // size="lg"
      // borderColor="white"
      // bgColor="#F8F8F8"
      ref={searchFormRef}
      placeHolder="Search..."
      startIcon="magnify"
      endIcon={globalKeyword && "close"}
      onPressEndIcon={() => {
        searchFormRef.current.clear();
        setGlobalKeyword("");
      }}
      onChangeText={(value) => keywordSearchHandler(value)}
    />
  );
};

export default GlobalSearchInput;
