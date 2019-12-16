// pages/infomore/infomore.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        real: []
    },
    more: (e) => {
        let getid = e.currentTarget.dataset.devid_company
        wx.navigateTo({
            url: '/pages/routePage/info-more-day/info-more-day?id=' + getid,

        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let getjson = JSON.parse(options.basic);
        this.setData({
            real: getjson
        })

    },


})