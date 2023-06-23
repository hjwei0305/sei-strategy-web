import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, message } from 'antd';
import { ExtTable, Space } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import { exportXlsx, constants } from '@/utils';
import { getCurrentUser } from '@/utils/user';
import ProChange from '../StrategyHeader/ProChange/index';
import ProConfirmation from '../StrategyHeader/ProConfirmation/index';
import ProSubmission from './ProSubmission/EditModal';

const { PROJECT_PATH, SERVER_PATH } = constants;

@withRouter
@connect(({ strategyHeader, loading }) => ({ strategyHeader, loading }))
class StrategyHeader extends Component {
  state = {
    delId: null,
    datalist: [],
    moduleFilter: null,
    userNameFilter: null,
    stateFilter: null,
    stateList: [],
    user: null,
    projectStyle: [],
  };

  constructor(prop) {
    super(prop);
    this.findByPage();
    this.initStateList();
    this.findByCode();
    this.initProjectStyle();
  };

  findByCode = () => {
    const { dispatch } = this.props;
    const code = getCurrentUser().account;
    dispatch({
      type: 'strategyHeader/findByCode',
      payload: { code },
    }).then(res => {
      this.setState({
        user: res.data,
      });
    });
  };

  initStateList = () => {
    request.get(`${SERVER_PATH}/dms/dataDict/getCanUseDataDictValues?dictCode=StrategyState`, {}).then(res => {
      const { data } = res;
      this.setState({
        stateList: data,
      });
    });
  };

  initProjectStyle = () => {
    request.post(`${PROJECT_PATH}/strategyProjectStyle/export`, {}).then(res => {
      const { data } = res;
      this.setState({
        projectStyle: data,
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
    request.post(`${PROJECT_PATH}/strategyHeader/export`, { filters }).then(res => {
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
      } else {
        message.error(res.message);
      }
    });
  }

  handleEvent = (type, row) => {
    switch (type) {
      case 'relevancy':
        this.dispatchAction({
          type: 'strategyHeader/updateState',
          payload: {
            modalVisible: true,
            editData: row,
          },
        });
        break;
      case 'submit':
        this.dispatchAction({
          type: 'strategyHeader/updateState',
          payload: {
            proSubmissionVisible: true,
            editData: row,
          },
        });
        break;
      // 项目确认
      case 'affirm':
        this.dispatchAction({
          type: 'strategyHeader/updateState',
          payload: {
            proConfirmationVisible: true,
            editData: row,
          },
        });
        break;
      // 项目变更表
      case 'change':
        this.dispatchAction({
          type: 'strategyHeader/updateState',
          payload: {
            proChangeVisible: true,
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
      type: 'strategyHeader/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyHeader/updateState',
          payload: {
            modalVisible: false,
          },
        });
        this.findByPage();
      }
    });
  };

  addProject = data => {
    data.strategyAnalyzeBillDto.projectDtoList.push({
      name: '',
      index: data.strategyAnalyzeBillDto.projectDtoList.length.length + 1,
    });
    this.forceUpdate();
  };

  handleClose = () => {
    this.dispatchAction({
      type: 'strategyHeader/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

// 提交项目
handleProSubmissionClose = () => {
  this.dispatchAction({
    type: 'strategyHeader/updateState',
    payload: {
      proSubmissionVisible: false,
      editData: null,
    },
  });
};

  // 项目确认表
  handleProConfirmationClose = () => {
    this.dispatchAction({
      type: 'strategyHeader/updateState',
      payload: {
        proConfirmationVisible: false,
        editData: null,
      },
    });
  };
  // 项目变更表
  handleProChangeClose = () => {
    this.dispatchAction({
      type: 'strategyHeader/updateState',
      payload: {
        proChangeVisible: false,
        editData: null,
      },
    });
  };

  getTableFilters = () => {
    const filters = [];
    if (this.state.moduleFilter) {
      filters.push({
        fieldName: 'module',
        operator: 'LK',
        fieldType: 'String',
        value: this.state.moduleFilter,
      });
    }
    if (this.state.userNameFilter) {
      filters.push({
        fieldName: 'userName',
        operator: 'LK',
        fieldType: 'String',
        value: this.state.userNameFilter,
      });
    }
    if (this.state.stateFilter) {
      filters.push({
        fieldName: 'state',
        operator: 'LK',
        fieldType: 'String',
        value: this.state.stateFilter,
      });
    }
    return filters;
  };

  findByPage = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters();
    dispatch({
      type: 'strategyHeader/findByPage',
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
        title: '经营策略项目',
        dataIndex: 'strategyAnalyzeBillDto.strategyName',
        width: 360,
        required: true,
      },
      {
        title: '所属模块',
        dataIndex: 'strategyAnalyzeBillDto.module',
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
        dataIndex: 'strategyProjectDto.name',
        width: 120,
        required: true,
      },
      {
        title: '提交人',
        dataIndex: 'strategyAnalyzeBillDto.creatorName',
        width: 120,
        required: true,
      },
      {
        title: '当前阶段',
        dataIndex: 'strategyAnalyzeBillDto.stage',
        width: 120,
        required: true,
        render: (_, record) => {
          for (let i of this.state.stateList) {
            if (i.dataValue === record.strategyAnalyzeBillDto.stage) {
              return i.dataName
            }
          }
        }
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
          if (record.strategyAnalyzeBillDto.stage === 'relevancy') {
            return (
              <Space>
                <div style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => this.handleEvent('relevancy', record)}>关联项目
                </div>
                <div style={{ color: '#666' }}>提交项目
                </div>
                <div style={{ color: '#666' }}>项目确认
                </div>
                <div style={{ color: '#666' }}>变更申请
                </div>
              </Space>
            )
          }
          if (record.strategyAnalyzeBillDto.stage === 'submit') {
            return (
              <Space>
                <div style={{ color: '#666' }}>关联项目
                </div>
                <div style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => this.handleEvent('submit', record)}>提交项目
                </div>
                <div style={{ color: '#666' }}>项目确认
                </div>
                <div style={{ color: '#666' }}>变更申请
                </div>
              </Space>
            )
          }
          if (record.strategyAnalyzeBillDto.stage === 'affirm') {
            return (
              <Space>
                <div style={{ color: '#666' }}>关联项目
                </div>
                <div style={{ color: '#666' }}>提交项目
                </div>
                <div style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => this.handleEvent('affirm', record)}>项目确认
                </div>
                <div style={{ color: '#666' }}>变更申请
                </div>
              </Space>
            )
          }
          if (record.strategyAnalyzeBillDto.stage === 'change') {
            return (
              <Space>
                <div style={{ color: '#666' }}>关联项目
                </div>
                <div style={{ color: '#666' }}>提交项目
                </div>
                <div style={{ color: '#666' }}>项目确认
                </div>
                <div style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => this.handleEvent('change', record)}>变更申请
                </div>
              </Space>
            )
          }
        }
      },
      {
        title: '单号',
        dataIndex: 'strategyAnalyzeBillDto.code',
        width: 150,
        required: true,
      },
      {
        title: '变更次数',
        dataIndex: 'strategyAnalyzeBillDto.changeCount',
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
    const { loading, strategyHeader } = this.props;
    const { modalVisible, editData } = strategyHeader;

    return {
      onSave: this.handleSave,
      editData,
      addProject: this.addProject,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyHeader/save'],
      user: this.state.user,
    };
  };

  // 提交项目
  getProSubmissionProps = () => {
    const { loading, strategyHeader } = this.props;
    const { proSubmissionVisible, editData, projectStyle } = strategyHeader;

    return {
      onSave: this.handleSave,
      editData,
      visible: proSubmissionVisible,
      onClose: this.handleProSubmissionClose,
      saving: loading.effects['strategyHeader/save'],
      user: this.state.user,
      projectStyle: this.state.projectStyle,
    };
  };
  // 项目确认表
  getProConfirmationProps = () => {
    const { loading, strategyHeader } = this.props;
    const { proConfirmationVisible, editData } = strategyHeader;

    return {
      onSave: this.handleSave,
      editData,
      visible: proConfirmationVisible,
      onClose: this.handleProConfirmationClose,
      saving: loading.effects['strategyHeader/save'],
      user: this.state.user,
    };
  };
  // 项目变更表
  getProChangeProps = () => {
    const { loading, strategyHeader } = this.props;
    const { proChangeVisible, editData } = strategyHeader;

    return {
      onSave: this.handleSave,
      editData,
      visible: proChangeVisible,
      onClose: this.handleProChangeClose,
      saving: loading.effects['strategyHeader/save'],
      user: this.state.user,
    };
  };

  render() {
    const { strategyHeader } = this.props;
    const { modalVisible, proChangeVisible, proConfirmationVisible,proSubmissionVisible } = strategyHeader;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
        {proChangeVisible ? <ProChange {...this.getProChangeProps()} /> : null}
        {proConfirmationVisible ? <ProConfirmation {...this.getProConfirmationProps()} /> : null}
        {proSubmissionVisible ? <ProSubmission {...this.getProSubmissionProps()} /> : null}
      </>
    );
  }
}

export default StrategyHeader;
