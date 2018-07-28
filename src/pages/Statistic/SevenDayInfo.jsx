import React from "react";
import { Col, Row, Table } from "antd";
import moment from "moment"

export class SevenDayInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {content} =  this.props;
    content = content || [];

    const columns = [{
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      align: "center"
    }, {
      title: '销售盒数',
      dataIndex: 'pondCount',
      key: 'pondCount',
      align: "center"
    }, {
      title: '派出金额',
      dataIndex: 'sendDay',
      key: 'sendDay',
      align: "center"
    }, {
      title: '销售金额',
      dataIndex: 'pondSum',
      key: 'pondSum',
      align: "center"
    }, {
      title: '已扫码关注',
      dataIndex: 'followedScanCount',
      key: 'followedScanCount',
      align: "center"
    }, {
      title: '未扫码关注（扫码关注／未关注）',
      key: 'unfollowedScanCount',
      render: (text, record) => {
        return `${record.unfollowedScanCount}(${record.unFollowedScanCount}/${record.buyAndUnFollowedScanCount})`
      },
      align: "center"
    }];

    let data = [];

    for (let i = 0; i < 7; i++) {
      let dayinfo = content[`seven${i}`];
      if (dayinfo) {
        data[i] = {
          time: moment().subtract(i, "day").format("YYYY-MM-DD"),
          pondCount: dayinfo.pondCount,
          sendDay: dayinfo.sendDay,
          pondSum: dayinfo.pondSum,
          followedScanCount: dayinfo.followedScanCount,
          unfollowedScanCount: dayinfo.unfollowedScanCount,
          unFollowedScanCount: dayinfo.unFollowedScanCount,
          buyAndUnFollowedScanCount: dayinfo.buyAndUnFollowedScanCount
        }
      }
    }

    return (
      <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    );
  }
}

export default SevenDayInfo
