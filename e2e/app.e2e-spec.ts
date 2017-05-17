import { VvcOssPage } from './app.po';

describe('vvc-oss App', () => {
  let page: VvcOssPage;

  beforeEach(() => {
    page = new VvcOssPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
