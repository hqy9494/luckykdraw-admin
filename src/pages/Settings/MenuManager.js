import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import { Table, Button } from "antd";
const ButtonGroup = Button.Group;

export class MenuManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getAllMenu();
  }

  componentWillReceiveProps(nextProps) {}

  getAllMenu = () => {
    this.props.rts(
      {
        method: "get",
        url: `/menus/all`
      },
      this.uuid,
      "allMenu"
    );
  };

  render() {
    const { allMenu } = this.props;
    let data = [];

    if (allMenu && allMenu[this.uuid]) {
      data = allMenu[this.uuid];
    }

    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "标识",
        dataIndex: "eName",
        key: "eName"
      },
      {
        title: "组件/路由",
        dataIndex: "component",
        key: "component"
      },
      {
        title: "排序",
        dataIndex: "sort",
        key: "sort"
      },
      {
        title: "操作",
        key: "handle",
        render: (text, record) => (
          <span>
            <a
              href="javascript:;"
              onClick={() => {
                this.props.to(`${this.props.match.path}/detail/${record.id}`);
              }}
            >
              编辑权限
            </a>
          </span>
        )
      }
    ];

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <Panel>
              <Row>
                <Col xs={12} md={4} />
                <Col xs={12} md={8}>
                  <ButtonGroup className="pull-right">
                    <Button
                      onClick={() => {
                        this.props.to(
                          `${this.props.match.path}/add`
                        );
                      }}
                    >
                      新建
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Table
                style={{ marginTop: 16 }}
                rowKey="id"
                columns={columns}
                dataSource={data}
              />
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const MenuManageruuid = state => state.get("rts").get("uuid");
const allMenu = state => state.get("rts").get("allMenu");

const mapStateToProps = createStructuredSelector({
  MenuManageruuid,
  allMenu
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager);
