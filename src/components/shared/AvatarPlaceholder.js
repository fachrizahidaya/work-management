import React from "react";

import { Avatar } from "native-base";

const AvatarPlaceholder = ({ image, name, size, borderRadius }) => {
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const userInitialGenerator = () => {
    const nameArray = name?.split(" ");
    let alias = "";

    if (nameArray?.length >= 2) {
      alias = nameArray[0][0] + nameArray[1][0];
    } else {
      alias = nameArray[0][0];
    }

    return alias;
  };

  return image ? (
    <Avatar
      source={{
        uri: `${process.env.EXPO_PUBLIC_API}/image/${image}/thumb`,
      }}
      size={size || "xs"}
    />
  ) : (
    <Avatar size={size || "xs"} bgColor={stringToColor(name)} borderRadius={borderRadius}>
      {userInitialGenerator()}
    </Avatar>
  );
};

export default AvatarPlaceholder;
