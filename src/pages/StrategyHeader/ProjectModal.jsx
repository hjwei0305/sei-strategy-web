import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Input, Col, Row, Divider, Select, Radio, Steps } from 'antd';
import { ExtModal } from 'suid';
// import { constants, exportXlsx } from '@/utils';
import 'antd/dist/antd.css';
import style from './ProjectModal.less';

// @Form.create()
class ProjectModal extends PureComponent {
  // handleSelect = (value) => {
  // console.log(`selected ${value}`);

  // }

  render() {
    const { visible, onClose } = this.props;
    // const { getFieldDecorator } = form;

    // const data = [
    //     {
    //         title: '项目名称',
    //     },
    //     {
    //         title: '经营策略管理组',
    //     },
    //     {
    //         title: '日期',
    //     },

    // ];

    const items = ['380889', '456355', '551225'];
    const x = items.length * 50;

    const onChange = () => {
      console.log();
    };
    // const description = 'This is a description.';

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        title="2023年度经营策略项目变更申请表"
        centered
        maskClosable={false}
        fullScreen
        footer={null}
        keyboard
        className={style.container}
      >
        <div className={style.XXX}>
          <div>
            <Divider orientation="left">项目基础信息</Divider>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>项目名称</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>项目负责人</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>工号</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>所属模块</Col>
              <Col span={3}>系统自动带出</Col>
            </Row>

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>项目层级</Col>
              <Col span={3}>
                <Select defaultValue="一级">
                  <Select.Option value="0">CNM别选了</Select.Option>
                  <Select.Option value="1">一级</Select.Option>
                  <Select.Option value="2">二级</Select.Option>
                </Select>
              </Col>
              <Col span={3}>项目类别</Col>
              <Col span={3}>
                <Select defaultValue="十二类可选择" allowClear>
                  <Select.Option value="0">CNM别选了</Select.Option>
                  <Select.Option value="1">一</Select.Option>
                  <Select.Option value="2">二</Select.Option>
                </Select>
              </Col>
              <Col span={3}>项目编号</Col>
              <Col span={9}>系统自动带出</Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>申请变更类别</Col>
              <Col span={21}>
                <Select defaultValue="变更" allowClear>
                  <Select.Option value="0">变更NM</Select.Option>
                  <Select.Option value="1">NM 骂你就骂你</Select.Option>
                  <Select.Option value="2">还用选日子？</Select.Option>
                </Select>
              </Col>
            </Row>

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*申请理由</Col>
              <Col span={21}>
                <Select defaultValue="草泥马草泥马草泥马" allowClear>
                  <Select.Option value="0">变更NM</Select.Option>
                  <Select.Option value="1">NM 骂你就骂你</Select.Option>
                  <Select.Option value="2">还用选日子？</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row
              align="middle"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ height: '6rem' }}
            >
              <Col span={3}>对应的经营策略</Col>
              <Col span={21}>
                <Input.TextArea placeholder="叫你写就写，哪来那么多B话" />
              </Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*项目变更内容</Col>
              <Col span={21} align="left">
                <Radio.Group onChange={onChange} style={{ marginLeft: '1rem' }}>
                  <Radio value="1">项目名称</Radio>
                  <Radio value="2">项目内容</Radio>
                  <Radio value="3">项目目标</Radio>
                  <Radio value="4">项目计划</Radio>
                  <Radio value="5">其他</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                span={3}
                style={{ justifyContent: 'end', borderBottom: 'hidden', marginBottom: '-3px' }}
              >
                *项目变更内容说明
              </Col>
              <Col span={3}>*原项目内容</Col>
              <Col span={18} />
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3} style={{ borderTop: 'hidden' }} />
              <Col span={3}>*变更后项目内容</Col>
              <Col span={18} />
            </Row>

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={24} style={{ color: '#409EFF' }}>
                项目提交清单（查看详情）
              </Col>
            </Row>
          </div>

          <div>
            <Divider orientation="left">资料初审</Divider>
            <div style={{ display: 'inline-block', width: '35%' }}>
              <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>项目名称</Col>
                <Col span={12}>系统自动带出</Col>
              </Row>
              <Row
                align="middle"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ height: `${x  }px` }}
              >
                <Col span={12}>*是否需要会签</Col>
                <Col span={12}>
                  <Select defaultValue="是" allowClear style={{ width: '85%' }}>
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="0">否</Select.Option>
                  </Select>
                </Col>
              </Row>
            </div>
            <div style={{ display: 'inline-block', width: '65%' }}>
              <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={4}>经营策略管理组</Col>
                <Col span={8}>系统自动带出</Col>
                <Col span={4}>日期</Col>
                <Col span={8}>系统自动带出</Col>
              </Row>
              {items.map(item => (
                <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={4}>工号</Col>
                  <Col span={4} key={item}>
                    {item}
                  </Col>
                  <Col span={4}>会签人员</Col>
                  <Col span={4}>系统自动带出</Col>
                  <Col span={4}>部门</Col>
                  <Col span={4}>系统自动带出</Col>
                </Row>
              ))}
            </div>
          </div>

          <div>
            <Divider orientation="left">审核、审批</Divider>
            <Steps
              current={1}
              items={[
                {
                  title: 'Finished',
                },
                {
                  title: 'In Progress',
                  subTitle: 'Left 00:00:08',
                },
                {
                  title: 'Waiting',
                },
              ]}
            />
          </div>
        </div>

        {/* <Form>
                    <FormItem label="项目描述">
                      <Input.TextArea placeholder="请输入项目描述" />
                    </FormItem>
                    <FormItem label="项目列表">
                        <ExtTable
                            rowKey="id"
                            columns={columns}

                            pagination={false}
                        />
                        <Button type="primary" onClick={this.handAdd}>
                            新增
                        </Button>
                        <Popconfirm title="是否清空项目列表？" onConfirm={this.clearProjects}>
                            <Button type="danger">清空</Button>
                        </Popconfirm>
                    </FormItem>

                </Form> */}
      </ExtModal>
    );
  }
}

export default ProjectModal;
