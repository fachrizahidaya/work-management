export const hyperlinkConverter = (message = "") => {
  const convertedMessage = message.toString();

  if (!convertedMessage) return;

  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  const messageWithLinks = convertedMessage.replace(urlRegex, function (url) {
    const hyperlink = url;
    if (!hyperlink.match("^https?://")) {
      hyperlink = "http://" + hyperlink;
    }
    return (
      '<a href="' +
      hyperlink +
      '" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: #1b76cf;">' +
      url +
      "</a>"
    );
  });

  // Replace newline characters with <br> tags
  return messageWithLinks.replace(/\n/g, "<br>");
};
