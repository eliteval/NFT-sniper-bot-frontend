// import Wallet from "views/pages/Wallet.js";
import Login from "views/pages/Login.js";
import User from "views/pages/User.js";
import Register from "views/pages/Register.js";
// import Buttons from "views/components/Buttons";
import PancakeOneToken from "views/Sniper/PancakeOneToken";
import UniswapOneToken from "views/Sniper/UniswapOneToken";
import PresaleSnipper from "views/Sniper/PresaleSnipper";
import Swing from "views/Sniper/Swing";
const routes = [
  // {
  //   path: "/uniswap_one",
  //   name: "Uniswap Snippers",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-spaceship",
  //   component: UniSwapOneToken,
  //   layout: "/bot"
  // },
  {
    path: "/pancake_one",
    name: "Pancake Snippers",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-spaceship",
    component: PancakeOneToken,
    layout: "/bot"
  },
  {
    path: "/uniswap_one",
    name: "Uniswap Snippers",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-spaceship",
    component: UniswapOneToken,
    layout: "/bot"
  },
  {
    path: "/presale",
    name: "Presale bot",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-spaceship",
    component: PresaleSnipper,
    layout: "/bot"
  },
  {
    path: "/swing",
    name: "Swing bot",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-spaceship",
    component: Swing,
    layout: "/bot"
  },
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
    name: "Settings",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-key-25",
    component: User,
    layout: "/bot"
  },
  // {
  //   path: "/wallet",
  //   name: "Wallet",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-key-25",
  //   component: Wallet,
  //   layout: "/bot"
  // },
];

export default routes;
