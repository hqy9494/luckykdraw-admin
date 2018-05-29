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
    this.getAward();
  }

  componentWillReceiveProps(nextProps) {}

  getAward = () => {
    this.props.rts(
      {
        method: "get",
        url: `/awards`
      },
      this.uuid,
      "award"
    );
  };
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
        url: `/tenantawards`,
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
    const { tenant, award } = this.props;
    const { curRow } = this.state;
    let awardList = [],
      tenantList = [];

    if (tenant && tenant[this.uuid]) {
      tenantList = tenant[this.uuid].map(t => {
        return {
          title: t.name,
          value: t.id
        };
      });
    }

    if (award && award[this.uuid]) {
      awardList = award[this.uuid].map(a => {
        return {
          title: a.name,
          value: a.id
        };
      });
    }

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/tenantawards"
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: {},
      columns: [
        {
          title: "兑奖中心名称",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "奖品名称",
          dataIndex: "award.name",
          key: "award.name"
        },
        {
          title: "库存",
          dataIndex: "inventory",
          key: "inventory",
          alian: "right"
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
                编辑库存
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
            <TableExpand {...config} />
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
                  initialValue: curRow && curRow.tenant.id,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                label: "机器",
                field: "awardId",
                type: "select",
                options: awardList,
                params: {
                  initialValue: curRow && curRow.award.id,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "number",
                field: "inventory",
                label: "新增数量",
                params: {
                  initialValue: curRow && curRow.inventory,
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
const award = state => state.get("rts").get("award");

const mapStateToProps = createStructuredSelector({
  Tenantuuid,
  tenant,
  award
});

export default connect(mapStateToProps, mapDispatchToProps)(Tenant);
