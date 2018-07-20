import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class PrizeAward extends React.Component {
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

  componentWillReceiveProps(nextProps) {}

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      
    } else {
      this.props.rts(
        {
          method: "post",
          url: "/stockAwards",
          data: {data: {...values, value: values.stockCount}}
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

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/stockAwards"
      },
      buttons: [
        {
          title: "添加",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "奖项名称",
          dataIndex: "name",
          key: "name"
        },
        {
            title: "实物累计金额",
            dataIndex: "stockCount",
            key: "stockCount"
          },
          {
            title: "捆绑设备数",
            dataIndex: "boxCount",
            key: "boxCount"
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
                this.setState({ refreshTable: false });
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title={(this.state.curRow && this.state.curRow.name) || "添加奖项"}
          onCancel={() => {
            this.setState({ visible: false });
            window.location.reload();
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "text",
                field: "name",
                label: "奖项名称",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                label: "实物累计金额",
                field: "stockCount",
                type: "select",
                options: [{title: 3, value:3},{title: 10, value:10},{title: 200, value:200},{title: 300, value:300},{title: 500, value:500}],
                params: {
                  initialValue: this.state.curRow && this.state.curRow.stockCount,
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

const PrizeAwarduuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  PrizeAwarduuid
});

export default connect(mapStateToProps, mapDispatchToProps)(PrizeAward);
