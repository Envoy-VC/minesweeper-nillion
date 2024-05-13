import BackgroundImage from './background.webp';
import DefaultTile from './default_tile.svg';
import EightTile from './eight.svg';
import FiveTile from './five.svg';
import FlagTile from './flag.svg';
import FourTile from './four.svg';
import LogoText from './logo-text.png';
import Logo from './logo.svg';
import RedMineTile from './mine.svg';
import OneTile from './one.svg';
import MineTile from './overlay_mine.svg';
import SevenTile from './seven.svg';
import SixTile from './six.svg';
import ThreeTile from './three.svg';
import TwoTile from './two.svg';

const TILES = {
  default: DefaultTile,
  mine: MineTile,
  one: OneTile,
  two: TwoTile,
  three: ThreeTile,
  four: FourTile,
  five: FiveTile,
  six: SixTile,
  seven: SevenTile,
  eight: EightTile,
  flag: FlagTile,
  redMine: RedMineTile,
};

export { BackgroundImage, Logo, LogoText, TILES };
