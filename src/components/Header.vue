<template>
    <navbar>
        <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
        <img src="static/img/logo.png" style="width:50px;"></img>
        <img src="static/img/font.png" style="width:180px;"></img>
        <ul class="nav navbar-nav d-md-down-none">
            <li class="nav-item">
                <a class="nav-link navbar-toggler sidebar-toggler"  @click="sidebarMinimize">&#9776;</a>
            </li>

        </ul>

        <ul class="nav navbar-nav ml-auto">



            <Dropdown class="nav-item">
                <a href="javascript:void(0)">
           <span slot="button">
          <img src="static/img/avatars/tt.jfif" class="img-avatar" style="height:35px;" alt="o">
          <span class="d-md-down-none" style="color:white;">{{userName}}</span>
          </span>
                </a>
                <Dropdown-menu slot="list">

                    <Dropdown-item > <a href="" @click="Logout"  ><p  class="dropdown-itemp"><Icon type="power"></Icon>Logout</p></a></Dropdown-item>

                </Dropdown-menu>
            </Dropdown>


            <li class="nav-item d-md-down-none">
                <a class="nav-link navbar-toggler aside-menu-toggler"  @click="asideToggle">&#9776;</a>
            </li>
        </ul>
    </navbar>
</template>
<script>

    import navbar from './Navbar'

    export default {
        data(){
            return{
                userName: this.$store.getters.name,
            }
        },
        name: 'header',
        components: {
            navbar,

        },
        created: function(){
            console.log("header initialize : ", this.$store.getters);
        },
        methods: {
            Logout(e){
                e.preventDefault();
                this.$store.dispatch('LogOut').then(() => {
                    this.$router.push({ path: '/login' });
                }).catch(err => {
                    this.$message.error(err);
                });
            },
            click () {
                // do nothing
            },
            sidebarToggle (e) {
                e.preventDefault()
                document.body.classList.toggle('sidebar-hidden')
            },
            sidebarMinimize (e) {
                e.preventDefault()

                document.body.classList.toggle('sidebar-minimized')
            },
            mobileSidebarToggle (e) {
                e.preventDefault()

                document.body.classList.toggle('sidebar-mobile-show')
            },
            asideToggle (e) {
                e.preventDefault()
                document.body.classList.toggle('aside-menu-hidden')
            }
        }
    }
</script>

<style type="text/css" scoped>
    .dropdown-itemp{
        text-align: left;
        font-size: 15px;
        padding: 10px;
    }
    .header-item .ivu-dropdown-item{
        padding: 15px;
    }
    .header-item{
        width: 130px;
        /*background-color: #20a8d8;*/
        /*background-color: white;*/

        height: 55px;


    }
    .header-item a{
        color:white !important;

    }

</style>
