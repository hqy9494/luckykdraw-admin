import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class PrizeSuper extends React.Component {
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
    if (this.state.curRow && this.state.curRow.id) {
    } else {
    }
  };

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/awards"
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
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
          title: "所属兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "所属机器",
          dataIndex: "boxes.name",
          key: "boxes.name"
        },
        {
          title: "面额",
          dataIndex: "value",
          key: "value"
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: text => {
            if (text) {
              return "启用";
            } else {
              return "禁用";
            }
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({ curRow: record, visible: true });
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
                type: "text",
                field: "name",
                label: "名称",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "number",
                field: "value",
                label: "面额",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.value,
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

const PrizeSuperuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  PrizeSuperuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(PrizeSuper);
