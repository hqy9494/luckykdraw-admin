import React from "react";
import { Col, Row, Icon, Popover } from "antd";

export class BuyAgainInfoBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {content} =  this.props;
    content = content || {};
    let all = content[1] + content[2] + content["3-5"] + content["5+"];
    let p1 = parseInt(content[1]/all*100) || 0;
    let p2 = parseInt(content[2]/all*100) || 0;
    let p35 = parseInt(content["3-5"]/all*100) || 0;
    let p5plus = parseInt(content["5+"]/all*100) || 0;
    let man = content.man || {};
    let woman = content.woman || {};

    const contenttext = (
      <div>
        <p>由于微信性别可以不选择或者在用户不关注公众号的情况无法获取用户性别，</p>
        <p>所以存在男性用户加女性用户的数量少于总数量的情况。</p>
        <p>如果之后用户进行关注，系统会实时更新统计数据。</p>
      </div>
    );

    return (
      <div className="statistic-box-with-title-bar">
        <div className="title">
          复购率
          <Popover content={contenttext} trigger="hover">
            <Icon type="question-circle-o" />
          </Popover>
        </div>
        <div style={{height: 230, marginTop: 30}}>
          <Row type="flex" align="middle">
            <Col span={8} style={{textAlign: "center"}}>
              1次购买
            </Col>
            <Col span={6} style={{borderBottom: "1px solid #4ac1e6"}}>

            </Col>
            <Col span={10} style={{textAlign: "center"}}>
              <Col span={24}>
                总人数{content[1]}人({p1}%)
              </Col>
              <Col span={24}>
                <Icon type="man" style={{marginRight: 5, color: "#3599d5"}} />{man[1]}　　<Icon type="woman" style={{marginRight: 5, color: "#cb2076"}} />{woman[1]}
              </Col>
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{marginTop: 15}}>
            <Col span={8} style={{textAlign: "center"}}>
              2次购买
            </Col>
            <Col span={6} style={{borderBottom: "1px solid #4ac1e6"}}>

            </Col>
            <Col span={10} style={{textAlign: "center"}}>
              <Col span={24}>
                总人数{content[2]}人({p2}%)
              </Col>
              <Col span={24}>
                <Icon type="man" style={{marginRight: 5, color: "#3599d5"}} />{man[2]}　　<Icon type="woman" style={{marginRight: 5, color: "#cb2076"}} />{woman[2]}
              </Col>
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{marginTop: 15}}>
            <Col span={8} style={{textAlign: "center"}}>
              3-5次购买
            </Col>
            <Col span={6} style={{borderBottom: "1px solid #4ac1e6"}}>

            </Col>
            <Col span={10} style={{textAlign: "center"}}>
              <Col span={24}>
                总人数{content["3-5"]}人({p35}%)
              </Col>
              <Col span={24}>
                <Icon type="man" style={{marginRight: 5, color: "#3599d5"}} />{man["3-5"]}　　<Icon type="woman" style={{marginRight: 5, color: "#cb2076"}} />{woman["3-5"]}
              </Col>
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{marginTop: 15}}>
            <Col span={8} style={{textAlign: "center"}}>
              5次购买以上
            </Col>
            <Col span={6} style={{borderBottom: "1px solid #4ac1e6"}}>

            </Col>
            <Col span={10} style={{textAlign: "center"}}>
              <Col span={24}>
                总人数{content["5+"]}人({p5plus}%)
              </Col>
              <Col span={24}>
                <Icon type="man" style={{marginRight: 5, color: "#3599d5"}} />{man["5+"]}　　<Icon type="woman" style={{marginRight: 5, color: "#cb2076"}} />{woman["5+"]}
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default BuyAgainInfoBox
