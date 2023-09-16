<template>
    <div class="report_type">
        <div style="text-align: left; margin: 10px 0 0 20px;">
            筛选策略：
        </div>
        <el-select class="report_type_select" v-model="filterTypeValue" placeholder="请选择筛选器类型" @change="handleChangtype">
            <el-option v-for="item in filterType" :key="item.type" :label="item.type" :value="item.type" />
        </el-select>
        <div class="type_box">
            <!-- <span id="date_type"></span> -->
            <component :is="components.get(compName)"></component>
        </div>
    </div>
</template>

<script setup>
import { ref, shallowRef, reactive, onMounted, defineAsyncComponent } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useStore } from 'vuex'
import { filters } from '@/unit/filter/filter'
import { DragTo } from '@/unit/Drag'

const store = useStore()

// 默认加载的组件名
const compName = ref('')
const components = shallowRef(new Map())

const filterTypeValue = ref('BaseOnTime')
const filterType = reactive([])
const checks = ref(['sum', 'avg', 'max', 'min', 'gap'])

const getComponents = () => {
    for (let [key, value] of filters) {
        components.value.set(
            key,
            defineAsyncComponent(() => import(`@/unit/filter/${key}/${key}.vue`))
        )
    }
    compName.value = 'BaseOnTime'
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
    // new DragTo('date_type', 'table_input')
})
</script>

<style src="@/style/reportType.scss" lang="scss"></style>
<style lang="scss"></style>
