export const getInitials = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return "U";

  const first = firstName?.charAt(0).toUpperCase() ?? "";
  const last = lastName?.charAt(0).toUpperCase() ?? "";

  return `${first}${last}` || "U";
};
