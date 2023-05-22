<template>
  <div class="luckysheetBox">
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
    <div id="luckysheet"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
  exportExcel(luckysheet.getAllSheets(), "下载");
};
const excleOptions = {
  container: "luckysheet",
  title: "万能报表",
  lang: "zh",
  data: [
    {
      name: "Sheet1",
      color: "",
      status: "1",
      order: "0",
      data: [],
      config: {},
      index: 0,
    },
  ],
  column: 20,
  row: 40,
  showtoolbar: false,
  showtoolbarConfig: {
    undoRedo: true, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
    paintFormat: true, //格式刷
    currencyFormat: true, //货币格式
    percentageFormat: true, //百分比格式
    numberDecrease: true, // '减少小数位数'
    numberIncrease: true, // '增加小数位数
    font: true, // '字体'
    fontSize: true, // '字号大小'
    bold: true, // '粗体 (Ctrl+B)'
    italic: true, // '斜体 (Ctrl+I)'
    underline: true, // '下划线 (Alt+Shift+6)'
    textColor: true, // '文本颜色'
    fillColor: true, // '单元格颜色'
    border: true, // '边框'
    mergeCell: true, // '合并单元格'
    horizontalAlignMode: true, // '水平对齐方式'
    verticalAlignMode: true, // '垂直对齐方式'
    textWrapMode: true, // '换行方式'
    image: true, // '插入图片'
    sortAndFilter: true, // '排序和筛选'
    splitColumn: true, // '分列'
    findAndReplace: true, // '查找替换'
    print: true, // '打印'
  },
  cellRightClickConfig: {
    copy: true, // 复制
    copyAs: true, // 复制为
    paste: true, // 粘贴
    insertRow: true, // 插入行
    insertColumn: true, // 插入列
    deleteRow: true, // 删除选中行
    deleteColumn: true, // 删除选中列
    deleteCell: true, // 删除单元格
    clear: true, // 清除内容
    sort: true, // 排序选区
    chart: true, // 图表生成
    image: true, // 插入图片
    cellFormat: true, // 设置单元格格式
  },
  showinfobar: false,
  sheetFormulaBar: false,
  showstatisticBar: false,
};

// !!! create luckysheet after mounted
onMounted(() => {
  luckysheet.create(excleOptions);
});
</script>

<style lang="scss">
$optionheight: 150px;

.luckysheetBox {
  width: 100%;
  height: 100%;

  .optionBox {
    height: $optionheight;
    background-color: antiquewhite;

    .uploadBox {
      .uploadBtn {
        width: 100px;
        height: 40px;
      }
    }
  }

  #luckysheet {
    width: 100%;
    height: calc(100% - $optionheight);
    margin: 0px;
    padding: 0px;
  }
}
</style>
