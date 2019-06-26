<template lang="pug">
    sup.base-count(
        v-if="getCount"
        v-text="getCount"
        title="Количество сообщений"
    )
</template>

<script>
export default {
    props: {
        count: {
            type: Number,
            default: 0,
            validator: function(value) {
                return value > -1
            }
        }
    },
    data() {
        return {}
    },
    computed: {
        getCount() {
            if (this.count > 99) return 99
            if (this.count < 0) return 0
            return this.count
        }
    }
}
</script>

<style lang="scss">
.base-count {
    top: 0;
    display: inline-block;
    width: 16px;
    height: 16px;
    font-weight: 400;
    line-height: 17px;
    text-align: center;
    font-size: $glob-font-size_small;
    color: glob-color('light');
    border-radius: 50%;
    background-color: glob-color('error');
}
</style>
