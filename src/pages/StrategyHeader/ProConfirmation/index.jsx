import React, { PureComponent } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Input, Col, Row, Select, Upload, Steps, Button, Icon, Form, DatePicker } from 'antd';
import { ExtModal } from 'suid';
import style from './index.less';

@withRouter
@connect(({ proConfirmation, loading }) => ({ proConfirmation, loading }))
class ProConfirmation extends PureComponent {


  render() {
    const { visible, onClose } = this.props;

    const items = [{
      userCode: '380889',
      userName: '苏浠静',
      bumen: '数字化',
      zhuangtai: '在职'
    },
    {
      userCode: '456355',
      userName: '你妹',
      bumen: '靠',
      zhuangtai: '在职'
    },
    {
      userCode: '551225',
      userName: '傻逼',
      bumen: '真的傻逼',
      zhuangtai: '离职'
    }
    ];
    const { Step } = Steps;
    const StepTitle = '王小明';
    const StepTitle2 = '待审核';

    const Option = Select.Option;

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    const Data = new Date().toLocaleString();

    const props = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log(file, fileList);
        }
      },
      defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/xxx.png',
        },
        {
          uid: '2',
          name: 'yyy.png',
          status: 'done',
          url: 'http://www.baidu.com/yyy.png',
        },
        {
          uid: '3',
          name: 'zzz.png',
          status: 'error',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/zzz.png',
        },
      ],
    };

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        title="2023年度经营策略项目提报申请表(项目确认)"
        centered
        maskClosable={false}
        fullScreen
        footer={null}
        keyboard
        className={style.container}
      >
        <div className={style.PageClass}>
          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <span className={style.titleText}>项目提交</span>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>工号</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>模块对接人</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>部门</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>人员状态</Col>
              <Col span={3}>系统自动带出</Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*项目名称</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*工号</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*项目负责人</Col>
              <Col span={3}>
                <Select
                  mode="multiple"
                  placeholder="必填且支持多选"
                  defaultValue={['a10', 'c12']}
                  onChange={handleChange}
                >
                  {children}
                </Select>
              </Col>
              <Col span={3}>*所属模块</Col>
              <Col span={3}>
                <Select
                  mode="multiple"
                  placeholder="必填且支持多选"
                  defaultValue={['a10', 'c12']}
                  onChange={handleChange}
                >
                  {children}
                </Select>
              </Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*项目层级</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*项目类别</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*项目编号</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>提交日期</Col>
              <Col span={3}>{Data}</Col>
            </Row>
            <Row
              align="middle"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ height: '6rem' }}
            >
              <Col span={3}>*此项目所匹配的经营策略</Col>
              <Col span={9}>
              </Col>
              <Col span={3}>*项目内容</Col>
              <Col span={9}>
                <Input.TextArea placeholder="叫你写就写，哪来那么多B话" />
              </Col>
            </Row>
            <Row
              align="middle"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ height: '6rem' }}
            >
              <Col span={3}>*项目意义</Col>
              <Col span={9}>
                <Input.TextArea placeholder="叫你写就写，哪来那么多B话" />
              </Col>
              <Col span={3}>*项目目标</Col>
              <Col span={9}>
                <Input.TextArea placeholder="叫你写就写，哪来那么多B话" />
              </Col>
            </Row>
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>相关方</div>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={2}>序号</Col>
              <Col span={5}>相关方工号</Col>
              <Col span={5}>相关方姓名</Col>
              <Col span={5}>部门</Col>
              <Col span={4}>人员状态</Col>
              <Col span={3}>操作</Col>
            </Row>
            {items.map((item, index) => (
              <Row key={index} align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={2}>{index + 1}</Col>
                <Col span={5}>{item.userCode}</Col>
                <Col span={5}>{item.userName}</Col>
                <Col span={5}>{item.bumen}</Col>
                <Col span={4}>{item.zhuangtai}</Col>
                <Col span={3}>操作</Col>
              </Row>
            ))}

          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>行动计划</div>
            </div>
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <Button type="primary" size="large" style={{ marginRight: '10px', background: '#409EFF', border: '1px solid #409EFF' }}>
                模板下载
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ marginRight: '10px', background: '#67C23A', border: '1px solid #67C23A' }}
              >
                新建
              </Button>
              <Button type="primary" size="large" style={{ marginRight: '10px', background: '#67C23A', border: '1px solid #67C23A' }}>
                导入
              </Button>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>序号</Col>
              <Col span={3}>操作</Col>
              <Col span={3}>月份</Col>
              <Col span={3}>*里程碑事件</Col>
              <Col span={3}>*责任人</Col>
              <Col span={3}>*预计完成时间</Col>
              <Col span={3}>*交付物</Col>
              <Col span={3}>*交付物是否设计财务数据</Col>
            </Row>
            {items.map((item, index) => (
              <Row key={index} align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={3}>{index + 1}</Col>
                <Col span={3}>{item.userCode}</Col>
                <Col span={3}>{item.userName}</Col>
                <Col span={3}>{item.bumen}</Col>
                <Col span={3}>{item.zhuangtai}</Col>
                <Col span={3}>操作</Col>
                <Col span={3}>*交付物</Col>
                <Col span={3}>*交付物是否设计财务数据</Col>
              </Row>
            ))}
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>运营策略管理组确认</div>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>工号</Col>
              <Col span={3}>380889</Col>
              <Col span={3}>姓名</Col>
              <Col span={3}>苏浠静</Col>
              <Col span={3}>部门</Col>
              <Col span={3}>数字化</Col>
              <Col span={3}>日期</Col>
              <Col span={3}>{Data}</Col>
            </Row>

            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*确认结果</Col>
              <Col span={3}>  <Select
                defaultValue="是" allowClear
                onChange={handleChange}
              >
                {children}
              </Select></Col>
              <Col span={3}>*确认类别</Col>
              <Col span={3}>  <Select
                defaultValue="是" allowClear
                onChange={handleChange}
              >
                {children}
              </Select></Col>
              <Col span={3}>*问题点</Col>
              <Col span={9}> <Input.TextArea placeholder="叫你写就写，哪来那么多B话" /></Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>补充说明</Col>
              <Col span={21}><Input.TextArea placeholder="叫你写就写，哪来那么多B话" /></Col>
            </Row>
          </div>

          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>资料初审</div>
            </div>



            <div className={style.fromClass}>
              <Form>
                <div>
                  <span style={{ display: "inline-block" }}>是否通过：</span>
                  <Select>
                    <Select.Option value="demo">Demo</Select.Option>
                  </Select>
                </div>
                <div style={{ display: "inline-block" }}>
                  工号：<Input />
                  经营策略管理组：<Input />
                  日期：<DatePicker />
                </div>
                <div>
                  *审核意见附件上传：
                  <Button type="primary" size="small" style={{ margin: '10px', background: '#409EFF', border: '1px solid #409EFF' }}>浏 览</Button>
                  <Upload {...props}>
                    <Button type="primary" size="small" style={{ margin: '10px', background: '#67C23A', border: '1px solid #67C23A' }}>
                      <Icon type="upload" />上传文件
                    </Button>
                  </Upload>
                </div>

              </Form>


            </div>

          </div>




          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <div className={style.titleText}>审核、审批</div>
            </div>

            <Steps direction="vertical" current={1} className={style.stepsClass}>
              <Step title={`${StepTitle}  ${StepTitle2}`} subTitle="2023-03-29" />
              <Step
                title={`${StepTitle}  ${StepTitle2}`}
                description="审批意见：XXXXXXXXXX"
                subTitle="2023-03-29"
              />
              <Step
                title={`${StepTitle}  ${StepTitle2}`}
                description="审批意见：XXXXXXXXXX"
                subTitle="2023-03-29"
              />
              <Step
                title={`${StepTitle}  ${StepTitle2}`}
                description="审批意见：XXXXXXXXXX"
                subTitle="2023-03-29"
              />
            </Steps>
          </div>



        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Button type="primary" size="large" style={{ margin: '10px', background: 'grey', border: '1px solid grey' }}>
            保存
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ margin: '10px', background: 'red', border: '1px solid red' }}
          >
            退回
          </Button>
          <Button type="primary" size="large" style={{ margin: '10px' }}>
            提交
          </Button>
        </div>
      </ExtModal>
    );
  }
}

export default ProConfirmation;
