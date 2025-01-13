import request from "@/utils/request";
//获取智能设备详细信息
export const getSensorInfo = (data) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/sensor/baseAndExtendInfo/"+data,

    });
};

//获取传感器数量
export const getSensorCount = (params) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/sensor/count",
        params
    });
};
//获取智能设备列表元素
export const getSensorList = (params) => {
    return request({
        method: "GET",
        url   : "/edgecontrol/sensor/list",
        params
    });
};


//新增智能设备
export const addSensor = (param) => {
    return request({
        method: "POST",
        url : "/edgecontrol/sensor",
        data : param
    });
}

//修改智能设备
export const updateSensor = (param) => {
    return request({
        method: "PUT",
        url : "/edgecontrol/sensor",
        data : param
    });
}

//删除智能设备
export const deleteSensor = (param) => {
    return request({
        method: "DELETE",
        url : "/edgecontrol/sensor/"+param,
    });
}


