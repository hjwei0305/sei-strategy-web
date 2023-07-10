import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button, Popconfirm,Input,message } from 'antd';
import { ExtTable, ExtIcon, Space, DataImport } from 'suid';
import EditModal from './EditModal';
import { getCurrentUser } from '@/utils/user';
import { request } from 'suid/lib/utils';
import { exportXlsx,constants } from '@/utils';
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyProjectScheme, loading }) => ({ strategyProjectScheme, loading }))
class StrategyProjectScheme extends Component {
  state = {
    delId: null,
    styleFilter: null,
    orgName: null,
    dateList: [
      {'id':1,'name':'每月1号','value':'1'},
      {'id':2,'name':'每月2号','value':'2'},
      {'id':3,'name':'每月3号','value':'3'},
      {'id':4,'name':'每月4号','value':'4'},
      {'id':5,'name':'每月5号','value':'5'},
      {'id':6,'name':'每月6号','value':'6'},
      {'id':7,'name':'每月7号','value':'7'},
      {'id':8,'name':'每月8号','value':'8'},
      {'id':9,'name':'每月9号','value':'9'},
      {'id':10,'name':'每月10号','value':'10'},
      {'id':11,'name':'每月11号','value':'11'},
      {'id':12,'name':'每月12号','value':'12'},
      {'id':13,'name':'每月13号','value':'13'},
      {'id':14,'name':'每月14号','value':'14'},
      {'id':15,'name':'每月15号','value':'15'},
      {'id':16,'name':'每月16号','value':'16'},
      {'id':17,'name':'每月17号','value':'17'},
      {'id':18,'name':'每月18号','value':'18'},
      {'id':19,'name':'每月19号','value':'19'},
      {'id':20,'name':'每月20号','value':'20'},
      {'id':21,'name':'每月21号','value':'21'},
      {'id':22,'name':'每月22号','value':'22'},
      {'id':23,'name':'每月23号','value':'23'},
      {'id':24,'name':'每月24号','value':'24'},
      {'id':25,'name':'每月25号','value':'25'},
      {'id':26,'name':'每月26号','value':'26'},
      {'id':27,'name':'每月27号','value':'27'},
      {'id':28,'name':'每月28号','value':'28'},
    ],
    user: getCurrentUser(),
  };

  constructor(prop) {
    super(prop);
    this.findByCode();
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
      case 'export':
        const filters = this.getTableFilters();
        request.post(`${PROJECT_PATH}/strategyProjectScheme/export`, {filters}).then(res => {
          if (res.success && res.data.length > 0) {
            exportXlsx(
              '项目周期配置',
              [
                'id',
                '类别',
                '开始日期',
                '结束日期',
                '工号',
                '姓名',
                '部门',
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
    if (this.state.styleFilter) {
      filters.push({
        fieldName: 'style',
        operator: 'EQ',
        fieldType: 'String',
        value: this.state.styleFilter,
      });
    }
    return filters;
  };

  refresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  };

  findByCode = () => {
    const { dispatch } = this.props;
    const code = getCurrentUser().account;
    dispatch({
      type: 'strategyProjectScheme/findByCode',
      payload: {code},
    }).then(res => {
      this.setState({
        orgName: res.data.organizationName,
      });
    });
  };

  downloadTemplate = (type) => {
    this.dispatchAction({
      type: 'strategyProjectScheme/downloadTemplate',
      payload: {
        type: type
      }
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
          message: '人员类别不能为空！',
        }
      }else if (!item.schedule) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '开始时间不能为空！',
        }
      }else if (!item.scheduleOver) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '结束时间不能为空！',
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
  
  uploadStrategyProjectScheme = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'strategyProjectScheme/uploadStrategyProjectScheme',
      payload:  data,
    }).then(res => {
      if (res.success) {
        message.success('导入成功');
        this.refresh();
      }
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
        width: 220,
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
        title: '类别',
        dataIndex: 'style',
        width: 150,
        required: true,
      },
      {
        title: '开始日期',
        dataIndex: 'schedule',
        width: 220,
        required: true,
        render:(_, record) => {
          for(let i of this.state.dateList){
            if(i.value === record.schedule){
              return i.name
            }
        }}
      },
      {
        title: '结束日期',
        dataIndex: 'scheduleOver',
        width: 220,
        required: true,
        render:(_, record) => {
          for(let i of this.state.dateList){
            if(i.value === record.scheduleOver){
              return i.name
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
        dataIndex: 'submitBy',
        width: 220,
        required: true,
      },
      {
        title: '部门',
        dataIndex: 'department',
        width: 220,
        required: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        width: 220,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          类  别：{''}
          <Input
            style={{ width: 150 }}
            onChange={e => {
              this.setState({
                styleFilter: e.target.value,
              });
            }}
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
            importFunc={this.uploadStrategyProjectScheme}          
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
        url:`${PROJECT_PATH}/strategyProjectScheme/findByPage`,
      },
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
      orgName: this.state.orgName,
      dateList: this.state.dateList,
      user: this.state.user,
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
