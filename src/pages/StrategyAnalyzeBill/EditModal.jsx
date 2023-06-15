import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';
import { ComboList, ExtModal,YearPicker } from 'suid';

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
    const { form, editData, onClose, saving, visible,  moduleList } = this.props;
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
          <FormItem label="经营策略项目">
            {getFieldDecorator('strategyName', {
              initialValue: editData && editData.strategyName,
              rules: [
                {
                  required: true,
                  message: '经营策略项目不能为空',
                },
              ],
            })(<Input disabled={!!editData || saving} />)}
          </FormItem>
          <FormItem label="年份">
            {getFieldDecorator('year', {
              initialValue: editData && editData.year,
              rules: [
                {
                  required: true,
                  message: '年份不能为空',
                },
              ],
            })(<YearPicker allowClear format="YYYY年" onChange={console.log} />)}
          </FormItem>
          <FormItem label="模块Code" style={{display:'none'}}
          >
            {
            getFieldDecorator('moduleCode', {
              initialValue: editData && editData.moduleCode,
            })(<Input readOnly />)}
          </FormItem>
          <FormItem label="模  块">
            {getFieldDecorator('module', {
              initialValue: editData && editData.module,
              rules: [
                {
                  required: true,
                  message: '模块不能为空',
                },
              ],
            })(<ComboList
                showSearch={false}
                pagination={false}
                dataSource={moduleList}
                disabled={saving}
                afterSelect={(item)=>{
                  form.setFieldsValue({
                    moduleCode:item.code,
                    module:item.module,
                  })
                }}
                reader={{
                  name: 'module',
                  field: ['module'],
                }}
              />
            )}
          </FormItem>
          <FormItem label="阶段" style={{display:'none'}}> 
            {
            getFieldDecorator('stage', {
              initialValue: 'relevancy',
            })(<Input readOnly />)}
          </FormItem>
          <FormItem label="是否开立">
            {getFieldDecorator('state', {
              initialValue: editData && editData.state===1?'1':'0',
            })(
              <Select disabled={editData}>
                <Select.Option value="1">开立</Select.Option>
                <Select.Option value="0">关闭</Select.Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
