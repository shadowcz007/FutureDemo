const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser:true
});


// 创建集合云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  let collection = event.collection
  try {
    // 创建集合
    await db.createCollection(collection);
  } catch {

  }

  try {
    await db.collection(collection).add({
      // data 字段表示需新增的 JSON 数据
      data: {
        data: event.data,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
      }
    });

    return {
      success: true,
      // data:{
      //   createDate: new Date(),
      //   data:event.data,
      //   openid: wxContext.OPENID,
      //   appid: wxContext.APPID,
      //   unionid: wxContext.UNIONID,
      // }
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: 'create collection success'
    };
  }
};