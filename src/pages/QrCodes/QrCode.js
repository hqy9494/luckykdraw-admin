import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import QRCode from "qrcode.react";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Tenant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  submitNew = values => {
    this.props.rts(
      {
        method: "post",
        url: `/qrbatchs/generate`,
        data: values
      },
      this.uuid,
      "submitNew",
      () => {
        this.setState({ refreshTable: true, visible: false });
      }
    );
  };

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/qrcodes",
        total: "/qrcodes/count"
      },
      buttons: [
        {
          title: "生产",
          onClick: () => {
            this.setState({ visible: true });
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "batchNo",
          title: "批次号"
        }
      ],
      columns: [
        {
          title: "二维码",
          dataIndex: "urlImg",
          key: "urlImg",
          render: (text, record) => <QRCode value={record.url} size={80} />
        },
        {
          title: "批次号",
          dataIndex: "batchNo",
          key: "batchNo"
        },
        {
          title: "code",
          dataIndex: "code",
          key: "code"
        },
        {
          title: "激活状态",
          dataIndex: "activated",
          key: "activated",
          render: text => (text ? "已激活" : "未激活")
        },
        {
          title: "所属兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "所属机器名称/序列号",
          dataIndex: "box",
          key: "box",
          render: (text, record) => {
            if (record.box) {
              return record.box.name || record.box.serial;
            }
          }
        },
        {
          title: "扫码次数",
          dataIndex: "times",
          key: "times"
        },
        {
          title: "是否已中奖",
          dataIndex: "awardId",
          key: "awardId",
          render: text => (text ? "是" : "否")
        },
        {
          title: "奖品",
          dataIndex: "award.name",
          key: "award.name"
        }
      ]
    };

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <TableExpand
              {...config}
              path={`${this.props.match.path}`}
              replace={this.props.replace}
              refresh={this.state.refreshTable}
              onRefreshEnd={() => {
                this.setState({ refreshTable: false });
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title="新建"
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "number",
                field: "amount",
                label: "数量",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              }
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({ visible: false });
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

const Tenantuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  Tenantuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(Tenant);
