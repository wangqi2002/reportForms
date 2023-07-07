<template>
  <div id="fill_report_box">
    <div id="fill_header" class="fill_header">
      <span class="fill_title">报表填充</span>
      <span class="fill_exit" @click="handleExitfill">
        <img src="@/assets/exit.svg" />
      </span>
    </div>
    <div class="fill_content">
      <div class="fill_type">
        <div class="show_box" v-if="filldbShow">
          <div class="fill_upload_btn_box">
            <input ref="filedbInput" type="file" placeholder="请选择.db文件" @change="loadDbfile" style="display: none" />
            <button class="fill_upload_btn" @click="clickDbfileInput" style="margin-left: 6px">
              选择.db文件
            </button>
            <!-- <button @click="getDbData">CS</button> -->
          </div>
          <el-divider content-position="left">数据库</el-divider>
          <div class="fill_db_content">
            <li class="db_item" v-for="(item, index) in dbItems">
              <span class="li-content" @click="handleChangedb">
                {{ item.name }}
              </span>
            </li>
          </div>
        </div>
        <div class="show_box" v-if="fillexcelShow">
          <div class="fill_upload_btn_box">
            <input ref="fileexcelInput" type="file" placeholder="请选择.xlsx文件" @change="loadExcelfile"
              style="display: none" />
            <button class="fill_upload_btn" @click="clickExcelfileInput" style="margin-left: 6px">
              选择.xlsx文件
            </button>
          </div>
        </div>
        <div class="show_box" v-if="fillcsvShow">
          <div class="fill_upload_btn_box">
            <input ref="filecsvInput" type="file" placeholder="请选择.csv文件" @change="loadCsvfile" style="display: none" />
            <button class="fill_upload_btn" @click="clickCsvFileInput" style="margin-left: 6px">
              选择.csv文件
            </button>
          </div>
        </div>
        <el-divider class="fill_type_middle" content-position="left">报表区域</el-divider>
        <div id="fill_template" class="fill_template">
        </div>
      </div>
      <div class="fill_table">
        <div id="mark" class="mark" ref="mark"></div>
        <Spreadsheet></Spreadsheet>
      </div>
    </div>
    <div class="fill_bottom">
      <button class="fillBtn confirm" @click="handleConfirm">Confirm</button>
      <button class="fillBtn" @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElDivider } from "element-plus";
import Spreadsheet from "@/components/Spreadsheet.vue";
import emitter from "@/unit/mittBus";
import { Drag, DragTo, creatTab } from "@/unit/Drag";
import { dbTospread, dbTolucky, produceOption } from "@/unit/conversionDataformat";
import { readFromSource, readDbData, produceData } from "@/unit/produce"

const instance = getCurrentInstance();
const store = useStore()

const dbItems = reactive([]);
const dbTable = reactive([]);
const mark = ref(null);
const filedbInput = ref(null);
const fileexcelInput = ref(null);
const filecsvInput = ref(null);
let filldbShow = ref(false);
let fillexcelShow = ref(false);
let fillcsvShow = ref(false);
let dbFile = null;
let tableName = null;
let reportData = [];
let realData = [];
let fillOptions = new Map();

const getDbData = (callback) => {
  let childList = document.getElementsByClassName("table_input")
  let attributeString = ""
  for (let i = 0; i < childList.length; i++) {
    if (i == 0) {
      if (childList[i].value != "") {
        attributeString = childList[i].value;
      }
    } else {
      if (childList[i].value != "") {
        if (attributeString == "") {
          attributeString = childList[i].value;
        } else {
          attributeString = attributeString + "," + childList[i].value;
        }
      }
    }
  }
  readDbData(dbFile, tableName, attributeString, function (result) {
    result.forEach((item) => {
      reportData.push(item)
    })
    callback(reportData)
  })
}
const clickDbfileInput = () => {
  filedbInput.value?.click();
};
const clickExcelfileInput = () => {
  fileexcelInput.value?.click();
};
const clickCsvFileInput = () => {
  filecsvInput.value?.click();
};
const loadDbfile = () => {
  let f = filedbInput.value.files[0];
  const r = new FileReader();
  r.onload = async function () {
    const db = new Uint8Array(r.result);
    dbFile = db;
    await readFromSource("sqlite", db, { onlyTable: true }, function (result) {
      result.forEach((item) => {
        dbItems.push(item)
      })
    })
  };
  r.readAsArrayBuffer(f);
  filedbInput.value.value = null;
};
const loadExcelfile = () => {
  console.log("loadExcelfile");
};
const loadCsvfile = () => {
  console.log("loadCsvfile");
};

const handleChangedb = async (e) => {
  tableName = e.target.innerText
  await readFromSource("sqlite", dbFile, {
    tableName: e.target.innerText,
    limit: '25',
  }, function (result) {
    result.forEach((item) => {
      dbTable.push(item)
    })
    let spreadData = dbTospread(dbTable);
    emitter.emit("setSpread", spreadData);
    dbTable.length = 0
  })
};
const handleExitfill = () => {
  ElMessageBox.confirm("确定退出报表内容填充?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      dbItems.length = 0
      emitter.emit("clearSpread");
      emitter.emit("exitfill");
    })
    .catch(() => { });
};
const handleConfirm = () => {
  console.log("Confirm");
  window.tdFilled = new Map()
  window.tdFilled.clear()
  window.tdCount = 0
  const luckyRange = store.state.luckyRange
  // if (fillOptions.size != 0) {
  let options = produceOption(fillOptions)
  console.log(options);
  getDbData(function (result) {
    realData = produceData(result, { ...options })
    let luckyData = dbTolucky(realData, luckyRange);
    emitter.emit("setLucky", luckyData);
    realData.length = 0
  })
  // }
  dbItems.length = 0
  reportData.length = 0
  fillOptions.clear()
  emitter.emit("clearSpread");
  emitter.emit("exitfill");
};
const handleCancel = () => {
  window.tdFilled = new Map()
  window.tdFilled.clear()
  window.tdCount = 0
  console.log("Cancel");
  dbItems.length = 0
  emitter.emit("clearSpread");
  emitter.emit("exitfill");
};
const setheadListener = () => {
  const inputList = document.getElementsByClassName("table_input")
  emitter.on("setHead", (e) => {
    let obj = null
    if (fillOptions.get(e.idIn) == undefined) {
      obj = { column: store.state.tableHead.title }
    } else {
      obj = fillOptions.get(e.idIn)
      obj.column = store.state.tableHead.title
    }
    fillOptions.set(e.idIn, obj)
    for (let i = 0; i < inputList.length; i++) {
      if (inputList[i].id === e.idIn) {
        inputList[i].value = store.state.tableHead.title
      }
    }
  })
}
const setFilterListener = () => {
  emitter.on("setFilter", (e) => {
    console.log(e,'setFilter');
    let obj = null
    if (fillOptions.get(e.idIn) == undefined) {
      obj = {
        column: e.column,
        spliter: store.state.spliter,
        filter: store.state.filter,
        sort: store.state.sort
      }
    } else {
      obj = fillOptions.get(e.idIn)
      obj.spliter = store.state.spliter
      obj.filter = store.state.filter
      obj.sort = store.state.sort
    }
    fillOptions.set(e.idIn, obj)
  })
}
const filltypeListener = () => {
  emitter.on("filltype", (e) => {
    creatTab("fill_template", e.range.row[2], e.range.column[2])
    if (e.type === "dataBase") {
      filldbShow = true;
      fillexcelShow = false;
      fillcsvShow = false;
    } else if (e.type === "excel") {
      filldbShow = false;
      fillexcelShow = true;
      fillcsvShow = false;
    } else if (e.type === "csv") {
      filldbShow = false;
      fillexcelShow = false;
      fillcsvShow = true;
    }
    instance.proxy.$forceUpdate();
  });
};

onMounted(() => {
  new Drag("fill_report_box", "fill_header");
  new DragTo("mark", "table_input");
  filltypeListener();
  setheadListener();
  setFilterListener();
});
</script>
  
<style src="@/style/reportFill.scss" lang="scss"></style>
<style lang="scss"></style>
