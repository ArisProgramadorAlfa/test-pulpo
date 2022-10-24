import { RankingIATIUsecase } from '../usecase';
import { Country } from '../../db/postgres';
import { CountryCrud } from '../crud';
import supertest from 'supertest';



describe('Test create ranking use case', () => {
  beforeEach(async () => {
    const countryCrud: CountryCrud= new CountryCrud();
    const countries: Country[] = await countryCrud.createMany([{
      code: 'USA',
      name: 'Estados unidos'
    }, {
      code: 'MX',
      name: 'México'
    }, {
      code: 'AR',
      name: 'Argentina'
    }, {
      code: 'SD',
      name: 'Sudan'
    }]);
  });
    
    
  const rankingUseCase: RankingIATIUsecase = new RankingIATIUsecase();
  it('Should return ranking and save in data base', async () => {
    const countryCode: string = 'SU';
    const limitYears: number = 2;
    const ranking = await rankingUseCase.createRanking(countryCode, limitYears);
    expect(ranking).toBeTruthy();
  });
});
