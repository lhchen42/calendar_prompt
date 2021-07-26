import CONSTANTS from "../constants/myConstants";

export default {
  name: "myMixin",
  date: function() {
    return {
      dayTitles: CONSTANTS.days,
      monthTitles: CONSTANTS.months,
      firestoneUrl: CONSTANTS.firebaseDB,
    };
  },
  methods: {
    getDay: function(day) {
      // return weekday index [0-6]
      return new Date(day).getDay();
    },
    getDate: function(day) {
      // return date of the month
      return new Date(day).getDate();
    },
    getNewDate: function(day) {
      // return a copy
      return new Date(day);
    },
    getDateWithoutTime: function(day) {
      // return a timeStamp without Hours, Minute ....
      return +new Date(new Date(day).toDateString());
    },
    getDayTitle: function(day) {
      // return title of a week day [Sun-Sat]
      return this.dayTitles[this.getDay(day)];
    },
    getMonthTitle: function(month) {
      // return title of a month [Jan-Dec]
      return this.monthTitles[month];
    },
    getDateString: function(day) {
      // return mm-dd-yyyy string
      let t_day = new Date(day);
      let year = t_day.getFullYear();
      let month = (t_day.getMonth() + 1).toString();
      let date = t_day.getDate().toString();
      if (month.length < 2) {
        month = "0" + month;
      }
      if (date.length < 2) {
        date = "0" + date;
      }
      return [month, date, year].join("-");
    },
    getClockHour: function(timestamp) {
      // return a timeStamp without minutes, clock time
      return +new Date(timestamp).setMinutes(0);
    },
    yearFirstFormat: function(date) {
      // convert mm-dd-yyyy format to yyyy-mm-dd format
      let t_date = date.split("-");
      return [t_date[2], t_date[0], t_date[1]].join("-");
    },
    timeStampToFormTime: function(timestamp) {
      // take a timeStamp, return date format (yyyy-mm-dd) in html form
      let t_date = new Date(timestamp);
      let hours = t_date.getHours().toString();
      let minutes = t_date.getMinutes().toString();
      if (hours.length < 2) {
        hours = "0" + hours;
      }
      if (minutes.length < 2) {
        minutes = "0" + minutes;
      }
      return [hours, minutes].join(":");
    },
  },
};
