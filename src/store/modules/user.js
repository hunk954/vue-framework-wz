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
    avatar: '',
    introduction: '',
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
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
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
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
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
    Login({commit}, userInfo){
      console.log('userInfo: ', userInfo);
      const account = userInfo.account.trim();
      console.log('account: ', account);
      axios({
        method: 'POST',
        url: 'http://localhost:9100/login',
        data: {
          account : account,
          password: userInfo.password.trim()
        },
        transformRequest: [function(data){
          let ret = '';
          for (let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }]}).then(resp => {
        console.log('resp:',resp);
        Cookies.set('Admin-Token', resp.data.message);
        commit('SET_TOKEN', resp.data.message);
        commit('SET_EMAIL', account);
      }).catch(err =>{
        console.log('err',err)
      });
      // let url = 'localhost:9110';
      // let request = new XMLHttpRequest();
      // request.onload = function(){
      //   if(request.status === 200){
      //     console.log('response: ', request);
      //   }
      // }
      // return new Promise(function(resolve, reject){
      //   fetch({
      //     url: 'localhost:9100/',
      //     method: 'get'
      //   }).then(resp => {
      //     return resp;
      //   }).then(json => {
      //     console.log(json);
      //   })
        // login(account, userInfo.password).then(response => {
        //   const data = response.data;
        //   console.log('resp: ',response.data);
        // })
      // });
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


    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data;
          commit('SET_ROLES', data.role);
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.avatar);
          commit('SET_UID', data.uid);
          commit('SET_INTRODUCTION', data.introduction);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
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
        alert("has logout");
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
