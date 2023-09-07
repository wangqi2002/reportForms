<template>
    <div id="tabs">
        <div class="tabs_header">
            <span class="type_name">操作：</span>
            <button class="tabs_btn" style="margin-right: 16px">分离器</button>
            <button class="tabs_btn active">筛选器</button>
        </div>
        <div class="tabs_content">
            <div class="tabs_pane" style="display: none">
                <select class="type_select" name="pets" id="pet-select" v-model="spliterValue"
                    @change="handleChangespliter">
                    <option value="">选择spliter类型</option>
                    <option value="byDay">日报</option>
                    <option value="byMonth">月报</option>
                    <option value="byYear">年报</option>
                </select>
                <input id="start" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}" v-model="datespliterFrom.start"
                    @change="handlDatespliter" />
                <input id="end" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}" v-model="datespliterFrom.end"
                    @change="handlDatespliter" />
                <button class="type_confirm" @click="handleConfirmSpliter">确定</button>
            </div>
            <div class="tabs_pane" style="display: block">
                <el-tabs class="date_tabs" tab-position="left" v-model="filterValue" @tab-change="handleChangefilter">
                    <el-tab-pane name="today" label="日报表">
                        <div class="pane_box">
                            <input id="dayDate" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}"
                                v-model="filterDayDate" />
                            <select class="type_select" name="pets" id="pet-select" v-model="filterDayPet">
                                <option v-for="(item, index) in filterDayPetList" :value="item.name">
                                    {{ item.value }}
                                </option>
                            </select>
                            <div class="option_card">
                                <button class="option_btn" @click="handleClear">清空</button>
                                <button class="option_btn confirm" @click="handleConfirmDay">确认</button>
                            </div>
                            <div class="checkbox_card">
                                <el-checkbox-group v-model="checkList">
                                    <el-checkbox class="checkbox_card_name" disabled label="替代模式：" />
                                    <el-checkbox label="sum" />
                                    <el-checkbox label="max" />
                                    <el-checkbox label="min" />
                                    <el-checkbox label="avg" />
                                    <el-checkbox label="gap" />
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="thisMonth" label="月报表">
                        <div class="pane_box">
                            <input id="monthDate" class="dateInput" type="month" pattern="\d{4}/\d{2}/\d{2}"
                                v-model="filterMonthDate" />
                            <select class="type_select" name="pets" id="pet-select" v-model="filterMonthPet">
                                <option v-for="(item, index) in filterMonthPetList" :value="item.name">
                                    {{ item.value }}
                                </option>
                            </select>
                            <div class="option_card">
                                <button class="option_btn" @click="handleClear">
                                    清空
                                </button>
                                <button class="option_btn confirm" @click="handleConfirmMonth">
                                    确认
                                </button>
                            </div>
                            <div class="checkbox_card">
                                <el-checkbox-group v-model="checkList">
                                    <el-checkbox class="checkbox_card_name" disabled label="替代模式：" />
                                    <el-checkbox label="sum" />
                                    <el-checkbox label="max" />
                                    <el-checkbox label="min" />
                                    <el-checkbox label="avg" />
                                    <el-checkbox label="gap" />
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="byClass" label="班报表">
                        <div class="pane_box">
                            <input id="monthDate" class="dateInput" type="month" pattern="\d{4}/\d{2}/\d{2}"
                                v-model="filterClassDate" />
                            <select class="type_select" name="pets" id="pet-select" v-model="filterClassPet">
                                <option v-for="(item, index) in filterClassPetList" :value="item.name">{{ item.value }}
                                </option>
                            </select>
                            <select class="type_select" name="pets" id="pet-select" v-model="filterClassNum">
                                <option v-for="(item, index) in filterClassList" :value="item.name">{{ item.value }}
                                </option>
                            </select>
                            <input id="monthDate" class="dateInput" v-model="filterClassStart" />
                            <div class="option_card">
                                <button class="option_btn" @click="handleClear">清空</button>
                                <button class="option_btn confirm" @click="handleConfirmClass">确认</button>
                            </div>
                            <div class="checkbox_card">
                                <el-checkbox-group v-model="checkList">
                                    <el-checkbox class="checkbox_card_name" disabled label="替代模式：" />
                                    <el-checkbox label="sum" />
                                    <el-checkbox label="max" />
                                    <el-checkbox label="min" />
                                    <el-checkbox label="avg" />
                                    <el-checkbox label="gap" />
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="thisYear" label="年报表">
                        <div class="pane_box">
                            <input id="yearDate" class="dateInput" type="month" pattern="\d{4}/\d{2}/\d{2}"
                                v-model="filterYearDate" />
                            <select class="type_select" name="pets" id="pet-select" v-model="filterYearPet">
                                <option v-for="(item, index) in filterYearPetList" :value="item.name">{{ item.value }}
                                </option>
                            </select>
                            <div class="option_card">
                                <button class="option_btn" @click="handleClear">清空</button>
                                <button class="option_btn confirm" @click="handleConfirmYear">确认</button>
                            </div>
                            <div class="checkbox_card">
                                <el-checkbox-group v-model="checkList">
                                    <el-checkbox class="checkbox_card_name" disabled label="替代模式：" />
                                    <el-checkbox label="sum" />
                                    <el-checkbox label="max" />
                                    <el-checkbox label="min" />
                                    <el-checkbox label="avg" />
                                    <el-checkbox label="gap" />
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElTabs, ElTabPane, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { useStore } from 'vuex'
import { filters } from '@/unit/filter/filter'

const store = useStore()

const spliterValue = ref('')
const datespliterFrom = ref({ start: '', end: '' })

const filterDayDate = ref('')
const filterDayPet = ref('')

const filterMonthDate = ref('')
const filterMonthPet = ref('')

const filterClassDate = ref('')
const filterClassPet = ref('')
const filterClassNum = ref('')
const filterClassStart = ref('8:00')

const filterYearDate = ref('')
const filterYearPet = ref('')

const filterDayPetList = ref([
    { name: '', value: '选择采样间隔' },
    { name: '2s', value: '2s' },
    { name: '10s', value: '10s' },
    { name: '5m', value: '5m' },
    { name: '10m', value: '10m' },
    { name: '1h', value: '1h' },
    { name: '2h', value: '2h' },
    { name: '4h', value: '4h' },
])
const filterMonthPetList = ref([
    { name: '', value: '以此替代月内的数据' },
    { name: 'sum', value: 'sum' },
    { name: 'avg', value: 'avg' },
    { name: 'max', value: 'max' },
    { name: 'min', value: 'min' },
    { name: 'gap', value: 'gap' },
])
const filterClassPetList = ref([
    { name: '', value: '以此替代班次的数据' },
    { name: 'sum', value: 'sum' },
    { name: 'avg', value: 'avg' },
    { name: 'max', value: 'max' },
    { name: 'min', value: 'min' },
    { name: 'gap', value: 'gap' },
])
const filterClassList = ref([
    { name: '', value: '班次' },
    { name: '2', value: '一天两班' },
    { name: '3', value: '一天三班' },
])
const filterYearPetList = ref([
    { name: '', value: '以此替代年内的数据' },
    { name: 'sum', value: 'sum' },
    { name: 'avg', value: 'avg' },
    { name: 'max', value: 'max' },
    { name: 'min', value: 'min' },
    { name: 'gap', value: 'gap' },
])

const filterValue = ref('today')
const checkList = ref(['sum', 'gap'])
let dateConfig = {}

// filter相关
const handleChangefilter = () => {
    console.log(filterValue.value)
    // dateConfig.purpose = filterValue.value
    // // 切换时复位
    // filterDayPet.value = ''
    // filterMonthPet.value = ''
}
const handleConfirmDay = (e) => {
    let replaceList = []
    for (let item of checkList.value.values()) {
        replaceList.push(item)
    }
    let Config = {
        purpose: filterValue.value,
        options: {
            date: filterDayDate.value,
            interval: filterDayPet.value,
            theTopOfTheHour: true
        },
        replace: replaceList
    }
    Confirm(Config, e.target)
}
const handleConfirmMonth = (e) => {
    let replaceList = []
    for (let item of checkList.value.values()) {
        replaceList.push(item)
    }
    let Config = {
        purpose: filterValue.value,
        options: {
            date: filterMonthDate.value,
            replace: filterMonthPet.value
        },
        replace: replaceList
    }
    Confirm(Config, e.target)
}
const handleConfirmClass = (e) => {
    let replaceList = []
    let cnt = 1
    for (let item of checkList.value.values()) {
        replaceList.push(item)
    }
    if (filterClassNum.value == '') {
        cnt = 2
    } else {
        cnt = filterClassNum.value
    }
    let Config = {
        purpose: filterValue.value,
        options: {
            date: filterClassDate.value,
            replace: filterClassPet.value,
            classOption: {
                start: filterClassStart.value,
                gap: Number(24 / cnt)
            }
        },
        replace: replaceList
    }
    Confirm(Config, e.target)
}
const handleConfirmYear = (e) => {
    let replaceList = []
    for (let item of checkList.value.values()) {
        replaceList.push(item)
    }
    let Config = {
        purpose: filterValue.value,
        options: {
            date: filterYearDate.value,
            replace: filterYearPet.value
        },
        replace: replaceList
    }
    Confirm(Config, e.target)
}
const Confirm = (Config, el) => {
    el.style.backgroundColor = "#07C160"
    const func = filters.get('date').configureFilter
    const { filter, grouper } = func(Config.purpose, Config.options)
    store.commit('changeFilter', filter)
    store.commit('changeGrouper', grouper)
    if ('replace' in Config.options) {
        store.commit('changeReplace', Config.options.replace)
    }
    store.commit('changeAppend', Config.replace)
    console.log(Config)
    console.log(filter)
    console.log(grouper)
    console.log(store.state)
}
const handleClear = () => {
    checkList.value = []
    let els = document.querySelectorAll('.option_btn.confirm')
    for (let i = 0; i < els.length; i++) {
        els[i].style.backgroundColor = "#f0f0f0"
    }
    store.commit('changeAppend', null)
    store.commit('changeReplace', null)
    store.commit('changeFilter', null)
    store.commit('changeGrouper', null)
}

// spliter相关
const handleChangespliter = () => {
    dateConfig.purpose = spliterValue.value
}
const handlDatespliter = () => {
    dateConfig.options = {
        dateStart: converDate(datespliterFrom.value.start),
        dateEnd: converDate(datespliterFrom.value.end),
    }
}
const handleConfirmSpliter = () => {
    console.log(dateConfig)
    const func = filters.get('date').configureSpliter
    const spliter = func(dateConfig.purpose, dateConfig.options)
    store.commit('changeSpliter', spliter)
    dateConfig = {}
    spliterValue.value = ''
    datespliterFrom.value = { start: '', end: '' }
}

// 功能
class TabSwitch {
    constructor(id) {
        let node = document.getElementById(id)
        this.aBtns = node.getElementsByClassName('tabs_btn')
        this.aDivs = node.getElementsByClassName('tabs_pane')

        let _this = this

        for (let i = 0; i < this.aBtns.length; i++) {
            this.aBtns[i].index = i
            this.aBtns[i].onclick = function () {
                _this.tab(this)
            }
        }
    }
    tab(oBtn) {
        for (let i = 0; i < this.aBtns.length; i++) {
            this.aBtns[i].className = 'tabs_btn'
            this.aDivs[i].style.display = 'none'
        }
        oBtn.className = 'tabs_btn active'
        this.aDivs[oBtn.index].style.display = 'block'
    }
}
const converDate = (date) => {
    if (date) {
        let today = new Date(date)
        let DD = String(today.getDate()).padStart(2, '0') // 获取日
        let MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
        let yyyy = today.getFullYear() // 获取年
        today = yyyy + '/' + MM + '/' + DD
        return today
    } else {
        return null
    }
}
const converDate2 = (target = 'day') => {
    switch (target) {
        case 'day':
            {
                let today = new Date()
                let DD = String(today.getDate()).padStart(2, '0') // 获取日
                let MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
                let yyyy = today.getFullYear() // 获取年
                today = yyyy + '-' + MM + '-' + DD
                return today
            }
        case 'month':
            {
                let today = new Date()
                let MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
                let yyyy = today.getFullYear() // 获取年
                today = yyyy + '-' + MM
                return today
            }
        default:
            break
    }
}
onMounted(() => {
    filterDayDate.value = converDate2('day')
    filterMonthDate.value = converDate2('month')
    filterClassDate.value = converDate2('month')
    filterYearDate.value = converDate2('month')
    new TabSwitch('tabs')
})
</script>

<style lang="scss">
#tabs {
    $type_line-height: 25px;
    width: 100%;
    height: 100%;

    .tabs_header {
        width: 100%;
        height: calc($type_line-height);

        .type_name {
            width: 62px;
            height: $type_line-height;
            line-height: calc($type_line-height + 5px);
            color: #60627c;
            font-size: 12px;
            text-align: right;
            display: block;
            float: left;
        }

        .tabs_btn {
            width: 45px;
            height: calc($type_line-height - 6px);
            line-height: calc($type_line-height - 6px);
            margin: 3px 4px;
            font-size: 12px;
            background-color: white;
            color: #75778a;
            border: none;
            border-radius: 2px;
            float: right;
        }

        .active {
            background-color: aliceblue;
        }
    }

    .tabs_content {
        width: calc(100% - 25px);
        height: calc(100% - $type_line-height);
        margin: 0 15px 0 10px;

        .tabs_pane {
            width: 100%;
            height: 100%;

            .type_select {
                width: calc(100% - 10px);
                height: calc($type_line-height - 4px);
                color: #606266;
                background-color: #ffffff;
                font-size: 12px;
                margin: 4px 2px 0;
                padding: 0 5px;
                border: 1px solid #d9d9d9;
                border-radius: 3px;
                outline: none;
            }

            .type_select_day {
                width: calc(100% - 20px);
                height: calc($type_line-height - 5px);
                color: #606266;
                background-color: #ffffff;
                font-size: 12px;
                margin: 4px 2px 0;
                padding: 0 5px;
                border: 1px solid #d9d9d9;
                border-radius: 3px;
                outline: none;
            }

            .dateInput {
                width: calc(100% - 22px);
                height: calc($type_line-height - 6px);
                margin-top: 7px;
                padding: 0 5px;
                font-size: 12px;
                color: #606266;
                background-color: #ffffff;
                border: 1px solid #d9d9d9;
                border-radius: 3px;
                outline: none;
            }

            .type_confirm {
                width: 33%;
                height: calc($type_line-height - 6px);
                line-height: calc($type_line-height - 4px);
                margin-top: 10px;
                font-size: 12px;
                color: #606266;
                background-color: #f0f0f0;
                border: none;
                border-radius: 3px;
            }

            .date_tabs {
                height: 100%;

                .el-tabs__header {
                    margin-right: 5px;

                    .el-tabs__item {
                        height: 35px;
                        padding: 0 10px 0 0;
                    }
                }

                .el-tabs__content {
                    height: 100%;

                    .el-tab-pane {
                        height: 100%;
                    }

                    .pane_box {
                        width: 100%;
                        height: 100%;

                        .option_card {
                            width: 100%;
                            height: 40px;
                            line-height: 40px;
                            text-align: center;

                            .option_btn {
                                width: 50px;
                                height: calc($type_line-height - 6px);
                                line-height: calc($type_line-height - 5px);
                                margin: 0 5px;
                                background-color: #f0f0f0;
                                border: none;
                                border-radius: 3px;
                                font-size: 12px;
                            }
                        }

                        .checkbox_card {
                            width: 100%;
                            height: calc(100% - $type_line-height * 2 - 50px);

                            .el-checkbox-group {
                                width: 100%;

                                .el-checkbox {
                                    width: 40%;
                                    height: calc($type_line-height - 5px);
                                    margin: 8px 3% 8px 7%;
                                    text-align: left;
                                    float: left;
                                }

                                .checkbox_card_name {
                                    .el-checkbox__input {
                                        display: none;
                                    }

                                    .el-checkbox__input.is-disabled+span.el-checkbox__label {
                                        color: #000000;
                                        cursor: auto;
                                    }

                                    .el-checkbox__label {
                                        padding-left: 0;
                                        font-size: 12px;
                                        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
