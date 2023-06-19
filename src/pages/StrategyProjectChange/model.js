/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: zp
 * @Last Modified time: 2020-05-07 10:38:29
 */
import { message } from 'antd';
import { utils } from 'suid';
import { findByPage } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'strategyProjectChange',

  state: {
    editData: null,
    modalVisible: false,
  },
  effects: {
    *findByPage({ payload }, { call, put }) {
      const result = yield call(findByPage, payload);
      const { success, message: msg } = result || {};
      message.destroy();
      if (!success) {
        message.error(msg);
      }
      return result;
    },
  },
});
