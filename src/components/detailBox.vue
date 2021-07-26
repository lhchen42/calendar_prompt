<template>
  <div class="calendarForm-main">
    <div>
    <form @submit.prevent="submitEvent">
      <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
      <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      </p>
      <div>
        <label>Name: </label>
        <input type="text" v-model="name" required :disabled="disableForm"/>
      </div>
      <div>
        <label>Date: </label>
        <input type="date" v-bind:min="minDate" v-model="date" disabled/>
      </div>
      <div>
        <label> Start Time: </label>
        <input type="time" v-bind:min="minHour" v-model="stTime" :disabled="disableForm" required />
      </div>
      <div>
        <label> End Time: </label>
        <input type="time" v-bind:min="stTime" v-bind:max="maxHour" v-model="edTime" :disabled="disableEdTime || disableForm"  required />
      </div>
      <div>
        <label> Owner: </label>
        <select v-model="owner" disabled required>
          <option v-for="user in users" :key="user" :value="user">{{ user }}</option>
        </select>
        <!-- <input type="text" v-model="owner" required /> -->
      </div>
      <div>
        <label> Invitees: </label>
        <input type="number" min="0" max="9" v-model="numInvitees" required :disabled="disableForm" />
      </div>
      <div>
        <div class="invitee-input-grids">
          <input
            type="text"
            class="invitee-input"
            v-for="invitee in invitees"
            v-bind:key="invitee"
            v-model="invitee.name"
            :disabled="disableForm"
            required
          />
        </div>
      </div>
      <div>
        <button @click.stop.prevent="deleteEvent" :disabled="disableForm">Delete</button>
        <button @click.stop.prevent="updateEvent" :disabled="disableForm">Update</button>
        <button @click.stop.prevent="exportJSON">Export</button>
      </div>
    </form>
    </div>
  </div>
</template>

<script>
// // import axios from 'axios'
import myMixin from "./mixins/myMixin"
import myConst from "./constants/myConstants"

const minDate = "2000-01-01";
const minHour = "06:00";
const maxHour = "23:59";
// // const dbLink = firebaseDB + dbFile;

// const defaultName = "";
// const defaultStTime = "";
// const defaultEdTime = "";
// const defaultDate = "";
// const defaultNumInvitees = 0;
// const defaultOwner = "";

const axios = require("axios");

// const reformatDate = function (date) {
//   //yyyy-mm-dd to mm-dd-yyyy
//   let t_date = date.split("-");
//   return t_date[1] + "-" + t_date[2] + "-" + t_date[0];
// };

// const toDate = function (date, time) {
//   // time stamp
//   return +new Date(date + " " + time);
// };

// const compareDate = function (date1, date2) {
//   let t_date1 = +new Date(date1).setHours(0);
//   let t_date2 = +new Date(date2).setHours(0);
//   //   console.log(t_date1.getFullYear()<t_date2.getFullYear())
//   //  && t_date1.getMonth()<t_date2.getMonth
//   //  && t_date1.getDate()<t_date2.getDate())
//   if (t_date1 < t_date2) {
//     return false;
//   }
//   return true;
// };

export default {
  mixins: [myMixin],
  name: "detailBox",
  props: {
    // date: String,
    // eventId: String
    event: Object,
    users: Array,
    currentUser: String
  },
  data: function () {
    return {
        minDate: minDate,
        minHour: minHour,
        maxHour: maxHour,
        errors: [],
        selectedEvent: this.event,
        name: '',
        date: '',
        stTime: '',
        edTime: '',
        owner: this.currentUser,
        numInvitees: '',
        invitees: []
    };
  },
  watch: {
      event: function (){
        //   console.log(this.event)
        if(this.event){
          this.name = this.event.name;
          this.date = this.yearFirstFormat(this.event.date);
          this.stTime = this.timeStampToFormTime(this.event.st_time);
          this.edTime = this.timeStampToFormTime(this.event.ed_time);
          this.owner = this.event.owner;
          this.numInvitees = this.event.numInvitees;
          this.invitees = this.event.invitees;
        }
      },
      numInvitees: function(){
        if(this.invitees){
          if(this.numInvitees>this.invitees.length){
            this.invitees.push({name: ''});
          }
          if(this.numInvitees<this.invitees.length){
            this.invitees.pop();
          }
        }
        else{
          let l = [];
          for (let i = 0; i < this.numInvitees; i++) {
            l.push({ name: "" });
          }
          this.invitees = l;
        }
      }
  },
  computed: {
    disableEdTime: function() {
      return this.stTime === "" ? true : false;
    },
    disableForm: function() {
        return this.owner === this.currentUser ? false : true;
    }
  },
  methods: {
      deleteEvent: function() {
          const firebaseUrl = myConst.firebaseDB + this.event.date + "/" + this.event.id + ".json";
        //   console.log(axios);
        //   console.log(firebaseUrl);
        //   this.$emit("reloadWeekly");
          axios.delete(firebaseUrl).then((response) => {
            //   console.log(response);
              if(response.statusText==="OK"){
                  console.log("delete successs");
                  this.$emit("deleteEvent");
              }
          })
      },
      updateEvent: function() {
        console.log("updateEvent")
        const firebaseUrl = myConst.firebaseDB + this.event.date + "/" + this.event.id + ".json";
        const formatedDate = this.monthFirstFormat(this.date);
        let event = {
          name: this.name,
          date: formatedDate,
          st_time: this.toDate(formatedDate, this.stTime),
          ed_time: this.toDate(formatedDate, this.edTime),
          owner: this.owner,
          numInvitees: this.numInvitees,
          invitees: this.invitees
        }
        if(this.validateInput(event)) {
            this.checkOverlap(event, this.event.id).then((returnVal) => {
            console.log(returnVal);
            if(this.errors.length === 0){
              axios.put(firebaseUrl, event).then((response) => {
                // console.log(response);
                if(response.statusText === "OK"){
                  console.log("update success")
                  return response.data;
                }
              }).then((data) => {
                this.$emit("updateEvent", data);
              });
            }
          });
        }
      },
      exportJSON() {
        const event = {
          name: this.name,
          date: this.date,
          st_time: this.stTime,
          ed_time: this.edTime,
          owner: this.owner,
          numInvitees: this.numInvitees,
          invitees: this.invitees
        }
        let jsonStr = JSON.stringify(event);
        let url = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonStr);
        let defaultName = event.name+".json";
        let tmpElement = document.createElement('a');
        tmpElement.setAttribute('href', url);
        tmpElement.setAttribute('download', defaultName);
        tmpElement.click();
        tmpElement.remove();
      }
  },
  mounted: function() {

  }
}

</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.calendarForm-main button {
    margin-right: 5px;
    padding: 2px 10px;
}
</style>
