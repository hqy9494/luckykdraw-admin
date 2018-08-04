import ReplenishmenterApply from './containers/Settings/ReplenishmenterApply';

export default {
  home: {
    module: '',
    path: '/',
    redirect: '/tenant',
    subs: {
      // 主页
      dashboard: {
        path: 'dashboard',
        module: 'Indexs',
        component: 'Index',
        title: '主页'
      },
      // 兑奖中心
      tenant: {
        path: 'tenant',
        module: 'Tenants',
        component: 'Tenant',
        title: '兑奖中心'
      },
      // 中奖记录
      record: {
        path: 'record/base',
        module: 'Records',
        component: 'Record',
        title: '中奖记录'
      },
      superRecord: {
        path: 'Record/super',
        module: 'Records',
        component: 'SuperRecord',
        title: '大奖记录'
      },
      // 二维码
      qrCode: {
        path: 'qrCodes/qrCode',
        module: 'QrCodes',
        component: 'QrCode',
        title: '二维码'
      },
      // 二维码批次(生成)
      batchNo: {
        path: 'qrCodes/batchNo',
        module: 'QrCodes',
        component: 'QrBatchNo',
        title: '批次生成'
      },
      // 二维码批次（状态）
      batchNoUse: {
        path: 'qrCodes/batchNoUse',
        module: 'QrCodes',
        component: 'QrBatchNoUse',
        title: '批次状态'
      },
      // 奖品
      prizeAward: {
        path: 'prizes/award',
        module: 'Prizes',
        component: 'PrizeAward',
        title: '奖项管理'
      },
      awardSetting: {
        path: 'prizes/awardSetting',
        module: 'Prizes',
        component: 'AwardSetting',
        title: '设备奖项设置'
      },
      prizeBase: {
        path: 'prizes/base',
        module: 'Prizes',
        component: 'PrizeBase',
        title: '奖品管理'
      },
      PrizeShiwu: {
        path: 'prizes/shiwu',
        module: 'Prizes',
        component: 'PrizeShiwu',
        title: '实物奖品'
      },
      prizeSuper: {
        path: 'prizes/super',
        module: 'Prizes',
        component: 'PrizeSuper',
        title: '超级大奖'
      },
      prizeCoupon: {
        path: 'prizes/coupon',
        module: 'Prizes',
        component: 'PrizeCoupon',
        title: '优惠券'
      },
      clue: {
        path: 'prizes/clue',
        module: 'Prizes',
        component: 'Clue',
        title: '线索'
      },
      template: {
        path: 'prizes/template',
        module: 'Prizes',
        component: 'QrTemplate',
        title: '奖品模板',
        subs: {
          templateDetail: {
            path: '/detail/:id',
            module: 'Prizes',
            component: 'QrTemplateDetail',
            title: '奖品模板详情'
          }
        }
      },
      specification: {
        path: 'prizes/specification',
        module: 'Prizes',
        component: 'Specification',
        title: '商品规格'
      },
      // 库存
      balance: {
        path: 'balance',
        module: 'Balances',
        component: 'Balance',
        title: '库存'
      },
      // 设备
      equipment: {
        path: 'equipment',
        module: 'Equipments',
        component: 'Equipment',
        title: '设备',
        subs: {
          equipmentDetail: {
            path: '/detail/:id',
            module: 'Equipments',
            component: 'EquipmentDetail',
            title: '设备中奖模板'
          }
        }
      },
      Replenishmenter: {
        path: 'replenishment/staff',
        module: 'Settings',
        component: 'Replenishmenter',
        title: '补货员'
      },
      ReplenishmenterApply: {
        path: 'replenishment/apply',
        module: 'Settings',
        component: 'ReplenishmenterApply',
        title: '补货员申请'
      },
      evaluate: {
        path: 'evaluate',
        module: 'Settings',
        component: 'Evaluate',
        title: '晒单管理'
      },
      Statistic: {
        path: 'statistic',
        module: 'Statistic',
        component: 'Statistic',
        title: '统计',
        subs: {
          allStatistic: {
            path: '/allStatistic',
            module: 'Statistic',
            component: 'Statistic',
            title: '统计'
          },
          RangeStatistic: {
            path: '/rangeStatistic',
            module: 'Statistic',
            component: 'RangeStatistic',
            title: '动态统计'
          },
          BoxDetailStatistic: {
            path: '/boxDetailStatistic',
            module: 'Statistic',
            component: 'BoxDetailStatistic',
            title: '设备数据'
          },
          SaleDetailStatistic: {
            path: '/saleDetailStatistic',
            module: 'Statistic',
            component: 'SaleDetailStatistic',
            title: '销售数据'
          },
          WechatDetailStatistic: {
            path: '/wechatDetailStatistic',
            module: 'Statistic',
            component: 'WechatDetailStatistic',
            title: '微信数据'
          }
        }
      },
      StockAwardConsume: {
        path: 'prizes/consume/1',
        module: 'Prizes',
        component: 'StockAwardConsume',
        title: '中奖池消耗'
      },
      BigStockAwardConsume: {
        path: 'prizes/consume/2',
        module: 'Prizes',
        component: 'StockAwardConsume',
        title: '大奖池消耗'
      },
      Region: {
        path: 'regions',
        module: 'Region',
        component: 'Region',
        title: '区域管理'
      }
    }
  }
};
