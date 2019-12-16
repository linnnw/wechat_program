// pages/workRoute/fandanmsg/fandanmsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fandanData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let fandanData = JSON.parse(options.fandanData)
    // console.log(fandanData)
    this.setData({
      fandanData
    })
  }
})