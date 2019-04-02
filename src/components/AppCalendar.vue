<template lang="pug">
    form.app-calendar(@submit.prevent="send")
        v-date-picker(
            v-bind="getOptions"
            v-on="getEvents",
            v-model="selectedDay"
            )
        ul.app-calendar__times(v-if="dates")
            li.app-calendar__time
                .app-calendar__time-text(v-text="'C '+dates.date_to")
                base-field.app-calendar__field(
                        type="time"
                        name="time_from",
                        :step="60*1"
                        v-model="time_from",
                        :max="time_to"

                    )
            li.app-calendar__time
                .app-calendar__time-text(v-text="'По '+dates.date_from")
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
            time_from:'00:00',
            time_to:'23:59',

        }
    },
    computed:{
        getOptions(){
            return {

                tintColor:this.globColor('info'),


                themeStyles:{
                    wrapper:null,
                    verticalDivider:null,
                    headerTitle:{
                        fontSize:'19px',
                        fontWeight:700,
                        color:this.globColor('main'),
                        textTransform:'capitalize'
                    },


                },
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
                        bar: {
                            backgroundColor: this.globColor('disabled'),
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
        dates(){
            let val = this.selectedDay;
            let date_from,date_to;
            if(val && val.end && val.start) {
                date_from = this.formatDate(val.end)
                date_to = this.formatDate(val.start)
                return {
                    date_from,
                    date_to,
                    time_from:this.time_from,
                    time_to:this.time_to
                }
            }


        }
    },

    methods:{
        globColor(nameColor){
            return getComputedStyle(document.body).getPropertyValue(`--color-${nameColor}`)
        },
        send(){
            this.$emit('get',this.dates)
        },
        formatDate(val){
            let today = val;
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            return dd + '.' + mm + '.' + yyyy;
        }
    }
}
</script>

<style lang="scss">
    .app-calendar{
        $color_select:glob-color('info-light');
        padding-left:calc-em(15);
        padding-right:calc-em(15);
        .c-day-popover .c-day-background {
            //background-color:$color_select!important;
        }



        &__times {
            display:flex;
            align-items:center;
            margin-top:calc-em(15);
            @extend %row-flex
        }
        &__time {
            display:flex;
            align-items:center;
            &_btn {
                flex:1;
                .btn {width:100%}
            }
        }

        &__time-text {
            @extend %h4;
            margin-bottom:0;
            white-space:nowrap;
            margin-right:calc-em(10);
        }

        &__field {
            min-width:auto;
            .field__input {
                width:6em;
                padding:calc-em(5);
                text-align:center;
            }

        }
    }

</style>