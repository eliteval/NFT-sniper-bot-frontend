const apiConfig = {
  authenticate: { url: "/api/authenticate", method: "post" },
  register: { url: "/api/register", method: "post" },
  changePassword: { url: "/api/change-password", method: "post" },
  //nft
  nft_addBot: { url: "/api/nft/addBot", method: "post" },
  nft_delBot: { url: "/api/nft/delBot", method: "post" },
  nft_readPlan: { url: "/api/nft/readPlan", method: "post" },
  nft_readLog: { url: "/api/nft/readLog", method: "post" },
  nft_letSell: { url: "/api/nft/letSell", method: "post" },
  nft_letApprove: { url: "/api/nft/letApprove", method: "post" },
  nft_letDel: { url: "/api/nft/letDel", method: "post" },
  nft_readAllPlans: { url: "/api/nft/readAllPlans", method: "post" },
  nft_readAllLogs: { url: "/api/nft/readAllLogs", method: "post" },
  nft_getContractInfo: { url: "/api/nft/getContractInfo", method: "post" },
  //pancake
  pan_addBot: { url: "/api/pan/addBot", method: "post" },
  pan_delBot: { url: "/api/pan/delBot", method: "post" },
  pan_readPlan: { url: "/api/pan/readPlan", method: "post" },
  pan_letSell: { url: "/api/pan/letSell", method: "post" },
  pan_letApprove: { url: "/api/pan/letApprove", method: "post" },
  pan_letDel: { url: "/api/pan/letDel", method: "post" },
  //uniswap
  uni_addBot: { url: "/api/uni/addBot", method: "post" },
  uni_delBot: { url: "/api/uni/delBot", method: "post" },
  uni_readPlan: { url: "/api/uni/readPlan", method: "post" },
  uni_letSell: { url: "/api/uni/letSell", method: "post" },
  uni_letApprove: { url: "/api/uni/letApprove", method: "post" },
  uni_letDel: { url: "/api/uni/letDel", method: "post" },
  //presale
  pre_add: { url: "/api/pre/add", method: "post" },
  pre_read: { url: "/api/pre/read", method: "post" },
  pre_del: { url: "/api/pre/del", method: "post" },
  //swingsale
  swing_add: { url: "/api/swing/add", method: "post" },
  swing_read: { url: "/api/swing/read", method: "post" },
  swing_del: { url: "/api/swing/del", method: "post" },
  //wallets
  getWallet: { url: "/api/wallet/read", method: "post" },
  lockWallet: { url: "/api/wallet/lock", method: "post" },
  adminWallet: { url: "/api/wallet/admin", method: "post" },
  //authorization
  readAuthoriztion: { url: "/api/authorization/read", method: "post" },
  addAuthoriztion: { url: "/api/authorization/add", method: "post" },
  deleteAuthorization: { url: "/api/authorization/delete", method: "post" },
  //setting
  read_setting: { url: "/api/setting/read", method: "post" },
  update_setting: { url: "/api/setting/update", method: "post" },
  delete_setting: { url: "/api/setting/delete", method: "post" },
  //icy
  getTrendingCollections: {
    url: "/api/icy/getTrendingCollections",
    method: "post",
  },
  getContractInfo: { url: "/api/icy/getContractInfo", method: "post" },
  searchContracts: { url: "/api/icy/searchContracts", method: "post" },
  getTrades: { url: "/api/icy/getTrades", method: "post" },
  getTokens: { url: "/api/icy/getTokens", method: "post" },
  getTraits: { url: "/api/icy/getTraits", method: "post" },
  getHolders: { url: "/api/icy/getHolders", method: "post" },
  getNerdBooks: { url: "/api/icy/getNerdBooks", method: "post" },
  getNerdTrades: { url: "/api/icy/getNerdTrades", method: "post" },
};

export default apiConfig;
