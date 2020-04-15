import homeStore from './home.store';
import prolistStore from './prolist.store';
import shoppingStore from './shopping.store';
import mineStore from './mine.store';
import groupStore from './group.store';
import secondStore from './second.store';
import goodsStore from './goodsDetail.store';
import searchStore from './search.store';
import orderStore from './order.store';
import addressStore from './address.store'

export default {
    data: {
        home: homeStore.data, //首页
        prolist: prolistStore.data, //分类
        data: shoppingStore.data, //购物车
        mine: mineStore.data, //我的
        group: groupStore.data, //拼团列表
        second: secondStore.data, //秒杀列表
        goods: goodsStore.data, //商品详情
        search: searchStore.data, //搜索
        order: orderStore.data, //订单
        addressList: addressStore.data, //地址列表
        hasRegisterUserInfo: false,
        registerUserInfo: null,
        green: null,
    },

  }