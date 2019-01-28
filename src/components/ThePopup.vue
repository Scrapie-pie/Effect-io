<template lang="pug">
    section.popup
        box-controls(:show="notFind", :popup="true", @base_box_menu_close="hide")
            template(slot="text") Поиск не работает в start версии
            base-btn Посмотреть тарифы
    
</template>

<script>
export default {
    data() {
        return {
            notFind:false,
        }
    },
    computed:{
        getNoFind(){
            return this.notFind
        }
    },
    created(){
        this.$root.$on('popup-not-find',this.toggle)
    },
    methods:{
        toggle(val){
            if (val) return this.notFind=val;
            else  this.notFind=true

        },
        hide(){
            this.notFind=false
        }
    }

    
}
</script>

<style lang="scss">

</style>