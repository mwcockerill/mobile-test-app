import {
  generateMathProblem,
  generateRandomNumber,
  getRandomColor,
} from '../../src/utils';

// Tests
describe('Utility Functions', () => {
  describe('generateRandomNumber', () => {
    beforeEach(() => {
      // Mock Math.random to return predictable values
      jest.spyOn(Math, 'random').mockRestore();
    });

    it('returns number within default range 1-100', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = generateRandomNumber();
      expect(result).toBe(51); // 0.5 * (100-1+1) + 1 = Math.floor(50) + 1 = 51
    });

    it('returns number within custom range', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = generateRandomNumber(5, 15);
      expect(result).toBe(10); // 0.5 * (15-5+1) + 5 = Math.floor(5.5) + 5 = 10
    });

    it('returns integer values only', () => {
      for (let i = 0; i < 10; i++) {
        const result = generateRandomNumber(1, 100);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe('generateMathProblem', () => {
    it('returns object with a, b, and answer properties', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = generateMathProblem();

      expect(result).toHaveProperty('a');
      expect(result).toHaveProperty('b');
      expect(result).toHaveProperty('answer');
      expect(typeof result.a).toBe('number');
      expect(typeof result.b).toBe('number');
      expect(typeof result.answer).toBe('number');
    });

    it('generates numbers between 1-10', () => {
      for (let i = 0; i < 20; i++) {
        const result = generateMathProblem();
        expect(result.a).toBeGreaterThanOrEqual(1);
        expect(result.a).toBeLessThanOrEqual(10);
        expect(result.b).toBeGreaterThanOrEqual(1);
        expect(result.b).toBeLessThanOrEqual(10);
      }
    });

    it('calculates correct answer', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.3);
      const result = generateMathProblem();
      expect(result.answer).toBe(result.a + result.b);
    });
  });

  describe('getRandomColor', () => {
    it('returns one of the predefined colors', () => {
      const expectedColors = [
        '❤️ Red - Passionate',
        '💙 Blue - Calm',
        '💚 Green - Peaceful',
        '💛 Yellow - Happy',
        '💜 Purple - Creative',
      ];

      const result = getRandomColor();
      expect(expectedColors).toContain(result);
    });

    it('returns string type', () => {
      const result = getRandomColor();
      expect(typeof result).toBe('string');
    });

    it('returns different colors over multiple calls', () => {
      // Mock Math.random to return different values
      const mockValues = [0.0, 0.2, 0.4, 0.6, 0.8];
      let callIndex = 0;

      jest.spyOn(Math, 'random').mockImplementation(() => {
        const value = mockValues[callIndex % mockValues.length];
        callIndex++;
        return value;
      });

      const results = new Set();
      for (let i = 0; i < 5; i++) {
        results.add(getRandomColor());
      }

      // Should get all 5 different colors
      expect(results.size).toBe(5);
    });
  });
});
