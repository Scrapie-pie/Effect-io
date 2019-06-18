<template lang="pug">
    form.the-spelling-form(@submit.prevent="submit")
        base-wait(name="phrasesReady")

        fieldset.the-spelling-form__wrap
            legend.the-spelling-form__text-only-scr Конструктор правописания
            .the-spelling-form__inner
                fieldset.the-spelling-form__fieldset
                    legend.the-spelling-form__name Варианты
                    scroll-bar.the-spelling-form__scrollbar
                        action-list.the-spelling-form__list(
                            :item-list="suggestions"
                            name="suggestions"
                            name-field-text="title"
                            name-field-value="id"
                            v-model="selectWordId"
                        )
                fieldset.the-spelling-form__fieldset
                    legend.the-spelling-form__name Возможные действия
                    ul.the-spelling-form__phrases
                        li.the-spelling-form__phrases-item(

                        )
                            base-btn(theme="link" v-text="'Пропустить'" @click="skipWord")
                        li.the-spelling-form__phrases-item(

                        )
                            base-btn(theme="link" v-text="'Добавить в словарь'" @click="addWord")




</template>

<script>
    import ActionList from '@/components/ActionList'
    export default {
        components:{
            ActionList
        },
        props:{
            message:{
                type:String,
                default:'',
            },
            list:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        data() {
            return {
                selectWordId:null,
                index:0,
                ignoredWords:[],
                newMessage:'',

            }
        },
        computed:{
            indexLast(){
                return this.list.length-1
            },
            suggestions(){


                    return this.list[this.index].suggestions.map((item,index)=>{
                        return {title:item,id:index}
                    })


            },
            selectWord(){
                return this.suggestions.find(item=>{
                    if(this.selectWordId===null ) return false
                    return item.id==this.selectWordId
                })
            }
        },
        watch:{
            message:{
               handler(val){
                   this.newMessage=val

               },
               immediate: true
           },
            selectWordId(val){
                console.log('selectWord',this.index);

                if(val!=null && this.index<=this.indexLast) {
                    this.newMessage = this.newMessage.replace(this.list[this.index].word,this.selectWord.title)
                    if(this.index===this.indexLast) {
                        this.$root.$emit('globBoxControlClose')
                        this.$emit('resultMessage',this.newMessage);

                    } else {
                        this.selectWordId=null
                        this.index+=1;
                    }

                }

                return val
            },
            index(val){
                if(val>this.indexLast) {
                    this.$root.$emit('globBoxControlClose')
                    this.$emit('resultMessage',this.newMessage);
                }
            }
          /*  suggestions:{
                handler(val){
                    if(val.length){
                        console.log('selectWordId',val);
                        this.selectWordId=val[0].id
                    }

                },
                immediate: true
            },*/

        },
        created(){

        },
        methods:{
            skipWord(){
                this.ignoredWords.push(this.list[this.index].word)
                this.$emit('ignoredWords',this.ignoredWords)
                this.index+=1
            },
            addWord(){

                this.$http.post('spelling/spelling/add-word',{
                    word:this.list[this.index].word,

                }).then(()=>{
                    this.index+=1

                });

            }
        }
    }
</script>

<style lang="scss">
    .the-spelling-form {
        $color-border:glob-color('info');
        $color-bg:glob-color('info-lighten');
        $transition:$glob-trans;

        $color-text:glob-color('secondary');
        $color-error:glob-color('error');

        $padding:calc-em(8) calc-em(26);
        max-height: 74vh;
        max-width:550px;

        &__inner {
            display:flex;
        }

        &__text-only-scr {
            @extend %visuallyhidden;
        }
        &__name {
            font-weight:bold;
            margin-bottom:calc-em(50);


        }

        &__fieldset {
            padding-right: calc-em(15);
            flex: 0 0 auto;

            max-width: 220px;
            width: 100%;
            min-width:0;

            @include media(1600px) {
                padding-right:1vw;
            }
        }

        &__scrollbar {
            max-height: 67.5vh;
            margin-left:(calc-em(26) * -1);


        }

        &__phrases-item {
            display:flex;

            align-items:center;
            padding:$padding;
            padding-left:calc-em(10);
            transition:$transition;

        }


    }




</style>