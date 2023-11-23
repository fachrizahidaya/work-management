import React from "react";

const BandAttachmentModal = () => {
  return (
    <Modal isOpen={projectListIsOpen} onClose={toggleProjectList} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Choose Project</Modal.Header>
        <Modal.Body>
          <Input
            value={inputToShow}
            placeholder="Search here..."
            InputRightElement={
              inputToShow && (
                <Pressable
                  onPress={() => {
                    setInputToShow("");
                    setSearchInput("");
                  }}
                >
                  <Icon
                    as={<MaterialCommunityIcons name="close-circle-outline" />}
                    size="md"
                    mr={2}
                    color="muted.400"
                  />
                </Pressable>
              )
            }
            onChangeText={(value) => {
              handleSearch(value);
              setInputToShow(value);
            }}
          />
          <Box flex={1} height={300} mt={4}>
            <FlashList
              data={projectList?.data}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Flex my={1} gap={2} flexDirection="row">
                  <Pressable
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="#bdbdbd"
                    padding={1}
                  >
                    <Icon as={<MaterialCommunityIcons name="lightning-bolt" />} color="#FFFFFF" size={5} />
                  </Pressable>
                  <TouchableOpacity onPress={() => selectProjectHandler(item)}>
                    <Text fontSize={14} fontWeight={400} color="#000000">
                      {item?.title}
                    </Text>
                    <Text fontSize={12} fontWeight={400} color="#b2b2b2">
                      #{item?.project_no}
                    </Text>
                  </TouchableOpacity>
                </Flex>
              )}
            />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default BandAttachmentModal;
