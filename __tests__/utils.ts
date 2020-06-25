import { pickMediaMatch } from '../src/utils';

describe('utils', () => {
  describe('rules', () => {
    it('pickMediaMatch - all true - picks first', () => {
      expect(
        pickMediaMatch(
          {
            server: false,
            client: false,
          },
          {
            server: true,
            client: true,
          },
          {
            server: 'server',
            client: 'client',
          }
        )
      ).toBe('server');
    });

    it('pickMediaMatch - all false - defaults to last', () => {
      expect(
        pickMediaMatch(
          {
            server: false,
            client: false,
          },
          {
            server: false,
            client: false,
          },
          {
            server: 'server',
            client: 'client',
          }
        )
      ).toBe('client');
    });
  });
});
