import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, Popconfirm, DatePicker, message } from 'antd';
import { ExtTable, ExtIcon, Space,DataImport } from 'suid';
import EditModal from './EditModal';
import { exportXlsx,constants } from '@/utils';
import { request } from 'suid/lib/utils';

const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyProjectLevel, loading }) => ({ strategyProjectLevel, loading }))
class StrategyProjectLevel extends Component {
  state = {
    delId: null,
    levelFilter: null,
    //提交人filter
    creatorNameFilter: null,
    //提交日期filter
    createdDateFilter: null,
    dataList: [],
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
    if (this.state.levelFilter) {
      filters.push({
        fieldName: 'level',
        operator: 'LK',
        fieldType: 'String',
        value: this.state.levelFilter,
      });
    }
    if (this.state.creatorNameFilter) {
      filters.push({
        fieldName: 'creatorName',
        operator: 'LK',
        fieldType: 'String',
        value: this.state.creatorNameFilter,
      });
    }
    if (this.state.createdDateFilter) {
      filters.push({
        fieldName: 'createdDate',
        operator: 'EQ',
        fieldType: 'Date',
        value: this.state.createdDateFilter,
      });
    }
    return filters;
  };

  onDateChange = data => {
    if(data){
      const date = data.format('YYYY-MM-DD');
      this.setState({
        createdDateFilter: date,
      });
    }else{
      this.setState({
        createdDateFilter: null,
    });
   }
  };

  findByPage = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters();
    dispatch({
      type: 'strategyProjectLevel/findByPage',
      payload: {
        filters
      },
    }).then(res => {
      const { rows } = res.data;
      this.setState({
        dataList: rows,
      });
    }
    );
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
          type: 'strategyProjectLevel/updateState',
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
              type: 'strategyProjectLevel/del',
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

  handlerExport = () => {
    debugger;
    const filters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/strategyProjectLevel/export`, {filters}).then(res => {
      if (res.success&&res.data.length>0) {
        exportXlsx('项目级别',
        [
          'id',
          'level',
          'code',
          'scope',
          'productLine',
          'importantProject',
          'stage',
          'creatorName',
          'createdDate',
        ],
        res.data);
      }

    });
  };

  downloadTemplate = (type) => {
    debugger;
    this.dispatchAction({
      type: 'strategyProjectLevel/downloadTemplate',
      payload: {
        type: type
      }
    });
  };

  validateItem = (data) => {
    return data.map(item => {
      if (!item.level) {
        debugger;
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '级别不能为空',
        }
      }else if (!item.code) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '编码不能为空',
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

  uploadStrategyProjectLevel = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'strategyProjectLevel/uploadStrategyProjectLevel',
      payload: data,
    }).then(res => {
      debugger;
      if (res.success) {
        message.success('导入成功！');
        this.findByPage();
      }
    });
  };


  handleSave = data => {
    this.dispatchAction({
      type: 'strategyProjectLevel/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyProjectLevel/updateState',
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
      type: 'strategyProjectLevel/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['strategyProjectLevel/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '序号',
        key: 'index',
        width: 80,
        align: 'center',
        dataIndex: 'index',
        render: (_, __, index) => index + 1,

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
        title: '级别',
        dataIndex: 'level',
        width: 120,
        required: true,
      },
      {
        title: '代码',
        dataIndex: 'code',
        width: 220,
        required: true,
      },
      {
        title: '实施覆盖范围',
        dataIndex: 'scope',
        width: 220,
        required: true,
      },
      {
        title: '产品线',
        dataIndex: 'productLine',
        width: 220,
        required: true,
      },
      {
        title: '公司重点关注项目',
        dataIndex: 'importantProject',
        width: 220,
        required: true,
      },
      {
        title: '运行阶段',
        dataIndex: 'stage',
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
          级  别 ：{''}
          <Input 
            style={{ width: 120 }} 
            onChange={e => this.setState({
              levelFilter: e.target.value
            })}
            allowClear
          />
          提交人 ：{''}
          <Input
            style={{ width: 120 }}
            onChange={e => this.setState({
              creatorNameFilter: e.target.value
            })}
            allowClear
          />
          提交时间 ：{''}
          <DatePicker
            onChange={e => this.onDateChange(e)}
            format="YYYY-MM-DD"
            allowClear
          />
          <Button type='primary' onClick={this.findByPage}>查询</Button>
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
            importFunc={this.uploadStrategyProjectLevel}          
          />
        </Space>
      ),
    };
    const filter = this.getTableFilters();
    return {
      columns,
      bordered: false,
      toolBar: toolBarProps,
      remotePaging: true,
      showSearch: false,
      dataSource: this.state.dataList,
      cascadeParams: {
        filter,
      }
    };
  };

  getEditModalProps = () => {
    const { loading, strategyProjectLevel } = this.props;
    const { modalVisible, editData } = strategyProjectLevel;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyProjectLevel/save'],
    };
  };

  render() {
    const { strategyProjectLevel } = this.props;
    const { modalVisible } = strategyProjectLevel;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyProjectLevel;
