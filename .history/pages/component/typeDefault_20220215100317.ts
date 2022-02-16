// 各种类型的默认值
export default (type) => {
  switch (type) {
    case "boolean":
      return false;
    case "number":
      return 0;
    case "string":
      return "";
    case "object":
      return {};
    case "array":
      return [];
    case "function":
      return () => {};
    case "symbol":
      return Symbol();
    case "date":
      return new Date();
    case "regexp":
      return /.*/;
    case "checkbox":
      return [];
    case "radio":
      return "";
    default:
      return "";
  }
};
