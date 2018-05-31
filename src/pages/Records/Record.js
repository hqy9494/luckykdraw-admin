import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal, Tabs } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

const TabPane = Tabs.TabPane;

export class Record extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  submitNew = values => {};

  render() {
    const config1 = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: ""
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name"
        }
      ]
    };

    const config2 = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: ""
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={() => {}}>
                发货
              </a>
            </span>
          )
        }
      ]
    };

    return (
      <Grid fluid>
        <Tabs defaultActiveKey="1">
          <TabPane tab="实物" key="1">
            <Row>
              <Col lg={12}>
                <TableExpand
                  {...config2}
                  refresh={this.state.refreshTable2}
                  onRefreshEnd={() => {
                    this.setState({ refreshTable2: false });
                  }}
                />
              </Col>
            </Row>
            <Modal
              visible={this.state.visible}
              title="实物发货"
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
          </TabPane>
          <TabPane tab="虚拟" key="2">
            <Row>
              <Col lg={12}>
                <TableExpand
                  {...config1}
                  refresh={this.state.refreshTable1}
                  onRefreshEnd={() => {
                    this.setState({ refreshTable1: false });
                  }}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const Recorduuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  Recorduuid
});

export default connect(mapStateToProps, mapDispatchToProps)(Record);
