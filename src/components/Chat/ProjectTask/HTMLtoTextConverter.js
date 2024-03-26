import { Text, View } from "react-native";
import RenderHTML from "react-native-render-html";

const HTMLtoTextConverter = ({ htmlString }) => {
  const renderers = [
    {
      shouldProcessNode: (node) => node.name === "ul",
      processNode: (_, children) => <View style={{}}>{children}</View>,
    },
    {
      shouldProcessNode: (node) => node.name === "li",
      processNode: (_, children) => <Text>- {children}</Text>,
    },
  ];
  return <RenderHTML source={{ html: htmlString }} renderers={renderers} />;
};

export default HTMLtoTextConverter;
