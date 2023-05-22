<template>
  <div class="optionBox">
    <div class="uploadBox">
      <input
        ref="fileInput"
        type="file"
        placeholder="请选择.xlsx文件"
        @change="loadExcel"
        style="display: none"
      />
      Excle模版导入
      <button class="uploadBtn" @click="clickFileIput">上传</button>
    </div>
    <div class="downloadBox">
      <button class="downloadBtn" @click="downloadExcel">模版下载</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import { exportExcel } from "./export";
import LuckyExcel from "luckyexcel";

const jsonData = ref({});
const fileInput = ref();

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
const downloadExcel = () => {
  exportExcel(luckysheet.getAllSheets(), "万能图表");
};
</script>
  
<style lang="scss">
$optionheight: 150px;

.optionBox {
  height: 100%;
  width: 100%;
  background-color: antiquewhite;
  .uploadBox {
    .uploadBtn {
      width: 100px;
      height: 40px;
    }
  }
}
</style>
  