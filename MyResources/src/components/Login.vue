<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align: center">
                <span>表单</span>
            </div>
            <el-form :model="user" label-position="right" label-width="auto"
                     :rules="rules" hide-required-asterisk>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="user.userName"></el-input>
                </el-form-item>
                <div style="height: 20px;"></div>
                <el-form-item prop="userPassword">
                    <tem slot="label">密&#12288;码</tem>
                    <el-input type="password" v-model="user.userPassword" show-password></el-input>
                </el-form-item>
            </el-form>
            <div style="height: 20px;"></div>
            <div style="width: 200px;margin: 0 auto">
                <el-button type="info" @click="register">注册</el-button>
                <div style="display: inline-block;width: 36px"></div>
                <el-button type="success" @click="login">登录</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            user: {
                userName: '',
                userPassword: ''
            },
            rules: {
                userName: [
                    {required: true, message: '请输入姓名', trigger: 'blur'},
                    {max: 10, message: '长度不可大于10个字符', trigger: 'blur'}
                ],
                userPassword: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 18, message: '长度在6~18个字符之间', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        register() {
            this.$message({
                message: '该功能目前不支持',
                showClose: true,
                center: true,
                offset: 40
            });
        },
        login() {
            if(this.user.userName&&this.user.userPassword&&this.user.userName.length<=10&&
                this.user.userPassword.length>=6&&this.user.userPassword.length<=18) {
                this.$http.post("http://localhost:8080/users", this.user).then(res => {
                    if(res.data == '') {
                        this.$message({
                            message: '用户名不存在或密码错误',
                            type: 'error',
                            showClose: true,
                            center: true,
                            offset: 40
                        });
                    } else{
                        sessionStorage.setItem("userId", res.data);
                        this.$router.push('/main/index');
                    }
                });
            } else{
                this.$message({
                    message: '表单信息填写不正确',
                    type: 'error',
                    showClose: true,
                    center: true,
                    offset: 40
                });
            }
        }
    }
}
</script>

<style scoped>
@import "../assets/css/login.css";
</style>
