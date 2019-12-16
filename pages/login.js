import request from '../utils/request.js';
const app = getApp()
// pages/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '易抄',
    moto: '智能自动抄表，提升运营水平',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //检查有没有使用权限
    bindcode: '',
    session_key: ''
  },
  getUserInfo: function (e) { //获取Userinfo
    console.log(this.data.bindcode)
    // this.data.bindcode = '7ABC89'
    if (this.data.bindcode == 0) {

      wx.showToast({
        title: '请输入绑定码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    console.log(11)
    var that = this;
    if (e.detail.errMsg.indexOf('fail') < 0) {

      // 登录获取OpenID
      wx.login({
        //获取code
        success: res => { //返回code
          //获取用户openid、session_key
          wx.request({
            url: 'https://51yunqi.cn/nw/chkcodeyichaoyun',
            data: {
              code: res.code,
            },
            method: 'GET',
            success: res2 => {
              if (res2.data.result == 'SUCCESS' && res2.data.openid) {
                that.setData({ session_key: res2.data.session_key });
                let session_key = res2.data.session_key;
                //成功获取Userinfo，开始绑定
                wx.request({
                  // url: 'https://tianyihui.cn/machinecl/web/bindcode.do',
                  url: `${getApp().globalData.url}/bindcode`,
                  method: 'POST',
                  data: {
                    wxopenid: res2.data.openid,
                    wxnicname: e.detail.userInfo.nickName,
                    wxnicpic: e.detail.userInfo.avatarUrl,
                    bindcode: that.data.bindcode,
                    session_key: session_key,
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: res3 => {
                    if (res3.data.status == 200) {
                      wx.showLoading();
                      wx.hideLoading();
                      setTimeout(() => {
                        wx.showToast({
                          title: '绑定成功',
                          icon: "success",
                        });
                        setTimeout(() => {
                          wx.hideToast();
                        }, 2000)
                      }, 0);
                      //成功绑定
                      wx.setStorageSync('Loginuser', e.detail.userInfo);
                      wx.setStorageSync('LoginOpenID', res2.data.openid);
                      wx.setStorageSync('unionid', res3.data.unionid);
                      that.setData({
                        userInfo: e.detail.userInfo,
                        hasUserInfo: true
                      });
                      let unionid = wx.getStorageSync('unionid');
                      request._post(`/login?unionid=${unionid}`, {}, res => {
                        console.log(res)
                        if (res.data.status == 200) {
                          wx.setStorageSync('user', res.data.user);
                          if (res.header['Set-Cookie'] != undefined) {
                            wx.setStorageSync('cookie', res.header['Set-Cookie']);
                          }
                          if (res.header['set-cookie'] != undefined) {
                            wx.setStorageSync('cookie', res.header['set-cookie']);
                          }
                          wx.switchTab({ url: './statement/statement' })
                        }
                      })
                      // wx.switchTab({ url: './statement/statement' })

                    } else {
                      wx.showToast({
                        title: res3.data.msg,
                        icon: 'none',
                        duration: 2000,
                        mask: true
                      })
                    }
                  },
                  fail: (getUserInfoError) => {
                    wx.showToast({
                      title: '绑定失败' + JSON.stringify(getUserInfoError),
                      icon: 'none',
                      duration: 1000,
                      mask: true
                    })
                  }
                })
              }
            },
            fail: () => {
              wx.showToast({
                title: '身份识别异常',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              return;
            }
          })
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let hasError = options.hasError;
    if (hasError === '1') {
      wx.removeStorageSync('unionid');
      wx.removeStorageSync('LoginOpenID');
      wx.removeStorageSync('Loginuser');
    }
    wx.login({
      success: res => {
        this.setData({ code: res.code });
      },
      fail: error => {
        wx.showToast({
          title: '获取用户登录态失败' + JSON.stringify(error),
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
    let unionid = wx.getStorageSync('unionid');
    let openid = wx.getStorageSync('LoginOpenID');
    let user = wx.getStorageSync('Loginuser');
    if (unionid && openid && user) {
      request._post(`/login?unionid=${unionid}`, {}, res => {
        console.log(res)
        if (res.data.status == 200) {
          wx.setStorageSync('user', res.data.user);
          if (res.header['Set-Cookie'] != undefined) {
            wx.setStorageSync('cookie', res.header['Set-Cookie']);
          }
          if (res.header['set-cookie'] != undefined) {
            wx.setStorageSync('cookie', res.header['set-cookie']);
          }
          wx.switchTab({ url: './statement/statement' })
        }
      }, err => {
        console.log(err);
      })
    }

  },

  getbindcode: function (e) {
    var val = e.detail.value;
    console.log(val)
    this.setData({
      bindcode: val
    });
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

  },
  wxsetting: function () {
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {

        }
      })
    } else {

    }
  }

})