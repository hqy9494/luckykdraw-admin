import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import QRCode from "qrcode.react";
import { Col, Grid, Row } from "react-bootstrap";
import { Progress, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import Config from "../../config";

export class QrBatchNo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getSpecifications();
  }

  componentWillReceiveProps(nextProps) {}

  getSpecifications = () => {
    this.props.rts(
      {
        method: "get",
        url: `/specifications`
      },
      this.uuid,
      "specifications"
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
        this.setState({ refreshTable: true, visible: false });
      }
    );
  };

  render() {
    const { specifications } = this.props;

    let specificationList = [];

    if (specifications && specifications[this.uuid]) {
      specificationList = specifications[this.uuid].map(t => {
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
        data: "/qrbatchnos",
        total: "/qrbatchnos/count"
      },
      buttons: [
        {
          title: "生产",
          onClick: () => {
            this.setState({ visible: true });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "批次编号",
          dataIndex: "batchNo",
          key: "batchNo"
        },
        {
          title: "已使用二维码",
          dataIndex: "use",
          key: "use"
        },
        {
          title: "未使用二维码",
          dataIndex: "unused",
          key: "unused"
        },
        {
          title: "激活时间",
          dataIndex: "activatedDate",
          key: "activatedDate",
          type: "date"
        },
        {
          title: "状态",
          dataIndex: "activated",
          key: "activated",
          render: (text)=>text?"已激活":"未激活"
        },
      ],
      path: `${this.props.match.path}`,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <TableExpand {...config} />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title="生成二维码"
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

const QrBatchNouuid = state => state.get("rts").get("uuid");
const specifications = state => state.get("rts").get("specifications");

const mapStateToProps = createStructuredSelector({
  QrBatchNouuid,
  specifications
});

export default connect(mapStateToProps, mapDispatchToProps)(QrBatchNo);
