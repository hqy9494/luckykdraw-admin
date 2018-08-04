import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Table, Button, Modal} from 'antd';
import FormExpand from "../../components/FormExpand";
import moment from 'components/Moment'
import uuid from "uuid";

export class Region extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: uuid.v1(),
      visible: false
    };
  }

  componentWillMount() {
    this.getReion();
    this.getFirstRegion()
  }

  componentWillReceiveProps(nextProps) {
  }

  // 获取区域json
  getReion() {
    const {rts} = this.props;
    const {uuid} = this.state;
    rts({
        method: 'get',
        url: '/regions/regionsjson'
      },
      uuid,
      'regionsjson',
      result => {
        let region = result && result[0] && result[0].children;
        this.setState({
          regionsjson: region
        })
      })
  }

  // 获取第一个区域
  getFirstRegion() {
    const {rts} = this.props;
    const {uuid} = this.state;
    rts({
        method: 'get',
        url: '/regions/first'
      },
      uuid,
      'firstRegion',
      result => {
        this.setState({
          firstRegion: result && result.id
        })
      })
  }

  submitNew = (values, type) => {
    const { data } = this.state;
    if (type == 'edit') {
      this.props.rts(
        {
          method: "put",
          url: `/regions/${data.editId}`,
          data: {
            name: values.name,
            code: values.code
          }
        },
        this.uuid,
        "edit",
        () => {
          window.location.reload();
        }
      );
    } else {
      this.props.rts(
        {
          method: "post",
          url: "/regions",
          data: {
            pid: data.pid,
            name: values.name,
            code: values.code
          }
        },
        this.uuid,
        "submitNew",
        () => {
          window.location.reload();
        }
      );
    }
  };

  render() {
    const {regionsjson} = this.state;
    const columns = [
      {
        title: '区域名称',
        dataIndex: 'label',
      },
      {
        title: '所含设备数',
        dataIndex: 'total',
        render: text => {
          return (<div>{text || 0}</div>)
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (v, a) => {
          return (
            <div>
              <a href="javascript:;" onClick={() => {this.setState({visible: true, data: {name: a.label, code: a.code, editId: a.value}, type: "edit"})}}>编辑</a>
              <div class="ant-divider ant-divider-vertical"></div>
              <a href="javascript:;" onClick={() => {this.setState({visible: true, data: {pName: a.label, pid: a.value}, type: "create"})}}>添加子区域</a>
            </div>
          )
        }
      }
    ];

    return (
      <section className="index-page">
        <Button onClick={() => {this.setState({visible: true, data: {pid: this.state.firstRegion}, type: "create"})}}>
          添加省份
        </Button>
        <div className="table-contain">
          <Table
            className="mt-20"
            columns={columns}
            dataSource={regionsjson}
            bordered
            rowKey="value"
            locale={{
              emptyText: '暂无数据'
            }}
          />
        </div>
        <Modal
          visible={this.state.visible}
          title={(this.state.data && this.state.data.name) || "添加区域"}
          onCancel={() => {
            this.setState({ visible: false });
            // window.location.reload();
          }}
          footer={null}
        >
        <FormExpand
          elements={[
            {
              type: "text",
              field: "pname",
              label: "所属",
              params: {
                initialValue: this.state.data && this.state.data.pName
              },
              disabled: true
            },
            {
              type: "text",
              field: "name",
              label: "区域名称",
              params: {
                initialValue: this.state.data && this.state.data.name,
                rules: [{ required: true, message: "必填项" }]
              }
            },
            {
              type: "text",
              field: "code",
              label: "区域编码",
              params: {
                initialValue: this.state.data && this.state.data.code,
                rules: [{ required: true, message: "必填项" }]
              }
            }
          ]}
          onSubmit={values => {
            this.submitNew(values, this.state.type);
          }}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        />
        </Modal>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const dUuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  dUuid,
});

export default connect(mapStateToProps, mapDispatchToProps)(Region);
