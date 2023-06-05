import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm, Input } from 'antd';
import { ExtTable, ExtIcon, Space } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import constants from '@/utils/constants';
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyAnalyzeBill, loading }) => ({ strategyAnalyzeBill, loading }))
class StrategyAnalyzeBill extends Component {
  state = {
    delId: null,
    datalist: [],
    moduleFilter: null,
    userNameFilter: null,
    stateFilter: null,
    moduleList:[],
  };

  constructor(prop) {
    super(prop);
    this.findByPage();
    this.initModuleList();
  }

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'strategyAnalyzeBill/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'del':
        this.setState(
          {
            delId: row.id,
          },
          () => {
            this.dispatchAction({
              type: 'strategyAnalyzeBill/del',
              payload: {
                id: row.id,
              },
            }).then(res => {
              if (res.success) {
                this.setState(
                  {
                    delId: null,
                  },
                  () => this.findByPage(),
                );
              }
            });
          },
        );
        break;
      default:
        break;
    }
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'strategyAnalyzeBill/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyAnalyzeBill/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.findByPage();
      }
    });
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'strategyAnalyzeBill/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['strategyAnalyzeBill/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  initModuleList = () => {
    request.post(`${PROJECT_PATH}/strategyBillModule/export`, {}).then(res => {
      const { data } = res;
      this.setState({
        moduleList: data,
      });
    });
  };

  getTableFilters = () => {
    const filters = [];
    if (this.state.moduleFilter) {
      filters.push({
        fieldName: 'module',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.moduleFilter,
      });
    }
    if (this.state.userNameFilter) {
      filters.push({
        fieldName: 'userName',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.userNameFilter,
      });
    }
    if (this.state.stateFilter) {
      filters.push({
        fieldName: 'state',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.stateFilter,
      });
    }
    return filters;
  };

  findByPage = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters();
    dispatch({
      type: 'strategyAnalyzeBill/findByPage',
      payload: {
        filters,
      },
    }).then(res => {
      if (res.success) {
        const { rows } = res.data;
        this.setState({
          dataList: rows,
        });
      }
    });
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: '经营策略项目',
        dataIndex: 'strategyName',
        width: 360,
        required: true,
      },
      {
        title: '所属模块',
        dataIndex: 'module',
        width: 120,
        required: true,
      },
      {
        title: '责任人工号',
        dataIndex: 'userCode',
        width: 120,
        required: true,
      },
      {
        title: '责任人姓名',
        dataIndex: 'userName',
        width: 120,
        required: true,
      },
      {
        title: '责任人职位',
        dataIndex: 'userPosition',
        width: 120,
        required: true,
      },
      {
        title: '关联项目',
        dataIndex: 'project',
        width: 120,
        required: true,
      },
      {
        title: '提交人',
        dataIndex: 'submitUser',
        width: 120,
        required: true,
      },
      {
        title: '当前阶段',
        dataIndex: 'currentStage',
        width: 120,
        required: true,
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <Space>
            <ExtIcon
              key="edit"
              className="edit"
              onClick={() => this.handleEvent('edit', record)}
              type="edit"
              status="success"
              tooltip={{ title: '编辑' }}
              antd
            />
            <Popconfirm
              key="del"
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.handleEvent('del', record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
          </Space>
        ),
      },
      {
        title: '单据编号',
        dataIndex: 'billNo',
        width: 120,
        required: true,
      },
      {
        title: '变更次数',
        dataIndex: 'changeCount',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          所属模块：{' '}
          <Input
            style={{ width: 120 }}
            onChange={e => {
              this.setState({
                moduleFilter: e.target.value,
              });
            }}
          />
          责任人姓名：{' '}
          <Input
            style={{ width: 120 }}
            onChange={e => {
              this.setState({
                userNameFilter: e.target.value,
              });
            }}
          />
          当前阶段：{' '}
          <Input
            style={{ width: 120 }}
            onChange={e => {
              this.setState({
                stateFilter: e.target.value,
              });
            }}
          />
          <Button type='primary' onClick={this.findByPage}>查找</Button>
          <Button
            key="add"
            type="primary"
            onClick={() => {
              this.handleEvent('add', null);
            }}
            ignore="true"
          >
            新建
          </Button>
        </Space>
      ),
    };
    const filter = this.getTableFilters();
    return {
      columns,
      bordered: true,
      toolBar: toolBarProps,
      showSearch: false,
      dataSource: this.state.dataList,
      cascadeParams: {
        filter,
      }
    };
  };

  getEditModalProps = () => {
    const { loading, strategyAnalyzeBill } = this.props;
    const { modalVisible, editData } = strategyAnalyzeBill;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyAnalyzeBill/save'],
      moduleList: this.state.moduleList,
    };
  };

  render() {
    const { strategyAnalyzeBill } = this.props;
    const { modalVisible } = strategyAnalyzeBill;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyAnalyzeBill;
