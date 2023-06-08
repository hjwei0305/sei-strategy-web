import React, { PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { ExtModal, ComboList } from 'suid';

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
    const title = '关联项目';

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
      >
        <Form {...formItemLayout} layout="horizontal">
          <Row gutter={24} justify="space-around">
            <Col span={8}>
              <FormItem label="单 号">
                {getFieldDecorator('code', {
                  initialValue: editData && editData.code,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="所属单位：">
                {getFieldDecorator('projectCode', {
                  initialValue: editData && editData.projectCode,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} justify="space-around">
            <Col span={8}>
              <FormItem label="工   号">
                {getFieldDecorator('jobNumber', {
                  initialValue: editData && editData.jobNumber,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="责任人">
                {getFieldDecorator('userName', {
                  initialValue: editData && editData.userName,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="职   位">
                {getFieldDecorator('position', {
                  initialValue: editData && editData.position,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} justify="space-around">
            <Col span={8}>
              <FormItem label="工   号">
                {getFieldDecorator('creatorAccount', {
                  initialValue: editData && editData.creatorAccount,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="提单人">
                {getFieldDecorator('creatorName', {
                  initialValue: editData && editData.creatorName,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="职   位">
                {getFieldDecorator('creatorPosition', {
                  initialValue: editData && editData.creatorPosition,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} justify="space-left">
            <Col span={24}>
              <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label="经营策略项目">
                {getFieldDecorator('description', {
                  initialValue: editData && editData.description,
                  rules: [
                    {
                      required: true,
                      message: '问题描述不能为空',
                    },
                  ],
                })(<ComboList />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label='描  述' >
                {getFieldDecorator('description', {
                  initialValue: editData && editData.description,
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
          <Row gutter={24} justify="space-left">
            <Col span={24}>
              <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label="关联项目名称：">
                {getFieldDecorator('description', {
                  initialValue: editData && editData.description,
                  rules: [
                    {
                      required: true,
                      message: '问题描述不能为空',
                    },
                  ],
                })(<Input.TextArea  />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
