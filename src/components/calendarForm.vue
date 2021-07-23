<template>
        <div class="calendarForm-main">
            <form>
                <div>
                <label>Name: </label>
                <input>
                </div>
                <div>
                <label>Date: </label>
                <input type="date">
                </div>
                <div>
                <label> Start Time: </label>
                <input type="time" value="08:00">
                </div>
                <div>
                <label> End Time: </label>
                <input type="time" value="08:00">
                </div>
                <div>
                <label> Owner: </label>
                <input>
                </div>
            </form>
        </div>
</template>

<script>


export default {
  name: 'calendarForm',
  props: {

  },
  data: function() {
    return {
        isActive: false
    }
  },
  computed: {

  },
  methods: {
  }
}
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

</style>
