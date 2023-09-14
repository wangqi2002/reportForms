<template>
  <div class="report_style">
    <!-- <el-divider>模版创建</el-divider> -->
    <div style="padding: 0 10px">
      <div class="reprot_item excel_report">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="reportTemplate" value="3" label="3" @change="handleChange" />
          </div>
          <div class="radio_content">
            <input ref="fileInput" type="file" placeholder="请选择.xlsx文件" @change="loadExcel" style="display: none" />
            Excel导入:
            <button class="upload_btn" @click="clickFileIput" :disabled="isEffect3" style="margin-left: 6px">
              上传
            </button>
          </div>
        </div>
      </div>
      <div class="reprot_item new_report">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="reportTemplate" value="1" label="1" @change="handleChange" />
          </div>
          <div class="radio_content">新模版
            <button class="create_btn" :disabled="isEffect1" @click="handleNewreport">创建</button>
          </div>
        </div>
      </div>
      <div class="reprot_item history_report">
        <div class="radio_defined">
          <div class="radio_box">
            <input type="radio" v-model="reportTemplate" value="2" label="2" @change="handleChange" />
          </div>
          <div class="radio_content">
            历史模板：
            <el-select v-model="historyValue" placeholder="请选择" :disabled="isEffect2" @change="handleLoadTemplate">
              <el-option v-for="item in historyReports" :key="item.value" :label="item.label" :value="item.value">
                <span>{{ item.label }}</span>
                <span style="float: right;" @click.stop="handleDeleteTemplate(item.value)">
                  <div style="padding-left: 5px;padding-right: 5px">x</div>
                </span>
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="reprot_item save_report">
        <div style="margin-top: 5px">
          <button class="save_btn" @click="handleSavereport">保存模板</button>
        </div>
      </div>
    </div>
  </div>
</template>
   
<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import LuckyExcel from "luckyexcel";
import emitter from "@/unit/mittBus";

const instance = getCurrentInstance();

const jsonData = ref({});
const fileInput = ref();
const reportTemplate = ref(3);
const historyValue = ref("");
const historyReports = ref([]);
let isEffect1 = ref(true);
let isEffect2 = ref(true);
let isEffect3 = ref(false);

const getTemplate = () => {
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes('_template_')) {
      let name = localStorage.key(i).replace('_template_', '')
      let obj = {
        value: name,
        label: name,
      }
      historyReports.value.push(obj)
    }
  }
}
const handleNewreport = () => {
  emitter.emit("newLucky");
}
const handleChange = () => {
  if (reportTemplate.value === "1") {
    isEffect1 = false
    isEffect2 = true;
    isEffect3 = true;
    instance.proxy.$forceUpdate();
  } else if (reportTemplate.value === "2") {
    isEffect1 = true;
    isEffect2 = false;
    isEffect3 = true;
    instance.proxy.$forceUpdate();
  } else if (reportTemplate.value === "3") {
    isEffect1 = true;
    isEffect2 = true;
    isEffect3 = false;
    instance.proxy.$forceUpdate();
  }
}
const clickFileIput = () => {
  fileInput.value?.click();
};
const handleSavereport = () => {
  ElMessageBox.prompt('请输入模版名称', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  })
    .then(({ value }) => {
      let templateName = '_template_' + value
      try {
        localStorage.setItem(templateName, JSON.stringify(luckysheet.getAllSheets()));
        historyReports.value.push({
          value: value,
          label: value,
        })
        ElMessage({
          type: 'success',
          message: `模板保存成功`,
        })
      } catch (e) {
        ElMessage({
          type: 'info',
          message: '保存失败',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消保存',
      })
    })
}
const handleLoadTemplate = (val) => {
  let templateName = '_template_' + val
  let data = JSON.parse(localStorage.getItem(templateName))
  emitter.emit("setLucky", data);
}
const handleDeleteTemplate = (val) => {
  historyReports.value = historyReports.value.filter((item) => {
    return item.value != val
  })
  let templateName = '_template_' + val
  localStorage.removeItem(templateName)
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

onMounted(() => {
  getTemplate()
})
</script>
    
<style src="@/style/reportCreate.scss"  lang="scss"></style>
<style lang="scss"></style>
  