import { Test } from '@nestjs/testing';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ProjectService],
    }).compile();

    service = app.get<ProjectService>(ProjectService);
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      expect(service.getProjects()).toEqual({ message: 'Welcome to api!' });
    });
  });
});
