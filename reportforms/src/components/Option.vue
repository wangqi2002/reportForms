<template>
  <div class="option_box">
    <div class="title_box">多用报表</div>
    <div class="report_style">
      <el-divider>模版创建</el-divider>
      <div style="padding: 0 10px">
        <div class="reprot_item new_report">
          <div class="radio_defined">
            <div class="radio_box">
              <input
                type="radio"
                v-model="reportTemplate"
                value="1"
                label="1"
              />
            </div>
            <div class="radio_content">创建新模版</div>
          </div>
        </div>
        <div class="reprot_item history_report">
          <div class="radio_defined">
            <div class="radio_box">
              <input
                type="radio"
                v-model="reportTemplate"
                value="2"
                label="2"
              />
            </div>
            <div class="radio_content">
              历史模板：
              <el-select v-model="historyValue" placeholder="请选择">
                <el-option
                  v-for="item in historyReports"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="reprot_item excle_report">
          <div class="radio_defined">
            <div class="radio_box">
              <input
                type="radio"
                v-model="reportTemplate"
                value="3"
                label="3"
              />
            </div>
            <div class="radio_content">
              <input
                ref="fileInput"
                type="file"
                placeholder="请选择.xlsx文件"
                @change="loadExcel"
                style="display: none"
              />
              Excle导入:
              <button
                class="upload_btn"
                @click="clickFileIput"
                style="margin-left: 6px"
              >
                上传
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="report_type">
      <el-divider>报表类型</el-divider>
      <div>
        <el-radio-group v-model="reportypeValue">
          <div class="btn_line">
            <el-radio-button class="report_type_btn" label="day"
              >日报</el-radio-button
            >
            <el-radio-button class="report_type_btn" label="week"
              >周报</el-radio-button
            >
          </div>
          <div class="btn_line">
            <el-radio-button class="report_type_btn" label="month"
              >月报</el-radio-button
            >
            <el-radio-button class="report_type_btn" label="year"
              >年报</el-radio-button
            >
          </div>
          <div class="btn_line">
            <el-radio-button class="report_type_btn" label="date"
              >自由报表</el-radio-button
            >
            <el-radio-button
              class="report_type_btn"
              style="visibility: hidden"
            ></el-radio-button>
          </div>
        </el-radio-group>
      </div>
      <div>
        <el-date-picker
          v-model="dateFrom.start"
          type="date"
          placeholder="Start"
          :disabled-date="disabledDateStart"
          @change="handleDate"
        />
        <el-date-picker
          v-model="dateFrom.end"
          type="date"
          placeholder="End"
          :disabled-date="disabledDateEnd"
          @change="handleDate"
        />
      </div>
    </div>
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

const jsonData = ref({});
const fileInput = ref();
const reportTemplate = ref(1);
const historyValue = ref("");
const reportypeValue = ref("day");
const dateStartValue = ref("");
const dateEndValue = ref("");
const dateFrom = ref({ start: "", end: "" });
const historyReports = [
  {
    value: "Option1",
    label: "模板1",
  },
  {
    value: "Option2",
    label: "模板2",
  },
  {
    value: "Option3",
    label: "模板3",
  },
  {
    value: "Option4",
    label: "模板4",
  },
  {
    value: "Option5",
    label: "模板5",
  },
];

const clickFileIput = () => {
  fileInput.value?.click();
};

/* const handleFun = () => {
  // luckysheet.setCellValue(0, 0, 1);
  // console.log(luckysheet.getRange());
  // console.log(luckysheet.getRangeWithFlatten());
  // console.log(luckysheet.getRangeValuesWithFlatte());
  console.log(luckysheet.getRangeValue());
  // luckysheet.setRangeShow("A1:E8")
  // luckysheet.setRangeShow([{row:[0,1],column:[0,1]},{row:[2,2],column:[3,8]}])
}; */

// 设置开始时间在结束时间之前
const disabledDateStart = (time) => {
  //注意这要加一个判断不然没选结束时间的时候开始时间也全部不能选择
  if (dateFrom.value.end) {
    return time > dateFrom.value.end;
  }
};
// 设置结束时间在开始时间之后
const disabledDateEnd = (time) => {
  return time < dateFrom.value.start;
};
const handleDate = () => {
  console.log(dateFrom)
}

const loadExcel = (evt) => {
  const files = evt.target.files;
  if (files == null || files.length == 0) {
    alert("No files wait for import");
    return;
  }

  let name = files[0].name;
  let suffixArr = name.split("."),
    suffix = suffixArr[suffixArr.length - 1];
  if (suffix != "xlsx") {
    alert("Currently only supports the import of xlsx files");
    return;
  }
  LuckyExcel.transformExcelToLucky(
    files[0],
    function (exportJson, luckysheetfile) {
      if (exportJson.sheets == null || exportJson.sheets.length == 0) {
        alert(
          "Failed to read the content of the excel file, currently does not support xls files!"
        );
        return;
      }
      console.log("exportJson", exportJson);
      jsonData.value = exportJson;

      window.luckysheet.destroy();

      window.luckysheet.create({
        container: "luckysheet", //luckysheet is the container id
        showinfobar: false,
        data: exportJson.sheets,
        title: exportJson.info.name,
        userInfo: exportJson.info.name.creator,
      });
    }
  );
};
const downloadExcel = () => {
  exportExcel(luckysheet.getAllSheets(), "万能图表");
};
</script>
  
<style src="@/style/option.scss"  lang="scss"></style>
<style lang="scss">
</style>
