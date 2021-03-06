# calendar-helper

[![Build Status](https://travis-ci.com/sun2dan/calendar-helper.svg?branch=master)](https://travis-ci.com/sun2dan/calendar-helper)

[![NPM](https://nodei.co/npm/calendar-helper.png)](https://nodei.co/npm/calendar-helper/)

一个生成日历数据的工具；

## 重要版本变更
- 0.2.0：精简优化，删除获取多个月份的功能（getCalendar），让该库的功能更单一；现在一次只能获取一个月的数据，需要多个月份数据的，在调用处加循环多次调用即可；
- 0.1.2：添加 monday 参数，支持配置周一到周日、周日到周六的数据排列方式；修改文档中部分描述不当的文案；
- 0.1.0：默认引用路径改为require方式，import路径改为'calendar-helper/index'
- 0.0.x：在vue中引用，并未考虑require的情况

## 安装
```js   
$ npm install calendar-helper
```

## 数据结构
### 日历数据
本工具生成结果为一个月的日历数据，数据类型为一个二维数组，每行有7列，对应一周7天，共4-6行，对应月份里的几个周；首尾行中，可能会包含前后月份的数据；例如2022年3月份数据如下：
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
### Node
```js
var calendarHelper = require('calendar-helper'); // require引用
```
```js
import CalendarHelper from 'calendar-helper/index'; // es6 import引用，可用于vue中
```

### 浏览器
```html 浏览器
<script src='./dist/index.js'></script>
```
以 amd 或 cmd 模式引入，如果环境不支持 amd 或 cmd，挂载到window上，window.calendarHelper；

<a href='https://sun2dan.github.io/calendar-helper/test/index.html' target='_blank'>点击此处查看测试页面</a>

```js amd+cmd+原生
  // seajs测试
  seajs.use('calendarHelper', function (calendarHelper) {
    console.log(calendarHelper);
  });
  
  // requirejs 测试
  requirejs(['calendarHelper'], function (calendarHelper) {
    console.log(calendarHelper);
  });
  
  // 浏览器原生
  console.log(window.calendarHelper);
```

## 主方法 
### getMonthData(date, curDate, fixRows, monday)
本库的核心方法，生成一个月的日历数据；
返回值：当月的二维数组数据；
- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；
- curDate: date|number|string 需要选中的日期，格式为Date类型或时间戳或时间戳字符串；不传或格式错误，则默认选中今天，表现在对象的today属性上；
- fixRows: boolean 是否需要固定周数，每月有四周或五周或六周，如果设置为true：则统一返回六周，其他的用下个月来补；如果设为false，则只返回具有当前月份周数的数据；这个参数的使用场景大体是这个：在切换年月时，日历高度(周数)保持不变；
- monday: boolean 第一天是否为周一，即是否按照周一到周日的顺序排列数据；默认为false，按周日到周六的顺序排列；如果设置为true，则按照周一到周日的顺序排列；
```js getMonthData
let res1 = CalendarHelper.getMonthData(new Date(2018, 10)); // 获取2018-11月份的数据
let res2 = CalendarHelper.getMonthData(new Date(2018, 10), new Date(), true, true); // 获取2018-11月份的数据
```

## 辅助方法
辅助方法是在生成数据过程中用到的，也封装起来对外提供：
### 1. parseDate(date|string|number)
将参数转换为日期；

参数为日期对象、时间戳或时间戳字符串；

返回值：Date类型，如果参数是date类型，复制一个日期返回；参数不合法时，返回当前时间；
```js parseDate
    var date = CalendarHelper.parseDate(1541314815690); 
    var date1 = CalendarHelper.parseDate(new Date()); 
    var date2 = CalendarHelper.parseDate('1541314815690'); 
```

### 2. getDays(date)
获取某个月份有多少天；

date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串；

返回值：Number类型，当前年月的天数；

### 3. getWeeks(date, monday)
获取某个月前后占用的周数

- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
- monday: boolean 第一天是否为周一，即是否按照周一到周日的顺序排列数据；默认为false，按周日到周六的顺序排列；如果设置为true，则按照周一到周日的顺序排列；

返回值：Number类型，当前年月所占用的周数

### 4. getWeekByDate(date, monday)
获取一个日期在这个月属于第几周

- date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串
- monday: boolean 第一天是否为周一，即是否按照周一到周日的顺序排列数据；默认为false，按周日到周六的顺序排列；如果设置为true，则按照周一到周日的顺序排列；

返回值：Number类型，当前年月的周数，取值范围 4-6；

### 5. getMonthFirstWeek(date)
获取一个月份第一天是周几

date: date|number|string 需要操作的时间，格式为Date类型或时间戳或时间戳字符串

返回值：Number类型，取值范围 0-6；

## 测试
```js test
$ npm test
```
HTML页面测试地址：[点击查看测试结果](https://sun2dan.github.io/calendar-helper/test/index.html)
