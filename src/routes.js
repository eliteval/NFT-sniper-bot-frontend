import Login from "views/pages/Login.js";
import User from "views/pages/User.js";
import Register from "views/pages/Register.js";
import NFTSniperBot from "views/Sniper/NFTSniperBot";

import TrendingCollections from "views/pages/analytic/TrendingCollections";
import TopCollections from "views/pages/analytic/TopCollections";
import ContractInfo from "views/pages/analytic/ContractInfo";
import Search from "views/pages/analytic/Search";
import PancakeOneToken from "views/Sniper/PancakeOneToken";
import UniswapOneToken from "views/Sniper/UniswapOneToken";
import PresaleSnipper from "views/Sniper/PresaleSnipper";
import Swing from "views/Sniper/Swing";
import Authorization from "views/pages/admin/Authorization";
import Bots from "views/pages/admin/Bots";
import Wallets from "views/pages/admin/Wallets";
import Setting from "views/pages/admin/Setting";

const routes = [
  {
    path: "/login",
    name: "Login",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: Login,
    layout: "/auth",
    hidden: true,
  },
  {
    path: "/register",
    name: "Register",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: Register,
    layout: "/auth",
    hidden: true,
  },
  {
    path: "/trending-collections",
    name: "Trending Collections",
    rtlName: "",
    icon: "tim-icons icon-chart-bar-32",
    component: TrendingCollections,
    layout: "/bot",
    blockAT: true, //use when admin blocks this tab
  },
  // {
  //   path: "/top-collections",
  //   name: "Top Collections",
  //   rtlName: "",
  //   icon: "tim-icons icon-chart-bar-32",
  //   component: TopCollections,
  //   layout: "/bot",
  //   blockAT: true, //use when admin blocks this tab
  // },
  {
    path: "/search",
    name: "Search Contract",
    rtlName: "",
    icon: "tim-icons icon-chart-bar-32",
    component: Search,
    layout: "/bot",
    hidden: true, //use when need to hide item in sidebar
  },
  {
    path: "/contract/:address/:type?",
    name: "Contract Information",
    rtlName: "",
    icon: "tim-icons icon-chart-bar-32",
    component: ContractInfo,
    layout: "/bot",
    hidden: true, //use when need to hide item in sidebar
  },
  {
    path: "/nft_bot/:address?",
    realPath: "/nft_bot", //use when react-route path is different from sidebar menu item link
    name: "NFT Sniper Bots",
    rtlName: "",
    icon: "tim-icons icon-spaceship",
    component: NFTSniperBot,
    layout: "/bot",
  },
  // {
  //   path: "/pancake_one",
  //   name: "Pancake Snippers",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-spaceship",
  //   component: PancakeOneToken,
  //   layout: "/bot"
  // },
  // {
  //   path: "/uniswap_one",
  //   name: "Uniswap Snippers",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-spaceship",
  //   component: UniswapOneToken,
  //   layout: "/bot"
  // },
  // {
  //   path: "/presale",
  //   name: "Presale bot",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-spaceship",
  //   component: PresaleSnipper,
  //   layout: "/bot"
  // },
  // {
  //   path: "/swing",
  //   name: "Swing bot",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-spaceship",
  //   component: Swing,
  //   layout: "/bot"
  // },

  {
    path: "/settings",
    name: "Account Settings",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-key-25",
    component: User,
    layout: "/bot",
  },
  {
    collapse: true,
    name: "Admin Panel",
    rtlName: "صفحات",
    icon: "tim-icons icon-paper",
    state: "adminCollapse",
    isManager: true, //use when item is for admin
    views: [
      {
        path: "/admin/wallets",
        name: "Wallets",
        rtlName: "لوحة القيادة",
        mini: "W",
        component: Wallets,
        layout: "/bot",
      },
      {
        path: "/admin/bots",
        name: "Bots",
        rtlName: "لوحة القيادة",
        mini: "B",
        component: Bots,
        layout: "/bot",
      },
      {
        path: "/admin/autorization",
        name: "Authorization",
        rtlName: "لوحة القيادة",
        mini: "A",
        component: Authorization,
        layout: "/bot",
      },
      {
        path: "/admin/settings",
        name: "Settings",
        rtlName: "لوحة القيادة",
        mini: "S",
        component: Setting,
        layout: "/bot",
      },
    ],
  },
];

export default routes;
