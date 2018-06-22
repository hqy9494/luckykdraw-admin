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
        path: 'record',
        module: 'Records',
        component: 'Record',
        title: '中奖记录'
      },
      // 二维码
      qrCode: {
        path: 'qrCodes/qrCode',
        module: 'QrCodes',
        component: 'QrCode',
        title: '二维码'
      },
      // 二维码批次
      batchNo: {
        path: 'qrCodes/batchNo',
        module: 'QrCodes',
        component: 'QrBatchNo',
        title: '二维码批次'
      },
      // 奖品
      prizeBase: {
        path: 'prizes/base',
        module: 'Prizes',
        component: 'PrizeBase',
        title: '奖品管理'
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
      template: {
        path: 'prizes/template',
        module: 'Prizes',
        component: 'QrTemplate',
        title: '二维码模板',
        subs: {
          templateDetail: {
            path: '/detail/:id',
            module: 'Prizes',
            component: 'QrTemplateDetail',
            title: '二维码模板详情'
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
        title: '设备'
      },
      Replenishmenter: {
        path: 'replenishmenter',
        module: 'Settings',
        component: 'Replenishmenter',
        title: '补货员'
      },
      ReplenishmenterApply: {
        path: 'replenishmenterapply',
        module: 'Settings',
        component: 'ReplenishmenterApply',
        title: '补货员申请'
      },
      evaluate: {
        path: 'evaluate',
        module: 'Settings',
        component: 'Evaluate',
        title: '晒单管理'
      }
    }
  }
};
