import create from '../../../utils/create'
create({
  properties: {
    addflag: {    //显示搜索框右侧部分
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {
      }
    },
    addimg: {       //显示搜索框右侧部分icon
      type: String,
      value: ''
    },
    searchstr: {     //input  值
      type: String,
      value: ''
    },
    searchflag: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '请输入...'
    },
  },
  data: {
    showClear: false,
    blur: false,
  },
  methods: {
    //获得焦点
    getfocus() {
      this.setData({
        searchflag: true,
        blur: true,
      })
    },
    //搜索框右侧按钮事件
    addhandle() {
      this.triggerEvent("addhandle");
    },
    addclick() {
      this.triggerEvent("addclick");
    },
    //搜索输入
    searchList(e) {
      let input = e.detail.value
      if (input.length) {
        this.setData({
          showClear: true,
        })
      } else {
        this.setData({
          showClear: false,
        })
      }
      this.triggerEvent("searchList", e);
    },
    //查询
    endsearchList(e) {

      this.triggerEvent("endsearchList");
    },
    //失去焦点
    blursearch() {
      this.setData({
        blur: false,
      })
    },
    // 搜索
    search() {
      this.triggerEvent("search");
    },
    //清空搜索框
    activity_clear(e) {
      this.setData({
        showClear: false,
      })
      this.triggerEvent("activity_clear");
    },

  }
})
