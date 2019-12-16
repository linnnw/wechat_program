import request from '../../utils/request.js'
const infoapp = getApp();
Component({
    data: {
        time: new Date().getTime()
    },
    properties: {
        real: {
            type: Object,
            value: {}
        }
    },
    methods: {
        more(e) {
            request._post('/getMoreData',{"devid_company": e.currentTarget.dataset.item.devid_company},res => {
                console.log(res)
                let data = JSON.stringify(res.data.data);
                wx.navigateTo({
                    url: '/pages/routePage/info-more/info-more?basic=' + data
                })
            })
            // let index = e.currentTarget.dataset.index;
            // let strbasic = JSON.stringify(this.data.real[index])
            
        }
    },
    lifetimes: {
        attached: function() {
            
            // request._post('/wx/wx_index_load_more',{"page": 1,"pageSize": 10},res => {
            //     console.log(res);
            //     let getreal = res.data.tableData
            //         for (let i = 0; i < getreal.length; i++) {
            //             getreal[i].basic = JSON.parse(getreal[i].basic);
            //             getreal[i].loss = JSON.parse(getreal[i].loss);
            //             getreal[i].status = JSON.parse(getreal[i].status);
            //         }
            //         this.setData({
            //             real: getreal
            //         })
            // })
            // var header;
            // let token = wx.getStorageSync('unionid');
            // header = { 
            //     'content-type': 'application/x-www-form-urlencoded', 
            //     'cookie': token    //读取cookie
            // };
            // // console.log(token)
            // // 在组件实例进入页面节点树时执行
            // var that = this;
            // wx.request({
            //     url: 'http://192.168.0.188:3013/wx/wx_index_load_more',
            //     // data: { cookies: },
            //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            //     header: header, // 设置请求的 header
            //     success: function(res) {
            //         console.log(res)
            //             // let getreal = res.data
            //             // for (let i = 0; i < getreal.length; i++) {
            //             //     getreal[i].basic = JSON.parse(getreal[i].basic);
            //             //     getreal[i].loss = JSON.parse(getreal[i].loss);
            //             //     getreal[i].status = JSON.parse(getreal[i].status);
            //             // }
            //             // that.setData({
            //             //     real: getreal
            //             // })
            //     }
            // })

        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
        }
    }
})