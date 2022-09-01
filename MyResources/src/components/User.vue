<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align: center">
                <span>修改信息</span>
            </div>
            <el-form :model="user" label-position="right" label-width="auto" style="width: 330px;margin: 0 auto"
                     :rules="rules" hide-required-asterisk>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="user.userName"></el-input>
                </el-form-item>
                <div style="height: 16px;"></div>
                <el-form-item prop="userPassword">
                    <tem slot="label">密&#12288;码</tem>
                    <el-input type="password" v-model="user.userPassword" show-password></el-input>
                </el-form-item>
                <div style="height: 16px;"></div>
                <el-form-item prop="userGender">
                    <tem slot="label">性&#12288;别</tem>
                    <el-select v-model="user.userGender" placeholder="请选择性别" style="width: 277px;">
                        <el-option label="男" value="0">
                        </el-option>
                        <el-option label="女" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <div style="height: 16px;"></div>
                <el-form-item>
                    <tem slot="label">生&#12288;日</tem>
                    <el-date-picker type="date" placeholder="请选择生日" v-model="user.userBirth"
                                    :picker-options="pickerOptions" style="width: 277px;"
                                    :editable="false" value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
            <div style="height: 18px;"></div>
            <div style="width: 200px;margin: 0 auto">
                <el-button type="info" @click="cancel">取消</el-button>
                <div style="display: inline-block;width: 40px"></div>
                <el-button type="success" @click="save">保存</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "User",
    data() {
        return {
            user: {
                userId: '',
                userName: '',
                userPassword: '',
                userGender: '',
                userBirth: ''
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
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
        cancel() {
            let path = sessionStorage.getItem('path');
            if(path == null) {
                path = '/main/index';
            }
            this.$router.push(path);
            this.$message({
                message: '取消修改',
                showClose: true,
                center: true,
                offset: 40
            });
        },
        save() {
            if(this.user.userName&&this.user.userPassword&&this.user.userName.length<=10&&
                this.user.userPassword.length>=6&&this.user.userPassword.length<=18){
                this.$http.put('http://localhost:8080/users', this.user).then(res => {
                    let path = sessionStorage.getItem('path');
                    if(path == null) {
                        path = '/main/index';
                    }
                    this.$router.push(path);
                    this.$message({
                        message: '保存成功',
                        type: "success",
                        showClose: true,
                        center: true,
                        offset: 40
                    });
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
    },
    created() {
        let userId = sessionStorage.getItem("userId");
        if(userId == null || userId == ''){
            this.$router.push('/login');
            this.$message({
                message: '请先登录',
                showClose: true,
                center: true,
                offset: 40
            });
        } else {
            this.$http.get("http://localhost:8080/users/" + userId).then(res => {
                this.user = res.data;
            });
        }
    }
}
</script>

<style scoped>
@import "../assets/css/user.css";
</style>
