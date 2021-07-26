<template>
  <div class="calendar">
    <!-- <div class="form-container">
      <div class="calendar-form">
        <calendarForm
          v-on:submitEvent="addEvent"
          v-bind:dbUrl="firestoneUrl"
        ></calendarForm>
      </div>
    </div> -->
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
          v-bind:ref="setGridRef"
          v-bind:key="data.date"
          v-bind:info="data"
          v-bind:firestoneUrl="firestoneUrl"
          @showForm="showForm"
        ></calendarGrid>
      </div>
    </div>
  </div>
</template>

<script>
import calendarGrid from "./calendarGrid";
import myMixin from "./mixins/myMixin";
// import calendarForm from "./calendarForm";

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
// const employees = ["Sam", "John", "Micheal"];
// const eventFile = "events.json";
// const axios = require('axios');

export default {
  mixins: [myMixin],
  name: "calendar",
  components: { calendarGrid },
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
      gridRef: [],
    };
  },
  props: {
    msg: String,
  },
  methods: {
    nextMonth: function() {
      this.gridRef = [];
      let newMonth = new Date(this.now).getMonth() + this.increaseValue;
      this.now = new Date(this.now).setMonth(newMonth);
      // console.log(new Date(this.now));
    },
    prevMonth: function() {
      this.gridRef = [];
      let newMonth = new Date(this.now).getMonth() - this.increaseValue;
      this.now = new Date(this.now).setMonth(newMonth);
      // console.log(new Date(this.now));
    },
    addEvent: function(event) {
      // add new event to database
      // Here I use google firebase, the database will only keep for 30 days
      for (let i = 0; i < this.gridRef.length; i++) {
        if (this.gridRef[i].info.date === event.date) {
          this.gridRef[i].events.push(event);
          break;
        }
      }
    },
    formatDate: function(date) {
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      let year = date.getFullYear();

      if (month.length < 2) {
        month = "0" + month;
      }
      if (day.length < 2) {
        day = "0" + day;
      }
      return [month, day, year].join("-");
    },
    resetReload: function() {
      this.reload = 0;
    },
    setGridRef: function(el) {
      if (el) {
        this.gridRef.push(el);
      }
    },
    showForm: function(date) {
      // console.log(event);
      // console.log(date);
      let selectedRef = null;
      for (const i in this.gridRef) {
        if (this.gridRef[i].info.date === date) {
          // console.log(this.gridRef[i].info.date, date);
          selectedRef = this.gridRef[i];
        }
      }
      this.$emit("showForm", selectedRef);
    },
    isToday: function(data) {
      return data === this.getDateString(this.now);
    },
  },
  computed: {
    calendarData: function() {
      return this.monthData;
    },
    monthData: function() {
      let previousMonth = [];
      // let today = new Date()
      let firstDay = new Date(new Date(this.now).setDate(1));
      for (let i = firstDay.getDay(); i > 0; i--) {
        let date = new Date(new Date(this.now).setDate(1 - i));
        let plain_date = this.formatDate(date);
        previousMonth.push({
          date: plain_date,
          currentMonth: false,
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
        });
      }
      // console.log(previousMonth, currentMonth);
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
    // console.log(this.gridRef);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.calendar {
  position: relative;
  display: flex;
  max-width: 1500px;
  min-width: 1000px;
  margin: auto;
  padding: 10px;
  justify-content: center;
  border-radius: 10px;
  -moz-box-shadow: 0 0 3px rgb(102, 102, 102);
  -webkit-box-shadow: 0 0 3px rgb(102, 102, 102);
  box-shadow: 0 0 3px rgb(102, 102, 102);
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
  background-color: greenyellow;
  color: black;
  text-align: center;
  font-weight: 600;
}
.calendar-main {
  display: grid;
  grid-template-columns: repeat(7, minmax(140px, 1fr));
  grid-template-rows: 20px repeat(6, minmax(135px, 1fr));
  color: #ddd;
  background-color: rgb(233, 245, 235);
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
