<template lang="html">
    <div class="madel" v-show="isActive">
      <button @click="hideModal">x</button>
      <div class="madel-container">
        <slot></slot>
      </div>
    </div>
</template>

<script>
export default {
  name: 'tab',
  props: {
    title: String
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    hideModal: function(){
      this.isActive = false;
    }
  },
  watch: {
    isActive: function(){
      if(this.isActive){
        document.body.style.overflow = "hidden";
      }
      else{
        document.body.style.overflow = "scroll";
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="css">
  .madel {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 3;
  }
  .madel > button {
    position: absolute;
    right: 10vw;
    top: 10vh;
    font-size: 20pt;
  }
  .madel-container{
    position: relative;
    display: flex;
    justify-content: center;
    margin: auto;
    top: 32vh;
    /* left: 0;
    right: 0;
    top: 32vh;
    bottom: 0;
    background-color: white;
    padding: 20px;
    width:  */
  }
  .madel-container > * {
    margin: auto;
    width: 100%;
  }
</style>