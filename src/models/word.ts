//create a class

export class Word {
  constructor(public from: string, public to: string[],
              public tags: string[], public insertedAt: number, public classType: string, public wronglyGuessed: number = 0){
  }

  static fromJson(json: any, classType: string): Word {
    return new Word(json.from, json.to, json.tags, new Date(json["inserted-at"]).getTime() / 1000.0, classType);
  }

}
