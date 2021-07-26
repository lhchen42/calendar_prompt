<template>
  <div>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <header style="background-color: black; width: 100vw; color: white;">
      Calendar Header
      <div>
        <select v-model="currentUser">
          <option v-for="user in sampleUsers" :key="user" :value="user">{{
            user
          }}</option>
        </select>
      </div>
    </header>
    <section>
      <tab-headers v-bind:tabs="tabs"> </tab-headers>
      <tab ref="monthly" title="Monthly">
        <calendar @showForm="showForm" />
      </tab>
      <tab ref="weekly" title="Weekly">
        <weekly @showDetails="showDetails" />
      </tab>
    </section>
    <modal ref="formModal"
      ><calendarForm
        :selectedDate="selectedDate"
        @submitEvent="submitEvent"
        :users="sampleUsers"
        :currentUser="currentUser"
    /></modal>
    <modal ref="detailModal"
      ><detailBox
        @showDetails="showDetails"
        @deleteEvent="deleteEvent"
        :event="event"
        :users="sampleUsers"
        :currentUser="currentUser"
    /></modal>
    <footer style="background-color: black;"></footer>
  </div>
</template>

<script>
import calendar from "./components/calendar.vue";
import tab from "./components/tab";
import tabHeaders from "./components/tabHeaders";
import modal from "./components/modal";
import calendarForm from "./components/calendarForm";
import weekly from "./components/weekly";
import detailBox from "./components/detailBox.vue";

import myMixin from "./components/mixins/myMixin";
import myConst from "./components/constants/myConstants";

export default {
  mixins: [myMixin],
  name: "App",
  components: {
    calendar,
    weekly,
    tab,
    tabHeaders,
    modal,
    calendarForm,
    detailBox,
  },
  data: function() {
    return {
      tabs: [],
      models: null,
      target: null,
      detailsTarget: null,
      event: null,
      sampleUsers: myConst.sampleUsers,
      currentUser: myConst.sampleUsers[0], // default current user
    };
  },
  methods: {
    showForm: function(ref) {
      // show form to add new event in monthly tab
      // weekly tab not support yet
      // emit all the way from calendarGrid
      this.models.isActive = true;
      this.target = ref;
    },
    submitEvent: function(event) {
      // console.log(this.target);
      this.models.isActive = false;
      this.target.events.push(event);
      this.target = null;
    },
    showDetails: function(event, ref) {
      // show detail modal on clicking event box in weekly tab
      // emit all the way from weeklyEventBox
      // month tab not support yet
      this.detailModal.isActive = true;
      this.event = event;
      this.detailsTarget = ref;
    },
    deleteEvent: function() {
      this.detailsTarget.event = null;
      this.detailModal.isActive = false;
    },
  },
  computed: {
    selectedDate() {
      if (this.target) {
        // convert mm-dd-yyyy to yyyy-mm-dd that html form use
        const yearFirst = this.yearFirstFormat(this.target.plainDate);
        // console.log(yearFirst)
        return yearFirst;
      }
      return "";
    },
  },
  watch: {
    // currentUser: function() {
    //   console.log(this.currentUser);
    // }
  },
  mounted() {
    this.$refs.monthly.isActive = true;
    this.tabs.push(this.$refs.monthly);
    this.tabs.push(this.$refs.weekly);
    this.models = this.$refs.formModal;
    this.detailModal = this.$refs.detailModal;
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column; */
  min-height: 700px;
  min-width: 1000px;
}

#app > div {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app > div > header {
  min-width: 1100px;
  padding: 30px 0;
  text-align: center;
}

#app > div > footer {
  min-width: 1100px;
  padding: 30px 0;
  text-align: center;
}

/* #app > div > footer {
  padding: 30px;
} */

#app > div > section {
  min-height: 1000px;
  min-width: 700px;
  margin: 10px 50px;
}

#app button {
  background-color: white;
  box-shadow: none;
  border: none;
  -moz-box-shadow: 0 0 3px rgb(102, 102, 102);
  -webkit-box-shadow: 0 0 3px rgb(102, 102, 102);
  box-shadow: 0 0 3px rgb(102, 102, 102);
}

#app button:hover {
  background-color: silver;
  -moz-box-shadow: 0 0 5px rgb(102, 102, 102);
  -webkit-box-shadow: 0 0 5px rgb(102, 102, 102);
  box-shadow: 0 0 5px rgb(102, 102, 102);
}
#app button:active {
  box-shadow: 0 5px #666;
  transform: translateY(2px);
}
#app .month-year {
  width: 100px;
  text-align: center;
}
</style>
