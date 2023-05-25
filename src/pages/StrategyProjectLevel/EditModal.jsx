import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ExtModal } from 'suid';

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
    const { form, editData, onClose, saving, visible } = this.props;
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
          <FormItem label="级别">
            {getFieldDecorator('level', {
              initialValue: editData && editData.level,
              rules: [
                {
                  required: true,
                  message: '级别不能为空',
                }
              ],
            })(<Input disabled={ saving} />)}
          </FormItem>
          <FormItem label="代码">
            {getFieldDecorator('code', {
              initialValue: editData && editData.code,
              rules: [
                {
                  required: true,
                  message: '代码不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="实施范围">
            {getFieldDecorator('scope', {
              initialValue: editData && editData.scope,
              rules: [
                {
                  required: true,
                  message: '实施范围不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="产品线">
            {getFieldDecorator('productLine', {
              initialValue: editData && editData.productLine,
              rules: [
                {
                  required: true,
                  message: '产品线不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="重点关注项目">
            {getFieldDecorator('importantProject', {
              initialValue: editData && editData.importantProject,
              rules: [
                {
                  required: true,
                  message: '公司重点关注项目不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="运行阶段">
            {getFieldDecorator('stage', {
              initialValue: editData && editData.stage,
              rules: [
                {
                  required: true,
                  message: '运行阶段不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
