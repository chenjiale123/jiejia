import request from '../../axios/http';

export function getOrder(data) {
  return request({
    url: '/order/getOrderList',
    method: 'post',
    data

  });
}
export function srueOrder(query) {
  return request({
    url: '/order/affirmOrder',
    method: 'post',
    params: query

  });
}
export function cancelOrder(query) {
  return request({
    url: '/order/cancelOrder',
    method: 'post',
    params: query

  });
}
export function agreeBack(query) {
  return request({
    url: '/order/consentRefund',
    method: 'post',
    params: query

  });
}
export function getDetail(query) {
  return request({
    url: '/order/getOrderDetail',
    method: 'post',
    params: query

  });
}
export function addRemark(query) {
  return request({
    url: '/order/editOrderSystemRemark',
    method: 'post',
    params: query

  });
}
export function delRemark(query) {
  return request({
    url: '/order/deleteOrderSystemRemark',
    method: 'post',
    params: query

  });
}