import { loginByEmail, logout, getInfo, login} from 'api/login';
import Cookies from 'js-cookie';
import axios from 'axios'
const user = {
  state: {
    user: '',
    status: '',
    email: '',
    code: '',
    uid: undefined,
    auth_type: '',
    token: Cookies.get('Admin-Token'),
    name: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_AUTH_TYPE: (state, type) => {
      state.auth_type = type;
    },
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_EMAIL: (state, email) => {
      state.email = email;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    // 邮箱登录
    async Login({commit}, userInfo){
      // console.log('userInfo: ', userInfo); // 就是account + password
      // const account = userInfo.account.trim();
      // console.log('account: ', account);
      let resp = await axios({
        method: 'POST',
        url: 'http://localhost:9105/login',
        data: {
          account : userInfo.account.trim(),
          password: userInfo.password.trim(),
        },
        transformRequest: [function(data){
          let ret = '';
          for (let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }]});
      console.log("resp: ", resp);
      if(resp.data.status === 0){
        console.log("trigger set token!: ", resp.data);
        Cookies.set('Admin-Token', resp.data.token);
        commit('SET_TOKEN', resp.data.token);
        commit('SET_EMAIL', resp.data.email);
        commit('SET_NAME', resp.data.account);
      }else{
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        alert("has logout");
      }
      return resp;
    },
    async registerRoleInfo({commit}, userInfo){
        let resp = await axios({
          method: "POST",
          url: "http://localhost:9105/registerRoleInfo",
          data: {
            account: userInfo.account.trim(),
            password: userInfo.password.trim(),
            email: userInfo.email.trim(),
          },
          transformRequest: [function(data){
            let ret = '';
            for (let it in data){
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
          }]});
        console.log("registerRoleInfo resp: ", resp);
      let resp2 = await axios({
        method: 'POST',
        url: 'http://localhost:9105/login',
        data: {
          account : userInfo.account.trim(),
          password: userInfo.password.trim(),
        },
        transformRequest: [function(data){
          let ret = '';
          for (let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }]});
      console.log("login resp: ", resp2);
      if(resp2.data.status === 0){
        console.log("set token !!!:, ", resp2.data.token);
        Cookies.set('Admin-Token', resp2.data.message);
        commit('SET_TOKEN', resp2.data.token);
        commit('SET_EMAIL', resp2.data.email);
      }else{
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        alert("has logout");
      }
      return resp2;
    },
    LoginByEmail({ commit }, userInfo) {
      const account = userInfo.account.trim();
      return new Promise((resolve, reject) => {
        fetch({
          url: 'localhost:9100',
          method: 'get'
        }).then(function(response){
          console.log('resp: ', response);
        })
        // loginByEmail(account, userInfo.password).then(response => {
        //   const data = response.data;
        //   console.log(response.data);
        //   Cookies.set('Admin-Token', response.data.token);
        //   commit('SET_TOKEN', data.token);
        //   commit('SET_EMAIL', account);
        //   resolve();
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },

  async getEmailVerifyCode({commit, state}, email){
      let resp = await axios({
        method: 'POST',
        url: 'http://localhost:9105/getEmailVerifyCode',
        data: {
          email: email
        },
        transformRequest: [function(data){
          let ret = '';
          for (let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }]});
      return resp;
  },
    async getRegistedEmail(){
      let resp = await axios({
        method: 'POST',
        url: 'http://localhost:9105/getRegistedEmail',
        transformRequest: [function(data){
          let ret = '';
          for (let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }]});
      return resp;
    },
    // 获取用户信息
    async GetInfo({ commit, state }) {
      console.log("state.token: ", Cookies.get('Admin-Token'))
      let resp = await axios({
        method: 'POST',
        url: 'http://localhost:9105/getRoleInfo',
        data: {
          token: state.token
        },
        transformRequest: [function(data){
          let ret = '';
          for (let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }]});
      const data = resp.data;
      console.log("getinfo data: ", data);
      if(data.status !== 0){
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        alert("has logout");
      }else {
        commit('SET_ROLES', ["admin"]);
        commit('SET_NAME', data.name);
        commit('SET_UID', data.uid);
      }
      return resp;
      // return new Promise((resolve, reject) => {
      //   getInfo(state.token).then(response => {
      //     const data = response.data;
      //     commit('SET_ROLES', data.role);
      //     commit('SET_NAME', data.name);
      //     commit('SET_AVATAR', data.avatar);
      //     commit('SET_UID', data.uid);
      //     commit('SET_INTRODUCTION', data.introduction);
      //     resolve(response);
      //   }).catch(error => {
      //     reject(error);
      //   });
      // });
    },

    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
          commit('SET_TOKEN', response.data.token);
          Cookies.set('Admin-Token', response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          Cookies.remove('Admin-Token');
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        alert("用户信息过期，或系统错误");
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        Cookies.set('Admin-Token', role);
        resolve();
      })
    }
  }
};

export default user;
