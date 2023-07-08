<template>
    <div class="report_type">
        <!-- <el-select
            class="report_type_select"
            v-model="filterTypeValue"
            placeholder="请选择筛选器类型"
            @change="handleChangtype"
        >
            <el-option v-for="item in filterType" :key="item.type" :label="item.type" :value="item.type" />
        </el-select>
        <div>
            <el-checkbox label="SUM"></el-checkbox>
            <el-checkbox label="AVG"></el-checkbox>
            <el-checkbox label="MAX"></el-checkbox>
            <el-checkbox label="MIN"></el-checkbox>
            <el-checkbox label="GAP"></el-checkbox>
        </div> -->

        <el-divider>数据筛选/分离</el-divider>
        <el-select
            class="report_type_select"
            v-model="filterTypeValue"
            placeholder="请选择筛选器类型"
            @change="handleChangtype"
        >
            <el-option v-for="item in filterType" :key="item.type" :label="item.type" :value="item.type" />
        </el-select>
        <div class="type_box">
            <span id="date_type"></span>
            <component :is="components.get(compName)"></component>
        </div>
    </div>
</template>

<script setup>
import { ref, shallowRef, reactive, onMounted, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { filters } from '@/unit/filter/filter'
import { DragTo } from '@/unit/Drag'

const store = useStore()

// 默认加载的组件名
const compName = ref('')
const components = shallowRef(new Map())

const filterTypeValue = ref('')
const filterType = reactive([])
const checks = ref(['sum', 'avg', 'max', 'min', 'gap'])

const getComponents = () => {
    for (let [key, value] of filters) {
        components.value.set(
            key,
            defineAsyncComponent(() => import(`@/unit/filter/${key}/${key}.vue`))
        )
    }
}
const getFiltertype = () => {
    filters.forEach((value) => {
        filterType.push(value)
    })
    // for (let [key, value] of filters) {
    //     filterType.push(value)
    // }
}
const handleChangtype = () => {
    compName.value = filterTypeValue.value
}

onMounted(() => {
    getFiltertype()
    getComponents()
    new DragTo('date_type', 'table_input')
})
</script>

<style src="@/style/reportType.scss" lang="scss"></style>
<style lang="scss"></style>
