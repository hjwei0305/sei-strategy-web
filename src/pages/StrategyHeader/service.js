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
const contextPath = '/strategyHeaderApi';


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


/** 查询员工所有信息 */
export async function findByCode(param) {
  const url = `${SERVER_PATH}/sei-basic/employee/findByCode?code=${param.code}`;
  return request.get(url);
}
//-------------------项目start-------------------
/** 项目保存 */
export async function projectSave(data) {
  const url = `${PROJECT_PATH}/strategyProject/save`;
  return request.post(url, data);

}

/** 下载模板 */
export async function downloadTemplate() {
  const url = `${LOCAL_PATH}/templates/行动计划导入模版.xlsx`;
  return request({
    url,
    method: 'get',
    responseType: 'blob', 
  });
}

/** 导入 */
export async function uploadStrategyProjectPlans(params) {
  const url = `${PROJECT_PATH}${contextPath}/uploadStrategyProjectPlans`;
  return request.post(url, params);
}

export async function submitProject(params) {
  const url = `${PROJECT_PATH}/strategyProject/submitProject`;
  return request.post(url, params);
}


//-------------------项目end---------------------


