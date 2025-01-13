<template>
    <div class="container">
        <div class="container-top">
            <!-- <div>标签名称</div> -->
        </div>
        <div class="container-middle">
            <div class="content">
                <div class="child" v-for="(item, index) in changeList" @click="handleChange(item.path)">
                    <i :class="item.icon" :style="{ color: item.color }"></i>
                    <div class="name">{{ item.name }}</div>
                </div>
            </div>
        </div>
        <div class="container-bottom">
            <div></div>
            <div class="content">
                <ul class="check-list-ul">
                    <li class="check-list-li" v-for="(item, index) in dataList" :key="index">
                        <div
                                style="display: flex;justify-content: space-between;padding-bottom: 10px;border-bottom: 1px solid #D8DFE5;">
                            <div class="title">
                                <!--                        <van-checkbox :name="item.id"></van-checkbox>-->
                                <span style="padding-left: -1px;">{{ item.deviceName }}</span>
                            </div>
                        </div>
                        <div class="cont"  >
                            <div >
                                <span >在线</span><span class="statistics" >{{ item.onLine }}</span>
                            </div>
                            <div >
                                <span >离线</span>
                                <span class="statistics">{{ item.offLine }}</span>
                            </div>
                            <div>
                                <span >合计</span>
                                <span class="statistics">{{ item.onLine+item.offLine }}</span>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
        </div>

    </div>
</template>

<script>
    // import {getListByPage, getNewManualAssayList, getProductAnomalyList} from '@/request/api'
    import NoData from '../components/NoData.vue'
    import {getGatewayCount} from "@/api/gateway";
    import {getIntelligentDeviceCount} from "@/api/intelligentDevice";
    import {getSensorCount} from "@/api/sensor";

    export default {
        components: {
            NoData
        },
        data() {
            return {
                dataList: [
                    {
                        id:1,
                        deviceName: '网关设备',
                        gatewayCount: 10,
                        gatewayOn: 20,
                        gatewayOff: 5,
                    }
                ], // 列表数据
                changeList: [
                    {
                        name: '网关设备',
                        type: 'wg',
                        icon: 'iconfont icon-wangguan',
                        dage: 0,
                        path: '/gateway',
                        color: '#fbf96e'
                    }, {
                        name: '传感器',
                        type: 'cgq',
                        icon: 'iconfont icon-icons-speed',
                        dage: 0,
                        path: '/sensor',
                        color: '#12A38B'
                    }, {
                        name: '智能设备',
                        type: 'znsb',
                        icon: 'iconfont icon-zhinengshebei',
                        dage: 0,
                        path: '/device',
                        color: '#2A8DCA'
                    },
                ],
                alarmList: [],
                alarmNum: 0,
                productList: {
                    PP: {
                        items: []
                    },
                    PE: {
                        items: []
                    }
                },
                testList: [],
                showConfirm: true
            };
        },
        mounted() {
            this.initData()
        },
        methods: {
            async initData(){
                this.dataList = []
                let gatewatCount = await getGatewayCount();
                gatewatCount.data.deviceName = "网关设备"
                let inDeviceCount = await getIntelligentDeviceCount();
                inDeviceCount.data.deviceName = "智能装备"
                let senorCount = await getSensorCount();
                senorCount.data.deviceName = "传感器"
                this.dataList.push(gatewatCount.data)
                this.dataList.push(inDeviceCount.data)
                this.dataList.push(senorCount.data)
                console.log(this.dataList)
            },
        }
    }
</script>
<style lang="scss" scoped>
    .overlay {
        height: 100px;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        left: calc(50vw - 50px);
        top: calc(50vh - 50px);
        border-radius: 10px;
    }

    .container {
        padding: 15px 10px;
        // height: 100vh;
        box-sizing: border-box;
        background: #F2F2F2;

        .container-top {
            div {
                border: 1px solid #999999;
                border-radius: 6px;
                margin: 5px 10px;
                background: #fff;
                color: #999999;
            }
        }

        .container-middle {
            .content {
                display: flex;
                justify-content: space-around;
                padding: 15px 0;
                background: #fff;
                border-radius: 6px;
            }

            .child {
                .iconfont {
                    font-size: 50px;
                }
                .name {
                    margin-top: 5px;
                    color: #555050;
                    font-size: 15px;
                }
            }
        }

        .container-bottom {
            margin-top: 10px;
            .content {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                background: #fff;
                border-radius: 6px;

                .check-list-ul {
                    width: 100%;
                    /*display: block;*/

                    .check-list-li {
                        line-height: 32px;
                        background: #fff;
                        border-radius: 6px;
                        margin: 7px;
                        padding: 7px;
                        box-shadow: 1px 1px 2px 0px #f7cfd1;
                        margin-top: 9px;

                        .title {
                            display: flex;
                            // justify-content: center;
                            align-items: center;
                            font-size: 16px;
                            font-weight: 550;
                            color: #333333;
                        }
                        .cont {
                            div {
                                font-size: 16px;
                                display: block;
                                .statistics {
                                    float: right;
                                }
                            }
                        }

                    }

                }
            }


        }
    }

</style>
