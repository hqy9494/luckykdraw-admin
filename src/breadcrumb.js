import routerConfig from "./routers";

let routers = [];

const breadcrumb = (obj, path = "/", pid) => {
  for (let key in obj) {
    let id = routers.length + 1;
    routers.push(
      Object.assign(
        {},
        {
          path: path + obj[key].path,
          title: obj[key].title,
          id
        },
        pid && { pid }
      )
    );
    if (obj[key]["subs"]) {
      breadcrumb(obj[key]["subs"], path + obj[key].path, id);
    }
  }
};

breadcrumb(routerConfig.home.subs);

export default routers;
