import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Grid } from "react-bootstrap";
import LongTopBar from "./LongTopBar";
import { DatePicker, Table, Pagination, Button, Card } from "antd"
const { RangePicker } = DatePicker;
import moment from "moment"
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Label } from "bizcharts";
import styles from "./index.scss";

export class SaleDetailStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      startTime: moment()
        .subtract(6, "day")
        .format("YYYY-MM-DD"),
      endTime: moment().format("YYYY-MM-DD"),
      selectedId: 1
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getDetail();
    this.getAwardPondLine();
    this.getTableInfo(0)
  }

  componentWillReceiveProps(nextProps) {

  }

  getDetail() {
    this.props.rts(
      {
        method: "get",
        url: '/Statistics/getWechatStatisticByDateRange'
      },
      this.uuid,
      "result",
      result => {
        this.setState({ result: result });
      }
    );
  }

  getChangeDetail(st, et) {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/getWechatStatisticByDateRange?st=${st}&et=${et}`
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
    this.getChangeDetail(dateString[0], dateString[1]);
  }

  getAwardPondLine() {
    const { startTime, endTime, selectedId } = this.state;
    if (startTime && endTime) {
      this.props.rts(
        {
          method: "get",
          url: `/Statistics/duration`,
          params: {
            startTime,
            endTime
          }
        },
        this.uuid,
        "awardPondLine",
        awardPondLine => {
          let line1 = awardPondLine.map(apl => {
            let key;
            if (selectedId == 1) {
              key = "scanAndFollow"
            } else if (selectedId == 2) {
              key = "cancelFollow"
            } else if (selectedId == 3) {
              key = "peopleRaise"
            }
            return {
              date: apl.date,
              value: Number(apl[key].toFixed(2))
            };
          });
          this.setState({
            line1
          });
        }
      );
    }
  }

  getTableInfo(page) {
    page = page || 0;
    this.setState({page});
    let startTime = moment().subtract(10 + page*10, "day").format("YYYY-MM-DD");
    let endTime = moment().subtract(page*10, "day").format("YYYY-MM-DD");
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/duration`,
        params: {
          startTime,
          endTime
        }
      },
      this.uuid,
      "tableRes",
      tableRes => {
        this.setState({tableRes})
      }
    );
  }

  handClick(v) {
    this.setState({selectedId: v}, () => this.getAwardPondLine())
  }

  render() {
    let { result, tableRes } = this.state;
    result = result || {};
    const cols1 = {};

    let saleContent = [
      {key: "微信关注总人数", value: result.followingCount || 0},
      {key: "新增关注数", value: result.scanAndFollow || 0},
      {key: "取关用户数", value: result.cancelFollow},
      {key: "关注男女比例", value: `${result.manRate}%/${result.womanRate}%`}
    ];

    const columns = [{
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      align: "center"
    }, {
      title: '新关注人数',
      dataIndex: 'scanAndFollow',
      key: 'scanAndFollow',
      align: "center"
    }, {
      title: '取消关注人数',
      dataIndex: 'cancelFollow',
      key: 'cancelFollow',
      align: "center"
    }, {
      title: '净关注人数',
      dataIndex: 'peopleRaise',
      key: 'peopleRaise',
      align: "center"
    }];

    let data = tableRes;

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
        <div style={{marginBottom: 10, marginTop: 20}}>
          <Button onClick={() => {this.handClick(1)}} type={this.state.selectedId == 1 ? "primary" : "default"}>
            新增用户数
          </Button>
          <Button onClick={() => {this.handClick(2)}} type={this.state.selectedId == 2 ? "primary" : "default"}>
            取关用户数
          </Button>
          <Button onClick={() => {this.handClick(3)}} type={this.state.selectedId == 3 ? "primary" : "default"}>
            净增人数
          </Button>
        </div>
        <Card
          title=""
          extra={
            <RangePicker
              value={
                this.state.startTime &&
                this.state.endTime && [
                  moment(this.state.startTime),
                  moment(this.state.endTime)
                ]
              }
              onChange={date => {
                this.setState(
                  {
                    startTime: date[0].format("YYYY-MM-DD"),
                    endTime: date[1].format("YYYY-MM-DD")
                  },
                  () => {
                    this.getAwardPondLine();
                  }
                );
              }}
              placeholder={["开始时间", "结束时间"]}
            />
          }
          style={{
            height: 535,
            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
          }}
        >
          {this.state.line1 &&
          this.state.line1.length > 0 && (
            <Chart
              height={490}
              data={this.state.line1}
              scale={cols1}
              forceFit
            >
              <Axis name="date" />
              <Axis name="value" />
              <Tooltip crosshairs={{ type: "line" }} />
              <Geom type="area" position="date*value" />
              <Geom type="line" position="date*value" size={2} />
            </Chart>
          )}
        </Card>

        <div className="statistic-box-with-title-bar" style={{width: "100%", marginTop: 20}}>
          <Table columns={columns} dataSource={data} pagination={false} />
          <Pagination className="pagination-statistic" defaultPageSize={10} onChange={(page) => {this.getTableInfo(page-1)}} total={100} />
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
)(SaleDetailStatistic);
