<template>
    <div id="tabs">
        <div class="tabs_header">
            <span class="type_name">时间类型：</span>
            <button class="tabs_btn" style="margin-right: 16px;">striper</button>
            <button class="tabs_btn active">filter</button>
        </div>
        <div class="tabs_content">
            <div class="tabs_pane" style="display: none;">
                <select class="type_select" name="pets" id="pet-select" v-model="striperValue"
                    @change="handleChangestriper">
                    <option value="">选择striper类型</option>
                    <option value="byDay">日报</option>
                    <option value="byMonth">月报</option>
                    <option value="byYear">年报</option>
                </select>
                <input id="start" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}" v-model="datestriperFrom.start"
                    @change="handlDatestriper" />
                <input id="end" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}" v-model="datestriperFrom.end"
                    @change="handlDatestriper" />
                <button class="type_confirm" @click="handleConfirmstriper">确定</button>
            </div>
            <div class="tabs_pane" style="display: block;">
                <select class="type_select" name="pets" id="pet-select" v-model="filterValue" @change="handleChangefilter">
                    <option value="">选择filter类型</option>
                    <option value="today">日报</option>
                    <option value="thisWeek">周报</option>
                    <option value="thisMonth">月报</option>
                    <option value="thisYear">年报</option>
                    <option value="range">自由报表</option>
                </select>
                <input id="start" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}" v-model="datefilterFrom.start"
                    @change="handlDatefilter" />
                <input id="end" class="dateInput" type="date" pattern="\d{4}/\d{2}/\d{2}" v-model="datefilterFrom.end"
                    @change="handlDatefilter" />
                <button class="type_confirm" @click="handleConfirmfilter">确定</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from "vuex";
import { date } from "@/unit/filter/date/date";

const store = useStore()

const filterValue = ref('')
const striperValue = ref('')
const datefilterFrom = ref({ start: "", end: "" });
const datestriperFrom = ref({ start: "", end: "" });
let dateConfig = {}


const handleChangefilter = () => {
    dateConfig.purpose = filterValue.value
}
const handlDatefilter = () => {
    dateConfig.dateRange = {
        date: converDate(datefilterFrom.value.start),
        start: converDate(datefilterFrom.value.start),
        end: converDate(datefilterFrom.value.end),
    }
}
const handleConfirmfilter = () => {
    const func = date.configureFilter
    const filter = func(dateConfig.purpose, dateConfig.dateRange)
    store.commit("changeFilter", filter)
    dateConfig = {}
    filterValue.value = ""
    datefilterFrom.value = { start: "", end: "" }
    striperValue.value = ""
    datestriperFrom.value = { start: "", end: "" }
}


const handleChangestriper = () => {
    dateConfig.purpose = striperValue.value
}
const handlDatestriper = () => {
    dateConfig.dateRange = {
        dateStart: converDate(datestriperFrom.value.start),
        dateEnd: converDate(datestriperFrom.value.end)
    }
}
const handleConfirmstriper = () => {
    const func = date.configureStriper
    const striper = func(dateConfig.purpose, dateConfig.dateRange)
    store.commit("changeStriper", striper)
    dateConfig = {}
    striperValue.value = ""
    datestriperFrom.value = { start: "", end: "" }
    filterValue.value = ""
    datefilterFrom.value = { start: "", end: "" }
}

class TabSwitch {
    constructor(id) {
        var node = document.getElementById(id);
        this.aBtns = node.getElementsByClassName("tabs_btn");
        this.aDivs = node.getElementsByClassName("tabs_pane");

        var _this = this;

        for (var i = 0; i < this.aBtns.length; i++) {
            this.aBtns[i].index = i;
            this.aBtns[i].onclick = function () {
                _this.tab(this);
            };
        }
    }
    tab(oBtn) {
        for (var i = 0; i < this.aBtns.length; i++) {
            this.aBtns[i].className = 'tabs_btn';
            this.aDivs[i].style.display = 'none';
        }
        oBtn.className = "tabs_btn active";
        this.aDivs[oBtn.index].style.display = 'block';
    }
}
const converDate = (date) => {
    if (date) {
        var today = new Date(date);
        var DD = String(today.getDate()).padStart(2, '0'); // 获取日
        var MM = String(today.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
        var yyyy = today.getFullYear(); // 获取年
        today = yyyy + '/' + MM + '/' + DD;
        return today;
    } else {
        return null;
    }
}
onMounted(() => {
    new TabSwitch("tabs");
});
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
            width: 40px;
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
                background-color: #FFFFFF;
                font-size: 12px;
                margin: 4px 2px 0;
                padding: 0 5px;
                border: none;
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
                background-color: #FFFFFF;
                border: none;
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
                background-color: #FFFFFF;
                border: none;
                border-radius: 3px;
            }
        }
    }
}
</style>