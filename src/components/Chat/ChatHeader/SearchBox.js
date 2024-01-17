import { useCallback } from "react";
import _ from "lodash";

import Input from "../../shared/Forms/Input";

const SearchBox = ({ toggleSearch, searchMessage, setSearchMessage, searchFormRef }) => {
  const messageSearchHandler = useCallback(
    _.debounce((value) => {
      setSearchMessage(value);
    }, 500),
    []
  );

  return (
    <Input
      innerRef={searchFormRef}
      startIcon="magnify"
      endIcon={searchMessage ? "close-circle-outline" : "close"}
      onPressEndIcon={() => {
        if (searchMessage) {
          searchFormRef.current.clear();
          setSearchMessage("");
        } else {
          toggleSearch();
        }
      }}
      onChangeText={(value) => messageSearchHandler(value)}
      placeHolder="Search..."
    />
  );
};

export default SearchBox;
