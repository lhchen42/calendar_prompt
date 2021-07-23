<template>
    <div>
        <div>{{ info.date.getDate() }}</div>
    </div>
</template>

<script>


export default {
  name: 'calendarGrid',
  props: {
    info: Object
  },
  data: function() {
    return {
      date: this.info.date,
      isCurrentMonth: this.info.currentMonth
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
    .calendar-grid{
        border: 1px solid #ddd;
        background-color:beige;
        overflow: hidden;
    }
</style>
