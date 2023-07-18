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
                <el-tabs class="date_tabs" tab-position="left" v-model="dataTabsValues">
                    <el-tab-pane name="Day" label="Day">
                        <div class="pane_box">
                            <input id="dayDate" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}"
                                v-model="filterDayDate" @change="handlDatefilter" />
                            <div class="type_select_card">
                                <input list="day_kind" id="day_kind_input" class="type_select_day" name="day_kind_choice"
                                    v-model="filterDayPet" @input="handleChangefilterPetday">
                                <datalist id="day_kind">
                                    <option v-for="(item, index) in filterDayPetList" :value="item.name"></option>
                                </datalist>
                            </div>
                            <div class="option_card">
                                <button class="option_btn" @click="handleClear">清空</button>
                                <button class="option_btn" @click="handleConfirm">确认</button>
                            </div>
                            <div class="checkbox_card">
                                <el-checkbox-group v-model="checkList" @change="handleCheck">
                                    <el-checkbox label="Sum" />
                                    <el-checkbox label="Max" />
                                    <el-checkbox label="Min" />
                                    <el-checkbox label="AVG" />
                                    <el-checkbox label="GAP" />
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="Month" label="Month">
                        <div class="pane_box">
                            <input id="monthDate" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}"
                                v-model="filterMonthDate" @change="handlDatefilter" />
                            <select class="type_select" name="pets" id="pet-select" v-model="filterMonthPet"
                                @change="handleChangefilterPet">
                                <option v-for="(item, index) in filterMonthPetList" :value="item.name">{{ item.value }}
                                </option>
                            </select>
                            <div class="option_card">
                                <button class="option_btn" @click="handleClear">清空</button>
                                <button class="option_btn" @click="handleConfirm">确认</button>
                            </div>
                            <div class="checkbox_card">
                                <el-checkbox-group v-model="checkList" @change="handleCheck">
                                    <el-checkbox label="Sum" />
                                    <el-checkbox label="Max" />
                                    <el-checkbox label="Min" />
                                    <el-checkbox label="AVG" />
                                    <el-checkbox label="GAP" />
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
import { useStore } from 'vuex'
import { date } from '@/unit/filter/date/date'

const store = useStore()

const filterValue = ref('')
const spliterValue = ref('')
const filterDayDate = ref('')
const filterMonthDate = ref('')
const filterDayPet = ref('')
const filterMonthPet = ref('')
const filterDayPetList = ref([
    { name: 1, value: "111111" },
    { name: 2, value: "222222" },
    { name: 3, value: "333333" },
    { name: 4, value: "444444" },
    { name: 5, value: "555555" }]
)
const filterMonthPetList = ref([
    { name: '', value: "请选择" },
    { name: 1, value: "111111" },
    { name: 2, value: "222222" },
    { name: 3, value: "333333" },
    { name: 4, value: "444444" },
    { name: 5, value: "555555" }]
)
const datespliterFrom = ref({ start: '', end: '' })
const dataTabsValues = ref("Day")
const checkList = ref(['Sum', 'GAP'])
let dateConfig = {}

// filter相关
const handlDatefilter = () => {
    console.log(filterDayDate.value)
    // dateConfig.dateRange = {
    //     date: converDate(datefilterFrom.value.start),
    //     range: { start: converDate(datefilterFrom.value.start), end: converDate(datefilterFrom.value.end) },
    // }
}
const handleChangefilterPet = () => {
    console.log(filterMonthPet.value)
}
const handleChangefilterPetday = () => {
    console.log(filterDayPet.value)
}
const handleCheck = () => {
    console.log(checkList.value)
}
const handleClear = () => {
    console.log("handleClear")
}
const handleConfirm = () => {
    console.log("handleConfirm")
    console.log(filterMonthPet.value)
    console.log(filterDayPet.value)
    console.log(checkList.value)
}

// spliter相关
const handleChangespliter = () => {
    dateConfig.purpose = spliterValue.value
}
const handlDatespliter = () => {
    dateConfig.dateRange = {
        dateStart: converDate(datespliterFrom.value.start),
        dateEnd: converDate(datespliterFrom.value.end),
    }
}
const handleConfirmSpliter = () => {
    const func = date.configureSpliter
    const spliter = func(dateConfig.purpose, dateConfig.dateRange)
    store.commit('changeSpliter', spliter)
    dateConfig = {}
    spliterValue.value = ''
    datespliterFrom.value = { start: '', end: '' }
    filterValue.value = ''
    datefilterFrom.value = { start: '', end: '' }
}

// 功能
class TabSwitch {
    constructor(id) {
        var node = document.getElementById(id)
        this.aBtns = node.getElementsByClassName('tabs_btn')
        this.aDivs = node.getElementsByClassName('tabs_pane')

        var _this = this

        for (var i = 0; i < this.aBtns.length; i++) {
            this.aBtns[i].index = i
            this.aBtns[i].onclick = function () {
                _this.tab(this)
            }
        }
    }
    tab(oBtn) {
        for (var i = 0; i < this.aBtns.length; i++) {
            this.aBtns[i].className = 'tabs_btn'
            this.aDivs[i].style.display = 'none'
        }
        oBtn.className = 'tabs_btn active'
        this.aDivs[oBtn.index].style.display = 'block'
    }
}
const converDate = (date) => {
    if (date) {
        var today = new Date(date)
        var DD = String(today.getDate()).padStart(2, '0') // 获取日
        var MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
        var yyyy = today.getFullYear() // 获取年
        today = yyyy + '/' + MM + '/' + DD
        return today
    } else {
        return null
    }
}
const converDate2 = () => {
    var today = new Date()
    var DD = String(today.getDate()).padStart(2, '0') // 获取日
    var MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
    var yyyy = today.getFullYear() // 获取年
    today = yyyy + '-' + MM + '-' + DD
    return today
}
onMounted(() => {
    filterDayDate.value = converDate2()
    filterMonthDate.value = converDate2()
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
            width: 80px;
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
        width: calc(100% - 29px);
        height: calc(100% - $type_line-height);
        margin: 0 15px 0 14px;

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
                width: calc(100% - 20px);
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
                                ;
                                line-height: calc($type_line-height - 5px);
                                ;
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
                                    height: $type_line-height;
                                    margin: 0 3% 0 7%;
                                    text-align: left;
                                    float: left;
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
