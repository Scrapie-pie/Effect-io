<template lang="pug">

    form(@submit.prevent="submit")
        base-wait(name="pageScenarioSettingsContent")

        ul.settings-list

            li.settings-list__item
                h3.settings-list__name Выберите, что отображать посетителю при срабатывании сценария
                base-field.settings-list__control.settings-list__select(
                type="select",
                :selectOptions="{value:model.type,label:'name',options:typeList,reduce:e=>e.value}"
                name="channel"
                v-model="model.type"
                )
            li.settings-list__item
                h3.settings-list__name Выберите, для какого сайта сценарий
                base-field.settings-list__control.settings-list__select(
                type="select",
                :selectOptions="{value:model.conditions.animated,label:'name',options:viewList,reduce:el=>el.value}"
                name="view"
                v-model="model.conditions.animated"
                )

                text-info.settings-list__text-info(v-if="view.value") Имитация печати текста, каждая строка по очереди.

            template(v-if="!model.conditions.animated")
                li.settings-list__item
                    h3.settings-list__name Введите сообщение, которое увидит посетитель сайта
                    base-field.settings-list__control.settings-list__textarea(
                    type="textarea",
                    placeholder="Введите комментарий",
                    name="comment"
                    v-model="model.conditions.message[0]"
                    )
                    text-info.settings-list__text-info Если вы вставите в текст '$name' (без кавычек), данный параметр будет автоматически подставлять имя посетителя, если оно известно.
            template(v-else)
                li.settings-list__item
                    h3.settings-list__name Первая строка
                    base-field.settings-list__control.settings-list__textarea(
                    type="textarea",
                    placeholder="Введите текст",
                    name="comment"
                    v-model="model.conditions.message[0]"
                    )
                li.settings-list__item
                    h3.settings-list__name Вторая строка
                    base-field.settings-list__control.settings-list__textarea(
                    type="textarea",
                    placeholder="Введите текст",
                    name="comment"
                    v-model="model.conditions.message[1]"
                    )
                li.settings-list__item
                    h3.settings-list__name Третья строка
                    base-field.settings-list__control.settings-list__textarea(
                    type="textarea",
                    placeholder="Введите текст",
                    name="comment"
                    v-model="model.conditions.message[2]"
                    )
                li.settings-list__item
                    text-info Если вы вставите в текст '$name' (без кавычек), данный параметр будет автоматически подставлять имя посетителя, если оно известно.
        pre {{model}}
        base-btn(type="submit") Сохранить и продолжить
</template>

<script>
import browserNotification from '@/modules/browserNotification'
import TextInfo from '@/components/TextInfo'

import {scenarioSettings} from "@/mixins/mixins";

export default {
    components: {
        TextInfo
    },
    mixins:[scenarioSettings],
    data() {
        return {

            typeList: [
                { name: 'CallBack(Обратный звонок)', value: 0 },
                { name: 'Онлайн чат', value: 1 }
            ],

            viewList: [
                { name: 'Анимированное приветсвие', value: 1 },
                { name: 'Стандартный вид', value: 0 }
            ],
            model: {
                type:null,
                conditions:{
                    message:[],
                    animated:0,
                }
            }
        }
    },

    computed: {

    },
    watch: {},
    created() {
        this.type = this.typeList[0]
        this.view = this.viewList[0]
        //this.clearFormValue();
    },
    methods: {
        submit() {
            browserNotification('Сохранено')

            this.$store.dispatch('scenario/changeItem',this.model).then(()=>{
                browserNotification('Сохранено')
                this.$router.push({ name: 'scenarioSettingsConditions' })
            })


        }
    }
}
</script>
