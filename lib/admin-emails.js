export const parseAdminEmails = (value) => {
  if (!value) return [];
  return value
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const getAdminEmails = () => {
  const fromList = parseAdminEmails(process.env.ADMIN_EMAILS);
  if (fromList.length > 0) return fromList;
  const fromSingle = parseAdminEmails(process.env.ADMIN_EMAIL);
  if (fromSingle.length > 0) return fromSingle;
  return [];
};

export const isAdminEmail = (email) => {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return false;
  return adminEmails.includes(email.toLowerCase());
};
