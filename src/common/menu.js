const menu = [
  {
    key: "index",
    module: "Indexs",
    title: "首页",
    icon: "home",
    path: "/index"
  },
  {
    key: "order",
    module: "Order",
    title: "订单",
    icon: "file-text",
    sub: [
      {
        key: "orders",
        title: "订单"
      }
    ]
  },
  {
    key: "device",
    module: "Device",
    title: "设备",
    icon: "hdd",
    sub: [
      {
        key: "devices",
        title: "设备管理"
      },
      {
        key: "operate",
        title: "运维管理"
      }
      // {
      //   key: "devices/realTime",
      //   title: "设备实时情况"
      // },
      // {
      //   key: "replenishments",
      //   title: "补货管理"
      // },
      // {
      //   key: "devices/statistic",
      //   title: "统计列表"
      // }
      // {
      //   key: "stores",
      //   title: "店铺管理"
      // }
    ]
  },
  {
    key: "places",
    module: "Places",
    title: "商户",
    icon: "environment",
    sub: [
      {
        key: "address",
        title: "商户管理"
      },
      {
        key: "area",
        title: "区域管理"
      }
    ]
  },
  {
    key: "goods",
    module: "Goods",
    title: "货品",
    icon: "shopping-cart",
    sub: [
      {
        key: "goodsList",
        title: "货品管理"
      },
      {
        key: "goodsShelf",
        title: "货道管理"
      },
      {
        key: "goodsSupplement",
        title: "补货管理"
      }
    ]
  },
  {
    key: "user",
    module: "User",
    title: "用户管理",
    icon: "user",
    sub: [
      {
        key: "users",
        title: "用户管理"
      }
    ]
  },
  {
    key: "setting",
    module: "Setting",
    title: "设置",
    icon: "setting",
    sub: [
      {
        key: "members",
        title: "管理员管理"
      },
      {
        key: "supplementer",
        title: "补货员管理"
      },
      {
        key: "apply",
        title: "申请管理"
      },
      {
        key: "agency",
        title: "代理管理"
      },
      {
        key: "answer",
        title: "问答管理"
      }
    ]
  },
  {
    key: "templates",
    module: "Templates",
    title: "模板",
    icon: "layout",
    sub: [
      {
        key: "template",
        title: "模板管理"
      }
    ]
  }
];

export default menu;
