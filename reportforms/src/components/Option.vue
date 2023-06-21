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
  console.log("CS")
  // luckysheet.setCellValue(0, 0, 1);
  // luckysheet.setRangeShow({ row: [0, 1], column: [0, 2] })
  // console.log(luckysheet.getRangeValue({ row: [0, 1], column: [0, 2] }));
  // luckysheet.clearRange({ row: [0, 1], column: [0, 2] })
  console.log(luckysheet.getAllSheets())
};

const downloadReport = () => {
  exportExcel(luckysheet.getAllSheets(), "万能图表");
  // window.print();
};
const printReport = () => {
  window.print();
};
</script>
  
<style src="@/style/option.scss"  lang="scss"></style>
<style lang="scss"></style>
