<template>
  <div :class="{ today: isToday }" @click="showForm($event)">
    <p>{{ date.getDate() }}</p>
    <div class="event-item" v-for="event in eventsToday" v-bind:key="event">
      {{ event.name }}
    </div>
    <div v-if="showTreeDots">...</div>
  </div>
</template>

<script>
import myMixin from "./mixins/myMixin";

const axios = require("axios");
export default {
  mixins: [myMixin],
  name: "calendarGrid",
  props: {
    info: Object,
    firestoneUrl: String,
    // reload: Boolean
  },
  data: function() {
    return {
      plainDate: this.info.date,
      now: Date.now(),
      isCurrentMonth: this.info.currentMonth,
      events: [],
      maxToShow: 4,
    };
  },
  computed: {
    date: function() {
      // console.log(this.plainDate);
      return new Date(this.plainDate);
    },
    eventsToday: function() {
      let eventsToShow = this.events.slice(0, this.maxToShow);
      return eventsToShow;
    },
    showTreeDots: function() {
      return this.events.length > 4 ? true : false;
    },
    isToday: function() {
      return this.plainDate === this.getDateString(this.now);
    },
  },
  watch: {
    // reload: function(){
    //   this.loadEvents();
    // }
  },
  methods: {
    loadEvents: function() {
      // load event data from server
      const eventsUrl = this.firestoneUrl + this.plainDate + ".json";
      // console.log(eventsUrl);
      axios
        .get(eventsUrl)
        .then((response) => {
          if (response.statusText == "OK") {
            // console.log(response);
            return response.data;
          }
        })
        .then((data) => {
          const result = [];
          for (const id in data) {
            result.push({
              id: id,
              name: data[id].name,
              st_time: data[id].st_time,
              ed_time: data[id].ed_time,
              owner: data[id].owner,
              invitees: data[id].invitees,
            });
            // console.log(result);
          }
          this.events = result;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    reload: function() {
      console.log("reload");
      this.loadEvents();
      // console.log(this.events);
    },
    showForm: function() {
      this.$emit("showForm", this.plainDate);
    },
  },
  mounted() {
    this.loadEvents();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.calendar-grid {
  font-family: Helvetica;
  font-size: 11pt;
  border: 1px solid #ddd;
  overflow: hidden;
  text-align: center;
}
.calendar-grid > p {
  margin: 2px auto;
}
.calendar-grid > .event-item {
  width: 94%;
  background-color: lightcoral;
  text-align: left;
  color: white;
  margin: 0 auto 1px auto;
  padding: 2px;
  border-radius: 5px;
}
.today {
  background-color: lightblue;
  font-weight: 600;
}
</style>
