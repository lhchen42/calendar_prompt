<template>
    <div class="calendar-grid">
        <div>{{ info.date.getDate() }}</div>
        <div>appointment</div>
    </div>
</template>

<script>


export default {
  name: 'calendarGrid',
  props: {
    info: Object
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
