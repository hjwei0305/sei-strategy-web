import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm, Input,message } from 'antd';
import { ExtTable, ExtIcon, Space, DataImport } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import { exportXlsx,constants } from '@/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyBillModule, loading }) => ({ strategyBillModule, loading }))
class StrategyBillModule extends Component {
  state = {
    delId: null,
    dataList: [],
    moduleFilter: null,
    codeFilter: null,
  };

  constructor(prop) {
    super(prop);
    this.findByPage();
  }

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
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
    if (this.state.codeFilter) {
      filters.push({
        fieldName: 'code',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.codeFilter,
      });
    }
    return filters;
  };

  findByPage = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters();
    dispatch({
      type: 'strategyBillModule/findByPage',
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

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'strategyBillModule/updateState',
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
              type: 'strategyBillModule/del',
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
      type: 'strategyBillModule/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyBillModule/updateState',
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
      type: 'strategyBillModule/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['strategyBillModule/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  handlerExport = () => {
    const filters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/strategyBillModule/export`, {filters}).then(res => {
      if (res.success && res.data.length > 0) {
        exportXlsx(
          '策略模块',
          [
            'id',
            '代码',
            '模块',
            '创建人',
            '创建时间',
          ],
          res.data);
      }else{
        message.error(res.message);
      }
    });
  };

  downloadTemplate = (type) => {
    this.dispatchAction({
      type: 'strategyBillModule/downloadTemplate',
      payload: {
        type: type,
      },
    });
  }

  uploadStrategyBillModule = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'strategyBillModule/uploadStrategyBillModule',
      payload:  data,
    }).then(res => {
      if (res.success) {
        this.findByPage();
      }
    }
    );
  }

  validateItem = (data) => {
    return data.map(item => {
      if (!item.module) {
        debugger;
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '模块不能为空',
        }
      }else if (!item.code) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '代码不能为空',
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
  }

  getExtableProps = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: '操作',
        key: 'operation',
        width: 300,
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
        title: '代码',
        dataIndex: 'code',
        width: 220,
        required: true,
      },
      {
        title: '模块',
        dataIndex: 'module',
        width: 220,
        required: true,
      },
      {
        title: '提交人',
        dataIndex: 'creatorName',
        width: 220,
        required: true,
      },
      {
        title: '提交时间',
        dataIndex: 'createdDate',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          所属模块：{''}
          <Input
            style={{ width: 200 }}
            placeholder="请输入"
            onChange={e => {
              this.setState({
                moduleFilter: e.target.value,
              });
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              this.findByPage();
            }}
          >
            查询
          </Button>
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
          <Button onClick={this.handlerExport}>导出</Button>
          <Button onClick={() => this.downloadTemplate('可用的入参')}>模板</Button>
          <DataImport
            tableProps={{ columns, showSearch: false }}
            validateFunc={this.validateItem}
            validatedAll={true}
            importFunc={this.uploadStrategyBillModule}          
          />
        </Space>
      ),
    };

    const filter = this.getTableFilters();
    return {
      columns,
      bordered: true,
      toolBar: toolBarProps,
      remotePaging: false,
      showSearch: false,
      dataSource: this.state.dataList,
      cascadeParams: {
        filter,
      }
    };
  };

  getEditModalProps = () => {
    const { loading, strategyBillModule } = this.props;
    const { modalVisible, editData } = strategyBillModule;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyBillModule/save'],
    };
  };

  render() {
    const { strategyBillModule } = this.props;
    const { modalVisible } = strategyBillModule;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyBillModule;
