import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Grid } from "react-bootstrap";
import LongTopBar from "./LongTopBar";
import BoxInfoBar from "./BoxInfoBar"
import BuyerStatisticBox from "./BuyerStatisticBox"
import BuyAgainInfoBox from "./BuyAgainInfoBox"
import BoxRank from "./BoxRank"
import DailyBoxSale from "./DailyBoxSale"
import SevenDayInfo from "./SevenDayInfo"
import moment from "moment"
import styles from "./index.scss";

export class Statistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getWechatCount();
    this.getSaleCount();
    this.getBoxInfo();
    this.getBuyerStatistic();
    this.getBoxRank();
    this.getSevenDaysInfo();
    this.getBuyTimesByDay();
  }

  componentWillReceiveProps(nextProps) {

  }

  getWechatCount() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/wechatStatistic'
      },
      this.uuid,
      "wechatCount",
      wechatCount => {
        this.setState({ wechatCount: wechatCount });
      }
    );
  }

  getSaleCount() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/saleStatistic'
      },
      this.uuid,
      "saleCount",
      saleCount => {
        this.setState({ saleCount: saleCount });
      }
    );
  }

  getBoxInfo() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/boxStatistic'
      },
      this.uuid,
      "boxesInfo",
      boxesInfo => {
        this.setState({ boxesInfo: boxesInfo });
      }
    );
  }

  getBuyerStatistic() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/buyerStatistic'
      },
      this.uuid,
      "buyersStatistic",
      buyersStatistic => {
        this.setState({ buyersStatistic: buyersStatistic });
      }
    );
  }

  getBoxRank() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/boxRank'
      },
      this.uuid,
      "boxRank",
      boxRank => {
        this.setState({ boxRank: boxRank });
      }
    );
  }

  getSevenDaysInfo() {
    for (let i = 0; i < 7; i++) {
      this.props.rts(
        {
          method: "get",
          url: `/Statistics/mainPageDailyStatistic?date=${moment().subtract(i, "day").format("YYYY-MM-DD")}`
        },
        this.uuid,
        `seven${i}`,
        result => {
          let newstate = {};
          newstate[`seven${i}`] = result;
          this.setState(newstate);
        }
      );
    }
  }

  getBuyTimesByDay() {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/getBuyTimesByDay?day=${moment().format("YYYY-MM-DD")}`
      },
      this.uuid,
      "buyTimes",
      buyTimes => {
        this.setState({ buyTimes: buyTimes });
      }
    );
  }

  render() {
    let { wechatCount, saleCount, boxesInfo, buyersStatistic, boxRank, buyTimes } = this.state;
    let { seven0, seven1, seven2, seven3, seven4, seven5, seven6} = this.state;
    wechatCount = wechatCount || {};
    let wechatContent = [
      {key: "微信关注总人数", value: wechatCount.followingCount || 0},
      {key: "今日新增", value: wechatCount.followToday || 0},
      {key: "今日取关", value: wechatCount.cancelFollow || 0},
      {key: "关注男女比", value: (wechatCount.manFollow || 0) + '/' + (wechatCount.womanFollow || 0)}
    ];

    saleCount = saleCount || {};
    let saleContent = [
      {key: "扫码销售额", value: saleCount.saleSum || 0},
      {key: "今日派出奖金", value: saleCount.sendToday || 0},
      {key: "中奖池累积金额", value: saleCount.zjcljje || 0},
      {key: "大奖池累积金额", value: saleCount.djljje || 0}
    ];

    boxesInfo = boxesInfo || {};
    let boxesContent = [
      {key: "全部设备数量", value: boxesInfo.boxCount || 0, background: "#1069c9"},
      {key: "今日扫码设备", value: boxesInfo.dayActiveBoxCount || 0, background: "#fd996b"},
      {key: "今日扫码盒数", value: boxesInfo.pondCount || 0, background: "#ca3538"},
      {key: "购买男女比例", value: `${boxesInfo.manRate}%/${boxesInfo.womanRate}%`, background: "#6acb9a"}
    ];

    buyersStatistic = buyersStatistic || {};

    let boxAverage = {
      dailySaleAverage: parseFloat(saleCount.saleSum/boxesInfo.boxCount).toFixed(2),
      dailySendAverage: parseFloat(saleCount.sendToday/boxesInfo.boxCount).toFixed(2),
      dailyBoxAverage: parseFloat((boxesInfo.pondCount || 0)/boxesInfo.boxCount).toFixed(2),
      dailyUserAverage: parseFloat(wechatCount.followToday/boxesInfo.boxCount).toFixed(2)
    };

    return (
      <Grid fluid>
        <LongTopBar title="微信概况" content={wechatContent} icon="wechat" color="#42ae3d" />
        <LongTopBar title="销售数据" content={saleContent} icon="wallet" color="#152678" />
        <BoxInfoBar title="设备数据" content={boxesContent} icon="printer" color="#2197d8"  />
        <BuyerStatisticBox content={buyersStatistic} />
        <div style={{width: "2%", float: "left", height: 1}} />
        <BuyAgainInfoBox content={buyTimes} />
        <BoxRank content={boxRank} />
        <DailyBoxSale content={boxAverage}/>
        <SevenDayInfo content={{seven0,seven1,seven2,seven3,seven4,seven5,seven6}} />
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const Replenishmenteruuid = state => state.get("rts").get("uuid");
const tenant = state => state.get("rts").get("tenant");

const mapStateToProps = createStructuredSelector({
  Replenishmenteruuid,
  tenant
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statistic);
