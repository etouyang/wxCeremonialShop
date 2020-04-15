import store from '../../store/index';
import create from '../../utils/create';
import shoppingStore from '../../store/shopping.store';
import  {baseUrl} from '../../service/http'
import { 
    getcart,
    opcart
} from '../../service/request'
import { isLogin, shareWX, shareTitle } from '../../service/helper'
const app = getApp()
create(store, {
    data: {
        data: shoppingStore.data,
        checkedAll: false,  // 全选
        count: 0,
        priceAll: 0,  // 总价
        status:true, //true为正常显示，false为显示删除按钮
        startX: 0,
        startY: 0,
        imgurl: '',
        capsuleTop: app.globalData.capsuleTop,
        capsuleHeight: app.globalData.capsuleHeight,
    },
    onLoad: function (options) {
        this.store.data.data = {products:[], theTotal: {}}
        this.update()
        shareWX()
    },
    onShow: function () {
        this.getShoppingListRequest();
        this.setData({
            imgurl: baseUrl.production
        })
    },
    onPullDownRefresh: function () {
        this.getShoppingListRequest();
    },
    getShoppingListRequest() {
        // 购物车列表
        getcart().then(res => {
            wx.stopPullDownRefresh();
            if (res.errno == 0) {
                // console.log(res)
                //组装数据
                res.products = res.products.map(item => { //每个商店
                    item.checkeedAll = false
                    var changedList = [];
                    var typeGroup = item.goods.map(v => {
                        v.checked = false
                        v.delStyle = '';  // 删除按钮的位置
                        v.txtStyle = '';  // 文本层的位置
                        v.price = Number(v.price/100).toFixed(2)
                        return v.type
                    });
                    var flag = [];
                    for(var i = 0; i<typeGroup.length; i++) {
                        var type = typeGroup[i];
                        if(flag[type]) continue;
                        flag[type] = 'ok';
                        var groupArray = item.goods.filter(v => v.type === type);
                        changedList.push(groupArray);
                    }
                    item.goods = changedList;
                    let current = this.store.data.data.products.filter(shop => shop.shopid == item.shopid)
                    if(current.length) {
                        item.checkeedAll = current[0].checkeedAll
                        let goods = item.goods.reduce(function (a, b) { return a.concat(b)} );
                        let goodsCurrent = current[0].goods.reduce(function (a, b) { return a.concat(b)} );
                        goods.forEach(good => {
                            let find = goodsCurrent.filter(select => select.productid == good.productid)
                            if(find.length) {
                                good.checked = find[0].checked
                            }
                        })
                    }
                    return item
                })
                this.store.data.data.products = res.products
                this.store.data.data.theTotal = res.theTotal
                this.update()
            }
        })
    },

    //多选
    checkall: function (e) {
        let index = e.target.dataset.index; //点击元素的下标
        let current = this.data.data.products[index].checkeedAll;
        let dataStatus = 'data.products[' + index + '].checkeedAll'; //当前老师元素下checkeedAll的属性
        let dataGoods = 'data.products[' + index + '].goods'; //当前老师元素下checkeedAll的属性
        let act = this.store.data.data.products[index].goods.map(goods => {
            goods = goods.map(good => {
                good.checked = !current
                return good
            })
            return goods
        })
        this.setData({
            [dataStatus]: !current,
            [dataGoods]: act
        });

        //单选 选中的时候 的结算 为多少  价格为多少
        let count = [];
        let priceAll = 0;
        let data = this.data.data.products;
        for (let b = 0; b < data.length; b++) {
            let datacount;
            datacount = this.localFlat(data[b].goods);
            for (let c = 0; c < datacount.length; c++) {
                if (datacount[c].checked == true) {
                    count.push(datacount[c]);
                    priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                }
            }
        }
        let price = Number(priceAll).toFixed(2);
        this.setData({
            count: (count.length),
            priceAll: price
        });
        this.update();
    },
 
    //单选
    ChecksOne: function (e) {
        let groupIndex = e.target.dataset.groupindex; // 拿到对应的商家的索引
        let indexCoupon = e.target.dataset.indexcoupon;  // 拿到某个商家的那个商品块的索引
        let index = e.target.dataset.index; // 拿到商品快的某个商品的索引

        let list = this.data.data.products[groupIndex].goods[indexCoupon];  // 获取商家某个商品块的所有商品
        let list2 = this.data.data.products[groupIndex].goods[indexCoupon][index].checked;  // 获取当前商家某个商品块下的某一个商品的checked值

        let dataIndexchecked = 'data.products[' + groupIndex + '].goods[' + indexCoupon + '][' + index + '].checked'; //这个可以拿到 data 中 index的老师下的所有课程  数据
        let dataStatus = 'data.products[' + groupIndex + '].checkeedAll'; //当前老师元素下checkeedAll的属性 

        this.setData({
            [dataIndexchecked]: !list2,
        });
        let listcheckedarr = [] //单选 选中的 的课程
        for (let i = 0; i < list.length; i++) {
            if (list[i].checked == true) {
                listcheckedarr.push(list[i]);
            }
        }
        if (list.length === listcheckedarr.length) {
            this.setData({
                [dataStatus]: true
            });
        } else {
            this.setData({
                [dataStatus]: false
            });
        }
        //只有所有单选的 都选中了  当前单选的这块的的父级就会 选中 ，将选中的 父级 添加在一个数组当中 如果过 它本身的数据的length == 它被选中的length 就让  三级的全选 选中

        let data = this.data.data.products;
        let datarr = [];
        for (let a = 0; a < data.length; a++) {
            if (data[a].checkeedAll == true) {
                datarr.push(data[a]);
            }
        }
        if (data.length === datarr.length) {
            this.setData({
                checkedAll: true
            });
        } else {
            this.setData({
                checkedAll: false
            });
        }

        //单选 选中的时候 的结算 为多少  价格为多少
        let count = [];
        let priceAll = 0;
        for (let b = 0; b < data.length; b++) {
            let datacount;

            if(data[b].reduction){
                // datacount = data[b].data.concat(data[b].reduction);
            }else{
                // datacount = data[b].data
                datacount = this.localFlat(data[b].goods);
            }
            for (let c = 0; c < datacount.length; c++) {
                if (datacount[c].checked == true) {
                    count.push(datacount[c]);
                    priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                }
            }
        }
        let price = Number(priceAll).toFixed(2);
        this.setData({
            count: (count.length),
            priceAll: price
        });
    },
    // 三维数组转一维数组
    localFlat(arr){
        return arr.reduce((acc, val) => acc.concat(val),[])
    },
    //全选
    AllTap: function (e) {
        let current = this.data.checkedAll;
        // let dataStatus = 'data.products[' + index + '].checkeedAll'; //当前老师元素下checkeedAll的属性
        let dataGoods = 'data.products'; //当前老师元素下checkeedAll的属性
        let act = this.store.data.data.products.map(shop => {
            shop.checkeedAll = !current
            shop.goods.map(goods => {
                goods.map(good => {
                    good.checked = !current
                    return good
                })
                return goods
            })
            return shop
        })
        this.setData({
            checkedAll: !current,
            [dataGoods]: act
        });
        
        //单选 选中的时候 的结算 为多少  价格为多少
        let count = [];
        let priceAll = 0;
        let data = this.data.data.products;
        for (let b = 0; b < data.length; b++) {
            let datacount;
            datacount = this.localFlat(data[b].goods);
            for (let c = 0; c < datacount.length; c++) {
                if (datacount[c].checked == true) {
                    count.push(datacount[c]);
                    priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                }
            }
        }
        let price = Number(priceAll).toFixed(2);
        this.setData({
            count: (count.length),
            priceAll: price,
        });
        this.update();
    },

    //点击 单个删除 课程
    shanchuTap1: function (e) {
        let that = this;
        let groupIndex = e.currentTarget.dataset.groupindex; // 拿到对应的商家的索引
        let indexCoupon = e.currentTarget.dataset.indexcoupon;  // 拿到某个商家的那个商品块的索引
        let index = e.currentTarget.dataset.index; // 拿到商品快的某个商品的索引
        let list1 = this.data.data;

        wx.showModal({
            title: '',
            content: '确定要删除吗？',
            cancelColor: "#ababab",
            confirmColor: "#027ee7",
            success(res) {
                if (res.confirm) {
                    let list2 = list1.products[groupIndex].goods[indexCoupon];

                    let act = list2[index];
                    let parmes = {
                        urid: '2490',  // 用户id
                        op: 3,  // 1--新增 2--修改 3--删除
                        num: act.num,  // 数量
                        productid: act.productid,  // 商品id
                        sku_id: act.sku_id,  // 商品多属性ID
                        startTime: act.start_time,  // 光明开始时间
                        endTime: act.end_time,  // 光明结束时间
                        prodnum: act.goodsnum,  // 光明每次送奶份数
                        distributionMode: act.distribution_mode, 
                        distributionTime: act.distribution_time,  
                    }
                    opcart(parmes).then(res => {
                        if (res.errno == 0) {
                            that.getShoppingListRequest();
                            return;
                            // console.log(res)
                            list2.splice(index, 1);
                            let dataStatus = 'data.products[' + groupIndex + '].goods['+ indexCoupon +']';

                            //单选 选中的时候 的结算 为多少
                            let count = [];
                            let priceAll = 0;
                            for (let b = 0; b < list1.products.length; b++) {
                                let datacount;
                                datacount = that.localFlat(list1.products[b].goods);
                                for (let c = 0; c < datacount.length; c++) {
                                    if (datacount[c].checked == true) {
                                        count.push(datacount[c]);
                                        priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                                    }
                                }
                            }
                            let price = Number(priceAll).toFixed(2);

                            that.setData({
                                [dataStatus]: list2,
                                count: (count.length),
                                priceAll: price
                            });
                            wx.showToast({
                                title: '删除成功',
                                icon: "none",
                            })
                        }
                    })
                    
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });
    },
    shanchuTap2: function (e) {
        let that = this;
        let groupIndex = e.currentTarget.dataset.groupindex; // 拿到老师的index
        let index = e.currentTarget.dataset.index; // 拿到当前课程 的index
        let list1 = this.data.data;
        // console.log(e)
        wx.showModal({
            title: '',
            content: '确定要删除吗？',
            cancelColor: "#ababab",
            confirmColor: "#027ee7",
            success(res) {
                if (res.confirm) {
                    let list2 = that.data.data[groupIndex].reduction;
                    list2.splice(index, 1);
                    let reductionStatus = 'data[' + groupIndex + '].reduction';
                    let count = [];
                    let priceAll = 0;
                    for (let b = 0; b < list1.length; b++) {
                        // let datacount = list1[b].data;
                        let datacount;
                        if(list1[b].reduction){
                            datacount = list1[b].data.concat(list1[b].reduction);
                        }else{
                            datacount = list1[b].data
                        }
                        for (let c = 0; c < datacount.length; c++) {
                            if (datacount[c].checked == true) {
                                count.push(datacount[c]);
                                priceAll += datacount[c].price;
                            }
                        }
                    }
                    let price = Number(priceAll).toFixed(2);

                    that.setData({
                        [reductionStatus]: list2,
                        count: (count.length),
                        priceAll: price
                    });
                    wx.showToast({
                        title: '删除成功',
                        icon: "none",
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });
    },
    //点击加减按钮  
    numchangeTap1(e) {
        let groupIndex = e.target.dataset.groupindex, //拿到对应的商家的索引        
            indexCoupon = e.target.dataset.indexcoupon, //拿到某个商家的那个商品块的索引        
            index = e.target.dataset.index, //拿到商品快的某个商品的索引        
            shopcar = this.data.data,
            types = e.target.dataset.types; //是加号还是减号   
        switch (types) {
            case 'add':
                shopcar.products[groupIndex].goods[indexCoupon][index].num++;
                break;
            case 'minus':
                shopcar.products[groupIndex].goods[indexCoupon][index].num--; //对应商品的数量-1
                if(shopcar.products[groupIndex].goods[indexCoupon][index].num < 1){
                    shopcar.products[groupIndex].goods[indexCoupon][index].num = 1;
                    return;
                } 
                break;
        }

        // 购物车列表
        let act = shopcar.products[groupIndex].goods[indexCoupon][index];
        let parmes = {
            urid: '2490',  // 用户id
            op: 2,  // 1--新增 2--修改 3--删除
            num: act.num,  // 数量
            productid: act.productid,  // 商品id
            sku_id: act.sku_id,  // 商品多属性ID
            startTime: act.start_time,  // 光明开始时间
            endTime: act.end_time,  // 光明结束时间
            prodnum: act.goodsnum,  // 光明每次送奶份数
            distributionMode: act.distribution_mode, 
            distributionTime: act.distribution_time,  
        }
        opcart(parmes).then(res => {
            if (res.errno == 0) {
                // console.log(res)
            }
        })

        let priceAll = 0;
        let count = [];
        for (let b = 0; b < shopcar.products.length; b++) {
            // let datacount = shopcar[b].data;
            let datacount;
            // if(shopcar[b].reduction){
            //     datacount = shopcar[b].data.concat(shopcar[b].reduction);
            // }else{
            //     datacount = shopcar[b].data
            // }
            datacount = this.localFlat(shopcar.products[b].goods);
            for (let c = 0; c < datacount.length; c++) {
                if (datacount[c].checked == true) {
                    priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                    count.push(datacount[c]);
                }
            }
        }
        let price = Number(priceAll).toFixed(2);
        this.setData({
            data: shopcar,
            count: (count.length),
            priceAll: price
        });
    },
    numchangeTap2(e) {
        let fath_Index = e.target.dataset.groupindex, //点击的商品下标值        
            child_Index = e.target.dataset.index, //点击的商品下标值        
            shopcar = this.data.data,
            types = e.target.dataset.types, //是加号还是减号        
            total = this.data.priceAll; //总计 
        switch (types) {
            case 'add':
                if(shopcar[fath_Index].reduction[child_Index].checked) shopcar[fath_Index].reduction[child_Index].num++; //对应商品的数量+1  
                if(shopcar[fath_Index].reduction[child_Index].checked) {
                    if(shopcar[fath_Index].reduction[child_Index].num >10 ){  // 限购买10件
                        shopcar[fath_Index].reduction[child_Index].num = 10;
                        return false
                    }
                }     
                // shopcar[fath_Index].data[child_Index].checked && (total = (Number(total)+Number(shopcar[fath_Index].data[child_Index].price)).toFixed(2)); //如果商品为选中的，则合计价格+商品单价      
                break;
            case 'minus':
                if(shopcar[fath_Index].reduction[child_Index].checked) shopcar[fath_Index].reduction[child_Index].num--; //对应商品的数量-1 
                if(shopcar[fath_Index].reduction[child_Index].checked) {
                    if(shopcar[fath_Index].reduction[child_Index].num < 1){
                        shopcar[fath_Index].reduction[child_Index].num = 1;
                        return false
                    }
                } 
                // shopcar[fath_Index].data[child_Index].checked && (total = (Number(total)-Number(shopcar[fath_Index].data[child_Index].price)).toFixed(2)); //如果商品为选中的，则合计价格-商品单价   
                break;
        }
        let priceAll = 0;
        let count = [];
        for (let b = 0; b < shopcar.length; b++) {
            // let datacount = shopcar[b].data;
            let datacount;
            if(shopcar[b].reduction){
                datacount = shopcar[b].data.concat(shopcar[b].reduction);
            }else{
                datacount = shopcar[b].data
            }
            for (let c = 0; c < datacount.length; c++) {
                if (datacount[c].checked == true) {
                    priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                    count.push(datacount[c]);
                }
            }
        }
        let price = Number(priceAll).toFixed(2);
        this.setData({
            data: shopcar,
            count: (count.length),
            priceAll: price
        });
    },
    // 数量可输入
    watchInpu(e) {
        // let priceAll = 0;
        // let fath_Index = e.target.dataset.groupindex, //点击的商品下标值        
        //     child_Index = e.target.dataset.index, //点击的商品下标值        
        //     shopcar = this.data.data;
        // let data = this.data.data;
        // shopcar[fath_Index].data[child_Index].num = e.detail.value;
        // for (let b = 0; b < data.length; b++) {
        //     let datacount = data[b].data;
        //     for (let c = 0; c < datacount.length; c++) {
        //         if (datacount[c].checked == true) {
        //             priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
        //         }
        //     }
        // }
        // let price = Number(priceAll).toFixed(2);
        // this.setData({
        //     priceAll: price
        // });
        this.minInput(e);
    },
    // 失去焦点的时候触发的事件
    minInput(e) {
        let groupIndex = e.target.dataset.groupindex, //拿到对应的商家的索引        
            indexCoupon = e.target.dataset.indexcoupon, //拿到某个商家的那个商品块的索引        
            index = e.target.dataset.index, //拿到商品快的某个商品的索引        
            shopcar = this.data.data;   
        
        if(e.detail.value == 0){
            e.detail.value = 1
        }

        // if(e.detail.value > 10){  // 限购10件
        //     e.detail.value = 10;
        // }

        shopcar.products[groupIndex].goods[indexCoupon][index].num = e.detail.value;
        if(shopcar.products[groupIndex].goods[indexCoupon][index].num && shopcar.products[groupIndex].goods[indexCoupon][index].num != '' && shopcar.products[groupIndex].goods[indexCoupon][index].num != 'null' && shopcar.products[groupIndex].goods[indexCoupon][index].num != 'undefined'){
            let priceAll = 0;
            let count = [];
            for (let b = 0; b < shopcar.products.length; b++) {
                let datacount = this.localFlat(shopcar.products[b].goods);
                for (let c = 0; c < datacount.length; c++) {
                    if (datacount[c].checked == true) {
                        priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                        count.push(datacount[c]);
                    }
                }
            }
            let price = Number(priceAll).toFixed(2);
            this.setData({
                data: shopcar,
                count: (count.length),
                priceAll: price
            });
        }else{
            shopcar.products[groupIndex].goods[indexCoupon][index].num = 1;
            
            let count = [];
            let priceAll = 0;
            for (let b = 0; b < shopcar.products.length; b++) {
                let datacount = this.localFlat(shopcar.products[b].goods);
                for (let c = 0; c < datacount.length; c++) {
                    if (datacount[c].checked == true) {
                        count.push(datacount[c]);
                        priceAll = Number(priceAll) + (Number(datacount[c].price)*Number(datacount[c].num));
                    }
                }
            }
            let price = Number(priceAll).toFixed(2);
            this.setData({
                count: (count.length),
                data: shopcar,
                priceAll: price
            });
        }

        let act = shopcar.products[groupIndex].goods[indexCoupon][index];
        let parmes = {
            urid: '2490',  // 用户id
            op: 2,  // 1--新增 2--修改 3--删除
            num: act.num,  // 数量
            productid: act.productid,  // 商品id
            sku_id: act.sku_id,  // 商品多属性ID
            startTime: act.start_time,  // 光明开始时间
            endTime: act.end_time,  // 光明结束时间
            prodnum: act.goodsnum,  // 光明每次送奶份数
            distributionMode: act.distribution_mode, 
            distributionTime: act.distribution_time,  
        }
        opcart(parmes).then(res => {
            if (res.errno == 0) {
                // console.log(res)
            }
        })
    },

    // 手指滑动打开和关闭删除按钮
    touchS1(e) {
        // 获得起始坐标
        // this.startX = e.touches[0].clientX;
        // this.startY = e.touches[0].clientY;
        if(e.touches.length==1){
            this.setData({
                //设置触摸起始点水平方向位置
                startX:e.touches[0].clientX,
                startY: e.touches[0].clientY,
            });
        }
    },
    touchM1(e) {
        if(e.touches.length==1){
            // 获得当前坐标
            let currentX = e.touches[0].clientX;
            let currentY = e.touches[0].clientY;
            const x = this.data.startX - currentX; //横向移动距离
            const y = Math.abs(this.data.startY - currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
            let delBtnWidth = 120;
            let txtStyle = '';
            let delStyle = '';
            if(x < -10 && y < 50){//向右滑
                let a2 = 120-x
                txtStyle = "right:"+x+"rpx";
                delStyle = "right:-"+a2+"rpx";
                if(x <= '-120'){
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "right:"+delBtnWidth+"rpx";
                    delStyle = "right:-120rpx";
                }
            }else if(x > 10 && y < 50 ){//向左滑是显示删除
                let a1 = 120-x
                txtStyle = "left:-"+x+"rpx";
                delStyle = "right:-"+a1+"rpx";
                if(x>=delBtnWidth){
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-"+delBtnWidth+"rpx";
                    delStyle = "right:0rpx";
                }
            };
            //获取手指触摸的是哪一项
            let groupIndex = e.currentTarget.dataset.groupindex; // 拿到对应的商家的索引
            let indexCoupon = e.currentTarget.dataset.indexcoupon;  // 拿到某个商家的那个商品块的索引
            let index = e.currentTarget.dataset.index; // 拿到商品快的某个商品的索引

            // let list = this.data.data; //获取到了 当前老师元素的 下的所有课
            // let list1 = list[groupIndex].data
            let list = this.data.data;
            let list1 = this.data.data.products[groupIndex].goods[indexCoupon]
            if(index >= 0){
                list1[index].txtStyle = txtStyle; 
                list1[index].delStyle = delStyle; 
                //更新列表的状态
                this.setData({
                  data:list
                });
            }
        }
        
    },

    touchS2(e) {
        // 获得起始坐标
        // this.startX = e.touches[0].clientX;
        // this.startY = e.touches[0].clientY;
        if(e.touches.length==1){
            this.setData({
                //设置触摸起始点水平方向位置
                startX:e.touches[0].clientX,
                startY: e.touches[0].clientY,
            });
        }
    },
    touchM2(e) {
        if(e.touches.length==1){
            // 获得当前坐标
            let currentX = e.touches[0].clientX;
            let currentY = e.touches[0].clientY;
            const x = this.data.startX - currentX; //横向移动距离
            const y = Math.abs(this.data.startY - currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
            let delBtnWidth = 120;
            let txtStyle = '';
            let delStyle = '';
            if(x < -10 && y < 50){//向右滑
                let a2 = 120-x
                txtStyle = "right:"+x+"rpx";
                delStyle = "right:-"+a2+"rpx";
                if(x <= '-120'){
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "right:"+delBtnWidth+"rpx";
                    delStyle = "right:-120rpx";
                }
            }else if(x > 10 && y < 50 ){//向左滑是显示删除
                let a1 = 120-x
                txtStyle = "left:-"+x+"rpx";
                delStyle = "right:-"+a1+"rpx";
                if(x>=delBtnWidth){
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-"+delBtnWidth+"rpx";
                    delStyle = "right:0rpx";
                }
            };
             //获取手指触摸的是哪一项
             let groupIndex = e.currentTarget.dataset.groupindex; // 拿到老师的index
             let index = e.currentTarget.dataset.index; // 拿到当前课程 的index
             let list = this.data.data; //获取到了 当前老师元素的 下的所有课
             let list1 = list[groupIndex].reduction
            if(index >= 0){
                list1[index].txtStyle = txtStyle; 
                list1[index].delStyle = delStyle; 
                //更新列表的状态
                this.setData({
                  data:list
                });
            }
        }
        
    },
    // 跳转到商品详情页
    product_details(e) {
        if (!isLogin()) return
        let item = e.currentTarget.dataset.item
        const payload = { "id": item.productid }
        wx.navigateTo({
            url: '/pages/goodsDetail/goodsDetail?payload=' + JSON.stringify(payload)
        })
    },
    // 领取优惠券
    receive_coupon() {
        if (!isLogin()) return
        wx.showModal({
            title: '提示',
            content: '没有具体说明或者老页面或者UI设计稿参考',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 凑单
    single_order() {
        if (!isLogin()) return
        wx.showModal({
            title: '提示',
            content: '没有具体说明或者老页面或者UI设计稿参考',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    // 结算
    Settlement(){
        if (!isLogin()) return
        let products = [];

        let data = this.data.data.products;
        for (let b = 0; b < data.length; b++) {
            let datacount;
            datacount = this.localFlat(data[b].goods);
            datacount.forEach(item => {
                if(item.checked){
                    products.push({
                        num: item.num,
                        productid: item.productid,
                        skuid: item.sku_id,
                        shopid: item.shopid,
                        goodsnum: item.goodsnum,
                        prodnum: item.goodsnum,
                        startDate: item.start_time,
                        endDate: item.end_time,
                        distributionMode: item.distribution_mode,
                        distributionTime: item.distribution_time
                    })
                }
            })
        }
        wx.navigateTo({
            url:'/pages/order/order?payload=' + JSON.stringify({products: JSON.stringify(products), "type": 1})
        })
    },
    rightFuc() {
        wx.navigateTo({url:'/pages/message/message'})
    },
    onShareAppMessage: function (options) {
        if (options.from === 'button') {
          // 来自页面内转发按钮
          console.log(options.target)
        }
        return {
          title: shareTitle(),
          desc: '', 
          path: 'pages/home/home',
          success: function(res) {
            wx.showToast({
                title: '转发成功',
                icon: 'success',
                duration: 1000
            })
          },
          fail: function() {
            wx.showToast({
              title: '转发失败',
              icon: 'fail',
              duration: 1000
            })
          }
        }
      },
})
