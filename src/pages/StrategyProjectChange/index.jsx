import React, { Component } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Button,Input, message } from 'antd';
import { ExtTable, Space } from 'suid';
import EditModal from './EditModal';
import { request } from 'suid/lib/utils';
import { exportXlsx, constants } from '@/utils';
const { PROJECT_PATH } = constants;

@withRouter
@connect(({ strategyProjectChange, loading }) => ({ strategyProjectChange, loading }))
class StrategyProjectChange extends Component {
  state = {
    delId: null,
    dataList: [],
  };

  constructor(props) {
    super(props);
    this.findByPage();
  }

  dispatchAction = ({ type, payload }) => {
    const { dispatch } = this.props;

    return dispatch({
      type,
      payload,
    });
  };

  handlerExport = () => {
    const filters = this.getTableFilters();
    request.post(`${PROJECT_PATH}/strategyProjectChange/export`, {filters}).then(res => {
      if (res.success && res.data.length > 0) {
        exportXlsx(
          '经营策略',
          [
            'id',
            '经营策略',
            '所属模块',
            '工号',
            '责任人',
            '职位',
            '项目名称',
            '提交人',
            '当前阶段',
            '变更申请类型',
            '变更前',
            '变更后',
            '变更次数',
            '生效日期',
            '单号',
          ],
          res.data);
      }else{
        message.error(res.message);
      }
    });
  }

  findByPage = () => {
    const { dispatch } = this.props;
    const filters = this.getTableFilters();
    dispatch({
      type: 'strategyProjectChange/findByPage',
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

  getTableFilters = () => {
    const filters = [];
    if (this.state.module) {
      filters.push({
        fieldName: 'module',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.module,
      });
    }
    if (this.state.officerName) {
      filters.push({
        fieldName: 'officerName',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.officerName,
      });
    }
    if (this.state.projectName) {
      filters.push({
        fieldName: 'projectName',
        operator: 'LK',
        fieldType: 'String',
        value:this.state.projectName,
      });
    }
    return filters;
  };

  getExtableProps = () => {
    const columns = [
      {
        title: '经营策略',
        dataIndex: 'strategy',
        width: 200,
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
        dataIndex: 'officerCode',
        width: 120,
        required: true,
      },
      {
        title: '责任人',
        dataIndex: 'officerName',
        width: 120,
        required: true,
      },
      {
        title: '职位',
        dataIndex: 'position',
        width: 120,
        required: true,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 120,
        required: true,
      },
      {
        title: '提交人',
        dataIndex: 'creatorName',
        width: 120,
        required: true,
      },
      {
        title: '当前阶段',
        dataIndex: 'stage',
        width: 120,
        required: true,
      },
      {
        title: '变更申请类别',
        dataIndex: 'changeStyle',
        width: 120,
        required: true,
        render: (text, record) => {
          if (record.changeStyle === '1' ) {
            return '变更';
          }
          if (record.changeStyle === '2' ) {
            return '暂停';
          }
          if (record.changeStyle === '3' ) {
            return '废止';
          }
        }
      },
      {
        title: '变更前',
        dataIndex: 'changeBefore',
        width: 120,
        required: true,
      },
      {
        title: '变更后',
        dataIndex: 'changeAfter',
        width: 220,
        required: true,
      },
      {
        title: '变更次数',
        width: 120,
        required: true,
        render: () => {
          return 1
        }
      },
      {
        title: '生效日期',
        dataIndex: 'effectiveDate',
        width: 200,
        required: true,
      },
      {
        title: '单号',
        dataIndex: 'projectCode',
        width: 200,
        required: true,
      },
    ];
    const toolBarProps = {
      left: (
        <Space>
          所属模块：{' '}
          <Input
            type="text"
            onChange={e => {
              this.setState({
                module: e.target.value,
              });
            }}
          />
          责任人：{' '}
          <Input
            type="text"
            onChange={e => {
              this.setState({
                officerName: e.target.value,
              });
            }}
          />
          项目名称：{' '}
          <Input
            type="text"
            onChange={e => {
              this.setState({
                projectName: e.target.value,
              });
            }}
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
      },
    };
  };

  getEditModalProps = () => {
    const { loading, strategyProjectChange } = this.props;
    const { modalVisible, editData } = strategyProjectChange;

    return {
      onSave: this.handleSave,
      editData,
      visible: modalVisible,
      onClose: this.handleClose,
      saving: loading.effects['strategyProjectChange/save'],
    };
  };

  render() {
    const { strategyProjectChange } = this.props;
    const { modalVisible } = strategyProjectChange;

    return (
      <>
        <ExtTable onTableRef={inst => (this.tableRef = inst)} {...this.getExtableProps()} />
        {modalVisible ? <EditModal {...this.getEditModalProps()} /> : null}
      </>
    );
  }
}

export default StrategyProjectChange;
