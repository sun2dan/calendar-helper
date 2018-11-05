# calendar-helper

[![Build Status](https://travis-ci.com/sun2dan/calendar-helper.svg?branch=master)](https://travis-ci.com/sun2dan/calendar-helper)

[![NPM](https://nodei.co/npm/calendar-helper.png)](https://nodei.co/npm/calendar-helper/)

一个获取日历数据的工具；

## 安装
```js   
$ npm install calender-helper
```

## 数据结构
### 日历数据
本工具生成的最小单位是一个月的日历数据，数据类型为一个二维数组，每行有7列，对应一周7天，共4-6行，对应月份里的几个周；首尾行中，可能会包含前后月份的数据；例如2022年3月份数据如下：
```js 一个月的日历数据结构
[ 
[{day:27,...}, {day:28,...}, {day:1,...}, {day:2,...}, {day:3,...}, {day:4,...}, {day:5,...}] ,
.
.
[{day:27,...}, {day:28,...}, {day:29,...}, {day:30,...}, {day:31,...}, {day:1,...}, {day:2,...}] 
 ],
```

### 日期对象
每个日期对象中，除了包含上面的day字段外，还有其他一些实用的字段，完整字段如下：
```js 日期对象
   {
       curMonth: Number (-1,0,1),  // 是否为当前月份的数据，首尾行可能会有前后月份的数据（第一个参数d对应的月份），0：当前月，-1：上一个月，1：下一个月
       today: Boolean, // 是否为当前日期（是否为传入参数curDate对应的日期）
       date: Date,     // 当前这一天的日期对象
       ts: Number,     // 当前这一天的时间戳
       year: Number,   // 当前这一天的年
       month: Number,  // 当前这一天的月，值范围：1-12
       day: Number,    // 当前这一天的日，值范围：1-31
       week: Number,   // 当前这一天是周几，值范围：0-6
       weekIdx: Number, // 当前这一天属于该月的第几周，值范围：1-6
       days: Number,     // 当前这一个月的天数，取值范围：28-31
       dateStr: String ('2018-10-31'), // 当前这一天的日期字符串
    }
```

## 引用
```js
import calendarHelper from 'calendar-helper';
```

## 主方法
### 1. getCalendar(start, interval, opts)
获取日历数据主方法；

返回值：如果获取一个月的数据，直接返回当月的二维数组数据；如果获取多个月的，返回符合条件的一个数组，数组每项是该月的二维数组数据；
- start: Date|Number|String，开始时间，类型为对象、日期对象、时间戳或时间戳字符串；
    - 对象类型为 {year : Number, month: Number}；
        1. year为年份，比如2018；
        2. month为月份，取值1-12；
    - 日期对象即 Date 类型；
    - 时间戳为时间戳或时间戳的字符串形式；
- interval: Object|Number，时间间隔，即要取多长时间的日历数据，类型为对象或数字，默认为1，如果参数不合法，改为默认值；
    - 对象形式为 {year:Number, month: Number, past: Boolean}，表示往前/后取 "year*12+month" 个月 
        1. year: 从start开始，往前/后取的年，1年会转换为12个月；
        2. month: 从start，往前/后取的月份；
        3. past: 是否要向前取时间，true-当前月往前取，false为从当前月往后取数据；
    - 数字表示往前/后取的月份数，正数为向前取，负数为向后取；    
- opts: 其他设置参数
    - fixRows: boolean 是否需要固定周数，每月有四周或五周或六周，如果设置为true：则统一返回六周，其他的用下个月来补；如果设为false，则只返回具有当前月份周数的数据；这个参数的使用场景大体是这个：在切换年月时，日历高度(周数)保持不变； 
    - cur: 类型为日期对象、时间戳或时间戳字符串 - 需要选中的当前时间； 
```js                     
    let date = new Date(2018, 10);
    CalendarHelper.getCalendar(date); // 获取2018-11月份的数据
    CalendarHelper.getCalendar(date.getTime(), -1);// 获取2018-11月前一个月(2018年10月份的数据
    CalendarHelper.getCalendar(date.getTime().toString(), {year: 0, month: 1});// 获取2018-11月前一个月(2018年10月)的数据
    CalendarHelper.getCalendar(date, {year: 0, month: 1}, {fixRows: true}); // 获取2018-11月后一个月(2018年12月)的数据
    CalendarHelper.getCalendar(date, 1, {fixRows: true, cur: new Date(2018, 11, 20)});  // 获取2018-11月后一个月(2018年12月)的数据，返回固定六周，并选中2018-12-20这一天；
```

### 2. getMonthData(date, curDate, fixRows)
生成一个月的日历数据；
返回值：如果获取一个月的数据，直接返回当月的二维数组数据；如果获取多个月的，返回符合条件的一个数组，数组每项是该月的二维数组数据；
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；
- curDate: date|number|string 当前日期/需要选中的日期，格式为Date类型或时间戳或时间戳字符串；默认选中今天，表现在对象的today属性上
- fixRows: boolean 是否需要固定周数，具体见getCalendar中的opts.fixRows；
```js getMonthData
let res = CalendarHelper.getMonthData(new Date(2018, 10)); // 获取2018-11月份的数据
```

## 辅助方法
上面两个是生成日历数据的主要方法，下面的方法是在生成数据过程中用到的，也封装起来对外提供：
### 1. parseDate(date|string|number)
将参数转换为日期；参数为日期对象、时间戳或时间戳字符串；

返回值：Date类型，如果参数是date类型，复制一个日期返回；参数不合法时，返回当前时间；
```js parseDate
    var date = CalendarHelper.parseDate(1541314815690); 
    var date1 = CalendarHelper.parseDate(new Date()); 
    var date2 = CalendarHelper.parseDate('1541314815690'); 
```

### 2. addMonth(date, count)
在起始时间上往前/后推count个月份，只考虑年月，不考虑日/天数，即月份加减，年适时加减，日改为1；比如需要在2018-10-31往后推一个月，得到的是2018-11-01；

返回值：Date类型，操作完之后的日期；
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
- count: number 需要添加的月数量，正为向后，负为向前；默认为1，0和不合法参数会重置为默认值1；
```js addMonth
  var date1 = CalendarHelper.addMonth(new Date(2018,9,31), 1);  //=> 2018-11-01
  var date2 = CalendarHelper.addMonth(new Date(2018,10,4), -2);  //=> 2018-09-01
```

### 3. addYear(date, count)
在起始时间上往前/后推count年，只考虑年，不考虑月日，即年加减，月不变，日改为1；比如需要在2004-02-29加一年，得到的是2005-02-01；

返回值：Date类型；
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
- count: number 需要添加的月数量，正为向后，负为向前；默认为1，0和不合法参数会重置为默认值1；
```js addMonth
  var date1 = CalendarHelper.addYear(new Date(2018,9,31), 1);  //=> 2019-11-01
  var date2 = CalendarHelper.Year(new Date(2018,10,4), -2);  //=> 2016-11-01
```

### 4. getDays(date)
获取某个月份有多少天；
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；
返回值：Number类型，当前年月的天数；

### 5. getWeeks(date)
获取某个月前后占用的周数
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
返回值：Number类型，当前年月所占用的周数

### 6. getWeekByDate(date)
获取一个日期在这个月属于第几周
date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
返回值：Number类型，当前年月的周数，取值范围 4-6；

### 7. getMonthFirstWeek(date)
获取一个月份第一天是周几
date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
返回值：Number类型，取值范围 0-6；

### 8. prevMonth(date, cur)
获取上个月的数据
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；
- cur:date|number|string 需要选中的日期;
返回值：Array，上个月的二维数组日历数据；

### 9. nextMonth(date, cur)
获取下个月的数据
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；
- cur:date|number|string 需要选中的日期;
返回值：Array，下个月的二维数组日历数据；

### 10. prevYear(date, cur)
获取去年这个月份的数据
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；
- cur:date|number|string 需要选中的日期;
返回值：Array，获取去年这个月份的二维数组日历数据；

### 11. nextYear(date, cur)
获取明年这个月份的数据
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；
- cur:date|number|string 需要选中的日期;
返回值：Array，获取明年这个月份的二维数组日历数据；


## 测试
```js test
$ npm test
```

