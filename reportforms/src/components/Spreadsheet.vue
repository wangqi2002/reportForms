<template>
  <div class="spreadsheet_box">
    <div id="x_spreadsheet"></div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import Spreadsheet from "x-data-spreadsheet";
import zhCN from "x-data-spreadsheet/dist/locale/zh-cn";

const init = () => {
  const xs = new Spreadsheet("#x_spreadsheet", {
    showToolbar: false, //顶部工具栏
    showGrid: true, //表格区域
    showContextmenu: false, //单元格菜单
    view: {
      height: () => document.querySelector(".fill_table").clientHeight + 20,
      width: () => document.querySelector(".fill_table").clientWidth,
    },
    row: {
      len: 60,
      height: 20,
    },
    col: {
      len: 20,
      width: 60,
      indexWidth: 35,
      minWidth: 40,
    },
    style: {
      bgcolor: "#efefef",
    },
  })
    .loadData({})
    .change((data) => {});
};

// !!! create luckysheet after mounted
onMounted(() => {
  Spreadsheet.locale("zh-cn", zhCN);
  init();
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
  