export default {
    initialState: {
      title: "角色详情",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "RoleManagerDetail",
        getProps: ["rts"]
      }
    ]
  };
  