<template>
  <div class="report_style">
    <el-divider>模版创建</el-divider>
    <div style="padding: 0 10px">
      <div class="reprot_item new_report">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="reportTemplate" value="1" label="1" />
          </div>
          <div class="radio_content">创建新模版</div>
        </div>
      </div>
      <div class="reprot_item history_report">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="reportTemplate" value="2" label="2" />
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
            <input type="radio" v-model="reportTemplate" value="3" label="3" />
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
      <div class="reprot_item save_report">
        <div style="margin-top: 5px">
          <button class="save_btn">保存模板</button>
        </div>
      </div>
    </div>
  </div>
</template>
   
<script setup>
import { ref } from "vue";
import LuckyExcel from "luckyexcel";

const jsonData = ref({});
const fileInput = ref();
const reportTemplate = ref(1);
const historyValue = ref("");
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
</script>
    
<style src="@/style/reportCreate.scss"  lang="scss"></style>
<style lang="scss">
</style>
  