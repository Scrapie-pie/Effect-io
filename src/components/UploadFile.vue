<template lang="pug">
    div(ref="image",:class="{spinner:!loader}").upload-file

        input(
            v-bind="getInputOptions",
            ref="input",
            v-on="inputListeners",
        ).upload-file__input

        base-btn(
            :icon="{name:'files',textHidden:'Файлы'}",
            @click="$refs.input.click()"
            )

</template>

<script>
import { httpParams, viewModeChat } from '@/mixins/mixins'
export default {
    mixins: [httpParams, viewModeChat],
    inheritAttrs: false,
    props: {
        url: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        value: {
            type: String,
            required: false,
            default: ''
        }
    },

    data() {
        return {
            fileContainer: false,
            file: false,
            loader: true
        }
    },

    computed: {
        setUrl() {
            return this.fileContainer || this.url
        },
        getInputOptions() {
            let obj = {
                name: 'uploadFile',
                value: this.value,
                type: 'file',
                accept: this.allowedFiles,
                disabled: this.disabled
            }
            return Object.assign({}, this.$attrs, obj)
        },
        inputListeners: function() {
            var vm = this

            return Object.assign({}, this.$listeners, {
                /*   change: function(event) {
                    console.log(event);
                    vm.uploadIMG(event, 'fileContainer')
                }*/
            })
        }
    },
    mounted() {
        this.$refs.input.addEventListener(
            'change',
            event => {
                this.uploadIMG(event, 'fileContainer')
            },
            false
        )
        this.addEvents({
            fileContainer: this.$refs.image,
            dragDrop: document.querySelector('.js-dragDrop')
        })
    },
    methods: {
        uploadFile() {
            const formData = new FormData()

            formData.append('file', this.file, this.file.name)

            this.loader = false

            return this.$http
                .post('upload/upload/message-file', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(({ data }) => {
                    this.loader = true

                    this.$emit('upload', data.data)
                    this.$emit('input', data.data.link)
                    this.clear()
                })
                .catch(() => (this.loader = true))
        },

        addEvents(dropzones) {
            for (let dropzone in dropzones) {
                dropzones[dropzone].ondrop = e => {
                    e.preventDefault()
                    console.log('ondrop ')
                    e.target.closest('.js-dragDrop').classList.remove('drag-over')

                    this.uploadIMG(e, dropzone)
                }

                dropzones[dropzone].ondragover = e => {
                    console.log(e.target)
                    e.preventDefault()
                    e.dataTransfer.effectAllowed = 'copyMove'

                    let file = e.dataTransfer.items[0]

                    if (this.checkFileSize(file)) {
                        e.dataTransfer.dropEffect = 'copy'
                        e.target.closest('.js-dragDrop').classList.add('drag-over')
                    } else {
                        e.dataTransfer.dropEffect = 'none'
                        e.target.closest('.js-dragDrop').classList.add('drag-error')

                        this.$root.$emit('popup-notice', 'Размер превышает 5мб')
                    }
                }

                dropzones[dropzone].ondragleave = e =>
                    e.target.classList.remove('drag-over', 'drag-error')
            }
        },
        checkFileSize(file) {
            if (file.size > 5120000) return false
            return true
        },
        uploadIMG(event, type, check = true) {
            console.log(event, type)
            this.$emit('input', this.fileContainer)

            let file

            if (event instanceof Blob) file = [event]
            else file = event.target.files || event.dataTransfer.files

            this.file = file[0]

            if (check && !this.checkFileSize(file[0]))
                return this.$root.$emit('popup-notice', 'Размер файла превышает 5мб')

            this.createIMG(file[0], type)
        },
        createIMG(file, type) {
            this[type] = URL.createObjectURL(file)
            this.uploadFile()
            if (this.loader === false) this.loader = true
        },
        clear() {
            this.$refs.input.value = ''
            this.fileContainer = null
            this.file = null
        }
    }
}
</script>

<style lang="scss">
.upload-file {
    &.drag-over:before {
        visibility: visible;
        opacity: 1;
    }

    &__input {
        @extend %visuallyhidden;
    }
}
</style>
