import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Popconfirm } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Clue extends React.Component {
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
      this.props.rts(
        {
          method: "patch",
          url: `/clues/${this.state.curRow.id}`,
          data: values
        },
        this.uuid,
        "submitFix",
        () => {
          this.setState({ refreshTable: true, visible: false });
          window.location.reload();
        }
      );
    } else {
      this.props.rts(
        {
          method: "post",
          url: `/clues`,
          data: values
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({ refreshTable: true, visible: false });
          window.location.reload();
        }
      );
    }
  };

  delete=(id)=>{
    this.props.rts(
        {
          method: "delete",
          url: `/clues/${id}`
        },
        this.uuid,
        "delete",
        () => {
          this.setState({ refreshTable: true, visible: false });
          window.location.reload();
        }
    );
  }

  render() {

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/clues",
        total: "/clues/count"
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
            title: "线索",
            dataIndex: "content",
            key: "content"
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
              <Popconfirm title="确定删除该线索" onConfirm={()=>this.delete(record.id)} okText="是" cancelText="否">
                <a
                    href="javascript:;"
                >
                    删除
                </a>
            </Popconfirm>
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
          title={`${this.state.curRow?"编辑":"新建"}线索`}
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
                field: "content",
                label: "线索",
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.content
                }
              }
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({ visible: false });
              window.location.reload();
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

const Clueuuid = state => state.get("rts").get("uuid");
const type = state => state.get("rts").get("type");

const mapStateToProps = createStructuredSelector({
  Clueuuid,
  type
});

export default connect(mapStateToProps, mapDispatchToProps)(Clue);
