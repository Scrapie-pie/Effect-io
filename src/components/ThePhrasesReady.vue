<template lang="pug">
    form.phrases-ready(@submit.prevent="submit")
        base-wait(name="phrasesReady")
        transition(name="fade" mode="out-in")
            fieldset.phrases-ready__wrap(v-if="!showPhrasesNew" key="showPhrasesNew")
                legend.phrases-ready__text-only-scr Готовый список фраз
                .phrases-ready__btn-add
                    base-btn(
                        @click="showPhrasesNew=true"
                        v-text="'Добавить свой шаблон'"
                    )
                .phrases-ready__inner
                    fieldset.phrases-ready__catalog.phrases-ready__fieldset
                        legend.phrases-ready__name Категория
                        scroll-bar.phrases-ready__scrollbar
                            action-list.phrases-ready__list(
                                :item-list="categories"
                                name="categories"
                                name-field-text="title"
                                name-field-value="id"
                                v-model="categoriesSelectId"
                            )

                    fieldset.phrases-ready__phrases-wrap.phrases-ready__fieldset

                        legend.phrases-ready__name Фраза
                        scroll-bar.phrases-ready__scrollbar.phrases-ready__scrollbar_phrases
                            ul.phrases-ready__phrases
                                li.phrases-ready__phrases-item(
                                    v-for="(item, index) in phrases",
                                    :key="index"
                                )
                                    span.phrases-ready__phrases-text(v-text="item.text")

                                    ul.phrases-ready__phrases-controls
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-edit
                                            base-btn(theme="link" v-text="'Редактировать'" @click="itemEditShow(item)")
                                        li.phrases-ready__phrases-button.phrases-ready__phrases-remove
                                            base-btn(theme="link" v-text="'Удалить'" @click="itemDelete(item.id)")

            fieldset(v-else)
                legend.phrases-ready__text-only-scr Добавление новой фразы
                ul.phrases-ready__add
                    li.phrases-ready__add-item.phrases-ready__add-item_select(v-if="!showPhrasesEdit")
                        label.phrases-ready__label(for="newCategory") Выберите категорию или придумайте свою
                        base-field(
                            type="select",
                            :selectOptions="{label:'title',options:categories,taggable:true}"
                            name="newCategory"
                            v-model="create.category",
                            id="newCategory"
                        )
                    template(v-if="create.category")
                        li.phrases-ready__add-item
                            label.phrases-ready__label(for="newPhrase" v-text="(!showPhrasesEdit)?'Введите фразу':'Редактировать фразу'")
                            base-field(
                                id="newPhrase",
                                type="textarea",
                                name="newPhrase"
                                v-model="create.text",
                                maxLength="2000"

                            )
                        li.phrases-ready__add-item(v-if="!showPhrasesEdit")
                            base-radio-check(
                                type="radio"
                                v-model="create.is_common",
                                :value="1"
                                name="is_common"
                            ) Все сотрудники будут видеть данный шаблон!
                        li.phrases-ready__add-item(v-if="!showPhrasesEdit")
                            base-radio-check(
                                type="radio" ,
                                :value="0",
                                v-model="create.is_common",
                                name="is_common"
                            ) Данный шаблон будет виден только мне
                        li.phrases-ready__add-item
                            base-btn.phrases-ready__add-item-button(v-text="(!showPhrasesEdit)?'Добавить шаблон':'Сохранить'" type="submit")
                            base-btn(v-text="'Отмена'" color="error", @click="cancel")
</template>

<script>
    import ActionList from '@/components/ActionList'
    export default {
        components:{
            ActionList
        },
        props:{

        },
        data() {
            return {
                showPhrasesNew:false,
                showPhrasesEdit:false,
                phrasesEditId:null,
                picked:'',
                is_common:1,
                create:{
                    text:'',
                    category:'',
                    is_common:1,
                },

                newCategory:'',
                newPhrase:'',

                VisibleToAll:false,
                categoriesSelectId:'',




            }
        },
        computed:{
            snippets(){
                return this.$store.state.phrases.snippets
            },
            categories(){
                return this.$store.state.phrases.categories
            },
            phrases(){
                return this.snippets.filter((item)=>item.category_id === Number(this.categoriesSelectId))
            }
        },
        watch:{
            showPhrasesNew(val){
                if(val && !this.showPhrasesEdit) this.create.text=''
            },
            categories:{
                handler(val){
                    if(val.length){
                        console.log(val);
                        this.categoriesSelectId=val[0].id
                    }

                },
                immediate: true
            },

        },
        created(){

        },
        methods:{
            cancel(){
                this.phrasesEditId=null;
                this.showPhrasesNew=false;
                this.showPhrasesEdit=false;
            },
            itemEditShow(item){

                this.phrasesEditId = item.id;
                this.create.text = item.text
                this.showPhrasesEdit=true;
                this.showPhrasesNew=true;
            },
            itemEdit(){
                let id = this.phrasesEditId,
                    text = this.create.text;
                this.$store.dispatch('phrases/snippetUpdate',{id,text});
            },
            itemDelete(id){
                this.$store.dispatch('phrases/snippetDelete',id);
            },
            itemCreate(){
                this.$store.dispatch('phrases/snippetCreate',this.create);
            },

            submit(){
                if(this.showPhrasesEdit) this.itemEdit()
                else this.itemCreate()
                this.showPhrasesNew=false;
                this.showPhrasesEdit=false;
                this.phrasesEditId=null,
                this.newCategory='';
                this.newPhrase='';
            }
        }
    }
</script>

<style lang="scss">
    .phrases-ready {
        $color-border:glob-color('info');
        $color-bg:glob-color('info-lighten');
        $transition:$glob-trans;

        $color-text:glob-color('secondary');
        $color-error:glob-color('error');

        $padding:calc-em(8) calc-em(26);
        max-height: 74vh;

        &__wrap,&__phrases-wrap {min-width:0}

        &__scrollbar {
            max-height: 67.5vh;
            margin-left:(calc-em(26) * -1);

            &_phrases {
                margin-left:-(calc-em(15));
                padding-left:calc-em(15);
            }
        }

        &__add-item {
            &+& {
                margin-top:calc-em(25);
            }

            &_select {
                max-width:275px;
            }


        }
        &__add-item-button {
            margin-right:calc-em(20);
        }

        &__title {
            font-weight:bold;
        }

        &__inner {
            display:flex;
        }

        &__list {

        }

        &__btn-add {
            position:absolute;
            right:0;
            top:0;
            margin:calc-em(13) calc-em(45);
        }


        &__catalog {
            padding-right: calc-em(15);
            flex: 0 0 auto;

            max-width: 220px;
            width: 100%;
            min-width:0;

            @include media(1600px) {
                padding-right:1vw;
            }
        }

        &__phrases-button {
            padding-left:calc-em(35);
            @include media($width_xl) {
                padding-left:0;
            }
        }
        &__phrases-remove {
            color:$color_error;
        }

        &__phrases-wrap {
            width:100%;
        }
        &__phrases {
            margin-left:(calc-em(10) * -1);
        }

        &__phrases-item {
            display:flex;

            align-items:center;
            padding:$padding;
            padding-left:calc-em(10);
            transition:$transition;
            &:hover {
                background-color:$color-bg;
            }
        }
        &__phrases-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &__phrases-controls {
            display:flex;
            align-items:center;
            margin-left:auto;

            @include media($width_xl) {
                flex-direction:column;
                align-items: flex-end;
                padding-left:calc-em(15);
            }
        }



        &__text-only-scr {
            @extend %visuallyhidden;
        }

        &__label {
            font-weight:bold;
            margin-bottom:calc-em(20);
        }
        &__name {
            font-weight:bold;
            margin-bottom:calc-em(50);


        }






    }




</style>