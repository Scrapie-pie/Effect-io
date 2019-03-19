<template lang="pug">
    base-table
        caption(v-text="caption")
        thead: tr: th(v-for="(item, index) in headList" :key="index" v-html="item")
        tbody
            tr(v-for="(item, index) in bodyListFormat" :key="item.id")
                td
                    base-people(
                        v-if="item.operator",
                        type="operator",
                        :text="item.operator.statusText",
                        :name="item.operator.fullName",
                        :avatar-url="item.operator.photo"
                    )
                td
                    base-btn(
                        padding="xslr"
                        :router="{name:'teamChat',params:{id:item.id}}"
                    ) Детальная статистика
                td(v-if="item.operator" v-html="$options.filters.branchesBr(item.operator.branches_names)")

                td(v-text="item.dialogues_requests")
                td
                    span.color_success(v-text="item.dialogues_accepted")
                    span.color_error(v-text="'/'+item.dialogues_missed")
                td(v-text="item.first_answer_average_speed +' cек.'")
                td
                    span.color_success(v-text="item.excellent_ratings")
                    span.color_info(v-text="'/'+item.middling_ratings+'/'")
                    span.color_error(v-text="item.badly_ratings")


</template>

<script>
import branchesBr from '@/modules/branchesBr'
import {stats} from '@/mixins/mixins'

export default {
    mixins:[stats],
    filters:{
        branchesBr
    },
    data() {
        return {
            headList:[
                'Имя',
                '',
                'Отдел',
                'Получено<br>диалогов',
                'Принято/<br>пропущено диалогов',
                'Средняя скорость<br>ответа',
                'Оценки',
            ],
        }
    },
    computed:{
        bodyListFormat(){
            return this.bodyList.map(item=>{
                item.operator = this.$store.getters['operators/all'].find(itemSub=>itemSub.id===item.user_id)
                return item
            })
        },
    },
}
</script>

<style lang="scss">

</style>

