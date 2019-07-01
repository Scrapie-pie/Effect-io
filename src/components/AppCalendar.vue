<template lang="pug">
    form.app-calendar(@submit.prevent="send")
        v-date-picker(
            v-bind="getOptions"

            v-model="selectedDay"
            )
        ul.app-calendar__times(v-if="dates")
            li.app-calendar__time
                .app-calendar__time-text(v-text="'C '+dates.date_from")
                base-field.app-calendar__field(
                        type="time"
                        name="time_from",
                        :step="60*1"
                        v-model="time_from",
                        :max="time_to"

                    )
            li.app-calendar__time
                .app-calendar__time-text(v-text="'По '+dates.date_to")
                base-field.app-calendar__field(
                    type="time"
                    name="time_to",
                    :step="60*1"
                    v-model="time_to",
                    :min="time_from"

                )

            li.app-calendar__time.app-calendar__time_btn
                base-btn(type="submit") Выбрать
</template>

<script>
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import { datetimeDMY } from '@/modules/datetime'
import 'v-calendar/lib/v-calendar.min.css'

// Remember to setup calendar (passing in defaults if needed)
setupCalendar({
    //firstDayOfWeek : 2
})
export default {
    name: 'AppCalendar',
    components: {
        'v-calendar': Calendar,
        'v-date-picker': DatePicker
    },

    data() {
        return {
            selectedDay: null,
            time_from: '00:00',
            time_to: '23:59',
            selectedDayStoreOnce: true
        }
    },
    computed: {
        selectedDayStore() {
            if (this.$store.state.filterSelect.last_days[0] == -1)
                return this.$store.state.filterSelect.calendar
            else return []
        },
        getOptions() {
            return {
                tintColor: this.globColor('info'),

                themeStyles: {
                    wrapper: null,
                    verticalDivider: null,
                    headerTitle: {
                        fontSize: '19px',
                        fontWeight: 700,
                        color: this.globColor('main'),
                        textTransform: 'capitalize'
                    }
                },
                isInline: true,
                showDayPopover: false,
                isDoublePaned: true,
                isLinked: true,
                //showLinkedButtons:true,
                mode: 'range',
                showCaps: true,
                attributes: [
                    {
                        key: 'today',
                        bar: {
                            backgroundColor: this.globColor('disabled')
                            // Other properties are available too, like `height` & `borderRadius`
                        },
                        dates: new Date()
                    }
                ]
            }
        },

        dates() {
            let val = this.selectedDay
            let date_from, date_to
            if (val && val.end && val.start) {
                date_from = datetimeDMY(val.start)
                date_to = datetimeDMY(val.end)
                return {
                    start: val.start,
                    end: val.end,
                    date_from,
                    date_to,
                    time_from: this.time_from,
                    time_to: this.time_to
                }
            }
            return null
        }
    },
    watch: {
        selectedDay(val) {
            console.log('selectedDay', val)
        },
        selectedDayStore: {
            handler(val, oldval) {
                if (!val.length) return
                if (!this.selectedDayStoreOnce) return

                let { end, start } = val[0]

                this.selectedDay = {
                    start: new Date(start),
                    end: new Date(end)
                }
                this.$emit('get', this.dates)
                this.selectedDayStoreOnce = false
            },
            immediate: true
        }
    },
    methods: {
        globColor(nameColor) {
            return getComputedStyle(document.body).getPropertyValue(`--color-${nameColor}`)
        },
        send() {
            console.log('send')
            this.$emit('get', this.dates)
        }
    }
}
</script>

<style lang="scss">
.app-calendar {
    $color_select: glob-color('info-light');

    &__times {
        display: flex;
        align-items: center;
        margin-top: calc-em(15);
        @extend %row-flex;
    }
    &__time {
        display: flex;
        align-items: center;
        &_btn {
            flex: 1;
            .btn {
                width: 100%;
            }
        }
    }

    &__time-text {
        @extend %h4;
        margin-bottom: 0;
        white-space: nowrap;
        margin-right: calc-em(10);
    }

    &__field {
        min-width: auto;
        .field__input {
            width: 6em;
            padding: calc-em(5);
            text-align: center;
        }
    }
}
</style>
