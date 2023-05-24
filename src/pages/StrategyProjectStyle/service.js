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
const contextPath = '/strategyProjectStyle';


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

/** 查询 */
export async function findByPage(params) {
  const url = `${PROJECT_PATH}${contextPath}/findByPage`;
  return request.post(url, params || {});
}

/** 导入模版下载 */
export async function downloadTemplate() {
  const url = `${LOCAL_PATH}/templates/项目类型导入模版.xlsx`;
  return request({
    url,
    method: 'get',
    responseType: 'blob', });
}

/** 导入 */
export async function uploadStrategyProjectStyle(data) {
  const url = `${PROJECT_PATH}${contextPath}/uploadStrategyProjectStyle`;
  return request.post(url, data);
}
