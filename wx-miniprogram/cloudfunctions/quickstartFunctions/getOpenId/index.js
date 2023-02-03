const cloud = require('wx-server-sdk');

cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser:true
});



// 获取openId云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  const db = cloud.database()
  let collection = event.collection;
  let res = {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  }
  try {
    res.data = await db.collection(collection).get();
  } catch {
    console.log('error', collection)
  }

  return res;
};