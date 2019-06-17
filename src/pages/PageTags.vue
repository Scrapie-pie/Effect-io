<template lang="pug">
    section.page-tags
        h1.page-tags__title Теги
        form
            fieldset
                label.page-tags__label Введите кажный новый тэг в новой строке.
                base-field.page-tags__textarea(name="tags" type="textarea" rows="20" v-model="textarea")

                base-btn(@click="send") Сохранить

</template>

<script>

export default {

    components:{

    },
    data() {
        return {
            textarea:'',
            is_tag_required_in_chat:0
        }
    },
    computed:{
        tags(){
            return this.textarea.split('\n')
        }
    },
    methods:{
        send(){
            this.$http.post('tag/tag/set-settings', {
                tags:this.tags,
                is_tag_required_in_chat:this.is_tag_required_in_chat,
            });
        }
    }
}
</script>

<style lang="scss">
    .page-tags {
        &__title {
            @extend %h4
        }
        &__label {
            margin-top:calc-em(30);
            margin-bottom:calc-em(15);
        }
        &__textarea  {
            .field__input {
                height:calc-em(200);
            }

        }
    }

</style>
