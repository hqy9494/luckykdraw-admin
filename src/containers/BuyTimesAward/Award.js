export default {
  initialState: {
    title: "奖品列表",
    // subTitle: [{ display: "主 页" }],
    selectedKeys: "award",
    openKeys: "buyTimesUser"
  },
  component: [
    {
      module: "Award",
      getProps: ["rts"]
    }
  ]
};
