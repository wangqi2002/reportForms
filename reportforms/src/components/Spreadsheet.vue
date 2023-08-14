<template>
  <div class="spreadsheet_box">
    <div id="x_spreadsheet"></div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import Spreadsheet from "x-data-spreadsheet";
import zhCN from "x-data-spreadsheet/dist/locale/zh-cn";
import emitter from "@/unit/mittBus";

const store = useStore()

const options = {
  showToolbar: false, //顶部工具栏
  showGrid: true, //表格区域
  showContextmenu: false, //单元格菜单
  view: {
    height: () => document.querySelector(".fill_table") != null ? document.querySelector(".fill_table").clientHeight + 20 : 480,
    width: () => document.querySelector(".fill_table") != null ? document.querySelector(".fill_table").clientWidth : 580,
  },
  row: {
    len: 100,
    height: 20,
  },
  col: {
    len: 40,
    width: 60,
    indexWidth: 35,
    minWidth: 40,
  },
  style: {
    bgcolor: "#F7F7FC",
  },
  mode: 'read'
}
const handleSetdata = (xs, value) => {
  xs.loadData(value)
}
const handleClearData = (xs) => {
  let data = xs.getData()
  data.forEach((item) => {
    item.cols = { len: 40 }
    item.rows = { len: 100 }
  });
  xs.loadData(data)
}

onMounted(() => {
  Spreadsheet.locale("zh-cn", zhCN);
  const xs = new Spreadsheet("#x_spreadsheet", options)
  xs.on('cell-selected', function (cell, ri, ci) {
    if (cell) {
      if ('text' in cell) {
        store.commit("changeTablehead", { title: cell.text })
      }
    }
  })
  //TODO 添加双击填充
  xs.on('cell-selected', (cell, ri, ci) => {
    window.addEventListener('dblclick', function handleDbClick() {
      if (cell) {
        if ('text' in cell) {
          emitter.emit('tdFill', cell.text)
          store.commit("changeTablehead", { title: cell.text })
        }
      }
      window.removeEventListener("dblclick", handleDbClick)
    })
  })
  emitter.on("setSpread", (e) => {
    handleSetdata(xs, e);
  });
  emitter.on("clearSpread", (e) => {
    handleClearData(xs);
  });
});
</script>
  
<style lang="scss">
.spreadsheet_box {
  $x-spreadsheet-bottombar: 20px;
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;

  #x_spreadsheet {
    width: 100%;
    height: 100%;

    // .x-spreadsheet {
    //   width: 100%;
    //   height: 100%;
    //   .x-spreadsheet-sheet {
    //     width: 100% !important;
    //     height: 100% !important;
    //   }
    // }
    .x-spreadsheet-bottombar {
      height: $x-spreadsheet-bottombar;

      .x-spreadsheet-menu {
        li {
          height: $x-spreadsheet-bottombar;
          line-height: $x-spreadsheet-bottombar;
        }
      }
    }
  }
}
</style>
  