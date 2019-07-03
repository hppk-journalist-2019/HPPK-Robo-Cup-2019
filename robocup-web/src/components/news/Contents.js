import { Doc } from 'tiptap'
export default class CustomContents extends Doc {
  get schema() {
    return {
      content: 'title block+',
    }
  }
}