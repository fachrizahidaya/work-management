import React, { useEffect, useState } from "react";

const AttachmentPreview = ({ handleClose, file, bandAttachment }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const imgTypes = ["jpg", "jpeg", "png"];
  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const formatMimeType = (type = "") => {
    if (!type) return "Undefined";
    const typeArr = type.split("/");
    return typeArr.pop();
  };

  useEffect(() => {
    if (file && imgTypes.includes(formatMimeType(file.type))) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      return () => URL.revokeObjectURL(file);
    }
  }, [file]);

  return <div>AttachmentPreview</div>;
};

export default AttachmentPreview;
