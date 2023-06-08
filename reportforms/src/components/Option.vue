<template>
  <div class="option_box">
    <div class="title_box">多用报表</div>
    <Reportcreate></Reportcreate>
    <Reporttype></Reporttype>
    <Reportconfig></Reportconfig>
    <div class="download_box">
      <el-divider>报表导出</el-divider>
      <button class="download_btn" @click="downloadReport">导出报表</button>
      <button class="print_btn" @click="printReport">打印报表</button>
      <button class="print_btn" @click="handleFun">测试API</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import { exportExcel } from "@/unit/export";

import Reportcreate from "@/components/Reportcreate.vue";
import Reporttype from "@/components/Reporttype.vue";
import Reportconfig from "@/components/Reportconfig.vue";

const jsonData = ref({});


const handleFun = () => {
  // luckysheet.setCellValue(0, 0, 1);
  // console.log(luckysheet.getRange());
  // console.log(luckysheet.getRangeWithFlatten());
  // console.log(luckysheet.getRangeValuesWithFlatte());
  // luckysheet.setRangeShow({ row: [0, 1], column: [0, 2] })
  // console.log(luckysheet.getRangeValue({ row: [0, 1], column: [0, 2] }));
  // console.log(luckysheet.transToCellData(luckysheet.getRangeValue({ row: [0, 1], column: [0, 2] })))
  console.log(document.querySelector(".fill_table"))
};

const downloadReport = () => {
  // exportExcel(luckysheet.getAllSheets(), "万能图表");
  window.print();
};
const printReport = () => {
  window.print();
};
</script>
  
<style src="@/style/option.scss"  lang="scss"></style>
<style lang="scss"></style>
