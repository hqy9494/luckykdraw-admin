export default {
  initialState: {
    title: "用户列表",
    selectedKeys: "userList",
    openKeys: "buyTimesUser"
  },
  component: [
    {
      module: "UserList",
      getProps: ["rts"]
    }
  ]
};
