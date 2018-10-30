<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 公司订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                    <el-option key="1" label="请选择" value=""></el-option>
                    <el-option key="2" label="姓名" value="customer_name"></el-option>
                    <el-option key="3" label="地址" value="repair_place"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange" v-loading.body="loading">
                <el-table-column prop="repair_place" label="地址">
                </el-table-column>
                <el-table-column prop="customer_name" label="姓名">
                </el-table-column>
                <el-table-column prop="customer_tel" label="联系方式">
                </el-table-column>
                <el-table-column prop="order_type" label="类别">
                    <template slot-scope="scope">
                        {{form.order_type=="public"?"公共":"个人"}}
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="日期">
                </el-table-column>
                <el-table-column prop="content" label="内容">
                </el-table-column>
                <el-table-column prop="picture" label="图片">
                    <template slot-scope="scope">
                        <div v-if="scope.row.picture.length>0">
                            <!--<el-popover
                                ref="popover"
                                placement="top-start"
                                title="大图"
                                trigger="hover">
                                <img :src="item.minFilename" title="点击查看大图" style="width:60px;height:100px;"
                                     @click="bigImg(item.filename)" class="img-item" alt=""
                                     v-for="(item,index) in scope.row.picture">
                            </el-popover>
                            <img :src="scope.row.picture[0].minFilename"  @click="bigImg(item.filename)"  style="width:60px;height:100px;"
                                 v-popover:popover>-->
                            <img :src="scope.row.picture[0].minFilename" @click="bigImg(scope.row.picture[0].filename)"
                                 style="width:80px;height:100px;"
                                 alt="点击查看大图" title="点击查看大图"
                                 　>
                        </div>
                        <span v-show="scope.row.picture.length==0">用户没有上传图片</span>
                    </template>
                </el-table-column>
                <el-table-column prop="material_cost" label="材料费">
                </el-table-column>
                <el-table-column prop="maintenance_cost" label="维修费">
                </el-table-column>
                <el-table-column prop="offer" label="报价">
                </el-table-column>
                <el-table-column label="">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" round>分配人员</el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="发送报价">
                     <template slot-scope="scope">
                         <el-button @click="sendPrices(scope.row)" type="primary" size="small" round>发送报价</el-button>
                     </template>
                 </el-table-column>-->
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <!--<el-table-column prop="date" label="日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>-->
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                               layout="total,  prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">

                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd"
                                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!--显示大图-->
        <div class="dial-header">
                   
            <el-dialog style="background-color:transparent;" title="显示大图" :visible.sync="showFlag" @close='closeDialog'>
                       
                <div style="text-align: left; margin: 0;width:10%;height: 50%">

                    <div class="adp"
                         style="width:300px;height:600px;line-height:600px;border-top:none;margin:0px 0px 0px 40px">
                                     
                        <img :src="imgSrc"
                             style="width:700px;height:600px;">
                                   
                    </div>
                </div>
                       
            </el-dialog>

        </div>

        <!--显示维修人员列表-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import * as api from '@/api/index.js';
    //import bigImg from "./bigImg";

    export default {
        name: 'basetable',

        data() {
            return {
                dialogVisible:false,
                imgSrc: "",
                showFlag: false,
                radio: "",
                url: 'http://localhost:8082/static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    repair_place: "",
                    customer_name: "",
                    customer_tel: "",
                    content: "",
                    picture: [],
                    material_cost: "",
                    maintenance_cost: "",
                    offer: "",
                    order_state: "",
                    order_type: "",
                    name: '',
                    date: '',
                    address: ''
                },
                total: 10,
                currentPage: 0,
                pageSize: 10,
                idx: -1
            }
        },
        created() {
            this.getData();
        },


        methods: {
            // 分页导航
            handleCurrentChange(val) {
                console.log("----第几页----" + val);
                this.cur_page = val;
                this.getData();
            },

            // 获取所有待处理维修单
            getData() {
                //查询所有的待处理维修单
                api.getOrder(this.cur_page, this.pageSize, {"order_state": "waitting"}).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;

                })
            },
            search() {
                this.is_search = true;
                //选择请选择查询全部否则按条件查询
                if ("" == this.select_cate) {
                    this.getData();
                } else {
                    var selectCate = this.select_cate;//下拉框值
                    var selectWord = this.select_word;//输入框的值
                    var param = {[selectCate]: selectWord, "order_state": "waitting"}
                    api.getOrder(this.page, this.pageSize, param)
                        .then(res => {
                            this.tableData = res.data.data;
                            this.total = res.data.total;
                        })
                }
            },
            bigImg(imgUrl) {
                console.log("-----------" + imgUrl);
                this.imgSrc = imgUrl;
                this.showFlag = true;
            },
            //关闭弹框的事件
            closeDialog() {
                //清空数据
                this.imgSrc = "";
                this.showFlag = false;
            },

            sendPrices(row){
                let pushMessage={
                    title:'维修价格',
                    orderId:row.orderId,    //订单ID 显示用的
                    content:row.content,
                    openID:row.openID,      //用户的openid
                    order_id:row._id,       //order表_id 操作用的
                }
                api.sendPrices(pushMessage).then(res=>{
                    console.log(res)
                    if(res.success){
                        this.successMsg()
                    }else {
                        this.errorMsg()
                    }
                })
                console.log(pushMessage)
            },

            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            },

            // 确定删除
            deleteRow() {
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        },

    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .big-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 3000;
        text-align: center;
        padding: 5% 0 0 0;
    }

    .big-modal img {
        display: inline-block;
        width: 80%;
        height: 80%;
    }
</style>
