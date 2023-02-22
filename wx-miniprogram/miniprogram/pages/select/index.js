Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 可以设置兜底
    background: '',
    avatar: '',
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
      answer,
      question,
      choices2id,
      id,
      result,
      index
    } = param.currentTarget.dataset;
    // console.log(choices2id)
    let choices2Id=choices2id||[];
    let nextId = choices2Id[index];
    // nextindex = parseInt(nextindex);
    console.log(answer, question, choices2Id, result, index, nextId)

    let selections = this.data.selections;

    if (id >= 0) {
      // 选择结果记录
      selections[id] = {
        type: nextId > 0 ? 'pages' : 'home',
        result,
        answer,
        question,
        createDate: new Date()
      };
      this.setData({
        selections,
        loading: true
      })
    }

    if (choices2Id.length == 0 && nextId == undefined) {
      // 结尾提交
      wx.showLoading({
        title: '',
      });
      this.postData(this.data.selections, () => {
        this.startPages(nextId)
      });
    } else if (id==0&& nextId != undefined) {
      // 开场
      this.postData(this.data.selections)
      this.startPages(nextId);
    } else if (nextId > 0) {
      // 中间页面
      this.setData({
        loading: false
      })
      this.startPages(nextId);
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
    let {
      home,
      pages,
      answersData,
      background,
      avatar
    } = wx.getStorageSync('select')

    // 
    let quotations = home.quotations;
    home.quotation = {};
    if (quotations) home.quotation = quotations[Math.floor(Math.random() * quotations.length)]

    // pages = Array.from(pages, (p, i) => {
    //   if (p.index == undefined) p.index = i;
    //   return p
    // }).filter(p => p);

    // 答案候选集
    let answersJson = {};
    for (const an of answersData) {
      answersJson[an.answer] = an;
    }

    this.getImageUrl({
      background,
      avatar
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

  },
  // ['cloud://xxx.png']
  getImageUrl(cloudUrls = {}) {
    console.log([cloudUrls.background, cloudUrls.avatar])
    wx.cloud.getTempFileURL({
      fileList: [cloudUrls.background, cloudUrls.avatar],
      success: res => {
        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        console.log(res.fileList)
        this.setData({
          background: res.fileList[0].tempFileURL,
          avatar: res.fileList[1].tempFileURL
        });
        setTimeout(() => wx.hideLoading(), 1000)

      },
      fail: console.error
    })

  },
  postData(data, cb) {
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
      this.setData({
        loading: false
      })
      if (cb) cb()
    }).catch((e) => {
      wx.hideLoading();
      console.log(e)
      this.setData({
        loading: false
      })
      if (cb) cb()
    });
  },

  startPages(id) {
    if (id != undefined) {
      id = parseInt(id);
    }
    let page = this.data.pages.filter(p => p.id == id);
    if (page) page = page[0];
    if (page) {
      this.setData({
        isStart: true,
        page
      })
    } else {
      // 出答案
      console.log('出答案',this.data.selections)
      let selections = Array.from(this.data.selections, s => s&&s.result ? s.result : null).filter(r => r).join('');
      console.log('selections', this.data.selections)
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
          // aMatchNum += i < 3 ? 2 : 1;
          aMatchNum += 1;
        }
        if (b[i] === targetStr[i]) {
          // bMatchNum += i < 3 ? 2 : 1;
          bMatchNum += 1;
        }
      }
      // console.log(`${a}:${aMatchNum}   ${b}:${bMatchNum}`);
      return bMatchNum - aMatchNum;
    });
    // console.log(arr);
    console.log('matchAnwser', targetStr, arr, na)
    return na
  },
  jumpPage() {
    wx.navigateTo({
      url: `/pages/share/index?envId=${this.data.envId}&collection=${this.data.collection}`,
    });
  },

});