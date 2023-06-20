/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:24
 * @Last Modified by: zp
 * @Last Modified time: 2020-04-23 09:48:33
 */
import { utils } from 'suid';
import { constants } from '@/utils';

const { request } = utils;
const { PROJECT_PATH,SERVER_PATH } = constants;
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

/** 分页查询 */
export async function findByPage(params) {
  const url = `${PROJECT_PATH}${contextPath}/findByPage`;
  return request.post(url, params);
}


/** 查询员工所有信息 */
export async function findByCode(param) {
  const url = `${SERVER_PATH}/sei-basic/employee/findByCode?code=${param.code}`;
  return request.get(url);
}