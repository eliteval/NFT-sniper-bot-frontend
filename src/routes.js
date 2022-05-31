import Login from "views/pages/Login.js";
import User from "views/pages/User.js";
import Register from "views/pages/Register.js";
// import Buttons from "views/components/Buttons";
import NFTSniperBot from "views/Sniper/NFTSniperBot";
import PancakeOneToken from "views/Sniper/PancakeOneToken";
import UniswapOneToken from "views/Sniper/UniswapOneToken";
import PresaleSnipper from "views/Sniper/PresaleSnipper";
import Swing from "views/Sniper/Swing";
import Dashboard from "views/pages/Dashboard.js";
import Analysis from "views/pages/Analysis.js";
import ContractInfo from "views/pages/ContractInfo.js";
const routes = [
  {
    path: "/analysis",
    name: "NFT Analysis",
    rtlName: "",
    icon: "tim-icons icon-chart-bar-32",
    component: Analysis,
    layout: "/bot",
  },
  {
    path: "/contract/:address",
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
    path: "/login",
    name: "Login",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: Register,
    layout: "/auth",
  },
  {
    path: "/settings",
    name: "Account Settings",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-key-25",
    component: User,
    layout: "/bot",
  },
  {
    path: "/dashboard",
    name: "Adminpanel",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-paper",
    component: Dashboard,
    layout: "/bot",
    forAdmin: true, //use when item is for admin
  },
];

export default routes;
