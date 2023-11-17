export const MimeTypeInfo = (mime_type) => {
  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];
  const imgTypes = ["jpg", "jpeg", "png"];
  if (!mime_type) return "Undefined";
  const typeArr = mime_type.split("/");

  const getFileType = () => {
    if (imgTypes.includes(typeArr[typeArr.length - 1])) {
      return "image";
    } else if (docTypes.includes(typeArr[typeArr.length - 1])) {
      return "document";
    } else {
      return "not supported";
    }
  };

  return {
    file_type: getFileType(),
    file_ext: typeArr[typeArr.length - 1],
  };
};
