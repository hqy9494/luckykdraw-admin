const menu = [{
    id: "tenant",
    icon: "shop",
    name: "兑奖中心",
    component: "tenant"
  },
  {
    id: "record",
    icon: "profile",
    name: "中奖记录",
    component: "record",
    children: [{
      id: "base",
      name: "中奖记录",
      component: "base"
    },
    {
      id: "super",
      name: "大奖记录",
      component: "super"
    }
  ]
  },
  {
    id: "qrCodes",
    icon: "qrcode",
    name: "制码",
    component: "qrCodes",
    children: [{
        id: "qrCode",
        name: "二维码生成",
        component: "qrCode"
      },
      {
        id: "batchNo",
        name: "批次生成",
        component: "batchNo"
      },
      {
        id: "batchNoUse",
        name: "批次状态",
        component: "batchNoUse"
      }
    ]
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
    children: [{
        id: "award",
        name: "奖项管理",
        component: "award"
      },
      {
        id: "awardSetting",
        name: "设备奖项设置",
        component: "awardSetting"
      },
      {
        id: "base",
        name: "奖品管理",
        component: "base"
      },
      {
        id: "shiwu",
        name: "实物奖品",
        component: "shiwu"
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
      },
      {
        id: "template",
        name: "奖品模板",
        component: "template"
      },
      {
        id: "specification",
        name: "奖品规格",
        component: "specification"
      },
      {
        id: "clue",
        name: "线索",
        component: "clue"
      },
      {
        id: "consume/1",
        name: "中奖池消耗",
        component: "consume/1"
      },
      {
        id: "consume/2",
        name: "大奖池消耗",
        component: "consume/2"
      }
    ]
  },
  {
    id: "replenishment",
    icon: "printer",
    name: "补货",
    component: "replenishment",
    children: [{
        id: "staff",
        name: "补货员管理",
        component: "staff"
      },
      {
        id: "apply",
        name: "申请管理",
        component: "apply"
      },
    ]
  },
  {
    id: "Evaluate",
    icon: "message",
    name: "晒单",
    component: "Evaluate"
  }
];

export default menu;
