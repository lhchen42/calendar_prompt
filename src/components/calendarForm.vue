<template>
  <div class="calendarForm-main">
    <form @submit.prevent="submitEvent">
      <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
      <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      </p>
      <div>
        <label>Name: </label>
        <input type="text" v-model="name" required />
      </div>
      <div>
        <label>Date: </label>
        <input type="date" v-bind:min="minDate" v-model="date" required />
      </div>
      <div>
        <label> Start Time: </label>
        <input type="time" v-bind:min="minHour" v-model="stTime" required />
      </div>
      <div>
        <label> End Time: </label>
        <input type="time" v-bind:min="stTime" v-bind:max="maxHour" v-model="edTime" required />
      </div>
      <div>
        <label> Owner: </label>
        <input type="text" v-model="owner" required />
      </div>
      <div>
        <label> Invitees: </label>
        <input type="number" min="0" max="9" v-model="numInvitees" required />
      </div>
      <div>
        <div class="invitee-input-grids">
          <input
            type="text"
            class="invitee-input"
            v-for="invitee in invitees"
            v-bind:key="invitee"
            v-model="invitee.name"
            required
          />
        </div>
      </div>
      <div>
        <button type="submit">Add Event</button>
      </div>
    </form>
  </div>
</template>

<script>

// import axios from 'axios'

const minDate = "2000-01-01";
const minHour = "06:00";
const maxHour = "23:59";
// const dbLink = firebaseDB + dbFile;

const axios = require('axios');

const reformatDate = function(date){
  //yyyy-mm-dd to mm-dd-yyyy
  let t_date = date.split("-");
  return t_date[1] + "-" + t_date[2] + "-" + t_date[0];
}

const toDate = function(date, time) {
  // time stamp
  return + new Date(date + " " + time);
}

const compareDate = function(date1, date2){
  let t_date1 = + new Date(date1).setHours(0);
  let t_date2 = + new Date(date2).setHours(0);
//   console.log(t_date1.getFullYear()<t_date2.getFullYear())
    //  && t_date1.getMonth()<t_date2.getMonth
    //  && t_date1.getDate()<t_date2.getDate())
  if(t_date1 < t_date2){
      return false
  }
  return true
}

export default {
  name: "calendarForm",
  props: { 
    //   dbUrl: String,
      events: Array
   },
  data: function() {
    return {
      isActive: false,
      minDate: minDate,
      minHour: minHour,
      maxHour: maxHour,
      name: "",
      date: "",
      stTime: "",
      edTime: "",
      owner: "",
      numInvitees: 0,
      errors: [],
      firestoneUrl: "https://fir-ea490-default-rtdb.firebaseio.com/",
      dbUrl: ""
    };
  },
  computed: {
    invitees: function() {
      let l = [];
      for (let i = 0; i < this.numInvitees; i++) {
        l.push({ name: "" });
      }
      return l;
    },
    formatedDate: function(){
        return reformatDate(this.date);
    }
  },
  methods: {
    validateInput: function() {
        // name: characters other than alphebet or number is disallow
        // Date: any date before "today" is disallow, also edit to the appointment in the past is disallow
        // st_Time: time earlier than 6 am is disallow
        // ed_Time: time earlier than st_Time or later than 11:59 is disallow
        // owner: characters other than alphebet is disallow
        // Invitee: characters other than alphebet is disallow
        // (in case using email is another story)
        console.log("validate form")

        this.errors = [];
        let alnumReg = "^[a-zA-Z0-9]+$";
        let alReg = "^[a-zA-Z]+$";
        if(!this.name.match(alnumReg)){
            this.errors.push("name: only alphbet characters and number");
        }

        //compareDate return false if arg1 is earlier than arg2, in year, month and date
        if(!compareDate(this.formatedDate, Date.now())){
            this.errors.push("date: cannot be the past");
        }

        let start_time = toDate(this.formatedDate, this.stTime);
        let end_time = toDate(this.formatedDate, this.edTime);

        //toDate return time stamp
        if(start_time < + new Date(this.formatedDate).setHours(6)){
            this.errors.push("start time: cannot be earlier than 6 am")
        }

        // console.log(end_time<=start_time, end_time, start_time, this.edTime, this.stTime);
        if(end_time<=start_time){
            this.errors.push("end time: cannot be earlier or same to start time");
        }

        if(end_time> toDate(this.formatedDate, "23:59")){
            this.errors.push("end time: cannot be later than 23:59/11:59 PM");
        }

        if(!this.owner.match(alReg)){
            this.errors.push("owner: only alphbet character");
        }

        for(let i=0; i<this.invitees.length; i++){
            if(!this.invitees[i].name.match(alReg)){
                this.errors.push("invitee: only alphbet chracter");
                break;
            }
        }

        // // check time overlap
        // for(let i=0; i<)

        if(this.errors.length > 0){
            return false;
        }
        return true
    },
    submitEvent: function() {
      //console.log("1");
      //thing to do change date_st_time and date_ed_time to DATE
      //   console.log(this.invitees);
      // validate submit data
      this.dbUrl = this.firestoneUrl+this.formatedDate+".json";
      console.log(this.dbUrl);
      if (this.validateInput()){
        // upload event to server        
        // then update local data
        let event = {
            name: this.name,
            date: this.formatedDate,
            st_time: toDate(this.formatedDate, this.stTime),
            ed_time: toDate(this.formatedDate, this.edTime),
            owner: this.owner,
            invitees: this.invitees,
        };
        axios.post(this.dbUrl, event)
        .then((response) => {
            if(response.statusText=="OK"){
                return response.data;
            }
        }).then((data) => {
            event.id = data.name;
            this.$emit("submitEvent");
        }).catch((error) => {
            console.log(error);
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.calendarForm-main {
}
.calendarForm-main > form {
  display: flex;
  flex-direction: column;
}
.calendarForm-main form > div {
  display: flex;
  margin: 5px 3px;
}
.calendarForm-main form > div > label {
  width: 100px;
  text-align: left;
}
.invitee-input-grids {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  justify-content: space-around;
  grid-gap: 5px;
}
.invitee-input {
  max-width: 80px;
}
</style>
