function getActualMetadata(chat) {
  const meta = structuredClone(
    chat.meta
		|| {},
  );

  meta.membersCount = chat.memberEmails?.length
    || 0;

  return meta;
}

module.exports = {
  getActualMetadata,
};
