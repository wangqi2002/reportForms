<template>
    <div class="report_config">
        <!-- <el-divider>数据填充</el-divider> -->
        <div style="padding: 0 10px">
            <div class="fill_item db_fill">
                <div class="radio_defined">
                    <div class="radio_box">
                        <input type="radio" v-model="fillType" value="1" label="1" @change="handleChange" />
                    </div>
                    <div class="radio_content">
                        数据库导入:
                        <button class="fill_btn" @click="handleDbFill" :disabled="isEffect1" style="margin-left: 6px">
                            点击填充
                        </button>
                    </div>
                </div>
            </div>
            <div class="fill_item excel_fill">
                <div class="radio_defined">
                    <div class="radio_box">
                        <input type="radio" v-model="fillType" value="2" label="2" @change="handleChange" />
                    </div>
                    <div class="radio_content">
                        <input ref="fileInput" type="file" placeholder="点击填充" @change="loadExcel" style="display: none" />
                        Excel导入:
                        <button class="fill_btn" @click="handleExcelFill" :disabled="isEffect2" style="margin-left: 14px">
                            点击填充
                        </button>
                    </div>
                </div>
            </div>
            <div class="fill_item csv_fill">
                <div class="radio_defined">
                    <div class="radio_box">
                        <input type="radio" v-model="fillType" value="3" label="3" @change="handleChange" />
                    </div>
                    <div class="radio_content">
                        CSV导入:
                        <button class="fill_btn" @click="handleCsvFill" :disabled="isEffect3" style="margin-left: 18px">
                            点击填充
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import LuckyExcel from 'luckyexcel'
import { ref, inject, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { rangeTohead } from '@/unit/conversionDataformat'

const instance = getCurrentInstance()
const store = useStore()

const jsonData = ref({})
const fileInput = ref()
const fillType = ref(1)
let isEffect1 = ref(false)
let isEffect2 = ref(true)
let isEffect3 = ref(true)
let fillRange = {}

const handleFillbox = inject('handleFillbox', () => { }, false)

const handleChange = () => {
    if (fillType.value === '1') {
        isEffect1 = false
        isEffect2 = true
        isEffect3 = true
        instance.proxy.$forceUpdate()
    } else if (fillType.value === '2') {
        isEffect1 = true
        isEffect2 = false
        isEffect3 = true
        instance.proxy.$forceUpdate()
    } else if (fillType.value === '3') {
        isEffect1 = true
        isEffect2 = true
        isEffect3 = false
        instance.proxy.$forceUpdate()
    }
}
const handleDbFill = () => {
    // 先选中表头
    console.log('fill db')
    let objRange = null
    objRange = luckysheet.getRange()[0]
    objRange.tableHead = luckysheet.transToCellData(luckysheet.getRangeValue())
    let target = {
        column: objRange.column,
        row: objRange.row,
        tableHead: objRange.tableHead
    }
    console.log(target)
    store.commit('changeLuckyrange', target)
    Object.assign(fillRange, target)
    handleFillbox('dataBase', fillRange)
    fillRange = {}
}
const handleExcelFill = () => {
    console.log('fill excel')
    let objRange = null
    objRange = luckysheet.getRange()[0]
    objRange.row[2] = objRange.row[1] - objRange.row[0] + 1
    objRange.column[2] = objRange.column[1] - objRange.column[0] + 1
    Object.assign(fillRange, objRange)
    handleFillbox('excel', fillRange)
    fillRange = {}
}
const handleCsvFill = () => {
    console.log('fill csv')
    let objRange = null
    objRange = luckysheet.getRange()[0]
    objRange.row[2] = objRange.row[1] - objRange.row[0] + 1
    objRange.column[2] = objRange.column[1] - objRange.column[0] + 1
    Object.assign(fillRange, objRange)
    handleFillbox('csv', fillRange)
    fillRange = {}
}
</script>

<style src="@/style/reportConfig.scss" lang="scss"></style>
<style lang="scss"></style>
