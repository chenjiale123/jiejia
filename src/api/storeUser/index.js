import request from '../../axios/http';

export function getStoreUserList(query) {
  return request({
    url: '/storeUser/findStoreUserList',
    method: 'get',
    params: query

  });
}

export function getStoreTree(query) {
  return request({
    url: '/store/findStoreTree',
    method: 'get',
    params: query

  });
}

export function addStoreStaff(loginid, username, phone, gender, provinceCode, cityCode, areaCode, address, storeIds, remark,  password, form) {
  return request({
    url: '/storeUser/addStoreUser?loginid=' + loginid + '&username=' + username + '&phone=' + phone + '&gender=' + gender + '&provinceCode=' + provinceCode + '&cityCode=' + cityCode + '&areaCode=' + areaCode + '&address=' +
      address +  '&storeIds=' + storeIds + '&remark=' + remark  + '&password=' + password,
    method: 'post',
    data: form

  });
}
export function getStoreDetail(query) {
  return request({
    url: '/storeUser/findStoreUserDetail',
    method: 'get',
    params: query

  });
}

export function updStoreStatus(query) {
  return request({
    url: '/storeUser/auditStoreUser',
    method: 'post',
    params: query
  });
}

export function updStoreUser(id, loginid, username, phone, gender, provinceCode, cityCode, areaCode, address, storeIds, remark,  formDatas) {
  return request({
    url: '/storeUser/updStoreUser?id=' + id + '&loginid=' + loginid + '&username=' + username + '&phone=' + phone + '&gender=' + gender + '&provinceCode=' + provinceCode + '&cityCode=' + cityCode + '&areaCode=' + areaCode + '&address=' +
      address +  '&storeIds=' + storeIds + '&remark=' + remark ,
    method: 'post',
    data: formDatas
  });
}
