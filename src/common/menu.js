const menu = [
  {
    id: "statistic",
    icon: "line-chart",
    name: "数据统计",
    component: "statistic",
    children: [{
      id: "allStatistic",
      name: "数据统计",
      component: "allStatistic"
    }, {
      id: "rangeStatistic",
      name: "动态统计",
      component: "rangeStatistic?id=HyLQBLUg7"
    }, {
      id: "boxDetailStatistic",
      name: "设备数据",
      component: "boxDetailStatistic"
    }, {
      id: "saleDetailStatistic",
      name: "销售数据",
      component: "saleDetailStatistic"
    }, {
      id: "wechatDetailStatistic",
      name: "微信数据",
      component: "wechatDetailStatistic"
    }]
  },
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
      // {
      //   id: "template",
      //   name: "奖品模板",
      //   component: "template"
      // },
      // {
      //   id: "specification",
      //   name: "奖品规格",
      //   component: "specification"
      // },
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
  },
  {
    id: "regions",
    icon: "environment-o",
    name: "区域管理",
    component: "regions"
  },
  {
    id: "setting",
    icon: "safety",
    name: "超级管理员",
    component: "safety",
    children: [
      {
        id: "roleManager",
        name: "角色管理",
        component: "roleManager"
      },
      {
        id: "menuManager",
        name: "菜单管理",
        component: "menuManager"
      },
      {
        id: "staffManager",
        name: "员工管理",
        component: "staffManager"
      }
    ]
  },
  {
    id: "buyTimesAward",
    icon: "user",
    name: "多次购买",
    component: "buyTimesAward",
    children: [
      {
        id: "userList",
        name: "用户列表",
        component: "userList"
      },
      {
        id: "awards",
        name: "奖品列表",
        component: "awards"
      },
      {
        id: "awardRecords",
        name: "派发列表",
        component: "awardRecords"
      }
    ]
  },
  {
    id: "PostActive",
    icon: "sound",
    name: "活动",
    component: "PostActive"
  },
  {
    id: "award",
    icon: "coffee",
    name: "奖项管理",
    component: "Award",
    children: [
      {
        id: "AwardList",
        name: "奖项列表",
        component: "AwardList"
      },
      {
        id: "WinningList",
        name: "中奖列表",
        component: "WinningList"
      },
      {
        id: "AwardManagement",
        name: "奖品管理",
        component: "AwardManagement"
      }
    ]
  },
];

export default menu;
