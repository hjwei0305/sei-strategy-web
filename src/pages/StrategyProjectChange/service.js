/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH } = constants;
const contextPath = '/strategyProjectChange';

/** 分页查询 */
export async function findByPage(params) {
  const url = `${PROJECT_PATH}${contextPath}/findByPage`;
  return request.post(url, params);
}
