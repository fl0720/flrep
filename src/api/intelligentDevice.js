import request from "@/utils/request";
//获取智能设备详细信息
export const getIntelligentDeviceInfo = (data) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/smartdevice/baseAndExtendInfo/"+data,

    });
};

//获取智能设备数量
export const getIntelligentDeviceCount = (params) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/smartdevice/count",
        params
    });
};

//获取智能设备列表元素
export const getIntelligentDeviceList = (params) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/smartdevice/list",
        params
    });
};


//新增智能设备
export const addIntelligentDevice = (param) => {
    return request({
        method: "POST",
        url : "/edgecontrol/smartdevice",
        data : param
    });
}

//修改智能设备
export const updateIntelligentDevice = (param) => {
    return request({
        method: "PUT",
        url : "/edgecontrol/smartdevice",
        data : param
    });
}

//删除智能设备
export const deleteIntelligentDevice = (param) => {
    return request({
        method: "DELETE",
        url : "/edgecontrol/smartdevice/"+param,
    });
}


