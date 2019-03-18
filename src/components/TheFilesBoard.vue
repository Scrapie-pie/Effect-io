<template lang="pug">
    form.files-board
        fieldset(v-if="name=='smiles'")
            legend.files-board__text-only-scr Выберите смайл
            .files-board__board
                //smile-emoji( emoji="Grinning Face with Smiling Eyes" set="apple" :size="16")
                //smile-picker(
                    set="apple"
                    @select="addSmile",
                    :perLine="30",
                    :showPreview="false",
                    :i18n={search:'Поиск'}
                    )
                nimble-picker(
                    v-if="show",
                    set="messenger"
                    :data="getDataSmile"
                    @select="addSmile",

                    )
        fieldset(v-if="name=='gifs'")
            legend.files-board__text-only-scr Выбирите гифку
            .files-board__search
                base-field(type="search" theme="soft")
            .files-board__board
                | тут будут гифки = )
</template>

<script>
    import { Emoji, Picker,NimbleEmojiIndex ,NimblePicker } from 'emoji-mart-vue'

    import dataSmile from 'emoji-mart-vue/data/messenger'
    import lodash_isEmpty from 'lodash/isEmpty'
    console.log(dataSmile);
    //import { NimblePicker } from 'emoji-mart-vue'
    export default {
        props:{
            name:{
                type:String,
                validator: function (value) {
                    return ['smiles', 'gifs'].indexOf(value) !== -1
                }
            }
        },
        data(){
            return {
                setDataSmile:dataSmile
            }
        },
        computed:{
           show(){

                return !lodash_isEmpty(dataSmile)
            },
            getDataSmile(){
                console.log(dataSmile);
                return dataSmile
            }
        },
        components:{
            NimblePicker,
            //'smile-picker':Picker,
            'smile-emoji':Emoji,


        },
        methods:{
            addSmile(val){
                this.$emit('getSmile',val)
                console.log(dataSmile);
                let emojiIndex = new NimbleEmojiIndex(dataSmile)
                console.log(emojiIndex);
                console.log(emojiIndex.search('lik'));

                console.log(emojiIndex.search('christmas').map((o) => o.native));
                console.log('addSmile',val);
            }
        }

    }
</script>

<style lang="scss">
    .files-board {
        .emoji-mart {
            width:100%!important;
        }
        &__search {
            width:275px;
            margin-bottom:calc-em(20);
        }
        &__text-only-scr {
            @extend %visuallyhidden
        }
    }
</style>