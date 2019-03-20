<template lang="pug">
    base-table
        caption(v-text="caption")
        thead(v-if="order!=='first_answer_average_speed'")
            tr: th(v-for="(item, index) in headList" :key="index" v-html="item")
        tbody
            tr(v-for="(item, index) in itemList" :key="item.id")
                td
                    base-people(
                        v-if="item.operator",
                        type="operator",
                        :text="item.operator.statusText",
                        :name="item.operator.fullName",
                        :avatar-url="item.operator.photo"
                    )
                td(v-if="!btnDetailHide")
                    base-btn(
                        padding="xslr",
                        :router="{name:'statsEmployeesDetail',params:{id:item.user_id}}"
                    ) Детальная статистика
                td(v-if="item.operator" v-html="$options.filters.branchesBr(item.operator.branches_names)")

                td(v-text="item.dialogues_requests")
                template(v-if="order!=='first_answer_average_speed'")
                    td
                        span.color_success(v-text="item.dialogues_accepted")
                        span.color_error(v-text="'/'+item.dialogues_missed")
                    td(v-text="item.first_answer_average_speed +' cек.'")
                    td
                        span.color_success(v-text="item.excellent_ratings")
                        span.color_info(v-text="'/'+item.middling_ratings+'/'")
                        span.color_error(v-text="item.badly_ratings")
                td(v-else v-text="item[order]")

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

        }
    },
    computed:{
        headList(){
            let list = [
                'Имя',
                '',
                'Отдел',
                'Получено<br>диалогов',
                'Принято/<br>пропущено диалогов',
                'Средняя скорость<br>ответа оператора',
                'Оценки',
            ]

            if(this.btnDetailHide) list.splice(1, 1)

            if(this.order==="first_answer_average_speed") {
                list = [
                    'Название отдела',
                    'Получено диалогов',
                ]
                list.push('Среднее время первого ответа на диалог')
            }

            return list
        },
        bodyListFormat(){
            return this.bodyList.map(item=>{
                item.operator = this.$store.getters['operators/all'].find(itemSub=>itemSub.id===item.user_id)
                if(item.operator) item.name=item.operator.fullName
                return item
            })
        },
    },
}
</script>

<style lang="scss">

</style>

