<template>
    <div class="intelligentDevice-info">
        <van-search
                v-model="searchName"
                show-action
                placeholder="输入智能装备名称"
                @search="onSearch"
                @cancel="clearSearch"
                style="margin-bottom: 3px;"
        >
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
        <van-nav-bar left-text="返回" left-arrow class="custom-nav-bar" title="智能装备信息" right-text="新增"

                     @click-right="showAddIntelligentDeviceModal">
            <template #left>
                <van-button class="custom-button-left" to="/" type="default" text="返回"/>
            </template>
            <template #right>
                <van-button class="custom-button" type="default" text="新增"/>
            </template>
        </van-nav-bar>
        <van-field
                readonly
                clickable
                clear-trigger
                label="装置"
                :value="selectedDevice ? selectedDevice.text : ''"
                placeholder="选择装置"
                @click="devicePopupVisible = true"
        />
        <van-popup v-model="devicePopupVisible" round position="bottom">
            <van-picker
                    show-toolbar
                    :columns="deviceOptions"
                    @cancel="hideDevicePopup"
                    @confirm="onSelectDevice"
                    :default-index="0"
                    ref="vanPicker"
            />
        </van-popup>
        <van-list
                v-model="loading"
                finished-text="没有更多了"
                :finished="finished"
                @load="loadMore"
                class="intelligentDevice-list"
                offset="1"
                :immediate-check=immediateCheck
        >
            <van-swipe-cell v-for="(intelligentDevice, index) in currentIntelligentDevices"
                            :key="index">
                <div class="custom-van-row" @click="editIntelligentDevice(intelligentDevice)">
                    <van-row style="display: flex;justify-content: space-between">
                        <van-col span="24">
                            <van-cell title="名称:" :value="intelligentDevice.baseName"></van-cell>
                        </van-col>
                    </van-row>
                    <van-row style="display: flex;justify-content: space-between">
                        <van-col span="24">
                            <van-cell title="位置:" :value="intelligentDevice.basePosition"></van-cell>
                        </van-col>
                    </van-row>
                    <van-row style="display: flex;justify-content: space-between">
                        <van-col span="24">
                            <van-cell title="在线:"
                                      :value="intelligentDevice.intelligentDeviceStatus==1?'在线':'离线'"></van-cell>
                        </van-col>
                    </van-row>
                </div>

                <template #right>
                    <van-button square type="danger" class="delete-button" text="删除"
                                @click.stop="deleteIntelligentDevice(intelligentDevice.id)"/>
                </template>
            </van-swipe-cell>

        </van-list>
        <van-popup v-model="showModal" position="bottom">
            <van-tabs v-model="activeTab">
                <van-tab title="基础信息">
                    <div class="tab-content">
                        <van-field v-model="editingIntelligentDevice.baseNumber" label="智能装备编号"/>
                        <van-field v-model="editingIntelligentDevice.baseName" label="智能装备名称"/>
                        <van-field v-model="editingIntelligentDevice.baseClassify" label="智能装备分类"/>
                        <van-field v-model="editingIntelligentDevice.baseState" label="智能装备状态"/>
                        <van-field v-model="editingIntelligentDevice.basePosition" label="安装位置"/>
                        <van-field v-model="editingIntelligentDevice.baseIp" label="智能装备IP"/>
                        <van-field v-model="editingIntelligentDevice.baseInstallationTime" label="安装时间" type="date"/>
                        <van-field v-model="editingIntelligentDevice.baseInstallationMethod" label="安装方式"/>
                        <van-field v-model="editingIntelligentDevice.baseTrnf" label="供电方式"/>
                        <van-field v-model="editingIntelligentDevice.baseCommunicationMode" label="通讯方式"/>
                        <van-field v-model="editingIntelligentDevice.reserved1" label="链接地址"/>
                    </div>
                </van-tab>
            </van-tabs>
            <div class="modal-footer">
                <van-button @click="closeModal">取消</van-button>
                <van-button type="primary" @click="saveIntelligentDevice()">确认</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import {
        getIntelligentDeviceInfo,
        getIntelligentDeviceList,
        addIntelligentDevice,
        updateIntelligentDevice,
        deleteIntelligentDevice
    } from "@/api/intelligentDevice";
    import * as Dialog from "vant";

    export default {
        data() {
            return {
                showPicker: false,
                selectedDevice: null,
                deviceOptions: [
                    // 煤化工厂区公用工程中心
                    {
                        text: '煤化工厂区公用工程中心',
                        children: [
                            {text: '管网水系统', deviceCode: 99},
                            {text: '回用水装置', deviceCode: 85},
                            {text: '空分装置', deviceCode: 86},
                            {text: '管网', deviceCode: 84},
                            {text: '火炬装置', deviceCode: 100},
                            {text: '污水回用装置', deviceCode: 98},
                            {text: '循环水装置', deviceCode: 97},
                            {text: '装卸栈台', deviceCode: 91},
                            {text: '污水装置', deviceCode: 90},
                            {text: '脱盐水装置', deviceCode: 89},
                            {text: '水系统', deviceCode: 88},
                            {text: '矿井水', deviceCode: 87},
                            {text: '第一循环水', deviceCode: 83},
                            {text: '第二循环水', deviceCode: 80},
                            {text: '第三循环水', deviceCode: 82},
                            {text: '第三换热站', deviceCode: 81},
                            {text: '酸碱站装置', deviceCode: 103},
                            {text: '加压泵房装置', deviceCode: 105},
                            {text: '第一换热站', deviceCode: 101},
                            {text: '第二换热站', deviceCode: 104},
                            {text: '气化污水除硬', deviceCode: 106},
                            {text: '公用工程虚拟装置', deviceCode: 107},
                            {text: '溴化锂装置', deviceCode: 112},
                            {text: '生活制水间装置', deviceCode: 102},
                        ]
                    },
                    {
                        text: '煤化工厂区甲醇中心',
                        children: [
                            {text: '净化装置', deviceCode: 54},
                            {text: '气化装置', deviceCode: 55},
                            {text: '合成装置', deviceCode: 53},
                            {text: '甲醇中心虚拟装置', deviceCode: 114},
                            {text: '硫回收装置', deviceCode: 120},
                        ]
                    },
                    {
                        text: '煤化工厂区生产指挥中心',
                        children: [
                            {text: '中央控制室', deviceCode: 121},
                        ]
                    },
                    {
                        text: '煤化工厂区仓储中心',
                        children: [
                            {text: '双聚包装装置', deviceCode: 73},
                            {text: '综合仓库装置', deviceCode: 56},
                            {text: '硫磺包装装置', deviceCode: 72},
                            {text: '供销仓储虚拟装置', deviceCode: 113},
                        ]
                    },
                    {
                        text: '煤化工厂区热电中心',
                        children: [
                            {text: '脱硫脱硝', deviceCode: 93},
                            {text: '汽机装置', deviceCode: 70},
                            {text: '锅炉装置', deviceCode: 71},
                            {text: '卸储煤装置', deviceCode: 69},
                            {text: '热电中心虚拟装置', deviceCode: 118},
                            {text: '全场电气', deviceCode: 124},
                        ]
                    },
                    {
                        text: '煤化工厂区分析检测中心',
                        children: [
                            {text: '化验楼', deviceCode: 95},

                        ]
                    },
                    {
                        text: '煤化工厂区仪控中心',
                        children: [
                            {text: '电信装置', deviceCode: 96},
                            {text: '仪控中心虚拟装置', deviceCode: 119},
                            {text: '信息站', deviceCode: 122},
                            {text: '自控站', deviceCode: 123},
                        ]
                    },
                    {
                        text: '煤化工厂区烯烃中心',
                        children: [
                            {text: '烯烃分离装置', deviceCode: 74},
                            {text: '聚乙烯装置', deviceCode: 79},
                            {text: '甲醇制烯烃装置', deviceCode: 77},
                            {text: '罐区装置', deviceCode: 76},
                            {text: '聚丙烯装置', deviceCode: 78},
                            {text: '碳四装置', deviceCode: 75},
                        ]
                    },
                    // 添加其他装备类型
                ],
                devicePopupVisible: false,
                searchName: '',
                intelligentDevices: [
                    {
                        id: 1,
                        deviceCode: "烯烃装置", // 装置编码
                        deviceCodeName: "烯烃装置",// 装置编码名称
                        baseNumber: "",
                        baseName: "",
                        baseClassify: "",
                        baseState: "",
                        basePosition: "",
                        baseIp: "",
                        baseInstallationTime: "",
                        baseInstallationMethod: "",
                        baseTrnf: "",
                        baseCommunicationMode: "",
                        reserved1: "",
                    }

                    // 预留更多智能装备数据...
                ], // 智能装备信息列表
                currentIntelligentDevices: [],
                loading: false,
                finished: false,
                showModal: false,
                activeTab: 0,
                editingIntelligentDevice: {}, // 当前编辑的智能装备信息
                isSwiping: [], // 记录每个智能装备是否在滑动状态

                //加载下一页
                itemList: [],
                loading: false,
                loadingInProgress: false,
                pageNum: 1,
                pageSize: 10,
                finished: false,
                immediateCheck: false
            };
        },
        methods: {
            initTable() {
                getIntelligentDeviceList({pageNum: this.pageNum, pageSize: this.pageSize}).then(res => {
                    if (res) {
                        this.currentIntelligentDevices = res.rows
                        if (res.total <= this.pageSize) this.finished = true
                    }
                })
            },
            showDevicePopup() {
                this.devicePopupVisible = true;
            },
            onConfirmDevice() {
                this.devicePopupVisible = false;
            },
            hideDevicePopup() {
                this.devicePopupVisible = false;
                this.selectedDevice = "";
            },
            onSelectDevice(device) {
                let device_ = this.$refs.vanPicker.getValues()
                this.selectedDevice = device_[1];


                getIntelligentDeviceList({deviceCode: device_[1].deviceCode}).then(res => {
                    if (res.code == 200) {
                        console.log(res)
                        this.currentIntelligentDevices = res.rows
                    }
                })
                this.devicePopupVisible = false;

            },
            clearSearch() {
                this.searchName = '';
            },
            onSearch() {
                // this.currentIntelligentDevices = [...this.intelligentDevices]
                // 点击搜索时的逻辑，比如可以触发一段函数去刷新数据

                getIntelligentDeviceList({baseName: this.searchName}).then(res => {
                    if (res.code == 200) {
                        this.currentIntelligentDevices = res.rows
                    }
                })

            },
            loadMore() {

                // TODO: 调用后端接口加载更多智能装备信息
                if (this.loadingInProgress || this.finished) return; // 防止重复请求
                this.loadingInProgress = true; // 设置加载状态
                try {
                    // this.loading = true; // 设置 list 的 loading 状态
                    let resData_ = this.getTableData()
                    resData_.then(resData => {
                        if (resData.rows.length > 0) {
                            this.currentIntelligentDevices.push(...resData.rows);
                            this.currentIntelligentDevices = _.uniqWith(this.currentIntelligentDevices, _.isEqual)

                            if (resData.rows.length > 0 && resData.rows.length < this.pageSize) {
                                this.finished = true; // 没有更多数据
                                return
                            }
                        } else {
                            this.finished = true; // 没有更多数据
                        }
                    })
                } catch (error) {
                    console.error("获取数据失败:", error);
                } finally {
                    this.loadingInProgress = false; // 重置加载状态
                    this.loading = false; // 清除 loading 状态
                }
            },
            async getTableData() {
                this.pageNum++

                try {
                    const response = await getIntelligentDeviceList({pageNum: this.pageNum, pageSize: this.pageSize})
                    // 直接获取数据
                    const data = response;
                    return data; // 如果需要返回数据
                } catch (error) {
                    console.error("请求数据失败:", error);
                }
            },
            showAddIntelligentDeviceModal() {
                this.resetEditingIntelligentDevice();
                this.showModal = true;
            },
            editIntelligentDevice(intelligentDevice) {
                // this.editingIntelligentDevice = {...intelligentDevice}; // 深拷贝
                this.showModal = true;
                getIntelligentDeviceInfo(intelligentDevice.id).then(res => {
                    if (res) {
                        console.log(res)
                        this.editingIntelligentDevice = res.data.smartDeviceInfo
                    }
                })
            },
            closeModal() {
                this.showModal = false;
            },
            saveIntelligentDevice() {
                if (this.editingIntelligentDevice.id) {
                    let intelligentDeviceInfoAndExtendVo = {
                        intelligentDeviceInfo: this.editingIntelligentDevice,
                        intelligentDeviceExtendList: []
                    }
                    // intelligentDeviceInfoAndExtendVo.intelligentDeviceInfo.deviceCode = "99"
                    updateIntelligentDevice(intelligentDeviceInfoAndExtendVo).then(res => {
                        if (res.code == 200) {
                            this.$notify({type: 'success', message: '修改成功'});
                            this.initTable()
                        } else {
                            this.$notify({type: 'warning', message: '修改失败'});
                        }
                    })

                } else {
                    let intelligentDeviceInfoAndExtendVo = {
                        intelligentDeviceInfo: this.editingIntelligentDevice,
                        intelligentDeviceExtendList: []
                    }
                    // intelligentDeviceInfoAndExtendVo.intelligentDeviceInfo.deviceCode = "99"
                    addIntelligentDevice(intelligentDeviceInfoAndExtendVo).then(res => {
                        if (res.code == 200) {
                            this.$notify({type: 'success', message: '添加成功'});
                            this.initTable()
                        } else {
                            this.$notify({type: 'warning', message: '添加失败'});
                        }
                    })
                }

                // TODO: 调用后端接口保存智能装备信息
                this.closeModal();
            },
            deleteIntelligentDevice(e) {
                const index = this.currentIntelligentDevices.filter(intelligentDevice => intelligentDevice.id === e);
                // if (index !== -1) this.currentIntelligentDevices.splice(index, 1);
                // TODO: 调用后端接口删除智能装备信息
                console.log(index)
                this.$dialog.confirm({
                    title: '删除提示',
                    message: '确认删除智能装备' + index[0].baseName,
                }).then(() => {
                    deleteIntelligentDevice(e).then(res => {
                        if (res.code == 200) {
                            this.$notify({type: 'success', message: '删除成功'});
                            this.initTable()
                        } else {
                            this.$notify({type: 'warning', message: '删除失败'});
                        }
                    })
                }).catch(() => {
                    this.$notify({type: 'warning', message: '取消删除'});
                });
            },
            startTouch(index) {
                this.isSwiping = this.isSwiping.map((_, i) => (i === index ? true : false));
            },
            endTouch() {
                this.isSwiping = this.isSwiping.map(() => false);
            },
            resetEditingIntelligentDevice() {
                this.editingIntelligentDevice = {};
            }
        },
        mounted() {
            // TODO: 初始化加载智能装备信息
            // this.currentIntelligentDevices = [...this.intelligentDevices]
            this.initTable()
        }
    };
</script>

<style scoped>
    .intelligentDevice-info {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .intelligentDevice-list {
        flex-grow: 1;
        padding: 10px;
        height: 100vh; /* 设置合适的高度 */
        overflow-y: auto; /* 允许垂直滚动 */
    }


    .custom-button {
        position: absolute;
        right: 0;
        height: 100%;
        width: 60px;
        color: rgb(255, 227, 2);
        font-firmFactoryDate: 15px;
        border: none;
        background-color: rgba(194, 176, 176, 0);
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        padding: 16px;
    }

    .delete-button {
        height: 100%;
    }

    .tab-content {
        padding: 16px;
        font-firmFactoryDate: 10px;
        max-height: 400px; /* 限制最大高度 */
        overflow-y: auto; /* 允许滚动 */
    }

    .custom-button-left {
        position: absolute;
        left: 0;
        height: 100%;
        width: 60px;
        color: rgb(255, 255, 255);
        font-firmFactoryDate: 15px;
        border: none;
        background-color: rgba(194, 176, 176, 0);
    }

    .popup-footer {
        padding: 12px;
        display: flex;
        justify-content: space-between;
        background-color: #fff;
    }

    .custom-van-row {
        background: #ffffff;
        border-radius: 15px 10px;
        padding: 12px;
        box-shadow: -3px -3px 2px 2px rgba(98, 255, 0, 0.29) inset;
        margin-top: 10px;
    }
</style>

<!---->

