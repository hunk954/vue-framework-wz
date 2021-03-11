import { param2Obj } from 'utils';

const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin',
    name: 'Super Admin',
    uid: '001'
  },
  editor: {
    role: ['editor'],
    token: 'editor',
    name: 'Normal Editor',
    uid: '002'


  },
  developer: {
    role: ['develop'],
    token: 'develop',
    name: '工程师小王',
    uid: '003'
  }
}

export default {
  loginByEmail: config => {
    console.log('config: ', config);
    return 'hello3';
    // const { email } = JSON.parse(config.body);
    //   return userMap[email.split('@')[0]];
  },
  getInfo: config => {
    return userMap['admin'];
    // const { token } = param2Obj(config.url);
    // if (userMap[token]) {
    //   return userMap[token];
    // } else {
    //   return Promise.reject('a');
    // }
  },
  logout: () => 'success'
};
