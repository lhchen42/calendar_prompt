<template>
  <div>
    <p>{{ date.getDate() }}</p>
    <div
      class="event-item"
      v-for="event in eventsToday"
      v-bind:key="event"
    >
      {{ event.name }}
    </div>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "calendarGrid",
  props: {
    info: Object,
    firestoneUrl: String,
    reload: Number
  },
  data: function() {
    return {
      plainDate: this.info.date,
      isCurrentMonth: this.info.currentMonth,
      events: this.dayEvents
    };
  },
  computed: {
    date: function() {
      // console.log(this.plainDate);
      return new Date(this.plainDate);
    },
    eventsToday: function() {
      // console.log(this.events);
      return this.events;
    }
  },
  watch: {
    reload() {
      console.log(this.reload);
      this.loadEvents();
      this.$emit("reloadDone");
    }
  },
  methods: {
    loadEvents: function() {
      // load event data from server
      const eventsUrl = this.firestoneUrl+this.plainDate+".json";
      axios.get(eventsUrl)
        .then((response) => {
          if(response.statusText=="OK"){
            // console.log(response);
            return response.data
          }
        }).then((data) => {
          const result = []
          for(const id in data){
            result.push({
                id: id,
                name: data[id].name,
                st_time: data[id].st_time,
                ed_time: data[id].ed_time,
                owner: data[id].owner,
                invitees: data[id].invitees
             }
            )
            // console.log(result);
          }
          this.events = result;
        }).catch((error) => {
          console.log(error);
      });
    },
  },
  mounted() {
    this.loadEvents();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.calendar-grid {
  border: 1px solid #ddd;
  background-color: beige;
  /* overflow: hidden; */
}
.calendar-grid > p{
  margin: 2px auto;
}
.calendar-grid > .event-item {
  width: 97%;
  background-color: aqua;
  text-align: left;
  color: white;
  margin: auto;
  padding: 2px;
  border-radius: 5px;
}
</style>
