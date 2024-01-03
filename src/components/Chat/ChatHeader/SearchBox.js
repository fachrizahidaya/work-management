import Input from "../../shared/Forms/Input";

const SearchBox = ({ inputToShow, searchInput, toggleSearch, clearSearch, setInputToShow, setSearchInput }) => {
  return (
    <Input
      value={inputToShow}
      startIcon="magnify"
      endIcon="close-circle-outline"
      onPressEndIcon={() => (searchInput === "" ? toggleSearch() : clearSearch())}
      onChangeText={(value) => {
        setInputToShow(value);
        setSearchInput(value);
      }}
      placeHolder="Search"
    />
  );
};

export default SearchBox;
