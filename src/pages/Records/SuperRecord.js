import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import {Modal, Tabs} from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
export class SuperRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "",
        total: ""
      },
      buttons: [],
      search: [],
      columns: [
        {
            title: "奖项名称",
            dataIndex: "a1",
            key: "a1"
          },
          {
            title: "中奖用户",
            dataIndex: "a2",
            key: "a2"
          },
          {
            title: "中奖时间",
            dataIndex: "a3",
            key: "a3"
          },
          {
            title: "中奖位置",
            dataIndex: "a4",
            key: "a4"
          },
          {
            title: "派发员",
            dataIndex: "a5",
            key: "a5"
          },
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
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const SuperRecorduuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
    SuperRecorduuid
});

export default connect(mapStateToProps, mapDispatchToProps)(SuperRecord);
