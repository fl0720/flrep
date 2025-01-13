<template>
    <div class="gateway-info">
        <van-search
                v-model="searchName"
                show-action
                placeholder="输入网关名称"
                @search="onSearch"
                @cancel="clearSearch"
                style="margin-bottom: 3px;"
        >
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
        <van-nav-bar left-text="返回" left-arrow class="custom-nav-bar" title="网关信息" right-text="新增"
                     @click-right="showAddGatewayModal">
            <template #left>
                <van-button class="custom-button-left" to="/" type="default" text="返回"/>
            </template>
            <template #right>
                <van-button class="custom-button" type="default" text="新增"/>
            </template>
        </van-nav-bar>
        <van-list
                v-model="loading"
                finished-text="没有更多了"
                :finished="finished"
                @load="loadMore"
                class="gateway-list"
                offset="1"
                :immediate-check=immediateCheck
        >
            <van-swipe-cell v-for="(gateway, index) in currentGateways"
                            :key="index">
                <div class="custom-van-row" @click="editGateway(gateway)">
                    <van-row style="display: flex;justify-content: space-between">
                        <van-col span="24">
                            <van-cell title="名称:" :value="gateway.baseName" ></van-cell>
                        </van-col>
                    </van-row>
                    <van-row style="display: flex;justify-content: space-between">
                        <van-col span="24">
                            <van-cell title="数量:" :value="gateway.sensorCount" ></van-cell>
                        </van-col>
                    </van-row>
                    <van-row style="display: flex;justify-content: space-between">
                        <van-col span="24">
                            <van-cell title="在线:" :value="gateway.gatewayStatus==1?'在线':'离线'" ></van-cell>
                        </van-col>
                    </van-row>
                </div>

                <template #right>
                    <van-button square type="danger" class="delete-button" text="删除"
                                @click.stop="deleteGateway(gateway.id)"/>
                </template>
            </van-swipe-cell>

        </van-list>

        <van-popup v-model="showModal" position="bottom">
            <van-tabs v-model="activeTab">
                <van-tab title="基础信息">
                    <div class="tab-content">
                        <van-field v-model="editingGateway.baseName" label="网关名称"/>
                        <van-field v-model="editingGateway.basePosition" label="安装位置"/>
                        <van-field v-model="editingGateway.baseNumber" label="网关编号"/>
                        <van-field v-model="editingGateway.baseClassify" label="网关分类"/>
                        <van-field v-model="editingGateway.baseInstallationTime" label="安装时间" type="date"/>
                        <van-field v-model="editingGateway.baseIp" label="默认IP"/>
                        <van-field v-model="editingGateway.baseInstallationMethod" label="安装方式"/>
                        <van-field v-model="editingGateway.baseTrnf" label="供电方式"/>
                        <van-field v-model="editingGateway.baseCommunicationMode" label="通讯方式"/>
                    </div>
                </van-tab>
                <van-tab title="厂家信息">
                    <div class="tab-content">
                        <van-field v-model="editingGateway.firmManufacturers" label="制造厂商"/>
                        <van-field v-model="editingGateway.firmBrand" label="品牌"/>
                        <van-field v-model="editingGateway.firmSerialNumber" label="序列号"/>
                        <van-field v-model="editingGateway.firmSize" label="尺寸"/>
                        <van-field v-model="editingGateway.firmWeight" label="重量"/>
                        <van-field v-model="editingGateway.firmRatedPower" label="额定功率"/>
                        <van-field v-model="editingGateway.firmFactoryDate" label="出厂日期" type="date" />
                        <van-field v-model="editingGateway.firmProductModel" label="产品型号"/>
                        <van-field v-model="editingGateway.firmPhoneNumber"  label="联系电话"/>
                    </div>
                </van-tab>
                <van-tab title="施工单位信息">
                    <div class="tab-content">
                        <van-field v-model="editingGateway.constructionUnit" label="施工单位"/>
                        <van-field v-model="editingGateway.constructionPerson" label="负责人"/>
                        <van-field v-model="editingGateway.constructionPhoneNumber" label="电话"/>
                    </div>
                </van-tab>
                <van-tab title="管理信息">
                    <div class="tab-content">
                        <van-field v-model="editingGateway.maintenanceDepartment" label="维护部门"/>
                        <van-field v-model="editingGateway.maintenancePerson" label="维护员"/>
                        <van-field v-model="editingGateway.maintenancePhoneNumber" label="电话"/>
                        <van-field v-model="editingGateway.maintenanceUseDepartment" label="使用部门"/>
                    </div>
                </van-tab>
                <van-tab title="使用环境信息">
                    <div class="tab-content">
                        <van-field v-model="editingGateway.environWorkHumidity" label="防爆等级"/>
                        <van-field v-model="editingGateway.environProtectionLevel" label="防护等级"/>
                        <van-field v-model="editingGateway.environWorkTemperature" label="工作温度"/>
                        <van-field v-model="editingGateway.environRadiate" label="辐射"/>
                    </div>
                </van-tab>
                <van-tab title="预留字段信息">
                    <div class="tab-content">
                        <van-field v-model="editingGateway.reserved1" label="预留字段"/>

                    </div>
                </van-tab>
            </van-tabs>
            <div class="modal-footer">
                <van-button @click="closeModal">取消</van-button>
                <van-button type="primary" @click="saveGateway()">确认</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import {getGatewayInfo,getGatewayList,addGateway,updateGateway,deleteGateway} from "@/api/gateway";
    import * as Dialog from "vant";

    export default {
        data() {
            return {
                showPicker: false,
                selectedDevice: null,
                deviceOptions: [
                    { text: '烯烃装置', id: 1 },
                    { text: '聚乙烯装置', id: 2 },
                    { text: '聚丙烯装置', id: 3 },
                    // 添加其他设备类型
                ],
                devicePopupVisible: false,
                searchName: '',
                geteways: [
                    {
                        id: 1,
                        deviceCode:"烯烃装置", // 装置编码
                        deviceCodeName:"烯烃装置",// 装置编码名称
                        baseName:"烯烃装置",// 基础信息-网关名称
                        basePosition:"烯烃装置",// 基础信息-安装位置
                        baseNumber:"烯烃装置",// 基础信息-网关编号
                        baseClassify:"烯烃装置",// 基础信息-网关分类(字典)
                        baseInstallationTime:"烯烃装置",// 基础信息-安装时间
                        baseIp: "网关1",// 基础信息-IP地址
                        baseInstallationMethod: "网关1",// 基础信息-安装方式
                        baseTrnf: "网关1",// 基础信息-供电方式
                        baseCommunicationMode: "",// 基础信息-通讯方式(字典)
                        gatewayStatus: "",// 网关状态
                        firmManufacturers: "",// 厂商信息-制造厂商
                        firmBrand: "",// 厂商信息-品牌
                        firmSerialNumber: "",// 厂商信息-序列号
                        firmSize: "",// 厂商信息-尺寸
                        firmWeight: '',// 厂商信息-重量
                        firmRatedPower: '',// 厂商信息-额定功率
                        firmFactoryDate: '',// 厂商信息-出厂日期
                        firmProductModel: '',// 厂商信息-产品型号
                        firmPhoneNumber: '',// 厂商信息-联系电话
                        constructionUnit: '',// 施工单位信息-施工单位
                        constructionPerson: '',// 施工单位信息-负责人
                        constructionPhoneNumber: '',// 施工单位信息-施工电话
                        maintenanceDepartment: '',// 管理信息-维护部门
                        maintenancePerson: '',// 管理信息-维护员
                        maintenancePhoneNumber: '',// 管理信息-维护员电话
                        maintenanceUseDepartment: '',// 管理信息-使用部门
                        environHazardousLevel: '',// 使用环境信息-防爆等级
                        environProtectionLevel: '',// 使用环境信息-防护等级
                        environWorkTemperature: '',// 使用环境信息-工作温度
                        environRadiate: '',// 使用环境信息-辐射
                        environWorkHumidity: '',// 使用环境信息-环境湿度
                        environWaterproof: '',// 使用环境信息-防水
                        environDustproof: '',// 使用环境信息-防尘
                        reserved1: ''// 预留1
                    },
                    {
                        id: 2,
                        device:"烯烃装置",
                        baseIp: "网关2",
                        baseInstallationMethod: "网关2",
                        baseTrnf: "网关2",
                        baseCommunicationMode: "",
                        gatewayStatus: "",
                        firmManufacturers: "",
                        firmBrand: "",
                        firmSerialNumber: "",
                        firmSize: "",
                        firmWeight: '',
                        firmRatedPower: '',
                        firmFactoryDate: '',
                        firmProductModel: '',
                        firmPhoneNumber: '',
                        constructionUnit: '',
                        constructionPerson: '',
                        constructionPhoneNumber: '',
                        maintenanceDepartment: '',
                        maintenancePerson: '',
                        maintenancePhoneNumber: '',
                        maintenanceUseDepartment: '',
                        environHazardousLevel: '',
                        environProtectionLevel: '',
                        environWorkTemperature: '',
                        environRadiate: '',
                        environWorkHumidity: '',
                        environWaterproof: '',
                        environDustproof: '',
                        reserved1: ''
                    },
                    {
                        id: 3,
                        device:"聚乙烯装置",
                        baseIp: "网关3",
                        baseInstallationMethod: "网关3",
                        baseTrnf: "网关3",
                        baseCommunicationMode: "",
                        gatewayStatus: "",
                        firmManufacturers: "",
                        firmBrand: "",
                        firmSerialNumber: "",
                        firmSize: "",
                        firmWeight: '',
                        firmRatedPower: '',
                        firmFactoryDate: '',
                        firmProductModel: '',
                        firmPhoneNumber: '',
                        constructionUnit: '',
                        constructionPerson: '',
                        constructionPhoneNumber: '',
                        maintenanceDepartment: '',
                        maintenancePerson: '',
                        maintenancePhoneNumber: '',
                        maintenanceUseDepartment: '',
                        environHazardousLevel: '',
                        environProtectionLevel: '',
                        environWorkTemperature: '',
                        environRadiate: '',
                        environWorkHumidity: '',
                        environWaterproof: '',
                        environDustproof: '',
                        reserved1: ''
                    },

                    // 预留更多网关数据...
                ], // 网关信息列表
                currentGateways:[],
                loading: false,
                finished: false,
                showModal: false,
                activeTab: 0,
                editingGateway: {}, // 当前编辑的网关信息
                isSwiping: [], // 记录每个网关是否在滑动状态

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
            initTable(){
                getGatewayList({pageNum: this.pageNum,pageSize: this.pageSize}).then(res =>{
                    if (res){
                        this.currentGateways = res.rows
                        if (res.total <= this.pageSize) this.finished = true
                    }
                } )
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
                this.currentGateways = [...this.geteways]
                this.selectedDevice = device;
                this.currentGateways = this.currentGateways.filter(d=>d.device == device.text)
                this.devicePopupVisible = false;

            },
            clearSearch() {
                this.searchName = '';
            },
            onSearch() {
                // this.currentGateways = [...this.geteways]
                // 点击搜索时的逻辑，比如可以触发一段函数去刷新数据

                getGatewayList({baseName:this.searchName}).then(res=>{
                    if (res.code ==200){
                        this.currentGateways = res.rows
                    }
                })

            },
            loadMore() {

                // TODO: 调用后端接口加载更多网关信息
                if (this.loadingInProgress  || this.finished) return; // 防止重复请求
                this.loadingInProgress = true; // 设置加载状态
                try {
                    // this.loading = true; // 设置 list 的 loading 状态
                    let resData_ = this.getTableData()
                    resData_.then(resData=>{
                        if (resData.rows.length > 0) {
                            this.currentGateways.push(...resData.rows);
                            this.currentGateways= _.uniqWith(this.currentGateways, _.isEqual)

                            if (resData.rows.length >0 && resData.rows.length < this.pageSize){
                                this.finished = true; // 没有更多数据
                                return
                            }
                        }  else {
                            this.finished = true; // 没有更多数据
                        }                    })
                } catch (error) {
                    console.error("获取数据失败:", error);
                } finally {
                    this.loadingInProgress = false; // 重置加载状态
                    this.loading = false; // 清除 loading 状态
                }
            },
            async getTableData(){
                this.pageNum++

                try {
                    const response = await getGatewayList({pageNum: this.pageNum,pageSize: this.pageSize})
                    // 直接获取数据
                    const data = response;
                    return data; // 如果需要返回数据
                } catch (error) {
                    console.error("请求数据失败:", error);
                }
            },
            showAddGatewayModal() {
                this.resetEditingGateway();
                this.showModal = true;
            },
            editGateway(gateway) {
                // this.editingGateway = {...gateway}; // 深拷贝
                this.showModal = true;
                getGatewayInfo(gateway.id).then(res=>{
                    if (res){
                        console.log(res)
                        this.editingGateway = res.data.gatewayInfo
                    }
                })
            },
            closeModal() {
                this.showModal = false;
            },
            saveGateway() {
                if (this.editingGateway.id) {
                    let gatewayInfoAndExtendVo ={
                        gatewayInfo:this.editingGateway,
                        gatewayExtendList:[]
                    }
                    // gatewayInfoAndExtendVo.gatewayInfo.deviceCode = "99"
                    updateGateway(gatewayInfoAndExtendVo).then(res=>{
                        if (res.code == 200) {
                            this.$notify({ type: 'success', message: '修改成功' });
                            this.initTable()
                        } else {
                            this.$notify({ type: 'warning', message: '修改失败' });
                        }
                    })

                } else {
                    let gatewayInfoAndExtendVo ={
                        gatewayInfo:this.editingGateway,
                        gatewayExtendList:[]
                    }
                    // gatewayInfoAndExtendVo.gatewayInfo.deviceCode = "99"
                    addGateway(gatewayInfoAndExtendVo).then(res=>{
                        if (res.code == 200) {
                            this.$notify({ type: 'success', message: '添加成功' });
                            this.initTable()
                        } else {
                            this.$notify({ type: 'warning', message: '添加失败' });
                        }
                    })
                }

                // TODO: 调用后端接口保存网关信息
                this.closeModal();
            },
            deleteGateway(e) {
                const index = this.currentGateways.filter(gateway => gateway.id === e);
                // if (index !== -1) this.currentGateways.splice(index, 1);
                // TODO: 调用后端接口删除网关信息
                console.log(index)
                this.$dialog.confirm({
                    title: '删除提示',
                    message: '确认删除网关'+index[0].baseName,
                }).then(() => {
                    deleteGateway(e).then(res=>{
                        if (res.code ==200){
                            this.$notify({ type: 'success', message: '删除成功' });
                            this.initTable()
                        } else{
                            this.$notify({ type: 'warning', message: '删除失败' });
                        }
                    })
                }).catch(() => {
                    this.$notify({ type: 'warning', message: '取消删除' });
                });
            },
            startTouch(index) {
                this.isSwiping = this.isSwiping.map((_, i) => (i === index ? true : false));
            },
            endTouch() {
                this.isSwiping = this.isSwiping.map(() => false);
            },
            resetEditingGateway() {
                this.editingGateway = {};
            }
        },
        mounted() {
            // TODO: 初始化加载网关信息
            // this.currentGateways = [...this.geteways]
            this.initTable()
        }
    };
</script>

<style scoped>
    .gateway-info {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .gateway-list {
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

