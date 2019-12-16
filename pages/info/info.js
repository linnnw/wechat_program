import request from '../../utils/request.js'
import { $stopWuxRefresher, $stopWuxLoader } from '../../dist/index'


Page({
  data: {
    items: [],
    count: 0,
    scrollTop: 0,
    ipn_value: '',
    show: false,
    real: [],
    page: 1,
    flag: true,
  },
  onShow: function () {
    // console.log(this.getTabBar())
    this.getTabBar().setData({
      // current: 'info'
      selected: 2
    })
  },
  onLoad() {
    // $startWuxRefresher()
    request._post('/wx_index_load_more', { 'text': this.data.ipnval, "pageSize": 10 }, res => {
      console.log(res);
      if (res.data.tableData != null && res.data.tableData != undefined) {
        let getreal = res.data.tableData
        for (let i = 0; i < getreal.length; i++) {
          getreal[i].basic = JSON.parse(getreal[i].basic);
          getreal[i].loss = JSON.parse(getreal[i].loss);
          getreal[i].status = JSON.parse(getreal[i].status);
        }
        this.setData({
          real: getreal,
          page: this.data.page += 1
        })
        if (this.data.real.length == 0) {
          // console.log(1)
          this.setData({
            show: true
          })
        }
      } else {
        if (this.data.real.length == 0) {
          // console.log(1)
          this.setData({
            show: true
          })
        }
      }

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
    // console.log('onRefresh')
    this.searchto(this.data.ipn_value);
    $stopWuxRefresher()
  },
  search(e) {
    // console.log(e)
    this.setData({
      ipn_value: e.detail.value
    })
    this.searchto(e.detail.value);
  },
  onLoadmore() {
    if (this.data.flag) {
      request._post('/wx_index_load_more', { 'text': this.data.ipn_value, "page": this.data.page, "pageSize": 10 }, res => {
        // console.log(res.data.tableData);
        if (res.data.tableData.length > 0) {
          let getreal = res.data.tableData
          for (let i = 0; i < getreal.length; i++) {
            getreal[i].basic = JSON.parse(getreal[i].basic);
            getreal[i].loss = JSON.parse(getreal[i].loss);
            getreal[i].status = JSON.parse(getreal[i].status);
          }

          this.setData({
            real: this.data.real.concat(getreal),
            page: this.data.page += 1
          })
          $stopWuxLoader()


          // console.log(this.data.real)
        } else {
          // wx.showLoading();
          // wx.hideLoading();
          // setTimeout(() => {
          //   wx.showToast({
          //     title: '全部加载完毕',
          //     icon: 'success',//当icon：'none'时，没有图标 只有文字
          //     duration: 2000
          //   })
          //   setTimeout(() => {
          //     wx.hideToast();
          //   }, 2000)
          // }, 0);
          // console.log('没有更多数据')
          $stopWuxLoader('#wux-refresher', this, true)
          this.setData({
            flag: false
          })
        }

      })
    }



    console.log('onLoadmore')
    
  },
  
  searchto(text = '') {
    console.log(text)
    this.setData({
      page: 1
    })
    request._post('/wx_index_load_more', { 'text': text, "page": this.data.page, "pageSize": 10 }, res => {
      // console.log(res);

      let getreal = res.data.tableData
      for (let i = 0; i < getreal.length; i++) {
        getreal[i].basic = JSON.parse(getreal[i].basic);
        getreal[i].loss = JSON.parse(getreal[i].loss);
        getreal[i].status = JSON.parse(getreal[i].status);

      }
      this.setData({
        real: getreal,
        flag: true,
        page: this.data.page += 1
      })
      // const pages = getCurrentPages()
      // //声明一个pages使用getCurrentPages方法
      // const perpage = pages[pages.length - 1]
      // //声明一个当前页面
      // perpage.onLoad()
      // //执行刷新
    })
  }
})