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
          <FormItem label="确认结果">
            {getFieldDecorator('verifyResult', {
              initialValue: editData && editData.verifyResult,
              rules: [
                {
                  required: true,
                  message: '确认结果不能为空',
                },
                {
                  max: 20,
                  message: '确认结果不能超过5个字符',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="确认类别">
            {getFieldDecorator('verifyStyle', {
              initialValue: editData && editData.verifyStyle,
              rules: [
                {
                  required: true,
                  message: '确认类别不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="问题点">
            {getFieldDecorator('verifyPoint', {
              initialValue: editData && editData.verifyPoint,
              rules: [
                {
                  required: true,
                  message: '问题点不能为空',
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
