import request from "@/utils/request";
//获取网关详细信息
export const getGatewayInfo = (data) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/gateway/baseAndExtendInfo/"+data,

    });
};

//获取网关列表元素
export const getGatewayList = (params) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/gateway/list",
        params
    });
};
//获取网关数量
export const getGatewayCount = (params) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/gateway/count",
        params
    });
};


//新增网关
export const addGateway = (param) => {
    return request({
        method: "POST",
        url : "/edgecontrol/gateway",
        data : param
    });
}

//修改网关
export const updateGateway = (param) => {
    return request({
        method: "PUT",
        url : "/edgecontrol/gateway",
        data : param
    });
}

//修改网关
export const deleteGateway = (param) => {
    return request({
        method: "DELETE",
        url : "/edgecontrol/gateway/"+param,
    });
}


