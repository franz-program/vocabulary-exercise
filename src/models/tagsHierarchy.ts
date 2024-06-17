
export class TagsHierarchy {

  constructor(public hierarchy: Map<string, string[]> = new Map()) {
  }

  addToHierarchy(group: string, tags: string[]){
    if(this.hierarchy.has(group))
      this.hierarchy.get(group)?.push(...tags);
    else
      this.hierarchy.set(group, tags);
  }

  getTagGroup(tag: string): string{
    for(let key of this.hierarchy.keys()){
      if(this.hierarchy.get(key)?.includes(tag))
        return key;
    }
    return "others";
  }

  getGroupsKeys(): string[]{
    //sort putting "others" at the end
    let keys = Array.from(this.hierarchy.keys());
    keys.sort((a, b) => {
      if(a === "others")
        return 1;
      if(b === "others")
        return -1;
      return a.localeCompare(b);
    });
    return keys;
  }

  getTags(group: string): string[]{
    return this.hierarchy.get(group) || [];
  }

  static fromObject(obj: Record<string, string[]>): TagsHierarchy {
    const tagsHierarchy = new TagsHierarchy();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        tagsHierarchy.addToHierarchy(key, obj[key]);
      }
    }
    return tagsHierarchy;
  }
}
