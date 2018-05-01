import Region from './Region';

export default class Section {
  public regions: Region[] = [];
  public add(region: Region) {
    this.regions.push(region);
  }
}
