<template>
  <el-container class="container_box">
    <el-aside class="option_box">
      <Option></Option>
    </el-aside>
    <el-main class="content_box">
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
$option: 250px;
* {
  padding: 0;
  margin: 0;
}
.container_box {
  width: 100%;
  height: 100%;
  .option_box {
    width: $option;
  }
  .content_box {
    width: calc(100% - $option);
    height: 100%;
    padding: 0;
  }
}
</style>
