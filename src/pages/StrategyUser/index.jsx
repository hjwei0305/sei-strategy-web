import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, Popconfirm,message } from 'antd';
import { ExtTable, ExtIcon, Space, DataImport, ComboList } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import { exportXlsx, constants } from '@/utils';
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyUser, loading }) => ({ strategyUser, loading }))
class StrategyUser extends Component {
  state = {
    delId: null,
    dataList: [],
    moduleFilter: null,
    styleFilter: null,
    userNameFilter: null,
    styleList:[],
    moduleList:[],
  };

  constructor(prop) {
    super(prop);
    this.findByPage();
    this.componentdidmount();
    this.initModuleList();
  }

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  // 人员类别
  componentdidmount = ()  =>{
    this.dispatchAction({
      type: 'strategyUser/getProOpt',
      payload:{}
    }).then(res => {
      const { data } = res;
      this.setState({
        styleList: data,
      });
    })
  }

  // 模块导出
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
        value: this.state.moduleFilter,
      });
    }
    if (this.state.styleFilter) {
      filters.push({
        fieldName: 'style',
        operator: 'LK',
        fieldType: 'String',
        value: this.state.styleFilter,
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
    return filters;
  };

  findByPage = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters();
    dispatch({
      type: 'strategyUser/findByPage',
      payload: {
        sortOrders: [
          {
            property: 'moduleCode',
            direction: 'ASC',
          }
        ],
        filters,
      },
    }).then(res => {
      const { rows } = res.data;
      this.setState({
        dataList: rows,
      });
    });
  };

  validateItem = data => {
    return data.map(item => {
      if (!item.style) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '人员类别不能为空',
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

  uploadStrategyUser = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'strategyUser/uploadStrategyUser',
      payload: data,
    }).then(res => {
      if (res.success) {
        message.success('导入成功！');
        this.findByPage();
      }
    });
  };


  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'strategyUser/updateState',
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
              type: 'strategyUser/del',
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
      case 'export':
        const filters = this.getTableFilters();
        request.post(`${PROJECT_PATH}/strategyUser/export`, {filters}).then(res => {
          if (res.success && res.data.length > 0) {
            exportXlsx(
              '策略用户',
              [
                'id',
                '模块code',
                '模块',
                '人员类别',
                '员工id',
                '工号',
                '姓名',
                '部门',
                '人事状态',
                '创建人',
                '创建时间',
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

  downloadTemplate = (type) => {
    this.dispatchAction({
      type: 'strategyUser/downloadTemplate',
      payload: {
        type: type
      }
    });
  };

  handleSave = data => {
    this.dispatchAction({
      type: 'strategyUser/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyUser/updateState',
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
      type: 'strategyUser/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['strategyUser/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
  };

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
        title: '模块',
        dataIndex: 'module',
        width: 150,
        required: true,
      },
      {
        title: '人员类别',
        dataIndex: 'style',
        width: 150,
        required: true,
        render:(_, record) => {
          for(let i of this.state.styleList){
            if(i.dataValue === record.style){
              return i.dataName
            }
        }}
      },
      {
        title: '工号',
        dataIndex: 'userCode',
        width: 150,
        required: true,
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 150,
        required: true,
      },
      {
        title: '部门',
        dataIndex: 'department',
        width: 150,
        required: true,
      },
      {
        title: '人事状态',
        dataIndex: 'userStatue',
        width: 150,
        required: true,
      },
      {
        title: '创建人',
        dataIndex: 'creatorName',
        width: 150,
        required: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        width: 150,
        required: true,
      },
    ];
    const toolBarProps = {
      layout: {leftSpan: 18, rightSpan: 6},
      left: (
        <Space>
          所属模块：
          <Input
            style={{ width: 150 }}
            placeholder="请输入"
            value={this.state.moduleFilter}
            onChange={e => {
              this.setState({
                moduleFilter: e.target.value,
              });
            }}
            allowClear
          />
          人员类别：
          <ComboList
            style={{ width: 150 }}
            placeholder="请选择"
            pagination={false}
            showSearch={false}
            dataSource={this.state.styleList}
            afterClear={() => this.setState({ styleFilter: null })}
            afterSelect={item => this.setState({ styleFilter: item.dataValue })}
            reader={{
              name: 'dataName',
            }}
            allowClear
          />
          姓名：
          <Input
            style={{ width: 150 }}
            placeholder="请输入"
            value={this.state.userNameFilter}
            onChange={e => {
              this.setState({
                userNameFilter: e.target.value,
              });
            }}
            allowClear
          />
          <Button type="primary" onClick={this.findByPage}>  查询  </Button>
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
            importFunc={this.uploadStrategyUser}
          />
        </Space>
      ),
    };
    const filter = this.getTableFilters(); // 过滤条件
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
    const { loading, strategyUser } = this.props;
    const { modalVisible, editData } = strategyUser;

    return {
      onSave: this.handleSave,
      styleList: this.state.styleList,
      moduleList: this.state.moduleList,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyUser/save'],
    };
  };

  render() {
    const { strategyUser } = this.props;
    const { modalVisible } = strategyUser;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyUser;
