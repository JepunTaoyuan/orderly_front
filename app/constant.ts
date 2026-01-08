export enum PathEnum {
  Root = "/",
  Perp = "/perp",
  LandingPage = "/landingPage",
  Portfolio = "/portfolio",
  Positions = "/portfolio/positions",
  Orders = "/portfolio/orders",
  FeeTier = "/portfolio/fee",
  Assets = "/portfolio/assets",
  ApiKey = "/portfolio/api-key",
  Setting = "/portfolio/setting",
  History = "/portfolio/history",
  Swap = "/swap",
  Markets = "/markets",
  Leaderboard = "/leaderboard",

  Rewards = "/rewards",
  RewardsTrading = "/rewards/trading",
  RewardsAffiliate = "/rewards/affiliate",

  Strategy = "/strategy",

  Vaults = "/Vaults",
}

export const PageTitleMap = {
  [PathEnum.LandingPage]: "landingPage",
  [PathEnum.Portfolio]: "Portfolio",
  [PathEnum.FeeTier]: "Fee tier",
  [PathEnum.ApiKey]: "API keys",
  [PathEnum.Orders]: "Orders",
  [PathEnum.Assets]: "Assets",
  [PathEnum.Positions]: "Positions",
  [PathEnum.Setting]: "Settings",
  [PathEnum.Swap]: "Swap",
  [PathEnum.History]: "History",
  [PathEnum.Markets]: "Markets",
  [PathEnum.Leaderboard]: "Leaderboard",
  [PathEnum.RewardsTrading]: "Trading Rewards",
  [PathEnum.RewardsAffiliate]: "Affiliate program",
  [PathEnum.Strategy]: "Strategy",
  [PathEnum.Vaults]: "Vaults",
};
