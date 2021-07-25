<template>
  <div>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <header style="background-color: black; width: 100vw; color: white;">
      Calendar Header
    </header>
    <section>
      <calendar />
    </section>
    <footer style="background-color: black;"></footer>
  </div>
</template>

<script>
import calendar from "./components/calendar.vue";

export default {
  name: "App",
  components: {
    calendar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
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

#app > div > * {
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
</style>
