import request from '../../axios/http';

export function getSales(query) {
  return request({
    url: '/afterSale/getAfterSaleList',
    method: 'post',
    params: query

  });
}

export function salesDetail(query) {
  return request({
    url: '/afterSale/getAfterSaleDetail',
    method: 'get',
    params: query

  });
}
export function addsalesRemark(query) {
  return request({
    url: '/afterSale/updateDealNote',
    method: 'post',
    params: query

  });
}


export function delsalesRemark(query) {
  return request({
    url: '/afterSale/delDealNote',
    method: 'post',
    params: query

  });
}

export function agreeRefound(id,type,remark,moduleType,form) {
  return request({
    url: '/afterSale/agreeReturnRefund?id='+id+'&type='+type+'&remark='+remark+'&moduleType='+moduleType,
    method: 'post',
     data:form

  });
}

export function rejectRefound(id,type,remark,moduleType,form) {
  return request({
    url: '/afterSale/unAgreeReturnRefund?id='+id+'&type='+type+'&remark='+remark+'&moduleType='+moduleType,
    method: 'post',
     data:form

  });
}

export function agreeRefoundOnly(id,type,remark,moduleType,amount,form) {
  return request({
    url: '/afterSale/agreeRefund?id='+id+'&type='+type+'&remark='+remark+'&moduleType='+moduleType+'&amount='+amount,
    method: 'post',
     data:form

  });
}