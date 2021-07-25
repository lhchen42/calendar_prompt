<template>
  <div class="calendar">
    <div class="form-container">
      <div class="calendar-form">
        <calendarForm v-on:submitEvent="addEvent" v-bind:dbUrl="eventsUrl"></calendarForm>
      </div>
    </div>
    <div class="calendar-container">
      <div>
        <div class="calendar-nav">
          <h2>Monthly Calendar</h2>
          <button v-on:click="prevMonth">&lt;</button>
          <p class="month-year">{{ month }} {{ fullYear }}</p>
          <button v-on:click="nextMonth">&gt;</button>
        </div>
      </div>
      <div class="calendar-main">
        <div class="calendar-header" v-for="day in days" v-bind:key="day">
          {{ day }}
        </div>
        <calendarGrid
          v-bind:class="[
            'calendar-grid',
            data.currentMonth ? 'currentMonth' : '',
          ]"
          v-for="data in calendarData"
          v-bind:key="data.date"
          v-bind:info="data"
          v-bind:firestoneUrl="firestoneUrl"
          v-bind:reload="reload"
          @reloadDone="resetReload"
        ></calendarGrid>
      </div>
    </div>
  </div>
</template>

<script>
import calendarGrid from "./calendarGrid";
import calendarForm from "./calendarForm";

const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const firebaseDB = "https://fir-ea490-default-rtdb.firebaseio.com/";
// const eventFile = "events.json";
// const axios = require('axios');


export default {
  name: "calendar",
  components: { calendarGrid, calendarForm },
  data: function() {
    return {
      //   calendarData: []
      days: days,
      months: months,
      now: Date.now(),
      increaseValue: 1,
      firestoneUrl: firebaseDB,
      events: [
        {
          ed_time: 1625801520000,
          invitees: [{ name: "aaa" }],
          name: "999",
          owner: "111",
          st_time: 1625787360000,
        },
      ],
      hideForm: true,
      reload: 0
    };
  },
  props: {
    msg: String,
  },
  methods: {
    nextMonth: function() {
      let newMonth = new Date(this.now).getMonth() + this.increaseValue;
      this.now = new Date(this.now).setMonth(newMonth);
      console.log(new Date(this.now));
    },
    prevMonth: function() {
      let newMonth = new Date(this.now).getMonth() - this.increaseValue;
      this.now = new Date(this.now).setMonth(newMonth);
      console.log(new Date(this.now));
    },
    addEvent: function() {
      // add new event to database
      // Here I use google firebase, the database will only keep for 30 days
      // console.log(event);
      this.reload=1;
    },
    formatDate: function(date){
      let month = (date.getMonth()+1).toString();
      let day = date.getDate().toString();
      let year = date.getFullYear();

      if(month.length<2){
        month = "0" + month;
      }
      if(day.length<2){
        day = "0" + day;
      }
      return [month, day, year].join("-")
    },
    resetReload: function(){
      this.reload = 0;
    }
  },
  computed: {
    calendarData: function() {
      let previousMonth = [];
      // let today = new Date()
      let firstDay = new Date(new Date(this.now).setDate(1));
      for (let i = firstDay.getDay(); i > 0; i--) {
        let date = new Date(new Date(this.now).setDate(1 + i));
        let plain_date = this.formatDate(date);
        previousMonth.push({
          date: plain_date,
          currentMonth: false,
          events: 0
        });
      }

      let currentMonth = [];
      let n = previousMonth.length;

      for (let i = 0; i < 42 - n; i++) {
        let date = new Date(new Date(this.now).setDate(1 + i));
        let plain_date = this.formatDate(date);
        currentMonth.push({
          date: plain_date,
          currentMonth: date.getMonth() == firstDay.getMonth() ? true : false,
          events: 0
        });
      }
      console.log(previousMonth, currentMonth);
      return [...previousMonth, ...currentMonth];
    },
    month: function() {
      return this.months[new Date(this.now).getMonth()];
    },
    fullYear: function() {
      return new Date(this.now).getFullYear();
    },
  },
  mounted() {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.calendar {
  position: relative;
  display: flex;
  background-color: rgba(243, 243, 243, 0.8);
  max-width: 1500px;
  min-width: 1000px;
  margin: auto;
  padding: 10px;
  justify-content: center;
}
.form-container {
  border-right: 1px solid black;
  min-width: 200px;
}
.calendar-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  /* border-right: 1px solid black; */
}
.calendar-container {
  margin: auto;
}

.calendar-nav {
  display: flex;
}

.calendar-nav > * {
  margin: 10px 5px;
}

.calendar-nav p {
  margin: auto 0;
}

.calendar-header {
  border: 1px solid white;
  background-color: rgb(74, 170, 49);
  color: white;
}
.calendar-main {
  display: grid;
  grid-template-columns: repeat(7, minmax(140px, 1fr));
  grid-template-rows: 20px repeat(6, minmax(140px, 1fr));
  color: #ddd;
}

.currentMonth {
  color: black;
}
.hide {
  display: none;
}
.noscroll {
  overflow: hidden;
}

@media only screen and (max-width: 1500px) {
  .form-container {
    border-right: none;
  }
  .calendar {
    flex-direction: column;
    align-items: center;
  }
}

@media only screen and (max-width: 1000px) {
  .calendar-main {
    display: grid;
    grid-template-columns: repeat(7, minmax(40px, 1fr));
    grid-template-rows: 20px repeat(6, minmax(40px, 1fr));
    color: #ddd;
  }
}
/* @media only screen and (max-width: 600px){
      .calendar-main {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: 20px repeat(6, 1fr);
          color: #ddd;
      }
    } */
</style>
