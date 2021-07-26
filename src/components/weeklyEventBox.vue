<template>
  <div>
    <div
      class="event-box"
      v-if="event != null"
      v-bind:style="boxHeight"
      @click.stop="showForm"
    >
      {{ height > 20 ? event.name : "" }}
    </div>
  </div>
</template>

<script>
import myMixin from "./mixins/myMixin";
import { days, months, firebaseDB } from "./constants/myConstants";
// const employees = ["Sam", "John", "Micheal"];
// const eventFile = "events.json";
// const axios = require('axios');

const milliPerHour = 3600000;

export default {
  mixins: [myMixin],
  name: "weeklyEventBox",
  data: function() {
    return {
      dayTitles: days,
      monthTitles: months,
      firestoneUrl: firebaseDB,
      event: null, // currently, only 1 event allow to display at an hour block
      top: 0,
      height: 0
    };
  },
  props: {
    hourHeight: Number,
  },
  computed: {
    boxHeight() {
      return {
        top: this.top + "px",
        height: this.height + "px",
      };
    },
  },
  watch: {
    event: function() {
      if (this.event) {
        this.updateBoxHeight();
      }
    },
  },
  methods: {
    updateBoxHeight: function() {
      const start_hour = this.getClockHour(this.event.st_time);
      const start_time = this.event.st_time;
      const end_time = this.event.ed_time;
      const shstDiff = start_time - start_hour;
      const shedDiff = end_time - start_time;
      // compute top - one hour is 20 px
      this.top = (shstDiff / milliPerHour) * this.hourHeight;
      // console.log(this.top);

      // compute boxHeight
      this.height = (shedDiff / milliPerHour) * this.hourHeight;
      // this.height += this.top;
      // console.log(this.height);
      // const fullHours = Math.floor(shedDiff/milliPerHour);
      // this.height = fullHours*this.hourHeight;
      // console.log(this.height);
      // const remainder = end_time-(fullHours*milliPerHour+start_time);
      // console.log(remainder);
      // this.height+=remainder/milliPerHour*this.hourHeight;
      // console.log(this.height);

      // if(shedDiff%milliPerHour!=0){
      //     const remainder = shedDiff%milliPerHour;
      //     this.height+=remainder/milliPerHour*this.hourHeight;
      // }
    },
    showForm: function() {
      console.log("evenbox clicked");
      this.$emit("showDetails", this.event, this);
    },
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.event-box {
  position: absolute;
  width: 98%;
  background-color: lightcoral;
  z-index: 2;
  border: 1px solid grey;
  border-radius: 10px;
  opacity: 0.8;
}
</style>
