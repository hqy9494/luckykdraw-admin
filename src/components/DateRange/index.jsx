import React from "react";
import classNames from "classnames";
import moment from "../../components/Moment";
import { DateRangePicker } from "react-date-range";
import * as rdrLocales from "react-date-range/src/locale";
import * as defaultRanges from "react-date-range/src/defaultRanges";
console.log(defaultRanges);
class DateRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateRangePicker: {
        selection: {
          startDate: moment().toDate(),
          endDate: moment()
            .subtract(7, "day")
            .toDate(),
          key: "selection"
        }
      }
    };
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  componentDidMount() {}

  render() {
    return (
      <div style={{ position: "relative" }}>
        <span className="ant-calendar-picker" tabIndex="0">
          <span className="ant-calendar-picker-input ant-input">
            <input
              readOnly
              placeholder="开始日期"
              className="ant-calendar-range-picker-input"
              tabIndex="-1"
            />
            <span className="ant-calendar-range-picker-separator"> ~ </span>
            <input
              readOnly
              placeholder="结束日期"
              className="ant-calendar-range-picker-input"
              tabIndex="-1"
            />
            <span className="ant-calendar-picker-icon" />
          </span>
        </span>
        <div className="dateRange-container">
          <DateRangePicker
            locale={rdrLocales["zhCN"]}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            className={"dateRange-PreviewArea"}
            months={2}
            direction="horizontal"
            ranges={[this.state.dateRangePicker.selection]}
            staticRanges={createStaticRanges([
              {
                label: "今天",
                range: () => ({
                  startDate: moment().toDate(),
                  endDate: moment()
                    .startOf("day")
                    .toDate()
                })
              }
            ])}
          />
        </div>
      </div>
    );
  }
}

export default DateRange;
