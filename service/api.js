const homeApi = {
    home: '/homeapi/newindex', //首页  1-热销 2-新品 3-爆款 4-其他 5-推荐
    banner: '/homeapi/bannerlist', //banner请求
    tuanSearch: '/meituanbuyapi/grouponsearch', //团购搜索
    getcoupon: '/mallapi/getcouponlist', //搜索 拼团/秒杀 列表 /更多
    searchSearch: '/mallapi/getcategory', //搜索
    msg: '/api/message', //消息列表
    arealist: '/mallapivue/arealist' //小区列表
}

//拼团秒杀
const couponApi = {
    couponDetail: '/couponapi/congoods', //拼团商品详情
    userList: '/couponapi/userlist', //拼团用户列表
}

const goodsApi = {
    goodsDetail: '/mallapi/detail', //商品详情
    goodsEval: '/apivue/getevallist', //商品评论
    goodsKu: '/apivue/productsku', //商品属性 (规格)
    shop: '/shopapi/index', //店铺
    shopGoods: '/shopapi/indexlist', //店铺商品
    shopSearch: '/shopapi/goodssearch' //店铺内搜索
}

const shoppingApi = {
    getcart:'/mallapi/getcart',  // 购物车列表
    opcart:'/mallapi/opcart',  // 商品加减，删除
}

const nearbyApi = {

}

const categoryApi = {
    list: '/mallapi/category'
}

const orderApi = {
    orderCheck: '/mallapi/checkout', //订单确认
    // address: '/userapi/opaddr',  //地址信息
    address: '/homeapi/opaddr', //地址信息
    buy: '/mallapi/buy', //提交订单
    wxpay: '/antpay/wxpay',
    addShopCar: '/mallapi/opcart', //添加购物车
    cancelOrder: '/antpay/cancelorderapply', //退款
    deleteOrder: '/mallapi/delorders',//删除订单
    detailOrder: '/mallapi/orderdetail', //订单详情
    changeOrder: '/mallapi/orderreceipt', //延长收货/确认收货/催促发货/查看物流
    changeAddress: '/mallapivue/addressinfo', //修改地址
    fapiao: '/mallapivue/wxuserainvoice' //发票
}

const userApi = {
    sendCode: '/api/sendcode', //短信验证码
    login: '/apivue/login', //登录
    loginWX: '/apivue/loginout', //登录微信
    userInfo: '/apivue/getuserinfo', //获取头像信息
    encry: '/apivue/getencrypted', //wx加密信息
    wxInfo: '/apivue/getwxinfo', //获取微信token

    orderlist: '/mallapi/orderlist',   // 获取订单信息
}

const commonApi = {
    shopcoupon: '/couponapi/getcoupon', //店铺优惠券
    userCoupon: '/couponapi/usercouponlist', //用户优惠券
    addcoupon: '/couponapi/addcoupon', //领取优惠券
    upload: '/apivue/imgupload', //图片上传
    pinjia: '/apivue/createeval', //评价
    problem: '/homeapi/ask', //意见反馈
    city: '/mallapivue/arealists', //城市列表
    green: '/mallapivue/cardinfo',  //四季生活卡信息 urid: 2526, cardtype: 1
    greenPay: '/mallapivue/buycard', //四季卡支付 urid: 2526, card_id: 1,channel: 4
    greenList: '/mallapi/category' //四季生活卡支持列表 categoryId: '',urid: 2526,page: 1,cardId: 1
}

export default {
    homeApi,
    couponApi,
    goodsApi,
    nearbyApi,
    categoryApi,
    orderApi,
    userApi,
    commonApi,
    shoppingApi
}
