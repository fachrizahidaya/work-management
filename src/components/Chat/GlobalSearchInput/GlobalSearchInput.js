import React, { useCallback, useRef } from "react";

import _ from "lodash";

import { Icon, Input, Pressable } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
      m={4}
      ref={searchFormRef}
      variant="unstyled"
      size="lg"
      placeholder="Search..."
      borderColor="white"
      bgColor="#F8F8F8"
      InputLeftElement={<Icon as={<MaterialCommunityIcons name="magnify" />} size="lg" ml={2} color="muted.400" />}
      InputRightElement={
        globalKeyword && (
          <Pressable
            onPress={() => {
              searchFormRef.current.clear();
              setGlobalKeyword("");
            }}
          >
            <Icon as={<MaterialCommunityIcons name="close" />} size="lg" mr={3} />
          </Pressable>
        )
      }
      onChangeText={(value) => keywordSearchHandler(value)}
    />
  );
};

export default GlobalSearchInput;
