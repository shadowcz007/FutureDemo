const getOpenId = require('./getOpenId/index');
const createCollection = require('./createCollection/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'createCollection':
      return await createCollection.main(event, context);
  }
};
