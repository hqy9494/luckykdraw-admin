export default {
  initialState: {
    title: "补货员申请",
    breadcrumb: true
  },
  component: [
    {
      module: "ReplenishmenterApply",
      getProps: ["rts"]
    }
  ]
};
