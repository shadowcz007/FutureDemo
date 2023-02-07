// index.js
// const app = getApp()
const {
  envList
} = require('../../envList.js');
//{"title":"未来职业","tip":"源自无界社区Mixlab的前沿职业探索","showItem":false,"items":[{"collection":"N1","desciption":"世界是由设计师和工程师创造的？","page":"select","background":"../../images/61b255c1-810c-4a96-80ad-778e2f1b28ee.jpeg","data":{"home":{"title":"未来的你从事什么工作??","question":"目前职业","choices":["设计师","程序员","创业者","直接开始"]},"pages":[{"question":"当你看到一个有趣的活动时，你会选择：","choices":["放弃机会观察一下","抓住机会去尝试","谨慎衡量所有可能性","直接忽略"]},{"question":"你更喜欢：","choices":["批判性思维","系统性思维","想象力","行动导向"]},{"question":"你更乐意：","choices":["面对新情况","熟悉的状况","无论哪个都行","不做任何选择"]},{"question":"你感觉你做的比较好的是：","choices":["批判","推理","创造","完美"]},{"question":"你更喜欢安静的心情：","choices":["是","否","有时","不确定"]},{"question":"你更喜欢自己做决定：","choices":["是","否","有时","不确定"]}],"answersData":[{"title":"元宇宙设计师","answer":"BAADAA","description":"表明你更倾向于抓住机会去尝试、批判性思考、适应新情况、批判、愿意安静、和乐于做出决定。"},{"title":"人工智能Youtuber","answer":"BBBADC","description":"表明你更倾向于抓住机会去尝试、系统性思考、适应新情况、推理、愿意安静、和乐于做出决定。"},{"title":"程序员Youtuber","answer":"CBCDBD","description":"表明你更倾向于谨慎衡量所有可能性、系统性思考、适应新情况、创造、愿意安静、和乐于做出决定。"},{"title":"NFT艺术大家","answer":"DCAACA","description":"表明你更倾向于直接忽略、想象力、适应新情况、批判、愿意安静、和乐于做出决定。"},{"title":"设计糕点师","answer":"ADABCD","description":"表明你更倾向于放弃机会观察一下、宜人、被动适应新情况、推理、不愿意安静、和乐于做出决定。"},{"title":"NFT医生","answer":"ADCBBA","description":"表示你更倾向于放弃机会观察一下、宜人、被动适应新情况、推理、愿意安静、和不乐于做出决定。"},{"title":"设计医生","answer":"CACDDA","description":"表示你更倾向于谨慎衡量所有可能性、宜人、被动适应新情况、创造、愿意安静、和乐于做出决定。"},{"title":"程序化模特","answer":"ACBBCC","description":"表示你更倾向于抓住机会去尝试、外向、被动适应新情况、创造、愿意安静、和乐于做出决定。"},{"title":"人工智能艺术家","answer":"ABDCBD","description":"表示你更倾向于抓住机会去尝试、开放、被动适应新情况、创造、愿意安静、和乐于做出决定。"},{"title":"Youtube糕点师","answer":"BDCDAA","description":"表示你更倾向于抓住机会去尝试、尽责、被动适应新情况、完美、愿意安静、和乐于做出决定。"},{"title":"NFT宗师","answer":"AABACB","description":"表示你更倾向于放弃机会观察一下、开放、被动适应新情况、批判、愿意安静、和乐于做出决定。"}]}}]}

Page({
  data: {
    // showUploadTip: false,
    powerList: null,
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    appLogo: '../../images/logo.png'
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    this.setData({
      powerList
    });
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    let data = e.currentTarget.dataset.data;
    wx.setStorageSync('select', data)
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}&collection=${e.currentTarget.dataset.collection}`,
    });
  },
  onLoad(opts) {
    console.log('openChannelsUserProfile', wx.canIUse('openChannelsUserProfile'))
    console.log(opts)
    wx.showLoading({
      title: '',
    })
    let indexData = wx.getStorageSync('index');
    let goToPost = false;
    let powerList = [];
    if (indexData) {
      goToPost = indexData.createDate != (new Date()).getDate();
      powerList = indexData.powerList;
    } else {
      goToPost = true;
    };
    console.log(goToPost)
    if (goToPost) {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: this.data.selectedEnv.envId
        },
        data: {
          type: 'getOpenId',
          collection: 'BASE_INIT'
        }
      }).then((resp) => {
        wx.hideLoading();
        console.log(resp)
        powerList = resp.result.data.data;
        wx.setStorageSync('index', {
          powerList,
          createDate: (new Date()).getDate()
        })
        this.setData({
          powerList
        });
      }).catch((e) => {
        wx.hideLoading();
        console.log(e)
      });
    } else {
      this.setData({
        powerList
      });
      wx.hideLoading();
    }
  },
  jumpVideoChannel() {
    console.log('jumpVideoChannel')
    // if (wx.canIUse('openChannelsUserProfile')) {
    //   wx.openChannelsUserProfile({
    //     finderUserName: 'sphyFKjtwe0EVXk',
    //     success: console.log,
    //     fail: () => {
    //       this.showModal()
    //     },
    //     complete: console.log
    //   })
    // } else {
    //   this.showModal()
    // }

    let powerList=this.data.powerList;

    let feeds={};
    for (const p of powerList) {
      for (const item of p.items) {
        for (const an of item.data.answersData) {
          if(an.feedId&&an.finderUserName) feeds[an.feedId+an.finderUserName]={
            feedId:an.feedId,
            finderUserName:an.finderUserName
          }
        }
      }
    };
    feeds=Object.values(feeds);
    let feed=feeds[Math.floor(Math.random() *feeds.length)]
    wx.openChannelsActivity({
      finderUserName:feed.finderUserName,
      feedId:feed.feedId
    })
  },
  showModal() {
    wx.setClipboardData({
      data: 'shadow.mixlab',
      success(res) {
        wx.showModal({
          title: '提示',
          content: '关注视频号：shadow.mixlab',
          showCancel:false
        })
      }
    })
  },
  onShareTimeline(){
    return {
      title: '我们倒着走向未来'
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '快试试FutureDEMO',
      path: '/pages/index/index'
    }
  }
});