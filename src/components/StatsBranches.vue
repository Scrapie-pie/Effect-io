<template lang="pug">
    base-table.stats-branches
        caption(v-if="caption")
            .stats-branches__caption
                .stats-branches__caption-item {{caption}}
                filter-drop-menu.stats-branches__caption-item(
                    v-if="filterBranchIdsOn"
                    name="branch",
                    @get="(val)=>filterBranchIds=val"
                )

        thead
            tr
                th(v-for="(item, index) in headList" :key="index")
                    .stats-branches__head
                        span(v-html="item")
                        |&nbsp;
                        btn-sort(
                            v-if="item",
                            :toggle="compSort[index]",
                            @result="val=>setSortField(val,index)"
                        )

        tbody
            tr(v-for="(item, index) in itemList" :key="item.id")
                td
                    span.h4 {{item.name}}
                    div(v-if="item.operators") сотрудников в отделе: {{item.operators.length}}
                td(v-if="!btnDetailHide")
                    base-btn.base-table__show-hover(
                        padding="xslr"
                        :router="{name:'statsBranchesDetail',params:{id:item.branch_id}}"
                    ) Детальная статистика
                td(v-text="item.dialogues_requests")
                template(v-if="!['dialogues_accepted','dialogues_requests'].includes(order)")
                    template(v-if="!['dialogues_accepted','dialogues_requests'].includes(order)")

                        td
                            span.color_success(v-text="item.dialogues_accepted")
                            span.color_error(v-text="'/'+item.dialogues_missed")
                        td
                            |{{item.first_answer_average_speed | format('time')}}
                        td
                            |{{item.average_guest_time_in_queue | format('time')}}
                        td
                            span.color_success(v-text="item.excellent_ratings")
                            span.color_info(v-text="'/'+item.middling_ratings+'/'")
                            span.color_error(v-text="item.badly_ratings")
                    td(v-else)
                        |{{item[order] | format('percent')}}

</template>

<script>

    const sortDefault = ()=> {return {
        val:[true,false,false,false,false,false,false],
        field:['name','','dialogues_requests','dialogues_accepted','first_answer_average_speed','average_guest_time_in_queue','excellent_ratings']
    }}
    console.log('sortDefault',sortDefault());
    const FilterDropMenu =()=>import('@/components/FilterDropMenu')
    import BtnSort  from '@/components/BtnSort'
import {stats} from '@/mixins/mixins'
    import lodash_sortBy from 'lodash/sortBy'
export default {
    components:{
        FilterDropMenu,
        BtnSort
    },
    mixins:[stats],
    props:{

        filterBranchIdsOn:{
            type:Boolean,
            default:false,
        }
    },

    data() {
        return {
            sortFields:['name','','dialogues_requests','dialogues_accepted','first_answer_average_speed','average_guest_time_in_queue','excellent_ratings'],
            sort:sortDefault(),
            currentSort:{
                val:sortDefault().val[0],
                field:sortDefault().field[0]
            },
            filterBranchIds:[]
        }
    },
    computed:{
        compSort(){
            return this.sort.val
        },
        headList(){
            let list = [
                'Название отдела',
                '',
                'Получено<br>диалогов',
                'Принято/<br>пропущено<br> диалогов',
                'Средняя скорость<br>ответа оператора',
                'Средняе время<br>ожидания <br> в очереди',
                'Оценки',
            ]

            if(this.btnDetailHide) list.splice(1, 1)


            if(this.order==="dialogues_percents") {
                list = [
                    'Название отдела',
                    'Получено диалогов',
                ]
                list.push('Процент от общего количества диалогов (всех отделов)')
            }


            if(['dialogues_accepted','dialogues_requests'].includes(this.order)) {
                list.length=2

            }

            return list
        },
        bodyListFormat(){
            return  lodash_sortBy(
                this.setFilterList.map(item=>{



                    return item
                }),
                [
                    (item)=>{

                        console.log(item);
                        if(this.currentSort.field==='name') {
                            console.log(item[this.currentSort.field].length * (this.currentSort.val ? -1 : 1));
                            return item[this.currentSort.field].length*(this.currentSort.val?-1:1);
                        }
                        else  {
                            console.log(item[this.currentSort.field] * (this.currentSort.val ? -1 : 1));
                            return item[this.currentSort.field]*(this.currentSort.val?-1:1)
                        }
                    }
                ]
            );
        },

        itemListWidthBranchName(){
            return this.bodyList.map(item=>{
                item.branchName=''
                let branch = this.$store.state.user.branchListAll.find(itemSub=>itemSub.id===item.branch_id)
                if(branch) {
                    item.branchName = branch.title
                    item.name = branch.title //base-filter-search сейчас ищет по name
                }
                item.operators = this.$store.getters['operators/all'].filter(itemSub=>itemSub.branches_ids.includes(item.branch_id))

                return item
            })
        },
        setFilterList(){

            if(this.filterBranchIds.length) return this.itemListWidthBranchName.filter(item=>this.filterBranchIds.includes(item.branch_id))
            else return this.itemListWidthBranchName
        }
    },

    methods:{
        setSortField(val,index){
            this.$set(this.sort,'val',sortDefault().val)
            this.$set(this.sort.val,index,val);
            this.currentSort = {
                'val':val,
                'field':this.sort.field[index],

            }
        },
        setCurrentFieldSort(index){

        }
    }
}
</script>

<style lang="scss">
    .stats-branches{
        &__head {
            display:flex;
            align-items:center;
        }
        &__caption {
            @extend %row-flex;
            &-item {
                @extend %row-flex-col;

                &.filter-drop-menu {    font-weight: 400;}
            }
        }
        th:nth-child(1) {
            width:253px;
        }
        th:nth-child(2) {
            width:202px;
        }
    }
</style>

