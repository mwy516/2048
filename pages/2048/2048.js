var Board = require("./grid.js");
var Main = require("./main.js");

Page({
  data: {
    hidden: false,
    num: [],
    score: 0,
    bestScore: 0, // 最高分
    endMsg: '',
    over: false,  // 游戏是否结束
    cellName:{
        "2":"搭讪",
        "4": "暧昧",
        "8": "约会",
        "16": "表白",
        "32": "恋爱",
        "64": "牵手",
        "128": "拥抱",
        "256": "接吻",
        "512": "xxoo",
        "1024": "求婚",
        "2048": "小恩爱",
        "4096": "相濡以沫"
    }
  },
  // 页面渲染完成
  onReady: function () {
    if (!wx.getStorageSync("highScore"))
      wx.setStorageSync('highScore', "搭讪");
    this.gameStart();
  },
  gameStart: function () {  // 游戏开始
    var main = new Main(4);
    this.setData({
      main: main,
      bestScore: wx.getStorageSync('highScore')
    });
    this.data.main.__proto__ = main.__proto__;

    this.setData({
      hidden: true,
      over: false,
      score: '搭讪',
      num: this.data.main.board.grid
    });
  },
  gameOver: function () {  // 游戏结束
    this.setData({
      over: true
    });

    if (this.data.score == 2048) {
      this.setData({
        endMsg: '终于等到你，还好没放弃！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score == 4096){
      this.setData({
        endMsg: '相濡以沫，人生最美不过如此！！'
      });
      wx.setStorageSync('highScore', this.data.score);
    }
     else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      });
    }
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function (ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function (ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function () {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if (this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
    } else {
      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0);  // 确定移动方向
        var data = this.data.main.move(direction);
        this.updateView(data);
      }
    }
  },
  updateView(data) {
    var max = 0;
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        if (data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    switch (max) {
      case 2:
        this.setData({ score: "搭讪" },);
        break;
      case 4:
        this.setData({ score: "暧昧" });
        break;
      case 8:
        this.setData({ score: "约会" });
        break;
      case 16:
        this.setData({ score: "表白" });
        break;
      case 32:
        this.setData({ score: "恋爱" });
        break;
      case 64:
        this.setData({ score: "牵手" });
        break;
      case 128:
        this.setData({ score: "拥抱" });
        break;
      case 256:
        this.setData({ score: "接吻" });
        break;
      case 512:
        this.setData({ score: "xxoo" });
        break;
      case 1024:
        this.setData({ score: "求婚" });
        break;
      case 2048:
        this.setData({ score: "小恩爱" });
        break;
      case 4096:
        this.setData({ score: "相濡以沫" });
        break;
    }
    this.setData({
      num: data,
      // score: max
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '2048小游戏',
      desc: '来试试你能达到多少分',
      path: '/page/user?id=123'
    } 
  }
})