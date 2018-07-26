var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
  data: {
    isMsuicPlay: false,
    currentPostid:null
  },
  onLoad: function (options) {
    var postid = options.id;
    this.setData({
      'currentPostid': postid
    });
    // console.log(app.globalData.g_isMusicPlay)
    var postData = postsData.postContent[postid];
    // 设置页面的数据
    this.setData(postData);
    // wx.setStorageSync('key','风暴英雄');
    // 如果对象存在就执行，否则就创建对象，且因为对象不存在，则data没有collected，因此图片也会显示为false
    var postsCollected = wx.getStorageSync('postsCollected');
    if (postsCollected) {
      // 如果该文章还没浏览，postsCollected[postid]会是undefined
      var postCollected = postsCollected[postid];
      this.setData({
        collected: !!postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postid] = false;
      // console.log(postsCollected)
      wx.setStorageSync('postsCollected', postsCollected);
      this.setData({
        collected: false
      })
    }
    // 监听音乐的开始与结束，保持总控音乐开关与自定义的音乐图标样式一致
    var that = this;
    wx.onBackgroundAudioPause(function () {
      if (app.globalData.g_currentMusicPostid === that.data.currentPostid) {
        that.setData(
          { isMsuicPlay: false }
        )
        app.globalData.g_currentMusicPostid = null;
      }
      app.globalData.g_isMusicPlay = false;

    });
    wx.onBackgroundAudioPlay(function () {
      if (app.globalData.g_currentMusicPostid === that.data.currentPostid) {
        that.setData(
          { isMsuicPlay: true }
        )
        app.globalData.g_currentMusicPostid = postid;
      }
      app.globalData.g_isMusicPlay = true;
    });
    // 如果音乐在播放，则修改绑定的变量以显示播放的样式
    if (app.globalData.g_isMusicPlay && app.globalData.g_currentMusicPostid === postid) {
      that.setData(
        { isMsuicPlay: true }
      )
    };
    wx.onBackgroundAudioStop(function () {
      that.setData(
        { isMsuicPlay: false }
      )
      app.globalData.g_isMusicPlay = false;
      app.globalData.g_currentMusicPostid = null;
    })
  },
  onCollectTap: function (e) {
    var collectedVal = this.data.collected;
    // 收藏变成未收藏，未收藏变成收藏        
    collectedVal = !collectedVal;
    // // 更新缓存信息
    // var postsCollected = wx.getStorageSync('postsCollected');
    // postsCollected[this.data.currentPostid] = collectedVal;
    // wx.setStorageSync('postsCollected', postsCollected);
    // // 更新数据绑定变量,实现图片切换
    // this.setData({
    //     collected: collectedVal
    // })
    // 通知反馈
    // if (collectedVal) {
    //   wx.showToast({
    //     title: '成功收藏'
    //   })
    // } else {
    //   wx.showToast({
    //     title: '取消收藏'
    //   })
    // }
    // wx.showToast({
    //     title: collectedVal ? '成功收藏' : '取消收藏'
    // })
    // 调用封装的函数
    this.showToast(collectedVal);

    // 收藏的功能是比较轻的，不需要特意进行确认，这里只是为了体验一下showModal功能
    // this.showModal(collectedVal);
  },
  showToast: function (collectedVal) {
    // 更新缓存信息
    var postsCollected = wx.getStorageSync('postsCollected');
    postsCollected[this.data.currentPostid] = collectedVal;
    wx.setStorageSync('postsCollected', postsCollected);
    // 更新数据绑定变量,实现图片切换
    this.setData({
      collected: collectedVal
    })
    wx.showToast({
      title: collectedVal ? '成功收藏' : '取消收藏'
    })
  },
  // 备份，以下代码将异步与同步获取缓存封装了函数，为了避免可读性太差，不打算使用，只是注释，方便以后查看
  /*
  showToast: function (collectedVal) {

      this.getPostsCollected(collectedVal);
      // this.getPostsCollectedSync(collectedVal);
  },
  getPostsCollected: function (collectedVal) {
      var that = this;
      wx.getStorage({
          key: 'postsCollected',
          success: function (res) {
              var postsCollected = res.data;
              postsCollected[that.data.currentPostid] = collectedVal;
              wx.setStorageSync('postsCollected', postsCollected);
              // 更新数据绑定变量,实现图片切换
              that.setData({
                  collected: collectedVal
              })
              wx.showToast({
                  title: collectedVal ? '成功收藏' : '取消收藏'
              })
          }
      })
  }
  ,
  getPostsCollectedSync: function (collectedVal) {
      // 更新缓存信息
      var postsCollected = wx.getStorageSync('postsCollected');
      postsCollected[this.data.currentPostid] = collectedVal;
      wx.setStorageSync('postsCollected', postsCollected);
      // 更新数据绑定变量,实现图片切换
      this.setData({
          collected: collectedVal
      })
      wx.showToast({
          title: collectedVal ? '成功收藏' : '取消收藏'
      })
  },
  */
  showModal: function (collectedVal) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: collectedVal ? '确定要收藏吗？' : '确定要取消收藏吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          // 更新缓存信息
          var postsCollected = wx.getStorageSync('postsCollected');
          postsCollected[that.data.currentPostid] = collectedVal;
          wx.setStorageSync('postsCollected', postsCollected);
          // 更新数据绑定变量,实现图片切换
          that.setData({
            collected: collectedVal
          })
        }
      }
    })
  },
  onShareTap: function (e) {
    var itemList = [
      '分享到QQ',
      '分享给微信好友',
      '分享到朋友圈'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        // console.log(res)
        wx.showModal({
          title: itemList[res.tapIndex],
          content: '抱歉，当前无法实现分享功能',
          showCancel: false
        })
      }
    })
  },
  onMusicTap: function (e) {
    var postid = this.data.currentPostid;
    var musicInfo = this.data.music;
    if (!this.data.isMsuicPlay) {
      this.setData({
        isMsuicPlay: !this.data.isMsuicPlay
      })
      wx.playBackgroundAudio({
        dataUrl: musicInfo.url,
        title: musicInfo.title,
        coverImgUrl: musicInfo.coverImg
      })
      app.globalData.g_currentMusicPostid = postid;
      app.globalData.g_isMusicPlay = true;
    } else {
      wx.pauseBackgroundAudio();
      this.setData({
        isMsuicPlay: !this.data.isMsuicPlay
      })
      app.globalData.g_currentMusicPostid = postid;
      app.globalData.g_isMusicPlay = false;
    }
  }
})