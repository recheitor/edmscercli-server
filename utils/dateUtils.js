const addHoursToDates = (doc, hours) => {
  if (!doc) return doc;
  const adjustedDoc = { ...doc };
  if (adjustedDoc.createdAt) {
    adjustedDoc.createdAt = new Date(
      adjustedDoc.createdAt.getTime() + hours * 60 * 60 * 1000
    );
  }
  if (adjustedDoc.updatedAt) {
    adjustedDoc.updatedAt = new Date(
      adjustedDoc.updatedAt.getTime() + hours * 60 * 60 * 1000
    );
  }
  return adjustedDoc;
};

module.exports = { addHoursToDates };
