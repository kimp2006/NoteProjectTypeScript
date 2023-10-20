/* eslint-disable */
export class Note{

  private _id: number;
  private _title: string ;
  private _body: string;

  constructor(title: string, body: string) {
    this._id = -1
    this._body = body;
    this._title = title
  }

  get body(): string {
    return this._body;
  }

  set body(value: string) {
    this._body = value;
  }
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }



}
