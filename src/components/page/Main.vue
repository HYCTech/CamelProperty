<template>
    <div>

        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <div style="margin:0 auto; ">
                        <img src="static/img/img.jpg" class="user-avator" alt="">
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <div class="user-content bg-purple-dark">
                    <el-row class="community-name">中城名仕汇</el-row>
                    <el-row class="community-phone">联系电话：133XXXXX8326</el-row>
                    <el-row class="community-ip">公网IP地址：{{ip}}</el-row>
                </div>
            </el-col>
        </el-row>
        <!--<el-row type="flex" justify="center">
            <el-col>
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div  class="user-info" style="margin:0 auto">
                        <img src="static/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    &lt;!&ndash;<div class="user-info-list">上次登录时间：<span>2018-11-01</span></div>&ndash;&gt;
                    <div class="user-info-list">上次登录地点：<span>福州</span></div>
                </el-card>

            </el-col>

        </el-row>-->

    </div>
</template>

<script>

    import axios from 'axios';
    import Schart from 'vue-schart';
    import bus from '../common/bus';


    export default {
        name: '',
        ip: "",
        data() {
            return {
                name: localStorage.getItem('ms_username'),
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {

                return this.name === 'luban' ? '超级管理员' : '普通用户';
            }
        },

        created() {
            //获取公网IP地址
            //console.log(returnCitySN["cip"] + ',' + returnCitySN["cname"])
            this.ip=returnCitySN["cip"];

        },
        activated() {
            //this.handleListener();
        },
        deactivated() {
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {

            onOffline() {
                let networkState = navigator.connection.type;
                if (networkState === Connection.NONE) {
                    alert('主人，又没网络啦')
                }
            },
            changeDate() {
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
                })
            },
            handleListener() {
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg) {
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart() {
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            }
        }
    }

</script>


<style scoped>

    .el-row {
        margin-bottom: 20px;

    }

    .last-child {
        margin-bottom: 0;
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: white;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;

        text-align: center;
    }

    .user-content {
        border-radius: 4px;
        min-height: 100%;
        text-align: center;
    }

    .community-name {
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 26px;
    }

    .community-phone {

        padding-bottom: 20px;
        font-size: 26px;
    }
    .community-ip{
        padding-bottom: 110px;
        font-size: 26px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .grid-content {
        display: flex;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 280px;
        height: 280px;
        border-radius: 50%;

    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }


</style>
