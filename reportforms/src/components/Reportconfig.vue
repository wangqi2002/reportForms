<template>
  <div class="report_config">
    <el-divider>数据填充</el-divider>
    <div style="padding: 0 10px">
      <div class="fill_item db_fill">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="fillType" value="1" label="1" />
          </div>
          <div class="radio_content">
            数据库导入:
            <button
              class="fill_btn"
              @click="handleDbFill"
              style="margin-left: 6px"
            >
              请选择.db文件
            </button>
          </div>
        </div>
      </div>
      <div class="fill_item excel_fill">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="fillType" value="2" label="2" />
          </div>
          <div class="radio_content">
            <input
              ref="fileInput"
              type="file"
              placeholder="请选择.xlsx文件"
              @change="loadExcel"
              style="display: none"
            />
            Excel导入:
            <button
              class="fill_btn"
              @click="handleExcelFill"
              style="margin-left: 14px"
            >
              请选择.xlsx文件
            </button>
          </div>
        </div>
      </div>
      <div class="fill_item csv_fill">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="fillType" value="3" label="3" />
          </div>
          <div class="radio_content">
            CSV导入:
            <button
              class="fill_btn"
              @click="handleCsvFill"
              style="margin-left: 18px"
            >
              请选择.csv文件
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script setup>
import { ref, inject } from "vue";

const jsonData = ref({});
const fileInput = ref();
const fillType = ref(1);

const handleFillbox = inject("handleFillbox", () => {}, false);

const handleDbFill = () => {
  console.log("fill db");
  handleFillbox("dataBase");
};
const handleExcelFill = () => {
  console.log("fill excel");
  handleFillbox("excel");
};
const handleCsvFill = () => {
  console.log("fill csv");
  handleFillbox("csv");
};
</script>
      
<style src="@/style/reportConfig.scss"  lang="scss"></style>
<style lang="scss">
</style>
    