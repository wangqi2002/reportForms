<template>
  <el-container class="containerBox">
    <el-aside class="sidebarBox">Aside</el-aside>
    <el-main class="contentBox">
      <Luckysheet></Luckysheet>
    </el-main>
  </el-container>
</template>

<script>
import Luckysheet from "@/components/Luckysheet.vue";
export default {
  name: "HomeView",
  components: {
    Luckysheet,
  },
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
.containerBox {
  width: 100vw;
  height: 100vh;
  .sidebarBox {
    width: 200px;
    background-color: aqua;
  }
  .contentBox {
    padding: 0;
    height: 100vh;
  }
}
</style>
