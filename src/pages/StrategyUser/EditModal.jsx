import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { ComboList, ExtModal } from 'suid';
import { constants } from '@/utils';
const { SERVER_PATH } = constants;

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
    const { form, editData, onClose, saving, visible,styleList,moduleList } = this.props;
    const { getFieldDecorator } = form;
    const title = editData ? '编辑' : '新增';

    const employeeProps = {
      placeholder: '根据工号或者姓名搜索！',
      width: 600,
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
      searchPlaceHolder: '根据工号或者姓名搜索！',
      afterClear: () =>form.setFieldsValue({}),
      afterSelect: item => 
        form.setFieldsValue({userCode:item.code,userName:item.userName,department:item.organizationName,userId:item.id,
        userStatue:item.frozen===false?'在职':'离职',}),
      store: {
        type: 'post',
        url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
      },
      reader: {
        name: 'userName',
        description: 'organizationName',
        field: ['id', 'code', 'userName'],
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
        onOk={this.handleSave}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="模块Code" style={{display:'none'}}>
            {
            getFieldDecorator('moduleCode', {
              initialValue: editData && editData.moduleCode,
              rules: [
                {
                  required: true,
                  message: '模块Code不能为空',
                },
                {
                  max: 10,
                  message: '代码不能超过5个字符',
                },
              ],
            })(<Input disabled={saving} />)}
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

          <FormItem label="style" style={{display:'none'}}>
            {getFieldDecorator('style', {
              initialValue: editData && editData.style,
              rules: [
                {
                  required: true,
                  message: 'style不能为空',
                },
              ],
            })(<Input disabled={!saving || !editData} />)}
          </FormItem>

          <FormItem label="人员类别">
            {getFieldDecorator('styleName', {
              initialValue: editData && editData.styleName,
              rules: [
                {
                  required: true,
                  message: '人员类别不能为空',
                },
              ],
            })(
              <ComboList
                showSearch={false}
                pagination={false}
                dataSource={styleList}
                disabled={saving}
                afterSelect={(item)=>{
                  form.setFieldsValue({
                    styleName:item.dataName,
                    style:item.dataValue,
                  })
                }}
                reader={{
                  name: 'dataName',
                }}
              />
            )}
          </FormItem>

          <FormItem label="userId" style={{display:'none'}}>
            {getFieldDecorator('userId', {
              initialValue: editData && editData.userId,
              rules: [
                {
                  required: true,
                  message: 'userId不能为空',
                },
              ],
            })(<Input disabled={!saving || !editData} />)}
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
            })(<Input disabled={!saving || !editData} />)}
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
            })(<ComboList {...employeeProps}/>)}
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
            })(<Input disabled={!saving || !editData} />)}
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
            })(<Input disabled={!saving || !editData} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
