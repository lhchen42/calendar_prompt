<template>
<div class="calendar">
  <div class="form-container">
    <div class="calendar-form">
      <calendarForm ></calendarForm>
    </div>
  </div>
  <div class="calendar-container">
    <div>
      <div class="calendar-nav">
        <h2>Monthly Calendar</h2>
        <button v-on:click="prevMonth">&lt;</button>
        <p class="month-year">{{ month}} {{ fullYear }}</p>
        <button v-on:click="nextMonth">&gt;</button>
      </div>
    </div>
    <div class="calendar-main">
      <div class="calendar-header" v-for="day in days" v-bind:key=day>{{ day }}</div>
      <calendarGrid v-bind:class="['calendar-grid', data.currentMonth ? 'currentMonth': '']" v-for="data in calendarData" v-bind:key="data.label" v-bind:info="data" @click="spawnCalendarForm"></calendarGrid>
    </div>
  </div>
</div>
</template>

<script>

import calendarGrid from "./calendarGrid"
import calendarForm from "./calendarForm"

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', "Apr", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
  name: 'calendar',
  components: { calendarGrid, calendarForm },
  data: function () {
      return {
        //   calendarData: []
        days: days,
        months: months,
        now: Date.now(),
        increaseValue: 1,
        events: [],
        hideForm: true
      }
  },
  props: {
    msg: String
  },
  methods: {
    nextMonth: function(){
        let newMonth = new Date(this.now).getMonth()+this.increaseValue;
        this.now=new Date(this.now).setMonth(newMonth);
        console.log(new Date(this.now));
    },
    prevMonth: function(){
        let newMonth = new Date(this.now).getMonth()-this.increaseValue;
        this.now=new Date(this.now).setMonth(newMonth);
        console.log(new Date(this.now));
    }
    // spawnCalendarForm: function() {
    //   this.hideForm = false;
    // }
  },
  computed: {
      // calendarData: function(){
      //     return this.calendarData;
      // },
      calendarData: function(){
          let previousMonth = [];
          // let today = new Date()
          let firstDay = new Date(new Date(this.now).setDate(1));
          for(let i=firstDay.getDay(); i>0; i--){
              previousMonth.push({
                  date: new Date(new Date(this.now).setDate(1-i)),
                  currentMonth: false
                }
              );
          }
          
          let currentMonth = []
          let n = previousMonth.length;
          
          for(let i=0; i<(42-n); i++){
              let date = new Date(new Date(this.now).setDate(1+i))
              currentMonth.push(
                  { 
                    date: date,
                    currentMonth: date.getMonth()==firstDay.getMonth() ? true : false
                  }
                );
          }
          console.log(previousMonth, currentMonth);
          return [...previousMonth, ...currentMonth];
      },
      month: function(){
        return this.months[new Date(this.now).getMonth()];
      },
      fullYear: function(){
        return new Date(this.now).getFullYear();
      },
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .calendar {
      position: relative;
      display: flex;
      margin: 20px 5px;
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
      display:flex;
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
        color: white
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

    @media only screen and (max-width: 1500px){
      .form-container{
        border-right: none;
      }
      .calendar{
        flex-direction: column;
        align-items: center;
      }
    }

    @media only screen and (max-width: 1000px){
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
