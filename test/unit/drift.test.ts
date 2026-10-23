import fs from 'fs';
import path from 'path';
import { SCREENS } from '../../src/screens';
import { lessonFileName } from '../../src/lessonPath';

const root = path.join(__dirname, '../..');
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file: string) => fs.existsSync(path.join(root, file));

const sourceText = (dir: string): string =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .map(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return sourceText(full);
      }
      return entry.name.endsWith('.tsx') ? fs.readFileSync(full, 'utf8') : '';
    })
    .join('\n');

const src = sourceText(path.join(root, 'src'));

// A selector id exists if it appears as a literal testID, or starts with the
// fixed prefix of a template testID such as testID={`list-item-${n}`}.
const templatePrefixes = [...src.matchAll(/testID=\{`([^`$]*)\$\{/g)].map(
  m => m[1],
);
const hasTestID = (id: string) =>
  src.includes(`testID="${id}"`) ||
  templatePrefixes.some(prefix => id.startsWith(prefix));

describe.each(SCREENS)('lesson $lesson ($slug)', screen => {
  const name = lessonFileName(screen);

  it('has a lesson that names the screen', () => {
    expect(exists(`lessons/${name}.md`)).toBe(true);
    expect(read(`lessons/${name}.md`)).toContain(screen.title);
  });

  it.each(['android', 'ios'])('has a %s solution', platform => {
    const file = `solutions/${platform}/${name}.yaml`;
    expect(exists(file)).toBe(true);
    expect(read(file).startsWith('appId: com.mobiletestapp')).toBe(true);
  });

  it.each(['android', 'ios'])(
    '%s solution only uses ids that exist in the app',
    platform => {
      const file = `solutions/${platform}/${name}.yaml`;
      const ids = [...read(file).matchAll(/id: "([^"]+)"/g)].map(m => m[1]);
      expect(ids.filter(id => !hasTestID(id))).toEqual([]);
    },
  );
});
