import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import QRCode from "qrcode.react";
import {Col, Grid, Row} from "react-bootstrap";
import {Modal} from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Tenant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      qrCode: {}
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getSpecification();
  }

  componentWillReceiveProps(nextProps) {
  }

  getSpecification = () => {
    this.props.rts(
      {
        method: "get",
        url: `/specifications`
      },
      this.uuid,
      "specification"
    );
  };

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
        this.setState({refreshTable: true, visible: false});
      }
    );
  };

  render() {

    const { specification } = this.props;

    let specificationList = [];

    if (specification && specification[this.uuid]) {
      specificationList = specification[this.uuid].map(t => {
        return {
          title: t.name,
          value: t.id
        };
      });
    }

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
            this.setState({visible: true});
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "batchNo",
          title: "批次号"
        },
        {
          type: "relevance",
          field: "tenantId",
          model: {
            name: "tenant",
            api: "/tenants",
            field: "name"
          },
          title: "兑奖中心"
        },
        {
          type: "relevance",
          field: "boxId",
          model: {
            name: "box",
            api: "/boxes",
            field: "name"
          },
          title: "设备名称"
        },
        {
          type: "relevance",
          field: "awardId",
          model: {
            name: "award",
            api: "/awards",
            field: "name"
          },
          title: "奖品名称"
        },
        {
          type: "option",
          title: "激活状态",
          field: "activated",
          options: [
            {title: "已激活", value: true},
            {title: "未激活", value: false},
          ]
        }
      ],
      columns: [
        {
          title: "批次",
          dataIndex: "batchNo",
          key: "batchNo"
        },
        {
          title: "内容",
          dataIndex: "code",
          key: "code"
        },
        {
          title: "兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "设备名称/序列号",
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
          title: "是否激活",
          dataIndex: "activated",
          key: "activated",
          render: text => (text ? "已激活" : "未激活")
        },
        {
          title: "奖品名称",
          dataIndex: "award.name",
          key: "award.name",
          render: (text, record) => {
            if (record.activated) {
              return (record.award && record.award.name) || '无奖品'
            }
          }
        },
        {
          title: "显示二维码",
          dataIndex: "urlImg",
          key: "urlImg",
          // render: (text, record) => <QRCode value={record.url} size={80}/>
          render: (text, record) => {
            return <span>
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({qrCode: record, showQrCode: true});
                }}
              >
                显示
              </a>
            </span>
          }
        },
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
                this.setState({refreshTable: false});
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title="生成二维码"
          onCancel={() => {
            this.setState({visible: false});
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "number",
                field: "amount",
                label: "批次数量",
                params: {
                  rules: [{required: true, message: "必填项"}]
                }
              },
              {
                label: "规格",
                field: "specificationId",
                type: "select",
                options: specificationList,
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              }
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({visible: false});
            }}
          />
        </Modal>

        <Modal
          visible={this.state.showQrCode}
          title={this.state.qrCode.batchNo + '-' + this.state.qrCode.code}
          onCancel={() => {
            this.setState({showQrCode: false});
          }}
          footer={null}
        >
          <div style={{'text-align': 'center'}}>
            <QRCode value={this.state.qrCode.url} size={120}/>
          </div>
        </Modal>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const Tenantuuid = state => state.get("rts").get("uuid");
const specification = state => state.get("rts").get("specification");

const mapStateToProps = createStructuredSelector({
  Tenantuuid,
  specification
});

export default connect(mapStateToProps, mapDispatchToProps)(Tenant);
