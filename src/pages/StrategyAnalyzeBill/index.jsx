import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, message } from 'antd';
import { ExtTable, ExtIcon, Space, DataImport } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import { exportXlsx, constants } from '@/utils';
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyAnalyzeBill, loading }) => ({ strategyAnalyzeBill, loading }))
class StrategyBills extends Component {
  state = {
    delId: null,
    moduleFilter: null,
    userNameFilter: null,
    stateFilter: null,
    moduleList:[],
  };

  constructor(prop) {
    super(prop);
    this.initModuleList();
  }

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  validateItem = data => {
    return data.map(item => {
      if (!item.year) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '年份不能为空',
        }
      }
      if (!item.strategyName) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '经营策略项目不能为空',
        }
      }
      return {
        ...item,
        validate: true,
        status: '验证通过',
        statusCode: 'success',
        message: '验证通过',
      };
    });
  };

  uploadStrategyAnalyzeBill = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'strategyAnalyzeBill/uploadStrategyAnalyzeBill',
      payload: data,
    }).then(res => {
      if (res.success) {
        message.success('导入成功！');
        this.refresh();
      }
    });
  };

  downloadTemplate = (type) => {
    this.dispatchAction({
      type: 'strategyAnalyzeBill/downloadTemplate',
      payload: {
        type: type
      }
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
                  () => this.refresh(),
                );
              }
            });
          },
        );
        break;
        case 'export':
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
        this.refresh();
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

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
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
      // {
      //   title: '操作',
      //   key: 'operation',
      //   width: 100,
      //   align: 'center',
      //   dataIndex: 'id',
      //   className: 'action',
      //   required: true,
      //   render: (_, record) => (
      //     <Space>
      //       <ExtIcon
      //         key="edit"
      //         className="edit"
      //         onClick={() => this.handleEvent('edit', record)}
      //         type="edit"
      //         status="success"
      //         tooltip={{ title: '编辑' }}
      //         antd
      //       />
      //       <Popconfirm
      //         key="del"
      //         placement="topLeft"
      //         title="确定要删除吗？"
      //         onConfirm={() => this.handleEvent('del', record)}
      //       >
      //         {this.renderDelBtn(record)}
      //       </Popconfirm>
      //     </Space>
      //   ),
      // },
      {
        title: '年份',
        dataIndex: 'year',
        width: 120,
        required: true,
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
        dataIndex: 'officerCodes',
        width: 120,
        required: true,
      },
      {
        title: '项目负责人',
        dataIndex: 'officerNames',
        width: 120,
        required: true,
      },
      {
        title: '职位',
        dataIndex: 'officerPositions',
        width: 120,
        required: true,
      },
      {
        title: '工号',
        dataIndex: 'contactUserCode',
        width: 120,
        required: true,
        render: (_, record) => {
          return (record.contacts==null || record.contacts[0] == null) ? '' : record.contacts[0].userCode;
        }
      },
      {
        title: '模块对接人',
        dataIndex: 'contactUserName',
        width: 120,
        required: true,
        render: (_, record) => {
          return (record.contacts==null || record.contacts[0] == null) ? '' : record.contacts[0].userName;
        }
      },
      {
        title: '工号',
        dataIndex: 'managemetCodes',
        width: 120,
        required: true,
      },
      {
        title: '经营策略管理组成员',
        dataIndex: 'managemetNames',
        width: 180,
        required: true,
      },
      {
        title: '新建日期',
        dataIndex: 'createdDate',
        width: 180,
        required: true,
      },
      {
        title: '单号',
        dataIndex: 'code',
        width: 150,
        required: true,
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 120,
        required: true,
        render: text => {
          if (text === '0') {
            return '关闭';
          }
          if (text === '1') {
            return '开立';
          }
          return '';
        }
      },
      {
        title: '更新日期',
        dataIndex: 'lastEditedDate',
        width: 180,
        required: true,
      },
    ];
    const toolBarProps = {
      layout: {leftSpan: 22, rightSpan: 2},
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
          <Button type='primary' onClick={this.refresh}>查找</Button>
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
          <Button
            key="export"
            type="primary"
            onClick={() => {
              this.handleEvent('export', null);
            }}
            ignore="true"
          >
            导出
          </Button>
          <Button onClick={() => this.downloadTemplate('可用的入参')}>模板</Button>
          <DataImport
            tableProps={{ columns, showSearch: false }}
            validateFunc={this.validateItem}
            validatedAll={true}
            importFunc={this.uploadStrategyAnalyzeBill}
          />
        </Space>
      ),
    };
    const filters = this.getTableFilters();
    return {
      columns,
      bordered: true,
      toolBar: toolBarProps,
      remotePaging: true,
      showSearch: false,
      cascadeParams: {
        filters,
      },
      store:{
        type: 'POST',
        url:`${PROJECT_PATH}/strategyAnalyzeBill/findByPage`,
      },
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

export default StrategyBills;
