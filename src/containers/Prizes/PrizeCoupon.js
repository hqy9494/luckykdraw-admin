export default {
  initialState: {
    title: "优惠券",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PrizeCoupon",
      getProps: ["rts"]
    }
  ]
};
