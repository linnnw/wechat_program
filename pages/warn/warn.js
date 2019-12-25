import request from '../../utils/request.js'
import { $stopWuxRefresher, $stopWuxLoader } from '../../dist/index'
Page({
    data: {
        items: [],
        count: 0,
        scrollTop: 0,

        _show: false,
        show: false,
        warndata: [],
        page: 1,
        ipnval: ''
    },
    onLoad: function (options) {
        console.log(this.getTabBar())
        // 生命周期函数--监听页面加载
        this.setData({
            show: getApp().globalData.login_show
        })
        // console.log(wx.getStorageSync('user'))
        let user = wx.getStorageSync('user');
        // console.log(user.status)
        if (user.status == 1) {
            console.log(11)
            getApp().globalData.login_show = true
            this.setData({
                show: getApp().globalData.login_show
            })
            request._post('/suppliesWarning/search', { "client_name": this.data.ipnval, "page": this.data.page, "pageSize": 10 }, res => {
                console.log(res)
                this.setData({
                    warndata: res.data.list
                })
                if (this.data.warndata.length == 0) {
                    this.setData({
                        _show: true
                    })
                } else {
                    this.setData({
                        _show: false
                    })
                }
            })
        }

        // perpage.onLoad()
    },
    onShow: function () {
        // getCurrentPages()[getCurrentPages().length - 1].onLoad()
        // console.log(123)
        // 生命周期函数--监听页面显示
        if (this.data.show !== getApp().globalData.login_show) {
            this.setData({
              show: getApp().globalData.login_show
            })
            this.getWarnData();
          }
        this.getTabBar().setData({
            // current: 'setup'
            selected: 3
        })
    },
    myevent() {
        this.setData({
            show: getApp().globalData.login_show
        })
        request._post('/suppliesWarning/search', { "client_name": this.data.ipnval, "page": this.data.page, "pageSize": 10 }, res => {
            console.log(res)
            this.setData({
                warndata: res.data.list
            })
            if (this.data.warndata.length == 0) {
                this.setData({
                    _show: true
                })
            } else {
                this.setData({
                    _show: false
                })
            }
        })
    },
    handlewarn(e) {
        let that = this;
        wx.showModal({
            title: '处理',
            content: '是否确认处理',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    request._post('/suppliesWarning/deal', { "devid": e.currentTarget.dataset.devid }, res => {
                        console.log(res)
                        if (res.data.status == 200) {
                            request._post('/suppliesWarning/search', { "client_name": that.data.ipnval, "page": that.data.page, "pageSize": 10 }, res => {
                                console.log(res)
                                that.setData({
                                    warndata: res.data.list
                                })
                                wx.showLoading();
                                wx.hideLoading();
                                setTimeout(() => {

                                    wx.showToast({
                                        title: '处理成功',
                                        icon: 'success',//当icon：'none'时，没有图标 只有文字
                                        duration: 2000
                                    })
                                    setTimeout(() => {
                                        wx.hideToast();
                                    }, 2000)
                                }, 0);
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    getWarnData() {
        request._post('/suppliesWarning/search', { "client_name": this.data.ipnval, "page": this.data.page, "pageSize": 10 }, res => {
            this.setData({
                warndata: res.data.list
            })
            if (this.data.warndata.length == 0) {
                this.setData({
                    _show: true
                })
            } else {
                this.setData({
                    _show: false,
                    page: this.data.page += 1
                })
            }
        })
    },
    search() {
        this.setData({
            page: 1
        })
        this.getWarnData()
    },
    doSearch() {    /* 按回车键搜索 */
        this.setData({
            page: 1
        })
        this.getWarnData()
    },
    ipnval: function (e) {
        console.log(e.detail.value)
        this.setData({
            ipnval: e.detail.value
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
        this.setData({
            page: 1
        })
        this.getWarnData()
        $stopWuxRefresher()
    },
    onLoadmore() {
        request._post('/suppliesWarning/search', { "client_name": this.data.ipnval, "page": this.data.page, "pageSize": 10 }, res => {
            if (res.data.list.length > 0) {
                this.setData({
                    warndata: this.data.warndata.concat(res.data.list)
                })
                if (this.data.warndata.length == 0) {
                    this.setData({
                        _show: true
                    })
                } else {
                    this.setData({
                        _show: false,
                        page: this.data.page += 1
                    })
                }
                $stopWuxLoader()
            } else {
                $stopWuxLoader('#wux-refresher', this, true)
            }

        })

    }
})