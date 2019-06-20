<template lang="pug">
        form.chat-main-footer.js-dragDrop

            ///the-chat-system-messages

            TheProcessActions(v-if="compShowProcess")
            fieldset.chat-main-footer__fieldset(v-else)
                .chat-main-footer__box-control
                    box-controls(v-if="showMention", @boxControlClose="showMention=false")
                        select-operators(name="mention")
                    box-controls(v-if="showPhrases", @boxControlClose="showPhrases=false")
                        the-phrases-ready
                    box-controls(v-if="showSmiles", @boxControlClose="showSmiles=false")
                        //the-files-board(name="smiles", @getSmile="setMessageSmile")
                        the-board-smile(@getSmile="setMessageSmile", @result="setTextWidthSmiles")
                    //box-controls(v-if="showGifs", @boxControlClose="showGifs=false")
                        the-files-board(name="gifs")
                    box-controls(v-if="showOffer", @boxControlClose="showOffer=false")
                        the-offer()
                    box-controls(v-if="spellingShow", @boxControlClose="spellingShow=false;getPhrasesSelectText(spellingResultMessage)").chat-main-footer__the-spelling-form
                        TheSpellingForm(
                            :list="spellingList",
                            :message="spellingMessage",
                            @ignoredWords="val=>spellingIgnoredWords=val",
                            @resultMessage="(val)=>spellingResultMessage=val"
                        )

                .chat-main-footer__contols
                    .chat-main-footer__textarea-wrap
                        the-phrases-select(
                            v-if="viewModeChat==='visitors'",
                            :filter-search="message" ,
                            @resultText="getPhrasesSelectText"
                        ).chat-main-footer__phrases-select

                        scroll-bar.chat-main-footer__scrollbar(ref="scrollbarMessage")
                            div(
                                @keydown.enter.exact="onEnter",
                                @click.prevent="messageRead"
                                )

                                input-emoji(
                                    :text="textWidthSmiles",
                                    @caret="val=>textCaret=val",
                                    @getText="val=>message=val"

                                )
                            textarea.chat-main-footer__input(
                                placeholder="Enter - отправить сообщение, Shift+Enter - новая строка."
                                ref="chatInput",
                                v-model="message",
                                @keydown.enter.exact="onEnter",
                                @click.prevent="messageRead"

                                )
                            upload-file-list(
                                :item-list="uploadFileList",
                                @itemRemove="(index)=>uploadFileList.splice(index, 1)"
                            )
                ul.chat-main-footer__buttons
                    //li.chat-main-footer__button(v-if="viewModeChat=='common'")
                        base-btn(
                            :icon="{name:'user',textHidden:'Упомянуть в диалоге'}",
                            @click.prevent="showMention=true"
                        )
                    li.chat-main-footer__button(v-if="viewModeChat=='visitors'")
                        base-btn(
                            :icon="{name:'phrases',textHidden:'Список готовых шаблонных фраз'}",
                            @click.prevent="showPhrases=true"
                        )
                    li.chat-main-footer__button.chat-main-footer__button_offer(v-if="viewModeChat=='visitors'")
                        base-btn(
                            :icon="{name:'more-fill',textHidden:'Предложить посетителю'}",
                            @click.prevent="showOffer=true"
                        )
                    li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'smiles',textHidden:'Смайлы'}"
                            @click.prevent="showSmiles=true"
                        )
                    li.chat-main-footer__button
                        upload-file(@upload="(val)=>uploadFileList.push(val)")
                    //li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'gifs',textHidden:'Гифки'}"
                            @click.prevent="showGifs=true"
                        )
                    li.chat-main-footer__button(v-if="viewModeChat=='visitors'")
                        base-radio-check(name="spellingCheck" v-model="spellingCheck") Проверка орфографии
                    li.chat-main-footer__button.chat-main-footer__button_send

                        base-btn.chat-main-footer__send(

                            @click="send",
                            :icon="{name:'send',textHidden:'Отправить сообщение'}"
                        )

</template>

<script>

    import SelectOperators from '@/components/SelectOperators'
    import TheOffer from '@/components/TheOffer'
    import TheFilesBoard from '@/components/TheFilesBoard'
    import TheBoardSmile from '@/components/TheBoardSmile'
    import ThePhrasesReady from '@/components/ThePhrasesReady'
    import ThePhrasesSelect from '@/components/ThePhrasesSelect'
    import TheProcessActions from '@/components/TheProcessActions'
    import UploadFile from '@/components/UploadFile'
    import UploadFileList from '@/components/UploadFileList'
    import inputEmoji from '@/components/inputEmoji';
    import TheSpellingForm from '@/components/TheSpellingForm';


    import lodash_split from 'lodash/split'

    import autosize from 'autosize'
    import { viewModeChat,httpParams,spelling } from '@/mixins/mixins'

    export default {
        components:{
            SelectOperators,
            TheOffer,
            TheFilesBoard,
            ThePhrasesReady,
            ThePhrasesSelect,
            TheProcessActions,
            UploadFile,
            UploadFileList,
            TheBoardSmile,
            inputEmoji,
            TheSpellingForm
        },
        mixins:[viewModeChat,httpParams,spelling],
        watch:{
            '$route' (to, from) {
                this.checkIsProcessPage();
            },
            message(val){

                if(val && this.autosizeInit){
                    autosize(this.$refs.chatInput);
                    this.autosizeInit=false;
                }
                if(val && this.showPhrasesSelectAllow){

                    this.showPhrasesSelect=true;
                }
            },
            uploadFileList(val){

            },

        },

        data() {
            return {
                autosizeInit:true,
                showMention:false,
                showProcess:false,
                showGifs:false,
                showOffer:false,
                showSmiles:false,
                showPhrases:false,


                textWidthSmiles:'',
                textCaret:null,

                showPhrasesSelect:false,
                showPhrasesSelectAllow:true,
                message:'',
                uploadFileList:[],
                bufferingSend:false,


            }
        },
        computed:{
            compShowProcess(){
                return this.showProcess
            }
        },
        mounted() {
        },
        beforeDestroy(){
            autosize.destroy(this.$refs.chatInput);
        },
        created() {
            this.checkIsProcessPage()
        },
        methods: {
            textWidthTagToText(){
                let ct = document.getElementById('contenteditable');


                let listText=[]
                ct.childNodes.forEach((item,index)=>{
                    if(item.nodeName == 'BR'){
                        listText[index] = '\n'
                    }
                    else if(item.nodeName == 'IMG'){
                        listText[index] = item.attributes.alt.value
                    } else {
                        listText[index]=item.textContent
                    }
                })
                console.log(listText);
                listText = listText.join('');
                console.log(listText);
                ct.innerText='';

                return listText
            },
            setTextWidthSmiles({emoji}){
                this.textWidthSmiles='';
                let text = this.textWidthTagToText()
                setTimeout(()=>{
                    console.log(this.textCaret);

                    let textMas = lodash_split(text,'')
                    let textMasFinish = this.textCaret
                    for(let i=0;i<textMasFinish;i++){
                        console.log(textMas[i]);
                        if(textMas[i].length > 1) {this.textCaret+=1;
                            console.log(this.textCaret,'sm');
                        }
                    }

                    let str_left=text.substring(0,this.textCaret);
                    let str_right=text.substr(this.textCaret);
                    console.log('str_left, str_right',str_left, str_right);
                    this.textWidthSmiles = str_left + emoji + str_right

                },1)

            },
            setMessageSmile(emoji){
                const textarea = this.$refs.chatInput;
                const cursorPosition = textarea.selectionEnd;
                const start = this.message.substring(0, textarea.selectionStart)
                const end = this.message.substring(textarea.selectionStart)

                this.message=start + emoji.native + end;
                textarea.focus();
                this.$nextTick(() => {
                    textarea.selectionEnd = cursorPosition + emoji.native.length
                })
            },
            getPhrasesSelectText(val){
                autosize.destroy(this.$refs.chatInput);
                this.message=val;


                this.textWidthSmiles='';
                this.textWidthTagToText()
                setTimeout(()=>{
                    this.textWidthSmiles = val
                    setTimeout(()=>{
                        this.$refs.chatInput.focus()
                    },100)
                },1)

                setTimeout(()=>{ //Todo костыль
                    autosize(this.$refs.chatInput);
                    this.$refs.scrollbarMessage.update()
                },300)
            },
            messageRead(){
                if(this.viewModeChat ==='operators') {
                    this.$http.put('message/operator-mark-as-read', {
                        user_id:this.httpParams.params.id
                    });
                    this.$store.dispatch('setMessageRead', {
                            id:this.httpParams.params.id,
                            type:this.viewModeChat
                        }
                    );
                } //Todo у оператора
                if(this.viewModeChat ==='visitors'){
                    this.$http.put('message/operator-mark-as-read', {
                        room_id:this.$store.state.roomActiveId
                    });
                    this.$store.dispatch('setMessageRead', {
                            uuid:this.httpParams.params.uuid,
                            site_id:this.httpParams.params.site_id,
                            type:this.viewModeChat
                        }
                    );
                }
                if(this.viewModeChat ==='common'){
                    this.$http.put('message/operator-mark-as-read', {
                        room_id:this.$store.state.user.profile.common_room_id
                    });

                    this.$store.commit('user/unreadUpdate',['common','clear'])
                }
            },
            onEnter: function (e) {
                //if(this.bufferingSend) return
                e.stopPropagation();
                e.preventDefault();
                e.returnValue = false;
                this.input = e.target.value;
                this.send();
                this.messageRead()
            },

            send(){


                this.message = this.textWidthTagToText()


                let data = {},
                    to_id,
                    files=[],
                    body = this.message;


                if(this.uploadFileList.length) {
                    files = this.uploadFileList.map(item=>{

                        item.name=item.src.name;
                        delete item.src
                        return item
                    })


                }

                if (!body && !files.length) return
                if(this.bufferingSend) return
                this.bufferingSend=true;

                if(this.viewModeChat==="visitors") {

                 let {guest_uuid,site_id} = this.httpParams.params;

                    data = {
                        guest_uuid,
                        site_id,
                        delivery_status:0,
                    }

                    let val = this.httpParams.params
                    this.$store.commit('visitors/messageHot',{val,set:false})

                } else if(this.viewModeChat==="operators") {

                    to_id = + this.httpParams.params.id;
                    data = {
                        to_id,
                        delivery_status:1,
                    }

                }
                else if(this.viewModeChat==="common") {
                    data.room_id = this.$store.state.user.profile.common_room_id;
                    data.delivery_status=1;
                }

                data.body=body;
                data.files=files;
                data.spelling=this.spellingCheck;
                data.spelling_ignored_words=this.spellingIgnoredWords;
                this.spellingMessage = this.message



                this.$http.post('message/save', data).then((responsive)=>{
                    this.bufferingSend=false;

                    let {id} = responsive.data.data;

                    let {first_name:name,photo,employee_id} = this.$store.state.user.profile,
                        time = (new Date).getTime() / 1000,
                        message = {

                            id,
                            time,
                            body,
                            files,
                            from_user_info:{
                                id:employee_id,
                                name,
                                photo
                            },
                            delivery_status:data.delivery_status
                        }
                    this.uploadFileList=[]

                    this.$root.$emit('messageAdd',message);

                    message.from_user_info.id = this.$store.state.user.profile.employee_id;

                    if(this.viewModeChat ==='operators') {

                        message.selfId = this.httpParams.params.id;
                        this.$store.commit('operators/messageLastUpdate',message)
                    } //Todo у оператора}

                    if(this.viewModeChat ==='visitors') {

                        message.selfUuid = this.httpParams.params.uuid;
                        message.last_message_author = 'Вы';
                        this.$store.commit('visitors/selfMessageLastUpdate',message)
                    }

                    this.message='';
                    this.spellingIgnoredWords=[]
                    autosize.destroy(this.$refs.chatInput);
                    this.autosizeInit=true;
                    setTimeout(()=>{
                        this.$refs.scrollbarMessage.update()
                    },200)



                }).then(()=>{

                }).catch(({response})=>{
                    if(response.status===400) {
                        this.getPhrasesSelectText(this.spellingMessage)

                        console.log('spellingSuggestions',response.data.spellingSuggestions);
                        this.spellingShowBox(response.data.spellingSuggestions)
                    }
                    this.bufferingSend=false;

                });




            },
            checkIsProcessPage() {
                if(this.viewModeChat ==='process') {
                    this.showProcess = true;
                }
                else this.showProcess = false
            }
        },
    }
</script>

<style lang="scss">
    .chat-main-footer{
        $color_border:glob-color('border');
        $color_bg-send:glob-color('info-lighten');
        $color_success:glob-color('success');

        .icon_phrases {
            fill:#8c8c8c
        }

        position:relative;
        border:1px dashed transparent;
        border-top:1px solid $color_border;
        padding-top:calc-em(20);

        &.drag-over {
            &::after {
                @extend %full-abs;
                border:1px dashed $color_success;
                background:glob-color('light');
                content:'';
                z-index:9;
            }
            &::after {

                content:'Перетащите сюда файлы';
                color:inherit;
                @extend %full-abs;
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:2;
                @extend %h3

            }
        }

        &__fieldset {min-width:0}

        &__scrollbar{
            max-height:7.5em;
        }
        &__input{
            width:100%;
            height:2em;
            line-height:1.5;

            border:0;
            padding:0;
            overflow:hidden !important;
            height:0;
            width:0;
            @extend %visuallyhidden
        }

        &__buttons{
            display:flex;
            align-items:center;
        }

        &__button_offer {
            fill:#cbcfde;
        }

        &__button_send{
            margin-left:auto;
        }

        &__send{
            .icon{
                width:calc-em(45);
                height:calc-em(45);
            }
        }

        &__box-control {
            position:relative;
            z-index:9;
            .box-controls__box {
                @extend %full-abs;
                top:auto;
            }
        }

        &__the-spelling-form {
            .box-controls__box {
                max-width:550px;
            }

        }




    }
</style>