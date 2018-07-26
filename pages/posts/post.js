var postContent = require("../../data/posts-data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(postContent);
  },
  onPostTap: function (e) {
    // console.log('onPostTap');
    // console.log(e);
    var postid = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid
    })
  },
  onSwiperTap: function (e) {
    var postid = e.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid
    })
  }
})