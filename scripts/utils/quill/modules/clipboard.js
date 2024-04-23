import Parchment from 'parchment';
import Quill from '../../../../node_modules/quill/core/quill';
import Delta from 'quill-delta';
import Clipboard from '../../../../node_modules/quill/modules/clipboard';

class PlainClipboard extends Clipboard {
  onPaste (e) {
    e.preventDefault()
    const range = this.quill.getSelection()
    const text = e.clipboardData.getData('text/plain')
    const delta = new Delta()
    .retain(range.index)
    .delete(range.length)
    .insert(text)
    const index = text.length + range.index
    const length = 0
    this.quill.updateContents(delta, 'user')
    this.quill.setSelection(index, length, 'silent')
    this.quill.scrollIntoView()
  }
}

export default PlainClipboard