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
          <FormItem label="模块">
            {getFieldDecorator('module', {
              initialValue: editData && editData.module,
              rules: [
                {
                  required: true,
                  message: '模块不能为空',
                },
                {
                  max: 10,
                  message: '代码不能超过5个字符',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <ComboList 
            style={{ width: '300px',marginLeft:'120px' }}
            showSearch={false}
            pagination={false}
            url="/api/strategyUser/getModuleList"
            valueField="module"
            displayField="module"
            name="module"
            value={editData && editData.module}
            rules={[
              {
                required: true,
                message: '模块不能为空',
              },
            ]}
            disabled={saving}
          />
          <FormItem label="人员类别">
            {getFieldDecorator('style', {
              initialValue: editData && editData.style,
              rules: [
                {
                  required: true,
                  message: '人员类别不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="工  号">
            {getFieldDecorator('userCode', {
              initialValue: editData && editData.userCode,
              rules: [
                {
                  required: true,
                  message: '工号不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="姓  名">
            {getFieldDecorator('userName', {
              initialValue: editData && editData.userName,
              rules: [
                {
                  required: true,
                  message: '姓名不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="部  门">
            {getFieldDecorator('department', {
              initialValue: editData && editData.department,
              rules: [
                {
                  required: true,
                  message: '部门不能为空',
                },
              ],
            })(<Input disabled={saving} />)}
          </FormItem>
          <FormItem label="人事状态">
            {getFieldDecorator('userStatue', {
              initialValue: editData && editData.userStatue,
              rules: [
                {
                  required: true,
                  message: '人事状态不能为空',
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
