//create a class

export class Word {
  constructor(public from: string, public to: string[],
              public tags: string[], public insertedAt: Date, public classType: string){
  }

  static fromJson(json: any, classType: string): Word {
    return new Word(json.from, json.to, json.tags, new Date(json.insertedAt), classType);
  }

}
