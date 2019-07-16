'use strict';
;(function (env, name, definition) {  // 检测上下文环境是否为AMD或CMD
  var hasDefine = typeof define === 'function';  // 检查上下文环境是否为Node
  var hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) define(name, definition);// AMD环境或CMD环境
  else if (hasExports) module.exports = definition();   // 定义为普通Node模块
  else env[name] = definition();   // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
})(this, 'calendarHelper', function () {

  let getType = function (args) {
    var type = Object.prototype.toString.call(args);
    var result = type.replace(/\[object\s+(\w+)\]/gmi, "$1");
    return result.toLowerCase();
  };
  let formatDate = function (date, splitChar) {
    date = date || new Date();
    splitChar = splitChar || '-';

    var type = getType(date);
    if (type === "number") date = new Date(date);
    else if (type === 'string') date = new Date(parseInt(date));
    else if (type !== 'date') date = new Date();

    //var str = date.toString(); // Sun Apr 01 2018 21:57:48 GMT+0800 (CST)
    var year = date.getFullYear();
    var month = addZero(date.getMonth() + 1);
    var day = addZero(date.getDate());
    var res = year + '-' + month + '-' + day;
    if (splitChar && splitChar !== '-') res = res.replace(/-/gmi, splitChar);
    return res;

    function addZero(n) {
      return n < 10 ? '0' + n : n;
    }
  };

  let CalendarHelper = {
    /**
     * 将时间戳转换为日期；如果是date类型，复制一个日期返回；参数不合法时，返回当前时间
     * @param {(date|string|number)} [date=new Date()] - 需要格式化的日期
     * @returns {Date} 格式化好的时间
     * */
    parseDate: function (date) {
      let type = getType(date);
      if (type === 'number') date = new Date(date);
      else if (type === 'string') date = new Date(parseInt(date));
      else if (type !== 'date') date = new Date();
      return new Date(date.getTime());
    },

    /**
     * 生成一个月的日历数据
     * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
     * @param {number} [curDate=new Date()] - 当前日期/需要选中的日期，默认选中今天，表现在对象的today属性上
     * @param {boolean} [fixRows=false] - 是否需要固定周数，每月有四周或五周或六周；默认为false，返回当前月份前后占用的实际周数数据；如果设置为true，则统一返回六周，其他的用下个月来补；
     * @param {boolean} [monday=false] - 第一天是否为周一，即是否按照周一到周日的顺序排列数据；默认为false，按周日到周六的顺序排列；如果设置为true，则按照周一到周日的顺序排列；
     * @returns {Array} 生成的日历数据
     * 数组每一项属性：
     {
        curMonth: Number (-1,0,1),  // 是否为当前月份的数据（第一个参数d对应的月份），0：当前月，-1：上一个月，1：下一个月
        today: Boolean, // 是否为当前日期（当前日期是否为curDate对应的日期）
        date: Date,     // 当前这一天的日期对象
        ts: Number,     // 当前这一天的时间戳
        year: Number,   // 当前这一天的年
        month: Number,  // 当前这一天的月，值范围：1-12
        day: Number,    // 当前这一天的日，值范围：1-31
        week: Number,   // 当前这一天是周几，值范围：0-6
        weekIdx: Number, // 当前这一天属于该月的第几周，值范围：1-6
        days: Number,     // 当前这一个月的天数，取值范围：28-31
        dateStr: String ('2018-10-31'), // 当前这一天的日期字符串
     };
     * */
    getMonthData: function (d, curDate, fixRows, monday) {
      monday = monday === true;
      let date = d;
      let year = date.getFullYear();
      let month = date.getMonth();
      let firstDayWeek = CalendarHelper.getMonthFirstWeek(date);
      let resultArr = [];
      let curStr = formatDate(curDate);
      let weekLen = fixRows === true ? 6 : CalendarHelper.getWeeks(date, monday);
      let num = 0;
      if (monday) {
        firstDayWeek = firstDayWeek || 7;
        num = 1;
      }

      for (let w = 0; w < weekLen; w++) {
        let arr = [];
        for (let d = 0; d < 7; d++) {
          let index = w * 7 + d;
          let dayNum = index - firstDayWeek + 1 + num;
          let day = createDay(dayNum);
          arr.push(day);
        }
        resultArr.push(arr);
      }

      return resultArr;

      function createDay(_dayNum) {
        let day = {
          curMonth: 0, // 是否为当前月
          today: false, // 是否为当前日期
          date: new Date(year, month, _dayNum), // 日期对象

          ts: 0,  //时间戳
          year: 2018,  // 年
          month: 1, //月 1-12
          day: 1,   // 日    1-31
          week: 0,   //周几   0-6
          weekIdx: 1, // 当月的第几周 1-6
          days: 31,// 当月天数 28-31
          dateStr: '2018-10-31', // 日期字符串
        };

        let tmpDate = day.date;
        day.ts = tmpDate.getTime();
        day.year = tmpDate.getFullYear();
        day.month = tmpDate.getMonth() + 1;
        day.curMonth = day.month - month - 1;
        day.day = tmpDate.getDate();
        day.week = tmpDate.getDay();
        day.weekIdx = CalendarHelper.getWeekByDate(tmpDate, monday);
        day.days = CalendarHelper.getDays(tmpDate);
        day.dateStr = formatDate(tmpDate);
        if (day.dateStr === curStr) day.today = true;
        return day;
      }
    },

    /**
     * 获取某个月份有多少天
     * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
     * @returns {Number} 返回当前年月的天数
     * */
    getDays: function (d) {
      let date = CalendarHelper.parseDate(d);
      let month = date.getMonth();
      date.setDate(1);
      date.setMonth(month + 1); // 下个月一号
      date.setDate(0);  // 上个月的最后一天
      return date.getDate();
    },

    /**
     * 获取某个月前后占用的周数
     * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
     * @param {boolean} [monday=false] - 第一天是否为周一，即是否按照周一到周日的顺序排列数据；默认为false，按周日到周六的顺序排列；如果设置为true，则按照周一到周日的顺序排列；
     * @returns {Number} 返回当前年月所占用的周数
     * */
    getWeeks: function (d, monday) {
      let date = CalendarHelper.parseDate(d);
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);
      return CalendarHelper.getWeekByDate(date, monday);
    },

    /**
     * 获取一个日期在这个月属于第几周
     * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
     * @param {boolean} [monday=false] - 第一天是否为周一，即是否按照周一到周日的顺序排列数据；默认为false，按周日到周六的顺序排列；如果设置为true，则按照周一到周日的顺序排列；
     * @returns {Number} 返回第几周
     * */
    getWeekByDate: function (d, monday) {
      monday = monday === true;
      let date = CalendarHelper.parseDate(d);
      let firstDayWeek = CalendarHelper.getMonthFirstWeek(date);
      let days = date.getDate();
      let count = 0;
      if (!monday) count = (days + firstDayWeek - 1) / 7
      else {
        firstDayWeek = firstDayWeek || 7;
        count = (days + firstDayWeek - 2) / 7;
      }
      return parseInt(count) + 1;
    },

    /**
     * 获取一个月份第一天是周几
     * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
     * @returns {Number} 返回周几（0-6）
     * */
    getMonthFirstWeek: function (d) {
      let date = CalendarHelper.parseDate(d);
      date.setDate(1);
      return date.getDay();
    },
  };

  return CalendarHelper;
});
