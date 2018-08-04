export default {
  initialState: {
    title: "区域管理",
    // subTitle: [{ display: "主 页" }],
    selectedKeys: "regions",
    openKeys: "index"
  },
  component: [
    {
      module: "Region",
      getProps: ["rts", "match"]
    }
  ]
};
