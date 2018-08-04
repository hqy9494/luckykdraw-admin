import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Grid } from "react-bootstrap";
import LongTopBar from "./LongTopBar";
import BoxInfoBar from "./BoxInfoBar"
import BuyerStatisticBox from "./BuyerStatisticBox"
import BuyAgainInfoBox from "./BuyAgainInfoBox"
import RankTable from "./RankTable"
import SevenDayInfo from "./SevenDayInfo"
import { Select, DatePicker } from "antd"
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;
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
    this.getAllBox();
    this.getProvince();
    this.getFirstRangeStatistic();
    this.getSevenDaysInfo();
  }

  componentWillReceiveProps(nextProps) {

  }

  getAllBox() {
    this.props.rts(
      {
        method: "get",
        url: '/boxes'
      },
      this.uuid,
      "boxes",
      boxes => {
        this.setState({ boxes: boxes });
      }
    );
  }

  getProvince() {
    this.props.rts(
      {
        method: "get",
        url: '/regions/province'
      },
      this.uuid,
      "province",
      province => {
        this.setState({ province: province.result, selectedId: province.mainProvince.id });
      }
    );
  }

  getFirstRangeStatistic() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/getFirstRangeStatistic'
      },
      this.uuid,
      "allStatistic",
      allStatistic => {
        this.setState({ allStatistic: allStatistic });
      }
    );
  }

  getRangeStatistic(st, et, id) {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/getRangeOfStatistic?st=${st}&et=${et}&id=${id}`
      },
      this.uuid,
      "allStatistic",
      allStatistic => {
        this.setState({ allStatistic: allStatistic });
      }
    );
  }

  handleChange(value) {
    this.setState({selectedId: value});
    let { st, et } = this.state;
    st = st || moment().format("YYYY-MM-DD");
    et = et || moment().format("YYYY-MM-DD");
    this.getRangeStatistic(st, et, value);
  }

  onChange(date, dateString) {
    this.setState({st: dateString[0], et: dateString[1]});
    let { selectedId } = this.state;
    this.getRangeStatistic(dateString[0], dateString[1], selectedId);
  }

  getSevenDaysInfo = (page) => {
    page = page || 1;
    for (let i = 0; i < 7; i++) {
      this.props.rts(
        {
          method: "get",
          url: `/Statistics/mainPageDailyStatistic?date=${moment().subtract(7 * (page-1) + i, "day").format("YYYY-MM-DD")}`
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

  render() {
    let { allStatistic } = this.state;
    let { seven0, seven1, seven2, seven3, seven4, seven5, seven6} = this.state;

    allStatistic = allStatistic || {};

    let buyersStatistic = {
      dayBuyerCount: allStatistic.dayBuyerCount,
      daySaleCount: allStatistic.daySaleCount,
      followedScanCount: allStatistic.followedScanCount,
      followDaySaleCount: allStatistic.followDaySaleCount,
      unfollowedScanCount: allStatistic.unfollowedScanCount,
      unFollowDaySaleCount: allStatistic.unFollowDaySaleCount,
      unFollowedScanCount: allStatistic.unFollowedScanCount,
      buyAndUnFollowedScanCount: allStatistic.buyAndUnFollowedScanCount
    };

    let buyTimes = allStatistic.buyTimesResult || {};

    let saleContent = [
      {key: "扫码销售额", value: allStatistic.saleSum || 0},
      {key: "今日派出奖金", value: allStatistic.sendToday || 0},
      {key: "中奖池累积金额", value: allStatistic.zjcljje ? parseFloat(allStatistic.zjcljje.toFixed(2)) : 0},
      {key: "大奖池累积金额", value: allStatistic.djljje ? parseFloat(allStatistic.djljje.toFixed(2)) : 0}
    ];

    let boxesContent = [
      {key: "全部设备数量", value: allStatistic.boxCount || 0, background: "#1069c9"},
      {key: "今日扫码设备", value: allStatistic.dayActiveBoxCount || 0, background: "#fd996b"},
      {key: "今日扫码盒数", value: allStatistic.pondCount || 0, background: "#ca3538"},
      {key: "购买男女比例", value: `${allStatistic.manRate}%/${allStatistic.womanRate}%`, background: "#6acb9a"}
    ];

    let boxBuyerRank = allStatistic.boxBuyerRank || [];
    let boxAwardRank = allStatistic.boxAwardRank || [];

    const boxBuyerColumns = [{
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      align: "center"
    }, {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: "center"
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      align: "center",
      render: v => {
        return v == 1 ? "男" : (v == 2 ? "女" : '')
      }
    }, {
      title: '购买盒数',
      dataIndex: 'sum',
      key: 'sum',
      align: "center"
    }];

    const boxAwardColumns = [{
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      align: "center"
    }, {
      title: '商品排行',
      dataIndex: 'name',
      key: 'name',
      align: "center"
    }, {
      title: '派发量',
      dataIndex: 'sum',
      key: 'sum',
      align: "center"
    }];

    return (
      <Grid fluid>
        <div style={{marginBottom: 20}}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择一个设备或区域"
            optionFilterProp="children"
            value={this.state.selectedId}
            onChange={(v) => this.handleChange(v)}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <OptGroup label="省份">
              {this.state.province && this.state.province.map((v,i) => {
                return <Option key={i} value={v.id}>{v.name}</Option>
              })}
            </OptGroup>
            <OptGroup label="设备">
              {this.state.boxes && this.state.boxes.map((v,i) => {
                return <Option key={i} value={v.id}>{v.name}</Option>
              })}
            </OptGroup>
          </Select>
          <RangePicker
            className="statistic-choose-date-picker-fa"
            onChange={(date, dateString) => this.onChange(date, dateString)}
            defaultValue={[moment(), moment()]}
          />
        </div>
        <LongTopBar title="销售数据" content={saleContent} icon="wallet" color="#152678" />
        <BoxInfoBar title="设备数据" content={boxesContent} icon="printer" color="#2197d8"  />
        <BuyerStatisticBox content={buyersStatistic} />
        <div style={{width: "2%", float: "left", height: 1}} />
        <BuyAgainInfoBox content={buyTimes} />
        <RankTable content={boxBuyerRank} title="用户购买排行" columns={boxBuyerColumns} width="49%" />
        <RankTable content={boxAwardRank} title="奖品排行" columns={boxAwardColumns} width="49%" />
        <SevenDayInfo content={{seven0,seven1,seven2,seven3,seven4,seven5,seven6}} haspagination={true} onChange={this.getSevenDaysInfo} />
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
