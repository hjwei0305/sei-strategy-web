import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, message,Popconfirm} from 'antd';
import { ExtTable, ExtIcon, Space, DataImport } from 'suid';
import EditModal from './EditModal';
import { exportXlsx,constants } from '@/utils';
import { request } from 'suid/lib/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyProjectStyle, loading }) => ({ strategyProjectStyle, loading }))
class StrategyProjectStyle extends Component {
  state = {
    delId: null,
    projectStyleFilter: null,
    codeFilter: null,
  };

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;
    return dispatch({
      type,
      payload,
    });
  };

  getTableFilters = () => {
    const filters = [];
    if (this.state.projectStyleFilter) {
      filters.push({
        fieldName: 'projectStyle',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.projectStyleFilter,
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

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'strategyProjectStyle/updateState',
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
              type: 'strategyProjectStyle/del',
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

  downloadTemplate = (type) => {
    this.dispatchAction({
      type: 'strategyProjectStyle/downloadTemplate',
      payload: {
        type: type
      }
    });
  };
  
  handlerExport = () => {
    const filters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/strategyProjectStyle/export`, {filters}).then(res => {
      if (res.success&&res.data.length > 0) {
        exportXlsx(
          '项目类别',
          [
            'id',
            '代码简称',
            '项目类别',
            '创建人',
            '创建时间',
          ],
          res.data);
      }else{
        message.error('无数据可导出！');
      }
    });
  };

  uploadStrategyProjectStyle = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'strategyProjectStyle/uploadStrategyProjectStyle',
      payload: data,
    }).then(res => {
      if (res.success) {
        
        this.refresh();
      }
    });
  };

  validateItem = (data) => {
    return data.map(item => {
      if (!item.projectStyle) {
        debugger;
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '项目类别不能为空',
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
    
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center',
        required: true,
        render: (_, __, index) => index + 1,
      },
      {
        title: '操作',
        key: 'operation',
        width: 200,
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
        title: '项目类别',
        dataIndex: 'projectStyle',
        width: 200,
        required: true,
      },
      {
        title: '代码',
        dataIndex: 'code',
        width: 200,
        required: true,
      },
      {
        title: '提交人',
        dataIndex: 'creatorName',
        width: 200,
        required: true,
      },
      {
        title: '提交时间',
        dataIndex: 'createdDate',
        width: 200,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          项目类别：{''}
          <Input
            style={{ width: 120 }}
            onChange={e => this.setState({
              projectStyleFilter: e.target.value
            })}
            allowClear
          />
          代码：{''}
          <Input
            style={{ width: 120 }}
            onChange={e => this.setState({
              codeFilter: e.target.value
          })}
            allowClear
          />
          <Button type='primary' onClick={this.refresh}>查询</Button>
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
            importFunc={this.uploadStrategyProjectStyle}          
          />
        </Space>
      ),
    };

    const filters = this.getTableFilters();

    return {
      columns,
      bordered: true,
      pagination: true,
      showSearch: false,
      toolBar: toolBarProps,
      remotePaging: true,
      cascadeParams: {
        filters,
      },
      store:{
        type: 'POST',
        url:`${PROJECT_PATH}/strategyProjectStyle/findByPage`,
      },
    };
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'strategyProjectStyle/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyProjectStyle/updateState',
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
      type: 'strategyProjectStyle/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
    this.refresh();
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['strategyProjectStyle/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getEditModalProps = () => {
    const { loading, strategyProjectStyle } = this.props;
    const { modalVisible, editData } = strategyProjectStyle;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyProjectStyle/save'],
    };
  };

  render() {
    const { strategyProjectStyle } = this.props;
    const { modalVisible } = strategyProjectStyle;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyProjectStyle;
