import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import moment from "moment";
import { Col, Grid, Row, Panel } from "react-bootstrap";
import { Table, Button } from "antd";
const ButtonGroup = Button.Group;

import SearchExpand from "../../components/SearchExpand";

export class QrBatchNoUse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skip: 0,
      order: "batchNo ASC"
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getBatch();
  }

  componentWillReceiveProps(nextProps) {}

  getBatch = () => {
    const { where, skip, order } = this.state;
    this.getBatchCount(where);
    this.props.rts(
      {
        method: "get",
        url: "/qrbatchnos",
        params: Object.assign(
          {
            order,
            skip,
            limit: 10
          },
          where && { where: this.dealWhere(where) }
        )
      },
      this.uuid,
      "batchs",
      result => {
        this.setState({ data: result });
      }
    );
  };
  getBatchCount = (where = {}) => {
    this.props.rts(
      {
        method: "get",
        url: `/qrbatchnos/count`,
        params: {
          where: Object.assign(
            {},
            where.batchNo && { batchNo: { like: `%${where.batchNo}%` } },
            (where.activated === true || where.activated === false) && {
              activated: where.activated
            }
          )
        }
      },
      this.uuid,
      "batchCount",
      result => {
        this.setState({ count: result.count || 0 });
      }
    );
  };
  dealWhere(where) {
    let str = "";
    if (where.batchNo) {
      str += `batchNo like '%${where.batchNo}%'`;
    }
    if (where.activated === true || where.activated === false) {
      str += `${where.batchNo ? "and " : ""}activated = ${where.activated}`;
    }
    return str;
  }

  render() {
    const search = [
      {
        type: "field",
        field: "batchNo",
        title: "批次号"
      },
      {
        type: "option",
        title: "激活状态",
        field: "activated",
        options: [
          { title: "已激活", value: true },
          { title: "未激活", value: false }
        ]
      }
    ];
    const columns = [
      {
        title: "批次编号",
        dataIndex: "batchNo",
        key: "batchNo"
      },
      {
        title: "已扫描二维码",
        dataIndex: "scanNumber",
        key: "scanNumber",
        render: text => text || 0
      },
      {
        title: "未扫描二维码",
        dataIndex: "unScanNumber",
        key: "unScanNumber",
        render: text => text || 0
      },
      {
        title: "设备",
        dataIndex: "box.name",
        key: "box.name"
      },
      {
        title: "激活时间",
        dataIndex: "activatedDate",
        key: "activatedDate",
        render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
      },
      {
        title: "状态",
        dataIndex: "activated",
        key: "activated",
        render: text => (text ? "已激活" : "未激活")
      }
    ];

    let pagination = {
      pageSize: 10,
      total: this.state.count,
      current: Math.ceil(this.state.skip / 10 + 1),
      onChange: (page, pageSize) => {
        this.setState({ skip: (page - 1) * pageSize }, () => {
          this.getBatch();
        });
      }
    };

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <Panel>
              <Row>
                <Col xs={12} md={6} />
                <Col xs={12} md={6}>
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      {search &&
                        search.length > 0 && (
                          <SearchExpand
                            search={search}
                            onSearchChange={searchs => {
                              // console.log(searchs);
                              let where;
                              if (searchs.length > 0) {
                                where = {};
                                searchs.map(s => {
                                  if (s.field === "batchNo") {
                                    where[s.field] = s.values;
                                  } else if (s.field === "activated") {
                                    where[s.field] = s.values.value;
                                  }
                                });
                              }
                              this.setState({ where, skip: 0 }, () => {
                                this.getBatch();
                              });
                            }}
                          />
                        )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Table
                rowKey="id"
                scroll={{ x: 1000 }}
                style={{ marginTop: 16 }}
                columns={columns}
                dataSource={this.state.data}
                pagination={pagination}
                locale={{
                  filterTitle: "筛选",
                  filterConfirm: "确定",
                  filterReset: "重置",
                  emptyText: "暂无数据"
                }}
              />
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const QrBatchNoUseuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  QrBatchNoUseuuid
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QrBatchNoUse);
