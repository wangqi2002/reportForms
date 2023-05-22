<template>
  <el-container class="containerBox">
    <el-aside class="sidebarBox">
      <Option></Option>
    </el-aside>
    <el-main class="contentBox">
      <Luckysheet></Luckysheet>
    </el-main>
  </el-container>
</template>

<script>
import Luckysheet from "@/components/Luckysheet.vue";
import Option from "@/components/Option.vue";
export default {
  name: "HomeView",
  components: {
    Luckysheet,
    Option,
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
    width: 300px;
  }
  .contentBox {
    padding: 0;
    height: 100vh;
  }
}
</style>
