<template>
  <div class="report_type">
    <el-divider>报表类型</el-divider>
    <el-select class="report_type_select" v-model="filterTypeValue" placeholder="请选择筛选器类型">
      <el-option v-for="item in filterType" :key="item.type" :label="item.type" :value="item.type" />
    </el-select>
    <div class="type_box">
      <span id="date_type"
        style="width: 75px;height: 30px;background-color: transparent;position:absolute;left: 5px;z-index: 1000;"></span>
      <div class="date_type" v-if="filterTypeValue === 'date'">
        <div class="select_line">
          时间类型：
          <el-select v-model="dateTypeValue" placeholder="请选择" @change="handleDatetype">
            <el-option v-for="item in dateType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div>
          <el-date-picker v-model="dateFrom.start" type="date" placeholder="Start" :disabled-date="disabledDateStart"
            format="YYYY/MM/DD" value-format="YYYY/MM/DD" @change="handleDate" />
          <el-date-picker v-model="dateFrom.end" type="date" placeholder="End" :disabled-date="disabledDateEnd"
            format="YYYY/MM/DD" value-format="YYYY/MM/DD" @change="handleDate" />
        </div>
        <button class="type_confirm" @click="handleConfirmdate">确定</button>
      </div>
      <div class="shift_range" v-else-if="filterTypeValue === 'equal'">
        班次范围：
        <el-select v-model="shiftTypeValue" placeholder="请选择">
          <el-option v-for="item in shiftType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <button class="type_confirm" @click="handleConfirmshift">确定</button>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { filters } from "@/unit/filter/filter";
import { DragTo } from "@/unit/Drag";

const store = useStore()

const filterTypeValue = ref("");
const dateTypeValue = ref("");
const shiftTypeValue = ref("");
const dateFrom = ref({ start: "", end: "" });
const filterType = reactive([]);
const dateType = [
  {
    value: "byDay",
    label: "日报",
  },
  {
    value: "byMonth",
    label: "月报",
  },
  {
    value: "byYear",
    label: "年报",
  },
];
const shiftType = [
  {
    value: "Option1",
    label: "班次1",
  },
  {
    value: "Option2",
    label: "班次2",
  },
  {
    value: "Option3",
    label: "班次3",
  },
  {
    value: "Option4",
    label: "班次4",
  },
  {
    value: "Option5",
    label: "班次5",
  },
];
let dateConfig = {}
let shiftConfig = {}

const handleConfirmdate = () => {
  console.log("handleConfirmdate")
  const striperFunc = filters.get("date").configureStriper
  const striper = striperFunc(dateConfig.purpose, dateConfig.dateRange.start, dateConfig.dateRange.end)
  store.commit("changeStriper", striper)
}
const handleConfirmshift = () => {
  console.log("handleConfirmshift")
}

const handleDatetype = () => {
  dateConfig.purpose = dateTypeValue.value
}
const handleDate = () => {
  dateConfig.dateRange = dateFrom.value
};

// 设置开始时间在结束时间之前
const disabledDateStart = (time) => {
  if (dateFrom.value.end) {
    return time > dateFrom.value.end;
  }
};
// 设置结束时间在开始时间之后
const disabledDateEnd = (time) => {
  return time < dateFrom.value.start;
};

onMounted(() => {
  for (const [key, value] of filters) {
    filterType.push(value)
  }
  new DragTo("date_type", "table_input");
});
</script>
    
<style src="@/style/reportType.scss"  lang="scss"></style>
<style lang="scss"></style>
  