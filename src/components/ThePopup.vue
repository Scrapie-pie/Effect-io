<template lang="pug">
    section.popup
        box-controls(:show="notFind", :popup="true", @box_control_close="notFind=false")
            template(slot="text") Поиск не работает в start версии
            base-btn Посмотреть тарифы
        box-controls(:show="img",  :gallery="true", @box_control_close="img=false")
            img(:src="img" alt="Увеличенная картинка")
</template>

<script>
export default {
    data() {
        return {
            notFind:false,
            img:false,
        }
    },
    computed:{

    },
    created(){
        this.$root.$on('popup',this.show);
        this.$root.$on('popup-img',this.showImg);
    },
    methods:{
        show(name){
            this[name]=true;
        },
        showImg(img) {
            this.img=img;
        }

    }

    
}
</script>

<style lang="scss">

</style>