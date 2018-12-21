'use strict';

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

/**
 * 格式化开始时间
 * @param {(date|object)} [obj] - 需要格式化的对象
 * @returns {Date} 格式化好的日期对象
 * */
function formatStart(obj) {
  let now = new Date();
  let type = getType(obj);
  if (type === 'object' && (obj.year || obj.month)) {
    obj.year = obj.year || now.getFullYear();
    obj.month = obj.month || now.getMonth() + 1;
    return new Date(obj.year, obj.month - 1, 1);
  }
  return CalendarHelper.parseDate(obj);
}

/**
 * 格式化时间间隔
 * @param {(date|object)} [obj=new Date()] - 需要格式化的日期
 * @returns {string} 格式化好的时间间隔（月份的个数）
 * */
function formatInterval(obj) {
  let type = getType(obj);
  if (type === 'number') return obj;
  else if (type === 'object' && (obj.year || obj.month)) {
    obj.year = obj.year || 0;
    obj.month = obj.month || 1;
    return obj.year * 12 + obj.month;
  } else return 1;
}

let CalendarHelper = {
  /**
   * 根据参数配置获取日历数据
   * @param {object|number|string} [start] - 开始时间
   * @param {object} [interval] - 以开始时间为基准，需要往前或往后取固定年/月份；为正往后取，为负往前取
   * @param {object} [opts] - 其他配置对象
   * @returns {Array} 日历数组，获取一个月时，返回单月以周为单位的数组；获取多个月时，返回数组，数组的每一项是以周为单位的数组，
   * */
  getCalendar(start, interval, opts) {
    opts = opts || {};
    start = formatStart(start);
    let past = interval && (interval.past === true) || interval < 0;
    interval = Math.abs(formatInterval(interval));

    opts.cur = CalendarHelper.parseDate(opts.cur);
    let end = CalendarHelper.addMonth(start, past ? -interval : interval);
    if (past) start = end;
    opts.fixRows = opts.fixRows === true;

    let arr = [];
    for (let i = 0; i < interval; i++) {
      let curDate = CalendarHelper.addMonth(start, i);
      let resArr = CalendarHelper.getMonthData(curDate, opts.cur, opts.fixRows);
      arr.push(resArr);
    }
    if (arr.length === 1) arr = arr[0];
    return arr;
  },

  /**
   * 将时间戳转换为日期；如果是date类型，复制一个日期返回；参数不合法时，返回当前时间
   * @param {(date|string|number)} [date=new Date()] - 需要格式化的日期
   * @returns {Date} 格式化好的时间
   * */
  parseDate(date) {
    let type = getType(date);
    if (type === 'number') date = new Date(date);
    else if (type === 'string') date = new Date(parseInt(date));
    else if (type !== 'date') date = new Date();
    return new Date(date.getTime());
  },

  /**
   * 在起始时间上往后推count个月份，只考虑年月，不考虑日/天数，即月份+1，年适时+1，日改为1；比如需要在2018-10-31往后推一个月，得到的是2018-11-01；
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {number} [count=1] - 需要添加的月份
   * @returns {Date} 添加月份之后的时间
   * */
  addMonth(d, count) {
    count = getType(count) === 'number' ? count : 1;
    let date = CalendarHelper.parseDate(d);
    date.setDate(1);
    let m = date.getMonth();
    date.setMonth(m + count);
    return date;
  },

  /**
   * 在起始时间上往后推count年，只考虑年，不考虑月日，即年+1，月不变，日改为1；比如需要在2004-02-29加一年，得到的是2005-02-01；
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {number} [count=1] - 需要添加的年
   * @returns {Date} 添加年份之后的时间
   * */
  addYear(d, count) {
    count = count || 1;
    let date = CalendarHelper.parseDate(d);
    let y = date.getFullYear();
    date.setFullYear(y + count);
    return date;
  },

  /**
   * 生成一个月的日历数据
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {number} [curDate=new Date()] - 当前日期/需要选中的日期，默认选中今天，表现在对象的today属性上
   * @param {boolean} [fixRows=false] - 是否需要固定周数，每月有四周或五周或六周，如果设置为true：则统一返回六周，其他的用下个月来补；如果设为false，则只返回当前月份的周数数据；
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
  getMonthData(d, curDate, fixRows) {
    let date = d;
    let year = date.getFullYear();
    let month = date.getMonth();
    let maxDays = CalendarHelper.getDays(date);
    let firstDayWeek = CalendarHelper.getMonthFirstWeek(date);
    let resultArr = [];
    let curStr = formatDate(curDate);
    let weekLen = fixRows === true ? 6 : CalendarHelper.getWeeks(date);

    for (let w = 0; w < weekLen; w++) {
      let arr = [];
      for (let d = 0; d < 7; d++) {
        let index = w * 7 + d;
        let dayNum = index - firstDayWeek + 1;
        let day = {
          curMonth: 0, // 是否为当前月
          today: false, // 是否为当前日期
          date: new Date(year, month, dayNum), // 日期对象

          ts: 0,  //时间戳
          year: 2018,  // 年
          month: 1, //月 1-12
          day: 1,   // 日    1-31
          week: 0,   //周几   0-6
          weekIdx: 1, // 当月的第几周 1-6
          days: 31,// 当月天数 28-31
          dateStr: '2018-10-31', // 日期字符串
        };

        if (w === 0 && d < firstDayWeek) { // 上个月
          day.curMonth = -1;
          day.date = new Date(year, month, -firstDayWeek + d + 1);
        } else if (dayNum > maxDays) {   // 下个月
          day.curMonth = 1;
          day.date = new Date(year, month + 1, dayNum - maxDays);
        }
        let tmpDate = day.date;
        day.ts = tmpDate.getTime();
        day.year = tmpDate.getFullYear();
        day.month = tmpDate.getMonth() + 1;
        day.day = tmpDate.getDate();
        day.week = tmpDate.getDay();
        day.weekIdx = CalendarHelper.getWeekByDate(tmpDate);
        day.days = CalendarHelper.getDays(tmpDate);
        day.dateStr = formatDate(tmpDate);
        if (day.dateStr === curStr) day.today = true;
        arr.push(day);
      }
      resultArr.push(arr);
    }

    return resultArr;
  },

  /**
   * 获取某个月份有多少天
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @returns {Number} 返回当前年月的天数
   * */
  getDays(d) {
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
   * @returns {Number} 返回当前年月所占用的周数
   * */
  getWeeks(d) {
    let date = CalendarHelper.parseDate(d);
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return CalendarHelper.getWeekByDate(date);
  },

  /**
   * 获取一个日期在这个月属于第几周
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @returns {Number} 返回第几周
   * */
  getWeekByDate(d) {
    let date = CalendarHelper.parseDate(d);
    let firstDayWeek = CalendarHelper.getMonthFirstWeek(date);
    let days = date.getDate();
    let count = (days + firstDayWeek - 1) / 7;
    return parseInt(count) + 1;
  },

  /**
   * 获取一个月份第一天是周几
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @returns {Number} 返回周几（0-6）
   * */
  getMonthFirstWeek(d) {
    let date = CalendarHelper.parseDate(d);
    date.setDate(1);
    return date.getDay();
  },

  /**
   * 获取上个月的数据
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {(date|number|string)} [cur=new Date()] - 需要选中的日期
   * @returns {Array} 返回这几个月的日历数据
   * */
  prevMonth(d, cur) {
    let date = CalendarHelper.addMonth(d, -1);
    return CalendarHelper.getCalendar(date, 1, {cur: cur});
  },
  /**
   * 获取下个月的数据
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {(date|number|string)} [cur=new Date()] - 需要选中的日期
   * @returns {Array} 返回符合条件这个时间段的日历数据
   * */
  nextMonth(d, cur) {
    let date = CalendarHelper.addMonth(d, 1);
    return CalendarHelper.getCalendar(date, 1, {cur: cur});
  },
  /**
   * 获取去年这个月份的数据
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {(date|number|string)} [cur=new Date()] - 需要选中的日期
   * @returns {Array} 返回符合条件这个时间段的日历数据
   * */
  prevYear(d, cur) {
    let date = CalendarHelper.addYear(d, -1);
    return CalendarHelper.getCalendar(date, 1, {cur: cur,});
  },
  /**
   * 获取明年这个月份的数据
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {(date|number|string)} [cur=new Date()] - 需要选中的日期
   * @returns {Array} 返回符合条件这个时间段的日历数据
   * */
  nextYear(d, cur) {
    let date = CalendarHelper.addYear(d, 1);
    return CalendarHelper.getCalendar(date, 1, {cur: cur,});
  },

  /**
   * 获取一个时间前后范围的日历数据，不包括本月
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {number} [count=1] - 如果count为正，往后取月份；如果count为负，往前取月份；
   * @param {(date|number|string)} [cur=new Date()] - 需要选中的日期
   * @returns {Number} 返回符合条件这个时间段的日历数据
   * */
  /*getAddMonthRangeData(d, count, cur) {
    count = count || 1;
    if (count >= 0) {
      let date = CalendarHelper.addMonth(d, 1);
      return CalendarHelper.getCalendar(date, count, {cur: cur});
    } else {
      count = -count;
      let date = CalendarHelper.addMonth(d, -count);
      return CalendarHelper.getCalendar(date, count, {cur: cur});
    }
  },*/
  /**
   * 获取一个时间前后范围的日历数据，不包括本年
   * @param {(date|number|string)} [d=new Date()] - 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
   * @param {number} [count=1] - 如果count为正，往后取月份；如果count为负，往前取月份；
   * @param {(date|number|string)} [cur=new Date()] - 需要选中的日期
   * @returns {Number} 返回符合条件这个时间段的日历数据
   * */
  /*getAddYearRangeData(d, count, cur) {
    count = count || 1;
    if (count >= 0) {  // nextYear
      let date = CalendarHelper.addYear(d, 1);
      return CalendarHelper.getCalendar(start, count * 12, {cur: cur});
    } else {   // prevYear
      count = -count;
      let date = CalendarHelper.addYear(d, -count);
      return CalendarHelper.getCalendar(date, count * 12, {cur: cur,});
    }
  },*/
};

/*let Calendar = function (opts) {
  this.init(opts);
};
Calendar.prototype = {
  constructor: Calendar,
  data: [],
  opts: {}, // 参数
  curDate: {},

  init(opts) {
    this.data = init(opts);
    this.opts = opts;
    this.curDate = this.opts.cur;
  },

  // 设置对象的当前时间，影响prevMonth、nextMonth、prevYear、nextYear
  setNowDate(d) {
    this.opts.cur = CalendarHelper.parseDate(d);
    return init(this.opts)
  },

  // 获取前几个月的数据(相对于curDate)
  prevMonth(count) {
    let cur = this.curDate;
    this.data = CalendarHelper.prevMonth(cur, count, cur);
    return this.data;
  },

  // 获取后几个月的数据
  nextMonth(count) {
    let cur = this.curDate;
    this.data = CalendarHelper.nextMonth(cur, count, cur);
    return this.data;
  },

  // 获取往前一年的数据
  prevYear(count) {
    let cur = this.curDate;
    this.data = CalendarHelper.prevYear(cur, count, cur);
    return this.data;
  },

  // 获取往后一年的数据
  nextYear(count) {
    let cur = this.curDate;
    this.data = CalendarHelper.prevYear(cur, count, cur);
    return this.data;
  },
};

CalendarHelper.Calendar = Calendar;*/


export default CalendarHelper;
