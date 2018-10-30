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
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      :default-sort="{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange"  >
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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="distributionEdit(scope.$index, scope.row)">分配人员
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                               layout="total,  prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 派单人员列表 -->
        <el-dialog title="人员列表" :visible.sync="editVisible" width="30%">

            <el-radio-group v-model="radio" @change="onRadioChange">
                <el-radio :label="index" :key="item._id" v-for="(item,index) in user_list">{{item.maintenance_name}}</el-radio>
            </el-radio-group>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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

    </div>
</template>

<script>

    import * as api from '@/api/index.js';

    export default {
        name: 'basetable',

        data() {
            return {

                resource:'',
                dialogVisible: false,
                imgSrc: "",
                showFlag: false,
                radio: "1",
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
                user_list: [],
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
            //选择人员
            onRadioChange(item) {
                console.log("item", item);
                this.resource=item;
            },
            // 保存分配人員
            saveEdit() {
                //this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`第 ${this.idx + 1}行 分配給 ${this.user_list[this.resource].maintenance_name}`);
            },
            //订单分配人员
            distributionEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                };
                api.getAllMaintenance()
                    .then(res => {
                        console.log(res.data.success);
                        if(res.data.success){
                            this.user_list=res.data.data;
                        }
                    })

                this.editVisible = true;
            },
            //选择查询类别
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
