import request from '../../../utils/request.js'
import { $stopWuxRefresher, $stopWuxLoader } from '../../../dist/index'
// pages/infomoremore/infomoremore.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: [],
        count: 0,
        scrollTop: 0,
        show: false,
        day: [],
        page: 1,
        id: 0,
        flag: true,
        options: []
    },
    onRefresh() {
        // console.log('onRefresh')
        this.getData(this.data.options);
        $stopWuxRefresher()
    },

    getData(options) {
        this.setData({
            page: 1
        })
        request._post('/getDayData', {
            "devid_company": options.id,
            "page": this.data.page,
            "pageSize": 10
        }, res => {
            console.log(res)
            this.setData({
                options: options
            })
            // console.log(res)
            this.setData({
                day: res.data.list,
                page: this.data.page += 1,
                id: options.id
            })

            if(this.data.day.length == 0) {
                this.setData({
                    show: true
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.getData(options);
        
        // wx.request({
        //     url: 'http://192.168.0.100:9999/admin/api/queryrecordday',
        //     data: { devid_company: options.id },
        //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     // header: {}, // 设置请求的 header
        //     success: function(res) {
        //         let getreal = res.data
        //         for (let i = 0; i < getreal.length; i++) {
        //             getreal[i].basic = JSON.parse(getreal[i].basic);
        //             getreal[i].loss = JSON.parse(getreal[i].loss);
        //             getreal[i].status = JSON.parse(getreal[i].status);
        //         }
        //         that.setData({
        //             day: getreal
        //         })
        //     }
        // })
    },
    onPageScroll(e) {
        this.setData({
            scrollTop: e.scrollTop
        })
    },
    onPulling() {
        // console.log('onPulling')
    },
    onLoadmore() {
        if (this.data.flag) {
            request._post('/getDayData', {
                "devid_company": this.data.id,
                "page": this.data.page,
                "pageSize": 10
            }, res => {
                if (res.data.list.length > 0) {
                    // console.log(res.data.list)
                    let data = res.data.list

                    this.setData({
                        day: this.data.day.concat(data),
                        page: this.data.page += 1
                    })
                    $stopWuxLoader()
                } else {
                    // wx.showLoading();
                    // wx.hideLoading();
                    // setTimeout(() => {
                    //     wx.showToast({
                    //         title: '全部加载完毕',
                    //         icon: 'success',//当icon：'none'时，没有图标 只有文字
                    //         duration: 2000
                    //     })
                    //     setTimeout(() => {
                    //         wx.hideToast();
                    //     }, 2000)
                    // }, 0);

                    $stopWuxLoader('#wux-refresher', this, true)
                    this.setData({
                        flag: false
                    })
                }

            })
        }
    }
})