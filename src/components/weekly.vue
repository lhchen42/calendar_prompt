<template>
  <div class="weekly-calendar">
    <div class="weekly-container">
      <div class="weekly-nav">
        <h2>Weekly Calendar</h2>
        <button v-on:click="prevDay">&lt;</button>
        <p class="month-year">{{ month }} {{ day }} {{ fullYear }}</p>
        <button v-on:click="nextDay">&gt;</button>
      </div>
      <div class="weekly-main-container">
        <div class="weekly-main">
          <div class="time-labels">
            Hours
            <div v-for="h in 24" :key="h" :class="['time-label', 'weekly-row']">
              {{ h }}
            </div>
          </div>
          <div
            v-bind:class="['weekly-header', day == today ? 'today' : '']"
            v-for="day in weeklyData"
            :key="day"
            :title="getDateString(day)"
            :ref="setDayRef"
          >
            {{ getDayTitle(day) }}
            <weeklyHours
              v-bind:date="day"
              @showDetails="showDetails"
            ></weeklyHours>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weeklyHours from "./weeklyHours";
import myMixin from "./mixins/myMixin";

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
  components: {
    weeklyHours,
  },
  data: function() {
    return {
      fullYear: "2021",
      today: this.getDateWithoutTime(Date.now()),
      //   dayTitles: days,
      offset: 0,
      dayRef: [],
      events: [],
      dayTitles: days,
      monthTitles: months,
      firestoneUrl: firebaseDB,
    };
  },
  props: {},
  computed: {
    day: function() {
      return new Date(this.startDay).getDate();
    },
    month: function() {
      return this.getMonthTitle(new Date(this.startDay).getMonth());
    },
    startDay: function() {
      return this.getNewDate(this.today).setDate(
        this.getDate(this.today) + this.offset
      );
    },
    weeklyData: function() {
      // return 7 day data
      //   console.log(this.startDay);
      //   console.log(new Date(this.startDay).getDay());
      //   let today_Day = this.getDay(this.startDay);
      let today_Date = this.getDate(this.startDay);
      let weekDays = [];
      for (let i = 0; i < 7; i++) {
        let newDate = this.getNewDate(this.startDay).setDate(today_Date + i);
        weekDays.push(newDate);
      }
      //get events

      return weekDays;
    },
  },
  methods: {
    prevDay: function() {
      this.offset -= 1;
    },
    nextDay: function() {
      this.offset += 1;
    },
    setDayRef: function(el) {
      if (el) {
        this.dayRef.push({ [el]: [] });
      }
    },
    setHourRef: function(el, index) {
      if (el) {
        this.dayRef[index].push();
      }
    },
    showDetails: function(event, eventRef, hourRef) {
      this.$emit("showDetails", event, eventRef, hourRef);
    },
  },
  mounted() {
    // console.log(this.gridRef);
    // console.log(this.dayRef);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.weekly-calendar {
  text-align: center;
  padding: 40px;
  border-radius: 20px;
  background-color: white;
  -moz-box-shadow: 0 0 3px rgb(102, 102, 102);
  -webkit-box-shadow: 0 0 3px rgb(102, 102, 102);
  box-shadow: 0 0 3px rgb(102, 102, 102);
}
.weekly-nav {
  display: flex;
}

.weekly-nav > * {
  margin: 10px 5px;
}

.weekly-nav p {
  margin: auto 0;
}

.weekly-main-container {
  max-height: 1000px;
  width: 100%;
  overflow-y: scroll;
}

.weekly-main {
  display: flex;
  justify-content: space-around;

  /* grid-template-columns: repeat(7, minmax(140px, 1fr));
        grid-template-rows: 20px repeat(6, minmax(140px, 1fr)); */
}
.weekly-header {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: greenyellow;
  flex: 1 0 auto;
  min-width: 110px;
}
.time-labels > * {
  height: 20px;
  border-bottom: 1px solid black;
}
.today {
  background-color: lightblue;
  border-left: 1px solid black;
  border-right: 1px solid black;
}
.weekly-row {
  height: 30px;
}
</style>
