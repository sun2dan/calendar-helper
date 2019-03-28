'use strict';

//import CalendarHelper from '../index'
//import formatTools from "format-tools";
let CalendarHelper = require('../dist/index');
//let assert = require('assert');
let expect = require('chai').expect;

describe('CalendarHelper.getCalendar', function () {
  /*
    let res = CalendarHelper.getCalendarData({
    cur: new Date(), // 当前日期
    start: {year: 2020, month: 3}, // 开始日期
    //interval: {year: 1, month: 5},  // 时间间隔
    interval: 2,  // 时间间隔
    fixRows: true, // 是否固定6行 true-6行
    });     */
  it('1 开始时间设为2018-11，对象类型，时间间隔设置为1，获取到11月份的数据，并选中11-30', function () {
    let res = CalendarHelper.getCalendar({year: 2018, month: 11}, 1, {cur: new Date(2018, 10, 30)});
    toEqual(res.length, 5);
    toEqual(res[0].length, 7);
    toEqual(res[0][4].dateStr, '2018-11-01');
    toEqual(res[4][5].today, true);  // 11-30选中
    toEqual(res[4][6].dateStr, '2018-12-01');
  });
  it('2 开始时间设为2018-11，日期类型，时间间隔设置为1，获取到11月份的数据，并选中11-30', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10), 1, {cur: new Date(2018, 10, 30)});
    toEqual(res.length, 5);
    toEqual(res[0].length, 7);
    toEqual(res[0][4].dateStr, '2018-11-01');
    toEqual(res[4][5].today, true);  // 11-30选中
    toEqual(res[4][6].dateStr, '2018-12-01');
  });
  it('3 开始时间设为2018-11，时间戳类型，时间间隔设置为1，获取到11月份的数据，并选中11-30', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10).getTime(), 1, {cur: new Date(2018, 10, 30)});
    toEqual(res.length, 5);
    toEqual(res[0].length, 7);
    toEqual(res[0][4].dateStr, '2018-11-01');
    toEqual(res[4][5].today, true);  // 11-30选中
    toEqual(res[4][6].dateStr, '2018-12-01');
  });
  it('4 开始时间设为2018-11，时间间隔设置为对象，1年1个月，获取到2018-11到2019-11月的数据，其他月份的20号10不选中(设置当前时间为2018-11-10)', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10), {year: 1, month: 1}, {cur: new Date(2018, 10, 20)});
    toEqual(res.length, 13);
    toEqual(res[0][1][0].dateStr, '2018-11-04');  // 2018-11的第二周第一天：11-04
    toEqual(res[7][1][0].dateStr, '2019-06-02');  // 2019-06的第二周第一天：06-02
    toEqual(res[12][1][0].dateStr, '2019-11-03');  // 2019-11的第二周第一天：11-03
    toEqual(res[0][3][2].today, true);  // 2018-11-20选中
    toEqual(res[1][3][4].today, false);  // 2018-12-20不选中
    toEqual(res[7][3][4].today, false);  // 2019-06-02不选中
    toEqual(res[12][3][3].today, false);  // 2019-11-20不选中
  });
  it('5 开始时间设为2018-11，时间间隔设置为对象，往前推1年1个月，获取到2017-11到2018-11月的数据', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10), {year: 1, month: 1, past: true});
    toEqual(res.length, 13);
    toEqual(res[0][1][0].dateStr, '2017-10-08');  // 2017-10的第二周第一天
    toEqual(res[7][1][0].dateStr, '2018-05-06');  // 2018-04的第二周第一天
    toEqual(res[12][1][0].dateStr, '2018-10-07');  // 2018-11的第二周第一天
  });
  it('6 开始时间设为2018-11，时间间隔设置为对象，0年1个月，获取到2018-11的数据，6行', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10), {year: 0, month: 1}, {fixRows: true});
    toEqual(res.length, 6);
  });
  it('7 开始时间设为2018-11，时间间隔设置为对象，往前推0年1个月，获取到2018-10的数据，6行', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10), {year: 0, month: 1, past: true}, {fixRows: true});
    toEqual(res.length, 6);
    toEqual(res[1][0].dateStr, '2018-10-07');
  });
  it('8 开始时间设为2018-11，时间间隔设置为对象，往前推1个月，获取到2018-10的数据，2018-10-10不选中(设置当前时间为11-10)', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10), -1, {cur: new Date(2018, 10, 10)});
    toEqual(res.length, 5);
    toEqual(res[1][0].dateStr, '2018-10-07');
    toEqual(res[4][3].dateStr, '2018-10-31');
    toEqual(res[1][3].dateStr, '2018-10-10');
    toEqual(res[1][3].today, false);
  });
  it('9 开始时间设为2018-11，不设置时间间隔，获取到2018-11的数据', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10).getTime());
    toEqual(res.length, 5);
    toEqual(res[0].length, 7);
    toEqual(res[0][4].dateStr, '2018-11-01');
    toEqual(res[4][6].dateStr, '2018-12-01');
  });
  it('10 开始时间设为2018-11，设置时间间隔为1，获取到2018-11的数据，按周一到周日排序', function () {
    let res = CalendarHelper.getCalendar(new Date(2018, 10).getTime(), 1, {monday: true});
    toEqual(res.length, 5);
    toEqual(res[0].length, 7);
    toEqual(res[0][0].week, 1); // 第一行第一天为周一，1
    toEqual(res[0][6].week, 0); // 第一行最后一天为周日，0
    toEqual(res[0][3].dateStr, '2018-11-01');
    toEqual(res[4][5].dateStr, '2018-12-01');
  });
});

describe('CalendarHelper.parseDate', function () {
  it('1 不传参数，默认为当前时间（精确到秒）', function () {
    let seconds = parseInt(CalendarHelper.parseDate() / 1000);
    toEqual(seconds, parseInt(new Date() / 1000));
  });
  it('2 传日期对象，得到一个拷贝(不等于原对象但值相等）', function () {
    let date = new Date(2018, 10, 1);
    let orig = CalendarHelper.parseDate(date);
    toEqual(orig.getTime(), date.getTime());  // 值相等
    date.setMonth(11);
    toNotEqual(orig, date);    // 不等于原对象
  });
  it('3 传时间戳或时间戳字符串，得到一个日期对象', function () {
    let date = new Date(2018, 10, 1);
    let ts = date.getTime();
    toBeA(CalendarHelper.parseDate(ts), 'date');
    toBeA(CalendarHelper.parseDate(ts.toString()), 'date');
  });
});

describe('CalendarHelper.addMonth', function () {
  it('1 不传参数默认为1：2018年11月，往后一个月为2018年12月', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.addMonth(date);
    let compare = new Date(2018, 11);
    toEqual(orig.getFullYear(), compare.getFullYear());
    toEqual(orig.getMonth(), compare.getMonth());
  });
  it('2 2018年11月，往后两个月为2019年1月', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.addMonth(date, 2);
    let compare = new Date(2019, 0);
    toEqual(orig.getFullYear(), compare.getFullYear());
    toEqual(orig.getMonth(), compare.getMonth());
  });
  it('3 2018年11月，往前两个月为2018年9月', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.addMonth(date, -2);
    let compare = new Date(2018, 8);
    toEqual(orig.getFullYear(), compare.getFullYear());
    toEqual(orig.getMonth(), compare.getMonth());
  });
});

describe('CalendarHelper.addYear', function () {
  it('1 第二个参数不传默认为1：2018年11月，往后一年为2019年11月', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.addYear(date);
    let compare = new Date(2019, 10);
    toEqual(orig.getFullYear(), compare.getFullYear());
    toEqual(orig.getMonth(), compare.getMonth());
  });
  it('2 2018年11月，往后两年为2020年11月', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.addYear(date, 2);
    let compare = new Date(2020, 10);
    toEqual(orig.getFullYear(), compare.getFullYear());
    toEqual(orig.getMonth(), compare.getMonth());
  });
  it('3 2018年11月，往前两年为2020年11月', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.addYear(date, 2);
    let compare = new Date(2020, 10);
    toEqual(orig.getFullYear(), compare.getFullYear());
    toEqual(orig.getMonth(), compare.getMonth());
  });
});

describe('CalendarHelper.getMonthData', function () {
  it('1 获取2018年11月份的日历数据，并选中30号，不固定行数', function () {
    let compare = {
      prevLastDay: {
        curMonth: -1, // 是否为当前月
        today: false, // 是否为当前日期
        date: new Date(2018, 9, 31), // 日期对象
        ts: new Date(2018, 9, 31).getTime(),  //时间戳
        year: 2018,  // 年
        month: 10, //月 1-12
        day: 31,   // 日    1-31
        week: 3,   //周几   0-6
        weekIdx: 5, // 当月的第几周 1-6
        days: 31,// 当月天数 28-31
        dateStr: '2018-10-31', // 日期字符串
      },
      curFirstDay: {
        curMonth: 0,
        today: false,
        date: new Date(2018, 10, 1),
        ts: new Date(2018, 10, 1).getTime(),
        year: 2018,
        month: 11,
        day: 1,
        week: 4,
        weekIdx: 1,
        days: 30,
        dateStr: '2018-11-01',
      },
      curLastDay: {
        curMonth: 0,
        today: true,
        date: new Date(2018, 10, 30),
        ts: new Date(2018, 10, 30).getTime(),
        year: 2018,
        month: 11,
        day: 30,
        week: 5,
        weekIdx: 5,
        days: 30,
        dateStr: '2018-11-30',
      },
      lastFirstDay: {
        curMonth: 1,
        today: false,
        date: new Date(2018, 11, 1),
        ts: new Date(2018, 11, 1).getTime(),
        year: 2018,
        month: 12,
        day: 1,
        week: 6,
        weekIdx: 1,
        days: 31,
        dateStr: '2018-12-01',
      }
    };
    let cur = new Date(2018, 10, 30);

    let orig = CalendarHelper.getMonthData(new Date(2018, 10), cur, false);
    toEqual(orig.length, 5); // 5周/行
    toEqual(orig[0].length, 7); // 7列

    let prevLastDay = orig[0][3]; // 10-31
    let curFirstDay = orig[0][4];  // 11-30
    let curLastDay = orig[4][5];  // 11-30
    let lastFirstDay = orig[4][6];  // 12-01

    let arr = ['prevLastDay', 'curFirstDay', 'curLastDay', 'lastFirstDay'];
    [prevLastDay, curFirstDay, curLastDay, lastFirstDay].forEach((item, i) => {
      let key = arr[i];
      toDeepEqual(item, compare[key]);
    });
  });
  it('2 获取2018年11月份的日历数据，固定6行', function () {
    let cur = new Date(2018, 10, 30);
    let orig = CalendarHelper.getMonthData(new Date(2018, 10), cur, true);
    toEqual(orig.length, 6);
  });
  it('3 选中日期不传或传空，默认为当前日期', function () {
    let now = new Date();
    let orig = CalendarHelper.getMonthData(new Date(2018, 10));
    let orig1 = CalendarHelper.getMonthData(new Date(2018, 10), null, 6);
    let res = [];
    [orig, orig1].forEach((data) => {
      data.forEach((week) => {
        week.forEach((day) => {
          if (day.today) res.push(day.dateStr);
        });
      });
    });
    res.forEach((item) => {
      toEqual(item, getDateStr(now));
    });
  });
  it('4 获取2018年11月份的日历数据，并选中30号，不固定行数，按周一到周日排序', function () {
    let compare = {
      prevLastDay: {
        curMonth: -1, // 是否为当前月
        today: false, // 是否为当前日期
        date: new Date(2018, 9, 31), // 日期对象
        ts: new Date(2018, 9, 31).getTime(),  //时间戳
        year: 2018,  // 年
        month: 10, //月 1-12
        day: 31,   // 日    1-31
        week: 3,   //周几   0-6
        weekIdx: 5, // 当月的第几周 1-6
        days: 31,// 当月天数 28-31
        dateStr: '2018-10-31', // 日期字符串
      },
      curFirstDay: {
        curMonth: 0,
        today: false,
        date: new Date(2018, 10, 1),
        ts: new Date(2018, 10, 1).getTime(),
        year: 2018,
        month: 11,
        day: 1,
        week: 4,
        weekIdx: 1,
        days: 30,
        dateStr: '2018-11-01',
      },
      curLastDay: {
        curMonth: 0,
        today: true,
        date: new Date(2018, 10, 30),
        ts: new Date(2018, 10, 30).getTime(),
        year: 2018,
        month: 11,
        day: 30,
        week: 5,
        weekIdx: 5,
        days: 30,
        dateStr: '2018-11-30',
      },
      lastFirstDay: {
        curMonth: 1,
        today: false,
        date: new Date(2018, 11, 1),
        ts: new Date(2018, 11, 1).getTime(),
        year: 2018,
        month: 12,
        day: 1,
        week: 6,
        weekIdx: 1,
        days: 31,
        dateStr: '2018-12-01',
      }
    };
    let cur = new Date(2018, 10, 30);

    let orig = CalendarHelper.getMonthData(new Date(2018, 10), cur, false, true);
    toEqual(orig.length, 5); // 5周/行
    toEqual(orig[0].length, 7); // 7列

    let prevLastDay = orig[0][2]; // 10-31
    let curFirstDay = orig[0][3];  // 11-30
    let curLastDay = orig[4][4];  // 11-30
    let lastFirstDay = orig[4][5];  // 12-01

    let arr = ['prevLastDay', 'curFirstDay', 'curLastDay', 'lastFirstDay'];
    [prevLastDay, curFirstDay, curLastDay, lastFirstDay].forEach((item, i) => {
      let key = arr[i];
      toDeepEqual(item, compare[key]);
    });
  });
});

describe('CalendarHelper.getDays', function () {
  it('1 2020年2月有29天，2019年2月有28天', function () {
    let orig = CalendarHelper.getDays(new Date(2020, 1));
    toEqual(orig, 29);
    let orig1 = CalendarHelper.getDays(new Date(2019, 1));
    toEqual(orig1, 28);
  });
  it('2 1/3/5/7/8/10/12月份有31天', function () {
    [1, 3, 5, 7, 8, 10, 12].forEach((n, i) => {
      let orig = CalendarHelper.getDays(new Date(2018, n - 1));
      toEqual(orig, 31);
    });
  });
  it('3 4/6/9/11月份有30天', function () {
    [4, 6, 9, 11].forEach((n, i) => {
      let orig = CalendarHelper.getDays(new Date(2018, n - 1));
      toEqual(orig, 30);
    });
  });
});

describe('CalendarHelper.getWeeks', function () {
  it('1.1 按周日到周六排序，2019年3月有6周', function () {
    let orig = CalendarHelper.getWeeks(new Date(2019, 2));
    toEqual(orig, 6);
  });
  it('1.2 按周一到周日排序，2019年2月有5周', function () {
    let orig = CalendarHelper.getWeeks(new Date(2019, 2), true);
    toEqual(orig, 5);
  });

  it('2.1 按周日到周六排序，2018年12月有6周', function () {
    let orig = CalendarHelper.getWeeks(new Date(2018, 11));
    toEqual(orig, 6);
  });
  it('2.2 按周一到周日排序，2018年12月有6周', function () {
    let orig = CalendarHelper.getWeeks(new Date(2018, 11), true);
    toEqual(orig, 6);
  });

  it('3.1 按周日到周六排序，2026年2月有4周', function () {
    let orig = CalendarHelper.getWeeks(new Date(2026, 1));
    toEqual(orig, 4);
  });
  it('3.2 按周一到周日排序，2026年2月有5周', function () {
    let orig = CalendarHelper.getWeeks(new Date(2026, 1), true);
    toEqual(orig, 5);
  });
});

describe('CalendarHelper.getWeekByDate', function () {
  it('1.1 按周日到周六排序，2018年11月4号在当月第2周', function () {
    let orig = CalendarHelper.getWeekByDate(new Date(2018, 10, 4));
    toEqual(orig, 2);
  });
  it('1.2 按周一到周日排序，2018年11月4号在当月第1周', function () {
    let orig = CalendarHelper.getWeekByDate(new Date(2018, 10, 4), true);
    toEqual(orig, 1);
  });

  it('2.1 按周日到周六排序，2018年11月19号在当月第4周', function () {
    let orig = CalendarHelper.getWeekByDate(new Date(2018, 10, 19));
    toEqual(orig, 4);
  });
  it('2.2 按周一到周日排序，2018年11月19号在当月第4周', function () {
    let orig = CalendarHelper.getWeekByDate(new Date(2018, 10, 19), true);
    toEqual(orig, 4);
  });

  it('3.1 按周日到周六排序，2019年3月31号在第6周', function () {
    let orig = CalendarHelper.getWeekByDate(new Date(2019, 2, 31));
    toEqual(orig, 6);
  });
  it('3.2 按周一到周日排序，2019年3月31号在第5周', function () {
    let orig = CalendarHelper.getWeekByDate(new Date(2019, 2, 31), true);
    toEqual(orig, 5);
  });
});

describe('CalendarHelper.getMonthFirstWeek', function () {
  it('1 2018年11月的第一天是周四', function () {
    let orig = CalendarHelper.getMonthFirstWeek(new Date(2018, 10));
    toEqual(orig, 4);
  });
  it('2 2018年12月的第一天是周六', function () {
    let orig = CalendarHelper.getMonthFirstWeek(new Date(2018, 11));
    toEqual(orig, 6);
  });
});

describe('CalendarHelper.prevMonth / nextMonth / prevYear / nextYear', function () {
  it('1 获取2018年11月前一个月（2018年10月）的数据', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.prevMonth(date);
    toEqual(orig.length, 5);
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2018-10-07'); // 10月第二周第一天是7号
  });
  it('2 获取2018年11月后一个月（2018年12月）的数据', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.nextMonth(date);
    toEqual(orig.length, 6);  // 2018年12月有6周
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2018-12-02'); // 10月第二周第一天是7号
  });
  it('3 获取2018年11月前一年（2017年11月）的数据', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.prevYear(date);
    toEqual(orig.length, 5);
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2017-11-05'); // 第二周第一天
  });
  it('4 获取2018年11月后一年（2019年11月）的数据', function () {
    let date = new Date(2018, 10);
    let orig = CalendarHelper.nextYear(date);
    toEqual(orig.length, 5);  // 2019年11月有5周
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2019-11-03'); // 10月第二周第一天是7号
  });
});
/*
describe('CalendarHelper.getAddMonthRangeData', function () {
  it('1 获取2018年11月前一个月（2018年10月）的数据', function () {
    let date = new Date(2018, 10);
    let count = -1;
    let orig = CalendarHelper.getAddMonthRangeData(date, count);
    toEqual(orig.length, 5);
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2018-10-07'); // 10月第二周第一天是7号
  });
  it('2 获取2018年11月前3个月（2018-8到2018-10）的数据', function () {
    let date = new Date(2018, 10);
    let count = -3;
    let orig = CalendarHelper.getAddMonthRangeData(date, count);
    toEqual(orig.length, 3);
    toEqual(orig[0][1][0].dateStr, '2018-08-05'); // 第一个月(8月)第二周第一天
    toEqual(orig[1][1][0].dateStr, '2018-09-02'); // 第二个月(9月)第二周第一天
    toEqual(orig[2][1][0].dateStr, '2018-10-07'); // 第三个月(10月)第二周第一天
  });
  it('3 获取2018年11月后一个月（2018年12月）的数据', function () {
    let date = new Date(2018, 10);
    let count = 1;
    let orig = CalendarHelper.getAddMonthRangeData(date, count);
    toEqual(orig.length, 6);
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2018-12-02'); // 12月第二周第一天
  });
  it('4 获取2018年11月后3个月（2018-12到2019-02）的数据', function () {
    let date = new Date(2018, 10);
    let count = 3;
    let orig = CalendarHelper.getAddMonthRangeData(date, count);
    toEqual(orig.length, 3);
    toEqual(orig[0][1][0].dateStr, '2018-12-02'); // 第一个月(8月)第二周第一天
    toEqual(orig[1][1][0].dateStr, '2019-01-06'); // 第二个月(9月)第二周第一天
    toEqual(orig[2][1][0].dateStr, '2019-02-03'); // 第三个月(10月)第二周第一天
  });
});

describe('CalendarHelper.getAddYearRangeData', function () {
  it('1 获取2018年11月前一年（2017年10月）的数据', function () {
    let date = new Date(2018, 10);
    let count = -1;
    let orig = CalendarHelper.getAddYearRangeData(date, count);
    toEqual(orig.length, 5);
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2018-10-07'); // 10月第二周第一天是7号
  });
  it('2 获取2018年11月前3个月（2018-8到2018-10）的数据', function () {
    let date = new Date(2018, 10);
    let count = -3;
    let orig = CalendarHelper.getAddYearRangeData(date, count);
    toEqual(orig.length, 3);
    toEqual(orig[0][1][0].dateStr, '2018-08-05'); // 第一个月(8月)第二周第一天
    toEqual(orig[1][1][0].dateStr, '2018-09-02'); // 第二个月(9月)第二周第一天
    toEqual(orig[2][1][0].dateStr, '2018-10-07'); // 第三个月(10月)第二周第一天
  });
  it('3 获取2018年11月后一个月（2018年12月）的数据', function () {
    let date = new Date(2018, 10);
    let count = 1;
    let orig = CalendarHelper.getAddYearRangeData(date, count);
    toEqual(orig.length, 6);
    toEqual(orig[0].length, 7);
    toEqual(orig[1][0].dateStr, '2018-12-02'); // 12月第二周第一天
  });
  it('4 获取2018年11月后3个月（2018-12到2019-02）的数据', function () {
    let date = new Date(2018, 10);
    let count = 3;
    let orig = CalendarHelper.getAddYearRangeData(date, count);
    toEqual(orig.length, 3);
    toEqual(orig[0][1][0].dateStr, '2018-12-02'); // 第一个月(8月)第二周第一天
    toEqual(orig[1][1][0].dateStr, '2019-01-06'); // 第二个月(9月)第二周第一天
    toEqual(orig[2][1][0].dateStr, '2019-02-03'); // 第三个月(10月)第二周第一天
  });
});*/

/*describe('CalendarHelper.Calendar 测试创建对象', function () {
  calendarInit(true)
});
describe('CalendarHelper.Calendar 测试对象上的方法', function () {

});*/

function toEqual(orig, compare) {
  expect(orig).to.equal(compare);
}

function toNotEqual(orig, compare) {
  return expect(orig.getTime()).to.not.equal(compare.getTime());
}

function toDeepEqual(orig, compare) {
  expect(orig).to.deep.equal(compare);
}

function toBeA(orig, type) {
  expect(orig).to.be.a(type);
}

function getDateStr(date, splitChar) {
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
}

