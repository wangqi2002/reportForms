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
        <div id="fill_template" class="fill_template">
          <!-- <button id="btn1" @click="handleCs">测试</button> -->
        </div>
      </div>
      <div class="fill_table">
        <div id="mark" class="mark" ref="mark" @click="handleCs1" @contextmenu.prevent="handleCs2"></div>
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
import { ElMessageBox, ElDivider } from "element-plus";
import Spreadsheet from "@/components/Spreadsheet.vue";
import { Drag, DragTo } from "@/unit/Drag";
import emitter from "@/unit/mittBus";
import { dbDataConver } from "@/unit/conversionDataformat";

const instance = getCurrentInstance();
const dbItems = reactive([]);
const dbTable = reactive([]);
const mark = ref(null)
const filedbInput = ref(null);
const fileexcelInput = ref(null);
const filecsvInput = ref(null);
let filldbShow = ref(false);
let fillexcelShow = ref(false);
let fillcsvShow = ref(false);
let dbFile = null;

const handleCs = () => {
  console.log("handleCs")
  emitter.emit("clearData");
}
const handleCs1 = (e) => {
  console.log("handleCs1", e)
}
const handleCs2 = (e) => {
  console.log("handleCs2", e)
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
  await readFromSource("sqlite", dbFile, {
    tableName: e.target.innerText,
    limit: '25',
  }, function (result) {
    result.forEach((item) => {
      dbTable.push(item)
    })
    const rowData = dbDataConver(dbTable);
    emitter.emit("setData", rowData);
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
      emitter.emit("clearData");
      emitter.emit("exitfill");
    })
    .catch(() => { });
};
const handleConfirm = () => {
  console.log("Confirm");
  dbItems.length = 0
  emitter.emit("clearData");
  emitter.emit("exitfill");
};
const handleCancel = () => {
  console.log("Cancel");
  dbItems.length = 0
  emitter.emit("clearData");
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
const readFromSource = (type, file, options, callback) => {
  switch (type) {
    case "sqlite": {
      initSqlJs(config).then(function (SQL) {
        const result = [];
        const db = new SQL.Database(file);
        if (options.onlyTable) {
          let stmt = db.prepare(
            `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
          );
          while (stmt.step()) {
            const row = stmt.getAsObject();
            result.push(row);
          }
        } else {
          let limit = options.limit ? options.limit : "15";
          let field = "*";
          if (options.fields) {
            field = options.fields[0];
            options.fields.forEach((f, index) => {
              if (index > 0) field = field + "," + f;
            });
          }
          let stmt = db.prepare(
            `select ${field} from ${options.tableName} limit ${limit}`
          );
          while (stmt.step()) {
            const row = stmt.getAsObject();
            result.push(row);
          }
        }
        callback(result);
      });
    }
      break;
    case "excel": {
      console.log("excel")
    }
      break;
    default:
      return undefined;
  }
};

onMounted(() => {
  new Drag("fill_report_box", "fill_header");
  new DragTo("mark", "fill_template");
  filltypeListener();
  mark.value.ontouchmove = function (e) {
    console.log(e)
    e.preventDefault()
  }
});
</script>
  
<style src="@/style/reportFill.scss" lang="scss"></style>
<style lang="scss"></style>
