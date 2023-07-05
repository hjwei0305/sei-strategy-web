import React, { PureComponent } from 'react';
import { Input, Col, Row, Select, Button, Form } from 'antd';
import { ExtModal, ComboList, ExtTable } from 'suid';

import style from './index.less';
import { constants } from '@/utils';
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

@Form.create()

class FormModal extends PureComponent {

  state = {
    obj: [],
    formData: {},
    relates: [],
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
        dataIndex: 'username',
        width: 250,
        align: 'center',
        render: (_, record) => (
          <ComboList
            defaultValue={record.userName}
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
              this.handleCellSave(item, record);
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
        dataIndex: 'userStatue',
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

  // 保存当前页面
  handAdd = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      formData.contacts = editData.strategyProjectDto.contacts;
      
      formData.id = editData.strategyProjectDto.id;
      formData.stage = editData.strategyProjectDto.stage;
      formData.relates = this.state.feedLines;
      Object.assign(params, formData);
      if (onSave) {
        onSave(params);
      }
    });
  };

  // 处理单元格保存
  handleCellSave = (e, r) => {
    const row = r;
    const feed_Lines = this.state.feedLines
    row.department = e.organizationName
    row.userCode = e.code
    row.userStatue = e.frozen === 'true' ? '离职' : '在职'
    row.userId = e.id
    row.username = e.userName
    this.setState({
      feedLines: feed_Lines
    })
    this.forceUpdate();
  }
  
  //新增关联人行
  addRelatedOne = () => {
    let add_obj = [];
    const newObj = this.state.feedLines
    console.log(newObj.length)
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
    add_obj = newObj.concat({
      index: index + 1,
      key: key + 1,
      userCode: '',
      department: '',
      userStatue: '',
      id: '',
      username: '',
    });
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

    this.forceUpdate()
  };
  // 获取相关方表格属性
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
    const { visible, onClose, editData, projectStyle, form, projectLevel } = this.props;
    const { getFieldDecorator } = form;
  

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



    const contact = editData.strategyProjectDto.contacts == null ? {} : editData.strategyProjectDto.contacts[0];
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
    }];


    
    const Option = Select.Option;

    const moduleArray = [];

    const projectLevelArray = [];

    for (let i = 0; i < projectStyle.length; i++) {
      moduleArray.push(<Option key={projectStyle[i].projectStyle}>{projectStyle[i].projectStyle}</Option>);
    }

    for (let i = 0; i < projectLevel.length; i++) {
      projectLevelArray.push(<Option key={projectLevel[i].level}>{projectLevel[i].level}</Option>);
    }

    const feed_lines666 = editData.strategyProjectDto.relates == null ? [] : editData.strategyProjectDto.relates;
    if (feed_lines666.length > 0) {
      for(let i=0;i<feed_lines666.length;i++){
        feed_lines666[i].index = i+1;
        feed_lines666[i].key = i+1;
      }
    }

    this.setState({
      feedLines: feed_lines666
    })

    const Data = new Date().toLocaleString();

    const year = new Date().getFullYear();

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
              <Col span={3}>{contact.userStatue}</Col>
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
                    {...this.getExtableProps()}
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
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <Button type="primary" size="large" style={{ marginRight: '20px', background: '#409EFF', border: '1px solid #409EFF' }}>
                模板下载
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ marginRight: '20px', background: '#67C23A', border: '1px solid #67C23A' }}
              >
                新建
              </Button>
              <Button type="primary" size="large" style={{ marginRight: '20px', background: '#67C23A', border: '1px solid #67C23A' }}>
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
        </Form>


        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Button type="primary" size="large" style={{ margin: '20px' }}>
            下载
          </Button>

          <Button
            type="primary"
            size="large"
            style={{ margin: '20px', background: '#E6A23C', border: '1px solid #E6A23C' }}
          >
            打印
          </Button>
          <Button onClick={this.handAdd} type="primary" size="large" style={{ margin: '20px', background: '#909399', border: '1px solid #909399' }}>
            保存
          </Button>
          <Button type="primary" size="large" style={{ margin: '20px' }}>
            提交
          </Button>

        </div>
      </ExtModal>
    );
  }
}

export default FormModal;
