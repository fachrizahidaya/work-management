import { useCallback } from "react";
import _ from "lodash";

import Input from "../../shared/Forms/Input";

const SearchBox = ({
  inputToShow,
  searchInput,
  toggleSearch,
  clearSearch,
  setInputToShow,
  setSearchInput,
  searchMessage,
  setSearchMessage,
  searchFormRef,
}) => {
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
      endIcon={searchMessage && "close-circle-outline"}
      onPressEndIcon={() => {
        searchFormRef.current.clear();
        setSearchMessage("");
      }}
      onChangeText={(value) => messageSearchHandler(value)}
      placeHolder="Search..."
    />
  );
};

export default SearchBox;
