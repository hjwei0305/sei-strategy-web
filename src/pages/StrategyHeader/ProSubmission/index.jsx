import React, { PureComponent } from 'react';
import ReactToPrint from 'react-to-print';
import { Input, Col, Row, Select, Button, Form, DatePicker } from 'antd';
import { ExtModal, ComboList, ExtTable, DataImport  } from 'suid';
import moment from 'moment';
import style from './index.less';
import { constants } from '@/utils';
import StartFlow from 'suid/es/work-flow/StartFlow';
const { SERVER_PATH } = constants;
const { ComboMultiList } = ComboList;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

const importPlans = [
  {
    title: '月份',
    dataIndex: 'month',
  },
  {
    title: '里程碑事件',
    dataIndex: 'milestone',
  },
  {
    title: '责任人Code',
    dataIndex: 'userCode',
  },
  {
    title: '责任人',
    dataIndex: 'userName',
  },
  {
    title: '预计完成时间',
    dataIndex: 'estimateDate',
  },
  {
    title: '交付物',
    dataIndex: 'deliverable',
  },
  {
    title: '交付物是否涉及财务数据',
    dataIndex: 'isFinancial',
  },
];

@Form.create()

class FormModal extends PureComponent {

  // 挂载后立即调用
  componentDidMount() {
    const { editData,monthList } = this.props;
    this.setState({
      reltesFeedLines: editData.strategyProjectDto.relates,
      plans: editData.strategyProjectDto.plans,
      monthList: monthList,
    });
  }

  state = {
    obj: [],
    formData: {},
    relates: [],
    reltesFeedLines: [],
    plans: [],
    correlationLine: [
      {
        title: '序号',
        dataIndex: 'index',
        width: 250,
        align: 'center',
      },
      {
        title: '相关方工号',
        dataIndex: 'userCode',
        width: 250,
        align: 'center',
      },
      {
        title: '相关方姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: 250,
        align: 'center',
        render: (_, record) => (
          <ComboList
            value={record.userName}
            placeholder={'请选择相关人'}
            name={'followNames'}
            field={['id', 'code', 'userName']}
            store={{
              url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
              type: 'POST',
            }}
            searchPlaceHolder={'搜索框'}
            ListProps={'vertical'}
            allowClear
            remotePaging
            cascadeParams={
              {
                includeFrozen : 'false',
                includeSubNode : 'true',
                organizationId : '734FB618-BA26-11EC-9755-0242AC14001A',
              }
            }
            showSearch
            pagination
            searchProperties={
              ['userName', 'code']
            }
            afterSelect={item => {
              this.fillRelateCell(item, record);

            }}
            reader={{
              name: 'userName',
              description: 'organizationName',
              field: ['id', 'code', 'userName'],
            }}
          />
        )
      },
      {
        title: '部门',
        dataIndex: 'department',
        width: 500,
        align: 'center',
      },
      {
        title: '人员状态',
        dataIndex: 'userState',
        width: 250,
        align: 'center',
      },
      {
        title: '操作',
        key: 'operation',
        width: 250,
        dataIndex: 'id',
        align: 'center',
        render: (_, record) => (
          <span>
            <Button
              key="del"
              onClick={() => this.delRelatedOne(record)}
              type="danger"
              ghost
              ignore="true"
            >
              删除
            </Button>
          </span>
        ),
      },
    ],
    actionsLine: [
      {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center',
      },
      {
        title: '操作',
        key: 'operation',
        width: 250,
        dataIndex: 'id',
        align: 'center',
        render: (_, record) => (
          <span>
            <Button
              key="del"
              onClick={() => this.delAcction(record)}
              type="danger"
              ghost
              ignore="true"
            >
              删除
            </Button>
          </span>
        ),
      },
      {
        title: '月份',
        dataIndex: 'month',
        width: 250,
        align: 'center',
        render: (_,record) => (
          <ComboList
            showSearch={false}
            dataSource={this.state.monthList}
            pagination={false}
            value={( record && record.month === null ) ? null : (record.month+'月')}
            reader={
              {
                name:'name',
                value:'value'
              }}
            afterSelect={item => {
              this.handleCellSave(item.value, record, 'month');

            }}
          />
        )

      },
      {
        title: '里程碑事件',
        dataIndex: 'milestone',
        width: 250,
        align: 'center',
        render: (_, record) => (
          <Input
          defaultValue={record.milestone}
            onBlur={e => { this.handleCellSave(e.target.value, record, 'milestone') }} />
        )
      },
      {
        title: '责任人',
        dataIndex: 'userName',
        key: 'userName',
        width: 250,
        align: 'center',
        render: (_, record) => (
          <ComboList
            value={record.userName}
            placeholder={'请选择责任人'}
            name={'followNames'}
            field={['id', 'code', 'userName']}
            store={{
              url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
              type: 'POST',
            }}
            searchPlaceHolder={'搜索框'}
            ListProps={'vertical'}
            allowClear
            remotePaging
            cascadeParams={
              {
                includeFrozen : 'false',
                includeSubNode : 'true',
                organizationId : '734FB618-BA26-11EC-9755-0242AC14001A',
              }
            }
            showSearch
            pagination
            searchProperties={
              ['userName', 'code']
            }
            afterSelect={item => {
              record.userName = item.userName
              record.userCode = item.code
              const feed_Lines = this.state.plans
              feed_Lines[record.key - 1] = record
              this.setState({
                plans: feed_Lines
              })
            }}
            reader={{
              name: 'userName',
              description: 'organizationName',
              field: ['id', 'code', 'userName'],
            }}
          />
        )
      },
      {
        title: '预计完成时间',
        dataIndex: 'estimateDate',
        width: 250,
        align: 'center',
        render: (_,record) => (
          <DatePicker allowClear onBlur={e => { this.handleCellSave(e.target.value, record, 'estimateDate') }}
            defaultValue={(record || record.estimateDate === null) ? moment(new Date(),'YYYY-MM-DD') : moment(record.estimateDate, 'YYYY-MM-DD')}
          />
          )
      },
      {
        title: '交付物',
        dataIndex: 'deliverable',
        width: 250,
        align: 'center',
        render: (_, record) => (
          <Input defaultValue={record.deliverable}
            onBlur={e => { this.handleCellSave(e.target.value, record, 'deliverable') }} />
        )
      },
      {
        title: '交付物是否涉及财务数据',
        dataIndex: 'isFinancial',
        width: 250,
        align: 'center',
        render: (_, record) => (
          <Select defaultValue={record.isFinancial} onSelect={e => { this.handleCellSave(e, record, 'isFinancial') }}>
            <Select.Option value="1">是</Select.Option>
            <Select.Option value="0">否</Select.Option>
          </Select>
        )
      }
    ],
  }

  // 封装params
  getParams = () => {
    const { form, editData } = this.props;
    const params = {};
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      formData.contacts = editData.strategyProjectDto.contacts;
      formData.id = editData.strategyProjectDto.id;
      formData.stage = editData.strategyProjectDto.stage;
      formData.relates = this.state.reltesFeedLines;
      formData.plans = this.state.plans;
      Object.assign(params, formData);
    });
    return params;
  };

  // 保存当前页面
  handSave = () => {
    const { onSave } = this.props;
    const params = this.getParams();
    if (onSave) {
      onSave(params);
    }
  };
  // 提交当前页面
  submit = () => {
    const { submitProject } = this.props;
    const params = this.getParams();
    if (submitProject) {
      submitProject(params);
    }
  }

  downLoad = () => {
    console.log("38383838")
  }


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++   相关方  start  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // 处理单元格保存
  fillRelateCell = (e, r) => {

    const row = r;
    const feed_Lines = this.state.reltesFeedLines
    row.department = e.organizationName
    row.userCode = e.code
    row.userState = e.frozen === 'true' ? '离职' : '在职'
    row.userId = e.id
    row.userName = e.userName
    this.setState({
      reltesFeedLines: feed_Lines
    })

    this.forceUpdate()
  };

  //新增关联人行
  addRelatedOne = () => {
    let newObj = this.state.reltesFeedLines

    let key = Math.max.apply(
      Math,
      newObj.map(item => {
        return item.key;
      }),
    );
    let index = Math.max.apply(
      Math,
      newObj.map(item => {
        return item.index;
      }),
    );
    if (index === -Infinity) {
      index = 0;
      key = 0;
    }
    if (index > 4) {
      return;
    }
    const add_obj = newObj.concat({
      index: index + 1,
      key: key + 1,
      userCode: '',
      department: '',
      userState: '',
      id: '',
      username: '',
    });
    this.setState({
      reltesFeedLines: add_obj
    })
    this.forceUpdate()
  };
   //删除
  delRelatedOne = record => {


    const newObj = []
    this.state.reltesFeedLines.forEach(item => item.index !== record.index && newObj.push(item));
    for (let i = 0; i <= newObj.length - 1; i++) {
      newObj[i].index = i + 1;
    }
    this.setState({
      reltesFeedLines: newObj
    })

    this.forceUpdate()
  };

  // 获取相关人员表格属性
  getRelatedExtableProps = () => {
    return {
      columns: this.state.correlationLine,
      bordered: true,
      refreshButton: 'empty',
      lineNumber: false,
      showSearch: false,
      pagination: false,
      allowCustomColumns: false,
      checkbox: false,
      dataSource: this.state.reltesFeedLines,
      rowKey: 'key',
    };
  };

// -----------------------------------------------------------    相关方  end    --------------------------------------------------------------------------


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++   行动计划  start  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // 处理单元格保存
  handleCellSave = (e, r, field) => {
    const row = r;
    row[field] = e
    const feed_Lines = this.state.plans
    feed_Lines[r.key - 1] = row
    this.setState({
      plans: feed_Lines
    })
  }

  addActions = () => {

    let newObj = this.state.plans

    let key = Math.max.apply(
      Math,
      newObj.map(item => {
        return item.key;
      }),
    );
    let index = Math.max.apply(
      Math,
      newObj.map(item => {
        return item.index;
      }),
    );
    if (index === -Infinity) {
      index = 0;
      key = 0;
    }
    const add_obj = newObj.concat({
      index: index + 1,
      key: key + 1,
      month: '',
      milestone: '',
      userName: '',
      userCode: '',
      estimateDate: '',
      deliverable: '',
      isFinancial: '',
    });
    this.setState({
      plans: add_obj
    })
    this.forceUpdate()
  }

    //删除
  delAcction = record => {

    const newObj = []
    this.state.plans.forEach(item => item.index !== record.index && newObj.push(item));
    for (let i = 0; i <= newObj.length - 1; i++) {
      newObj[i].index = i + 1;
    }
    this.setState({
      plans: newObj
    })

    this.forceUpdate()
  };

  // 获取计划表格属性
  getPlansProps = () => {
    return {
      columns: this.state.actionsLine,
      bordered: true,
      refreshButton: 'empty',
      lineNumber: false,
      showSearch: false,
      pagination: false,
      allowCustomColumns: false,
      checkbox: false,
      dataSource: this.state.plans,
      rowKey: 'key',
    };
  };

  downPlansTemplate = () => {
    const {downPlansTemplate} = this.props;
    downPlansTemplate();
  }

  importPlans = data => {
    const {uploadStrategyProjectPlans,editData} = this.props;
    data.forEach(item => {
      item.projectId = editData.strategyProjectDto.id;
    });
    uploadStrategyProjectPlans(data);
  }

  validateItem = data => {
    return data.map(item => {
      if (!item.month) {
        return {
          ...item,
          validate: false,
          status: '验证失败',
          statusCode: 'error',
          message: '月份不能为空',
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
//  -----------------------------------------------------------   行动计划  end    ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  render() {
    const { visible, onClose, editData, projectStyle, form, projectLevel } = this.props;
    const {reltesFeedLines, plans } = this.state;
    const { getFieldDecorator } = form;

    // 项目负责人
    const officerProps = {
      placeholder: '请选择项目负责人',
      width: 600,
      name: 'officers',
      field: ['followIds', 'officerCodes', 'officerNames'],
      store: {
        type: 'post',
        url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
      },
      searchPlaceHolder: '请选择项目负责人',
      ListProps: 'vertical',
      allowClear: true,
      remotePaging: true,
      cascadeParams: {
        includeFrozen: false,
        includeSubNode: true,
        organizationId: '734FB618-BA26-11EC-9755-0242AC14001A',
      },
      showSearch: true,
      pagination: true,
      searchProperties: ['userName', 'code'],
      afterClear: (item) => {
      },
      afterSelect: item => {
        let codeStr = '';
        for(let i=0;i<item.length;i++){
          codeStr+=item[i].code+',';
          item[i].userCode = item[i].code;
        }
        form.setFieldsValue({officerCodes: codeStr});
        form.setFieldsValue({officers: item});
      },
      reader: {
        name: 'userName',
        description: 'organizationName',
        field: ['id', 'code', 'userName'],
      },
    };


    // 项目联系人
    const contact = editData.strategyProjectDto.contacts == null ? {} : editData.strategyProjectDto.contacts[0];




    const Option = Select.Option;

    const moduleArray = [];

    const projectLevelArray = [];

    for (let i = 0; i < projectStyle.length; i++) {
      moduleArray.push(<Option key={projectStyle[i].projectStyle}>{projectStyle[i].projectStyle}</Option>);
    }

    for (let i = 0; i < projectLevel.length; i++) {
      projectLevelArray.push(<Option key={projectLevel[i].level}>{projectLevel[i].level}</Option>);
    }

    const Data = new Date().toLocaleString();

    const year = new Date().getFullYear();

    const feed_lines666 =  reltesFeedLines;


    const temp = [];


    feed_lines666.forEach((item, index) => {
      temp.push({
        index: index + 1,
        key: index + 1,
        userCode: item.userCode,
        department: item.department,
        userState: item.userState,
        id: item.id,
        userName: item.userName
      })
    });

    this.state.reltesFeedLines = temp;


    const feed_plans = plans;

    const temp2 = [];

    feed_plans.forEach((item, index) => {
      temp2.push({
        index: index + 1,
        key: index + 1,
        month: item.month,
        milestone: item.milestone,
        userName: item.userName,
        userCode: item.userCode,
        estimateDate: item.estimateDate,
        deliverable: item.deliverable,
        isFinancial: item.isFinancial,
      })
    })

    this.state.plans = temp2;

    const startFlowProps = {
      businessKey: editData && editData.strategyProjectDto.id,
      businessModelCode: 'com.domlin.strategy.entity.StrategyProject',
      // startComplete: () => this.BackBill,
      needStartConfirm: false,
      // beforeStart: () => this.beforeStart(),
    };

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        title={year + "年度经营策略项目提报申请表(提交项目)"}
        centered
        maskClosable={false}
        fullScreen
        footer={null}
        keyboard
        className={style.container}
      >

        <div id="xy-print" ref={el=> this.contentRef = el}>
        <Form {...formItemLayout} layout="horizontal" className={style.XXX}>
          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <span className={style.titleText}>项目提交</span>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>工号</Col>
              <Col span={3}>{contact.userCode}</Col>
              <Col span={3}>模块对接人</Col>
              <Col span={3}>{contact.userName}</Col>
              <Col span={3}>部门</Col>
              <Col span={3}>{contact.department}</Col>
              <Col span={3}>人员状态</Col>
              <Col span={3}>{contact.userState}</Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3} style={{ color: '#F56C6C' }}>*项目名称</Col>
              <Col span={3} >
                <FormItem >
                  {getFieldDecorator('name', {
                    initialValue: editData.strategyProjectDto.name,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              <Col span={3}>*工号</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('officerCodes', {
                    initialValue: editData.strategyProjectDto.officerCodes,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              <Col span={3}>*项目负责人</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('officers', {
                    initialValue: editData.strategyProjectDto.officers,
                  })(<ComboMultiList {...officerProps} />)}
                </FormItem>
              </Col>
              <Col span={3}>*所属模块</Col>
              <Col span={3}>
                {editData.strategyAnalyzeBillDto.module}
              </Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*项目层级</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('level', {
                    initialValue: editData.strategyProjectDto.level,
                  })(<Select
                    placeholder="请选择"
                  >
                    {projectLevelArray}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={3}>*项目类别</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('style', {
                    initialValue: editData.strategyProjectDto.style,
                  })(<Select
                    placeholder="请选择"
                  >
                    {moduleArray}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={3}>*项目编号</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('code', {
                    initialValue: editData.strategyProjectDto.code,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              <Col span={3}>提交日期</Col>
              <Col span={3}>{Data}</Col>
            </Row>
            <Row
              align="middle"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ height: '6rem' }}
            >
              <Col span={3}>*此项目所匹配的经营策略</Col>
              <Col span={9}>
                {editData.strategyAnalyzeBillDto.strategyName}
              </Col>
              <Col span={3}>*项目内容</Col>
              <Col span={9}>
                <FormItem >
                  {getFieldDecorator('content', {
                    initialValue: editData.strategyProjectDto.content,
                  })(<Input.TextArea style={{ height: '79px' }} placeholder='请输入文字！'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row
              align="middle"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ height: '6rem' }}
            >
              <Col span={3}>*项目意义</Col>
              <Col span={9}>
                <FormItem >
                  {getFieldDecorator('significance', {
                    initialValue: editData.strategyProjectDto.significance,
                  })(<Input.TextArea style={{ height: '79px' }} placeholder='请输入文字！'/>)}
                </FormItem>
              </Col>
              <Col span={3}>*项目目标</Col>
              <Col span={9} >
                <FormItem >
                  {getFieldDecorator('target', {
                    initialValue: editData.strategyProjectDto.target,
                  })(<Input.TextArea style={{ height: '79px' }} placeholder='请输入文字！'/>)}
                </FormItem>
              </Col>
            </Row>
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>相关方</div>
              <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                  <Button
                    key="add"
                    icon="plus"
                    type="primary"
                    onClick={this.addRelatedOne}
                    ignore="true">
                      新增行
                  </Button>
              </div>

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around"
              style={{ height: "350px" }}>
                <Col span={24}>
                  <ExtTable
                    onTableRef={inst => (this.tableRef = inst)}
                    {...this.getRelatedExtableProps()}
                />
              </Col>
            </Row>
            </div>

          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>行动计划</div>
            </div>
            <div style={{ textAlign: 'left', marginBottom: '10px',width: '300px' }}>
              <Button onClick={this.downPlansTemplate}
               type="primary" size="large" style={{ marginRight: '20px', background: '#409EFF', border: '1px solid #409EFF' }}>
                模板下载
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ marginRight: '20px', background: '#67C23A', border: '1px solid #67C23A' }}
                onClick={this.addActions}
              >
                新建
              </Button>
              <DataImport
                tableProps={{ importPlans, showSearch: false }}
                validateFunc={this.validateItem}
                validatedAll={true}
                importFunc={this.importPlans}
              />
            </div>

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}justify="space-around"
              style={{ height: "350px" }}>
              <Col span={24}>
                <ExtTable
                  onTableRef={inst => (this.tableRef = inst)}
                  {...this.getPlansProps()}
              />
              </Col>
            </Row>

          </div>
        </Form>
        </div>


        <div style={{ textAlign: 'center', marginTop: '3rem' }}>

          <ReactToPrint
              trigger={() => (
                <Button type="primary">
                  打印
                </Button>
              )}
              documentTitle={`行动计划-${editData.strategyProjectDto.name}`}
              removeAfterPrint
              content={() => this.contentRef}
            />
          <Button onClick={this.handSave} type="primary" size="large" style={{ margin: '20px', background: '#909399', border: '1px solid #909399' }}>
            保存
          </Button>
          <Button onClick={this.submit} type="primary" size="large" style={{ margin: '20px' }}>
            提交
          </Button>
          <StartFlow {...startFlowProps}>
              {sLoading => (
                <Button type="primary" disabled={sLoading} loading={sLoading} style={{marginLeft:"5px"}} >
                  提交
                </Button>
              )}
          </StartFlow>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
