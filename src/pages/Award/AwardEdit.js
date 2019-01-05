import React from "react";
import { Panel } from 'react-bootstrap';
import {Form, Input, Button, Upload, Icon, message,WhiteSpace} from 'antd';

// 引入编辑器组件样式
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'
import BraftEditor from 'braft-editor'
import Table from 'braft-extensions/dist/table'
import { ContentUtils } from 'braft-utils'

import uuid from "uuid";
import configURL from "../../config/index";
console.log(configURL,"configURL");
const FormItem = Form.Item;

const success = (msg) => {
  message.success(msg);
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

BraftEditor.use(Table({
  defaultColumns: 4,
  defaultRows: 3
}))

class BuyRuleSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agreementId: '',
      agreementTitle: '',
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState('<p>Hello</p>')
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {

  }

  componentDidMount() {

    this.setEditorContentAsync();

  }

  setEditorContentAsync = () => {

    this.props.rts({
      method: 'get',
      url: '/Agreements',
      params: {filter:{where:{type:'buyRule'}}}
    }, this.uuid, 'setEditorContentAsync', (data) => {

      if(!data.length) return false;

      this.props.form.setFieldsValue({
        content: BraftEditor.createEditorState(data[0].content)
      })
      this.setState({
        agreementId: data[0].id,
        agreementTitle: data[0].title
      })
    })
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  handleSubmit = (event) => {

    event.preventDefault()

    this.props.form.validateFields((error, values) => {
      if (!error) {
        const submitData = {
          title: values.title,
          content: values.content.toHTML(),
          type: 'buyRule'
        }
        this.putAgreements(submitData)
      }
    })
  }

  putAgreements = (data) => {
    console.log(this.state.agreementId,"this.state.agreementId");
    this.props.rts({
      method: 'put',
      url: `/Agreements/${this.state.agreementId}`,
      data: data
    }, this.uuid, 'putAgreements', (data) => {
        success('操作成功！')
    })

  }

  uploadHandler = (param) => {
    if (!param.file) {
      return false
    } 
    let form = new FormData();        // FormData 对象
    form.append("file", param.file);  // 文件对象

    this.props.rts({
      method: 'post',
      url: param.action,
      data: form
    }, this.uuid, 'uploadHandler', (data) => {
      console.log(data, 'imgData')
      const editorState = this.props.form.getFieldValue('content')
      this.props.form.setFieldsValue({
        'content': ContentUtils.insertMedias(editorState, [{
          type: 'IMAGE',
          url: data.url
        }])
      })

    })
  }

  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close()
    }
    window.previewWindow = window.open()
    window.previewWindow.document.write(this.buildPreviewHtml())
    window.previewWindow.document.close()
  }

  buildPreviewHtml () {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.state.editorState.toHTML()}</div>
        </body>
      </html>
    `
  }

  render(){

    const { getFieldDecorator } = this.props.form

    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      },
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            action={`${configURL.apiUrl}${configURL.apiBasePath}/files/upload`}
            headers={{
              Authorization: localStorage.token
            }}
            accept="image/*"
            showUploadList={false}
            customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" />
            </button>
          </Upload>
        )
      }
    ]

    const excludeControls = ['emoji', 'fullscreen', 'media']  //隐藏控件

    const child = (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="标题">
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: '请输入标题',
              }],
              initialValue: this.state.agreementTitle
            })(
              <Input size="large" placeholder="请输入标题"/>
            )}
          </FormItem>
          <FormItem label="正文内容">
            {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [{
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入正文内容')
                  } else {
                    callback()
                  }
                }
              }],
            })(
              <BraftEditor
                style={{border: '1px solid #d9d9d9'}}
                placeholder="请输入正文内容"
                onChange={this.handleEditorChange}
                excludeControls={excludeControls}
                extendControls={extendControls}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout}  className="ta-c mt-20">
            <Button style={{marginRight: 10}} onClick={()=>{console.log('取消')}}>取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </FormItem>
        </Form>
      </div>
    )

    return (
      <section className="rule-page">
        <Panel>
            {child}
        </Panel>
        
      </section>

    )
  }
}

export default Form.create()(BuyRuleSetting)
// export default BuyRuleSetting;
