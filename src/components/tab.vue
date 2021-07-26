<template lang="html">
  <div class="tab" v-if="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "tab",
  props: {
    title: String,
  },
  data() {
    return {
      isActive: false,
    };
  },
  mounted() {},
};
</script>

<style lang="css"></style>
