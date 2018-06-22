import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import moment from "moment";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import {Modal} from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class PrizeCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "patch",
          url: `/taobaocoupons/${this.state.curRow.id}`,
          data: {
            ...values,
            startTime: values.startTime[0].toDate(),
            endTime: values.startTime[1].toDate()
          }
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({refreshTable: true, visible: false});
          window.location.reload();
        }
      );
    } else {
      this.props.rts(
        {
          method: "post",
          url: `/taobaocoupons`,
          data: {
            ...values,
            startTime: values.startTime[0].toDate(),
            endTime: values.startTime[1].toDate()
          }
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({refreshTable: true, visible: false});
          window.location.reload();
        }
      );
    }
  };

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/taobaocoupons",
        total: "/taobaocoupons/count"
      },
      buttons: [
        {
          title: "添加优惠券",
          onClick: () => {
            this.setState({visible: true, curRow: null});
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "产品图",
          dataIndex: "mainImage",
          key: "mainImage",
          render: text => <img src={text} alt="商品图片" height="80"/>
        },
        {
          title: "产品名称",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "原价",
          dataIndex: "price",
          key: "price"
        },
        {
          title: "优惠券金额",
          dataIndex: "value",
          key: "value"
        },
        {
          title: "淘口令",
          dataIndex: "tkl",
          key: "tkl"
        },
        {
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          type: "day"
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          key: "endTime",
          type: "day"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({curRow: record, visible: true});
                }}
              >
                编辑
              </a>
            </span>
          )
        }
      ]
    };

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <TableExpand
              {...config}
              refresh={this.state.refreshTable}
              path={`${this.props.match.path}`}
              replace={this.props.replace}
              onRefreshEnd={() => {
                this.setState({refreshTable: false});
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title={(this.state.curRow && this.state.curRow.title) || '添加优惠券'}
          onCancel={() => {
            this.setState({visible: false});
            window.location.reload();
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "text",
                field: "title",
                label: "标题",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.title,
                  rules: [{required: true, message: "必填项"}]
                }
              },
              {
                type: "picture",
                field: "mainImage",
                label: "图片",
                params: {
                  initialValue: this.state.curRow &&
                  this.state.curRow.mainImage && [
                    this.state.curRow.mainImage
                  ],
                  rules: [{required: true, message: "必填项"}]
                },
                upload: "/api/files/upload"
              },
              {
                type: "number",
                field: "price",
                label: "原价",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.price,
                  rules: [{required: true, message: "必填项"}]
                }
              },
              {
                type: "number",
                field: "value",
                label: "优惠券",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.value,
                  rules: [{required: true, message: "必填项"}]
                }
              },
              {
                type: "text",
                field: "tkl",
                label: "淘口令",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.tkl,
                  rules: [{required: true, message: "必填项"}]
                }
              },
              {
                type: "dateRange",
                field: "startTime",
                label: "时效范围",
                params: {
                  initialValue: this.state.curRow &&
                  this.state.curRow.startTime &&
                  this.state.curRow.endTime && [
                    moment(this.state.curRow.startTime),
                    moment(this.state.curRow.endTime)
                  ],
                  rules: [{required: true, message: "必填项"}]
                }
              },
              {
                type: "text",
                field: "description",
                label: "描述",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.description,
                  rules: [{required: true, message: "必填项"}]
                }
              },
            ]}
            onSubmit={values => {
              // console.log(values);
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({visible: false});
              window.location.reload();
            }}
          />
        </Modal>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const PrizeCouponuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  PrizeCouponuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(PrizeCoupon);
