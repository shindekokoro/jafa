module.exports = {
  findAndDeleteMany: async function (Model, filter) {
    const removeFind = await Model.find(filter);
    const removed = await Model.deleteMany(filter);
    
    // If deletedCount is greater than 0, return the removed documents
    return removed.deletedCount > 0 ? removeFind : null;
  }
};
