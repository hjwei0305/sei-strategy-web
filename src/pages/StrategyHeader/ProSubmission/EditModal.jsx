import React, { PureComponent } from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Input, Col, Row, Select, Radio, Steps, Button, Calendar, } from 'antd';
import { ExtModal, ComboList } from 'suid';

import style from './index.less';
import { constants } from '@/utils';
const { SERVER_PATH } = constants;
const { ComboMultiList } = ComboList;

@withRouter
@connect(({ proSubmission, loading }) => ({ proSubmission, loading }))
class ProSubmission extends PureComponent {

  state = {
    formData: {}
  }

  handAdd = () => {
    const { form, onSave, editData } = this.props;

  };

  render() {
    const { visible, onClose, editData, projectStyle } = this.props;

    const followProps = {
      placeholder: '请选择产品跟进人',
      width: 600,
      name: 'followNames',
      field: ['followIds','followNums','followNames'],
      store: {
        type: 'post',
        url: `${SERVER_PATH}/sei-basic/employee/queryEmployees`,
      },
      searchPlaceHolder: '请选择产品跟进人',
      ListProps:'vertical',
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
      afterClear: (item) => {
      }
      ,
      afterSelect: item => {
      },
      reader: {
        name: 'userName',
        description: 'organizationName',
        field: ['id', 'code', 'userName'],
      },
    };

    const contact = editData.contacts[0]==null?{}:editData.contacts[0];

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
    const Option = Select.Option;

    const moduleArray = [];
    console.log(projectStyle);
    for (let i = 0; i < projectStyle.length; i++) {
      moduleArray.push(<Option key={projectStyle[i].code}>{projectStyle[i].projectStyle}</Option>);
    }

    const Data = new Date().toLocaleString();

    const year = new Date().getFullYear();

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        title={year+"年度经营策略项目提报申请表(提交项目)"}
        centered
        maskClosable={false}
        fullScreen
        footer={null}
        keyboard
        className={style.container}
      >
        <div className={style.XXX}>
          <div>
            <div className={style.titleBox}>
              <span className={style.titleBlue}> </span>
              <span className={style.titleText}>项目提交</span>
            </div>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>工号</Col>
              <Col span={3}>{contact.userCode}</Col>
              <Col span={3}>模块对接人</Col>
              <Col span={3}>{contact.userName}</Col>
              <Col span={3}>部门</Col>
              <Col span={3}>{contact.department}</Col>
              <Col span={3}>人员状态</Col>
              <Col span={3}>{contact.userStatue}</Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3} style={{color:'#F56C6C'}}>*项目名称</Col>
              <Col span={3}>{editData.strategyProjectDto.name}</Col>
              <Col span={3}>*工号</Col>
              <Col span={3}>系统自动带出</Col>
              <Col span={3}>*项目负责人</Col>
              <Col span={3}>
                <ComboMultiList {...followProps} />
              </Col>
              <Col span={3}>*所属模块</Col>
              <Col span={3}>
                {editData.strategyAnalyzeBillDto.module}
              </Col>
            </Row>
            <Row align="middle" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={3}>*项目层级</Col>
              <Col span={3}>{editData.strategyProjectDto.level}</Col>
              <Col span={3}>*项目类别</Col>
              <Col span={3}>
                <Select
                  mode="multiple"
                  placeholder="必填且支持多选"

                >
                  {moduleArray}
                </Select>
              </Col>
              <Col span={3}>*项目编号</Col>
              <Col span={3}>{editData.strategyProjectDto.code}</Col>
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
                {editData.strategyAnalyzeBillDto.strategyName}
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
              <Button type="primary" size="large" style={{ marginRight: '20px', background: '#409EFF', border: '1px solid #409EFF' }}>
                模板下载
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ marginRight: '20px', background: '#67C23A', border: '1px solid #67C23A' }}
              >
                新建
              </Button>
              <Button type="primary" size="large" style={{ marginRight: '20px', background: '#67C23A', border: '1px solid #67C23A' }}>
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
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Button type="primary" size="large" style={{ margin: '20px' }}>
            下载
          </Button>

          <Button
            type="primary"
            size="large"
            style={{ margin: '20px', background: '#E6A23C', border: '1px solid #E6A23C' }}
          >
            打印
          </Button>
          <Button onClick={this.handAdd} type="primary" size="large" style={{ margin: '20px', background: '#909399', border: '1px solid #909399' }}>
            保存
          </Button>
          <Button type="primary" size="large" style={{ margin: '20px' }}>
            提交
          </Button>

        </div>
      </ExtModal>
    );
  }
}

export default ProSubmission;
