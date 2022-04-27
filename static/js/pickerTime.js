Component({
  /**
   * 组件的属性列表
   */
  properties: {
      range: { //可预约的日期范围。默认日期从今天开始，到第range天后为止，这里设为10天
          type: Number,
          value: 10
      },
      start_time: { //开始时间，设为整点
          type: Number,
          value: 8
      },
      step: { //预约时间的步长，设置为30，表示30分钟
          type: Number
      },
      end_time: { //结束时间，设为整点
          type: Number,
          value: 21
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      isShow: false,
      selectDate: "",
      dialogh: 0,

      //日期列表和时间列表
      date_list: [],
      time_list: []
  },
  attached: function () {
      let start_day = this.ts_string(new Date().getTime());
      console.log('开始时间',start_day); //2021-08-31
      console.log(new Date());
      console.log(this.properties.range)
      console.log('这是什么：',new Date().setDate(new Date().getDate()+ this.properties.range ))
      let end_day = this.ts_string(new Date().setDate(new Date().getDate() + this.properties.range))
      console.log('结束时间：',end_day)
      //获取日期列表
      let date_list = this.getDiffDate(start_day, end_day);
      //获取时间列表
      let time_list = this.getTimeList(this.properties.start_time, this.properties.end_time, this.properties.step);
      console.log(time_list);
      console.log('选择日期：',date_list)
      this.setData({
          // date_time: [date_column, time_column],
          date_list: date_list,
          time_list: time_list,
      })
      //动画
      this.animation = wx.createAnimation({
          duration: 300
      })
      //500rpx转成px
      let dialoghpx = 800 / 750 * wx.getSystemInfoSync().windowWidth
      this.setData({
          dialogh: dialoghpx,
          selectDate: this.data.date_list[0] + this.data.time_list[0]
      })
  },
  methods: {
      getDiffDate(start, end) {
        console.log('开始时间：',start)
        console.log('结束时间：',end)
          let startTime = new Date(start);
          console.log('startTime:',startTime)
          let endTime = new Date(end);
          console.log('endTime:',endTime)
          let dateArr = [];
          while ((endTime.getTime() - startTime.getTime()) >= 0) {
              dateArr.push(this.ts_string01(startTime.getTime()));
              startTime.setDate(startTime.getDate() + 1);
          }
          console.log('dateArr:',dateArr)
          return dateArr;
      },
      zfill(num, length) {
          return (Array(length).join('0') + num).slice(-length);
      },
      //把日期转换成xxxx-xx-xx的形式
      ts_string(timestamp) {
          let d = new Date(timestamp);
          let day = "";
          switch (d.getDay()) {
              case 1:
                  day = "周一";
                  break;
              case 2:
                  day = "周二";
                  break;
              case 3:
                  day = "周三";
                  break;
              case 4:
                  day = "周四";
                  break;
              case 5:
                  day = "周五";
                  break;
              case 6:
                  day = "周六";
                  break;
              case 0:
                  day = "周日";
                  break;
          }
          // let string = (d.getFullYear()) + "-" +
          //     this.zfill((d.getMonth() + 1), 2) + "-" +
          //     this.zfill((d.getDate()), 2) + " (" + day + ")"
          let string = (d.getFullYear()) + "-" +
              this.zfill((d.getMonth() + 1), 2) + "-" +
              this.zfill((d.getDate()), 2) 
              console.log('我是月份？',string)
          return string
      },
      ts_string01(timestamp) {
        let d = new Date(timestamp);
        let day = "";
        switch (d.getDay()) {
            case 1:
                day = "周一";
                break;
            case 2:
                day = "周二";
                break;
            case 3:
                day = "周三";
                break;
            case 4:
                day = "周四";
                break;
            case 5:
                day = "周五";
                break;
            case 6:
                day = "周六";
                break;
            case 0:
                day = "周日";
                break;
        }
        let string = (d.getFullYear()) + "-" +
            this.zfill((d.getMonth() + 1), 2) + "-" +
            this.zfill((d.getDate()), 2) + " (" + day + ")"
        return string
    },
      //获取时间区间列表，输入(起始时间，结束时间，步长)
      getTimeList(start, end, step) {
          let start_time = new Date();
          //设置起始时间
          start_time.setHours(start, 0, 0);
          console.log(start_time);
          //设置结束时间
          let end_time = new Date();
          end_time.setHours(end, 0, 0);
          let startG = start_time.getTime(); //起始时间的格林时间
          console.log('当前时间:',startG)
          let endG = end_time.getTime(); //起始时间的格林时间
          let step_ms = step * 60 * 1000;
          let timeArr = [];
          while (startG <= endG) {
              let time = this.timeAdd(startG, step_ms);
            
              timeArr.push(time);
              startG += step_ms;
          }

          return timeArr;
      },
      timeAdd(time1, add) {
          var nd = new Date(time1); //创建时间对象
          //获取起始时间的时分秒
          var hh1 = nd.getHours();
          var mm1 = nd.getMinutes();
          if (hh1 <= 9) hh1 = "0" + hh1;
          if (mm1 <= 9) mm1 = "0" + mm1;
          nd = nd.valueOf(); //转换为毫秒数
          nd = nd + Number(add);
          nd = new Date(nd);
          var hh2 = nd.getHours();
          var mm2 = nd.getMinutes();
          if (hh2 <= 9) hh2 = "0" + hh2;
          if (mm2 <= 9) mm2 = "0" + mm2;
        //   var time = hh1 + ":" + mm1 + "-" + hh2 + ":" + mm2;
        var time = hh1 + ":" + mm1
          return time; //时间段
      },
      change: function (e) {
          debugger
          const val = e.detail.value;
          //val[0]表示选择的第一列序号，val[1]表示选择的第二列序号
          let select = this.data.date_list[val[0]] + this.data.time_list[val[1]]
          console.log(select);
          this.setData({
              selectDate: select
          })

      },
      showDialog() {
          this.setData({
              isShow: true
          })
          //先向下移动dialog高度，然后恢复原位从而形成从下向上弹出效果
          this.animation.translateY(this.data.dialogh).translateY(0).step()
          this.setData({
              animation: this.animation.export()
          })
      },
      dimsss() {
          //从原位向下移动dailog高度，形成从上向下的收起效果
          this.animation.translateY(this.data.dialogh).step()
          this.setData({
              animation: this.animation.export()
          })
          //动画结束后蒙层消失
          setTimeout(() => {
              this.setData({
                  isShow: false
              })
          }, 300)
      },
      cancel() {
          this.triggerEvent("cancel")
          this.dimsss()
      },
      confirm() {
          this.triggerEvent("confirm", {
              selectDate: this.data.selectDate
          })
          this.dimsss()
      }
  }
})
