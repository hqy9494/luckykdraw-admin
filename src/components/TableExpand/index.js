import React from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import classNames from 'classnames';
import { Table, Button } from 'antd';
import moment from '../Moment';
import SearchExpand from '../SearchExpand';
const ButtonGroup = Button.Group;

import { getParameterByName } from '../../utils/utils';

export default class TableExpand extends React.Component {
  constructor(props) {
    super(props);

    this.getAll = !props.api.total || props.getAll ? true : false;
    this.tab = getParameterByName('tab');
    let params = getParameterByName('q')
      ? JSON.parse(decodeURI(getParameterByName('q')))
      : {};

    if (this.tab) {
      if (
        this.tab.toString() === this.props.tab.toString() ||
        this.props.defaultTab
      ) {
        this.params = params;
      } else {
        this.params = {};
      }
    } else {
      this.params = params;
    }

    this.state = {
      pageSize: 10,
      data: [],
      total: 0,
      searchs: this.params.s ? this.complicatedSearchs(this.params.s) : []
    };

    this.columns = this.dealColumns(props.columns);
  }

  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.refresh && nextProps.refresh === true) {
      this.getData(() => {
        this.props.onRefreshEnd && this.props.onRefreshEnd();
      });
    }
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  //包装setState
  updateState(newState, cb) {
    if (this._isUnmounted) {
      return;
    }
    this.setState(newState, cb);
  }

  getData = cb => {
    const { api, uuid } = this.props;
    const { skip, pageSize } = this.state;
    if (api.data) {
      if (this.getAll) {
        api.rts(
          {
            method: 'get',
            url: api.data,
            params: {
              filter: Object.assign(
                {},
                {
                  where: Object.assign(
                    {},
                    this.searchsToWhere(this.params.s),
                    api.where
                  ),
                  order: this.params.order || api.order || 'createdAt DESC'
                },

                api.include && { include: api.include },
                api.filter
              )
            }
          },
          api.uuid,
          'data',
          data => {
            this.updateState({ data, total: data.length });
            cb && cb();
          }
        );
      } else {
        api.rts(
          {
            method: 'get',
            url: api.data,
            params: {
              filter: Object.assign(
                {},
                {
                  where: Object.assign(
                    {},
                    this.searchsToWhere(this.params.s),
                    api.where
                  ),
                  limit: pageSize,
                  skip: this.params.skip || 0,
                  order: this.params.order || api.order || 'createdAt DESC'
                },
                api.include && { include: api.include },
                api.filter
              )
            }
          },
          api.uuid,
          'data',
          data => {
            this.updateState({ data });
            cb && cb();
          }
        );
      }
    }
    if (api.total) {
      api.rts(
        {
          method: 'get',
          url: api.total,
          params: {
            where: Object.assign(
              {},
              this.searchsToWhere(this.params.s),
              api.where||api.filter||{}
            )
          }
        },
        api.uuid,
        'total',
        total => {
          this.updateState({ total: total.count || total || 0 });
        }
      );
    }
  };

  searchsToWhere = (searchs = []) => {
    const { search } = this.props;
    let where = {};

    searchs.map(s => {
      let curSearch = search.find(ss => s.f === ss.field);
      if (curSearch.type === 'field') {
        if (curSearch.like) {
          where[s.f] = { like: `%${s.v}%` };
        } else {
           where[s.f] = s.v;
        }
      } else if (curSearch.type === 'relevance') {
        where[s.f] = s.v.value;
      } else if (curSearch.type === 'option') {
        where[s.f] = s.v;
      } else if (curSearch.type === 'number') {
        if (s.v && s.v.constructor === Array) {
          if (s.v[0] && s.v[1]) {
            where[s.f] = { between: [s.v[0], s.v[1]] };
          } else if (s.v[0]) {
            where[s.f] = { gt: s.v[0] };
          } else if (s.v[1]) {
            where[s.f] = { lt: s.v[1] };
          }
        }
      } else if (curSearch.type === 'date') {
        if (s.v && s.v.constructor === Object) {
          if (s.v.s && s.v.e) {
            where[s.f] = {
              between: [s.v.s, s.v.e]
            };
          } else if (s.v.s) {
            where[s.f] = { gt: s.v.s };
          } else if (s.values.endDate) {
            where[s.f] = { lt: s.v.e };
          }
        }
      }
    });
    return where;
  };

  onChange = (page, pageSize) => {
    this.jumpUrl({ skip: (page - 1) * pageSize });
  };

  dealColumns = columns => {
    const { order = '' } = this.params,
      orderArr = order.split(' ');
    return columns.map(c => {
      if (c.type) {
        c.render = (text, record) => (
          <span>{this.formatValue(c.type, text)}</span>
        );
      }
      if (c.sort) {
        c.title = (
          <div
            className={classNames('tableExpand-sort-th', {
              'tableExpand-sort-th-no': orderArr[0] !== c.dataIndex,
              'tableExpand-sort-th-asc':
                orderArr.length === 2 &&
                orderArr[0] === c.dataIndex &&
                orderArr[1] === 'ASC',
              'tableExpand-sort-th-desc':
                orderArr.length === 2 &&
                orderArr[0] === c.dataIndex &&
                orderArr[1] === 'DESC'
            })}
            onClick={() => {
              let newOrder = '';
              if (orderArr.length === 2 && orderArr[0] === c.dataIndex) {
                if (orderArr[1] === 'ASC') {
                  newOrder = `${c.dataIndex} DESC`;
                }
              } else {
                newOrder = `${c.dataIndex} ASC`;
              }
              this.jumpUrl({ order: newOrder });
            }}
          >
            {c.title}
          </div>
        );
      }
      return c;
    });
  };

  jumpUrl = (newParams = {}, obj = {}) => {
    const params = Object.assign({}, this.params, newParams, obj);
    this.props.replace(
      this.props.path,
      `?${this.tab ? `tab=${this.tab}&` : ''}q=${JSON.stringify(params)}`
    );
  };

  simplifySearchs = searchs => {
    return searchs.map(s => {
      if (s.type === 'field' || s.type === 'number' || s.type === 'relevance') {
        return {
          f: s.field,
          v: s.values
        };
      } else if (s.type === 'option') {
        return {
          f: s.field,
          v: s.values.value
        };
      } else if (s.type === 'date') {
        return {
          f: s.field,
          v: {
            s: moment(s.values.startDate).format('YYYY-MM-DD'),
            e: moment(s.values.endDate).format('YYYY-MM-DD')
          }
        };
      }
    });
  };

  complicatedSearchs = (searchs = []) => {
    const { search } = this.props;
    return searchs.map(s => {
      let curSearch = search.find(ss => s.f === ss.field);

      if (
        curSearch.type === 'field' ||
        curSearch.type === 'number' ||
        curSearch.type === 'relevance'
      ) {
        return {
          type: curSearch.type,
          field: curSearch.field,
          title: curSearch.title,
          values: s.v
        };
      } else if (curSearch.type === 'option') {
        return {
          type: curSearch.type,
          field: curSearch.field,
          title: curSearch.title,
          values: curSearch.options.find(o => s.v === o.value)
        };
      } else if (curSearch.type === 'date') {
        return {
          type: curSearch.type,
          field: curSearch.field,
          title: curSearch.title,
          values: {
            startDate: moment(s.v.s).toDate(),
            endDate: moment(s.v.e).toDate()
          }
        };
      }
    });
  };

  formatValue = (type, value) => {
    switch (type) {
      case 'date':
        return moment(value).format('YYYY-MM-DD HH:mm');
      case 'day':
        return moment(value).format('YYYY-MM-DD');
      case 'fromNow':
        return moment(value).fromNow();
      case 'penny':
        return Math.floor(value / 100);
      default:
        return value;
    }
  };

  render() {
    const { api, search, buttons } = this.props;
    const { data, total, pageSize } = this.state;
    let skip = this.params.skip || 0;
    let { columns } = this.props;
    columns = this.dealColumns(columns);
    let pagination = {
      pageSize,
      total
    };

    if (api.total) {
      pagination.current = Math.ceil(skip / pageSize + 1);
      pagination.onChange = this.onChange;
    }

    return (
      <Panel>
        <Row>
          <Col xs={12} md={6} />
          <Col xs={12} md={6}>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                {search &&
                  search.length > 0 && (
                    <SearchExpand
                      defaultSearchs={this.state.searchs || []}
                      search={search}
                      onSearchChange={searchs => {
                        // console.log(searchs);
                        console.log(this.simplifySearchs(searchs));
                        this.jumpUrl(
                          { s: this.simplifySearchs(searchs) },
                          { skip: 0 }
                        );
                      }}
                    />
                  )}
              </div>

              {buttons && buttons.length > 0 ? (
                <div
                  style={{ flex: `0 ${buttons.length * 63}px`, marginLeft: 8 }}
                >
                  <ButtonGroup className="pull-right">
                    {buttons.map((b, i) => {
                      return (
                        <Button
                          key={`button-${i}`}
                          onClick={() => {
                            b.onClick && b.onClick();
                          }}
                        >
                          {b.title}
                        </Button>
                      );
                    })}
                  </ButtonGroup>
                </div>
              ) : (
                ''
              )}
            </div>
          </Col>
        </Row>
        <Table
          rowKey="id"
          scroll={{ x: 1000 }}
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          locale={{
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据'
          }}
        />
      </Panel>
    );
  }
}

// search: [
//   {
//     type: "field",
//     field: "a1",
//     title:"订单编号"
//   },
//   {
//     type: "relevance"
//   },
//   {
//     type: "number"
//   },
//   {
//     type: "option"
//   },
//   {
//     type: "date"
//   }
// ]
