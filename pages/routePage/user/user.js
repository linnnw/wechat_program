import request from '../../../utils/request.js'
import { $stopWuxRefresher, $stopWuxLoader } from '../../../dist/index'
// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: [],
        count: 0,
        scrollTop: 0,
        userdata: [],
        currentUsername: [],
        name: '',
        page: 1
    },
    selectUser(e) {
        console.log(e.currentTarget.dataset.oid)
        let oid = e.currentTarget.dataset.oid;
        let r = e.currentTarget.dataset.isadmin == 2 ? 1 : 2;
        let text = e.currentTarget.dataset.isadmin == 2 ? '是否取消管理员' : '是否设置为管理员';
        // console.log(r)

        wx.showModal({
            title: '提示',
            content: text,
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    request._post(`/setAdmin?r=${r}&oid=${oid}`, {}, res => {
                        // console.log(res)
                        const pages = getCurrentPages()
                        //声明一个pages使用getCurrentPages方法
                        const perpage = pages[pages.length - 1]
                        //声明一个当前页面
                        perpage.onLoad()
                        //执行刷新
                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })


    },
    selectColl(e) {
        let oid = e.currentTarget.dataset.oid;
        let r = e.currentTarget.dataset.ischeck == 2 ? 1 : 2;
        let textuser = e.currentTarget.dataset.ischeck == 2 ? '是否禁用用户' : '是否审核通过';

        wx.showModal({
            title: '提示',
            content: textuser,
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    request._post(`/checkChange?r=${r}&oid=${oid}`, {}, res => {
                        // console.log(res)
                        const pages = getCurrentPages()
                        //声明一个pages使用getCurrentPages方法
                        const perpage = pages[pages.length - 1]
                        //声明一个当前页面
                        perpage.onLoad()
                        //执行刷新
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    name(e) {
        // console.log(e)
        this.setData({
            name: e.detail.value
        })
    },
    search() {
        this.getUserData();
    },
    onPageScroll(e) {
        this.setData({
          scrollTop: e.scrollTop
        })
      },
    // 下拉刷新
    onRefresh() {
        // console.log('onRefresh')
        this.getUserData();
        $stopWuxRefresher()
    },
    onLoadmore() {
        this.setData({
            page: this.data.page += 1
        })
        request._post('/getUser', { "page": this.data.page, name: this.data.name, ownerName: wx.getStorageSync('user').name, "pageSize": 15 }, res => {
            // console.log(res.data.tableData);
            if (res.data.tableData.length > 0) {

                this.setData({
                    userdata: this.data.userdata.concat(res.data.tableData)
                })
                $stopWuxLoader()
                // console.log(this.data.real)
            } else {
                $stopWuxLoader('#wux-refresher', this, true)
            }

        })
        console.log('onLoadmore')

    },
    getUserData() { /* 获取数据 */
        this.setData({
            page: 1
        })
        request._post('/getUser', { "page": this.data.page, name: this.data.name, ownerName: wx.getStorageSync('user').name, "pageSize": 10 }, res => {
            // console.log(res)
            this.setData({
                userdata: res.data.tableData,
                currentUsername: wx.getStorageSync('user').name,
            })
            console.log(this.data.currentUsername)
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getUserData()
    }
})