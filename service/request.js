import fetch, {baseUrl} from './http'
import API from './api'
// 分类列表
export const categorylistRequest = (data) => fetch(API.categoryApi.list, data, 'GET')
//首页
export const homeRequest = (data) => fetch(API.homeApi.home, data, 'GET')
//banner
export const bannerRequest = (data) => fetch(API.homeApi.banner, data, 'GET')
//搜索
export const searchRequest = (data) => fetch(API.homeApi.searchSearch, data, 'GET')
//商品详情
export const goodsDetailRequest = (data) => fetch(API.goodsApi.goodsDetail, data, 'GET')
export const goodsEvalRequest = (data) => fetch(API.goodsApi.goodsEval, data, 'GET')
export const goodsKuRequest = (data) => fetch(API.goodsApi.goodsKu, data, 'GET')
//团购搜索
export const tuanRequest = (data) => fetch(API.homeApi.tuanSearch, data, 'GET')
//团购列表
export const couponRequest = (data) => fetch(API.homeApi.getcoupon, data, 'GET')
//团购商品详情
export const couponDetailRequest = (data) => fetch(API.couponApi.couponDetail, data, 'GET')
//团购用户列表
export const couponUserRequest = (data) => fetch(API.couponApi.userList, data, 'GET')
//秒杀列表
export const secondRequest = (data) => fetch(API.homeApi.getcoupon, data, 'GET')
//秒杀商品详情
export const secondDetailRequest = (data) => fetch(API.couponApi.couponDetail, data, 'GET')


// 购物车列表
export const getcart = (data) => fetch(API.shoppingApi.getcart, data, 'GET')
export const opcart = (data) => fetch(API.shoppingApi.opcart, data, 'GET')

//登录
export const loginRequest = (jsCode) => fetch(API.userApi.wxInfo, {jsCode, type: '1'}, 'POST')
export const loginWXRequest = (data) => fetch(API.userApi.loginWX, data, 'GET')
export const loginEncryRequest = (data) => fetch(API.userApi.encry, data, 'POST')
export const loginUserInfoRequest = (data) => fetch(API.userApi.userInfo, data, 'POST')
export const sendCodeRequest = (data) => fetch(API.userApi.sendCode, data, 'GET')
export const loginPhoneRequest = (data) => fetch(API.userApi.login, data, 'POST')
export const loginOrderlist = (data) => fetch(API.userApi.orderlist, data, 'GET')

//订单确认
export const orderCheckRequest = (data) => fetch(API.orderApi.orderCheck, data, 'POST')
export const addressRequest = (data) => fetch(API.orderApi.address, data, 'GET')
export const buyRequest = (data) => fetch(API.orderApi.buy, data, 'GET')
export const addCarRequest = (data) => fetch(API.orderApi.addShopCar, data, 'GET')
export const cancelOrderRequest = (data) => fetch(API.orderApi.cancelOrder, data, 'GET')
export const deleteOrderRequest = (data) => fetch(API.orderApi.deleteOrder, data, 'GET')
export const detailOrderRequest = (data) => fetch(API.orderApi.detailOrder, data, 'GET')
export const changeOrderRequest = (data) => fetch(API.orderApi.changeOrder, data, 'GET')
export const changeAddressRequest = (data) => fetch(API.orderApi.changeAddress, data, 'GET')
export const fapiaoRequest = (data) => fetch(API.orderApi.fapiao, data, 'POST')

//支付
export const wxPayRequest = (data) => fetch(API.orderApi.wxpay, data, 'POST')

//店铺
export const shopRequest = (data) => fetch(API.goodsApi.shop, data, 'GET')
export const shopGoodsRequest = (data) => fetch(API.goodsApi.shopGoods, data, 'GET')
export const shopSearchRequest = (data) => fetch(API.goodsApi.shopSearch, data, 'GET')

//小区列表
export const arealistRequest = (data) => fetch(API.homeApi.arealist, data, 'GET')

//优惠券
export const shopcouponRequest = (data) => fetch(API.commonApi.shopcoupon, data, 'GET')
export const userCouponRequest = (data) => fetch(API.commonApi.userCoupon, data, 'GET')
export const getCouponRequest = (data) => fetch(API.commonApi.addcoupon, data, 'GET')

//评价
export const pingjiaRequest = (data) => fetch(API.commonApi.pinjia, data, 'POST')
//意见反馈
export const problemRequest = (data) => fetch(API.commonApi.problem, data, 'POST')
export const cityRequest = (data) => fetch(API.commonApi.city, data, 'GET')
export const greenRequest = (data) => fetch(API.commonApi.green, data, 'GET')
export const greenPayRequest = (data) => fetch(API.commonApi.greenPay, data, 'GET')
export const greenListRequest = (data) => fetch(API.commonApi.greenList, data, 'GET')