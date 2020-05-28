<template lang="pug">

    form(@submit.prevent="submit").page-scenario-settings-timetable
        base-wait(name="pageScenarioSettingsTimeTable")

        ul.settings-list

            li.settings-list__item
                h3.settings-list__name Повторный показ сообщения посетителю
                ul.settings-list__sub
                    li.settings-list__sub-item
                        base-radio-check.settings-list__control(name="re-display" type="radio" v-model="model.conditions.resend_message_type" :value="0") Без ограничения
                    li.settings-list__sub-item
                        .page-scenario-settings-timetable__across
                            base-radio-check.settings-list__control(name="re-display" type="radio" v-model="model.conditions.resend_message_type" :value="1") Через
                            base-field.settings-list__control.settings-list__field(
                            type="text",
                            name="resend_message_after"
                            v-model.number="model.conditions.resend_message_after"
                            )
                            select-time-size.settings-list__control.settings-list__select(
                                v-model="model.conditions.resend_message_after_time_units"
                                name="resend_message_after_time_units"
                            )


                    li.settings-list__sub-item
                        .page-scenario-settings-timetable__repeat
                            base-radio-check.settings-list__control(name="re-display" type="radio" v-model="model.conditions.resend_message_type" :value="2") Повторить
                            base-field.settings-list__control.settings-list__field(
                            type="text",
                            name="resend_message_count"

                            v-model.number="model.conditions.resend_message_count"
                            )
                            span раз с интервалом
                            base-field.settings-list__control.settings-list__field(
                            type="text",
                            name="resend_message_interval"
                            v-model.number="model.conditions.resend_message_interval"
                            )
                            select-time-size.settings-list__control.settings-list__select(
                                v-model="model.conditions.resend_message_interval_time_units"
                                name="resend_message_interval_time_units"
                                )

                    li.settings-list__sub-item
                        base-radio-check.settings-list__control(name="do_not_resend_to_answered" v-model="model.conditions.do_not_resend_to_answered") Не отправлять повторные сообщения тем посетителям, кто ответил
        pre {{model}}
        base-btn(type="submit") Сохранить и завершить
</template>

<script>
import browserNotification from '@/modules/browserNotification'
import { scenarioSettings } from '@/mixins/mixins'
import SelectTimeSize from '@/components/SelectTimeSize'
export default {
    components: { SelectTimeSize },
    mixins: [scenarioSettings],
    data() {
        return {
            timeSizeList: [
                { name: 'Секунд', value: 0 },
                { name: 'Минут', value: 1 },
                { name: 'Часов', value: 2 }
            ],

            model: {
                conditions: {
                    do_not_resend_to_answered: 0,
                    resend_message_type: 0,
                    resend_message_after: 0,
                    resend_message_count: 0,
                    resend_message_interval: 0,
                    resend_message_after_time_units: 0,
                    resend_message_interval_time_units: 0
                }
            }
        }
    },

    computed: {},
    watch: {},
    created() {
        //this.clearFormValue();
    },
    methods: {
        submit() {
            this.$store.dispatch('scenario/changeItem', this.model).then(() => {
                browserNotification('Сохранено')
                this.$router.push({ name: 'scenarioList' })
            })
        }
    }
}
</script>
<style lang="scss">
.page-scenario-settings-timetable {
    &__across {
        display: grid;
        grid-template-columns: max-content 60px 107px;
        align-items: center;
        gap: calc-em(15);
    }
    &__repeat {
        display: grid;
        grid-template-columns: max-content 60px max-content 60px 107px;
        align-items: center;
        gap: calc-em(15);
    }
}
</style>
