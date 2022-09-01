<template>
    <div>
        <el-carousel indicator-position="outside" height="640px" :interval="5000">
            <el-carousel-item v-for="img in indexImgs">
                <el-image :src="img" style="height: 40vw"
                ></el-image>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    name: "Index",
    data() {
        return {
            indexImgs: [
                '../../static/ProjectResources/indexImg/1.jpg',
                '../../static/ProjectResources/indexImg/2.png',
                '../../static/ProjectResources/indexImg/3.png',
                '../../static/ProjectResources/indexImg/4.jpeg',
                '../../static/ProjectResources/indexImg/5.png',
                '../../static/ProjectResources/indexImg/6.png'
            ]
        }
    }
}
</script>

<style scoped>
    @import "../assets/css/index.css";
</style>
