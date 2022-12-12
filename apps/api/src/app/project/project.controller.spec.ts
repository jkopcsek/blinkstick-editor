import { Test, TestingModule } from '@nestjs/testing';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

describe('ProjectController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      const appController = app.get<ProjectController>(ProjectController);
      expect(appController.getProjects()).toEqual({ message: 'Welcome to api!' });
    });
  });
});
