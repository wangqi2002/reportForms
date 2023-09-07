<template>
    <div id="fill_report_box">
        <div id="fill_header" class="fill_header">
            <!-- <span class="fill_title">报表填充</span> -->
            <span class="fill_exit" @click="handleExitfill">
                <img src="@/assets/exit.svg" />
            </span>
        </div>
        <div class="fill_content">
            <div class="fill_type">
                <div class="show_box" v-if="filldbShow">
                    <div class="fill_upload_btn_box">
                        <input ref="filedbInput" type="file" placeholder="请选择.db文件" @change="loadDbfile"
                            style="display: none" />
                        <button class="fill_upload_btn" @click="clickDbfileInput" style="margin-left: 6px">
                            选择.db文件
                        </button>
                    </div>
                    <div class="fill_db_content">
                        <li class="db_item" v-for="(item, index) in dbItems" :key="index">
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
                        <input ref="filecsvInput" type="file" placeholder="请选择.csv文件" @change="loadCsvfile"
                            style="display: none" />
                        <button class="fill_upload_btn" @click="clickCsvFileInput" style="margin-left: 6px">
                            选择.csv文件
                        </button>
                    </div>
                </div>
            </div>
            <div class="option_type">
                <Reporttype></Reporttype>
            </div>
            <div class="report_table">
                <div class="nid_title">表单元素</div>
                <div class="nid_card">
                    <div class="nid_item" draggable="true" @dragstart="handleNidDrag" v-for="(item, index) in nidList"
                        :key="index" :name="item.value">
                        {{ item.name }}
                    </div>
                </div>
            </div>
            <div id="fill_table" class="fill_table"></div>
            <div class="fill_bottom">
                <button class="fillBtn confirm" @click="handleConfirm">确认</button>
                <button class="fillBtn" @click="handleCancel">取消</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Reporttype from '@/components/Reporttype.vue'
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { ElSelect, ElOption, ElMessageBox } from 'element-plus'
import emitter from '@/unit/mittBus'
import { Drag, DragTo, creatTab } from '@/unit/Drag'
import { dbTolucky, produceOption } from '@/unit/conversionDataformat'
import { readFromSource, readDbData, produceData } from '@/unit/produce'

const instance = getCurrentInstance()
const store = useStore()

const dbItems = reactive([])
const filedbInput = ref(null)
const fileexcelInput = ref(null)
const filecsvInput = ref(null)
const nidList = ref([])
let filldbShow = ref(false)
let fillexcelShow = ref(false)
let fillcsvShow = ref(false)
let dbFile = null
let tableName = null
let reportData = []
let realData = []
let fillOptions = new Map()

const getDbData = (callback) => {
    let childList = document.getElementsByClassName('table_input')
    let attributeString = ''
    for (let i = 0; i < childList.length; i++) {
        if (i == 0) {
            if (childList[i].value != '') {
                attributeString = `"${childList[i].value}"`
            }
        } else {
            if (childList[i].value != '') {
                if (attributeString == '') {
                    attributeString = `"${childList[i].value}"`
                } else {
                    attributeString = attributeString + ',' + `"${childList[i].value}"`
                }
            }
        }
    }
    attributeString = attributeString + `,"sourceTimestamp"`
    readDbData(dbFile, tableName, attributeString, function (result) {
        result.forEach((item) => {
            reportData.push(item)
        })
        callback(reportData)
    })
}
const clickDbfileInput = () => {
    filedbInput.value?.click()
}
const clickExcelfileInput = () => {
    fileexcelInput.value?.click()
}
const clickCsvFileInput = () => {
    filecsvInput.value?.click()
}
const loadDbfile = () => {
    let f = filedbInput.value.files[0]
    const r = new FileReader()
    r.onload = async function () {
        const db = new Uint8Array(r.result)
        dbFile = db
        await readFromSource('sqlite', db, { onlyTable: true }, function (result) {
            result.forEach((item) => {
                dbItems.push(item)
            })
        })
    }
    r.readAsArrayBuffer(f)
    filedbInput.value.value = null
}
const loadExcelfile = () => {
    console.log('loadExcelfile')
}
const loadCsvfile = () => {
    console.log('loadCsvfile')
}

const handleNidDrag = (e) => {
    // console.log(e.target.innerText)
    // console.log(e.target.getAttribute('name'))
    e.dataTransfer.setData("Text", JSON.stringify({
        name: e.target.innerText,
        value: e.target.getAttribute('name'),
    }));
}
const handleChangedb = async (e) => {
    tableName = e.target.innerText
    console.log(tableName)
    await readFromSource(
        'sqlite',
        dbFile,
        {
            tableName: e.target.innerText,
            limit: '1',
        },
        function (result) {
            nidList.value.length = 0
            let list = Object.keys(result[0])
            list = list.filter((item) => {
                return item != "id" && item != "sourceTimestamp"
            });
            for (let i = 0; i < list.length; i++) {
                nidList.value.push({
                    name: list[i].match(/##(\S*)/)[1],
                    value: list[i]
                })
            }
            nidList.value.push({
                name: 'sourceTimestamp',
                value: 'sourceTimestamp'
            })
        }
    )
}
const handleExitfill = () => {
    ElMessageBox.confirm('确定退出报表内容填充?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            dbItems.length = 0
            nidList.value.length = 0
            emitter.emit('clearSpread')
            emitter.emit('exitfill')
        })
        .catch(() => { })
}
const handleConfirm = () => {
    let split = store.state.split
    let key = null
    for (let item of fillOptions.entries()) {
        console.log(item)
        if (item[1].column == 'sourceTimestamp') {
            key = item[0]
        }
    }
    if (key == null) {
        fillOptions.set('input_last', {
            column: 'sourceTimestamp',
            spliter: store.state.spliter,
            filter: store.state.filter,
            grouper: store.state.grouper,
            replace: store.state.replace,
            formatter: store.state.formatter,
            append: store.state.append,
            split: split,
            sort: store.state.sort,
        })
    } else {
        fillOptions.set(key, {
            column: 'sourceTimestamp',
            spliter: store.state.spliter,
            filter: store.state.filter,
            grouper: store.state.grouper,
            replace: store.state.replace,
            formatter: store.state.formatter,
            append: store.state.append,
            split: split,
            sort: store.state.sort,
        })
    }
    const luckyRange = store.state.luckyRange
    if (fillOptions.size != 0) {
        let options = produceOption(fillOptions)
        console.log("options", options)
        getDbData(function (result) {
            console.log(result.length)
            console.log(result)
            realData = produceData(result, { ...options })
            // for (let i = 0; i < realData.length; i++) {
            //     console.log(realData[i])
            // }
            console.log(realData)
            // let luckyData = dbTolucky(realData, luckyRange)
            // emitter.emit('setLucky', luckyData)
            // realData.length = 0
        })
    }
    dbItems.length = 0
    reportData.length = 0
    nidList.value.length = 0
    emitter.emit('clearSpread')
    emitter.emit('exitfill')
}
const handleCancel = () => {
    dbItems.length = 0
    nidList.value.length = 0
    emitter.emit('clearSpread')
    emitter.emit('exitfill')
}
const setheadListener = () => {
    emitter.on('setHead', (e) => {
        let obj = null
        let cloumnName = e.value
        if (fillOptions.get(e.idIn) == undefined) {
            obj = { column: cloumnName }
        } else {
            obj = fillOptions.get(e.idIn)
            obj.column = cloumnName
        }
        fillOptions.set(e.idIn, obj)
    })
}
const setFilterListener = () => {
    emitter.on('setFilter', (e) => {
        console.log(e, 'setFilter')
        let obj = null
        if (fillOptions.get(e.idIn) == undefined) {
            obj = {
                column: e.column,
                spliter: store.state.spliter,
                filter: store.state.filter,
                grouper: store.state.grouper,
                replace: store.state.replace,
                append: store.state.append,
                sort: store.state.sort,
            }
        } else {
            obj = fillOptions.get(e.idIn)
            obj.spliter = store.state.spliter
            obj.filter = store.state.filter
            obj.grouper = store.state.grouper
            obj.replace = store.state.replace
            obj.append = store.state.append
            obj.sort = store.state.sort
        }
        fillOptions.set(e.idIn, obj)
        // console.log(fillOptions)
    })
}
const filltypeListener = () => {
    emitter.on('filltype', (e) => {
        let tableHead = []
        for (let i = 0; i < e.range.tableHead.length; i++) {
            tableHead.push(e.range.tableHead[i].v.v)
        }
        creatTab('fill_table', e.range.column[1] + 1, tableHead)
        if (e.type === 'dataBase') {
            filldbShow = true
            fillexcelShow = false
            fillcsvShow = false
        } else if (e.type === 'excel') {
            filldbShow = false
            fillexcelShow = true
            fillcsvShow = false
        } else if (e.type === 'csv') {
            filldbShow = false
            fillexcelShow = false
            fillcsvShow = true
        }
        instance.proxy.$forceUpdate()
    })
}

onMounted(() => {
    new Drag('fill_report_box', 'fill_header')
    filltypeListener()
    setheadListener()
    setFilterListener()

})
</script>

<style src="@/style/reportFill.scss" lang="scss"></style>
<style lang="scss"></style>
