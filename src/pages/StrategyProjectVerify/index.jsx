import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, Popconfirm,message } from 'antd';
import { ExtTable, ExtIcon, Space,DataImport } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import { exportXlsx, constants } from '@/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyProjectVerify, loading }) => ({ strategyProjectVerify, loading }))
class StrategyProjectVerify extends Component {
  state = {
    delId: null,
    verifyResultFilter: null,
    verifyStyleFilter: null,
  };

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
          type: 'strategyProjectVerify/updateState',
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
              type: 'strategyProjectVerify/del',
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
      default:
        break;
    }
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'strategyProjectVerify/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyProjectVerify/updateState',
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
      type: 'strategyProjectVerify/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['strategyProjectVerify/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getFilterProps = () => {
    const filters = [];
    if (this.state.verifyResultFilter) {
      filters.push({
        fieldName: 'verifyResult',
        operator: 'EQ',
        fieldType: 'String',
        value:this.state.verifyResultFilter,
      });
    }
    if (this.state.verifyStyleFilter) {
      filters.push({
        fieldName: 'verifyStyle',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.verifyStyleFilter,
      });
    }
    return filters;
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handlerExport = () => {
    const filters = this.getFilterProps();
    request.post(`${PROJECT_PATH}/strategyProjectVerify/export`, {filters}).then(res => {
      if (res.success && res.data.length > 0) {
        exportXlsx(
          '验证问题',
          [
            'id',
            '确认结果',
            '确认类别',
            '问题点',
          ],
          res.data);
      }else{
        message.error(res.message);
      }
    }
    );
  };

  downloadTemplate = (type) => {
    this.dispatchAction({
      type: 'strategyProjectVerify/downloadTemplate',
      payload: {
        type: type,
      },
    });
  };

  validateItem = (data) => {
    return data.map(item => {
      if (!item.verifyResult) {
        debugger;
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '确认结果不能为空',
        }
      }else if (!item.verifyStyle) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '确认类型不能为空',
        }
      }else if (!item.verifyPoint) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '问题点不能为空',
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

  uploadStrategyProjectVerify = (data) => {
    const { dispatch } = this.props;
    debugger
    dispatch({
      type: 'strategyProjectVerify/uploadStrategyProjectVerify',
      payload:  data,
    }).then(res => {
      if (res.success) {
        this.refresh();
      }
    }
    );
  }


  getExtableProps = () => {
    const columns = [
      {
        title: '序号',
        key: 'index',
        width: '5%',
        align: 'center',
        dataIndex: 'index',
        render: (_, __, index) => index + 1,
      },
      {
        title: '操作',
        key: 'operation',
        width: "15%",
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
        title: '确认结果',
        dataIndex: 'verifyResult',
        width: '10%',
        required: true,
      },
      {
        title: '确认类别',
        dataIndex: 'verifyStyle',
        width: '10%',
        required: true,
      },
      {
        title: '问题点',
        dataIndex: 'verifyPoint',
        width: '70%',
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          确认结果：{''}
          <Input
            style={{ width: 200 }}
            placeholder="请输入确认结果"
            onChange={e => {
              this.setState({
                verifyResultFilter: e.target.value,
              });
            }}
            allowClear
          />
          确认类别：{''}
          <Input
            style={{ width: 200 }}
            placeholder="请输入确认类别"
            onChange={e => {
              this.setState({
                verifyStyleFilter: e.target.value,
              });
            }}
            allowClear
          />
           <Button
            type="primary"
            onClick={() => {
              this.refresh();
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
          <Button onClick={() => this.downloadTemplate('可用的入参')}>模板</Button>
          <DataImport
            tableProps={{ columns, showSearch: false }}
            validateFunc={this.validateItem}
            validatedAll={true}
            importFunc={this.uploadStrategyProjectVerify}
          />
        </Space>
      ),
    };
    const filters = this.getFilterProps();
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
        url:`${PROJECT_PATH}/strategyProjectVerify/findByPage`,
      },
    };
  };

  getEditModalProps = () => {
    const { loading, strategyProjectVerify } = this.props;
    const { modalVisible, editData } = strategyProjectVerify;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyProjectVerify/save'],
    };
  };

  render() {
    const { strategyProjectVerify } = this.props;
    const { modalVisible } = strategyProjectVerify;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyProjectVerify;
