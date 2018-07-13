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
    this.getSpecification();
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
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "patch",
          url: `/boxes/${this.state.curRow.id}`,
          data: Object.assign(
            {
              name: values.name,
              serial: values.serial,
              tenantId: values.tenantId,
              specificationId: values.specificationId
            },
            this.state.curRow.location &&
              this.state.curRow.location.id && {
                location: {
                  id: this.state.curRow.location.id,
                  name: values.locationName,
                  address: values.address,
                  contactMobile: values.contactMobile,
                  contact: values.contact
                }
              }
          )
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({ refreshTable: true, visible: false });
        }
      );
    } else {
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
            },
            specificationId: values.specificationId
          }
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({ refreshTable: true, visible: false });
        }
      );
    }
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
        data: "/boxes"
      },
      buttons: [
        {
          title: "添加",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "名称"
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
        }
      ],
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
          title: "位置",
          dataIndex: "location.address",
          key: "location.address"
        },
        {
          title: "兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "二维码规格",
          dataIndex: "specification.name",
          key: "specification.name"
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
              <Divider type="vertical" />
              <a
                href="javascript:;"
                onClick={() => {
                  this.props.to(
                    `${this.props.match.path}/detail/${record.id}?name=${
                      record.name
                    }&type=box`
                  );
                }}
              >
                中奖模板
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
          title={(this.state.curRow && this.state.curRow.name) || "添加机器"}
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
                  initialValue: this.state.curRow && this.state.curRow.tenantId,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                label: "规格",
                field: "specificationId",
                type: "select",
                options: specificationList,
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.specificationId,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "name",
                label: "设备名称",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "serial",
                label: "序列号",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.serial,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "locationName",
                label: "位置名称",
                params: {
                  initialValue:
                    this.state.curRow &&
                    this.state.curRow.location &&
                    this.state.curRow.location.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "address",
                label: "详细地址",
                params: {
                  initialValue:
                    this.state.curRow &&
                    this.state.curRow.location &&
                    this.state.curRow.location.address,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "contactMobile",
                label: "联系电话",
                params: {
                  initialValue:
                    this.state.curRow &&
                    this.state.curRow.location &&
                    this.state.curRow.location.contactMobile,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "contact",
                label: "联系人",
                params: {
                  initialValue:
                    this.state.curRow &&
                    this.state.curRow.location &&
                    this.state.curRow.location.contact,
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
const specification = state => state.get("rts").get("specification");

const mapStateToProps = createStructuredSelector({
  Tenantuuid,
  tenant,
  specification
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tenant);
