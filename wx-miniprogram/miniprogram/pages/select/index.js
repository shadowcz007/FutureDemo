Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 可以设置兜底
    background: '',
    avatar:'',
    envId: '',
    isStart: false,
    home: {},
    pages: [],
    selections: [],
    result: 'ABCDEFG'.split('')
  },

  handleClick(param) {
    if (this.data.loading) return
    let {
      answer, question, nextindex, result
    } = param.currentTarget.dataset;
    nextindex=parseInt(nextindex);
    console.log(answer, question, nextindex, result)

    let selections = this.data.selections;

    selections[nextindex] = {
        type:nextindex > 0?'pages':'home',
        result,
        answer, 
        question,
        createDate: new Date()};
    this.setData({ selections, loading: true })

    if (this.data.pages.length == nextindex) {
      wx.showLoading({
        title: '',
      });
      this.postData(this.data.selections,()=>{
        this.startPages(nextindex)
      });
    }else if(nextindex==0) {
      this.postData(this.data.selections)
      this.startPages(nextindex);
    }else{
      this.setData({ loading: false })
      this.startPages(nextindex);
    }
    
  },

  onLoad(options) {
    this.init(options)
  },
  // onShow() {
  //   this.init()
  // },
  init(options) {
    wx.showLoading({
      title: '',
    });
    // 初始化
    console.log(wx.getStorageSync('select'))
    let {home,pages,answersData,background,avatar} = wx.getStorageSync('select')

    // 
    let quotations=home.quotations;
    home.quotation={};
    if(quotations) home.quotation=quotations[Math.floor(Math.random() *  quotations.length)]
    // let home = {
    //   title: '未来的你从事什么工作??',
    //   question: '目前职业',
    //   choices: ['设计师', '程序员', '创业者', '直接开始']
    // };
    // let pages = [
    //   { question: "当你看到一个有趣的活动时，你会选择：", choices: ["放弃机会观察一下", "抓住机会去尝试", "谨慎衡量所有可能性", "直接忽略"] },
    //   { question: "你更喜欢：", choices: ["批判性思维", "系统性思维", "想象力", "行动导向"] },
    //   { question: "你更乐意：", choices: ["面对新情况", "熟悉的状况", "无论哪个都行", "不做任何选择"] },
    //   { question: "你感觉你做的比较好的是：", choices: ["批判", "推理", "创造", "完美"] },
    //   { question: "你更喜欢安静的心情：", choices: ["是", "否", "有时", "不确定"] },
    //   { question: "你更喜欢自己做决定：", choices: ["是", "否", "有时", "不确定"] }
    // ];

    // let answersData = [
    //   {
    //     title: '元宇宙设计师',
    //     answer: 'BAADAA',
    //     description: '表明你更倾向于抓住机会去尝试、批判性思考、适应新情况、批判、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: '人工智能Youtuber',
    //     answer: 'BBBADC',
    //     description: '表明你更倾向于抓住机会去尝试、系统性思考、适应新情况、推理、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: '程序员Youtuber',
    //     answer: 'CBCDBD',
    //     description: '表明你更倾向于谨慎衡量所有可能性、系统性思考、适应新情况、创造、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: 'NFT艺术大家',
    //     answer: 'DCAACA',
    //     description: '表明你更倾向于直接忽略、想象力、适应新情况、批判、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: '设计糕点师',
    //     answer: 'ADABCD',
    //     description: '表明你更倾向于放弃机会观察一下、宜人、被动适应新情况、推理、不愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: 'NFT医生',
    //     answer: 'ADCBBA',
    //     description: '表示你更倾向于放弃机会观察一下、宜人、被动适应新情况、推理、愿意安静、和不乐于做出决定。'
    //   },
    //   {
    //     title: '设计医生',
    //     answer: 'CACDDA',
    //     description: '表示你更倾向于谨慎衡量所有可能性、宜人、被动适应新情况、创造、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: '程序化模特',
    //     answer: 'ACBBCC',
    //     description: '表示你更倾向于抓住机会去尝试、外向、被动适应新情况、创造、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: '人工智能艺术家',
    //     answer: 'ABDCBD',
    //     description: '表示你更倾向于抓住机会去尝试、开放、被动适应新情况、创造、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: 'Youtube糕点师',
    //     answer: 'BDCDAA',
    //     description: '表示你更倾向于抓住机会去尝试、尽责、被动适应新情况、完美、愿意安静、和乐于做出决定。'
    //   },
    //   {
    //     title: 'NFT宗师',
    //     answer: 'AABACB',
    //     description: '表示你更倾向于放弃机会观察一下、开放、被动适应新情况、批判、愿意安静、和乐于做出决定。'
    //   }
    // ];

    pages = Array.from(pages, (p, i) => {
      if (p.index == undefined) p.index = i;
      return p
    }).filter(p => p);

    let answersJson = {};
    for (const an of answersData) {
      answersJson[an.answer] = an;
    }

    this.getImageUrl({
      background,avatar
    })

    let data = {
      loading: false,
      isStart: false,
      home,
      pages,
      answersJson,
      selections: [],
      result: 'ABCDEFG'.split('')
    };
    if (options) {
      data.envId = options.envId;
      data.collection = options.collection;
      // if(options.background) data.bgImage=options.background;
    }
    this.setData(data);
    // console.log(this.data)
    // wx.hideLoading();
  },
  // ['cloud://xxx.png']
  getImageUrl(cloudUrls={}){
    console.log([cloudUrls.background,cloudUrls.avatar])
    wx.cloud.getTempFileURL({
      fileList: [cloudUrls.background,cloudUrls.avatar],
      success: res => {
        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        console.log(res.fileList)
        this.setData({
          background:res.fileList[0].tempFileURL,
          avatar:res.fileList[1].tempFileURL
        });
        setTimeout(()=>wx.hideLoading(),1000)
        
      },
      fail: console.error
    })
    
  },
  postData(data,cb) {
    // console.log(nextIndex)
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
      // this.startPages(nextIndex)
      this.setData({ loading: false })
      if(cb)cb()
    }).catch((e) => {
      wx.hideLoading();
      console.log(e)
      this.setData({ loading: false })
      if(cb)cb()
    });
  },

  startPages(index) {
    index = parseInt(index);
    if (this.data.pages.length > index && index >= 0) {
      this.setData({
        isStart: true,
        page: this.data.pages[index]
      })
    } else if (this.data.pages.length == index) {
      // 出答案
      let selections=Array.from(this.data.selections,s=>s.result?s.result:null).filter(r=>r).join('')
      let res = this.matchAnwser(selections, Object.keys(this.data.answersJson));
      let result4 = [];
      for (const r of res.slice(0, 4)) {
        result4.push(this.data.answersJson[r])
      }
      wx.setStorageSync('result', result4.filter(f => f));
      wx.setStorageSync('selections', this.data.selections)
      this.jumpPage()
    }
  },
  matchAnwser(targetStr = '', arr = []) {
    let na = arr.sort((a, b) => {
      let aMatchNum = 0;
      let bMatchNum = 0;
      for (let i = 0; i < a.length; i++) {
        if (a[i] === targetStr[i]) {
          aMatchNum += i < 3 ? 2 : 1;
        }
        if (b[i] === targetStr[i]) {
          bMatchNum += i < 3 ? 2 : 1;
        }
      }
      // console.log(`${a}:${aMatchNum}   ${b}:${bMatchNum}`);
      return bMatchNum - aMatchNum;
    });
    // console.log(arr);
    return na
  },
  jumpPage() {
    wx.navigateTo({
      url: `/pages/share/index?envId=${this.data.envId}&collection=${this.data.collection}`,
    });
  },

});
