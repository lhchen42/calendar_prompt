<template>
  <div>
    <hourEvent
      :class="['weekly-hour']"
      v-for="h in 24"
      :key="h"
      :ref="setHourRef"
      :hourHeight="hourHeight"
      @showDetails="showDetails"
    >
    </hourEvent>
  </div>
</template>

<script>
import myMixin from "./mixins/myMixin";
import { days, months, firebaseDB } from "./constants/myConstants";
import hourEvent from "./weeklyEventBox";
// import WeeklyHour from './weeklyHour.vue';
// const employees = ["Sam", "John", "Micheal"];
// const eventFile = "events.json";
const axios = require("axios");

export default {
  mixins: [myMixin],
  name: "weeklyHours",
  components: {
    hourEvent,
  },
  data: function() {
    return {
      hourRef: [],
      dayEvents: [],
      dayTitles: days,
      monthTitles: months,
      firestoneUrl: firebaseDB,
      hourHeight: 30,
    };
  },
  props: {
    date: Number, // TimeStamp
  },
  computed: {},
  methods: {
    setHourRef: function(el) {
      if (el) {
        this.hourRef.push(el);
      }
    },
    showDetails: function(event, ref) {
      this.$emit("showDetails", event, ref, this);
    },
    loadEvents: function() {
      const plainDate = this.getDateString(this.date);
      const eventsUrl = this.firestoneUrl + plainDate + ".json";
      axios
        .get(eventsUrl)
        .then((response) => {
          // console.log("response", response);
          if (response.statusText == "OK") {
            return response.data;
          }
        })
        .then((data) => {
          let result = {};
          for (const id in data) {
            result[new Date(data[id].st_time).getHours()] = {
              id: id,
              name: data[id].name,
              st_time: data[id].st_time,
              ed_time: data[id].ed_time,
              owner: data[id].owner,
              numInvitees: data[id].numInvitees,
              invitees: data[id].invitees,
              date: data[id].date,
            };
          }
          this.dayEvents = result;
        })
        .then(() => {
          // draw event box
          for (const i in this.hourRef) {
            if (this.dayEvents[i]) {
              // console.log("draw", i.toString(), this.dayEvents[i]);
              this.hourRef[i - 1].event = this.dayEvents[i];
            }
          }
        });
    },
  },
  mounted() {
    // console.log(Date.now());
    // console.log(this.getDateString(Date.now()));
    this.loadEvents();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.weekly-hour {
  position: relative;
  width: 100%;
  background-color: antiquewhite;
  border-bottom: 1px solid black;
  height: 30px;
}
</style>
