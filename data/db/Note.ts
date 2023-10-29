/* eslint-disable */
export class Note{

  private _id: number = 0;
  private _title: string ;
  private _body: string;

  constructor(title: string, body: string) {
    this._id = -1
    this._body = body;
    this._title = title
    this._version = 0;
    this._updateDate = Date();
    this._createDate = Date();
    this._isDeleted = false;
    this._isSynchronized = true;
  }

  private _version: number;

  get version(): number {
    return this._version;
  }

  set version(value: number) {
    this._version = value;
  }

  private _isSynchronized: boolean;

  get isSynchronized(): boolean {
    return this._isSynchronized;
  }

  set isSynchronized(value: boolean) {
    this._isSynchronized = value;
  }

  private _updateDate: string;

  get updateDate(): string {
    return this._updateDate;
  }

  set updateDate(value: string) {
    this._updateDate = value;
  }

  private _createDate: string;

  get createDate(): string {
    return this._createDate;
  }

  set createDate(value: string) {
    this._createDate = value;
  }

  private _isDeleted: boolean;

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  set isDeleted(value: boolean) {
    this._isDeleted = value;
  }

  set body(value: string) {
    if (value !== this._body) {
      this.incVersion();
      this._body = value;
      this.updateDate = Date();
      this.isSynchronized = false;
    }
  }

  set title(value: string) {
    if (value !== this._title) {
      this.incVersion();
      this.updateDate = Date();
      this.isSynchronized = false;
      this._title = value;
    }
  }

  get body(): string {
    return this._body;
  }

  changeSyncStatus() {
    this._isSynchronized = !this._isSynchronized;
  }
  get title(): string {
    return this._title;
  }

  incVersion() {
    this._version = this.version + 1;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
}
