//create a class

export class Word {
  constructor(public from: string, public to: string[],
              public tags: string[], public insertedAt: Date){
  }

  static fromJson(json: any): Word {
    return new Word(json.from, json.to, json.tags, new Date(json.insertedAt));
  }

}
