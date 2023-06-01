/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, findByPage, getProOpt, downloadTemplate, uploadStrategyUser } from './service';
import { downFile } from '@/utils';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'strategyUser',

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
    *findByPage({ payload }, { call }) {
      const result = yield call(findByPage, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }
      return result;
    },
    *getProOpt({ payload }, { call }) {
      const result = yield call(getProOpt, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }
      return result;
    },
    *downloadTemplate({ payload }, { call }) {
      console.log(payload.type)
      const ds = yield call(downloadTemplate);
      if (ds.success) {
        downFile(ds.data,'策略用户导入模版.xlsx');
      }
    },
    *uploadStrategyUser({ payload }, { call }) {
      const result = yield call(uploadStrategyUser, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }
      return result;
    }
  },
});
