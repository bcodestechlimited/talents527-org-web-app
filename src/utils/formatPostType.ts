export const formatPostType = (type: string) => {
  return type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};
