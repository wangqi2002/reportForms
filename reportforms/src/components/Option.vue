<template>
  <div class="option_box">
    <div class="title_box">多用报表</div>
    <Reportcreate></Reportcreate>
    <Reporttype></Reporttype>
    <div class="download_box">
      <button class="download_btn" @click="downloadExcel">报表下载</button>
    </div>
    <!-- <button @click="handleFun">测试API</button> -->
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import { exportExcel } from "./export";
import LuckyExcel from "luckyexcel";

import Reportcreate from "@/components/Reportcreate.vue";
import Reporttype from "@/components/Reporttype.vue";

const jsonData = ref({});

/* const handleFun = () => {
  // luckysheet.setCellValue(0, 0, 1);
  // console.log(luckysheet.getRange());
  // console.log(luckysheet.getRangeWithFlatten());
  // console.log(luckysheet.getRangeValuesWithFlatte());
  console.log(luckysheet.getRangeValue());
  // luckysheet.setRangeShow("A1:E8")
  // luckysheet.setRangeShow([{row:[0,1],column:[0,1]},{row:[2,2],column:[3,8]}])
}; */

const downloadExcel = () => {
  exportExcel(luckysheet.getAllSheets(), "万能图表");
};
</script>
  
<style src="@/style/option.scss"  lang="scss"></style>
<style lang="scss">
</style>
