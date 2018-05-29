import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Tenant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getTenant();
  }

  componentWillReceiveProps(nextProps) {}

  getTenant = () => {
    this.props.rts(
      {
        method: "get",
        url: `/tenants`
      },
      this.uuid,
      "tenant"
    );
  };

  submitNew = values => {
    this.props.rts(
      {
        method: "post",
        url: `/boxes`,
        data: {
          name: values.name,
          serial: values.serial,
          tenantId: values.tenantId,
          location: {
            name: values.locationName,
            address: values.address,
            contactMobile: values.contactMobile,
            contact: values.contact,
            regionId: "ByWbXglYJ7"
          }
        }
      },
      this.uuid,
      "submitNew",
      () => {
        this.setState({ refreshTable: true, visible: false });
      }
    );
  };

  render() {
    const { tenant } = this.props;
    let tenantList = [];

    if (tenant && tenant[this.uuid]) {
      tenantList = tenant[this.uuid].map(t => {
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
        data: "/boxes"
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({ visible: true });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "序列号",
          dataIndex: "serial",
          key: "serial"
        },
        {
          title: "地址",
          dataIndex: "location.address",
          key: "location.address"
        },
        {
          title: "联系方式",
          dataIndex: "location",
          key: "location",
          render: (text, record) =>
            record.location &&
            record.location.contact &&
            record.location.contactMobile &&
            `${record.location.contact || ""}(${record.location.contactMobile ||
              ""})`
        },
        {
          title: "所属兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
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
                label: "兑奖中心",
                field: "tenantId",
                type: "select",
                options: tenantList,
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "name",
                label: "设备名称",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "serial",
                label: "序列号",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "locationName",
                label: "位置名称",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "address",
                label: "地址",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "contactMobile",
                label: "电话",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "contact",
                label: "联系人",
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
const tenant = state => state.get("rts").get("tenant");

const mapStateToProps = createStructuredSelector({
  Tenantuuid,
  tenant
});

export default connect(mapStateToProps, mapDispatchToProps)(Tenant);
