<template>
  <el-container class="container_box">
    <el-aside class="option_box">
      <Option></Option>
    </el-aside>
    <el-main class="content_box">
      <Luckysheet></Luckysheet>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, provide, createApp, onMounted } from "vue";
import emitter from "@/unit/mittBus";

import Luckysheet from "@/components/Luckysheet.vue";
import Reportfill from "@/components/Reportfill.vue";
import Option from "@/components/Option.vue";
import store from '@/store'

const reportfillInstance = createApp(Reportfill).use(store);
const mountNode = document.createElement("div");
let flag = false;

const handleFillbox = (type, value) => {
  const el = document.getElementById("fill_report_box");
  if (el == null) {
    document.body.appendChild(mountNode);
    if (!flag) {
      reportfillInstance.mount(mountNode);
      flag = !flag;
    }
    setTimeout(() => {
      emitter.emit("filltype", { type: type, range: value });
    }, 350);
  }
};
const handleRemovefillbox = () => {
  document.body.removeChild(mountNode);
};

provide("handleFillbox", handleFillbox);

onMounted(() => {
  emitter.on("exitfill", (e) => {
    handleRemovefillbox();
  });
});
</script>
<style lang="scss">
$option: 250px;

* {
  padding: 0;
  margin: 0;
}

.container_box {
  width: 100%;
  height: 100%;

  .option_box {
    width: $option;
  }

  .content_box {
    width: calc(100% - $option);
    height: 100%;
    padding: 0;
    overflow: hidden;
  }
}
</style>
