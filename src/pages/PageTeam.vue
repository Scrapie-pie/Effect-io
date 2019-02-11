<template lang="pug">
    article.page-team
        .page-team__content
            .page-team__controls
                .page-team__control
                    base-field(
                    type="search"
                    name="search",
                    placeholder="Поиск по имени..."
                    theme="soft"
                    v-model="search"
                    )
                .page-team__control(v-if="viewAdmin")
                    base-btn(name="add" color="success-dark" size="lg") Добавить сотрудника

            table.table
                thead.table__thead
                    tr.table__tr
                        th.table__td.table__td_th Имя
                        th.table__td.table__td_th
                        th.table__td.table__td_th Контакты
                        th.table__td.table__td_th Отдел
                        th.table__td.table__td_th(v-if="viewAdmin") Активен
                        th.table__td.table__td_th(v-if="viewAdmin") Досупные действия
                tbody.table__tbody(v-for="(item, index) in operatorListSearch", :key="item.id")
                    tr.table__tr
                        td.table__td
                            base-people(
                                type="operator",
                                :text="item.statusText",
                                :name="item.fullName",
                                :avatar-url="item.avatar"
                            )
                        td.table__td
                            base-btn() Начать диалог

                        td.table__td
                            a(
                                v-if="!item.phones.type",
                                :href="`tel:${item.phones.phone}`"
                                v-text="item.phones.phone"
                            )
                            a(
                                v-else
                                href="javascript:"
                                v-text="item.phones.sip"
                            )
                            br
                            a(:href="`mailto:${item.mail}`" v-text="item.mail")
                        td.table__td
                            ul.page-team__branch
                                li.page-team__branch-item(v-for="(branch, index) in item.branches_ids", :key="branch" v-text="item.branches_names[index]")

                        td.table__td(v-if="viewAdmin")
                            base-radio-check(
                                v-if="anotherProfile(item.id)"
                                :name="'userIsActive'+item.id",
                                :checked="item.active"  @click="changeActiveOperator(item)"
                            )
                        td.table__td(v-if="viewAdmin")
                            context-menu
                                base-btn(:icon="{name:'edit',box:true,textHidden:'Открыть меню'}" color="info-lighten")
                                template(slot="listItem")
                                    router-link.context-menu__link(:to="{name:'settingsProfile',query: { user_id: item.id }}") Редактировать

        base-no-found(v-if="operatorList.length<=1" name="team")




        //table.table
            thead.table__thead
                tr.table__tr
                    th.table__td.table__td_th Имя
                    th.table__td.table__td_th Прикреплен сотрудник
                    th.table__td.table__td_th Контакты
                    th.table__td.table__td_th Регион
            tbody.table__tbody
                tr
                    td.table__td
                        base-people(type="operator" text="онлайн" name="Зеленков Александр")
                    td.table__td Вы можете начать диалог
                    td.table__td +7 (921) 656-66-77, mail@mail.ru
                    td.table__td Россия, Свердловская область, Екатеринбург

</template>

<script>
    import ContextMenu from '@/components/ContextMenu'


    export default {
        components: {
            ContextMenu
        },
        data() {
            return {
                count:0,
                search: '',
                active:1,
            }
        },
        computed:{

            viewAdmin(){
                return  this.$store.getters['user/profile'].role_id === 13 || this.$store.getters['user/profile'].role_id === 5 //либо админ либо владелец
            },
            operatorList(){
                console.log(this.$store.getters['operators/all']);
                return this.$store.getters['operators/all']
            },
            operatorListSearch(){
                let list = this.operatorList

                list = list.filter(item => {
                    var regexp = new RegExp(this.search, 'ig')

                    if (item.fullName.match(regexp) == null) return 0
                    return true
                })
                console.log(list)
                // console.log(list);
                return list
            }
        },
        methods:{
            anotherProfile(user_id){
                return  user_id !== this.$store.getters['user/profile'].user_id
            },
            changeActiveOperator(operator){
                let active = operator.active? 0:1,
                    data = {
                        mail:operator.mail,
                        first_name:operator.first_name,
                        user_id:operator.id,
                        active:active
                    }
                console.log(data);


                this.$http.post('user-update', data).then(({data})=>{
                    console.log(data.data);
                })

            }
        }

    }
</script>

<style lang="scss">
    .page-team{


        &__controls{
            display:flex;
            align-items:center;
            margin-bottom:calc-em(50);
        }
        &__control{
            margin-right:calc-em(40);
        }

    }


</style>