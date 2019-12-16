import request from '../../../utils/request.js'
import WxValidate from "../../../utils/WxValidate.js";
// pages/box/box.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item: [
            {
                name: '手动输入',
                checked: true
            },
            {
                name: '自动获取',
                // checked: true
            }
        ],
        flag: false,
        getip: '',
        getmask: '',
        getgate: '',
        boxappid: '',
        itemdata: {}

    },
    getip(e) {
        this.setData({
            getip: e.detail.value
        })
    },
    getmask(e) {
        this.setData({
            getmask: e.detail.value
        })
    },
    getgate(e) {
        this.setData({
            getgate: e.detail.value
        })
    },
    back: () => {
        wx.navigateBack({
            delta: 1 // 回退前 delta(默认为1) 页面
        })
    },

    radioChange: function (e) {
        let itemdata = this.data.itemdata
        if (e.detail.value == '自动获取') {
            this.setData({
                flag: true,
                getip: '',
                getmask: '',
                getgate: ''
            })
        } else {
            this.setData({
                flag: false,
                getip: itemdata.ip == 'auto' ? '' : itemdata.ip,
                getmask: itemdata.mask,
                getgate: itemdata.gate,
            })
        }
    },
    erweima() {
        // 只允许从相机扫码
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                this.setData({
                    appid: res.result
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(JSON.parse(options.itemdata))
        let appdata = JSON.parse(options.itemdata)
        if (appdata.ip == 'auto') {
            this.setData({
                item: [
                    {
                        name: '手动输入',
                        // checked: true
                    },
                    {
                        name: '自动获取',
                        checked: true
                    }
                ],
                itemdata: appdata
            })
        } else {
            let _ip = appdata.ip == 'auto' ? '' : appdata.ip
            this.setData({
                itemdata: appdata,
                getip: _ip,
                getmask: appdata.mask,
                getgate: appdata.gate,
                boxappid: appdata.appid
            })
        }



        // if(options){

        // }
        // let itemdata = JSON.parse(options.itemdata)
        // console.log(itemdata)

        this.initValidate()//验证规则函数

    },
    initValidate() {
        let rules = {
            getip: {
                required: true,
                maxlength: 21
            },
            getmask: {
                required: true,
                maxlength: 21
            },
            getgate: {
                required: true,
                maxlength: 21
            }

        }

        let message = {
            getip: {
                required: 'ip不能为空',
                maxlength: '字段不能超过21个字'
            },
            getmask: {
                required: '掩码不能为空',
                maxlength: '字段不能超过21个字'
            },
            getgate: {
                required: '网关不能为空',
                maxlength: '字段不能超过21个字'
            }
        }
        //实例化当前的验证规则和提示消息
        this.WxValidate = new WxValidate(rules, message);
    },
    //调用验证函数
    formSubmit: function (e) {
        // console.log('form发生了submit事件，携带的数据为：', e.detail.value)
        const params = e.detail.value
        //校验表单
        if (!this.WxValidate.checkForm(params)) {
            const error = this.WxValidate.errorList[0]
            this.showModal(error)
            return false
        }


        request._post('/saveApp', {
            "ip": this.data.getip,
            "mask": this.data.getmask,
            "gate": this.data.getgate,
            "appid": this.data.appid
        }, res => {

            wx.showLoading();
            wx.hideLoading();
            setTimeout(() => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',//当icon：'none'时，没有图标 只有文字
                    duration: 2000
                })
                setTimeout(() => {
                    wx.hideToast();
                }, 2000)
            }, 0);


        })

    },

    //报错 
    showModal(error) {
        wx.showModal({
            content: error.msg,
            showCancel: false,
        })
    }

})