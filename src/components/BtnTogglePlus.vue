<template lang="pug">
    base-btn.btn-toggle-plus(theme="default", :icon="{box:true,textHidden:textHidden}" @click="sortToggle" v-html="textToggle")

</template>

<script>
export default {
    name: 'BtnSort',
    props: {
        toggle: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    computed: {
        textHidden(){
            if(!this.toggle) return 'Раскрыть'
            else return 'Свернуть'
        },
        textToggle(){
            if(!this.toggle) return '+'
            else return '&#8722;'
        },
        sortClass() {
            let str = this.toggle ? 'btn-sort_rotate' : ''
            return 'btn-sort ' + str
        }
    },
    methods: {

        sortToggle() {
            this.$emit('result', !this.toggle)
        }
    }
}
</script>

<style lang="scss">
.btn-toggle-plus {
    font-weight:bold;
    width: 18px;
    padding: 0;
}
</style>
