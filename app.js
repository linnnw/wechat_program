App({
  onLaunch: function () {

  },
  globalData: {

    login_show: false,
    dot: false,
    // url: "https://51tianyihui.cn/wxv2",
    url: 'http://192.168.0.188:3013/wxv2',
    _base64: '',
    api: '/workOrder/api',
    commonField: () => ({
      id: null,
      bill_code: null,
      type_name: null,
      client_id: null,
      client_name: null,
      relate_name: null,
      relate_phone: null,
      client_address: null,
      create_id: null,
      create_name: null,
      create_time: null,
      handler_id: null,
      handler_name: null,
      technician_id: null,
      technician_name: null,
      arrive_time: null,
      leave_time: null,
      final_price: 0,
      sign: null,
      remark: null,
      status: 0,
      isRobot: 0,
      belong_dept_id: null,
      belong_dept_name: null,
      top_dept_id: null,
      top_dept_name: null,
      data: [],
      imageList: [],
      uploadImageList: [],
      deleteImageList: []
    })
  }
})
