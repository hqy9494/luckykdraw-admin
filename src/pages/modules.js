import Index from './Indexs/Index.jsx';
//
import Tenant from './Tenants/Tenant';
//
import QrCode from './QrCodes/QrCode';
import QrBatchNo from './QrCodes/QrBatchNo';
import QrBatchNoUse from './QrCodes/QrBatchNoUse.jsx';
//
import PrizeSuper from './Prizes/PrizeSuper';
import PrizeBase from './Prizes/PrizeBase';
import PrizeShiwu from './Prizes/PrizeShiwu';
import PrizeCoupon from './Prizes/PrizeCoupon';
import QrTemplate from './Prizes/QrTemplate';
import QrTemplateDetail from './Prizes/QrTemplateDetail';
import Specification from './Prizes/Specification';
import Clue from './Prizes/Clue';
import PrizeAward from './Prizes/PrizeAward';
import AwardSetting from './Prizes/AwardSetting';
import StockAwardConsume from './Prizes/StockAwardConsume';
import PrizeList from './Prizes/PrizeList';
//
import Balance from './Balances/Balance';
//
import Equipment from './Equipments/Equipment.jsx';
//
import Record from './Records/Record';
import SuperRecord from './Records/SuperRecord';
import Replenishmenter from './Settings/Replenishmenter.jsx';
import ReplenishmenterApply from './Settings/ReplenishmenterApply';
import Evaluate from './Settings/Evaluate';
import Statistic from './Statistic/index';
import Region from './Region/index'
import RangeStatistic from './Statistic/chooseIndex'
import BoxDetailStatistic from './Statistic/boxDetailStatistic'
import SaleDetailStatistic from './Statistic/saleDetailStatistic'
import WechatDetailStatistic from './Statistic/wechatDetailStatistic'

import StaffManager from "./Settings/StaffManager";
import StaffManagerAdd from "./Settings/StaffManagerAdd";
import StaffManagerDetail from "./Settings/StaffManagerDetail";
import RoleManager from "./Settings/RoleManager";
import RoleManagerAdd from "./Settings/RoleManagerAdd";
import RoleManagerDetail from "./Settings/RoleManagerDetail";
import MenuManager from "./Settings/MenuManager";
import MenuManagerAdd from "./Settings/MenuManagerAdd";
import MenuManagerDetail from "./Settings/MenuManagerDetail";

import UserList from "./BuyTimesAward/UserList"
import UserBuyList from "./BuyTimesAward/UserBuyList"
import Award from "./BuyTimesAward/Award"
import AwardRecord from "./BuyTimesAward/AwardRecord"

import PostActive from "./Settings/PostActive"
import StockAward from "./Prizes/StockAward"

// Award
import AwardList from "./Award/AwardList"
import AwardEdit from "./Award/AwardEdit"
import AwardListSetting from "./Award/AwardListSetting"
import AwardManagement from "./Award/AwardManagement"
import AwardManagementSetting from "./Award/AwardManagementSetting"
import WinningList from "./Award/WinningList"
import WinningSetting from "./Award/WinningSetting"
import AwardAgainList from "./Award/AwardAgainList"
import AwardAgainSetting from "./Award/AwardAgainSetting"
import AwardWeight from "./Award/AwardWeight"


//DefineAward
import DefineAwardList from "./DefineAward/DefineAwardList";
import DefineAwardSetting from "./DefineAward/DefineAwardSetting";
import DefineAwardDetail from "./DefineAward/DefineAwardDetail";

//Magnifiy
import DoubleAwardSetting from "./DoubleAward/DoubleAwardSetting";
import DoubleAwardsList from "./DoubleAward/DoubleAwardsList";


const modules = {
  Index,
  Tenant,
  QrCode,
  QrBatchNo,
  QrBatchNoUse,
  QrTemplate,
  QrTemplateDetail,
  Specification,
  Clue,
  PrizeAward,
  AwardSetting,
  PrizeSuper,
  PrizeBase,
  PrizeShiwu,
  PrizeCoupon,
  Balance,
  Equipment,
  Record,
  SuperRecord,
  Replenishmenter,
  ReplenishmenterApply,
  Evaluate,
  Statistic,
  StockAwardConsume,
  Region,
  RangeStatistic,
  BoxDetailStatistic,
  SaleDetailStatistic,
  WechatDetailStatistic,
  StaffManager,
  StaffManagerAdd,
  StaffManagerDetail,
  RoleManager,
  RoleManagerAdd,
  RoleManagerDetail,
  MenuManager,
  MenuManagerAdd,
  MenuManagerDetail,
  UserList,
  UserBuyList,
  Award,
  AwardRecord,
  PostActive,
  StockAward,
  PrizeList,

  AwardList,
  AwardEdit,
  AwardListSetting,
  AwardManagement,
  AwardManagementSetting,
  WinningList,
  WinningSetting,
  AwardAgainList,
  AwardAgainSetting,
  AwardWeight,

  //定制中将
  DefineAwardList,
  DefineAwardSetting,
  DefineAwardDetail,

  //奖品翻倍活动
  DoubleAwardSetting,
  DoubleAwardsList,
};

export default modules;
