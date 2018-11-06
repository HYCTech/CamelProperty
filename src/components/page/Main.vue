<template>
    <div>

        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <div style="margin:0 auto; ">
                        <!-- <img src="static/img/img.jpg" class="user-avator" alt=""> -->
                        <!--<img src="static/img/img.jpg" alt="">-->
                        <img :src="form.showLogo"  class="logo">
                    </div>
                </div>
            </el-col>

        </el-row>

        <el-row>
            <el-col :span="24">
                <div class="user-content bg-purple-dark">
                    <el-row class="community-name">{{form.showName}}</el-row>
                    <el-row class="community-phone">联系电话：{{form.showPhone}}</el-row>
                    <el-row class="community-ip">公网IP地址：{{ip}}</el-row>
                    <el-row class="setting-content bg-purple-dark ">
                        <img src="../../assets/setting.png" height="35" width="35" alt="设置基本信息" title="设置基本信息"
                             @click="showSetting"/>
                    </el-row>
                </div>

            </el-col>
        </el-row>

        <el-dialog
            title=""
            :visible.sync="centerDialogVisible"
            width="35%"
            center>
            <div v-if="successLogin==false">
                <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px"
                         class="demo-ruleForm">
            <span>
                    <el-form-item label="用户名" prop="username">
                    <el-input v-model.number="ruleForm2.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item style="text-align: center">
                    <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                    <el-button @click="resetForm('ruleForm2')">重置</el-button>
                  </el-form-item>
            </span>

                    <!-- <span slot="footer" class="dialog-footer"   >
                         <el-button @click="centerDialogVisible = false">取 消</el-button>
                         <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
                     </span>-->
                </el-form>
            </div>
            <div v-else>
                <el-form :model="form" label-width="80px" :rules="rules" ref="ruleForm">


                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="显示名称:" prop="material_cost">
                                <el-input v-model="form.showName"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="联系电话:" prop="material_cost">
                                <el-input v-model="form.showPhone"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                    <el-form-item label="图片:">
                        <el-upload
                            :action="uploadUrl"
                            :on-success="successHandle"
                            multiple>
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    </el-row>
                    <el-row style="text-align: center">

                        <el-button @click="centerDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="okModel">确 定</el-button>

                    </el-row>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import axios from 'axios';
    import * as api from '@/api/index.js';
    import Schart from 'vue-schart';
    import bus from '../common/bus';


    export default {
        name: '',
        ip: "",
        data() {
            var checkUserName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                } else {
                    callback();
                }

            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {

                    callback();
                }
            };


            return {
                name: localStorage.getItem('ms_username'),
                centerDialogVisible: false,
                successLogin: false,
                imgBaseUrl:'http\://127.0.0.1:8888/img/',
                uploadUrl:'http://127.0.0.1:8888/upload',
                form: {
                    id:"",
                    showName: "",
                    showPhone: "",
                    showLogo:"",
                },
                ruleForm2: {
                    pass: '654321',
                    username: 'luban'
                },
                rules2: {
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    username: [
                        {validator: checkUserName, trigger: 'blur'}
                    ]
                }
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
            this.ip = returnCitySN["cip"];
            this.getBasicInfo();

        },
        deactivated() {
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            //获取基本信息
            getBasicInfo(){
                api.getBasic().then(res=>{
                    if(res.data.success && res.data.total>0 ){
                        this.form.showName=res.data.data[0].showName;
                        this.form.showPhone=res.data.data[0].showPhone;
                        this.form.id=res.data.data[0]._id;
                        this.form.showLogo=res.data.data[0].showLogo;
                    }else{
                        this.form.showName="中城名仕汇";
                        this.form.showPhone="1350xxxx325";
                        this.form.id="";
                        this.form.showLogo="static/img/img.jpg";
                    }

                }).catch(err=>{
                    console.log(err);
                })
            },
            //提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //验证账号和密码
                        var uname = this.ruleForm2.username;//用户名
                        var upassword = this.ruleForm2.pass;//密码
                        if (uname == "luban" && upassword == "654321") {
                            this.successLogin = true;
                        } else {
                            this.successLogin = false;
                            alert("账号或密码有误，请重新输入");
                        }

                    } else {
                        return false;
                    }
                });
            },
            //弹出显示设置
            showSetting() {
                this.centerDialogVisible = true;
                this.successLogin = false;
            },
            //提交赋值图片路径
            successHandle(response ) {
                this
                console.log(response.minFilename+"-----response.minFilename-")
                console.log(response.filename+"-----response.filename-")
                this.form.showLogo=this.imgBaseUrl + response.filename;
                
            },
            //重置按钮事件
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //修改或新增基础数据
            okModel(){
                var id=this.form.id;
                console.log("--->"+id)
                if(id!=""){
                    //执行更新操作
                    api.updateBasicInfo(id,this.form).then(res=>{
                        console.log("-1-->"+res.data.success)
                        if(res.data.success){
                            this.centerDialogVisible = false;
                            this.getBasicInfo();
                        }
                    }).catch(err=>{
                        console.log("-err-->"+err)
                        alert("设置不成功");
                    })
                }else{
                    //执行新增操作
                    api.addBasic(this.form).then(res=>{
                        console.log("-0-->"+res.data)
                        if(res.data.success){
                            this.centerDialogVisible = false;
                            this.getBasicInfo();
                        }
                    }).catch(err=>{
                        alert("设置不成功，请重试");
                    })
                }

            }
        }
    }

</script>


<style scoped>


    .bg-purple-dark {
        background: white;
    }

    .grid-content {
        border-radius: 4px;

        text-align: center;
    }

    .user-content {
        border-radius: 4px;
        height: 300px;
        text-align: center;
    }

    .setting-content {
        width: 100%;
        text-align: right;
        position: absolute;
        bottom: 0px;
        padding-right: 10px;
        padding-bottom: 10px;
        margin-bottom: 10px;
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

    .community-ip {
        padding-bottom: 110px;
        font-size: 26px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
.logo{
    width: 258px;
    height: 258px;
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
