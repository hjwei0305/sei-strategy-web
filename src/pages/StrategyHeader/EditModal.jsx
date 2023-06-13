import React, { PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';
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
      if (onSave) {
        onSave(params);
      }
    });
  };

  render() {
    const { form, editData, onClose, saving, visible,user } = this.props;
    const { getFieldDecorator } = form;
    const title = '关联项目';

    console.log(user);

    const followProps = {
      placeholder: '请选择经营策略',
      form,
      width: 600,
      name: 'strategyCode',
      field: ['strategyCode'],
      store: {
        type: 'post',
        url: `${PROJECT_PATH}/strategyAnalyzeBill/findByPage`,
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
                {getFieldDecorator('strategyCode', {
                  initialValue: editData && editData.strategyCode,
                  rules: [
                    {
                      required: true,
                      message: '经营策略不能为空',
                    },
                  ],
                })(<ComboMultiList {...followProps}/>)}
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
          <Row gutter={24} justify="space-around">
            <Col span={24}>
              <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label="关联项目名称：">
                {getFieldDecorator('project', {
                  initialValue: editData && editData.project,
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
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
