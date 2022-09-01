<template>
    <div>
        <el-container>
            <el-header>
                <!-- 导航菜单 -->
                <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="/index">主页</el-menu-item>
                    <el-menu-item index="/audio">我的音频</el-menu-item>
                    <el-menu-item index="/image">我的图片</el-menu-item>
                    <el-menu-item index="/video">我的视频</el-menu-item>
                </el-menu>
                <div id="div1" @click="userInfo">
                    <el-avatar :size="40" :src="imgSrc"></el-avatar>
                </div>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<script>

export default {
    name: "Main",
    data() {
        return {
            activeIndex: this.$route.path.substring(5),
            imgSrc: '../../static/UserResources/avatar/avatar.jpg'
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            sessionStorage.setItem('path', '/main' + key);
            this.$router.push('/main' + key);
        },
        userInfo() {
            this.$router.push('/user');
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
        }
    }
}
</script>

<style scoped>
    @import "../assets/css/main.css";
</style>
