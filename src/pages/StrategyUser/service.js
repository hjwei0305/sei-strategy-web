/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH,SERVER_PATH,LOCAL_PATH } = constants;
const contextPath = '/strategyUser';



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

/** 获取项目下拉框 */
export async function getProOpt() {
  const url = `${SERVER_PATH}/dms/dataDict/getCanUseDataDictValues?dictCode=StrategyUserType`;
  return request({
    url,
    method: 'GET',
  });
}

/** 下载模板 */
export async function downloadTemplate() {
  const url = `${LOCAL_PATH}/templates/策略用户导入模版.xlsx`;
  return request({
    url,
    method: 'get',
    responseType: 'blob', });
}

/** 导入 */
export async function uploadStrategyUser(data) {
  const url = `${PROJECT_PATH}${contextPath}/uploadStrategyUser`;
  return request.post(url, data);
}
