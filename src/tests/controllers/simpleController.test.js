const mockingoose = require('mockingoose');
const { mockRequest, mockResponse, mockNext } = require('../support/requestHelpers');
const AbilityScore = require('../../models/abilityScore');
const SimpleController = require('../../controllers/simpleController');

let response;
let simpleController;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
  simpleController = new SimpleController(AbilityScore);
});

describe('index', () => {
  const findDoc = [
    {
      index: 'str',
      name: 'STR',
      url: '/api/ability-scores/str',
    },
    {
      index: 'dex',
      name: 'DEX',
      url: '/api/ability-scores/dex',
    },
    {
      index: 'con',
      name: 'CON',
      url: '/api/ability-scores/con',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(AbilityScore).toReturn(findDoc, 'find');

    await simpleController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(AbilityScore).toReturn(error, 'find');

      await simpleController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'str',
    name: 'STR',
    url: '/api/ability-scores/str',
  };

  const showParams = { index: 'str' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(AbilityScore).toReturn(findOneDoc, 'findOne');

    await simpleController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(AbilityScore).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await simpleController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(AbilityScore).toReturn(error, 'findOne');

      await simpleController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
