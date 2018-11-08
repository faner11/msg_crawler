
// 去重复
db.getCollection('site').aggregate([{ $group: { _id: { fakeid: '$fakeid' }, count: { $sum: 1 }, dups: { $addToSet: '$_id' } } }, { $match: { count: { $gt: 1 } } }]).forEach(function (doc) {
  doc.dups.shift();
  db.getCollection('site').remove({ _id: { $in: doc.dups } });
})