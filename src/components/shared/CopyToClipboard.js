import { useClipboard } from "native-base";
import { useState } from "react";

export const CopyToClipboard = async (text, toast) => {
  try {
    console.log("success");
  } catch (err) {
    console.error("Failed to copy to clipboard", err);
  }
};
