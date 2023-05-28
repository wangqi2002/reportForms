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
            <input
              ref="filedbInput"
              type="file"
              placeholder="请选择.db文件"
              @change="loadDbfile"
              style="display: none"
            />
            <button
              class="fill_upload_btn"
              @click="clickDbfileInput"
              style="margin-left: 6px"
            >
              选择.db文件
            </button>
          </div>
          <div class="fill_db_content">
            <el-divider content-position="left">数据库</el-divider>
            <li class="db_item" v-for="(item, index) in dbItems">
              <span class="li-content" @click="handleChangedb">
                {{ index }} - {{ item.message }}
              </span>
            </li>
          </div>
        </div>
        <div class="show_box" v-if="fillexcelShow">
          <div class="fill_upload_btn_box">
            <input
              ref="fileexcelInput"
              type="file"
              placeholder="请选择.xlsx文件"
              @change="loadExcelfile"
              style="display: none"
            />
            <button
              class="fill_upload_btn"
              @click="clickExcelfileInput"
              style="margin-left: 6px"
            >
              选择.xlsx文件
            </button>
          </div>
        </div>
        <div class="show_box" v-if="fillcsvShow">
          <div class="fill_upload_btn_box">
            <input
              ref="filecsvInput"
              type="file"
              placeholder="请选择.csv文件"
              @change="loadCsvfile"
              style="display: none"
            />
            <button
              class="fill_upload_btn"
              @click="clickCsvFileInput"
              style="margin-left: 6px"
            >
              选择.csv文件
            </button>
          </div>
        </div>
      </div>
      <div class="fill_table"></div>
    </div>
    <div class="fill_bottom">
      <button class="fillBtn confirm" @click="handleConfirm">Confirm</button>
      <button class="fillBtn" @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { ElMessageBox, ElDivider } from "element-plus";
import Drag from "@/unit/Drag";
import emitter from "@/unit/mittBus";

const instance = getCurrentInstance();
const dbItems = reactive([]);
const filedbInput = ref(null);
const fileexcelInput = ref(null);
const filecsvInput = ref(null);
let filldbShow = ref(false);
let fillexcelShow = ref(false);
let fillcsvShow = ref(false);

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
  console.log("loadDbfile");
  dbItems.push({ message: "Foo" });
  dbItems.push({ message: "Bar" });
};
const loadExcelfile = () => {
  console.log("loadExcelfile");
};
const loadCsvfile = () => {
  console.log("loadCsvfile");
};
const handleChangedb = (e) => {
  console.log(e.target.innerText);
};

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
const filltypeListener = () => {
  emitter.on("filltype", (e) => {
    if (e === "dataBase") {
      filldbShow = true;
      fillexcelShow = false;
      fillcsvShow = false;
    } else if (e === "excel") {
      filldbShow = false;
      fillexcelShow = true;
      fillcsvShow = false;
    } else if (e === "csv") {
      filldbShow = false;
      fillexcelShow = false;
      fillcsvShow = true;
    }
    instance.proxy.$forceUpdate();
  });
};

onMounted(() => {
  new Drag("fill_report_box", "fill_header");
  filltypeListener();
});
</script>
  
<style src="@/style/reportFill.scss" lang="scss"></style>
<style lang="scss">
</style>
