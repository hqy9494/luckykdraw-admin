import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import QRCode from "qrcode.react";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Form } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

const FormItem = Form.Item;

export class QrTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/awardtemplates"
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <span title={record.description}>{text}</span>
          )
        },
        {
          title: "兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "盒子",
          dataIndex: "box.name",
          key: "box.name"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <a
                href="javascript:;"
                onClick={() => {
                  this.props.to(
                    `${this.props.match.path}/detail/${record.id}?name=${
                      record.name
                    }`
                  );
                }}
              >
                编辑奖品
              </a>
            </span>
          )
        }
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
          1
        </Modal>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const QrTemplateuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  QrTemplateuuid
});

const WrappedQrTemplate = Form.create()(QrTemplate);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedQrTemplate);
