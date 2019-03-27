<template lang="pug">

        //calendar-range(v-bind="options" v-on="events").app-calendar
        v-calendar(
        v-bind="getOptions"
        v-model="selectedValue"
        )

</template>

<script>
    import {calendarRange} from 'vue-calendar-picker'
    import { setupCalendar, Calendar} from 'v-calendar'
    import 'v-calendar/lib/v-calendar.min.css';

    // Remember to setup calendar (passing in defaults if needed)
    setupCalendar({
        //firstDayOfWeek : 2
    });
export default {
    name: "app-calendar",
    components:{
        'v-calendar':Calendar,
        calendarRange
    },
    data() {
        return {
            selectedValue:'',
                selection: { start: Date.now(), end: Date.now() },
                calendarEvents: []

        }
    },
    computed:{
        getOptions(){
            return {
                isDoublePaned:true,
                attrs: [
                    {
                        key: 'today',
                        highlight: {
                            backgroundColor: '#ff8080',
                            // Other properties are available too, like `height` & `borderRadius`
                        },
                        dates: new Date(2018, 0, 1)
                    }
                ],
            }


        },
        options(){
            return {
                selection:this.selection,
                viewCount:2,
                itemClass:function (range) {

                    return 'app-calendar__cell'
                }
            }


        },
        events(){
            return {
                action: function (event) {
                    if (event.eventType==='tap') console.log(event);

                },
            }


        }
    }
}
</script>

<style lang="scss">
    .app-calendar{
        width:100%;
        .calendar {width:100%}
    }
</style>