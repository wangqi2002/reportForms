<template>
    <el-container class="container_box">
        <!--        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" align-center>-->
        <!--            <span>权限认证</span>-->
        <!--            <el-input placeholder="请输入用户名" />-->
        <!--            <el-input placeholder="请输入密码" />-->
        <!--            //todo 生成人名/编辑时间表头,软件激活码使用时候还会改动-->
        <!--        </el-dialog>-->
        <el-aside class="option_box" id="option_box">
            <Option></Option>
        </el-aside>
        <el-main class="content_box">
            <Luckysheet></Luckysheet>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, provide, createApp, onMounted } from 'vue'
import emitter from '@/unit/mittBus'

import Luckysheet from '@/components/Luckysheet.vue'
import Reportfill from '@/components/Reportfill.vue'
import Option from '@/components/Option.vue'
import store from '@/store'

const reportfillInstance = createApp(Reportfill).use(store)
const mountNode = document.createElement('div')
let flag = false

const handleFillbox = (type, value) => {
    const el = document.getElementById('fill_report_box')
    if (el == null) {
        document.body.appendChild(mountNode)
        if (!flag) {
            reportfillInstance.mount(mountNode)
            flag = !flag
        }
        setTimeout(() => {
            emitter.emit('filltype', { type: type, range: value })
        }, 350)
    }
}
const handleRemovefillbox = () => {
    document.body.removeChild(mountNode)
}

provide('handleFillbox', handleFillbox)

onMounted(() => {
    emitter.on('exitfill', (e) => {
        handleRemovefillbox()
    })
    //todo 在打包的时候放开注释
    // window.parent.uniclient.windowEvent.on('leftBar:created.easy-report', () => {
    //     window.uniclient.windowEvent.emit('mainTab:change', 'easy-report')
    //     let box = document.getElementById('option_box')
    //     box.style.display = box.style.display == 'none' ? 'block' : 'none'
    // })
})
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
        // width: calc(100% - $option);
        // display: none;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
    }
}
</style>
