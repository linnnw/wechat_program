import request from '../../../utils/request.js'
// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userdata: []
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


        // let that = this;
        // let index = e.currentTarget.dataset.index
        // index += 1;
        // wx.request({
        //     url: 'http://192.168.0.100:9999/admin/api/usergz',
        //     data: { id: index },
        //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     // header: {}, // 设置请求的 header
        //     success: function(res) {
        //         // success
        //         that.getUserData();
        //     }
        // })

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

        // let that = this;
        // let index = e.currentTarget.dataset.index
        // index += 1;
        // wx.request({
        //     url: 'http://192.168.0.100:9999/admin/api/usersc',
        //     data: { id: index },
        //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     // header: {}, // 设置请求的 header
        //     success: function (res) {
        //         // success
        //         that.getUserData();
        //     }
        // })
    },
    getUserData() { /* 获取数据 */
        request._post('/getUser', { "page": 1, "pageSize": 15 }, res => {
            console.log(res)
            this.setData({
                userdata: res.data.tableData
            })
        })

        // var that = this;
        // wx.request({
        //     url: 'http://192.168.0.100:9999/admin/api/queryuser',
        //     data: {},
        //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     // header: {}, // 设置请求的 header
        //     success: function(res) {
        //         // success
        //         that.setData({
        //             userdata: res.data
        //         })
        //     }
        // })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getUserData()
    }
})