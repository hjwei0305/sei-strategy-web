/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, findByCode, projectSave, downloadTemplate, uploadStrategyProjectPlans, submitProject } from './service';
import { downFile } from '@/utils';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'strategyHeader',

  state: {
    editData: null,
    modalVisible: false,
  },
  effects: {
    *save({ payload }, { call }) {
      const result = yield call(save, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *del({ payload }, { call }) {
      const result = yield call(del, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *findByCode({ payload }, { call }) {
      const result = yield call(findByCode, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }
      return result;
    },
    // --------------------------      project  start    --------------------------
    *projectSave({ payload }, { call }) {
      const result = yield call(projectSave, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }

      return result;
    },
    *downPlansTemplate({ payload }, { call }) {
      debugger
      const ds = yield call(downloadTemplate);
      if (ds.success) {
        downFile(ds.data,'行动计划导入模版.xlsx');
      }
    },
    *uploadStrategyProjectPlans({ payload }, { call }) {
      const result = yield call(uploadStrategyProjectPlans, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      return result;
    },

    *submitProject({ payload }, { call }) {
      const result = yield call(submitProject, payload);
      const { success, message: msg } = result || {};

      message.destroy();
      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
      
      return result;
    },
    // --------------------------      project  end     --------------------------
  },
});
