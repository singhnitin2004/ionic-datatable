export class PaginationButton {

  public label: any;
  public page: number;
  public active: boolean;

  constructor(label: any, pageNumber: number, active: boolean) {
    this.label = label;
    this.page = pageNumber;
    this.active = active;
  }
}
