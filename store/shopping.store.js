export default {
    data: {
        products: [
            // {
            //     name: "蓝调小生1",
            //     index: 0,
            //     state: 0,
            //     checkeedAll: false,
            //     data: [
            //         {
            //             url: "http://bd.eacase.com/budongimg/zuixin1.png",
            //             classtitle: "钢琴1阿加莎暑期哇撒打算就很尴尬杀菌的阿斯顿哈师大和",
            //             description: '按规划圣诞节嘎斯三安光电九七五八杠',
            //             index: 0,
            //             state: 0,
            //             checked: false,
            //             price: 9,
            //             num: 1,
            //             stock: 0,  // 1--无库存 0--有库存
            //             range: 0,  // 0--每超出配送范围 1--超出配送范围
            //             txtStyle: '',  // 文本层的位置
            //             delStyle: '',  // 删除按钮的位置
            //         }, {
            //             url: "http://bd.eacase.com/budongimg/zuixin1.png",
            //             classtitle: "吉他1",
            //             description: '按规划圣诞节嘎斯三安光电九七五八杠',
            //             index: 1,
            //             state: 0,
            //             checked: false,
            //             price: 7,
            //             num: 1,
            //             stock: 1,  // 1--无库存 0--有库存
            //             range: 0,  // 0--每超出配送范围 1--超出配送范围
            //             txtStyle: '',  // 文本层的位置
            //             delStyle: '',  // 删除按钮的位置
            //         },
            //         {
            //             url: "http://bd.eacase.com/budongimg/zuixin1.png",
            //             classtitle: "吉他1",
            //             description: '按规划圣诞节嘎斯爱国运动撒起就',
            //             index: 2,
            //             state: 0,
            //             checked: false,
            //             price: 4.9,
            //             num: 1,
            //             stock: 0,  // 1--无库存 0--有库存
            //             range: 1,  // 0--每超出配送范围 1--超出配送范围
            //             txtStyle: '',  // 文本层的位置
            //             delStyle: '',  // 删除按钮的位置
            //         }
            //     ],
            //     reduction: [
            //         {
            //             url: "http://bd.eacase.com/budongimg/zuixin1.png",
            //             classtitle: "吉他1",
            //             description: '按规划圣诞节嘎斯爱国运动撒起就',
            //             index: 0,
            //             state: 0,
            //             checked: false,
            //             price: 5,
            //             num: 1,
            //             stock: 0,  // 1--无库存 0--有库存
            //             range: 1,  // 0--每超出配送范围 1--超出配送范围
            //             txtStyle: '',  // 文本层的位置
            //             delStyle: '',  // 删除按钮的位置
            //         }
            //     ]
            // },
            // {
            //     shopname: "夫人乐整衣（上海）有限公司",
            //     shopid: "47",
            //     checkeedAll: false,
            //     goods:[
            //         [
            //             {
            //                 num:"190",
            //                 checked: false,
            //                 cartprice:"2000.00",
            //                 user_id:"355",
            //                 updated_at:"2019-05-13 15:16:45",
            //                 cart_id:"34",
            //                 productid:"1783",
            //                 sku_id:"-1",
            //                 start_time:"0000-00-00",
            //                 end_time:"0000-00-00",
            //                 distribution_mode:"1",
            //                 distribution_time:"1",
            //                 goodsnum:"",
            //                 name:"【T恤/领带/衬衫/西裤/春夏马甲背心】洗衣/干洗/熨烫/夫人乐",
            //                 shopid:"47",
            //                 stock:"10000",
            //                 market_price:"2800",
            //                 price:"2000",
            //                 sprice:"0",
            //                 txtStyle: '',  // 文本层的位置
            //                 delStyle: '',  // 删除按钮的位置
            //                 imgs:[
            //                     "/upload/2018083100205558193303.jpg",
            //                     "/upload/2018090521444861022554.jpg",
            //                     "/upload/2018090521444856133067.jpg"
            //                 ],
            //                 sales:"100",
            //                 sku:"每日18点前联络确认上门服务时间",
            //                 card_id:"0",
            //                 shopname:"夫人乐整衣（上海）有限公司",
            //                 discount:"90",
            //                 disprice:"200",
            //                 couponinfo:{
            //                     id:"30",
            //                     name:"单品满100减1",
            //                     money:"100",
            //                     type:"4",
            //                     createdtime:"2019-01-04 16:26:12",
            //                     sid:"1783"
            //                 }
            //             },
            //             {
            //                 num:"190",
            //                 checked: false,
            //                 cartprice:"2000.00",
            //                 user_id:"355",
            //                 updated_at:"2019-05-13 15:16:45",
            //                 cart_id:"34",
            //                 productid:"1783",
            //                 sku_id:"-1",
            //                 start_time:"0000-00-00",
            //                 end_time:"0000-00-00",
            //                 distribution_mode:"1",
            //                 distribution_time:"1",
            //                 goodsnum:"",
            //                 name:"【T恤/领带/衬衫/西裤/春夏马甲背心】洗衣/干洗/熨烫/夫人乐",
            //                 shopid:"47",
            //                 stock:"10000",
            //                 market_price:"2800",
            //                 price:"2000",
            //                 sprice:"0",
            //                 txtStyle: '',  // 文本层的位置
            //                 delStyle: '',  // 删除按钮的位置
            //                 imgs:[
            //                     "/upload/2018083100205558193303.jpg",
            //                     "/upload/2018090521444861022554.jpg",
            //                     "/upload/2018090521444856133067.jpg"
            //                 ],
            //                 sales:"100",
            //                 sku:"每日18点前联络确认上门服务时间",
            //                 card_id:"0",
            //                 shopname:"夫人乐整衣（上海）有限公司",
            //                 discount:"90",
            //                 disprice:"200",
            //                 couponinfo:{
            //                     id:"30",
            //                     name:"单品满100减1",
            //                     money:"100",
            //                     type:"4",
            //                     createdtime:"2019-01-04 16:26:12",
            //                     sid:"1783"
            //                 }
            //             }
            //         ],
            //         [
            //             {
            //                 num:"190",
            //                 checked: false,
            //                 cartprice:"2000.00",
            //                 user_id:"355",
            //                 updated_at:"2019-05-13 15:16:45",
            //                 cart_id:"34",
            //                 productid:"1783",
            //                 sku_id:"-1",
            //                 start_time:"0000-00-00",
            //                 end_time:"0000-00-00",
            //                 distribution_mode:"1",
            //                 distribution_time:"1",
            //                 goodsnum:"",
            //                 name:"【T恤/领带/衬衫/西裤/春夏马甲背心】洗衣/干洗/熨烫/夫人乐",
            //                 shopid:"47",
            //                 stock:"10000",
            //                 market_price:"2800",
            //                 price:"2000",
            //                 sprice:"0",
            //                 txtStyle: '',  // 文本层的位置
            //                 delStyle: '',  // 删除按钮的位置
            //                 imgs:[
            //                     "/upload/2018083100205558193303.jpg",
            //                     "/upload/2018090521444861022554.jpg",
            //                     "/upload/2018090521444856133067.jpg"
            //                 ],
            //                 sales:"100",
            //                 sku:"每日18点前联络确认上门服务时间",
            //                 card_id:"0",
            //                 shopname:"夫人乐整衣（上海）有限公司",
            //                 discount:"90",
            //                 disprice:"200",
            //                 couponinfo:{
            //                     id:"30",
            //                     name:"单品满100减2",
            //                     money:"100",
            //                     type:"3",
            //                     createdtime:"2019-01-04 16:26:12",
            //                     sid:"1783"
            //                 }
            //             }
            //         ]
            //     ]
            // },
            // {
            //     shopname: "夫人乐整衣（上海）有限公司",
            //     shopid: "47",
            //     checkeedAll: false,
            //     goods:[
            //         [
            //             {
            //                 num:"190",
            //                 checked: false,
            //                 cartprice:"2000.00",
            //                 user_id:"355",
            //                 updated_at:"2019-05-13 15:16:45",
            //                 cart_id:"34",
            //                 productid:"1783",
            //                 sku_id:"-1",
            //                 start_time:"0000-00-00",
            //                 end_time:"0000-00-00",
            //                 distribution_mode:"1",
            //                 distribution_time:"1",
            //                 goodsnum:"",
            //                 name:"【T恤/领带/衬衫/西裤/春夏马甲背心】洗衣/干洗/熨烫/夫人乐",
            //                 shopid:"47",
            //                 stock:"10000",
            //                 market_price:"2800",
            //                 price:"2000",
            //                 sprice:"0",
            //                 txtStyle: '',  // 文本层的位置
            //                 delStyle: '',  // 删除按钮的位置
            //                 imgs:[
            //                     "/upload/2018083100205558193303.jpg",
            //                     "/upload/2018090521444861022554.jpg",
            //                     "/upload/2018090521444856133067.jpg"
            //                 ],
            //                 sales:"100",
            //                 sku:"每日18点前联络确认上门服务时间",
            //                 card_id:"0",
            //                 shopname:"夫人乐整衣（上海）有限公司",
            //                 discount:"90",
            //                 disprice:"200",
            //                 couponinfo:{
            //                     id:"30",
            //                     name:"单品满100减1",
            //                     money:"100",
            //                     type:"4",
            //                     createdtime:"2019-01-04 16:26:12",
            //                     sid:"1783"
            //                 }
            //             },
            //             {
            //                 num:"190",
            //                 checked: false,
            //                 cartprice:"2000.00",
            //                 user_id:"355",
            //                 updated_at:"2019-05-13 15:16:45",
            //                 cart_id:"34",
            //                 productid:"1783",
            //                 sku_id:"-1",
            //                 start_time:"0000-00-00",
            //                 end_time:"0000-00-00",
            //                 distribution_mode:"1",
            //                 distribution_time:"1",
            //                 goodsnum:"",
            //                 name:"【T恤/领带/衬衫/西裤/春夏马甲背心】洗衣/干洗/熨烫/夫人乐",
            //                 shopid:"47",
            //                 stock:"10000",
            //                 market_price:"2800",
            //                 price:"2000",
            //                 sprice:"0",
            //                 imgs:[
            //                     "/upload/2018083100205558193303.jpg",
            //                     "/upload/2018090521444861022554.jpg",
            //                     "/upload/2018090521444856133067.jpg"
            //                 ],
            //                 sales:"100",
            //                 sku:"每日18点前联络确认上门服务时间",
            //                 card_id:"0",
            //                 shopname:"夫人乐整衣（上海）有限公司",
            //                 discount:"90",
            //                 disprice:"200",
            //                 couponinfo:{
            //                     id:"30",
            //                     name:"单品满100减1",
            //                     money:"100",
            //                     type:"4",
            //                     createdtime:"2019-01-04 16:26:12",
            //                     sid:"1783"
            //                 }
            //             }
            //         ],
            //         [
            //             {
            //                 num:"190",
            //                 checked: false,
            //                 cartprice:"2000.00",
            //                 user_id:"355",
            //                 updated_at:"2019-05-13 15:16:45",
            //                 cart_id:"34",
            //                 productid:"1783",
            //                 sku_id:"-1",
            //                 start_time:"0000-00-00",
            //                 end_time:"0000-00-00",
            //                 distribution_mode:"1",
            //                 distribution_time:"1",
            //                 goodsnum:"",
            //                 name:"【T恤/领带/衬衫/西裤/春夏马甲背心】洗衣/干洗/熨烫/夫人乐",
            //                 shopid:"47",
            //                 stock:"10000",
            //                 market_price:"2800",
            //                 price:"2000",
            //                 sprice:"0",
            //                 imgs:[
            //                     "/upload/2018083100205558193303.jpg",
            //                     "/upload/2018090521444861022554.jpg",
            //                     "/upload/2018090521444856133067.jpg"
            //                 ],
            //                 sales:"100",
            //                 sku:"每日18点前联络确认上门服务时间",
            //                 card_id:"0",
            //                 shopname:"夫人乐整衣（上海）有限公司",
            //                 discount:"90",
            //                 disprice:"200",
            //                 couponinfo:{
            //                     id:"30",
            //                     name:"单品满100减2",
            //                     money:"100",
            //                     type:"3",
            //                     createdtime:"2019-01-04 16:26:12",
            //                     sid:"1783"
            //                 }
            //             }
            //         ]
            //     ]
            // }
        ],
        theTotal: {
            // totalprice: "385700",
            // totalnums: "195"
        }
    }
}