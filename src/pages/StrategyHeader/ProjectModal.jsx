import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Popconfirm } from 'antd';
import { ExtModal, ExtTable, Space, ExtIcon, utils, ComboList } from 'suid';
import { constants, exportXlsx } from '@/utils';
const { PROJECT_PATH } = constants;
const { request } = utils;

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
class ProjectModal extends PureComponent {

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
        const { form, visible, onCancel, editData, loading, projectList, strategyList } = this.props;
        const { getFieldDecorator } = form;
        console.log(editData);
        const { strategyAnalyzeBillDto } = editData;
        const { projectDtoList } = strategyAnalyzeBillDto;
        const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            width: 200,
            render: (text, record, index) => {
            return (
                <FormItem>
                {getFieldDecorator(`name${index}`, {
                    initialValue: text,
                    rules: [
                    {
                        required: true,
                        message: '请输入项目名称',
                    },
                    ],
                })(<Input placeholder="请输入项目名称" />)}
                </FormItem>
            );
            },
        },
        {
            title: '经营策略',
            dataIndex: 'strategyCode',
            width: 200,
            render: (text, record, index) => {
            return (
                <FormItem>
                {getFieldDecorator(`strategyCode${index}`, {
                    initialValue: text,
                    rules: [
                    {
                        required: true,
                        message: '请选择经营策略',
                    },
                    ],
                })(
                    <ComboList
                    placeholder="请选择经营策略"
                    url={`${PROJECT_PATH}/strategy/list`}
                    params={{ status: 1 }}
                    valueKey="code"
                    labelKey="name"
                    />
                )}
                </FormItem>
            );
            },
        },
        {
            title: '操作',
            width: 100,
            render: (text, record, index) => {
            return (
                <Space>
                <ExtIcon
                    type="delete"
                    onClick={() => {
                    projectDtoList.splice(index, 1);
                    form.setFieldsValue({ projectDtoList });
                    }}
                />
                </Space>
            );
            },
        },
        ];

        return (
        <ExtModal
            visible={visible}
            title="项目信息"
            width={800}
            onCancel={onCancel}
            fullScreen={true}
            footer={[
            <Button key="back" onClick={onCancel}>
                取消
            </Button>,
            <Button key="save" type="primary" loading={loading} onClick={this.handleSave}>
                保存
            </Button>,
            ]}
        >
            <Form>
            <FormItem label="项目描述">
                {getFieldDecorator('description', {
                initialValue: strategyAnalyzeBillDto.description,
                })(<Input.TextArea placeholder="请输入项目描述" />)}
            </FormItem>
            <FormItem label="项目列表">
                <ExtTable
                rowKey="id"
                columns={columns}
                dataSource={projectDtoList}
                pagination={false}
                />
                <Button type="primary" onClick={this.handAdd}>
                新增
                </Button>
                <Popconfirm title="是否清空项目列表？" onConfirm={this.clearProjects}>
                <Button type="danger">清空</Button>
                </Popconfirm>
            </FormItem>
            </Form>
        </ExtModal>
        );
    }
}

export default ProjectModal;