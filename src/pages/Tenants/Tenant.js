import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import {Modal} from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import Config from '../../config';

export class Tenant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  submitNew = values => {
    this.props.rts(
      {
        method: "post",
        url: `/tenants`,
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
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/tenants"
      },
      buttons: [
        {
          title: "添加",
          onClick: () => {
            this.setState({visible: true});
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "名称"
        }
      ],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "补货员注册地址",
          dataIndex: "id",
          key: "id",
          render: function (id) {
            return `${Config.apiUrl}/wx/bind?tenantId=${id}`;
          }
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
                this.setState({refreshTable: false});
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title="添加兑奖中心"
          onCancel={() => {
            this.setState({visible: false});
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
                  rules: [{required: true, message: "必填项"}]
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
