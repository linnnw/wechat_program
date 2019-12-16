// pages/setup/setup.js
import request from '../../utils/request.js'
import { $stopWuxRefresher, $stopWuxLoader } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    count: 0,
    scrollTop: 0,
    show: false,
    setup: [],
    page: 1,
    flag: true,
    ipnval: 0,
    user: [],
    hasOnShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('user')
    })
    request._post('/wx_gate_load_more', { "text": this.data.ipnval, "pageSize": 10 }, res => {
      if (res.data.tableData != null && res.data.tableData != undefined) {
        this.setData({
          setup: res.data.tableData,
          page: this.data.page += 1
        })
        if (this.data.setup.length == 0) {
          // console.log(1)
          this.setData({
            show: true
          })
        }
      } else {
        if (this.data.setup.length == 0) {
          // console.log(1)
          this.setData({
            show: true
          })
        }
      }

    })
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  onPulling() {
    // console.log('onPulling')
  },
  // 下拉刷新
  onRefresh() {
    // console.log('onRefresh')
    this.searchto();
    $stopWuxRefresher()
  },
  more: (e) => {
    let itemdata = JSON.stringify(e.currentTarget.dataset.itemdata)
    wx.navigateTo({
      url: '/pages/routePage/printer/printer?itemdata=' + itemdata
    })
  },
  jumpUser: () => {
    wx.navigateTo({
      url: '/pages/routePage/user/user'
    })
  },
  onLoadmore() {
    if (this.data.flag) {
      request._post('/wx_gate_load_more', { "text": this.data.ipnval, "page": this.data.page, "pageSize": 10 }, res => {
        // console.log(res)
        // console.log(res.data.tableData)
        // let data = res.data.tableData
        let data = res.data.tableData;
        if (data.length > 0) {
          this.setData({
            setup: this.data.setup.concat(data),
            page: this.data.page += 1
          })
          $stopWuxLoader()
          // console.log(this.data.setup)
        } else {
          
          $stopWuxLoader('#wux-refresher', this, true)
          this.setData({
            flag: false
          })
        }
        
      })


    }
  },
  load() {
    
  },
  search() {  /* 按搜索图标搜索 */
    this.searchto();
  },
  doSearch() {    /* 按回车键搜索 */
    this.searchto();
  },
  searchto() {    /* 搜索方法 */
    this.setData({
      page: 1
    })
    request._post('/wx_gate_load_more', { "text": this.data.ipnval, "pageSize": 10 }, res => {
      // console.log(res.data.tableData)
      this.setData({
        setup: res.data.tableData,
        page: this.data.page += 1,
        flag: true
      })
    })
  },

  ipnval: function (e) {
    // console.log(e.detail.value)
    this.setData({
      ipnval: e.detail.value
    })
  },
  erweima() {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res.result)
        wx.navigateTo({
          url: '../routePage/printer/printer?result='+res.result})
        // wx.navigateTo({
        //   url: '../routePage/printer?result='+res.result})
      }
    })
  },
  logout() {
    wx.showModal({
      title: '提示',
      content: '是否退出账号',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          request._post('/logout', {}, res => {
            if (res.data.status == 200) {
              wx.clearStorage();
              wx.redirectTo({
                url: '../login',
                success: function(res){
                  // success
                  console.log(res)
                }
              })
              console.log('退出成功')
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      // current: 'setup'
      selected: 4
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})