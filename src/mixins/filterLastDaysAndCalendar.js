
export default {
    data(){
        return {
            showCalendar:false,
            date_from:'',
            date_to:'',
            time_from:'',
            time_to:'',
            last_days:'',
        }
    },


    methods:{
        filterLast_days(val){
            console.log('filterLast_days',val);
            if (val==='-1') {

                this.showCalendar=true;
                this.last_days='';
                this.date_from = '';
                this.date_to = '';
                this.time_from = '';
                this.time_to = '';

            }
            else {
                this.last_days=val;
                this.showCalendar=false;
                this.date_from = '';
                this.date_to = '';
                this.time_from = '';
                this.time_to = '';
            }
        },
        filterCalendar(val){
            console.log('filterCalendar',val);
            this.last_days='';
            this.date_from = val.date_from;
            this.date_to = val.date_to;
            this.time_from = val.time_from;
            this.time_to = val.time_to;

            //this.tempDates=[this.date_from,this.date_to,this.time_from,this.time_to]
        },
    },

}


