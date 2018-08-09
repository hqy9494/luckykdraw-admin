import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Grid } from "react-bootstrap";
import LongTopBar from "./LongTopBar";
import LongTopBar2 from "./LongTopBar2"
import BoxInfoBar from "./BoxInfoBar"
import BuyerStatisticBox from "./BuyerStatisticBox"
import BuyAgainInfoBox from "./BuyAgainInfoBox"
import RankTable from "./RankTable"
import SevenDayInfo from "./SevenDayInfo"
import { Select, DatePicker, TreeSelect, Table, Pagination } from "antd"
const { Option, OptGroup } = Select;
const TreeNode = TreeSelect.TreeNode;
const { RangePicker } = DatePicker;
import moment from "moment"
import styles from "./index.scss";

export class Statistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      st: moment().format("YYYY-MM-DD"),
      et: moment().format("YYYY-MM-DD")
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getRegionJson();
    this.getAllBox();
    this.getProvince();
    const { params } = this.props;
    if (params.id) {
      this.getRangeStatistic(this.state.st, this.state.et, params.id);
      this.setState({selectedId: params.id})
    } else {
      this.getFirstRangeStatistic();
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  getCompareInfo = (regionId) => {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/getCompareWithBefore?regionId=${regionId}`
      },
      this.uuid,
      "compareInfo",
      compareInfo => {
        this.setState({ compareInfo });
      }
    );
  };

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
        this.setState({province: province.result});
        if (!this.state.selectedId) {
          this.setState({ selectedId: province.mainProvince.id });
        }
        this.getSevenDaysInfo();
        this.getCompareInfo(province.mainProvince.id);
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

  getRegionJson() {
    this.props.rts(
      {
        method: "get",
        url: '/regions/regionsjsonwithboxes'
      },
      this.uuid,
      "regionsjson",
      regionsjson => {
        this.setState({ regionsjson: regionsjson });
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
    this.getCompareInfo(value);
    this.getSevenDaysInfo(0, value)
  }

  onChange(date, dateString) {
    this.setState({st: dateString[0], et: dateString[1]}, () => {this.getSevenDaysInfo()});
    let { selectedId } = this.state;
    this.getRangeStatistic(dateString[0], dateString[1], selectedId);
  }

  getRegionsjsonDom(json) {
    return (json.map(v => {
      return <TreeNode value={v.value} title={v.title} key={v.key}>
        {this.getRegionsjsonDom(v.children)}
      </TreeNode>
    }))
  }

  renderRegionsjsonDom(json) {
    return (
      <TreeSelect
        style={{ width: 200 }}
        placeholder="选择一个设备或区域"
        onChange={(v) => this.handleChange(v)}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        defalutValue={this.state.selectedId}
        value={this.state.selectedId}
        treeDefaultExpandedKeys={["中国"]}
      >
        {json && this.getRegionsjsonDom(json)}
      </TreeSelect>
    )
  }

  getSevenDaysInfo = (page, value) => {
    page = page || 0;
    let { selectedId, st, et } = this.state;
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/getBoxDetailsByRegion?st=${st}&et=${et}&regionId=${value || selectedId}&page=${page}`
      },
      this.uuid,
      'regionBoxes',
      regionBoxes => {
        this.setState({regionBoxes});
      }
    );
  };

  handClick(record) {
    this.props.to(`/statistic/rangeStatistic?id=${record.boxId}`)
  }

  render() {
    let { allStatistic, regionsjson, compareInfo } = this.state;
    let { regionBoxes } = this.state;

    compareInfo = compareInfo || {};
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
      {key: "今日派出奖金", value: parseInt(allStatistic.sendToday) || 0},
      {key: "中奖池累积金额", value: allStatistic.zjcljje ? parseInt(allStatistic.zjcljje) : 0},
      {key: "大奖池累积金额", value: allStatistic.djljje ? parseInt(allStatistic.djljje) : 0}
    ];

    let compareContent = [
      {
        keyOne: `今日：${compareInfo.todaySum * 30}`, keyTwo: `昨日：${compareInfo.yesterdaySum * 30}`,
        value: parseFloat((compareInfo.todaySum - compareInfo.yesterdaySum)/(compareInfo.yesterdaySum || 1)*100).toFixed(1)
      },
      {
        keyOne: `本周：${compareInfo.thisWeekSum * 30}`, keyTwo: `上周：${compareInfo.preWeekSum * 30}`,
        value: parseFloat((compareInfo.thisWeekSum - compareInfo.preWeekSum)/(compareInfo.preWeekSum || 1)*100).toFixed(1)
      },
      {
        keyOne: `本月：${compareInfo.thisMonthSum * 30}`, keyTwo: `上月：${compareInfo.preMonthSum * 30}`,
        value: parseFloat((compareInfo.thisMonthSum - compareInfo.preMonthSum)/(compareInfo.preMonthSum || 1)*100).toFixed(1)
      },
      {
        keyOne: `本月：${compareInfo.thisMonthSum * 30}`, keyTwo: `上上月：${compareInfo.prePreMonthSum * 30}`,
        value: parseFloat((compareInfo.thisMonthSum - compareInfo.prePreMonthSum)/(compareInfo.prePreMonthSum || 1)*100).toFixed(1)
      }
    ];

    let boxesContent = [
      {key: "全部设备数量", value: allStatistic.boxCount || 0, background: "#1069c9"},
      {key: "今日扫码设备", value: allStatistic.dayActiveBoxCount || 0, background: "#fd996b"},
      {key: "今日扫码盒数", value: allStatistic.pondCount || 0, background: "#ca3538"},
      {key: "购买男女比例", value: `${allStatistic.manRate}%/${allStatistic.womanRate}%`, background: "#6acb9a"}
    ];

    let boxBuyerRank = allStatistic.boxBuyerRank || [];
    for (let i = 0; i < boxBuyerRank.length; i++) {
      boxBuyerRank[i].nickname = boxBuyerRank[i].nickname || "未关注用户"
    }
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

    const columns = [{
      title: '设备名称',
      dataIndex: 'boxName',
      key: 'boxName',
      align: "center"
    }, {
      title: '设备地址',
      dataIndex: 'address',
      key: 'address',
      align: "center"
    }, {
      title: '扫码盒数',
      dataIndex: 'count',
      key: 'count',
      align: "center"
    }, {
      title: '销售金额',
      dataIndex: 'enabled',
      key: 'enabled',
      align: "center",
      render: (v, all) => {
        return all.count * 30
      }
    }, {
      title: '派发金额',
      dataIndex: 'res',
      key: 'res',
      align: "center",
      render: (v) => {
        return parseInt(v)
      }
    }];

    return (
      <Grid fluid>
        <div style={{marginBottom: 20}}>
          {regionsjson && this.renderRegionsjsonDom(regionsjson)}
          <RangePicker
            className="statistic-choose-date-picker-fa"
            onChange={(date, dateString) => this.onChange(date, dateString)}
            defaultValue={[moment(), moment()]}
          />
        </div>
        <LongTopBar title="销售数据" content={saleContent} icon="wallet" color="#152678" />
        <LongTopBar2 title="同期销售额对比数据" content={compareContent} icon="wallet" color="#152678" />
        <BoxInfoBar title="设备数据" content={boxesContent} icon="printer" color="#2197d8"  />
        <BuyerStatisticBox content={buyersStatistic} />
        <div style={{width: "2%", float: "left", height: 1}} />
        <BuyAgainInfoBox content={buyTimes} />
        <RankTable content={boxBuyerRank} title="用户购买排行" columns={boxBuyerColumns} width="49%" />
        <RankTable content={boxAwardRank} title="奖品排行" columns={boxAwardColumns} width="49%" />
        <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
          <Table onRow={(record) => {
            return {
              onClick: () => {this.handClick(record)}
            }}} columns={columns} dataSource={regionBoxes && regionBoxes.boxList} pagination={false} />
          <Pagination className="pagination-statistic" defaultPageSize={7} onChange={(page) => {this.getSevenDaysInfo(page)}} total={regionBoxes && regionBoxes.allBoxListCount} />
        </div>
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
