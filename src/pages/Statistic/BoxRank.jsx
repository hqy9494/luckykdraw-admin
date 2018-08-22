import React from "react";
import { Col, Row, Table } from "antd";

export class BoxRank extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {content} =  this.props;
    content = content || [];

    const columns = [{
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      align: "center"
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: "center",
      render: (v, r) => {
        if (r.fromType === 'direct') {
          return <div>{v}<img className="statistic-box-rank-table-direct-agent" src="./assets/img/direct.jpg" /></div>
        }
        if (r.fromType === 'agent') {
          return <div>{v}<img className="statistic-box-rank-table-direct-agent" src="./assets/img/agent.jpg" /></div>
        }
        return v
      }
    }, {
      title: '今日销售额',
      dataIndex: 'sum',
      key: 'sum',
      align: "center"
    }, {
      title: '订单量',
      dataIndex: 'count',
      key: 'count',
      align: "center"
    }];

    let data = [];

    for (let i = 0; i < 10; i++) {
      data[i] = {
        order: i + 1,
        name: content[i] ? content[i].name : '',
        count: content[i] ? content[i].sum : '',
        sum: content[i] ? content[i].sum * 30 : '',
        fromType: content[i] ? content[i].fromType : ''
      }
    }

    return (
      <div className="statistic-box-with-title-bar" style={{width: "68%", height: 450}}>
        <div className="title">
          设备排行
        </div>
        <div className="statistic-box-rank-table">
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </div>
    );
  }
}

export default BoxRank
