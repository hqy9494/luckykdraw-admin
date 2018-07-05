export default {
    initialState: {
      title: "线索",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "Clue",
        getProps: ["rts"]
      }
    ]
  };
  