<template lang="html">
  <div class="tabs">
    <ul class="tab-header">
      <li
        v-for="(tab, index) in tabs"
        :key="tab.title"
        @click="selectTab(index)"
        :class="index == indexSelected ? 'selected' : ''"
      >
        {{ tab.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "tabHeaders",
  props: {
    tabs: Array,
  },
  data() {
    return {
      indexSelected: 0,
      childTabs: this.tabs,
    };
  },
  methods: {
    selectTab: function(index) {
      this.indexSelected = index;
      for (let i = 0; i < this.tabs.length; i++) {
        if (i == index) {
          console.log(this.childTabs[i].isActive);
          this.childTabs[i].isActive = true;
        } else {
          this.childTabs[i].isActive = false;
        }
      }
    },
  },
  mounted() {
    this.selectTab(0);
  },
};
</script>

<style scope lang="css">
.tab-header {
  list-style: none;
  text-align: left;
}
.tab-header > li {
  display: inline-block;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 0;
  margin-right: 5px;
  cursor: pointer;
  background-color: rgb(230, 230, 255);
  color: black;
}
.tab-header li:hover {
  background-color: antiquewhite;
}

.tab-header > li.selected {
  background-color: antiquewhite;
  color: black;
}
</style>
