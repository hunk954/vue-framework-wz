<template>
    <div class="login-container" style="background-color: #141a48;margin: 0px;overflow: hidden;">
        <div id="canvascontainer" ref='can'></div>

        <Form ref="registForm" autoComplete="on" :model="registForm" :rules="loginRules"  class="card-box login-form">
            <img src="static/img/logo.png" style="width:50px;"></img>
            <img src="static/img/font.png" style="width:180px;"></img>
            <Button type="text" style="float:right;color:rgb(170,170,170);" @click="returnToLogin()">返回登录</Button>
            <Form-item prop="account">
                <Input type="text" v-model="registForm.account" placeholder="请输入账号">
                    <Icon type="ios-person-outline" slot="prepend" ></Icon>
                </Input>
<!--                <span id="accountTips" slot="label" style="color:rgb(170,170,170);">用户名为以字母开头，6-18位数字、字母、下划线组合</span>-->
            </Form-item>
            <Form-item prop="password">
                <Input type="password" v-model="registForm.password" placeholder="密码" @keyup.enter.native="handleRegister" @focus="passwdFocus()">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
<!--                <span slot="label" style="color:rgb(170,170,170);">密码为6-18位数字、字母组合，需同时包含大小写字母。</span>-->
            </Form-item>
            <Form-item prop="passwordAgain">
                <Input type="password" v-model="registForm.passwordAgain" placeholder="再次输入密码" @keyup.enter.native="handleRegister" @focus="passwdFocus()">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
            </Form-item>
            <Form-item prop="email">
                <Input id="emailInput" type="text" v-model="registForm.email" placeholder="绑定邮箱，也可用于登录" @keyup.enter.native="handleRegister">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
                <p></p>
                <Button id="validateCodeBtn"
                        style="float: right; background-color: #00B8EC; color:white; border: #00B8EC;"
                        @click="getValidateCode()"
                        :disabled="validateCodeGetDisabled">获取验证码</Button>
            </Form-item>
            <Form-item prop="verifyCode">
                <Input type="text" v-model="registForm.verifyCode" placeholder="邮箱返回的验证码" @keyup.enter.native="handleRegister">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
            </Form-item>
            <Button type="success" @click="handleRegister()" long>注册</Button>
            <br></br>
        </Form>

    </div>
</template>

<script>
    import { isEmail,validateUpperCase, validateLowerCase } from "utils/validate";

    export default {
        name: "login",
        data() {
            const validateAccount = (rule, value, callback) => {
                let reg = /^[a-z][a-z0-9_]{5,17}$/
                if(reg.test(value)){
                    callback();
                }else{
                    callback(new Error("用户名为以字母开头，6-18位数字、字母、下划线组合"));
                }
            }
            // 邮箱的校验规则
            const validateEmail = (rule, value, callback) => {
                value = value.trim();
                if (!isEmail(value)) {
                    callback(new Error("请输入正确的邮箱"));
                } else if(this.registeredEmailList.indexOf(value) !== -1){
                    callback(new Error("该邮箱已被注册"));
                }else{
                    callback();
                }
            };
            // 密码的校验规则
            const validatePass = (rule, value, callback) => {
                let reg = /^[0-9A-Za-z]{6,18}$/;
                let regContainLower = /[a-z]+/;
                let regContainerUpper = /[A-Z]+/;
                if(reg.test(value) && regContainLower.test(value) && regContainerUpper.test(value)){
                    callback();
                }else{
                    callback(new Error("密码为6-18位数字、字母组合，需同时包含大小写字母。"));
                }
            };
            const validateCode = (rule, value, callback) => {
                console.log("this:", this);
                console.log("xx验证码是:", this.verifyCodeFromBackEnd.value);
                if(this.verifyCodeFromBackEnd.expireTime === 0){
                    callback("未获取邮箱验证码");
                }
                if(value.length == 0){
                    callback("请输入邮箱返回的验证码");
                }
                if(this.verifyCodeFromBackEnd.expireTime <= (new Date()).valueOf()){
                    callback("验证码已过期，请重新获取");
                }
                if(value !== this.verifyCodeFromBackEnd.value){
                    callback("验证码不正确");
                }else{
                    callback();
                }
            }
            const validatePassAgain = (rule, value, callback)=>{
                if(value !== this.registForm.password){
                    callback("两次输入的密码不一致");
                }else if(value.trim().length === 0){
                    callback(new Error("密码为6-18位数字、字母组合，需同时包含大小写字母。"));
                }
                else{
                    callback();
                }
            }
            return {
                registForm: {
                    account:"",
                    email: "",
                    password: "",
                    passwordAgain: "",
                    verifyCode: "",
                },
                loginRules: {
                    account: [{required: true, trigger: "blur", validator: validateAccount}],
                    email: [{ required: true, trigger: "blur", validator: validateEmail }],
                    password: [{ required: true, trigger: "blur", validator: validatePass }],
                    verifyCode: [{required: true, trigger: "blur", validator: validateCode}],
                    passwordAgain: [{required: true, trigger: "blur", validator: validatePassAgain}],
                },
                loading: false,
                showDialog: false,
                validateCodeGetDisabled: false,
                verifyCodeFromBackEnd:{
                    value: '',
                    expireTime: 0, // ms级
                },
                countDown: 60, // 验证码获取间隔时间
                verifyCodeExpire: 30*60*1000, // ms
                registeredEmailList: [],
            };
        },
        mounted() {
            // 动画效果
            container = document.createElement("div");
            this.$refs.can.appendChild(container);
            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                1,
                10000
            );
            camera.position.z = 1000;
            scene = new THREE.Scene();
            particles = new Array();
            var PI2 = Math.PI * 2;
            var material = new THREE.ParticleCanvasMaterial({
                color: 0x0078de,
                program: function (context) {
                    context.beginPath();
                    context.arc(0, 0, 1, 0, PI2, true);
                    context.fill();
                },
            });
            var i = 0;
            for (var ix = 0; ix < AMOUNTX; ix++) {
                for (var iy = 0; iy < AMOUNTY; iy++) {
                    particle = particles[i++] = new THREE.Particle(material);
                    particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                    particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
                    scene.add(particle);
                }
            }
            renderer = new THREE.CanvasRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            document.addEventListener("mousemove", onDocumentMouseMove, false);
            window.addEventListener("resize", onWindowResize, false);
            animate();
        },
        created: function(){
            // 后端获取已注册邮箱列表
            let that = this;
            this.$store.dispatch('getRegistedEmail').then(resp=>{
                console.log("getRegistedEmail: ", resp);
                that.registeredEmailList = resp.data.emailArr;
            })
            // this.registeredEmailList.push('41539119@qq.com');
        },
        methods: {
            getValidateCode(){
                // 邮箱语法是否正确
                if(!isEmail(this.registForm.email) || this.registeredEmailList.indexOf(this.registForm.email) !== -1){
                    this.$refs.registForm.validateField('email'); // 通过触发validate去显示错误
                    return;
                }
                // 向后端获取验证码
                let that = this;
                // 再调一次获取已注册邮箱列表，以防止重复注册
                this.$store.dispatch('getRegistedEmail').then(resp=>{
                    that.registeredEmailList = resp.data.emailArr;
                    if(that.registeredEmailList.indexOf(that.registForm.email) !== -1){
                        that.$refs.registForm.validateField('email'); // 通过触发validate去显示错误
                        return;
                    }
                    that.$store.dispatch('getEmailVerifyCode', this.registForm.email).then(resp=>{
                        console.log("获取验证码: ", resp);
                        if(!resp.hasOwnProperty("error")){
                            that.verifyCodeFromBackEnd.value = resp.data.verifyCode;
                            that.verifyCodeFromBackEnd.expireTime = (new Date()).valueOf() + that.verifyCodeExpire; // 30分钟过期
                            let elementBtn = document.getElementById("validateCodeBtn");
                            // 保存原来的字体颜色和背景颜色
                            let oriBackgroundColor = elementBtn.style.backgroundColor;
                            let oriFontColor = elementBtn.style.color;
                            // 置不可按，改样式
                            this.validateCodeGetDisabled = true;
                            elementBtn.style.backgroundColor = "rgb(247, 247, 247)";;
                            elementBtn.style.color = "rgb(200, 200, 200)";
                            // 置倒计时
                            let countdown = this.countDown;
                            elementBtn.innerText = countdown + "秒后重新获取";
                            function setValidateCodeTime(){
                                countdown--;
                                if(countdown <= 0){
                                    elementBtn.style.backgroundColor = oriBackgroundColor;
                                    elementBtn.style.color = oriFontColor;
                                    that.validateCodeGetDisabled = false;
                                    elementBtn.innerText = "获取验证码";
                                }
                                else{
                                    elementBtn.innerText = countdown+"秒后重新获取";
                                    setTimeout(setValidateCodeTime, 1000);
                                }
                            }
                            setTimeout(setValidateCodeTime, 1000);
                        }else{
                            console.log("失败了");
                        }
                    }).catch(err=>{
                        console.log("er:", err);
                        console.log("网络出错");
                    })
                })

            },
            passwdFocus() {
                console.log("focus");
            },
            returnToLogin() {
                console.log("返回登录！");
                this.$router.push({ path: "/login" });
                this.$router.go(0);
            },
            async handleRegister() {
                let validateRes = await this.$refs.registForm.validate();
                if(false === validateRes){
                    return ;
                }
                let that = this;
                this.$store.dispatch('registerRoleInfo',this.registForm).then(resp=>{
                    console.log("注册个人信息：", resp);
                    if(resp.data.status === 0){
                        that.$router.push({path:"/"});
                    }

                })
                console.log("信息全部验证通过");


                // this.$router.push({ path: "/" });
                // console.log("this.$refs: ", this.$refs);
                // console.log("this.$refs.loginForm: ", this.$refs.loginForm);
                // this.$refs.loginForm.validate(valid => {
                //   if (valid) {
                //     this.loading = true;
                //     console.log("this.$store:", this.$store);
                //     this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
                //       this.$Message.success('登录成功');
                //       this.loading = false;
                //       this.$router.push({ path: '/' });
                //     }).catch(err => {
                //       this.$message.error(err);
                //       this.loading = false;
                //     });
                //   } else {
                //     console.log('error submit!!');
                //     return false;
                //   }
                // });
            },
        },
    };

    var SEPARATION = 100,
        AMOUNTX = 50,
        AMOUNTY = 50;

    var container;
    var camera, scene, renderer;

    var particles,
        particle,
        count = 0;

    var mouseX = 0,
        mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    // animate();

    function init() {}

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    //

    function animate() {
        requestAnimationFrame(animate);

        render();
    }

    function render() {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        var i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++];
                particle.position.y =
                    Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
                particle.scale.x = particle.scale.y =
                    (Math.sin((ix + count) * 0.3) + 1) * 2 +
                    (Math.sin((iy + count) * 0.5) + 1) * 2;
            }
        }

        renderer.render(scene, camera);

        count += 0.1;
    }
</script>
<style>
    .login-container a {
        color: #0078de;
    }
    #canvascontainer {
        position: absolute;
        top: 0px;
    }
    .wz-input-group-prepend {
        background-color: #141a48;
        border: 1px solid #2d8cf0;
        border-right: none;
        color: #2d8cf0;
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .tips {
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
