<template lang="pug">
    section.layout-table
        .layout-table__controls
            .layout-table__control(v-for="(item,index) in $slots.control", :key="index+'c'"): vnode(:node="item")
        .layout-table__head(v-for="item in $slots.head"): vnode(:node="item")
            slot(name="head")

        scroll-bar.layout-table__content(
            v-if="$slots.default" ,
            @ps-scroll-down="val=>$emit('scrolldown',val)"
            ref="layoutTableContent"
        )
            vnode(v-for="(item,index) in $slots.default", :node="item" :key="index").layout-table__max-width
                slot
        slot(name="empty")
</template>

<style lang="scss">
.layout-table {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;

    &__max-width {
        max-width: 1300px;
    }

    &__controls {
        display: flex;
        align-items: center;
        margin-bottom: calc-em(35);
        flex-flow: wrap;
        position: relative;
        z-index: 2;
    }

    &__control {
        margin-right: calc-em(40);
        margin-bottom: calc-em(15);
    }

    &__content {
        height: 100%;
        margin-right: -1 * calc-em(15);
        padding-right: calc-em(15);
        overflow: auto;
    }
}
</style>
<script>
import { scrollbar } from '@/mixins/mixins'
export default {
    mixins: [scrollbar],
    watch: {
        $route(to, from) {
            setTimeout(() => {
                this.scrollbarScrollerPush(this.$refs.layoutTableContent, 0)
            }, 1000)
        }
    }
}
</script>
