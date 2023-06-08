<template>
  <div class="luckysheet_box">
    <div id="luckysheet"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import emitter from "@/unit/mittBus";

const store = useStore()

const createLuckysheet = () => {
  let initialOption =
  {
    name: "Sheet1",
    color: "",
    status: "1",
    order: "0",
    data: [],
    config: {},
    index: 0,
  }
  let excelOptions = store.state.luckyOptions;
  excelOptions.data.push(initialOption);
  luckysheet.create(excelOptions);
}
const handleSetdata = (value) => {
  let excelOptions = store.state.luckyOptions;
  excelOptions.data = value;
  luckysheet.create(excelOptions);
}

// !!! create luckysheet after mounted
onMounted(() => {
  createLuckysheet()
  emitter.on("setLucky", (e) => {
    handleSetdata(e);
  });
});
</script>

<style lang="scss">
.luckysheet_box {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;

  #luckysheet {
    width: 100%;
    height: 100%;
  }
}
</style>
