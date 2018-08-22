export default {
  initialState: {
    title: "购买列表",
    selectedKeys: "userList",
    openKeys: "buyTimesUser"
  },
  component: [
    {
      module: "UserBuyList",
      getProps: ["rts"]
    }
  ]
};
