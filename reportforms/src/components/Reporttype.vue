<template>
  <div class="report_type">
    <el-divider>报表类型</el-divider>
    <el-select class="report_type_select" v-model="filterTypeValue" placeholder="请选择筛选器类型" @change="handleChangtype">
      <el-option v-for="item in filterType" :key="item.type" :label="item.type" :value="item.type" />
    </el-select>
    <div class="type_box">
      <span id="date_type"></span>
      <component :is="components.get(compName)"></component>
    </div>
  </div>
</template>
    
<script setup>
import { ref, shallowRef, reactive, onMounted, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { filters } from "@/unit/filter/filter";
import { DragTo } from "@/unit/Drag";

const store = useStore()

// 默认加载的组件名
const compName = ref('')
const components = shallowRef(new Map())

const filterTypeValue = ref("");
const filterType = reactive([]);


const getComponents = () => {
  for (const [key, value] of filters) {
    // console.log(key, value);
    components.value.set(
      key,
      defineAsyncComponent(() => import(`@/unit/filter/${key}/${key}.vue`))
    )
  }
}
const getFiltertype = () => {
  for (const [key, value] of filters) {
    filterType.push(value)
  }
}
const handleChangtype = () => {
  compName.value = filterTypeValue.value
}

onMounted(() => {
  getFiltertype()
  getComponents()
  new DragTo("date_type", "table_input");
});
</script>
    
<style src="@/style/reportType.scss"  lang="scss"></style>
<style lang="scss"></style>
  