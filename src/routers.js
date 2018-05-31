export default {
  home: {
    module: "",
    path: "/",
    redirect: "/tenant",
    subs: {
      //主页
      dashboard: {
        path: "dashboard",
        module: "Indexs",
        component: "Index",
        title: "主页"
      },
      //兑奖中心
      tenant: {
        path: "tenant",
        module: "Tenants",
        component: "Tenant",
        title: "兑奖中心"
      },
      //中奖记录
      tenant: {
        path: "record",
        module: "Records",
        component: "Record",
        title: "中奖记录"
      },
      //二维码
      qrCode: {
        path: "qrCode",
        module: "QrCodes",
        component: "QrCode",
        title: "二维码"
      },
      //奖品
      prizeBase: {
        path: "prize/base",
        module: "Prizes",
        component: "PrizeBase",
        title: "奖品管理"
      },
      prizeSuper: {
        path: "prize/super",
        module: "Prizes",
        component: "PrizeSuper",
        title: "超级大奖"
      },
      prizeCoupon: {
        path: "prize/coupon",
        module: "Prizes",
        component: "PrizeCoupon",
        title: "优惠券"
      },
      //库存
      balance: {
        path: "balance",
        module: "Balances",
        component: "Balance",
        title: "库存"
      },
      //设备
      equipment: {
        path: "equipment",
        module: "Equipments",
        component: "Equipment",
        title: "设备"
      }
    }
  }
};
