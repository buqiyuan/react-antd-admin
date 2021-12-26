import { makeAutoObservable } from 'mobx';

export type TagItem = {
  id: string;

  title:
    | {
        zh_CN: string;
        en_US: string;
      }
    | string;

  /** tag's route path */
  path: string;

  /** can be closed ? */
  closable: boolean;
};

export const tagsViewStore = makeAutoObservable({
  activeTagId: '' as TagItem['id'],
  tags: [] as TagItem[],
  setActiveTag(activeTagId: string) {
    this.activeTagId = activeTagId;
  },
  addTag(tagItem: TagItem) {
    if (!this.tags.find(tag => tag.id === tagItem.id)) {
      this.tags.push(tagItem);
    }

    this.activeTagId = tagItem.id;
  },
  removeTag(targetKey: string) {
    // dashboard cloud't be closed
    if (targetKey === this.tags[0].id) {
      return;
    }

    const activeTagId = this.activeTagId;
    const currentIndex = this.tags.findIndex(n => n.id === targetKey);
    const lastIndex = currentIndex - 1;
    this.tags.splice(currentIndex, 1);

    if (this.tags.length && activeTagId === targetKey) {
      if (lastIndex >= 0) {
        this.activeTagId = this.tags[lastIndex].id;
      } else {
        this.activeTagId = this.tags[0].id;
      }
    }
  },
  removeAllTag() {
    this.activeTagId = this.tags[0].id;
    this.tags = [this.tags[0]];
  },
  removeOtherTag() {
    const activeTag = this.tags.find(tag => tag.id === this.activeTagId);
    const activeIsDashboard = activeTag!.id === this.tags[0].id;

    this.tags = activeIsDashboard ? [this.tags[0]] : [this.tags[0], activeTag!];
  }
});

export default tagsViewStore;
