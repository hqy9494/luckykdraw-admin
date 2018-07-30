import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import moment from 'moment'

export class StockAwardConsume extends React.Component {
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

  submitNew = (values, type) => {
    if (this.state.curRow && this.state.curRow.id) {

    } else {
      this.props.rts(
        {
          method: "post",
          url: "/stockAwardConsumes/createStockAwardConsume",
          data: {sum: parseFloat(values.sum), type: parseInt(type)}
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
    let url = this.props.match.url;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/stockAwardConsumes`,
        where: {
          type: url[url.length - 1]
        }
      },
      buttons: [
        {
          title: "添加消耗",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "时间",
          dataIndex: "createdAt",
          key: "createdAt",
          render: (v) => {
            return moment(v).format("YYYY-MM-DD")
          }
        },
        {
          title: "消耗金额",
          dataIndex: "sum",
          key: "sum"
        },
        {
          title: "操作员姓名",
          dataIndex: "operatorName",
          key: "operatorName"
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
          title={(this.state.curRow && this.state.curRow.name) || "添加消耗"}
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
                field: "sum",
                label: "消耗",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              }
            ]}
            onSubmit={values => {
              this.submitNew(values, url[url.length - 1]);
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

export default connect(mapStateToProps, mapDispatchToProps)(StockAwardConsume);
