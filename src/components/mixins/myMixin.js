import CONSTANTS from "../constants/myConstants";

const axios = require("axios");

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
    monthFirstFormat: function(date) {
      // yyyy-mm-dd format to mm-dd-yyyy
      let t_date = date.split("-");
      return [t_date[1], t_date[2], t_date[0]].join("-");
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
    toDate: function(date, time) {
      // return time stamp date + time
      return +new Date(date + " " + time);
    },

    validateInput: function(event) {
      // name: characters other than alphebet or number or whitespace is disallow
      // Date: any date before "today" is disallow, also edit to the appointment in the past is disallow
      // st_Time: time earlier than 6 am is disallow
      // ed_Time: time earlier than st_Time or later than 11:59 is disallow
      // owner: characters other than alphebet is disallow
      // Invitee: characters other than alphebet is disallow
      // (in case using email is another story)
      console.log("validate form");

      this.errors = [];
      let alnumReg = "^[a-zA-Z0-9\\s]+$";
      let alReg = "^[a-zA-Z\\s]+$";
      if (!event.name.match(alnumReg)) {
        this.errors.push("name: only alphbet characters and number");
      }

      // compareDate return false if arg1 is earlier than arg2, in year, month and date
      // if (!compareDate(this.formatedDate, this.getDateWithoutTime(Date.now()))) {
      //   this.errors.push("date: cannot add event to the past");
      // }

      //toDate return time stamp
      if (event.st_time < +new Date(new Date(event.date).setHours(6))) {
        this.errors.push("start time: cannot be earlier than 6 am");
      }

      // console.log(end_time<=start_time, end_time, start_time, this.edTime, this.stTime);
      if (event.ed_time <= event.st_time) {
        this.errors.push("end time: cannot be earlier or same to start time");
      }

      if (event.ed_time > this.toDate(event.date, "23:59")) {
        this.errors.push("end time: cannot be later than 23:59/11:59 PM");
      }

      if (!event.owner.match(alReg)) {
        this.errors.push("owner: only alphbet character");
      }

      for (let i = 0; i < event.invitees.length; i++) {
        if (!event.invitees[i].name.match(alReg)) {
          this.errors.push("invitee: only alphbet character");
          break;
        }
      }

      console.log(this.errors);
      // for(let i=0; i<)

      if (this.errors.length > 0) {
        return false;
      }
      return true;
    },
    checkOverlap: function(event, currentID) {
      //check time overlap
      console.log("checkOverlap");
      const firebaseUrl = CONSTANTS.firebaseDB + event.date + ".json";
      return axios
        .get(firebaseUrl)
        .then((response) => {
          if (response.statusText === "OK") {
            console.log(response);
            return response.data;
          }
        })
        .then((data) => {
          // console.log("data", data);
          for (const id in data) {
            // console.log("event", data[id]);
            // if Astart<=Bend and Aend>=Bstart, then time overlap occurred
            // console.log(
            //   this.start_time,
            //   this.end_time,
            //   event.st_time,
            //   event.ed_time,
            //   "check",
            //   (this.start_time <= event.ed_time) &&
            //   (this.end_time >= event.st_time)
            // );
            if (currentID === id) {
              //skip same event
              continue;
            }
            if (
              event.st_time < data[id].ed_time &&
              event.ed_time > data[id].st_time
            ) {
              console.log("overlap occured");
              this.errors.push(
                "time overlap occoured with event: " + data[id].name
              );
              this.errors.push(new Date(data[id].ed_time).toString());
              this.errors.push(new Date(data[id].st_time).toString());
            }
          }
          return "checkOverlapDone";
        });
    },
  },
};
