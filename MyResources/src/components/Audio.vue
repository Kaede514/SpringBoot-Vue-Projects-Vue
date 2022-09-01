<template>
    <div>
        <div id="div1">
            <div id="div2"></div>
            <el-input v-model="search" size="medium" suffix-icon="el-icon-search" placeholder="请输入关键词搜索"></el-input>
            <div id="div3">
                <el-upload action="http://localhost:8080/audios"
                           accept=".mp3" :show-file-list="false" multiple
                           :on-success="uploadSuccess" :on-error="uploadError">
                    <el-button type="primary">点击上传</el-button>
                </el-upload>
                <el-popconfirm
                    v-show="isShow"
                    confirmButtonText="确定"
                    cancelButtonText="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    title="此操作将删除所有选中文件, 是否继续?"
                    @confirm="handleMultiDelete">
                    <el-button slot="reference" type="danger">批量删除</el-button>
                </el-popconfirm>
                <el-button type="info" v-show="isShow" @click="changeShow">取消</el-button>
            </div>
        </div>
        <el-table :data="tableData.filter(data => !search || data.audioName.toLowerCase().includes(search.toLowerCase())
			      || data.audioSinger.toLowerCase().includes(search.toLowerCase()))" :height="580" size="mini"
                  :row-class-name="showCss" @selection-change="selectChange" border :row-style="{height: '60px'}"
                  :cell-style="{padding:'0px'}">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="audioName" label="歌名" align="center" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="audioSinger" label="歌手" align="center" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="audioUrl" label="歌曲" align="center" show-overflow-tooltip>
                <i slot-scope="scope">
                    <audio style="margin-top: 6px" :src="scope.row.audioUrl" controls></audio>
                </i>
            </el-table-column>
            <el-table-column label="操作" align="center" show-overflow-tooltip>
                <i slot-scope="scope">
                    <el-button size="medium" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                    <el-popconfirm
                        confirmButtonText="确定"
                        cancelButtonText="取消"
                        icon="el-icon-info"
                        icon-color="red"
                        title="此操作将删除该文件, 是否继续?"
                        @confirm="handleDelete(scope.$index, scope.row)">
                        <el-button style="margin-left: 12px;" slot="reference" type="danger" size="medium">删除</el-button>
                    </el-popconfirm>
                </i>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination style="text-align: center;margin-top: 16px"
                       prev-text="上一页" next-text="下一页"
                       layout="prev, pager, next"
                       :current-page="currentPage"
                       @current-change="findPage"
                       :page-sizes="[8]" :page-size="8"
                       :pager-count="5"
                       :total="total">
        </el-pagination>
        <!-- 修改组件 -->
        <el-dialog title="请修改" :visible.sync="dialogFormVisible" top="140px" width="500px" center>
            <el-form :model="audio">
                <el-form-item label="歌曲名" label-width="56px">
                    <el-input v-model="audio.audioName" autocomplete="off"></el-input>
                </el-form-item>
                <div style="height: 20px"></div>
                <el-form-item label="歌手名" label-width="56px">
                    <el-input v-model="audio.audioSinger" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <div style="width: 40px;display: inline-block">&nbsp;</div>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Audio",
    data() {
        return {
            tableData: [],
            search: '',
            audioIds: [],
            isShow: false,
            dialogFormVisible: false,
            audio: {
                audioId: '',
                audioName: '',
                audioSinger: '',
                audioUrl: ''
            },
            total: 0,
            currentPage: 1
        }
    },
    methods: {
        showCss({row, rowIndex}) {
            //如果设置了stripe属性，会有冲突
            if (rowIndex % 2 !== 0) {
                return 'success-row';
            }
        },
        selectChange(selection) {
            this.audioIds.length = selection.length;
            if(this.audioIds.length > 0) {
                this.isShow = true;
            }
            for (let i = 0; i < selection.length; i++) {
                this.audioIds[i] = selection[i].audioId;
            }
        },
        changeShow() {
            this.isShow = false;
        },
        uploadSuccess() {
            //刷新数据
            this.selectAllData();
            this.$message({
                showClose: true,
                message: '文件上传成功',
                center: true,
                type: 'success',
                offset: 40
            });
        },
        uploadError() {
            this.$message({
                showClose: true,
                message: '文件上传失败',
                center: true,
                type: 'error',
                offset: 40
            });
        },
        selectAllData() {
            this.$http.get('http://localhost:8080/audios?page=' + this.currentPage).then(res => {
                this.tableData = res.data.audios;
                this.total = res.data.count;
                for (let i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].audioUrl = '../../static/UserResources/audio/' + this.tableData[i].audioUrl;
                }
            });
        },
        handleDelete(index, row) {
            //发送axios请求删除
            //刷新页面写在回调中，防止因为延迟原因提前执行了刷新，而数据还未删除
            this.$http.delete("http://localhost:8080/audios/" + row.audioId).then(res => {
                this.selectAllData();
            });
            this.$message({
                type: 'success',
                message: '删除成功',
                showClose: true,
                center: true,
                offset: 40
            });
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.audio.audioId = row.audioId;
            this.audio.audioName = row.audioName;
            this.audio.audioSinger = row.audioSinger;
        },
        confirmEdit() {
            this.audio.audioUrl = this.audio.audioSinger + '-' + this.audio.audioName + ".mp3";
            this.$http.put('http://localhost:8080/audios', this.audio).then(res => {
                this.dialogFormVisible = false;
                if(res.data) {
                    this.$message({
                        message: '修改歌曲信息成功',
                        type: 'success',
                        showClose: true,
                        center: true,
                        offset: 40
                    });
                } else {
                    this.$message({
                        message: '修改歌曲信息失败',
                        showClose: true,
                        center: true,
                        type: 'error',
                        offset: 40
                    });
                }
                this.selectAllData();
            });
        },
        findPage(page) {    //用来处理分页的相关放方法
            this.currentPage = page;
            this.selectAllData();
        },
        handleMultiDelete() {
            /*
            注意：post和put请求可以直接在url后面跟负载数据，而delete请求的负载数据必须在config中，以data为键
            如 this.$http.post('http://localhost:8080/audios', this.audioIds)
              this.$http.put('http://localhost:8080/audios', this.audioIds)
              this.$http.delete('http://localhost:8080/audios', {data: this.audioIds})
             */
            this.$http.delete('http://localhost:8080/audios', {data: this.audioIds}).then(res => {
                this.selectAllData();
                this.$message({
                    message: '批量删除成功',
                    type: 'success',
                    showClose: true,
                    center: true,
                    offset: 40
                });
            });
        }
    },
    created() {
        this.selectAllData();
    }
}
</script>

<style scoped>
    @import "../assets/css/audio.css";
</style>

<!-- 此样式需脱离vue样式，故style处不能加scope -->
<style>
    .el-table .success-row {
        background: rgba(154, 220, 94, 0.1);
    }
</style>
