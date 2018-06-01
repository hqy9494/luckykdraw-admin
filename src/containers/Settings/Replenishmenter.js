export default {
  initialState: {
    title: "补货员",
    breadcrumb: true
  },
  component: [
    {
      module: "Replenishmenter",
      getProps: ["rts"]
    }
  ]
};
