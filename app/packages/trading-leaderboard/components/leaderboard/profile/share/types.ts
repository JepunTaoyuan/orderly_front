export interface PointsShareData {
  season: string;
  rank: number | string;
  totalPoints: number | string;
  volume: number | string;
  pnl: number | string;
  message: string;
  date: string;
  backgroundImage: string;
  characterImage: string;
}

export interface PointsDrawOptions {
  data: PointsShareData;
  width?: number;
  height?: number;
  ratio?: number;
  fontFamily?: string;
}
