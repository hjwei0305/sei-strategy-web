import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { ExtTable, ExtIcon, Space } from 'suid';
import EditModal from './EditModal';

@withRouter
@connect(({ strategyProjectScheme, loading }) => ({ strategyProjectScheme, loading }))
class StrategyProjectScheme extends Component {
  state = {
    delId: null,
    datalist: [],
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


  handleEvent = (type, row) => {
    switch (type) {
      case 'add':
      case 'edit':
        this.dispatchAction({
          type: 'strategyProjectScheme/updateState',
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
              type: 'strategyProjectScheme/del',
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
      type: 'strategyProjectScheme/save',
      payload: data,
    }).then(res => {
      if (res.success) {
        this.dispatchAction({
          type: 'strategyProjectScheme/updateState',
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
      type: 'strategyProjectScheme/updateState',
      payload: {
        modalVisible: false,
        editData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delId } = this.state;
    if (loading.effects['strategyProjectScheme/del'] && delId === row.id) {
      return <ExtIcon status="error" tooltip={{ title: '删除' }} type="loading" antd />;
    }
    return <ExtIcon status="error" tooltip={{ title: '删除' }} type="delete" antd />;
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

  findByPage = () => {
    const { dispatch } = this.props;
    const {filters} = this.getTableFilters();
    dispatch({
      type: 'strategyProjectScheme/findByPage',
      payload: {
        filters,
      },
    }).then(res => {
      const rows = res.data.rows;
      this.setState({
        datalist: rows,
      });
    });
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
        width: 150,
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
        dataIndex: 'status',
        width: 150,
        required: true,
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        width: 150,
        required: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 150,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
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
          <Button onClick={this.refresh}>刷新</Button>
        </Space>
      ),
    };
    const filter = this.getTableFilters();
    return {
      columns,
      bordered: true,
      toolBar: toolBarProps,
      dataSource: this.state.datalist,
      cascadeParams: {
        filter,
      }
    };
  };

  getEditModalProps = () => {
    const { loading, strategyProjectScheme } = this.props;
    const { modalVisible, editData } = strategyProjectScheme;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyProjectScheme/save'],
    };
  };

  render() {
    const { strategyProjectScheme } = this.props;
    const { modalVisible } = strategyProjectScheme;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyProjectScheme;
