import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Input, Popconfirm } from 'antd';
import { ExtTable, ExtIcon, Space } from 'suid';
import EditModal from './EditModal';

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
  };

  constructor(prop) {
    super(prop);
    this.findByPage();
    this.componentdidmount();
  }

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

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
        filters,
      },
    }).then(res => {
      const { rows } = res.data;
      this.setState({
        dataList: rows,
      });
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
      default:
        break;
    }
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
          <Input
            style={{ width: 150 }}
            placeholder="请输入"
            value={this.state.styleFilter}
            onChange={e => {
              this.setState({
                styleFilter: e.target.value,
              });
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
        </Space>
      ),
    };
    const filter = this.getTableFilters(); // 过滤条件
    return {
      columns,
      bordered: true,
      toolBar: toolBarProps,
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
