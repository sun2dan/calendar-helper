'use strict';

let CalendarHelper = require('../dist/index');
let expect = require('chai').expect;

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

