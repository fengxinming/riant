import sleep from 'celia/sleep';

export const columns = [ {
  dataIndex: 'name',
  title: '姓名'
},{
  dataIndex: 'gender',
  title: '性别'
},{
  dataIndex: 'city',
  title: '城市'
},{
  dataIndex: 'sign',
  title: '签名'
},{
  dataIndex: 'integral',
  title: '积分'
},{
  dataIndex: 'occupation',
  title: '职位'
},{
  dataIndex: 'wealth',
  title: '财富'
} ];

export function query() {
  return sleep(400).then(() => ({
    page: {},
    items: repeat(
      {
        id: 10000,
        name: 'user',
        gender: 1,
        city: '城市',
        sign: '签名',
        integral: 100,
        occupation: '作家',
        wealth: 1000000
      },
      1000
    )
  }));
}

function repeat(obj, times = 1) {
  const arr = [];
  for (let i = 0; i < times; i++) {
    const n = Object.assign({}, obj);
    n.id += i;
    n.name = `${n.name}-${i}`;
    n.gender = [ '男', '女' ][Math.round(Math.random() * n.gender)];
    n.city = `${n.city}-${i}`;
    n.sign = `${n.sign}-${i}`;
    n.integral = Math.random() * n.integral >>> 0;
    n.wealth = Math.random() * n.wealth >>> 0;
    n.occupation = [ '作家', '诗人', '科学家', '医生' ][
      (Math.random() * 4) >>> 0
    ];
    arr[i] = n;
  }
  return arr;
}
