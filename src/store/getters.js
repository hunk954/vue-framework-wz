const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  name: state => state.user.name,
  uid: state => state.user.uid,
  email: state => state.user.email,
  auth_type: state => state.user.auth_type,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  siderbar_routers:state => state.permission.siderbar_routers,
  currExperID: state => state.user.currExperID,
};
export default getters
