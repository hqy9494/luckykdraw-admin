import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Panel } from "react-bootstrap";
import { Form, Button, Icon, InputNumber, Modal, Select } from "antd";

const FormItem = Form.Item;
const { Option } = Select;
export class QrTemplateDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    if (this.props.match.params.id && this.props.match.params.id !== "add") {
      this.getOne(this.props.match.params.id);
    }
    this.getAwards();
  }

  componentWillReceiveProps(nextProps) {}

  getAwards = () => {
    this.props.rts(
      {
        method: "get",
        url: `/awardtemplates/awards`
      },
      this.uuid,
      "awards"
    );
  };

  getOne = id => {
    id &&
      this.props.rts(
        {
          method: "get",
          url: `/awardtemplates/${id}/award`
        },
        this.uuid,
        "pageInfo",
        result => {
          this.setState({
            elements: result
              .map((r, i) => {
                if (r.award) {
                  return {
                    value: r.amount,
                    id: r.award.id,
                    title: r.award.name
                  };
                }
              })
              .filter(r => !!r)
          });
        }
      );
  };

  submitNew = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let awards = [];
        for (let key in values) {
          awards.push({ id: key, amount: values[key] });
        }

        if (this.props.match.params.id && awards.length > 0) {
          this.props.rts(
            {
              method: "put",
              url: `/awardtemplates/${this.props.match.params.id}/award`,
              data: { awards }
            },
            this.uuid,
            "newPage",
            () => {
              this.props.to("/prizes/template");
            }
          );
        }
      }
    });
  };

  remove = (kId) => {
    const { elements } = this.state;
    this.setState({elements: elements.filter(key => key.id !== kId)})
  }

  add = () => {
    let { elements, newAward } = this.state;

    if(!elements.find((e)=> e.id === newAward.id)){
      elements.push(newAward)
      this.setState({elements,newAward:null});
    }
  }

  render() {

    const { awards } = this.props;

    let awardList = [];

    if (awards && awards[this.uuid]) {
      awardList = awards[this.uuid].map(t => {
        return {
          title: t.name,
          id: t.id
        };
      });
    }
    
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const formItems = this.state.elements.map((k) => {
      return (
        <FormItem
          {...formItemLayout}
          label={k.title}
          key={k.id}
        >
          {getFieldDecorator(k.id, {
            initialValue: k.value,
            rules: [{ required: true, message: "必填项" }]
          })(
            <InputNumber style={{ width: '60%', marginRight: 8 }} />
          )}
          <Icon
            type="minus-circle-o"
            onClick={() => this.remove(k.id)}
          />
        </FormItem>
      );
    });

    return (
      <Panel
        header={
          this.props.params && this.props.params.name
            ? decodeURI(this.props.params.name)
            : "基本信息"
        }
      >
        <div style={{ maxWidth: 750 }}>
          <Form onSubmit={this.submitNew}>
            {formItems}
            {
              formItems.length < awardList.length ? (
              <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={()=>{this.setState({visible: true})}} style={{ width: '60%' }}>
                  <Icon type="plus" /> 添加奖品
                </Button>
              </FormItem>
              ):null
            }
            
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          </Form>
        </div>
        <Modal
          visible={this.state.visible}
          title="添加奖品"
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <FormItem
            labelCol= {{ span: 6 }}
            wrapperCol= {{ span: 14 }}
            label="奖品"
          >
            <Select notFoundContent="暂无数据" value={this.state.newAward?this.state.newAward.id:null} style={{width: "100%"}} onChange={(id)=>{
              this.setState({newAward: awardList.find((a)=> a.id === id)})
            }}>
              {awardList.map(o => (
                <Option key={o.id} value={o.id} disabled={this.state.elements.map((e)=>e.id).indexOf(o.id)===-1?false:true}>
                  {o.title}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" disabled={this.state.newAward?false:true} onClick={()=>{
              this.setState({visible:false},()=>{this.add()})
            }}>添加</Button>
          </FormItem>
        </Modal>
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const pageInfo = state => state.get("rts").get("pageInfo");
const awards = state => state.get("rts").get("awards");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  pageInfo,
  awards
});

const WrappedQrTemplateDetail = Form.create()(QrTemplateDetail);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedQrTemplateDetail);
