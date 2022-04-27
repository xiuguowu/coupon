function initTimer(_target) {
  var that = _target;
  var index = that.data.index && that.data.index.length > 0 ? that.data.index : [0, 0];
  var timer = [];
  if (index[0] == 0) {
    var hours = new Date().getHours();
    timer = joinTogetherTimer(hours);
  } else {
    timer = joinTogetherTimer(null);
  }

  var times = ['今天', '明天', '后天'];

  var timeArr = [];
  timeArr.push(times);
  timeArr.push(timer);
  _target.setData({
    index: index,
    times: timeArr,
    chooseVal: ''
  });
}





function joinTogetherTimer(currentHours) {
  var startTime = 8;
  var endTime = 20;
  var timer = [];
  var timerChar
  for (var i = startTime; i < endTime; i++) {
    if (currentHours && i <= currentHours) {
      continue;
    }
    console.log(i)
    if(i==19){
      timerChar = i + ":00:00 ~ " + (i + 1) + ":00:00";
    }else if(i==8){
      timerChar = "08:00:00 ~ 10:00:00";
    }else if(i==9){
      timerChar = "09:00:00 ~ 11:00:00";
    }else{
      timerChar = i + ":00:00 ~ " + (i + 2) + ":00:00";
    }
    ++i
    timer.push(timerChar);
  }
  return timer;
}

function getDataInfo(_target){
  var index = _target.data.index;
  var timerArr = _target.data.times;
  var days = timerArr[0];
  var hours = timerArr[1];

  var chooseVal = days[index[0]] + " " + hours[index[1]];
  _target.setData({
    chooseVal: chooseVal
  });
}

module.exports = {
  initTimer: initTimer,
  getDataInfo: getDataInfo
}