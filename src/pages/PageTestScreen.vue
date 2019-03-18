<template lang="pug">
    div
</template>


<script>


export default {




    data() {
        return {
            html:''
        }
    },
    methods:{
        htmlSet(){
            this.$http.get(`screen.html`, {
                baseURL: ''
            }).then(({data}) => {
                document.getElementsByTagName('html')[0].innerHTML = data;
                var a = document.createElement("a");
                 a.text="Назад"
                a.href="/process"

                document.body.appendChild(a);
                setTimeout(()=>{
                    ['mousemove', 'mouseup', 'touchmove', 'mousewheel','keydown'].forEach(event => document.addEventListener(event, this.action));

                },1000)

            })


        },
        action(e){
            console.log(e.type,e.target);

        }

    },
    created(){
        this.htmlSet()
    }

}
</script>

<style lang="scss" scoped>
    .page-test-screen{}
</style>


