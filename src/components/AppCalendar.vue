<template lang="pug">

        //calendar-range(v-bind="options" v-on="events").app-calendar
        //v-calendar(
            v-bind="getOptions"
            v-model="selectedDay"
            v-on="getEvents"
            )
        v-date-picker(
            v-bind="getOptions"
            v-on="getEvents",
            v-model="selectedDay"
            )

</template>

<script>

    import { setupCalendar, Calendar,DatePicker} from 'v-calendar'
    import 'v-calendar/lib/v-calendar.min.css';

    // Remember to setup calendar (passing in defaults if needed)
    setupCalendar({
        //firstDayOfWeek : 2
    });
export default {
    name: "app-calendar",
    components:{
        'v-calendar':Calendar,
        'v-date-picker':DatePicker,

    },

    data() {
        return {
            selectedDay:null,


        }
    },
    computed:{
        getOptions(){
            return {
                isInline:true,
                showDayPopover:false,
                isDoublePaned:true,
                isLinked:true,
                //showLinkedButtons:true,
                mode:'range',
                showCaps:true,
                attributes: [
                    {
                        key: 'today',
                        highlight: {
                            backgroundColor: '#ff8080',
                            // Other properties are available too, like `height` & `borderRadius`
                        },
                        dates: new Date()
                    }
                ],
            }


        },

        getEvents(){
          /*  return {

                dayclick:(day) =>{
                    console.log(day);
                    this.selectedDay=day;
                }
            }*/
        },

    },
    watch:{
        selectedDay(val){
            if(val.end && val.start) {
                let date_from = this.formatDate(val.end)
                let date_to = this.formatDate(val.start)

                this.$emit('get',{date_from,date_to})
            }

        }
    },
    methods:{
        formatDate(val){
            let today = val;
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            return mm + '.' + dd + '.' + yyyy;
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