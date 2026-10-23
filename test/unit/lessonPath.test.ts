import { lessonFileName } from '../../src/lessonPath';

describe('lessonFileName', () => {
  it('pads the lesson number to two digits', () => {
    expect(lessonFileName({ lesson: 1, slug: 'launch' })).toBe('01-launch');
    expect(lessonFileName({ lesson: 9, slug: 'navigation' })).toBe(
      '09-navigation',
    );
  });
});
