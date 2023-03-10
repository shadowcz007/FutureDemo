// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: '../../images/bg.jpeg',
    avatar: '../../images/avatar.jpeg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      envId,
      collection,
      title,
      description,
      share
    } = options;
    console.log('share', options)
    var value = [];
    if (title && description) {
      value = [{
        title,
        description
      }];
      wx.clearStorageSync('selections');

    } else {
      value = wx.getStorageSync('result');
    };
    console.log(value)
    // value=null
    if(value){
      this.setData({
        index: 0,
        result: value[0],
        data: value,
        envId,
        collection,
        share: !!share
      })
    }else{
      this.setData({share:true})
    }

  },
  next() {
    try {
      let index = this.data.index;
      index++;
      let res = this.data.data[index];
      if (res) {
        this.setData({
          result: res,
          index
        })
      } else {
        this.setData({
          index: 0,
          result: this.data.data[0]
        })
      }
    } catch (error) {
      this.setData({
        index: 0,
        result: this.data.data[0]
      })
    }
    // console.log(this.data)
  },
  like(param) {
    const {
      title,
      value
    } = param.currentTarget.dataset;
    let selections = wx.getStorageSync('selections') || [];
    console.log(selections)
    if(this.data.clickedLike) return
    this.setData({
      clickedLike: true
    })
    this.postData([...selections, {
      type: 'like',
      question: title,
      answer: value,
      createDate: new Date()
    }].filter(r => r))
    this.jumpVideoChannel()
  },
  unlike() {
    this.next();
    this.setData({
      clickedLike: false
    })
  },
  jumpVideoChannel() {
    console.log('jumpVideoChannel')
    let {
      finderUserName,
      feedId
    } = this.data.result;
    if (finderUserName && feedId) {
      wx.openChannelsActivity({
        finderUserName,
        feedId
      })
    } else {
      wx.showToast({
        title: '欢迎分享❤',
        icon: 'success',
        duration: 2000
      })
    }

  },
  goHome() {
    wx.navigateTo({
      url: `/pages/index/index`,
    });
  },
  postData(data) {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'createCollection',
        collection: this.data.collection,
        data: data
      }
    }).then((resp) => {
      wx.hideLoading();
      console.log(resp)
    }).catch((e) => {
      wx.hideLoading();
      console.log(e)
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  sharePage(){
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '我的职业:' + this.data.result.title,
          path: `/pages/share/index?title=${this.data.result.title}&description=${this.data.result.description}&envId=${this.data.envId}&collection=${this.data.collection}&share=true`
        })
      }, 200)
    })
    return {
      title: '看看我的新职业！',
      path: '/pages/index/index',
      promise
    }
  },
  onShareTimeline(){
    this.sharePage()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    this.sharePage()
  }
})