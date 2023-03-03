const API_PATHS = {
  product: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  bff: import.meta.env.PROD ? "https://o9d9c1n5zd.execute-api.us-east-1.amazonaws.com/dev" : "http://localhost:3001/dev",
  cart: "https://.execute-api.eu-west-1.amazonaws.com/dev",
};

export default API_PATHS;
