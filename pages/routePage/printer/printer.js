import request from '../../../utils/request.js'
import WxValidate from "../../../utils/WxValidate.js";
// pages/printer/printer.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ip: '',
        name: '',
        printappid: '',
        currentData: '',
        app: []  /* 盒子信息 */
    },
    back: () => {
        //执行刷新
        wx.navigateBack({
            delta: 1 // 回退前 delta(默认为1) 页面
        })
    },
    ip(e) {
        this.setData({
            ip: e.detail.value
        })
    },
    name(e) {
        this.setData({
            name: e.detail.value
        })
    },
    printappid(e) {
        this.setData({
            printappid: e.detail.value
        })
    },
    erweima() {
        // 只允许从相机扫码
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {

            }
        })
    },
    jumpBox() {
        let data = this.data.currentData
        wx.navigateTo({
            url: '/pages/routePage/box/box?itemdata=' + data
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 判断是哪个页面跳转来的
        let pages = getCurrentPages();
        let prevpage = pages[pages.length - 2];
        console.log(prevpage.route)

        if (prevpage.route == 'pages/setup/setup') {
            // console.log(options.result);
            let apid = options.result;
            request._post(`/appInfo?appid=${apid}`, {}, res => {
                console.log(res)
                if (res.data.status == 200) {
                    let dev = res.data.dev
                    this.setData({
                        ip: dev.ip,
                        name: dev.fackname,
                        printappid: dev.appid
                    })
                    if (res.data.app != null && res.data.app != undefined) {
                        let appdata = JSON.stringify(res.data.app)
                        this.setData({
                            currentData: appdata
                        })
                        // console.log(this.data.currentData)

                    } else {
                        wx.showLoading();
                        wx.hideLoading();
                        setTimeout(() => {
                          wx.showToast({
                            title: '未绑定',
                            icon: 'none',//当icon：'none'时，没有图标 只有文字
                            duration: 2000
                          })
                          setTimeout(() => {
                            wx.hideToast();
                          }, 2000)
                        }, 0);
                    }
                }
            })
        } else {
            this.setData({
                currentData: options.itemdata
            })
            let itemdata = JSON.parse(options.itemdata)
            // console.log(itemdata)
            this.setData({
                ip: itemdata.devip,
                name: itemdata.devicefackname,
                printappid: itemdata.appid
            })
        }

        this.initValidate()//验证规则函数
    },
    initValidate() {
        let rules = {
            ip: {
                required: true,
                maxlength: 21
            },
            name: {
                required: true,
                maxlength: 21
            }

        }

        let message = {
            ip: {
                required: 'ip不能为空',
                maxlength: '字段不能超过21个字'
            },
            name: {
                required: '名字不能为空',
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


        request._post('/saveDev', {
            "ip": this.data.ip,
            "fackname": this.data.name,
            "appid": this.data.printappid
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