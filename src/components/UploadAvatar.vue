<template lang="pug">
    label(ref="image",:class="{spinner:!loader}").upload-avatar
        input(
            v-bind="getInputOptions",
            ref="input",
            v-on="inputListeners",
        ).upload-avatar__input
        base-avatar(width="lg" :url="fileContainer").upload-avatar__avatar
        button( v-if="fileContainer", type="button" @click="clear").upload-avatar__clear удалить фото
        .upload-avatar__text(v-if="!fileContainer") Загрузить фото

        .upload-avatar__text(v-else) Удалить фото

        base-icon.upload-avatar__icon(name="down")

</template>

<script>

    export default {
        inheritAttrs: false,
        props: {
            disabled: {
                required: false,
                default: false
            },
            value: {
                required: false,
                default: ''
            }
        },

        data () {
            return {
                fileContainer: false,
                file: false,
                loader: true,
                allowedFiles: ['image/gif', 'image/png', 'image/jpeg', 'image/jpg']
            }
        },

        computed: {
            getInputOptions() {
                let obj = {
                    name:"uploadAvatar",
                    value:this.value,
                    type:"file",
                    accept:this.allowedFiles,
                    disabled:this.disabled
                }
                return Object.assign({}, this.$attrs, obj);
            },
            inputListeners: function () {
                var vm = this

                return Object.assign({},
                    this.$listeners,
                    {
                        change: function (event) {
                            vm.uploadIMG(event, 'fileContainer');
                        }
                    }
                )
            }
        },
        mounted () {
            this.addEvents({
                fileContainer: this.$refs.image
            })
        },
        methods: {
            uploadFile() {
                const formData = new FormData()

                formData.append('file', this.file, this.file.name)

                this.loader = false;

                return this.$http.post('upload-avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(({data})=>{

                    this.loader = true;

                    this.$emit('input', data.file)

                }).catch(()=>this.loader = true)
            },

            addEvents (dropzones) {
                for (let dropzone in dropzones) {
                    dropzones[dropzone].ondrop = (e) => {
                        e.preventDefault()
                        e.target.classList.remove('drag-over')
                        this.uploadIMG(e, dropzone)
                    }

                    dropzones[dropzone].ondragover = (e) => {
                        e.preventDefault()
                        e.dataTransfer.effectAllowed = 'copyMove'

                        let file = e.dataTransfer.items[0]

                        if (this.allowedFiles.includes(file.type) && this.checkFileSize(file)) {
                            e.dataTransfer.dropEffect = 'copy'
                            e.target.classList.add('drag-over');

                        } else {
                            e.dataTransfer.dropEffect = 'none'
                            e.target.classList.add('drag-error')

                            this.$root.$emit('popup-notice','Тип файла не поддерживается или размер превышает 5мб');

                        }
                    }

                    dropzones[dropzone].ondragleave = (e) => e.target.classList.remove('drag-over', 'drag-error')
                }
            },
            checkFileSize (file) {
                if (file.size > 5120000) return false
                return true
            },
            uploadIMG (event, type, check = true) {
                console.log(event,type);
                this.$emit('input', this.fileContainer);

                let file;

                if (event instanceof Blob) file = [event];
                else file = event.target.files || event.dataTransfer.files;

                this.file = file[0];

                if (check && !this.checkFileSize(file[0])) return this.$root.$emit('popup-notice','Размер файла превышает 5мб');

                console.log('file.type',file[0].type);
                if (this.allowedFiles.includes(file[0].type)) this.createIMG(file[0], type);

                else this.$root.$emit('popup-notice','Тип файла не поддерживается')
            },
            createIMG (file, type) {
                this[type] = URL.createObjectURL(file);
                this.uploadFile()
                if (this.loader === false) this.loader = true
            },
            clear () {
                this.$refs.input.value = '';
                this.fileContainer = null;
                this.file = null;
            },



        }

    }
</script>

<style lang="scss">
    .upload-avatar{
        position:relative;

        display:inline-flex;
        border:0;
        padding:0;
        background:none;

        align-items:center;

        &::before {
            content:'';
            @extend %full-abs;
            margin:-1em;
            border:1px dashed glob-color('success');
            transition:$glob-trans;
            opacity:0;
            visibility:hidden;
        }

        &.drag-over:before {visibility:visible;opacity:1}

        &__input {
            @extend %visuallyhidden
        }

        &:hover &__text{text-decoration:none}

        &__clear {
            @extend %full-abs;
            width:100%;
            opacity:0;
        }

        &__text{
            background:none;
            border:0;
            padding:0;
            transition:$glob-trans;
            text-decoration:underline;
            font-size:$glob-font-size_h2;
            margin-left:calc-em(15);
            margin-right:calc-em(10);
        }

        &__icon {
            .icon {
                width:35px;
                height:35px;
            }
        }

    }
</style>