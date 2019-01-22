const isMatchingRoute = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url && req.url != route.url) return false;
  return true;
};

class Framework {
  constructor() {
    this.routes = [];
  }

  handler(req, res) {
    let matchingRoutes = this.routes.filter(isMatchingRoute.bind(null, req));
    let next = () => {
      let current = matchingRoutes[0];
      if (!current) return;
      matchingRoutes.shift();
      current.handler(req, res, next);
    };
    next();
  }

  use(handler) {
    this.routes.push({ handler });
  }
  get(url, handler) {
    this.routes.push({ url, method: "GET", handler });
  }
  post(url, handler) {
    this.routes.push({ url, method: "POST", handler });
  }
}

module.exports = Framework;
