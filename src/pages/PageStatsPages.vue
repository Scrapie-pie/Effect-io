<template lang="pug">
    the-layout-table
        base-filter-search(
            slot="control"
            placeholder="Введите url",
            :item-list="bodyList",
            @result="(val)=>filterSearchResult=val",
            @text="(val)=>search=val",
            fieldName="url"
        )
        base-field(
            slot="control"
            type="select"
            name="period",
            :selectOptions="{label:'name',options:periodList,value:period}"
            v-model="period"
        )
        base-table
            thead: tr: th(v-for="(item, index) in headList" :key="index" v-text="item")
            tbody
                tr(v-for="(item, index) in filterSearchResult" :key="index")
                    td: a(:href="item.url" v-text="item.url" target="_blank")
                    td(v-text="item.middling_ratings")
                    td(v-text="item.dialogues_transfer")
</template>

<script>

import TheLayoutTable from '@/components/TheLayoutTable'
import branchesBr from '@/modules/branchesBr'

export default {
    components:{TheLayoutTable},
    filter:{
        branchesBr
    },
    created(){
        this.$http.get('statistic-get-by-params',this.requestData).then(({data})=>{
            console.log(data);
            //this.bodyList = data
        })
    },
    data() {
        return {
            filterSearchResult:[],
            branch_id:null,
            periodList:[
                {val:'day',name:'За день'},
                {val:'month',name:'За месяц'},
                {val:'quarter',name:'За квартал'},
                {val:'year',name:'За год'},
            ],
            period:{
                val:'day',name:'За день',
            },
            type:'branches',

            headList:[
                'URL',
                'Получено диалогов',
                'Процент от общего количества обращений (%)'
            ],
            bodyList:[
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://reg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                },
                {
                    url:'https://beg.ru',
                    middling_ratings:'222',
                    dialogues_transfer:'50%'
                }
            ],

        }
    },
    computed:{
        requestData(){
            return {params:this.params}
        },
        params(){
            return {
                user_id:this.$store.state.user.profile.id,
                period:this.period.val,
                type:this.type
            }
        },
    }
}
</script>

<style lang="scss">
    .page-stats{}
</style>