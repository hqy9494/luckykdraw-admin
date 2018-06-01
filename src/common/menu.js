const menu = [
  {
    id: "tenant",
    icon: "shop",
    name: "兑奖中心",
    component: "tenant"
  },
  {
    id: "record",
    icon: "profile",
    name: "中奖记录",
    component: "record"
  },
  {
    id: "qrCode",
    icon: "qrcode",
    name: "二维码",
    component: "qrCode"
  },
  {
    id: "equipment",
    icon: "printer",
    name: "设备",
    component: "equipment"
  },
  {
    id: "prizes",
    icon: "gift",
    name: "奖品",
    component: "prizes",
    children: [
      {
        id: "base",
        name: "奖品管理",
        component: "base"
      },
      {
        id: "super",
        name: "超级大奖",
        component: "super"
      },
      {
        id: "coupon",
        name: "优惠券",
        component: "coupon"
      }
    ]
  },
  {
    id: "replenishmenter",
    icon: "printer",
    name: "补货员",
    component: "replenishmenter"
  },
  {
    id: "replenishmenterapply",
    icon: "printer",
    name: "补货员申请",
    component: "replenishmenterapply"
  },
];

export default menu;
