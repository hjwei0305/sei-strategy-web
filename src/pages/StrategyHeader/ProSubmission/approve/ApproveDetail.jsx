import React, { PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { WorkFlow, utils, AuthUrl } from 'suid';
import BillExamine from '@/pages/exFactory/EssDeliveredBill/BillExamine';

const { Approve } = WorkFlow;
const { eventBus } = utils;

@withRouter
class ApproveDetail extends PureComponent {
  /** 提交执行完成后的回调函数 */
  submitComplete = res => {
    if (res.success) {
      const { location } = this.props;
      const { taskId } = location.query;
      eventBus.emit('closeTab', [taskId]);
    }
  };

  onApplyRef = ref => {
    this.applyRef = ref;
  };

  beforeSubmit = () => {
    return new Promise(resolve => {
      this.applyRef.saveGoodsList(res => {
        resolve(res);
      });
    });
  };

  render() {
    const { location } = this.props;
    const { id, taskId, instanceId } = location.query;
    const approveProps = {
      businessId: id,
      taskId,
      instanceId,
      beforeSubmit: this.beforeSubmit,
      submitComplete: this.submitComplete,
    };
    return (
      <AuthUrl>
        <Approve {...approveProps}>
          <BillExamine onApplyRef={this.onApplyRef} action="approve" id={id} />
        </Approve>
      </AuthUrl>
    );
  }
}

export default ApproveDetail;
