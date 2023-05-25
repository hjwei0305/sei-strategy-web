/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const {PROJECT_PATH,LOCAL_PATH} = constants;
const contextPath = '/strategyProjectLevel';


/** 保存 */
export async function save(data) {
  const url = `${PROJECT_PATH}${contextPath}/save`;

  return request.post(url, data);
}

/** 删除 */
export async function del(params) {
  const url = `${PROJECT_PATH}${contextPath}/delete/${params.id}`;
  return request.delete(url);
}

export async function findByPage(params) {
  const url = `${PROJECT_PATH}${contextPath}/findByPage`;
  return request.post(url, params);
}

export async function downloadTemplate(params) {
  const url = `${LOCAL_PATH}/templates/项目级别导入模版.xlsx`;
  return request({
    url,
    method: 'get',
    responseType: 'blob', });
}

export async function uploadStrategyProjectLevel(data) {
  const url = `${PROJECT_PATH}${contextPath}/uploadStrategyProjectLevel`;
  return request.post(url, data);
}
