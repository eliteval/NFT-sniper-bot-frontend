const apiConfig = {
  authenticate: { url: '/api/authenticate', method: 'post' },
  register: { url: '/api/register', method: 'post' },
  changePassword: { url: '/api/change-password', method: 'post' },
 //nft
 nft_addBot: { url: '/api/nft/addBot', method: 'post' },
 nft_delBot: { url: '/api/nft/delBot', method: 'post' },
 nft_readPlan: { url: '/api/nft/readPlan', method: 'post' },
 nft_letSell: { url: '/api/nft/letSell', method: 'post' },
 nft_letApprove: { url: '/api/nft/letApprove', method: 'post' },
 nft_letDel: { url: '/api/nft/letDel', method: 'post' },
 //pancake
 pan_addBot: { url: '/api/pan/addBot', method: 'post' },
 pan_delBot: { url: '/api/pan/delBot', method: 'post' },
 pan_readPlan: { url: '/api/pan/readPlan', method: 'post' },
 pan_letSell: { url: '/api/pan/letSell', method: 'post' },
 pan_letApprove: { url: '/api/pan/letApprove', method: 'post' },
 pan_letDel: { url: '/api/pan/letDel', method: 'post' },
 //uniswap
 uni_addBot: { url: '/api/uni/addBot', method: 'post' },
 uni_delBot: { url: '/api/uni/delBot', method: 'post' },
 uni_readPlan: { url: '/api/uni/readPlan', method: 'post' },
 uni_letSell: { url: '/api/uni/letSell', method: 'post' },
 uni_letApprove: { url: '/api/uni/letApprove', method: 'post' },
 uni_letDel: { url: '/api/uni/letDel', method: 'post' },
  //presale
  pre_add: { url: '/api/pre/add', method: 'post' },
  pre_read: { url: '/api/pre/read', method: 'post' },
  pre_del: { url: '/api/pre/del', method: 'post' },
  //swingsale
  swing_add: { url: '/api/swing/add', method: 'post' },
  swing_read: { url: '/api/swing/read', method: 'post' },
  swing_del: { url: '/api/swing/del', method: 'post' },
};

export default apiConfig;
