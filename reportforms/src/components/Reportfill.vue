<template>
  <div id="fill_report_box">
    <div class="fill_header">
      <span class="fill_title">报表填充</span>
      <span class="fill_exit" @click="handleExitfill">
        <img src="@/assets/exit.svg" />
      </span>
    </div>
    <div class="fill_content"></div>
    <div class="fill_bottom">
      <button class="fillBtn confirm" @click="handleConfirm">Confirm</button>
      <button class="fillBtn" @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import Drag from "@/unit/Drag";
import emitter from "@/unit/mittBus";

/* const handleExitfill = () => {
  emitter.emit("exitfill");
}; */
const handleExitfill = () => {
  ElMessageBox.confirm("确定退出报表内容填充?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      emitter.emit("exitfill");
    })
    .catch(() => {});
};
const handleConfirm = () => {
  console.log("Confirm");
  emitter.emit("exitfill");
};
const handleCancel = () => {
  console.log("Cancel");
  emitter.emit("exitfill");
};

onMounted(() => {
  new Drag("fill_report_box");
});
</script>
  
<style src="@/style/reportFill.scss" lang="scss"></style>
<style lang="scss">
</style>
