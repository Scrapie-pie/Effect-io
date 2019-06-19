<template lang="pug">
    scroll-bar.page-tags(tag="section")
        base-wait(name="pageTags")
        form
            fieldset
                legend.page-tags__title Тэги
                ul.page-tags__list
                    li.page-tags__item
                        label.page-tags__label Введите кажный новый тэг в новой строке.
                        base-field.page-tags__textarea(
                            ref="textarea"
                            name="tags"
                            type="textarea"
                            rows="10"
                            v-model="textarea"
                            maxlength="2000"
                        )
                    li.page-tags__item
                        base-radio-check(name="obligationTag" v-model="is_tag_required_in_chat") Обязательное присвоение тэга
                    li.page-tags__item.page-tags__item_btn
                        base-btn(@click="save") Сохранить

</template>

<script>
    import autosize from 'autosize'
    import { mapGetters,mapActions } from 'vuex';

    import browserNotification from '@/modules/browserNotification'
export default {

    components:{

    },
    data() {
        return {
            autosizeInit:true,
            textarea:'',
            is_tag_required_in_chat:0
        }
    },
    computed:{
        ...mapGetters('tags',[
            'itemList'
        ]),
        ...mapGetters('user',[
            'settings'
        ]),

        itemListText(){
            return this.itemList.map(item=>item.tag)
        },
        itemListTextArea() {
            if(!this.itemListText.length) return ''
            return  this.itemListText.join('\n')
        },
        tags(){
            return this.textarea.split('\n')
        }
    },
    methods:{
        save(){
            this.$store.dispatch('tags/update',{
                tags:this.tags,
                is_tag_required_in_chat:this.is_tag_required_in_chat,
            }).then(()=>{
                browserNotification('Сохранено')
                //this.$router.push({name: 'processAll'});
                this.$store.commit('user/settingsUpdateFields',{is_tag_required_in_chat:this.is_tag_required_in_chat})
            });

        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm=>{
            if(!vm.$store.getters['user/isRole'](['admin','owner','operatorSenior'])) return vm.$router.push({name: 'processAll'})

        })
    },
    watch:{
        textarea(val){

            if(val) {

                setTimeout(()=>{
                    autosize(this.$refs.textarea.$el.querySelector('textarea'));
                },500)
            }


        },
        itemListTextArea:{
            handler(val){
                this.textarea = val
            },

            immediate: true
        },

        settings:{
            handler(val){
                console.log(val);

                if(val) this.is_tag_required_in_chat =  val.settings.is_tag_required_in_chat
            },

            immediate: true
        },

    },
    created(){
        this.$store.dispatch('tags/get');



    },
    mounted(){
        //console.log(this.$refs.textarea.$el.querySelector('textarea'));


    }
}
</script>

<style lang="scss">
    .page-tags {
        &__title {
            @extend %h4;
            margin-bottom:calc-em(40);
        }
        &__label {
            margin-bottom:calc-em(15);
        }
        &__item {
            margin-bottom:calc-em(20);
            &_btn {
                margin-top:calc-em(40);
            }
        }
        &__textarea  {
            .field__input {
                min-height:calc-em(100);
                height:auto;
            }

        }
    }

</style>
