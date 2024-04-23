import Quill from '../../../node_modules/quill./../../node_modules/quill/core';

import { AlignClass, AlignStyle } from '../../../node_modules/quill./../../node_modules/quill/formats/align';
//import { DirectionAttribute, DirectionClass, DirectionStyle } from '../../../node_modules/quill./../../node_modules/quill/formats/direction';
import { IndentClass as Indent } from '../../../node_modules/quill./../../node_modules/quill/formats/indent';

import Blockquote from '../../../node_modules/quill./../../node_modules/quill/formats/blockquote';
import Header from './formats/header';
import List, { ListItem } from '../../../node_modules/quill./../../node_modules/quill/formats/list';
import { TransformClass, TransformStyle } from './formats/transform';

import { BackgroundClass, BackgroundStyle } from './formats/background';
import { ColorClass, ColorStyle } from './formats/color';
import { FontClass, FontStyle } from '../../../node_modules/quill/formats/font';
import { SizeClass, SizeStyle } from '../../../node_modules/quill/formats/size';

import Bold from '../../../node_modules/quill/formats/bold';
import Italic from '../../../node_modules/quill/formats/italic';
import Link from './formats/link';
import Strike from '../../../node_modules/quill/formats/strike';
import Underline from '../../../node_modules/quill/formats/underline';

import Toolbar from './toolbar';
import History from './modules/history';

import Icons from '../../../node_modules/quill/ui/icons';
import Picker from '../../../node_modules/quill/ui/picker';
import ColorPicker from './ui/color-picker';
import IconPicker from '../../../node_modules/quill/ui/icon-picker';
import Tooltip from '../../../node_modules/quill/ui/tooltip';
import PlainClipboard from './modules/clipboard'
import SnowTheme from './theme';

delete SizeClass.whitelist;
delete SizeStyle.whitelist;
delete FontStyle.whitelist;

Quill.register({

  'attributors/class/align': AlignClass,
  'attributors/class/background': BackgroundClass,
  'attributors/class/color': ColorClass,
  'attributors/class/font': FontClass,
  'attributors/class/size': SizeClass,
	'attributors/style/transform': TransformStyle,
  'attributors/style/align': AlignStyle,
  'attributors/style/background': BackgroundStyle,
  'attributors/style/color': ColorStyle,
  'attributors/style/font': FontStyle,
  'attributors/style/size': SizeStyle
}, true);


Quill.register({
  'formats/align': AlignStyle,
 // 'formats/direction': DirectionClass,
  'formats/indent': Indent,
	'formats/transform': TransformStyle,
  'formats/background': BackgroundClass,
  'formats/color': ColorClass,
  'formats/font': FontStyle,
  'formats/size': SizeClass,

  'formats/blockquote': Blockquote,
  'formats/header': Header,
  'formats/list': List,

  'formats/bold': Bold,
  //'formats/code': InlineCode,
  'formats/italic': Italic,
  'formats/link': Link,
  //'formats/script': Script,
  'formats/strike': Strike,
  'formats/underline': Underline,


 // 'formats/list/item': ListItem,

  //'modules/syntax': Syntax,
  'modules/toolbar': Toolbar,
  'modules/history'    : History,
  'themes/snow': SnowTheme,

  'ui/icons': Icons,
  'ui/picker': Picker,
  'ui/icon-picker': IconPicker,
  'ui/color-picker': ColorPicker,
  'ui/tooltip': Tooltip,
  'modules/clipboard':PlainClipboard
  
}, true);
module.exports = Quill;
