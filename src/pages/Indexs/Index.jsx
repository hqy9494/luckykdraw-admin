import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Card, Table, Icon, DatePicker } from "antd";
import moment from "moment";
// import DateRange from "../../components/DateRange";
import uuid from "uuid";
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Label } from "bizcharts";
// import styles from "./Index.scss";

const { RangePicker, MonthPicker } = DatePicker;

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date_buyTop: moment()
        .subtract(1, "day")
        .format("YYYY-MM"),
      date_RPurchase: moment().format("YYYY-MM"),
      date_scanAndFollow: {
        startTime: moment()
          .subtract(6, "day")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      date_unfollow: {
        startTime: moment()
          .subtract(6, "day")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      date_awardPondLine: {
        startTime: moment()
          .subtract(6, "day")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      date_wxUserLine: {
        startTime: moment()
          .subtract(6, "day")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      },
      buytop: [],
      count: {},
      oldNewUser: {},
      yAward: [],
      scanAndFollow: {},
      unfollow: {},
      tAwardPond: {},
      wAwardPond: {},
      mAwardPond: {}
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getCount();
    this.getBuyTop();
    this.getOldNewUser();
    this.getYAward();
    this.getScanAndFollow();
    this.getUnfollow();
    this.getTAwardPond();
    this.getWAwardPond();
    this.getMAwardPond();
    this.getAwardPondLine();
    this.getWxUserLine();
    this.getRepeatPurchase();
  }

  componentWillReceiveProps(nextProps) {}

  //微信关注总人数,现奖池总额,累积奖池金额
  getCount() {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/total`
      },
      this.uuid,
      "count",
      count => {
        this.setState({ count });
      }
    );
  }

  //用户累积购买排行
  getBuyTop() {
    if (this.state.date_buyTop) {
      this.props.rts(
        {
          method: "get",
          url: `/Statistics/buyerRank`,
          params: {
            date: this.state.date_buyTop
          }
        },
        this.uuid,
        "buytop",
        buytop => {
          this.setState({ buytop });
        }
      );
    }
  }

  //今日新老用户对比分布
  getOldNewUser() {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/newOrOldUser`,
        params: {
          date: moment().format("YYYY-MM-DD")
        }
      },
      this.uuid,
      "oldNewUser",
      oldNewUser => {
        this.setState({ oldNewUser });
      }
    );
  }

  //昨日奖品排行
  getYAward() {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/awardRank`,
        params: {
          date: moment()
            .subtract(1, "day")
            .format("YYYY-MM-DD")
        }
      },
      this.uuid,
      "yAward",
      yAward => {
        this.setState({
          yAward: yAward.map((y, i) => {
            return { ...y, i };
          })
        });
      }
    );
  }

  //扫码关注
  getScanAndFollow() {
    const { startTime, endTime } = this.state.date_scanAndFollow;
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
        "scanAndFollow",
        scanAndFollow => {
          let count1 = 0,
            count2 = 0;
          scanAndFollow.map(saf => {
            count1 += saf.scanAndFollow;
            count2 += saf.scanAndUnfollow;
          });
          this.setState({ scanAndFollow: { count1, count2 } });
        }
      );
    }
  }

  //取消关注
  getUnfollow() {
    const { startTime, endTime } = this.state.date_unfollow;
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
        "unfollow",
        unfollow => {
          let count1 = 0,
            count2 = 0;
          unfollow.map(uf => {
            count1 += uf.scanAndFollow - uf.cancelFollow;
            count2 += uf.cancelFollow;
          });
          this.setState({ unfollow: { count1, count2 } });
        }
      );
    }
  }

  //今日新增奖池数据
  getTAwardPond() {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/duration`,
        params: {
          startTime: moment().format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD")
        }
      },
      this.uuid,
      "twardPond",
      tAwardPond => {
        let count1 = 0,
          count2 = 0;
        tAwardPond.map(uf => {
          count1 += uf.awardPond;
          count2 += uf.sendAwardPond;
        });
        this.props.rts(
          {
            method: "get",
            url: `/Statistics/duration`,
            params: {
              startTime: moment()
                .subtract(1, "day")
                .format("YYYY-MM-DD"),
              endTime: moment()
                .subtract(1, "day")
                .format("YYYY-MM-DD")
            }
          },
          this.uuid,
          "yardPond",
          yAwardPond => {
            let count3 = 0,
              count4 = 0;
            yAwardPond.map(uf => {
              count3 += uf.awardPond;
              count4 += uf.sendAwardPond;
            });
            let p1 = count3 === 0 ? 0 : (count1 - count3) / count3,
              p2 = count4 === 0 ? 0 : (count2 - count4) / count4;
            this.setState({
              tAwardPond: {
                count1: count1.toFixed(2),
                count2: count2.toFixed(2),
                p1: (p1 * 100).toFixed(0),
                p2: (p2 * 100).toFixed(0)
              }
            });
          }
        );
      }
    );
  }
  //本周新增奖池数据
  getWAwardPond() {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/duration`,
        params: {
          startTime: moment()
            .startOf("week")
            .format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD")
        }
      },
      this.uuid,
      "wwardPond",
      wAwardPond => {
        let count1 = 0,
          count2 = 0;
        wAwardPond.map(uf => {
          count1 += uf.awardPond;
          count2 += uf.sendAwardPond;
        });
        this.props.rts(
          {
            method: "get",
            url: `/Statistics/duration`,
            params: {
              startTime: moment()
                .subtract(1, "week")
                .startOf("week")
                .format("YYYY-MM-DD"),
              endTime: moment()
                .subtract(1, "week")
                .endOf("week")
                .format("YYYY-MM-DD")
            }
          },
          this.uuid,
          "ywardPond",
          ywAwardPond => {
            let count3 = 0,
              count4 = 0;
            ywAwardPond.map(uf => {
              count3 += uf.awardPond;
              count4 += uf.sendAwardPond;
            });
            let p1 = count3 === 0 ? 0 : (count1 - count3) / count3,
              p2 = count4 === 0 ? 0 : (count2 - count4) / count4;
            this.setState({
              wAwardPond: {
                count1: count1.toFixed(2),
                count2: count2.toFixed(2),
                p1: (p1 * 100).toFixed(0),
                p2: (p2 * 100).toFixed(0)
              }
            });
          }
        );
      }
    );
  }
  //本月新增奖池数据
  getMAwardPond() {
    this.props.rts(
      {
        method: "get",
        url: `/Statistics/duration`,
        params: {
          startTime: moment()
            .startOf("month")
            .format("YYYY-MM-DD"),
          endTime: moment().format("YYYY-MM-DD")
        }
      },
      this.uuid,
      "mwardPond",
      mAwardPond => {
        let count1 = 0,
          count2 = 0;
        mAwardPond.map(uf => {
          count1 += uf.awardPond;
          count2 += uf.sendAwardPond;
        });
        this.props.rts(
          {
            method: "get",
            url: `/Statistics/duration`,
            params: {
              startTime: moment()
                .subtract(1, "month")
                .startOf("month")
                .format("YYYY-MM-DD"),
              endTime: moment()
                .subtract(1, "month")
                .endOf("month")
                .format("YYYY-MM-DD")
            }
          },
          this.uuid,
          "ymardPond",
          ymAwardPond => {
            let count3 = 0,
              count4 = 0;
            ymAwardPond.map(uf => {
              count3 += uf.awardPond;
              count4 += uf.sendAwardPond;
            });
            let p1 = count3 === 0 ? 0 : (count1 - count3) / count3,
              p2 = count4 === 0 ? 0 : (count2 - count4) / count4;
            this.setState({
              mAwardPond: {
                count1: count1.toFixed(2),
                count2: count2.toFixed(2),
                p1: (p1 * 100).toFixed(0),
                p2: (p2 * 100).toFixed(0)
              }
            });
          }
        );
      }
    );
  }

  //奖池总额
  getAwardPondLine() {
    const { startTime, endTime } = this.state.date_awardPondLine;
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
            return {
              date: apl.date,
              value: Number(apl.cashPond.toFixed(2))
            };
          });
          // console.log(line1);
          this.setState({
            line1
          });
        }
      );
    }
  }

  //微信新增用户数
  getWxUserLine() {
    const { startTime, endTime } = this.state.date_wxUserLine;
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
        "wxUserLine",
        wxUserLine => {
          let line2 = [];
          wxUserLine.map(apl => {
            line2.push({
              userType: "新增用户数",
              date: apl.date,
              value: Number(apl.newUser)
            });
            line2.push({
              userType: "取消关注用户数",
              date: apl.date,
              value: Number(apl.cancelFollow)
            });
          });
          this.setState({
            line2
          });
        }
      );
    }
  }

  //复购率
  getRepeatPurchase() {
    if (this.state.date_RPurchase) {
      this.props.rts(
        {
          method: "get",
          url: `/Statistics/buyTimes`,
          params: {
            month: this.state.date_RPurchase
          }
        },
        this.uuid,
        "rPurchase",
        rPurchase => {
          let line3 = [],
            obj = {},
            fields = ["1", "2", "3-5", "5+"],
            count =
              rPurchase["1"] +
              rPurchase["2"] +
              rPurchase["3-5"] +
              rPurchase["5+"];

          for (let i = 0; i < fields.length; i++) {
            line3.push({
              action: fields[i] + "次购买",
              pv: rPurchase[fields[i]]
            });
            obj[fields[i]] = {
              all: rPurchase.man[fields[i]] + rPurchase.woman[fields[i]],
              man: rPurchase.man[fields[i]],
              woman: rPurchase.woman[fields[i]],
              p: count
                ? Number((rPurchase[fields[i]] / count).toFixed(2)) * 100
                : 0
            };
          }

          this.setState({
            line3,
            rPurchase: obj
          });
        }
      );
    }
  }

  //处理百分比
  toPercent(a, b) {
    if (!b) return 0;
    return (Math.round(a / b) * 100).toFixed(0);
  }

  render() {
    const columns1 = [
      {
        title: "排行",
        dataIndex: "i",
        key: "i",
        render: (text, record, index) => index + 1
      },
      {
        title: "名称",
        dataIndex: "nickname",
        key: "nickname"
      },
      {
        title: "性别",
        dataIndex: "gender",
        key: "gender",
        render: text => {
          if (text == 1) {
            return "男";
          } else if (text == 2) {
            return "女";
          }
        }
      },
      {
        title: "累积购买盒数",
        dataIndex: "count",
        key: "count"
      }
    ];
    const columns2 = [
      {
        title: "排行",
        dataIndex: "i",
        key: "i",
        width: 80,
        render: (text, record, index) => index + 1
      },
      {
        title: "名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "当日派发量",
        dataIndex: "sum",
        key: "sum",
        width: 150
      },
      {
        title: "当日复购率",
        dataIndex: "a4",
        key: "a4",
        width: 150
      }
    ];
    const cols1 = {};
    const cols2 = {};
    const cols3 = {
      percent: {
        nice: false
      }
    };
    return (
      <section className="index-page">
        <Row gutter={{ sm: 0, md: 20 }}>
          <Col sm={24} md={8}>
            <div className="index-item1">
              <div className="index-item1-icon index-item1-icon1" />
              <div>
                <span className="index-item1-label">微信关注总人数</span>
                <span className="index-item1-value">
                  {this.state.count.followingCount || 0}
                </span>
              </div>
            </div>
          </Col>
          <Col sm={24} md={8}>
            <div className="index-item1">
              <div className="index-item1-icon index-item1-icon2" />
              <div>
                <span className="index-item1-label">现奖池总额</span>
                <span className="index-item1-value">
                  {this.state.count.cashPond || 0}
                </span>
              </div>
            </div>
          </Col>
          <Col sm={24} md={8}>
            <div className="index-item1">
              <div className="index-item1-icon index-item1-icon3" />
              <div>
                <span className="index-item1-label">累积奖池金额</span>
                <span className="index-item1-value">
                  {this.state.count.awardPond || 0}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={16}>
            <Card
              title="奖池总额"
              extra={
                <RangePicker
                  value={
                    this.state.date_awardPondLine.startTime &&
                    this.state.date_awardPondLine.endTime && [
                      moment(this.state.date_awardPondLine.startTime),
                      moment(this.state.date_awardPondLine.endTime)
                    ]
                  }
                  onChange={date => {
                    this.setState(
                      {
                        date_awardPondLine: {
                          startTime: date[0].format("YYYY-MM-DD"),
                          endTime: date[1].format("YYYY-MM-DD")
                        }
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
          </Col>
          <Col sm={24} md={8}>
            <Row>
              <Col md={24}>
                <Card
                  title="今日新增奖池数据"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">收</span>
                      <span className="index-i3i-value">
                        ￥{this.state.tAwardPond.count1 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较昨天</span>
                        {Number(this.state.tAwardPond.p1) > 0 ? (
                          <span className="index-i3item-percent index-i3item-percent_up">
                            <Icon type="arrow-up" />
                            {this.state.tAwardPond.p1 || 0}%
                          </span>
                        ) : (
                          <span className="index-i3item-percent index-i3item-percent_down">
                            <Icon type="arrow-down" />
                            {this.state.tAwardPond.p1 || 0}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">派</span>
                      <span className="index-i3i-value">
                        ￥{this.state.tAwardPond.count2 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较昨天</span>
                        {Number(this.state.tAwardPond.p2) > 0 ? (
                          <span className="index-i3item-percent index-i3item-percent_up">
                            <Icon type="arrow-up" />
                            {this.state.tAwardPond.p2 || 0}%
                          </span>
                        ) : (
                          <span className="index-i3item-percent index-i3item-percent_down">
                            <Icon type="arrow-down" />
                            {this.state.tAwardPond.p2 || 0}%
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="本周新增奖池数据"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">收</span>
                      <span className="index-i3i-value">
                        ￥{this.state.wAwardPond.count1 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上周</span>
                        {Number(this.state.wAwardPond.p1) > 0 ? (
                          <span className="index-i3item-percent index-i3item-percent_up">
                            <Icon type="arrow-up" />
                            {this.state.wAwardPond.p1 || 0}%
                          </span>
                        ) : (
                          <span className="index-i3item-percent index-i3item-percent_down">
                            <Icon type="arrow-down" />
                            {this.state.wAwardPond.p1 || 0}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">派</span>
                      <span className="index-i3i-value">
                        ￥{this.state.wAwardPond.count2 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上周</span>
                        {Number(this.state.wAwardPond.p2) > 0 ? (
                          <span className="index-i3item-percent index-i3item-percent_up">
                            <Icon type="arrow-up" />
                            {this.state.wAwardPond.p2 || 0}%
                          </span>
                        ) : (
                          <span className="index-i3item-percent index-i3item-percent_down">
                            <Icon type="arrow-down" />
                            {this.state.wAwardPond.p2 || 0}%
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="本月新增奖池数据"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">收</span>
                      <span className="index-i3i-value">
                        ￥{this.state.mAwardPond.count1 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上月</span>
                        {Number(this.state.mAwardPond.p1) > 0 ? (
                          <span className="index-i3item-percent index-i3item-percent_up">
                            <Icon type="arrow-up" />
                            {this.state.mAwardPond.p1 || 0}%
                          </span>
                        ) : (
                          <span className="index-i3item-percent index-i3item-percent_down">
                            <Icon type="arrow-down" />
                            {this.state.mAwardPond.p1 || 0}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">派</span>
                      <span className="index-i3i-value">
                        ￥{this.state.mAwardPond.count2 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上月</span>
                        {Number(this.state.mAwardPond.p2) > 0 ? (
                          <span className="index-i3item-percent index-i3item-percent_up">
                            <Icon type="arrow-up" />
                            {this.state.mAwardPond.p2 || 0}%
                          </span>
                        ) : (
                          <span className="index-i3item-percent index-i3item-percent_down">
                            <Icon type="arrow-down" />
                            {this.state.mAwardPond.p2 || 0}%
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={12}>
            <Card
              title="购买人数性别分布"
              style={{
                height: 263,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <div className="index-item4">
                <div className="index-i4-row1">
                  <span className="index-i4-icon1" />
                  <span className="index-i4-icon2" />
                </div>
                <div className="index-i4-row2">
                  <span
                    className="index-i4-percent1"
                    style={{
                      width: `${this.toPercent(
                        this.state.count.manBuyer,
                        this.state.count.manBuyer + this.state.count.womanBuyer
                      )}%`
                    }}
                  />
                  <span
                    className="index-i4-percent2"
                    style={{
                      width: `${this.toPercent(
                        this.state.count.womanBuyer,
                        this.state.count.manBuyer + this.state.count.womanBuyer
                      )}%`
                    }}
                  />
                </div>
                <div className="index-i4-row3">
                  <span className="index-i4-value1">
                    {this.state.count.manBuyer || 0}人（{this.toPercent(
                      this.state.count.manBuyer,
                      this.state.count.manBuyer + this.state.count.womanBuyer
                    )}%）
                  </span>
                  <span className="index-i4-value1">
                    {this.state.count.womanBuyer || 0}人（{this.toPercent(
                      this.state.count.womanBuyer,
                      this.state.count.manBuyer + this.state.count.womanBuyer
                    )}%）
                  </span>
                </div>
              </div>
            </Card>
          </Col>
          <Col sm={24} md={12}>
            <Card
              title="复购率"
              extra={
                <MonthPicker
                  value={moment(this.state.date_RPurchase)}
                  onChange={date => {
                    this.setState(
                      { date_RPurchase: date.format("YYYY-MM") },
                      () => {
                        this.getRepeatPurchase();
                      }
                    );
                  }}
                  placeholder="请选择月份"
                />
              }
              style={{
                height: 263,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ width: "60%", display: "inline-block" }}>
                  {this.state.line3 &&
                    this.state.line3.length > 0 && (
                      <Chart
                        height={196}
                        data={this.state.line3}
                        scale={cols3}
                        padding={{
                          top: "auto",
                          right: 100,
                          bottom: 20,
                          left: "auto"
                        }}
                        forceFit
                      >
                        <Tooltip />
                        <Coord type="rect" transpose scale={[1, -1]} />
                        <Geom
                          type="intervalSymmetric"
                          position="action*pv"
                          shape="pyramid"
                          color={[
                            "action",
                            [
                              "#0050B3",
                              "#1890FF",
                              "#40A9FF",
                              "#69C0FF",
                              "#BAE7FF"
                            ]
                          ]}
                        >
                          <Label
                            content={[
                              "action*pv",
                              (action, pv) => {
                                return action + " " + pv;
                              }
                            ]}
                            offset={35}
                            labeLine={{
                              lineWidth: 1,
                              stroke: "rgba(0, 0, 0, 0.15)"
                            }}
                          />
                        </Geom>
                      </Chart>
                    )}
                </div>
                {this.state.rPurchase &&
                  this.state.rPurchase && (
                    <div style={{ width: "40%", display: "inline-block" }}>
                      <div className="index-item5">
                        <div className="index-i5-count">
                          总人数{this.state.rPurchase["1"].all || 0}人（{this
                            .state.rPurchase["1"].p || 0}%）
                        </div>
                        <div className="index-i5-value">
                          <span className="index-i5-value1">
                            {this.state.rPurchase["1"].man || 0}人
                          </span>
                          <span className="index-i5-value2">
                            {this.state.rPurchase["1"].woman || 0}人
                          </span>
                        </div>
                      </div>
                      <div className="index-item5">
                        <div className="index-i5-count">
                          总人数{this.state.rPurchase["2"].all || 0}人（{this
                            .state.rPurchase["2"].p || 0}%）
                        </div>
                        <div className="index-i5-value">
                          <span className="index-i5-value1">
                            {this.state.rPurchase["2"].man || 0}人
                          </span>
                          <span className="index-i5-value2">
                            {this.state.rPurchase["2"].woman || 0}人
                          </span>
                        </div>
                      </div>
                      <div className="index-item5">
                        <div className="index-i5-count">
                          总人数{this.state.rPurchase["3-5"].all || 0}人（{this
                            .state.rPurchase["3-5"].p || 0}%）
                        </div>
                        <div className="index-i5-value">
                          <span className="index-i5-value1">
                            {this.state.rPurchase["3-5"].man || 0}人
                          </span>
                          <span className="index-i5-value2">
                            {this.state.rPurchase["3-5"].woman || 0}人
                          </span>
                        </div>
                      </div>
                      <div className="index-item5">
                        <div className="index-i5-count">
                          总人数{this.state.rPurchase["5+"].all || 0}人（{this
                            .state.rPurchase["5+"].p || 0}%）
                        </div>
                        <div className="index-i5-value">
                          <span className="index-i5-value1">
                            {this.state.rPurchase["5+"].man || 0}人
                          </span>
                          <span className="index-i5-value2">
                            {this.state.rPurchase["5+"].woman || 0}人
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={16}>
            <Card
              title="微信新增用户数"
              extra={
                <RangePicker
                  value={
                    this.state.date_wxUserLine.startTime &&
                    this.state.date_wxUserLine.endTime && [
                      moment(this.state.date_wxUserLine.startTime),
                      moment(this.state.date_wxUserLine.endTime)
                    ]
                  }
                  onChange={date => {
                    this.setState(
                      {
                        date_wxUserLine: {
                          startTime: date[0].format("YYYY-MM-DD"),
                          endTime: date[1].format("YYYY-MM-DD")
                        }
                      },
                      () => {
                        this.getWxUserLine();
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
              {this.state.line2 &&
                this.state.line2.length > 0 && (
                  <Chart
                    height={475}
                    data={this.state.line2}
                    scale={cols2}
                    forceFit
                  >
                    <Axis name="date" />
                    <Axis name="value" />
                    <Legend />
                    <Tooltip crosshairs={{ type: "line" }} />
                    <Geom type="area" position="date*value" color="userType" />
                    <Geom
                      type="line"
                      position="date*value"
                      size={2}
                      color="userType"
                    />
                  </Chart>
                )}
            </Card>
          </Col>
          <Col sm={24} md={8}>
            <Row>
              <Col md={24}>
                <Card
                  title="扫码关注"
                  extra={
                    <RangePicker
                      value={
                        this.state.date_scanAndFollow.startTime &&
                        this.state.date_scanAndFollow.endTime && [
                          moment(this.state.date_scanAndFollow.startTime),
                          moment(this.state.date_scanAndFollow.endTime)
                        ]
                      }
                      onChange={date => {
                        this.setState(
                          {
                            date_scanAndFollow: {
                              startTime: date[0].format("YYYY-MM-DD"),
                              endTime: date[1].format("YYYY-MM-DD")
                            }
                          },
                          () => {
                            this.getScanAndFollow();
                          }
                        );
                      }}
                      placeholder={["开始时间", "结束时间"]}
                      ranges={{
                        近7天: [
                          moment()
                            .subtract(6, "day")
                            .startOf("day"),
                          moment()
                        ]
                      }}
                    />
                  }
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">注</span>
                      <span className="index-i3i-value">
                        {this.state.scanAndFollow.count1 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>扫码关注</span>
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">未</span>
                      <span className="index-i3i-value">
                        {this.state.scanAndFollow.count2 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>扫码未关注</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="取消关注"
                  extra={
                    <RangePicker
                      value={
                        this.state.date_unfollow.startTime &&
                        this.state.date_unfollow.endTime && [
                          moment(this.state.date_unfollow.startTime),
                          moment(this.state.date_unfollow.endTime)
                        ]
                      }
                      onChange={date => {
                        this.setState(
                          {
                            date_unfollow: {
                              startTime: date[0].format("YYYY-MM-DD"),
                              endTime: date[1].format("YYYY-MM-DD")
                            }
                          },
                          () => {
                            this.getUnfollow();
                          }
                        );
                      }}
                      placeholder={["开始时间", "结束时间"]}
                      ranges={{
                        近7天: [
                          moment()
                            .subtract(6, "day")
                            .startOf("day"),
                          moment()
                        ]
                      }}
                    />
                  }
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">净</span>
                      <span className="index-i3i-value">
                        {this.state.unfollow.count1 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>净关注数</span>
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">消</span>
                      <span className="index-i3i-value">
                        {this.state.unfollow.count2 || 0}
                      </span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>取消关注数</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="关注人数性别分布"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
                  }}
                >
                  <div className="index-item4 small">
                    <div className="index-i4-row1">
                      <span className="index-i4-icon1" />
                      <span className="index-i4-icon2" />
                    </div>
                    <div className="index-i4-row2">
                      <span
                        className="index-i4-percent1"
                        style={{
                          width: `${this.toPercent(
                            this.state.count.manFollow,
                            this.state.count.manFollow +
                              this.state.count.womanFollow
                          )}%`
                        }}
                      />
                      <span
                        className="index-i4-percent2"
                        style={{
                          width: `${this.toPercent(
                            this.state.count.womanFollow,
                            this.state.count.manFollow +
                              this.state.count.womanFollow
                          )}%`
                        }}
                      />
                    </div>
                    <div className="index-i4-row3">
                      <span className="index-i4-value1">
                        {this.state.count.manFollow}人（{`${this.toPercent(
                          this.state.count.manFollow,
                          this.state.count.manFollow +
                            this.state.count.womanFollow
                        )}`}%）
                      </span>
                      <span className="index-i4-value1">
                        {this.state.count.womanFollow}人（{`${this.toPercent(
                          this.state.count.womanFollow,
                          this.state.count.manFollow +
                            this.state.count.womanFollow
                        )}`}%）
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={8}>
            <Row>
              <Col md={24}>
                <Card
                  title="今日新老用户对比分布"
                  style={{
                    height: 360,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item4">
                    <div className="index-i4-row1">
                      <span className="index-i8-icon1" />
                      <span className="index-i8-icon2" />
                    </div>
                    <div className="index-i4-row2">
                      <span
                        className="index-i8-percent1"
                        style={{
                          width: `${this.toPercent(
                            this.state.oldNewUser.newUser,
                            this.state.oldNewUser.oldUser +
                              this.state.oldNewUser.newUser
                          )}%`
                        }}
                      />
                      <span
                        className="index-i8-percent2"
                        style={{
                          width: `${this.toPercent(
                            this.state.oldNewUser.oldUser,
                            this.state.oldNewUser.oldUser +
                              this.state.oldNewUser.newUser
                          )}%`
                        }}
                      />
                    </div>
                    <div className="index-i4-row3">
                      <span className="index-i8-value1">
                        {this.state.oldNewUser.newUser || 0}人（{`${this.toPercent(
                          this.state.oldNewUser.newUser,
                          this.state.oldNewUser.oldUser +
                            this.state.oldNewUser.newUser
                        )}`}%）
                      </span>
                      <span className="index-i8-value1">
                        {this.state.oldNewUser.oldUser || 0}人（{`${this.toPercent(
                          this.state.oldNewUser.oldUser,
                          this.state.oldNewUser.oldUser +
                            this.state.oldNewUser.newUser
                        )}`}%）
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: 50 }}>
                    <div style={{ fontSize: 18, color: "#333" }}>
                      今日平均购买盒数
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 15
                      }}
                    >
                      <span style={{ color: "#5FBBA8" }}>
                        {this.state.oldNewUser.newUser === 0
                          ? 0
                          : (
                              this.state.oldNewUser.newOrderCount /
                              this.state.oldNewUser.newUser
                            ).toFixed(2)}盒
                      </span>
                      <span style={{ color: "#FC562E" }}>
                        {this.state.oldNewUser.oldUser === 0
                          ? 0
                          : (
                              this.state.oldNewUser.oldOrderCount /
                              this.state.oldNewUser.oldUser
                            ).toFixed(2)}盒
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="用户累积购买排行"
                  extra={
                    <MonthPicker
                      value={moment(this.state.date_buyTop)}
                      onChange={date => {
                        this.setState(
                          { date_buyTop: date.format("YYYY-MM") },
                          () => {
                            this.getBuyTop();
                          }
                        );
                      }}
                      placeholder="请选择月份"
                    />
                  }
                  style={{
                    height: 340,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
                  }}
                >
                  <Table
                    size="small"
                    locale={{ emptyText: "暂无数据" }}
                    columns={columns1}
                    dataSource={this.state.buytop || []}
                    pagination={false}
                    scroll={{ y: 200 }}
                    rowKey="userId"
                  />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col sm={24} md={16}>
            <Card
              title="昨日奖品排行"
              style={{
                height: 720,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <Table
                locale={{ emptyText: "暂无数据" }}
                columns={columns2}
                dataSource={this.state.yAward || []}
                pagination={false}
                scroll={{ y: 540 }}
                rowKey="i"
              />
            </Card>
          </Col>
        </Row>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const indexuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  indexuuid
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
