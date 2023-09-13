// 判断元素是否在 node 区域之外
import { ref, onMounted, onUnmounted } from 'vue';
const useClickOutside = (elementRef) => {
    // 设置一个导出值
    const isClickOutside = ref(false);
    // 给界面绑定上事件
    const handler = (e) => {
        if (elementRef.value) {
            // e.target 有可能是为 null 所以需要断言
            if (elementRef.value.contains(e.target)) {
                // 判断目标节点是不是当前的节点
                isClickOutside.value = false;
            }
            else {
                isClickOutside.value = true;
            }
        }
    };
    onMounted(() => {
        document.addEventListener('click', handler);
    });
    onUnmounted(() => {
        document.removeEventListener('click', handler);
    });
    return isClickOutside;
};
export default useClickOutside;