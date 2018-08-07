import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Grid } from "react-bootstrap";
import LongTopBar from "./LongTopBar";
import { DatePicker, Table, Pagination } from "antd"
const { RangePicker } = DatePicker;
import moment from "moment"
import styles from "./index.scss";

export class BoxDetailStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getDetail();
  }

  componentWillReceiveProps(nextProps) {

  }

  getDetail() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/getBoxStatisticDetail'
      },
      this.uuid,
      "result",
      result => {
        this.setState({ result: result });
      }
    );
  }

  getChangeDetail(st, et, page) {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/getBoxStatisticDetail?st=${st}&et=${et}&page=${page}`
      },
      this.uuid,
      "result",
      result => {
        this.setState({ result: result });
      }
    );
  }

  onChange(date, dateString) {
    this.setState({st: dateString[0], et: dateString[1]});
    this.getChangeDetail(dateString[0], dateString[1], 0)
  }

  onPageChange(page) {
    let { st, et } = this.state;
    st = st || moment().format("YYYY-MM-DD");
    et = et || moment().format("YYYY-MM-DD");
    this.getChangeDetail(st, et, page - 1)
  }

  render() {
    let { result } = this.state;
    result = result || {};

    let saleContent = [
      {key: "全部设备数量", value: result.boxCount || 0},
      {key: "扫码盒数", value: result.pondCount || 0},
      {key: "销售金额", value: result.pondSum ? parseInt(result.pondSum.toFixed(2)) : 0},
      {key: "派发金额", value: result.sendToday ? parseInt(result.sendToday.toFixed(2)) : 0}
    ];

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

    let data = result.result;

    return (
      <Grid fluid>
        <div style={{marginBottom: 20}}>
          <RangePicker
            className="statistic-choose-date-picker-fa"
            onChange={(date, dateString) => this.onChange(date, dateString)}
            defaultValue={[moment(), moment()]}
          />
        </div>
        <LongTopBar title="数据总览" content={saleContent} icon="wallet" color="#152678" />
        <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
          <Table columns={columns} dataSource={data} pagination={false} />
          <Pagination className="pagination-statistic" defaultPageSize={7} onChange={(page) => {this.onPageChange(page)}} total={result.allBoxListCount} />
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
)(BoxDetailStatistic);
