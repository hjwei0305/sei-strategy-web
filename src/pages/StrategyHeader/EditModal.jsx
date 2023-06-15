import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { ExtModal, ComboList } from 'suid';
import { constants } from '@/utils';
const { PROJECT_PATH } = constants;
const { ComboMultiList } = ComboList;


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {

  handleSave = () => {
    const { form, onSave, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData, formData);
      for(var i=0;i<params.strategyAnalyzeBillDto.projectDtoList.length;i++){
        params.strategyAnalyzeBillDto.projectDtoList[i].name = params['name'+i];
      }
      params.strategyAnalyzeBillDto.description = params.description;
      if(params.strategyAnalyzeBillDto.projectDtoList.length > 1){
        if(params.strategyCodes && params.strategyCodes.length > 0){
          alert('多个项目只能不可再选经营策略！');
          return;
        }
      }
      if (onSave) {
        onSave(params);
      }
    });
  };

  clearProjects = () => {
    const { form, editData } = this.props;
    console.log(form);
    const projectDtoList = editData.strategyAnalyzeBillDto.projectDtoList;
    console.log(projectDtoList);
    projectDtoList.splice(1, projectDtoList.length);
    form.setFieldsValue({ projectDtoList });
  };

  handAdd = () => {
    const {  addProject, editData } = this.props;
    addProject(editData);
  };

  render() {
    const { form, editData, onClose, saving, visible,user } = this.props;
    const { getFieldDecorator } = form;
    const title = '关联项目';

    const projectDtoList = editData.strategyAnalyzeBillDto.projectDtoList || [{name:''}];
    editData.strategyAnalyzeBillDto.projectDtoList = projectDtoList;


    const filters = [];
    filters.push({
      fieldName: 'stage',
      operator: 'EQ',
      fieldType: 'String',
      value: 'relevancy',
    });
    filters.push({
      fieldName: 'code',
      operator: 'NE',
      fieldType: 'String',
      value: editData.strategyAnalyzeBillDto.code,
    });

    const followProps = {
      placeholder: '请选择经营策略',
      form,
      width: 600,
      name: 'strategyCodes',
      field: ['strategyCodes'],
      store: {
        type: 'post',
        url: `${PROJECT_PATH}/strategyAnalyzeBill/findByPage`,
        params: {filters},
      },
      searchPlaceHolder: '请选择经营策略',
      ListProps:'vertical',
      allowClear: true,
      remotePaging: true,
      rowKey: 'id',
      showSearch: true,
      pagination: true,
      searchProperties: ['code', 'strategyName'],
      reader: {
        name: 'code',
        description: 'strategyName',
        field: ['code'],
      },
    };
    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        width={1200}
        onOk={this.handleSave}
        footer={null}
      >
        <Form {...formItemLayout} layout="horizontal">
          <Row gutter={24} justify="space-around">
            <Col span={24}>
              <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label="单 号">
                {getFieldDecorator('code', {
                  initialValue: editData && editData.strategyAnalyzeBillDto.code,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} justify="space-around">
            <Col span={24}>
            <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label="所属单位：">
                {getFieldDecorator('organizationName', {
                  initialValue: user && user.organizationName,
                })(<Input style={{with:'2000'}} readOnly />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} justify="space-around">
            <Col span={24}>
              <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label="经营策略项目">
                {getFieldDecorator('strategyCodes', {
                })(<ComboMultiList {...followProps}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label='描  述' >
                {getFieldDecorator('description', {
                  initialValue: editData && editData.strategyAnalyzeBillDto.description,
                  rules: [
                    {
                      required: true,
                      message: '问题描述不能为空',
                    },
                  ],
                })(<Input.TextArea />)}
              </FormItem>
            </Col>
          </Row>
         {projectDtoList.map((i,index) => {
            return(
              <Row gutter={24} justify="space-around">
                <Col span={24}>
                  <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label="关联项目名称" >
                    {getFieldDecorator('name'+index, {
                      initialValue: projectDtoList && projectDtoList[index].name,
                      rules: [
                        {
                          required: true,
                          message: '项目名称不能为空',
                        },
                      ],
                    })(<Input.TextArea  />)}
                  </FormItem>
                </Col>
              </Row>
            )
         })}
         <Row gutter={24} justify="space-around">
            <Col span={16}>
            </Col>
            <Col span={8}>
              <Button type="primary" onClick={this.handAdd}>
                添加项目
              </Button>
              <span style={{width:'20px',display:'inline-block'}}></span>
              <Button onClick={this.clearProjects}>
                清空项目
              </Button>
              <span style={{width:'20px',display:'inline-block'}}></span>
              <Button type="primary" onClick={this.handleSave}>
                保存
              </Button>
              <span style={{width:'20px',display:'inline-block'}}></span>
              <Button onClick={onClose}>
                取消
              </Button>
            </Col>
          </Row>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
