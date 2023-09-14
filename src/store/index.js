import { createStore } from 'vuex'

export default createStore({
    state: {
        tableHead: { title: null },
        spliter: null,
        filter: null,
        grouper: null,
        formatter: null,
        replace: null,
        append: null,
        split: false,
        sort: null,
        printer: '',
        luckyRange: null,
        luckyOptions: {
            container: 'luckysheet',
            title: '万能报表',
            lang: 'zh',
            plugins: ['chart'],
            data: [],
            column: 26,
            row: 60,
            showtoolbar: false,
            showtoolbarConfig: {
                undoRedo: true, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
                paintFormat: true, //格式刷
                currencyFormat: true, //货币格式
                percentageFormat: true, //百分比格式
                numberDecrease: true, // '减少小数位数'
                numberIncrease: true, // '增加小数位数
                font: true, // '字体'
                fontSize: true, // '字号大小'
                bold: true, // '粗体 (Ctrl+B)'
                italic: true, // '斜体 (Ctrl+I)'
                underline: true, // '下划线 (Alt+Shift+6)'
                textColor: true, // '文本颜色'
                fillColor: true, // '单元格颜色'
                border: true, // '边框'
                mergeCell: true, // '合并单元格'
                horizontalAlignMode: true, // '水平对齐方式'
                verticalAlignMode: true, // '垂直对齐方式'
                textWrapMode: true, // '换行方式'
                image: true, // '插入图片'
                chart: true, // '插入表格'
                sortAndFilter: true, // '排序和筛选'
                splitColumn: true, // '分列'
                findAndReplace: true, // '查找替换'
            },
            cellRightClickConfig: {
                copy: true, // 复制
                copyAs: false, // 复制为
                paste: true, // 粘贴
                insertRow: true, // 插入行
                insertColumn: true, // 插入列
                deleteRow: true, // 删除选中行
                deleteColumn: true, // 删除选中列
                deleteCell: true, // 删除单元格
                hideRow: false, // 隐藏选中行和显示选中行
                hideColumn: false, // 隐藏选中列和显示选中列
                rowHeight: true, // 行高
                columnWidth: true, // 列宽
                clear: true, // 清除内容
                matrix: false, // 矩阵操作选区
                sort: true, // 排序选区
                filter: false, // 筛选选区
                chart: true, // 图表生成
                image: true, // 插入图片
                link: true, // 插入链接
                data: false, // 数据验证
                cellFormat: true, // 设置单元格格式
            },
            showinfobar: false,
            sheetFormulaBar: false,
            // showsheetbar: false,
            showstatisticBar: false,
        },
    },
    getters: {},
    mutations: {
        changeTablehead(state, newTablehead) {
            state.tableHead.title = newTablehead.title
        },
        changeSpliter(state, newSpliter) {
            state.spliter = newSpliter
        },
        changeFilter(state, newFilter) {
            state.filter = newFilter
        },
        changeGrouper(state, newGrouper) {
            state.grouper = newGrouper
        },
        changeFormatter(state, newFormatter) {
            state.formatter = newFormatter
        },
        changeReplace(state, newReplace) {
            state.replace = newReplace
        },
        changeAppend(state, newAppend) {
            state.append = newAppend
        },
        changeSplit(state, newSplit) {
            state.split = newSplit
        },
        changeSort(state, newSort) {
            state.sort = newSort
        },
        changePrinter(state, newPrinter) {
            state.printer = newPrinter
        },
        changeLuckyrange(state, newLuckyrange) {
            state.luckyRange = newLuckyrange
        },
    },
    actions: {},
    modules: {},
})
