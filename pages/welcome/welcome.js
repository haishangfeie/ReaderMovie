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
    
  },
  onTap:function(){
    // console.log('onTap');
    // wx.navigateTo({
    //   url:"../posts/post"
    // });
    wx.switchTab({
      url:"../posts/post"
    })
  }
})