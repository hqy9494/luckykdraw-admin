import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal, TreeSelect } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Tenant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      locationModel: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getTenant();
    this.getSpecification();
    this.getUser();
    this.getRegionJson();
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

  getRegionJson = () => {
    this.props.rts(
      {
        method: "get",
        url: '/regions/regionsjson'
      },
      this.uuid,
      "treeData",
      treeData => {
        this.setState({ treeData: treeData });
      }
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

  getUser = () => {
    this.props.rts(
      {
        method: "get",
        url: "/accounts/replenishmenters"
      },
      this.uuid,
      "users"
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
              specificationId: values.specificationId,
              fromType: values.fromType
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

      if (values.userId) {
        this.props.rts(
          {
            method: "post",
            url: "/boxes/bind/replenishment",
            data: {
              boxId: this.state.curRow.id,
              userId: values.userId
            }
          },
          this.uuid,
          "submitNew",
          () => {
            this.setState({ refreshTable: true, visible: false });
          }
        );
      }
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
              regionId: "ByWbXglYJ7",
              fromType: values.fromType
            },
            specificationId: values.specificationId
          }
        },
        this.uuid,
        "submitNew",
        result => {
          if (values.userId) {
            this.props.rts(
              {
                method: "post",
                url: "/boxes/bind/replenishment",
                data: {
                  boxId: result.id,
                  userId: values.userId
                }
              },
              this.uuid,
              "submitNew",
              () => {
                this.setState({ refreshTable: true, visible: false });
              }
            );
          }
        }
      );
    }
  };

  onChange = (v) => {
    this.setState({
      choosedId: v
    })
  };

  handleOk = () => {
    this.setState({
      locationModel: false
    });
    this.props.rts(
      {
        method: "post",
        url: "/regions/bindBox",
        data: {
          locationId: this.state.locationId,
          regionId: this.state.choosedId
        }
      },
      this.uuid,
      "submitNew",
      () => {
        this.setState({ refreshTable: true, visible: false });
      }
    );
  };

  enableBox = (id, enable) => {
    this.props.rts(
      {
        method: "post",
        url: "/boxes/switchEnable",
        params: {
          id,
          enable
        }
      },
      this.uuid,
      "enableBox",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  };

  render() {
    const { tenant } = this.props;
    const { treeData } = this.state;
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

    const { users } = this.props;

    let usersList = [];
    let fromTypeList = [{title: "直营", value: "direct"}, {title: "代理", value: "agent"}];

    if (users && users[this.uuid]) {
      usersList = users[this.uuid].map(t => {
        return {
          title: t.fullname,
          value: t.id
        };
      });
    }

    const config = {
      replace: this.props.replace,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/boxes",
        total: "/boxes/count"
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
          type: "field",
          field: "region",
          title: "设备区域"
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
          title: "区域",
          dataIndex: "region",
          key: "region",
          render: (v) => {
            return v && v.name
          }
        },
        // {
        //   title: "兑奖中心",
        //   dataIndex: "tenant.name",
        //   key: "tenant.name"
        // },
        {
          title: "二维码规格",
          dataIndex: "specification.name",
          key: "specification.name"
        },
        {
          title: "状态",
          dataIndex: "enable",
          key: "enable",
          render: (v) => {
            return v ? "开启" : "关闭"
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
              <Divider type="vertical" />
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({
                    locationModel: true,
                    locationName: record.location && record.location.address,
                    regionName: record.region && record.region.name,
                    locationId: record.location && record.location.id
                  })
                }}
              >
                绑定区域
              </a>
              <Divider type="vertical" />
              <a
                href="javascript:;"
                onClick={() => {this.enableBox(record.id, !record.enable)}}
              >
                {record.enable ? "关闭" : "开启"}
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
              },
              {
                label: "补货员",
                field: "userId",
                type: "select",
                options: usersList,
                params: {
                  initialValue: this.state.curRow && this.state.curRow.replenishmentId,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                label: "所属类型",
                field: "fromType",
                type: "select",
                options: fromTypeList,
                params: {
                  initialValue: this.state.curRow && this.state.curRow.fromType
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
        <Modal
          visible={this.state.locationModel}
          title={"绑定机器"}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ locationModel: false });
          }}
        >
          <p>
            机器位置：{this.state.locationName}
          </p>
          <p>
            机器区域：{this.state.regionName}
          </p>
          <TreeSelect
            treeData={treeData}
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            allowClear
            treeDefaultExpandAll
            onChange={this.onChange}
          >
          </TreeSelect>
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
const users = state => state.get("rts").get("users");

const mapStateToProps = createStructuredSelector({
  Tenantuuid,
  tenant,
  specification,
  users
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tenant);
