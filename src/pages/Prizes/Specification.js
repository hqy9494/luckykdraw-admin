import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import uuid from 'uuid';
import { Col, Grid, Row } from 'react-bootstrap';
import { Modal } from 'antd';
import TableExpand from '../../components/TableExpand';
import FormExpand from '../../components/FormExpand';

export class Specification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps() {}

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "patch",
          url: `/specifications/${this.state.curRow.id}`,
          data: values
        },
        this.uuid,
        "submitFix",
        () => {
          this.setState({ refreshTable: true, visible: false });
        }
      );
    } else {
      this.props.rts(
        {
          method: "post",
          url: `/specifications`,
          data: values
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
        data: '/specifications',
        total: '/specifications/count',
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
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => (
            <span title={record.description}>{text}</span>
          )
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          key: 'quantity'
        },
        {
          title: '操作',
          key: 'handle',
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
            </span>
          )
        }
      ],
      path: `${this.props.match.path}`,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
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
          title={(this.state.curRow && this.state.curRow.name) || "添加规格"}
          onCancel={() => {
            this.setState({ visible: false });
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
                  initialValue: this.state.curRow && this.state.curRow.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "number",
                field: "quantity",
                label: "数量",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.quantity,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "description",
                label: "描述",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.description,
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

const mapDispatchToProps = () => {
  return {};
};

const Specificationuuid = state => state.get('rts').get('uuid');

const mapStateToProps = createStructuredSelector({
  Specificationuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(Specification);
