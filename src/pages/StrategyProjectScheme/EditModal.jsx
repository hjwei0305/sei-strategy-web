import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ComboList, ExtModal } from 'suid';

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
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible,orgName, dateList,user } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';
    
    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="类别">
            {getFieldDecorator('style', {
              initialValue: editData && editData.style,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
                {
                  max: 10,
                  message: '代码不能超过5个字符',
                },
              ],
            })(<Input  />)}
          </FormItem>
          <FormItem label="开始日期">
            {getFieldDecorator('schedule', {
              initialValue: editData && editData.schedule,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<ComboList
              showSearch={false}
              pagination={false}
              dataSource={dateList}
              afterSelect={Item => form.setFieldsValue({ schedule: Item.value })
              }
              placeholder="请选择"
              reader={
                {name:'name',value:'value'}
              }/>)}
          </FormItem>
          <FormItem label="结束日期">
            {getFieldDecorator('scheduleOver', {
              initialValue: editData && editData.scheduleOver,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<ComboList
              showSearch={false}
              pagination={false}
              dataSource={dateList}
              afterSelect={Item => form.setFieldsValue({ scheduleOver: Item.value })
              }
              placeholder="请选择"
              reader={
                {name:'name',value:'value'}
              }/>)}
          </FormItem>
          <FormItem label="工号">
            {getFieldDecorator('userCode', {
              initialValue: (editData && editData.userCode) || user.account,
            })(<Input readOnly />)}
          </FormItem>
          <FormItem label="提交人姓名">
            {getFieldDecorator('submitBy', {
              initialValue: (editData && editData.submitBy) || user.userName,
            })(<Input readOnly />)}
          </FormItem>
          <FormItem label="部门">
            {getFieldDecorator('department', {
              initialValue: (editData && editData.department)|| orgName,
            })(<Input readOnly />)}
          </FormItem>
          <FormItem label="创建时间">
            {getFieldDecorator('createdDate', {
              initialValue: editData && editData.createdDate,
            })(<Input readOnly/>)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
