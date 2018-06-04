import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel } from "react-bootstrap";
import FormExpand from "../../components/FormExpand";

export class QrTemplateDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    if (this.props.match.params.id && this.props.match.params.id !== "add") {
      this.getOne(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {}

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
                    type: "number",
                    field: r.award.id,
                    label: r.award.name,
                    params: {
                      initialValue: r.amount,
                      rules: [{ required: true, message: "必填项" }]
                    }
                  };
                }
              })
              .filter(r => !!r)
          });
        }
      );
  };

  submitNew = values => {
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
          this.props.to("/qrCodes/template");
        }
      );
    }
  };

  render() {
    return (
      <Panel
        header={
          this.props.params && this.props.params.name
            ? decodeURI(this.props.params.name)
            : "基本信息"
        }
      >
        {this.state.elements && (
          <FormExpand
            elements={this.state.elements}
            onSubmit={values => {
              this.submitNew(values);
              // console.log(values);
            }}
          />
        )}
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const pageInfo = state => state.get("rts").get("pageInfo");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  pageInfo
});

export default connect(mapStateToProps, mapDispatchToProps)(QrTemplateDetail);
