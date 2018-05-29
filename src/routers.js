export default {
  home: {
    module: "",
    path: "/",
    redirect: "/dashboard",
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
      //二维码
      qrCode: {
        path: "qrCode",
        module: "QrCodes",
        component: "QrCode",
        title: "二维码"
      },
      //奖品
      prize: {
        path: "prize",
        module: "Prizes",
        component: "Prize",
        title: "奖品"
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
      },
      
    }
  }
};
