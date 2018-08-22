export default {
  initialState: {
    title: "派发列表",
    selectedKeys: "awardRecord",
    openKeys: "buyTimesUser"
  },
  component: [
    {
      module: "AwardRecord",
      getProps: ["rts"]
    }
  ]
};
