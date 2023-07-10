/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { del, save, findByCode, downloadTemplate, uploadStrategyProjectScheme } from './service';
import { downFile } from '@/utils';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'strategyProjectScheme',

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
    *downloadTemplate({ payload }, { call }) {
      console.log(payload.type)
      const ds = yield call(downloadTemplate);
      if (ds.success) {
        downFile(ds.data,'项目周期配置导入模版.xlsx');
      }
    },
    *uploadStrategyProjectScheme({ payload }, { call }) {
      const result = yield call(uploadStrategyProjectScheme, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }
      return result;
    }
  },
});
