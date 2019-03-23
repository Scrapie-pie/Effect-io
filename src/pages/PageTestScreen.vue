<template lang="pug">
    iframe(src="/screen2.html")
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


                
                function setDomainLink(list,name) {
                    list.forEach((item)=>{
                        let newSrc = item[name].replace(location.origin,'https://click.alfabank.ru')
                        item.setAttribute(name, newSrc)
                        //console.log(item[name]);
                    })
                }
                setDomainLink(document.querySelectorAll('[src]'),'src')
                setDomainLink(document.querySelectorAll('[href]'),'href')
                setDomainLink(document.querySelectorAll('link'),'href');

                scrptsInit()
                
                function scrptsInit() {

                    document.querySelectorAll('script').forEach(item=>{
                        var script = document.createElement('script');
                        script.setAttribute("src",item.src);
                        script.setAttribute("type", "text/javascript");
                        document.getElementsByTagName("head")[0].appendChild(script)
                        console.log(item.src);
                    })


                }

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
            return
            console.log(e.type,e.target);

        }

    },
    created(){
        //this.htmlSet()
    }

}
</script>

<style lang="scss" scoped>
    .page-test-screen{}
</style>


