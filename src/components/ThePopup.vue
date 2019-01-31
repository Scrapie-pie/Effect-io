<template lang="pug">
    section.popup
        box-controls(:show="!!noticeText", type="popup", @box_control_close="noticeText=false")
            template(slot="text") {{noticeText}}
            base-btn(@click="noticeText=false") Понятно
        box-controls(:show="notFind", type="popup", @box_control_close="notFind=false")
            template(slot="text") Поиск не работает в start версии
            base-btn Посмотреть тарифы
        box-controls(:show="img",  type="gallery", @box_control_close="img=false")
            img(:src="img" alt="Увеличенная картинка")
</template>

<script>
export default {
    data() {
        return {
            notFind:false,
            img:false,
            noticeText:false,
        }
    },
    computed:{

    },
    created(){
        this.$root.$on('popup',this.show);
        this.$root.$on('popup-img',this.showImg);
        this.$root.$on('popup-notice',(text)=>{
            this.noticeText = text;
        });
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