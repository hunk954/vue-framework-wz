<template>
    <div class="login-container" style="background-color: #141a48;margin: 0px;overflow: hidden;">
    <div id="canvascontainer" ref='can'></div>

    <Form ref="loginForm" autoComplete="on" :model="loginForm" :rules="loginRules"  class="card-box login-form">
        <img src="static/img/logo.png" style="width:50px;">
        <img src="static/img/font.png" style="width: 180px;">
        <Form-item prop="account">
            <Input type="text" v-model="loginForm.account" placeholder="请输入用户名或邮箱" autoComplete="on" :disabled="loading">
                <Icon type="ios-person-outline" slot="prepend" ></Icon>
            </Input>
        </Form-item>
        <Form-item prop="password">
            <Input type="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="handleLogin" :disabled="loading">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
        </Form-item>
            <div id="loginTips" style="color:red; text-align: center;">
            </div>
            <Button type="primary" @click="handleLogin('loginForm')" long :loading="loading">登录</Button>
            <br></br>
            <Button type="default" @click="gotoRegister()" long :disabled="loading">注册</Button>
            <div class='tips'>测试账号为: 415391519@qq.com 密码Junhuan123</div>
       </Form>

    </div>
</template>

<script>
    export default {
      name: 'login',
      data() {
        const validateAccount = (rule, value, callback) => {
            document.getElementById('loginTips').innerText = "";
            console.log("value: ", value+'xx');
            if(value.length === 0){
                callback(new Error("请输入正确的用户名或邮箱"));
            }
            else{
                callback();
            }
        };
          const validatePassWord = (rule, value, callback) => {
              document.getElementById('loginTips').innerText = "";
              if (value.length === 0) {
                  callback(new Error('请输入密码'));
              } else {
                  callback();
              }
          };
          return {
              loginForm: {
                  account: '415391519@qq.com',
                  password: ''
              },
              loginRules: {
                  account: [
                      { required: true, trigger: 'blur', validator: validateAccount }
                  ],
                  password: [
                      { required: true, trigger: 'blur', validator: validatePassWord }
                  ]
              },
              loading: false,
              showDialog: false
          }
      },
        mounted () {
            container = document.createElement( 'div' );
            this.$refs.can.appendChild( container );

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
            camera.position.z = 1000;

            scene = new THREE.Scene();

            particles = new Array();

            var PI2 = Math.PI * 2;
            var material = new THREE.ParticleCanvasMaterial( {

                color: 0x0078de,
                program: function ( context ) {

                    context.beginPath();
                    context.arc( 0, 0, 1, 0, PI2, true );
                    context.fill();

                }

            } );

            var i = 0;

            for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

                for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                    particle = particles[ i ++ ] = new THREE.Particle( material );
                    particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
                    particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
                    scene.add( particle );

                }

            }

            renderer = new THREE.CanvasRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            //

            window.addEventListener( 'resize', onWindowResize, false );

            animate();
        },
        methods: {
            gotoRegister(){
                this.$router.push({path:"/register"});
                this.$router.go(0);
            },
            async handleLogin() {
                // 检验输入的正确性
                let validateRes = await this.$refs.loginForm.validate();
                if(validateRes === false){
                    return ;
                }
                this.loading = true;
                // 向后端请求查看是否发送正确
                this.$store.dispatch('Login', this.loginForm).then(resp=>{
                    console.log("前端看看: ", resp);
                    if(resp.data.status !== 0){
                        document.getElementById("loginTips").innerText = "账号或密码出错";
                    }else{
                        console.log("login token: ", this.$store.getters.token);
                        this.$Message.success('登录成功');
                        this.$router.push({ path: '/' });
                    }
                }).catch(err => {
                    document.getElementById("loginTips").innerText = "网络出错";
                    this.$Message.error(err);
                    console.log('err:', err);
                }).finally(()=>{
                    this.loading = false;
                })

                // this.$refs.loginForm.validate(valid => {
                //     if (valid) {
                //         this.loading = true;
                //         this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
                //             this.$Message.success('登录成功');
                //
                //             this.loading = false;
                //             this.$router.push({ path: '/' });
                //         }).catch(err => {
                //             this.$message.error(err);
                //             this.loading = false;
                //         });
                //     } else {
                //         console.log('error submit!!');
                //         return false;
                //     }
                // });
            },
        },
    }

    var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

    var container;
    var camera, scene, renderer;

    var particles, particle, count = 0;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;


// animate();

    function init() {

  

}

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

//

    function onDocumentMouseMove( event ) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

    }

    function onDocumentTouchStart( event ) {

        if ( event.touches.length === 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;

        }

    }

    function onDocumentTouchMove( event ) {

        if ( event.touches.length === 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;

        }

    }

//

    function animate() {

        requestAnimationFrame( animate );

        render();


}

    function render() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;
        camera.lookAt( scene.position );

        var i = 0;

        for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

                particle = particles[ i++ ];
                particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
                particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;

            }

        }

        renderer.render( scene, camera );

        count += 0.1;

    }
</script>
<style>
    .login-container a{color:#0078de;}
    #canvascontainer{
        position: absolute;
        top: 0px;
    }
    .wz-input-group-prepend{
        background-color: #141a48;
        border: 1px solid #2d8cf0;
        border-right: none;
        color:  #2d8cf0;
    }

</style>

<style rel="stylesheet/scss" lang="scss">
    .tips{
        font-size: 14px;
        color: #fff;
        margin-bottom: 5px;
    } 
    .login-container {
        height: 100vh;
        background-color: #2d3a4b;

        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        input {
            background: transparent;
            border: 1px solid #2d8cf0;
            -webkit-appearance: none;
            border-radius: 3px;
            padding: 12px 5px 12px 15px;
            color: #eeeeee;
            height: 47px;
        }
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: #889aa4;
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: #eeeeee;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

        .forget-pwd {
            color: #fff;
        }
    }

</style>
