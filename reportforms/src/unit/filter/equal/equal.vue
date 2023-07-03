<template>
    <div id="tabs">
        <div class="tabs_header">
            <span class="type_name">时间类型：</span>
            <button class="tabs_btn" id="equal-spliter" style="margin-right: 16px;">分离器</button>
            <button class="tabs_btn active" id="equal-filter">筛选器</button>
        </div>
        <div class="tabs_content">
            <div class="tabs_pane" style="display: none;">
                <input class="input_area" v-model="striperValue" @change="handleStriper" />
                <button class="type_confirm" @click="handleConfirmstriper">确定</button>
            </div>
            <div class="tabs_pane" style="display: block;">
                <input class="input_area" v-model="filterValue" @change="handleFilter" />
                <button class="type_confirm" @click="handleConfirmfilter">确定</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from "vuex";
import { equal } from "@/unit/filter/equal/equal";

const store = useStore()

const filterValue = ref('')
const striperValue = ref('')
let equalConfig = {}

const handleConfirmfilter = () => {
    equalConfig.param = filterValue.value
    console.log(equalConfig.param);
    if (equalConfig.param.includes('-')) {
        let array = equalConfig.param.split('-')
        let start = Number(array[0])
        let end = Number(array[1])
        equalConfig.param={start:start, end:end}
    }
    console.log(equalConfig.param);
    const func = equal.configureFilter
    
    const filter = func(equalConfig.param)
    console.log(filter)
    store.commit("changeFilter", filter)
    equalConfig = {}
    // filterValue.value = ""
    // striperValue.value = ""
    let filterButton = document.getElementById('equal-filter')
    filterButton.draggable = true
    filterButton.ondragstart = (e) => {
        window.dragFrom=e.target
    }
}

const handleConfirmstriper = () => {
    equalConfig.params = striperValue.value
    if (/[,，、/;]/.test(equalConfig.params)) {
        equalConfig.params=equalConfig.params.split(/[\t\r\f\n\s]*/g).join('')
        equalConfig.params = equalConfig.params.split(/[,，、/;]/)
        equalConfig.params = equalConfig.params.filter(x => { return x && x.trim() })
        equalConfig.params=[...new Set(equalConfig.params)]
    } else if (equalConfig.params.includes('-')) {
        let array = equalConfig.params.split('-')
        let start = Number(array[0])
        let end = Number(array[1])
        equalConfig.params=[]
        for (let i = start; i <= end; i++) {
            equalConfig.params.push(i)
        }
    }
    console.log(equalConfig.params);
    const func = equal.configureStriper
    const striper = func(equalConfig.params)
    store.commit("changeStriper", striper)
    equalConfig = {}
    // striperValue.value = ""
    // filterValue.value = ""
    let striperterButton = document.getElementById('equal-spliter')
    striperterButton.draggable = true
    striperterButton.ondragstart = (e) => {
        window.dragFrom = e.target
    }
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
onMounted(() => {
    new TabSwitch("tabs");
});
</script>
<style lang="scss">
#tabs {
    $type_line-height: 25px;
    width: 100%;
    height: 100%;
    // background-color: aqua;

    .tabs_header {
        width: 100%;
        height: calc($type_line-height);

        .type_name {
            width: 80px;
            height: $type_line-height;
            line-height: calc($type_line-height + 5px);
            color: #60627c;
            font-size: 13px;
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
            float:left;

            .input_area {
                // width: calc(100% - 20px);
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