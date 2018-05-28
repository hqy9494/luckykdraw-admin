export default {
  initialState: {
    title: "菜单详情",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "MenuManagerDetail",
      getProps: ["rts"]
    }
  ]
};
