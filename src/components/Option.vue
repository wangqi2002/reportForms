<template>
    <div class="option_box">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="报表模板" name="1">
                <Reportcreate></Reportcreate>
            </el-collapse-item>
            <el-collapse-item title="报表类型" name="2">
                <Reportconfig></Reportconfig>
            </el-collapse-item>
            <el-collapse-item title="报表导出" name="3">
                <div class="download_box">
                    <input id="reportName" class="report_name" type="text" value="简易报表" placeholder="输入文件名" />
                    <input class="report_name" type="text" placeholder="输入报表打印人姓名" @change="setPrinter" />
                    <button class="download_btn" @click="downloadReport">导出报表</button>
                    <!-- <button class="print_btn" @click="printReport">打印报表</button> -->
                </div>
            </el-collapse-item>
        </el-collapse>
        <!-- <div class="title_box">多用报表</div> -->
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportExcel } from '@/unit/export'

import Reportcreate from '@/components/Reportcreate.vue'
import Reporttype from '@/components/Reporttype.vue'
import Reportconfig from '@/components/Reportconfig.vue'
import store from '@/store'

const jsonData = ref({})
const activeNames = ref(["1", "2", "3"])

const handleFun = () => {
    console.log('CS')
    // luckysheet.setCellValue(0, 0, 1);
    // luckysheet.setRangeShow({ row: [0, 1], column: [0, 2] })
    // console.log(luckysheet.getRangeValue({ row: [0, 1], column: [0, 2] }));
    // luckysheet.clearRange({ row: [0, 1], column: [0, 2] })
    console.log(luckysheet.getAllSheets())
}

const handleChange = () => {
    console.log(window.parent)
    // console.log(activeNames.value)
}

const downloadReport = () => {
    let name = document.getElementById('reportName')
    // 获取到表格数据 进行双map处理
    const excelData = window.luckysheet.flowdata();
    excelData.map(item => {
        if (item) {
            item.map(ll => {
                if (ll) {
                    ll.v = ll.m;
                    ll.ct = {
                        fa: "@",
                        t: "s"
                    };
                }
            });
        }
    });
    exportExcel(luckysheet.getAllSheets(), name.value ? name.value : '万能图表')
}
// const printReport = () => {
//     console.log(luckysheet.getSheetData())
//     console.log(luckysheet.transToCellData(luckysheet.getSheetData()))
//     window.print()
// }
const setPrinter = (e) => {
    console.log(e.target.value)
    store.commit('changePrinter', e.target.value)
}
</script>

<style src="@/style/option.scss" lang="scss"></style>
<style lang="scss"></style>
