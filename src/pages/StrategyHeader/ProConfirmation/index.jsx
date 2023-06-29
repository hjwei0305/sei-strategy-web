// 项目确认页面 ProConfirmation
import React, { PureComponent } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Input, Col, Row, Select, Upload, Steps, Button, Icon, Form, DatePicker, InputNumber } from 'antd';
import { ComboList, ExtModal, ExtTable } from 'suid';
import style from './index.less';

import { constants } from '@/utils';
const { SERVER_PATH } = constants;

// @withRouter
// @connect(({ proSubmission, loading }) => ({ proSubmission, loading }))
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};


@Form.create()

class FormModal extends PureComponent {
  static editData;
  constructor(props) {
    super(props);
    this.editData = [];
    const officerProps = {
      placeholder: '请选择项目负责人',
      width: 600,
      name: 'followNames',
      field: ['followIds', 'officerCodes', 'followNames'],
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
        for (let i = 0; i < item.length; i++) {
          codeStr += item[i].code + ',';
        }
        // form.setFieldsValue({ officerCodes: codeStr });
      },
      reader: {
        name: 'userName',
        description: 'organizationName',
        field: ['id', 'code', 'userName'],
      },
    };

    this.setState({
      officerProps: officerProps
    })

  };
  static errorMsgs;
  static obj = [];

  state = {
    obj: [],
    assetsList: [],
    editingKey: '',
    columns: [],
    correlationLine: [
      {
        title: '序号',
        dataIndex: 'index',
        width: 250,
        align: 'center',
      },
      {
        title: '相关方工号',
        dataIndex: 'correlationCode',
        width: 250,
        align: 'center',
        // e.target.value 修改值  record 行
        render: (_, record) => (
          <Input
            onBlur={e => { this.handleCellSave(e.target.value, record, 'correlationCode') }}
            min={1} max={6} />
        )
      },
      {
        title: '相关方姓名',
        dataIndex: 'correlationName',
        width: 250,
        align: 'center',
        // e.target.value 修改值  record 行
        render: (_, record) => (
          <ComboList
            placeholder={'请选择相关人'}
            name={'followNames'}
            field={['followIds', 'officerCodes', 'followNames']}
            store={this.XX}
            searchPlaceHolder={'搜索框'}
            ListProps={'vertical'}
            allowClear
            remotePaging
            // cascadeParams={
            //   [
            //     includeFrozen = [false],
            //     includeSubNode = [true],
            //     organizationId = ['734FB618-BA26-11EC-9755-0242AC14001A'],
            //   ]
            // }
            showSearch
            pagination
            searchProperties={
              ['userName', 'code']
            }
          // reader={
          //   // [
          //   //   name2 = ['userName'],
          //   //   description = ['organizationName'],
          //   //   field = ['id', 'code', 'userName']
          //   // ]
          // }
          />
        )
      },
      {
        title: '部门',
        dataIndex: 'department',
        width: 250,
        align: 'center',
        // e.target.value 修改值  record 行
        render: (_, record) => (
          <Input
            onBlur={e => { this.handleCellSave(e.target.value, record, 'department') }} />
        )
      },
      {
        title: '人员状态',
        dataIndex: 'perStatus',
        width: 250,
        align: 'center',
        // e.target.value 修改值  record 行
        render: (_, record) => (
          <Input
            onBlur={e => { this.handleCellSave(e.target.value, record, 'perStatus') }} />
        )
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
              onClick={() => this.handleDel(record)}
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
    feedLines: [],
  }
  handleSelect = () => {
    const officerProps = {
      placeholder: '请选择项目负责人',
      width: 600,
      name: 'followNames',
      field: ['followIds', 'officerCodes', 'followNames'],
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
        for (let i = 0; i < item.length; i++) {
          codeStr += item[i].code + ',';
        }
        // form.setFieldsValue({ officerCodes: codeStr });
      },
      reader: {
        name: 'userName',
        description: 'organizationName',
        field: ['id', 'code', 'userName'],
      },
    };
    return officerProps
  }


  // 处理单元格保存
  handleCellSave = (e, r, index) => {
    const row = r;
    const feed_Lines = this.state.feedLines
    row[index] = e
    this.editData[r.key - 1] = row;
    feed_Lines[r.key - 1] = row
    this.setState({
      feedLines: feed_Lines
    })
  }

  //新增行
  handleAddGood = () => {
    // feedLines
    let add_obj = [];
    const newObj = this.state.feedLines
    console.log(newObj)
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
    console.log(newObj)
    add_obj = newObj.concat({
      index: index + 1,
      key: key + 1,
      correlationCode: '',
      // correlationName: '',
      department: '',
      perStatus: '',
      id: null
    });
    console.log(this.state.feedLines)
    console.log(add_obj)
    this.setState({
      feedLines: add_obj
    })
    this.forceUpdate();
  };
  //删除
  handleDel = record => {
    const newObj = []
    this.state.feedLines.forEach(item => item !== record && newObj.push(item));
    for (let i = 0; i <= newObj.length - 1; i++) {
      newObj[i].index = i + 1;
    }
    this.setState({
      feedLines: newObj
    })

    console.log(this.state.feedLines)
    this.forceUpdate()
  };

  getExtableProps = () => {
    return {
      columns: this.state.correlationLine,
      bordered: true,
      refreshButton: 'empty',
      lineNumber: false,
      showSearch: false,
      pagination: false,
      allowCustomColumns: false,
      checkbox: false,
      dataSource: this.state.feedLines,
      rowKey: 'key',
    };
  }

  render() {
    const { visible, onClose, form } = this.props;
    const { officerProps } = this.state
    const { getFieldDecorator } = form;

    const items = [{
      userCode: '380889',
      userName: '苏浠静',
      bumen: '数字化',
      zhuangtai: '在职'
    },
    {
      userCode: '456355',
      userName: '你妹',
      bumen: '靠',
      zhuangtai: '在职'
    },
    {
      userCode: '551225',
      userName: '傻逼',
      bumen: '真的傻逼',
      zhuangtai: '离职'
    }
    ];
    const { Step } = Steps;
    const StepTitle = '王小明';
    const StepTitle2 = '待审核';

    const Option = Select.Option;

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    const Data = new Date().toLocaleString();

    const props = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
      defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/xxx.png',
        },
        {
          uid: '2',
          name: 'yyy.png',
          status: 'done',
          url: 'http://www.baidu.com/yyy.png',
        },
        {
          uid: '3',
          name: 'zzz.png',
          status: 'error',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/zzz.png',
        },
      ],
    };




    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        title="2023年度经营策略项目提报申请表(项目确认)"
        centered
        maskClosable={false}
        fullScreen
        footer={null}
        keyboard
        className={style.container}
      >
        <Form {...formItemLayout} layout="horizontal" className={style.PageClass}>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <span className={style.titleText}>项目提交</span>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>工号</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>模块对接人</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>部门</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>人员状态</Col>
              <Col span={3}>系统自动带出</Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*项目名称</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*工号</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*项目负责人</Col>
              <Col span={3}>

                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Select
                    mode="multiple"
                    placeholder="必填且支持多选"

                    onChange={handleChange}
                  >
                    {children}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={3}>*所属模块</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Select
                    mode="multiple"
                    placeholder="必填且支持多选"

                    onChange={handleChange}
                  >
                    {children}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*项目层级</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*项目类别</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*项目编号</Col>
              <Col span={3}>系统自动带出</Col>
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
              </Col>
              <Col span={3}>*项目内容</Col>
              <Col span={9}>
                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Input.TextArea placeholder="叫你写就写" style={{ height: '79px' }} />)}
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
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Input.TextArea placeholder="哪来那么多B话" style={{ height: '79px' }} />)}
                </FormItem>
              </Col>
              <Col span={3}>*项目目标</Col>
              <Col span={9}>
                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Input.TextArea placeholder="叫你写就写，哪来那么多B话" style={{ height: '79px' }} />)}
                </FormItem>
              </Col>
            </Row>
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>相关方</div>
            </div>
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <Button
                key="add"
                icon="plus"
                type="primary"
                onClick={this.handleAddGood}
                ignore="true">
                新增行
              </Button>
            </div>
            {/* <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={2}>序号</Col>
              <Col span={5}>相关方工号</Col>
              <Col span={5}>相关方姓名</Col>
              <Col span={5}>部门</Col>
              <Col span={4}>人员状态</Col>
              <Col span={3}>操作</Col>
            </Row> */}

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around"
              style={{ height: "250px" }}>
              <Col span={24}>
                <ExtTable
                  onTableRef={inst => (this.tableRef = inst)}
                  {...this.getExtableProps()}
                />
              </Col>


            </Row>
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>行动计划</div>
            </div>
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <Button type="primary" size="large" style={{ marginRight: '10px', background: '#409EFF', border: '1px solid #409EFF' }}>
                模板下载
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ marginRight: '10px', background: '#67C23A', border: '1px solid #67C23A' }}
              >
                新建
              </Button>
              <Button type="primary" size="large" style={{ marginRight: '10px', background: '#67C23A', border: '1px solid #67C23A' }}>
                导入
              </Button>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>序号</Col>
              <Col span={3}>操作</Col>
              <Col span={3}>月份</Col>
              <Col span={3}>*里程碑事件</Col>
              <Col span={3}>*责任人</Col>
              <Col span={3}>*预计完成时间</Col>
              <Col span={3}>*交付物</Col>
              <Col span={3}>*交付物是否设计财务数据</Col>
            </Row>
            {items.map((item, index) => (
              <Row key={index} align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={3}>{index + 1}</Col>
                <Col span={3}>{item.userCode}</Col>
                <Col span={3}>{item.userName}</Col>
                <Col span={3}>{item.bumen}</Col>
                <Col span={3}>{item.zhuangtai}</Col>
                <Col span={3}>操作</Col>
                <Col span={3}>*交付物</Col>
                <Col span={3}>*交付物是否设计财务数据</Col>
              </Row>
            ))}
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>运营策略管理组确认</div>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>工号</Col>
              <Col span={3}>380889</Col>
              <Col span={3}>姓名</Col>
              <Col span={3}>苏浠静</Col>
              <Col span={3}>部门</Col>
              <Col span={3}>数字化</Col>
              <Col span={3}>日期</Col>
              <Col span={3}>{Data}</Col>
            </Row>

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*确认结果</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Select
                    allowClear
                    onChange={handleChange}
                  >
                    {children}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={3}>*确认类别</Col>
              <Col span={3}>
                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Select
                    allowClear
                    onChange={handleChange}
                  >
                    {children}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={3}>*问题点</Col>
              <Col span={9}>
                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Input.TextArea placeholder="烦死了" />)}
                </FormItem>
              </Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>补充说明</Col>
              <Col span={21}>
                <FormItem >
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Input.TextArea placeholder="烦死了" />)}
                </FormItem>
              </Col>
            </Row>
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>资料初审</div>
            </div>

            <Form className={style.fromClass}>
              <div>
                <FormItem labelCol={{ span: 6 }} label='是否通过：' style={{ display: 'inline-block' }}>
                  {getFieldDecorator('userName', {
                    //  initialValue: user && user.userName,
                  })(<Select style={{ display: 'inline-block' }}>
                    <Select.Option value="demo" >Demo</Select.Option>
                  </Select>)}
                </FormItem>
              </div>



              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label='工号：' style={{ display: 'inline-block' }}>
                {getFieldDecorator('userName', {
                  //  initialValue: user && user.userName,
                })(<Input style={{ display: 'inline-block' }} />)}
              </FormItem>

              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label='经营策略管理组：' style={{ display: 'inline-block' }}>
                {getFieldDecorator('userName', {
                  //  initialValue: user && user.userName,
                })(<Input style={{ display: 'inline-block' }} />)}
              </FormItem>

              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label='日期：' style={{ display: 'inline-block' }}>
                {getFieldDecorator('userName', {
                  //  initialValue: user && user.userName,
                })(<DatePicker style={{ display: 'inline-block' }} />)}
              </FormItem>


              <div>
                *审核意见附件上传：
                <Button type="primary" size="small" style={{ margin: '10px', background: '#409EFF', border: '1px solid #409EFF' }}>浏 览</Button>
                <Upload {...props}>
                  <Button type="primary" size="small" style={{ margin: '10px', background: '#67C23A', border: '1px solid #67C23A' }}>
                    <Icon type="upload" />上传文件
                  </Button>
                </Upload>
              </div>
            </Form>


          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>审核、审批</div>
            </div>

            <Steps direction="vertical" current={1} className={style.stepsClass}>
              <Step title={`${StepTitle}  ${StepTitle2}`} subTitle="2023-03-29" />
              <Step
                title={`${StepTitle}  ${StepTitle2}`}
                description="审批意见：XXXXXXXXXX"
                subTitle="2023-03-29"
              />
              <Step
                title={`${StepTitle}  ${StepTitle2}`}
                description="审批意见：XXXXXXXXXX"
                subTitle="2023-03-29"
              />
              <Step
                title={`${StepTitle}  ${StepTitle2}`}
                description="审批意见：XXXXXXXXXX"
                subTitle="2023-03-29"
              />
            </Steps>
          </div>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Button type="primary" size="large" style={{ margin: '10px', background: 'grey', border: '1px solid grey' }}>
            保存
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ margin: '10px', background: 'red', border: '1px solid red' }}
          >
            退回
          </Button>
          <Button type="primary" size="large" style={{ margin: '10px' }}>
            提交
          </Button>
        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
