<template>
  <div class="report_type">
    <el-divider>报表类型</el-divider>
    <div class="date_type">
      <div class="select_line">
        时间类型：
        <el-select v-model="dateTypeValue" placeholder="请选择">
          <el-option
            v-for="item in dateType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
    <div class="shift_range">
      班次范围：
      <el-select v-model="shiftTypeValue" placeholder="请选择">
        <el-option
          v-for="item in shiftType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>
    
<script setup>
import { ref } from "vue";

const dateTypeValue = ref("");
const shiftTypeValue = ref("");
const dateFrom = ref({ start: "", end: "" });
const dateType = [
  {
    value: "Option1",
    label: "日报",
  },
  {
    value: "Option2",
    label: "周报",
  },
  {
    value: "Option3",
    label: "月报",
  },
  {
    value: "Option4",
    label: "年报",
  },
  {
    value: "Option5",
    label: "自由报表",
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
const handleDate = () => {
  console.log(dateFrom);
};
</script>
    
<style src="@/style/reportType.scss"  lang="scss"></style>
<style lang="scss">
</style>
  