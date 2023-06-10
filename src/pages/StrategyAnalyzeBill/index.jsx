import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, message } from 'antd';
import { ExtTable, ExtIcon, Space } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import { exportXlsx, constants } from '@/utils';
const { PROJECT_PATH,SERVER_PATH } = constants;

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
    stateList: [],
  };

  constructor(prop) {
    super(prop);
    this.findByPage();
    this.initModuleList();
    this.initStateList();
  }

  initStateList = () => {
    request.get(`${SERVER_PATH}/dms/dataDict/getCanUseDataDictValues?dictCode=StrategyState`, {}).then(res => {
      const { data } = res;
      this.setState({
        stateList: data,
      });
    });
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  handlerExport = () => {
    const filters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/strategyAnalyzeBill/export`, {filters}).then(res => {
      if (res.success && res.data.length > 0) {
        exportXlsx(
          '经营策略',
          [
            'id',
            '年份',
            '经营策略项目',
            '模块Code',
            '所属模块',
            '员工',
            '项目负责人',
            '职位',
            '工号',
            '模块对接人',
            '工号',
            '经营策略管理组成员',
            '新建日期',
            '单号',
            '状态',
            '更新日期',
          ],
          res.data);
      }else{
        message.error(res.message);
      }
    });
  }

  handleEvent = (type, row) => {
    switch (type) {
      case 'relevancy':
        this.dispatchAction({
          type: 'strategyAnalyzeBill/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
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
        title: '工号',
        dataIndex: 'userCode',
        width: 120,
        required: true,
      },
      {
        title: '项目负责人',
        dataIndex: 'userName',
        width: 120,
        required: true,
      },
      {
        title: '职位',
        dataIndex: 'userPosition',
        width: 120,
        required: true,
      },
      {
        title: '关联项目名称',
        dataIndex: 'project',
        width: 120,
        required: true,
      },
      {
        title: '提交人',
        dataIndex: 'creatorName',
        width: 120,
        required: true,
      },
      {
        title: '当前阶段',
        dataIndex: 'stage',
        width: 120,
        required: true,
        render:(_, record) => {
          for(let i of this.state.stateList){
            if(i.dataValue === record.stage){     
              return i.dataName
            }
          }}
      },
      {
        title: '操作',
        key: 'operation',
        width: 300,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => {
          if(record.stage === 'relevancy'){
            return (
              <Space>
                <div style={{color:'#1890ff',cursor:'pointer'}} 
                     onClick={() => this.handleEvent('relevancy',record)}>关联项目
                </div>
                <div style={{color:'#666'}}>提交项目
                </div>
                <div style={{color:'#666'}}>项目确认
                </div>
                <div style={{color:'#666'}}>变更申请
                </div>
              </Space>
            )
          }
          if(record.stage === 'subimit'){
            return (
              <Space>
                <div style={{color:'#666'}}>关联项目
                </div>
                <div style={{color:'#1890ff',cursor:'pointer'}}
                      onClick={() => this.handleEvent('subimit',record)}>提交项目
                </div>
                <div style={{color:'#666'}}>项目确认
                </div>
                <div style={{color:'#666'}}>变更申请
                </div>
              </Space>
            )
          }
          if(record.stage === 'affirm'){
            return (
              <Space>
                <div style={{color:'#666'}}>关联项目
                </div>
                <div style={{color:'#666'}}>提交项目
                </div>
                <div style={{color:'#1890ff',cursor:'pointer'}}
                      onClick={() => this.handleEvent('affirm',record)}>项目确认
                </div>
                <div style={{color:'#666'}}>变更申请
                </div>
              </Space>
            )
          }
          if(record.stage === 'change'){
            return (
              <Space>
                <div style={{color:'#666'}}>关联项目
                </div>
                <div style={{color:'#666'}}>提交项目
                </div>
                <div style={{color:'#666'}}>项目确认
                </div>
                <div style={{color:'#1890ff',cursor:'pointer'}}
                      onClick={() => this.handleEvent('change',record)}>变更申请
                </div>
              </Space>
            )
          }
        }
        },
      {
        title: '单号',
        dataIndex: 'code',
        width: 150,
        required: true,
      },
      {
        title: '变更次数',
        dataIndex: 'changeCount',
        width: 80,
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
            allowClear
          />
          责任人姓名：{' '}
          <Input
            style={{ width: 120 }}
            onChange={e => {
              this.setState({
                userNameFilter: e.target.value,
              });
            }}
            allowClear
          />
          当前阶段：{' '}
          <Input
            style={{ width: 120 }}
            onChange={e => {
              this.setState({
                stateFilter: e.target.value,
              });
            }}
            allowClear
          />
          <Button type='primary' onClick={this.findByPage}>查找</Button>
          <Button
            key="export"
            type="primary"
            onClick={() => {
              this.handlerExport();
            }}
            ignore="true"
          >
            导出
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
