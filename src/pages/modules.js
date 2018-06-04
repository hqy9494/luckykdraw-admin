import Index from "./Indexs/Index";
//
import Tenant from "./Tenants/Tenant";
//
import QrCode from "./QrCodes/QrCode";
import QrBatchNo from "./QrCodes/QrBatchNo";
//
import PrizeSuper from "./Prizes/PrizeSuper";
import PrizeBase from "./Prizes/PrizeBase";
import PrizeCoupon from "./Prizes/PrizeCoupon";
import QrTemplate from "./Prizes/QrTemplate";
import QrTemplateDetail from "./Prizes/QrTemplateDetail";
//
import Balance from "./Balances/Balance";
//
import Equipment from "./Equipments/Equipment";
//
import Record from "./Records/Record";
import Replenishmenter from "./Settings/Replenishmenter";
import ReplenishmenterApply from "./Settings/ReplenishmenterApply";

const modules = {
  Index,
  Tenant,
  QrCode,
  QrBatchNo,
  QrTemplate,
  QrTemplateDetail,
  PrizeSuper,
  PrizeBase,
  PrizeCoupon,
  Balance,
  Equipment,
  Record,
  Replenishmenter,
  ReplenishmenterApply
};

export default modules;
