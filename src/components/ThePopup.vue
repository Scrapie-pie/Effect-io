<template lang="pug">
    section.popup
        box-controls(:show="!!noticeText", type="popup", @boxControlClose="noticeText=false")
            template(slot="text") {{noticeText}}
            base-btn(@click="noticeText=false") Понятно
        box-controls(:show="notFind", type="popup", @boxControlClose="notFind=false")
            template(slot="text") Поиск не работает в start версии
            base-btn Посмотреть тарифы
        box-controls(:show="img",  type="gallery", @boxControlClose="img=false")
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
    .popup {
        position:relative;
        z-index:2; //иначе при открывание видно как слои местами меняются
    }
</style>