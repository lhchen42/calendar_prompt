<template>
<div>
  <div class="calendar-nav">
    <button v-on:click="prevMonth">&lt;</button>
    <div class="month-year">{{ months[new Date(now).getMonth()] }} {{new Date(now).getFullYear()}}</div>
    <button v-on:click="nextMonth">&gt;</button>
  </div>
  <div class="calendar">
    <div class="calendar-header" v-for="day in days" v-bind:key=day>{{ day }}</div>
    <calendarGrid v-bind:class="data.currentMonth ? 'currentMonth' : ''" v-for="data in getData" v-bind:key="data.label" v-bind:info="data"></calendarGrid>
  </div>
</div>
</template>

<script>
import calendarGrid from "./calendarGrid"

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', "Apr", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
  name: 'calendar',
  components: { calendarGrid },
  data: function () {
      return {
        //   calendarData: []
        days: days,
        months: months,
        now: Date.now(),
        mIndex: 1
      }
  },
  props: {
    msg: String
  },
  methods: {
    nextMonth: function(){
        let newMonth = new Date(this.now).getMonth()+this.mIndex;
        this.now=new Date(this.now).setMonth(newMonth);
        console.log(new Date(this.now));
    },
    prevMonth: function(){
        let newMonth = new Date(this.now).getMonth()-this.mIndex;
        this.now=new Date(this.now).setMonth(newMonth);
        console.log(new Date(this.now));
    }
  },
  computed: {
      getData: function(){
          return this.calendarData;
      },
      calendarData: function(){
          let previousMonth = [];
          // let today = new Date()
          let firstDay = new Date(new Date(this.now).setDate(1));
          for(let i=firstDay.getDay(); i>0; i--){
              previousMonth.push({
                  date: new Date(new Date(this.now).setDate(1-i)),
                  currentMonth: 0
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
                    currentMonth: date.getMonth()==firstDay.getMonth() ? 1 : 0
                  }
                );
          }
          console.log(previousMonth, currentMonth);
          return [...previousMonth, ...currentMonth]
      },

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .calendar {
        display: grid;
        grid-template-columns: repeat(7, auto);
        grid-template-rows: 20px repeat(6, 140px);
        color: #ddd;
    }
    .calendar-nav {
        display:flex;
        justify-content: center;
    }
    .calendar-nav > * {
        margin: 10px 5px
    }
    .calendar-nav button {
        /* background-color: white; */
    }
    .calendar-header {
        border: 1px solid white;
        background-color: rgb(74, 170, 49);
        color: white
    }
    .currentMonth {
        color: black;
    }
</style>
