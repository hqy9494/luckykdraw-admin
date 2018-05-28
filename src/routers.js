export default {
  home: {
    module: "",
    path: "/",
    redirect: "/dashboard",
    subs: {
      //主页
      dashboard: {
        path: "dashboard",
        module: "Indexs",
        component: "Index",
        title: "主页"
      },
      //设置
      staffManager: {
        path: "setting/staffManager",
        module: "Setting",
        component: "StaffManager",
        title: "员工管理",
        subs: {
          staffManagerAdd: {
            path: "/add",
            module: "Setting",
            component: "StaffManagerAdd",
            title: "新建员工"
          },
          staffManagerDetail: {
            path: "/detail/:id",
            module: "Setting",
            component: "StaffManagerDetail",
            title: "员工详情"
          }
        }
      },
      roleManager: {
        path: "setting/roleManager",
        module: "Setting",
        component: "RoleManager",
        title: "角色管理",
        subs: {
          roleManagerAdd: {
            path: "/add",
            module: "Setting",
            component: "RoleManagerAdd",
            title: "新建角色"
          },
          roleManagerDetail: {
            path: "/detail/:id",
            module: "Setting",
            component: "RoleManagerDetail",
            title: "角色详情"
          }
        }
      },
      menuManager: {
        path: "setting/menuManager",
        module: "Setting",
        component: "MenuManager",
        title: "菜单管理",
        subs: {
          menuManagerAdd: {
            path: "/add",
            module: "Setting",
            component: "MenuManagerAdd",
            title: "新建菜单"
          },
          menuManagerDetail: {
            path: "/detail/:id",
            module: "Setting",
            component: "MenuManagerDetail",
            title: "菜单详情"
          }
        }
      },
      apiManager: {
        path: "setting/apiManager",
        module: "Setting",
        component: "ApiManager",
        title: "接口管理",
        subs: {
          apiManagerDetail: {
            path: "/detail/:id",
            module: "Setting",
            component: "ApiManagerDetail",
            title: "接口详情"
          }
        }
      }
    }
  }
};
