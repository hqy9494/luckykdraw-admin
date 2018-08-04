import React from "react";
import { Col, Row, Table } from "antd";

export class RankTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {content, columns, title, width} =  this.props;
    content = content || [];

    let data = [];

    for (let i = 0; i < 10; i++) {
      data[i] = Object.assign({}, content[i] || {}, {order: i + 1})
    }

    return (
      <div className="statistic-box-with-title-bar" style={{width: width, height: 450}}>
        <div className="title">
          {title}
        </div>
        <div className="statistic-box-rank-table">
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </div>
    );
  }
}

export default RankTable
