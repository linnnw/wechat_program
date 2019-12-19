

    function handleOk() {
        let form = this.properties.handleData
        console.log(form)
        // console.log(this.data.remark)
        if (this.data.remark == "" || (this.data.remark.length > 0 && this.data.remark.trim().length == 0)) {
            wx.showModal({
                title: '不能为空',
                content: '请输入内容',
                showCancel: false
            })
            return
        } else {
            request._post('/workOrder/api/return', { "id": form.id, "status": form.status, "type": form.type, "remark": this.data.remark }, res => {
                console.log(res)
                this.setData({
                    visible: false,
                    remark: ''
                })
                this.triggerEvent('handleOk')
            })
        }
    }


module.exports = {
    // 返单成功
    handleOk: handleOk
}